-- Modify Alert table to match frontend requirements
ALTER TABLE Alert
ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'Stock Update',
ADD COLUMN severity VARCHAR(20) NOT NULL DEFAULT 'Low',
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'Open',
ADD COLUMN acknowledged_by INT,
ADD COLUMN acknowledged_date DATETIME,
ADD COLUMN action_required VARCHAR(255),
ADD COLUMN estimated_impact VARCHAR(255),
ADD COLUMN is_system_generated BOOLEAN DEFAULT true,
ADD FOREIGN KEY (acknowledged_by) REFERENCES Users(user_id);

-- Insert sample alerts data
INSERT INTO Alert (
    inventory_stock_id,
    type,
    severity,
    alert_message,
    status,
    action_required,
    estimated_impact,
    is_system_generated
) VALUES 
(4, 'Low Stock', 'Critical', '.50 BMG ammunition below minimum threshold (45/100)', 'Open', 
'Immediate restocking required', 'High - Training operations may be affected', true),

(2, 'Low Stock', 'High', '7.62mm NATO ammunition below minimum threshold (150/200)', 'Open',
'Schedule restocking within 48 hours', 'Medium - May affect upcoming exercises', true),

(3, 'Expiry Warning', 'Medium', '9mm Parabellum ammunition expires in 30 days (2024-03-15)', 'Acknowledged',
'Plan usage or disposal before expiry', 'Low - Sufficient time for action', true),

(1, 'Stock Update', 'Low', '5.56mm NATO ammunition successfully restocked (+1000 rounds)', 'Resolved',
'No action required', 'Positive - Stock levels restored', true),

(NULL, 'Security Alert', 'Critical', 'Multiple failed login attempts detected for user: unknown_user', 'Acknowledged',
'Monitor security logs and review access controls', 'High - Potential security breach attempt', true);

-- Create a view to get detailed alert information with related data
CREATE OR REPLACE VIEW AlertDetails AS
SELECT 
    a.alert_id,
    a.inventory_stock_id,
    a.type,
    a.severity,
    a.alert_message,
    a.alert_date,
    a.status,
    a.acknowledged_by,
    u.appointment as acknowledged_by_info,
    a.acknowledged_date,
    a.action_required,
    a.estimated_impact,
    a.is_system_generated,
    i.lot_number
FROM Alert a
LEFT JOIN Inventory i ON a.inventory_stock_id = i.inventory_stock_id
LEFT JOIN User u ON a.acknowledged_by = u.user_id;

-- Trigger for monitoring low stock levels
DELIMITER //
CREATE TRIGGER check_low_stock 
AFTER UPDATE ON Inventory     -- Trigger activates after any update to Inventory table
FOR EACH ROW
BEGIN
    DECLARE min_threshold INT DEFAULT 100;    -- Default minimum threshold
    DECLARE curr_quantity INT;    -- Current quantity
    DECLARE lot_info VARCHAR(100);    -- Lot number for message
    
    -- Get the current quantity and lot info
    SET curr_quantity = NEW.quantity;
    SET lot_info = CONCAT('Lot: ', COALESCE(NEW.lot_number, 'N/A'));
    
    -- Check if quantity is below threshold and no open alert exists
    IF curr_quantity < min_threshold AND NOT EXISTS (
        SELECT 1 FROM Alert 
        WHERE inventory_stock_id = NEW.inventory_stock_id 
        AND type = 'Low Stock' 
        AND status = 'Open'
    ) THEN
        -- Insert a new alert
        INSERT INTO Alert (
            inventory_stock_id,
            type,
            severity,
            alert_message,
            action_required,
            estimated_impact,
            is_system_generated
        ) VALUES (
            NEW.inventory_stock_id,
            'Low Stock',
            CASE
                WHEN curr_quantity < (min_threshold * 0.5) THEN 'Critical'
                ELSE 'High'
            END,
            CONCAT('Low stock alert for inventory ', lot_info, ' (', curr_quantity, '/', min_threshold, ')'),
            CASE
                WHEN curr_quantity < (min_threshold * 0.5) THEN 'Immediate restocking required'
                ELSE 'Schedule restocking within 48 hours'
            END,
            CASE
                WHEN curr_quantity < (min_threshold * 0.5) THEN 'High - Operations may be affected'
                ELSE 'Medium - May affect upcoming activities'
            END,
            true
        );
    END IF;
END //
DELIMITER ;

-- Trigger for monitoring expiry dates
DELIMITER //
CREATE TRIGGER check_expiry_date 
AFTER INSERT ON Inventory     -- Triggers when new inventory is added
FOR EACH ROW
BEGIN
    DECLARE days_until_expiry INT;     -- Variable to store days until expiry
    DECLARE lot_info VARCHAR(100);     -- Variable to store lot number
    
    -- Only proceed if expiry date is set
    IF NEW.expiry_date IS NOT NULL THEN
        -- Calculate days until expiry
        SET days_until_expiry = DATEDIFF(NEW.expiry_date, CURRENT_DATE);
        SET lot_info = COALESCE(NEW.lot_number, 'N/A');
        
        -- Check if within 60 days of expiry and no open alert exists
        IF days_until_expiry <= 60 AND days_until_expiry > 0 
        AND NOT EXISTS (
            SELECT 1 FROM Alert 
            WHERE inventory_stock_id = NEW.inventory_stock_id 
            AND type = 'Expiry Warning' 
            AND status = 'Open'
        ) THEN
            -- Insert a new expiry alert
            INSERT INTO Alert (
                inventory_stock_id,
                type,
                severity,
                alert_message,
                action_required,
                estimated_impact,
                is_system_generated
            ) VALUES (
                NEW.inventory_stock_id,
                'Expiry Warning',
                CASE
                    WHEN days_until_expiry <= 30 THEN 'High'
                    ELSE 'Medium'
                END,
                CONCAT('Inventory (Lot: ', lot_info, ') expires in ', 
                      days_until_expiry, 
                      ' days (', DATE_FORMAT(NEW.expiry_date, '%Y-%m-%d'), ')'),
                'Plan usage or disposal before expiry',
                CASE
                    WHEN days_until_expiry <= 30 THEN 'Medium - Action needed soon'
                    ELSE 'Low - Sufficient time for action'
                END,
                true
            );
        END IF;
    END IF;
END //
DELIMITER ;
-- Create Reports table with appointment reference
CREATE TABLE IF NOT EXISTS Reports (
    report_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by_appointment VARCHAR(100), -- Store appointment/rank directly
    period VARCHAR(100),
    format VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Processing',
    file_size VARCHAR(20),
    description TEXT,
    retention_date DATE NOT NULL,
    download_count INT DEFAULT 0,
    last_accessed TIMESTAMP NULL,
    is_uploaded BOOLEAN DEFAULT FALSE,
    pdf_data MEDIUMBLOB  -- For storing PDF files up to 16MB
);

-- Insert sample reports data
INSERT INTO Reports (
    report_id,
    name,
    type,
    date_generated,
    generated_by_appointment,
    period,
    format,
    status,
    file_size,
    description,
    retention_date,
    download_count,
    last_accessed,
    is_uploaded
) VALUES 
(
    'RPT001',
    'Monthly Inventory Summary',
    'Inventory',
    '2024-01-15 10:30:00',
    'Captain',
    'January 2024',
    'PDF',
    'Completed',
    '2.4 MB',
    'Complete inventory overview with stock levels and expiry dates',
    '2027-01-15',
    12,
    '2024-01-20 14:30:00',
    false
),
(
    'RPT002',
    'Issue Activity Report',
    'Issues',
    '2024-01-14 16:45:00',
    'Sergeant',
    'Last 30 Days',
    'CSV',
    'Completed',
    '1.8 MB',
    'Detailed ammunition issue records and distribution patterns',
    '2027-01-14',
    8,
    '2024-01-19 09:15:00',
    false
),
(
    'RPT003',
    'Low Stock Alert Summary',
    'Alerts',
    '2024-01-13 09:15:00',
    'Lt Col',
    'Current',
    'PDF',
    'Completed',
    '856 KB',
    'Critical and high priority stock alerts requiring attention',
    '2027-01-13',
    15,
    '2024-01-21 11:00:00',
    false
),
(
    'RPT004',
    'User Activity Audit',
    'Audit',
    '2024-01-12 14:20:00',
    'Lt Col',
    'December 2023',
    'Excel',
    'Completed',
    '3.2 MB',
    'Complete user activity log with login and transaction records',
    '2027-01-12',
    5,
    '2024-01-18 16:45:00',
    false
),
(
    'RPT005',
    'Quarterly Stock Forecast',
    'Analytics',
    '2024-01-11 11:00:00',
    'Captain',
    'Q1 2024',
    'PDF',
    'Processing',
    'Pending',
    'Predictive analysis for ammunition requirements and procurement',
    '2027-01-11',
    0,
    NULL,
    false
),
(
    'RPT006',
    'Annual Security Report',
    'Security',
    '2023-12-31 23:59:00',
    'Lt Col',
    'Year 2023',
    'PDF',
    'Completed',
    '4.1 MB',
    'Comprehensive security analysis and incident reports for 2023',
    '2026-12-31',
    22,
    '2024-01-15 08:30:00',
    false
);

-- Step 1: First add columns without NOT NULL constraints
ALTER TABLE Users
ADD COLUMN username VARCHAR(50) UNIQUE,
ADD COLUMN email VARCHAR(100) UNIQUE,
ADD COLUMN phone VARCHAR(20),
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN role ENUM('CO', 'QM', 'NCO'),
ADD COLUMN last_login DATETIME,
ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active';

-- Step 2: Update existing users with data

UPDATE Users SET username='admin', email='refa.jahan@military.gov.bd', phone='+880-1713-456789', password_hash='admin123', role='CO', status='Active' WHERE user_id=1;
UPDATE Users SET username='maj_karim', email='karim.uddin@military.gov.bd', phone='+880-1717-234567', password_hash='$2a$10$hash', role='CO', status='Active' WHERE user_id=2;
UPDATE Users SET username='capt_hossain', email='hossain.mohammad@military.gov.bd', phone='+880-1712-345678', password_hash='$2a$10$hash', role='QM', status='Active' WHERE user_id=3;
UPDATE Users SET username='maj_islam', email='islam.shahid@military.gov.bd', phone='+880-1716-789012', password_hash='$2a$10$hash', role='CO', status='Active' WHERE user_id=4;
UPDATE Users SET username='lt_alam', email='alam.nasir@military.gov.bd', phone='+880-1715-890123', password_hash='$2a$10$hash', role='CO', status='Active' WHERE user_id=5;
UPDATE Users SET username='sgt_miah', email='miah.jalal@military.gov.bd', phone='+880-1714-901234', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=6;
UPDATE Users SET username='cpl_khan', email='khan.masud@military.gov.bd', phone='+880-1719-012345', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=7;
UPDATE Users SET username='lcpl_ahmed', email='ahmed.farid@military.gov.bd', phone='+880-1718-123456', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=8;
UPDATE Users SET username='pvt_siddiq', email='siddiq.omar@military.gov.bd', phone='+880-1711-234567', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=9;
UPDATE Users SET username='pvt_kabir', email='kabir.rahim@military.gov.bd', phone='+880-1712-345678', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=10;
UPDATE Users SET username='col_hassan', email='hassan.imtiaz@military.gov.bd', phone='+880-1713-456789', password_hash='$2a$10$hash', role='CO', status='Active' WHERE user_id=11;
UPDATE Users SET username='capt_rashid', email='rashid.ahmed@military.gov.bd', phone='+880-1714-567890', password_hash='$2a$10$hash', role='QM', status='Active' WHERE user_id=12;
UPDATE Users SET username='maj_zaman', email='zaman.shahidul@military.gov.bd', phone='+880-1715-678901', password_hash='$2a$10$hash', role='CO', status='Active' WHERE user_id=13;
UPDATE Users SET username='lt_shahriar', email='shahriar.haque@military.gov.bd', phone='+880-1716-789012', password_hash='$2a$10$hash', role='CO', status='Active' WHERE user_id=14;
UPDATE Users SET username='sgt_malik', email='malik.rizwan@military.gov.bd', phone='+880-1717-890123', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=15;
UPDATE Users SET username='cpl_rahman', email='rahman.faisal@military.gov.bd', phone='+880-1718-901234', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=16;
UPDATE Users SET username='lcpl_hasan', email='hasan.mahbub@military.gov.bd', phone='+880-1719-012345', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=17;
UPDATE Users SET username='snk_islam', email='islam.nurul@military.gov.bd', phone='+880-1720-123456', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=18;
UPDATE Users SET username='snk_chowdhury', email='chowdhury.kamal@military.gov.bd', phone='+880-1721-234567', password_hash='$2a$10$hash', role='NCO', status='Active' WHERE user_id=19;

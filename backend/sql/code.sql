-- =========================
-- DROP TABLES (if exist)
-- =========================
DROP TABLE IF EXISTS Issue;
DROP TABLE IF EXISTS Alert;
DROP TABLE IF EXISTS Ammo_Type_Line;
DROP TABLE IF EXISTS Line_type;
DROP TABLE IF EXISTS Ammo_type;
DROP TABLE IF EXISTS Ammunition;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Users;

-- =========================
-- CREATE TABLES
-- =========================

-- User Table (renamed to Users)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment VARCHAR(100) NOT NULL,
    rk VARCHAR(50) NOT NULL
);

-- Inventory Table
CREATE TABLE Inventory (
    inventory_stock_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quantity INT NOT NULL,
    lot_number VARCHAR(50),
    stock_date DATE NOT NULL,
    expiry_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Ammunition Table
CREATE TABLE Ammunition (
    ammo_id INT AUTO_INCREMENT PRIMARY KEY,
    rifle INT DEFAULT 0,
    lmg INT DEFAULT 0,
    hmg INT DEFAULT 0,
    pistol INT DEFAULT 0
);

-- Ammo Type Table
CREATE TABLE Ammo_type (
    ammo_type_id INT AUTO_INCREMENT PRIMARY KEY,
    ammo_id INT,
    live INT DEFAULT 0,
    blank INT DEFAULT 0,
    fcc INT DEFAULT 0,
    FOREIGN KEY (ammo_id) REFERENCES Ammunition(ammo_id)
);

-- Line Type Table
CREATE TABLE Line_type (
    line_type_id INT AUTO_INCREMENT PRIMARY KEY,
    first_line INT DEFAULT 0,
    second_line INT DEFAULT 0,
    training INT DEFAULT 0
);

-- Ammo_Type_Line (junction table)
CREATE TABLE Ammo_Type_Line (
    A_T_L_id INT AUTO_INCREMENT PRIMARY KEY,
    ammo_type_id INT,
    ammo_id INT,
    line_type_id INT,
    FOREIGN KEY (ammo_type_id) REFERENCES Ammo_type(ammo_type_id),
    FOREIGN KEY (ammo_id) REFERENCES Ammunition(ammo_id),
    FOREIGN KEY (line_type_id) REFERENCES Line_type(line_type_id)
);

-- Issue Table
CREATE TABLE Issue (
    issue_id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_stock_id INT,
    user_id INT,
    issue_date DATE NOT NULL,
    issue_quantity INT NOT NULL,
    A_T_L_id INT,
    FOREIGN KEY (inventory_stock_id) REFERENCES Inventory(inventory_stock_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (A_T_L_id) REFERENCES Ammo_Type_Line(A_T_L_id)
);

-- Alert Table
CREATE TABLE Alert (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_stock_id INT,
    alert_message VARCHAR(255) NOT NULL,
    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_stock_id) REFERENCES Inventory(inventory_stock_id)
);

-- =========================
-- SAMPLE DATA (Bangladesh Army Context)
-- =========================

-- Users (Officers, JCOs, Soldiers)
INSERT INTO Users (appointment, rk) VALUES
('Commanding Officer', 'Colonel'),
('Quartermaster', 'Captain'),
('Company Commander', 'Major'),
('Platoon Commander', 'Lieutenant'),
('Section Commander', 'Sergeant'),
('Armoury NCO', 'Corporal'),
('Store Keeper', 'Lance Corporal'),
('Signal Operator', 'Snk'),
('Rifleman', 'Snk');

-- Ammunition Types (Weapons categories)
INSERT INTO Ammunition (rifle, lmg, hmg, pistol) VALUES
(500, 100, 50, 20),
(1000, 200, 100, 50),
(750, 150, 80, 40),
(1200, 250, 120, 60),
(300, 60, 30, 10),
(900, 180, 90, 45),
(600, 120, 70, 25),
(1100, 210, 110, 55),
(400, 80, 40, 20),
(1300, 260, 130, 65);

-- Ammo_type (Live, Blank, FCC)
INSERT INTO Ammo_type (ammo_id, live, blank, fcc) VALUES
(1, 400, 80, 20),
(2, 800, 150, 50),
(3, 600, 100, 50),
(4, 1000, 180, 20),
(5, 200, 70, 30),
(6, 700, 150, 50),
(7, 500, 100, 20),
(8, 900, 150, 50),
(9, 300, 80, 20),
(10, 1100, 180, 20);

-- Line_type (first line, second line, training)
INSERT INTO Line_type (first_line, second_line, training) VALUES
(1, 0, 0),
(1, 0, 0),
(0, 1, 0),
(0, 1, 0),
(0, 0, 1),
(0, 0, 1),
(1, 0, 0),
(0, 1, 0),
(0, 0, 1),
(1, 0, 0);

-- Ammo_Type_Line (junction table)
INSERT INTO Ammo_Type_Line (ammo_type_id, ammo_id, line_type_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 1),
(5, 5, 2),
(6, 6, 3),
(7, 7, 1),
(8, 8, 2),
(9, 9, 3),
(10, 10, 1);

-- Inventory (ammo stocks by users)
INSERT INTO Inventory (user_id, quantity, lot_number, stock_date, expiry_date) VALUES
(1, 500, 'LOT-A1', '2025-01-05', '2028-01-05'),
(2, 300, 'LOT-B2', '2025-02-10', '2027-02-10'),
(3, 400, 'LOT-C3', '2025-03-15', '2029-03-15'),
(4, 600, 'LOT-D4', '2025-04-20', '2028-04-20'),
(5, 250, 'LOT-E5', '2025-05-25', '2027-05-25'),
(6, 700, 'LOT-F6', '2025-06-01', '2029-06-01'),
(7, 550, 'LOT-G7', '2025-06-10', '2027-06-10'),
(8, 450, 'LOT-H8', '2025-07-15', '2028-07-15'),
(9, 350, 'LOT-I9', '2025-07-20', '2029-07-20'),
(10, 800, 'LOT-J10', '2025-08-01', '2028-08-01');

-- Issue (distribution of ammo to units/users)
INSERT INTO Issue (inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id) VALUES
(1, 5, '2025-02-01', 100, 1),
(2, 6, '2025-02-05', 50, 2),
(3, 7, '2025-03-01', 70, 3),
(4, 8, '2025-03-10', 120, 4),
(5, 9, '2025-04-01', 60, 5),
(6, 10, '2025-04-15', 90, 6),
(7, 4, '2025-05-05', 150, 7),
(8, 3, '2025-05-20', 200, 8),
(9, 2, '2025-06-01', 80, 9),
(10, 1, '2025-06-10', 250, 10);

-- Alerts (low stock, expiry)
INSERT INTO Alert (inventory_stock_id, alert_message, alert_date) VALUES
(1, 'Low stock warning: Rifle ammo below reserve.', '2025-02-02 10:00:00'),
(2, 'Expiry approaching for LOT-B2.', '2025-02-15 09:30:00'),
(3, 'Training ammo stock low.', '2025-03-20 14:00:00'),
(4, 'HMG ammo nearing reserve level.', '2025-04-25 11:45:00'),
(5, 'Expiry warning: LOT-E5 due soon.', '2025-05-10 08:20:00'),
(6, 'Critical: FCC ammo shortage.', '2025-06-05 12:00:00'),
(7, 'Live rounds usage exceeds forecast.', '2025-06-15 16:40:00'),
(8, 'Pistol ammo nearing expiry.', '2025-07-05 10:10:00'),
(9, 'Blank ammo stock falling.', '2025-07-25 09:00:00'),
(10, 'Lot-J10 requires inspection.', '2025-08-05 13:30:00');

select*from users;


DELIMITER $$

CREATE FUNCTION get_available_stock(p_inventory_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_quantity INT;

    SELECT quantity 
    INTO v_quantity
    FROM Inventory
    WHERE inventory_stock_id = p_inventory_id;

    RETURN v_quantity;
END $$

DELIMITER ;

SELECT get_available_stock(5);

DELIMITER $$

CREATE PROCEDURE sp_insert_ammunition(
  IN p_rifle INT, IN p_lmg INT, IN p_hmg INT, IN p_pistol INT
)
BEGIN
  IF p_rifle  < 0 OR p_lmg < 0 OR p_hmg < 0 OR p_pistol < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ammunition counts must be greater than or equal to 0';
  END IF;

  INSERT INTO Ammunition (rifle, lmg, hmg, pistol)
  VALUES (p_rifle, p_lmg, p_hmg, p_pistol);
END$$

DELIMITER ;

CALL sp_insert_ammunition(-500,-100,-50,-20);

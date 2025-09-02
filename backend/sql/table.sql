-- =========================
-- DROP TABLES (if exist)
-- =========================
DROP TABLE IF EXISTS Ammo_Type_Line;
DROP TABLE IF EXISTS Issue;
DROP TABLE IF EXISTS Alert;
DROP TABLE IF EXISTS Line_type;
DROP TABLE IF EXISTS Ammo_type;
DROP TABLE IF EXISTS Ammunition;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS User;

-- =========================
-- CREATE TABLES
-- =========================

-- User Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment VARCHAR(100) NOT NULL,
    rank VARCHAR(50) NOT NULL
);

-- Inventory Table
CREATE TABLE Inventory (
    inventory_stock_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quantity INT NOT NULL,
    lot_number VARCHAR(50),
    stock_date DATE NOT NULL,
    expiry_date DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
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

-- Alert Table
CREATE TABLE Alert (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_stock_id INT,
    alert_message VARCHAR(255) NOT NULL,
    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_stock_id) REFERENCES Inventory(inventory_stock_id)
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
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (A_T_L_id) REFERENCES Ammo_Type_Line(A_T_L_id)
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

-- =========================
-- EXTRA COMMANDS (deletion, truncate, etc.)
-- =========================

-- Delete all data (truncate)
TRUNCATE TABLE User;
TRUNCATE TABLE Inventory;
TRUNCATE TABLE Ammunition;
TRUNCATE TABLE Ammo_type;
TRUNCATE TABLE Line_type;
TRUNCATE TABLE Alert;
TRUNCATE TABLE Issue;
TRUNCATE TABLE Ammo_Type_Line;

-- Delete specific rows
-- Example: delete user with id=5
DELETE FROM User WHERE user_id = 5;

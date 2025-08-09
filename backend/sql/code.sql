-- backend/sql/create_user_table.sql
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- backend/sql/create_inventory_table.sql
CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO user (username, email, password) VALUES
('alice123', 'alice@example.com', 'passAlice1'),
('bob456', 'bob@example.com', 'passBob2'),
('carol789', 'carol@example.com', 'passCarol3'),
('dave321', 'dave@example.com', 'passDave4'),
('eve654', 'eve@example.com', 'passEve5');


select * from user;
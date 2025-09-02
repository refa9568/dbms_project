// server.js
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware to parse JSON request body
app.use(express.json());
// Allow cross-origin requests from frontend
app.use(cors());

// ==============================
// MySQL connection pool setup
// ==============================
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '9568',
  database: 'dbms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL connection on server start
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ MySQL connected successfully');
    connection.release();
  }
});

// Helper to run queries returning a Promise (optional convenience)
function queryPromise(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// ==============================
// Routes
// ==============================

// Root route
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// API route to get current MySQL time
app.get('/api/test', (req, res) => {
  pool.query('SELECT NOW() AS now', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ serverTime: results[0].now });
  });
});

// ==============================
// INVENTORY API ROUTES
// (kept your original inventory endpoints)
// ==============================

// 1. Get all inventory items
app.get('/api/inventory', (req, res) => {
  pool.query('SELECT * FROM Inventory', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Get a single inventory item by ID
app.get('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM Inventory WHERE inventory_stock_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Item not found' });
    res.json(results[0]);
  });
});

// 3. Add a new inventory item
app.post('/api/inventory', (req, res) => {
  const { user_id, quantity, lot_number, stock_date, expiry_date } = req.body;
  pool.query(
    'INSERT INTO Inventory (user_id, quantity, lot_number, stock_date, expiry_date) VALUES (?, ?, ?, ?, ?)',
    [user_id, quantity, lot_number, stock_date, expiry_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item added successfully', id: result.insertId });
    }
  );
});

// 4. Update an inventory item
app.put('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, quantity, lot_number, stock_date, expiry_date } = req.body;
  pool.query(
    'UPDATE Inventory SET user_id=?, quantity=?, lot_number=?, stock_date=?, expiry_date=? WHERE inventory_stock_id=?',
    [user_id, quantity, lot_number, stock_date, expiry_date, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
      res.json({ message: 'Item updated successfully' });
    }
  );
});

// 5. Delete an inventory item
app.delete('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM Inventory WHERE inventory_stock_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  });
});

// ==============================
// ISSUE API ROUTES (CRUD)
// ==============================

// 1. Get all issues
// Returns raw Issue table rows. If you want joined human-readable fields, see the /api/issues/joined route below.
app.get('/api/issues', (req, res) => {
  pool.query('SELECT * FROM Issue ORDER BY issue_date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Get a single issue by ID
app.get('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM Issue WHERE issue_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Issue not found' });
    res.json(results[0]);
  });
});

// 3. Create a new issue
app.post('/api/issues', (req, res) => {
  const { inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id } = req.body;

  // Basic validation
  if (inventory_stock_id == null || user_id == null || !issue_date || issue_quantity == null) {
    return res.status(400).json({ message: 'Required fields: inventory_stock_id, user_id, issue_date, issue_quantity' });
  }

  pool.query(
    'INSERT INTO Issue (inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id) VALUES (?, ?, ?, ?, ?)',
    [inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Issue created', issue_id: result.insertId });
    }
  );
});

// 4. Update an existing issue
app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const { inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id } = req.body;

  // You can also validate inputs here if desired
  pool.query(
    'UPDATE Issue SET inventory_stock_id=?, user_id=?, issue_date=?, issue_quantity=?, A_T_L_id=? WHERE issue_id=?',
    [inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id || null, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Issue not found' });
      res.json({ message: 'Issue updated successfully' });
    }
  );
});

// 5. Delete an issue
app.delete('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM Issue WHERE issue_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted successfully' });
  });
});

/*
  Optional endpoint: joined / expanded issue info
  This does a LEFT JOIN with Inventory, Users and Ammo_Type_Line so the frontend can display
  related info in one call. NOTE: adjust this SELECT to include the exact columns you want
  from Inventory, Users and Ammo_Type_Line according to your schema (e.g. user_name, rank, lot_number, ammo_type, etc).
*/
app.get('/api/issues/joined', (req, res) => {
  const sql = `
    SELECT 
      i.issue_id,
      i.inventory_stock_id,
      i.user_id,
      i.issue_date,
      i.issue_quantity,
      i.A_T_L_id,
      inv.lot_number AS inventory_lot_number,
      inv.quantity AS inventory_quantity,
      u.user_id AS user_ref,
      u.name AS user_name,
      atl.A_T_L_id AS ammo_type_line_ref
    FROM Issue i
    LEFT JOIN Inventory inv ON i.inventory_stock_id = inv.inventory_stock_id
    LEFT JOIN Users u ON i.user_id = u.user_id
    LEFT JOIN Ammo_Type_Line atl ON i.A_T_L_id = atl.A_T_L_id
    ORDER BY i.issue_date DESC
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      // If your Users table doesn't have a `name` column the query may fail.
      // In that case you can either remove u.name from the SELECT above or
      // adjust it to match the correct column name.
      return res.status(500).json({ error: err.message, hint: 'If this errors due to a missing column (e.g., u.name) edit the SELECT to match your Users table columns.' });
    }
    res.json(results);
  });
});

// ==============================
// Start Server
// ==============================
app.listen(port, () => {
  console.log(`🚀 Express backend listening at http://localhost:${port}`);
});

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// MySQL connection pool setup (update credentials)
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
    console.error('MySQL connection failed:', err);
  } else {
    console.log('MySQL connected successfully');
    connection.release();
  }
});

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


app.listen(port, () => {
  console.log(`Express backend listening at http://localhost:${port}`);
});

// server.js
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

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
  queueLimit: 0,
  maxPayloadSize: 16777216 // 16MB for PDF uploads
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

// ==============================
// USER API ROUTES
// ==============================

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
// USER API ROUTES
// ==============================

// Get all users
app.get('/api/users', (req, res) => {
  pool.query(
    'SELECT user_id, username, appointment, rk, email, phone, role, last_login, status FROM Users',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  pool.query(
    'SELECT user_id, username, appointment, rk, email, phone, role, last_login, status FROM Users WHERE user_id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });
      res.json(results[0]);
    }
  );
});

// Update user info
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { email, phone } = req.body;

  pool.query(
    'UPDATE Users SET email = ?, phone = ? WHERE user_id = ?',
    [email, phone, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Change password
app.post('/api/users/change-password', (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  // Validate inputs
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'userId, currentPassword, and newPassword are required' });
  }

  console.log('Attempting password change for user:', userId);

  // First verify current password
  pool.query(
    'SELECT password_hash FROM Users WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error checking current password:', err);
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        console.log('User not found:', userId);
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results[0];
      console.log('Current password in DB:', user.password_hash);
      console.log('Password provided:', currentPassword);
      
      if (currentPassword !== user.password_hash) {
        console.log('Password mismatch');
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      console.log('Password verified, updating to new password');

      // Update with new password directly
      pool.query(
        'UPDATE Users SET password_hash = ? WHERE user_id = ?',
        [newPassword, userId],
        (err, result) => {
          if (err) {
            console.error('Error updating password:', err);
            return res.status(500).json({ error: err.message });
          }

          if (result.affectedRows === 0) {
            console.log('No rows updated');
            return res.status(404).json({ message: 'Failed to update password' });
          }

          console.log('Password updated successfully');
          res.json({ 
            message: 'Password updated successfully',
            affectedRows: result.affectedRows
          });
        }
      );
    }
  );
});

// Update user status
app.put('/api/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'Active' && status !== 'Inactive') {
    return res.status(400).json({ message: 'Status must be either Active or Inactive' });
  }

  pool.query(
    'UPDATE Users SET status = ? WHERE user_id = ?',
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User status updated successfully' });
    }
  );
});

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

  // First check if there's enough quantity in inventory
  pool.query(
    'SELECT quantity FROM Inventory WHERE inventory_stock_id = ?',
    [inventory_stock_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'Inventory item not found' });
      
      const currentQuantity = results[0].quantity;
      if (currentQuantity < issue_quantity) {
        return res.status(400).json({ message: 'Not enough quantity in inventory' });
      }

      // Begin transaction to ensure both operations succeed or fail together
      pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: err.message });

        connection.beginTransaction(err => {
          if (err) {
            connection.release();
            return res.status(500).json({ error: err.message });
          }

          // Insert the issue
          connection.query(
            'INSERT INTO Issue (inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id) VALUES (?, ?, ?, ?, ?)',
            [inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id || null],
            (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ error: err.message });
                });
              }

              // Update the inventory quantity
              connection.query(
                'UPDATE Inventory SET quantity = quantity - ? WHERE inventory_stock_id = ?',
                [issue_quantity, inventory_stock_id],
                (err, updateResult) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ error: err.message });
                    });
                  }

                  // Commit the transaction
                  connection.commit(err => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: err.message });
                      });
                    }
                    connection.release();
                    res.status(201).json({ message: 'Issue created and inventory updated', issue_id: result.insertId });
                  });
                }
              );
            }
          );
        });
      });
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

// ==============================
// ALERTS API ROUTES
// ==============================

// 1. Get all alerts with details
app.get('/api/alerts', (req, res) => {
  // Using the AlertDetails view we created
  pool.query('SELECT * FROM AlertDetails ORDER BY alert_date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Get alert by ID with details
app.get('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM AlertDetails WHERE alert_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Alert not found' });
    res.json(results[0]);
  });
});

// 3. Create new alert
app.post('/api/alerts', (req, res) => {
  const { 
    inventory_stock_id, 
    type, 
    severity, 
    alert_message,
    action_required,
    estimated_impact,
    is_system_generated = false
  } = req.body;
  
  // Basic validation
  if (!type || !severity || !alert_message) {
    return res.status(400).json({ message: 'Required fields: type, severity, alert_message' });
  }

  pool.query(
    `INSERT INTO Alert (
      inventory_stock_id, type, severity, alert_message, 
      action_required, estimated_impact, is_system_generated
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [inventory_stock_id, type, severity, alert_message, action_required, estimated_impact, is_system_generated],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Alert created', alert_id: result.insertId });
    }
  );
});

// 4. Acknowledge alert
app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const { id } = req.params;
  const { user_id, notes } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  pool.query(
    `UPDATE Alert 
     SET status = 'Acknowledged', 
         acknowledged_by = ?,
         acknowledged_date = CURRENT_TIMESTAMP,
         alert_message = CASE 
           WHEN ? IS NOT NULL AND ? != '' 
           THEN CONCAT(alert_message, ' (Note: ', ?, ')')
           ELSE alert_message
         END
     WHERE alert_id = ?`,
    [user_id, notes, notes, notes, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Alert not found' });
      res.json({ message: 'Alert acknowledged successfully' });
    }
  );
});

// 5. Resolve alert
app.post('/api/alerts/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  pool.query(
    `UPDATE Alert 
     SET status = 'Resolved', 
         acknowledged_by = ?,
         acknowledged_date = CURRENT_TIMESTAMP
     WHERE alert_id = ?`,
    [user_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Alert not found' });
      res.json({ message: 'Alert resolved successfully' });
    }
  );
});

// Dismiss alert
app.post('/api/alerts/:id/dismiss', (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  pool.query(
    `UPDATE Alert 
     SET status = 'Dismissed', 
         acknowledged_by = ?,
         acknowledged_date = CURRENT_TIMESTAMP
     WHERE alert_id = ?`,
    [user_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Alert not found' });
      res.json({ message: 'Alert dismissed successfully' });
    }
  );
});

// 6. Delete alert
app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM Alert WHERE alert_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Alert not found' });
    res.json({ message: 'Alert deleted successfully' });
  });
});

// 7. Get alerts by status
app.get('/api/alerts/filter/status/:status', (req, res) => {
  const { status } = req.params;
  pool.query(
    'SELECT * FROM AlertDetails WHERE status = ? ORDER BY alert_date DESC',
    [status],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// 8. Get alerts by severity
app.get('/api/alerts/filter/severity/:severity', (req, res) => {
  const { severity } = req.params;
  pool.query(
    'SELECT * FROM AlertDetails WHERE severity = ? ORDER BY alert_date DESC',
    [severity],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// 9. Manual check for system alerts
app.post('/api/alerts/check', (req, res) => {
  // The triggers will automatically create alerts when inventory is updated
  // This endpoint is just for checking recent system-generated alerts
  pool.query(
    `SELECT * FROM AlertDetails 
     WHERE is_system_generated = true 
     AND alert_date >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)
     ORDER BY alert_date DESC`,
    (err, newAlerts) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: 'Recent system alerts retrieved',
        alerts: newAlerts
      });
    }
  );
});

// ==============================
// REPORTS API ROUTES
// ==============================

// Get all reports
app.get('/api/reports', (req, res) => {
  pool.query('SELECT * FROM Reports ORDER BY date_generated DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get report by ID
app.get('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM Reports WHERE report_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Report not found' });
    res.json(results[0]);
  });
});

// Download report PDF
app.get('/api/reports/:id/download', (req, res) => {
  const { id } = req.params;
  pool.query(
    'SELECT name, pdf_data FROM Reports WHERE report_id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0 || !results[0].pdf_data) {
        return res.status(404).json({ message: 'PDF not found' });
      }

      // Update download count and last accessed
      pool.query(
        `UPDATE Reports 
         SET download_count = download_count + 1,
             last_accessed = CURRENT_TIMESTAMP
         WHERE report_id = ?`,
        [id],
        (err) => {
          if (err) console.error('Error updating download count:', err);
        }
      );

      // Send PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${results[0].name}.pdf"`);
      res.send(results[0].pdf_data);
    }
  );
});

// Upload new report
app.post('/api/reports/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No PDF file uploaded' });
  }

  const {
    name,
    type,
    period,
    description,
    userId // Should come from auth middleware in production
  } = req.body;

  // Generate report ID
  const reportId = 'RPT' + Math.floor(Math.random() * 10000).toString().padStart(3, '0');
  
  // Calculate retention date (3 years from now)
  const retentionDate = new Date();
  retentionDate.setFullYear(retentionDate.getFullYear() + 3);

  // Calculate file size in MB
  const fileSizeInMB = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';

  pool.query(
    `INSERT INTO Reports (
      report_id, name, type, generated_by_appointment, period,
      format, status, file_size, description,
      retention_date, is_uploaded, pdf_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reportId,
      name,
      type,
      req.body.generated_by_appointment,
      period,
      'PDF',
      'Completed',
      fileSizeInMB,
      description,
      retentionDate.toISOString().split('T')[0],
      true,
      req.file.buffer
    ],
    (err, result) => {
      if (err) {
        console.error('Error uploading report:', err);
        return res.status(500).json({ error: 'Failed to upload report' });
      }
      res.status(201).json({
        message: 'Report uploaded successfully',
        reportId: reportId
      });
    }
  );
});

// Delete report
app.delete('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM Reports WHERE report_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
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

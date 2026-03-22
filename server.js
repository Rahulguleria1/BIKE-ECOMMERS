const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all bikes
app.get('/api/bikes', (req, res) => {
  db.all('SELECT * FROM bikes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get bike by ID
app.get('/api/bikes/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM bikes WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Bike not found' });
      return;
    }
    res.json(row);
  });
});

// Create a new order
app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, items, total_amount } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(
      `INSERT INTO orders (customer_name, customer_email, total_amount) VALUES (?, ?, ?)`,
      [customer_name, customer_email, total_amount],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }
        
        const orderId = this.lastID;
        const stmt = db.prepare(`INSERT INTO order_items (order_id, bike_id, quantity, price) VALUES (?, ?, ?, ?)`);
        
        for (const item of items) {
          stmt.run([orderId, item.bike_id, item.quantity, item.price], (err) => {
            if (err) {
              db.run("ROLLBACK");
              stmt.finalize();
              return res.status(500).json({ error: err.message });
            }
          });
        }
        
        stmt.finalize(() => {
          db.run("COMMIT", (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Order created successfully', orderId });
          });
        });
      }
    );
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

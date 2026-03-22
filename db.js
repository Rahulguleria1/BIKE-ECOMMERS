const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create tables
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS bikes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT,
        price REAL NOT NULL,
        description TEXT,
        image_url TEXT
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        bike_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(bike_id) REFERENCES bikes(id)
      )`);

      // Insert some dummy data if bikes are empty
      db.get("SELECT COUNT(*) AS count FROM bikes", (err, row) => {
        if (row && row.count === 0) {
          const insertStmt = db.prepare(`INSERT INTO bikes (name, type, price, description, image_url) VALUES (?, ?, ?, ?, ?)`);
          insertStmt.run('Aero Speed 3000', 'Road', 1299.99, 'Ultra lightweight aerodynamic road bike for racing enthusiasts.', 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800');
          insertStmt.run('Mountain Crusher X', 'Mountain', 999.50, 'Rugged mountain bike with dual suspension and knobby tires.', 'https://images.unsplash.com/photo-1576435728678-68ce0b62e478?auto=format&fit=crop&q=80&w=800');
          insertStmt.run('City Cruiser', 'Urban', 450.00, 'Comfortable city commuter bike with a vintage look.', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800');
          insertStmt.run('Electric TrailMaster', 'E-Bike', 2499.00, 'Powerful electric mountain bike to conquer any trail with ease.', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=800');
          insertStmt.run('Gravel Explorer', 'Gravel', 1150.00, 'Versatile gravel bike built for both paved roads and dirt tracks.', 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&q=80&w=800');
          insertStmt.finalize();
          console.log('Inserted dummy bikes.');
        }
      });
    });
  }
});

module.exports = db;

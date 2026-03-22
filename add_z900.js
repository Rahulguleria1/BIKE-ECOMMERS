const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  const insertStmt = db.prepare(`INSERT INTO bikes (name, type, price, description, image_url) VALUES (?, ?, ?, ?, ?)`);
  insertStmt.run(
    'Kawasaki Z900', 
    'Motorbike', 
    9399.00, 
    'The Z900 features a powerful 948cc inline four-cylinder engine, aggressive Z styling, and high-tech features like dynamic riding modes.', 
    '/z900.png'
  );
  insertStmt.finalize(() => {
    console.log('Successfully inserted Kawasaki Z900!');
    db.close();
  });
});

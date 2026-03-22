const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

const bikesToAdd = [
  {
    name: 'Ducati Streetfighter V4',
    type: 'Motorbike',
    price: 22095.00,
    description: 'The Streetfighter V4 is a Panigale V4 stripped of the fairings, with a high and wide handlebar. Delivering 208 hp, it is the ultimate hyper-naked motorcycle.',
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800'
  }
];

db.serialize(() => {
  const insertStmt = db.prepare(`INSERT INTO bikes (name, type, price, description, image_url) VALUES (?, ?, ?, ?, ?)`);
  
  let inserted = 0;
  for (const bike of bikesToAdd) {
    insertStmt.run(bike.name, bike.type, bike.price, bike.description, bike.image_url, (err) => {
      if (err) console.error(err);
      inserted++;
      if (inserted === bikesToAdd.length) {
        insertStmt.finalize(() => {
          console.log('Successfully inserted Ducati Streetfighter V4!');
          db.close();
        });
      }
    });
  }
});

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

const bikesToAdd = [
  {
    name: 'Yamaha R1',
    type: 'Motorbike',
    price: 18399.00,
    description: 'Developed using YZR-M1 MotoGP technology, this motorcycle was born for the track. Featuring a crossplane engine and advanced electronics.',
    image_url: '/yamaha_r1.png'
  },
  {
    name: 'Ducati Panigale V4',
    type: 'Motorbike',
    price: 24495.00,
    description: 'The Panigale V4 replaces the iconic 1299 at the top of the Ducati supersport range, doing so by enhancing performance and ridability.',
    image_url: '/ducati_panigale.png'
  },
  {
    name: 'BMW S1000RR',
    type: 'Motorbike',
    price: 18295.00,
    description: 'The BMW S1000RR is an agile, incredibly fast, and sophisticated sportbike pushing the limits of technology and performance.',
    image_url: '/bmw_s1000rr.png'
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
          console.log('Successfully inserted all new motorbikes!');
          db.close();
        });
      }
    });
  }
});

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

const bikesToAdd = [
  {
    name: 'Yamaha MT-09',
    type: 'Motorbike',
    price: 9799.00,
    description: 'The industry benchmark in hyper naked performance. Featuring an 890cc crossplane inline-three engine with breathtaking torque.',
    image_url: '/yamaha_mt09.png'
  },
  {
    name: 'KTM 1290 Super Duke R',
    type: 'Motorbike',
    price: 19599.00,
    description: 'Known as "The Beast", this hyper-naked motorcycle rips up the rulebook with a 1301cc V-Twin engine delivering explosive power.',
    image_url: '/ktm_super_duke.png'
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
          console.log('Successfully inserted all naked motorbikes!');
          db.close();
        });
      }
    });
  }
});

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_FILE = process.env.DB_FILE || './db.sqlite';

function getDb() {
  const db = new sqlite3.Database(DB_FILE);
  return db;
}

function initDb() {
  const db = getDb();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  const schema = fs.readFileSync(schemaPath, 'utf8');
  const seed = fs.readFileSync(seedPath, 'utf8');

  db.serialize(() => {
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error running schema.sql', err);
      } else {
        console.log('Schema created.');
        db.exec(seed, (err2) => {
          if (err2) {
            console.error('Error running seed.sql', err2);
          } else {
            console.log('Seed data inserted.');
          }
        });
      }
    });
  });

  db.close();
}

module.exports = {
  getDb,
  initDb
};

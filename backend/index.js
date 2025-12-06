const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getDb, initDb } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initDb();

app.get('/', (req, res) => {
  res.send('Backend is running 🔥');
});

app.get('/api/products', (req, res) => {
  const { search = '', category = '', page = 1, limit = 10 } = req.query;

  const db = getDb();
  const offset = (Number(page) - 1) * Number(limit);

  let baseQuery = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) {
    baseQuery += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  if (category) {
    baseQuery += ' AND category = ?';
    params.push(category);
  }

  const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery})`;
  const dataQuery = `${baseQuery} LIMIT ? OFFSET ?`;

  db.get(countQuery, params, (countErr, countRow) => {
    if (countErr) {
      console.error(countErr);
      db.close();
      return res.status(500).json({ error: 'Error counting products' });
    }

    const total = countRow.total;
    const dataParams = [...params, Number(limit), offset];

    db.all(dataQuery, dataParams, (err, rows) => {
      db.close();
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching products' });
      }
      res.json({
        products: rows,
        total,
        page: Number(page),
        limit: Number(limit)
      });
    });
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    db.close();
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching product' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

app.post('/api/enquiries', (req, res) => {
  const { product_id, name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const db = getDb();
  const query = `
    INSERT INTO enquiries (product_id, name, email, phone, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [product_id || null, name, email, phone || null, message], function (err) {
    db.close();
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error saving enquiry' });
    }
    res.status(201).json({ success: true, id: this.lastID });
  });
});

app.get('/api/enquiries', (req, res) => {
  const db = getDb();
  const query = `
    SELECT e.*, p.name AS product_name
    FROM enquiries e
    LEFT JOIN products p ON e.product_id = p.id
    ORDER BY e.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    db.close();
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching enquiries' });
    }
    res.json({ enquiries: rows });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

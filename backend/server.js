// ---------- server.js ----------
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------ Middleware ------------
app.use(cors());           // Allow any origin (good for dev)
app.use(express.json());  // Parse JSON bodies

// ------------ SQLite DB ------------
const dbPath = path.resolve(__dirname, 'cars.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error('DB open error:', err);
  else console.log('Connected to SQLite');
});

// Create table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT
  )
`);

// ------------ API Endpoints ------------

// GET all cars
app.get('/api/cars', (req, res) => {
  db.all('SELECT * FROM cars', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET a single car (used for editing)
app.get('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM cars WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Car not found' });
    res.json(row);
  });
});

// POST a new car
app.post('/api/cars', (req, res) => {
  const { make, model, year, color } = req.body;
  const stmt = db.prepare('INSERT INTO cars (make, model, year, color) VALUES (?, ?, ?, ?)');
  stmt.run([make, model, year, color], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// PUT (update) a car
app.put('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const { make, model, year, color } = req.body;
  const stmt = db.prepare('UPDATE cars SET make = ?, model = ?, year = ?, color = ? WHERE id = ?');
  stmt.run([make, model, year, color, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// DELETE a car
app.delete('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM cars WHERE id = ?');
  stmt.run(id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// ------------ Start Server ------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

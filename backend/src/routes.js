import express from 'express';
import { initDb } from './db.js';

export async function createRouter() {
  const router = express.Router();
  const db = await initDb();

  // GET all cars
  router.get('/', async (req, res) => {
    const rows = await db.all('SELECT * FROM cars ORDER BY id DESC;');
    res.json(rows);
  });

  // GET single car
  router.get('/:id', async (req, res) => {
    const car = await db.get('SELECT * FROM cars WHERE id = ?', req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  });

  // CREATE a new car
  router.post('/', async (req, res) => {
    const { make, model, year, price } = req.body;
    if (!make || !model || !year || !price) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const result = await db.run(
      'INSERT INTO cars (make, model, year, price) VALUES (?, ?, ?, ?);',
      [make, model, year, price]
    );
    const newCar = await db.get('SELECT * FROM cars WHERE id = ?', result.lastID);
    res.status(201).json(newCar);
  });

  // UPDATE a car
  router.put('/:id', async (req, res) => {
    const { make, model, year, price } = req.body;
    const { id } = req.params;
    const car = await db.get('SELECT * FROM cars WHERE id = ?', id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    await db.run(
      'UPDATE cars SET make = ?, model = ?, year = ?, price = ? WHERE id = ?;',
      [make ?? car.make, model ?? car.model, year ?? car.year, price ?? car.price, id]
    );
    const updated = await db.get('SELECT * FROM cars WHERE id = ?', id);
    res.json(updated);
  });

  // DELETE a car
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const car = await db.get('SELECT * FROM cars WHERE id = ?', id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    await db.run('DELETE FROM cars WHERE id = ?', id);
    res.json({ message: 'Deleted', id: Number(id) });
  });

  return router;
    }

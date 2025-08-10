import React, { useEffect, useState } from 'react';
import {
  fetchCars,
  createCar,
  updateCar,
  deleteCar,
} from '../api/cars';
import CarForm from './CarForm';

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadCars = async () => {
    setLoading(true);
    try {
      const { data } = await fetchCars();
      setCars(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load cars');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleAdd = async (car) => {
    try {
      await createCar(car);
      await loadCars();
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add car');
    }
  };

  const handleUpdate = async (car) => {
    try {
      await updateCar(editingCar.id, car);
      setEditingCar(null);
      await loadCars();
    } catch (err) {
      console.error(err);
      alert('Failed to update car');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try {
      await deleteCar(id);
      await loadCars();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="car-list">
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Form' : 'Add New Car'}
      </button>

      {showAddForm && (
        <CarForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} />
      )}

      {editingCar && (
        <CarForm
          initialData={editingCar}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCar(null)}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.make}</td>
              <td>{c.model}</td>
              <td>{c.year}</td>
              <td>{c.price.toFixed(2)}</td>
              <td>
                <button onClick={() => setEditingCar(c)}>Edit</button>{' '}
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {cars.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No cars yet – add one!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
    }

import React, { useState, useEffect } from 'react';

export default function CarForm({ initialData = {}, onSubmit, onCancel }) {
  const [car, setCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    ...initialData,
  });

  // When a different car is edited, update local state
  useEffect(() => {
    setCar({ make: '', model: '', year: '', price: '', ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({
      ...prev,
      [name]:
        name === 'price'
          ? parseFloat(value)
          : name === 'year'
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!car.make || !car.model || !car.year || !car.price) {
      alert('All fields are required');
      return;
    }
    onSubmit(car);
  };

  return (
    <form onSubmit={handleSubmit} className="car-form">
      <div>
        <label>Make:</label>
        <input name="make" value={car.make} onChange={handleChange} required />
      </div>

      <div>
        <label>Model:</label>
        <input name="model" value={car.model} onChange={handleChange} required />
      </div>

      <div>
        <label>Year:</label>
        <input
          type="number"
          name="year"
          value={car.year}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Price ($):</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={car.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">Save</button>{' '}
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
      }

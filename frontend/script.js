/* ---------- script.js ---------- */
// NOTE: Replace `YOUR_BACKEND_URL` with the URL of your deployed API later.
const BASE_URL = 'https://YOUR_BACKEND_URL/api/cars';

document.addEventListener('DOMContentLoaded', () => {
  loadCars();
  document.getElementById('car-form').addEventListener('submit', handleFormSubmit);
});

function loadCars() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(cars => {
      const tbody = document.querySelector('#cars-table tbody');
      tbody.innerHTML = '';
      cars.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${car.id}</td>
          <td>${car.make}</td>
          <td>${car.model}</td>
          <td>${car.year}</td>
          <td>${car.color || ''}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editCar(${car.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCar(${car.id})">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error('Failed to load cars:', err));
}

function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('car-id').value;
  const payload = {
    make: document.getElementById('make').value.trim(),
    model: document.getElementById('model').value.trim(),
    year: Number(document.getElementById('year').value),
    color: document.getElementById('color').value.trim()
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/${id}` : BASE_URL;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(() => {
      resetForm();
      loadCars();
    })
    .catch(err => console.error('Save error:', err));
}

function editCar(id) {
  // Fetch the specific car and fill the form for editing
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(car => {
      document.getElementById('car-id').value = car.id;
      document.getElementById('make').value = car.make;
      document.getElementById('model').value = car.model;
      document.getElementById('year').value = car.year;
      document.getElementById('color').value = car.color || '';
      document.getElementById('form-title').innerText = 'Edit Car';
      document.getElementById('submit-btn').innerText = 'Update Car';
    })
    .catch(err => console.error('Edit fetch error:', err));
}

function deleteCar(id) {
  if (!confirm('Delete this car?')) return;
  fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    .then(() => loadCars())
    .catch(err => console.error('Delete error:', err));
}

function resetForm() {
  document.getElementById('car-id').value = '';
  document.getElementById('make').value = '';
  document.getElementById('model').value = '';
  document.getElementById('year').value = '';
  document.getElementById('color').value = '';
  document.getElementById('form-title').innerText = 'Add New Car';
  document.getElementById('submit-btn').innerText = 'Add Car';
        }

import axios from 'axios';

// Base URL – taken from env var or falls back to same origin + /api
const baseURL =
  process.env.REACT_APP_API_URL ||
  `${window.location.origin}/api`;

export const api = axios.create({
  baseURL: `${baseURL}/cars`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper wrappers
export const fetchCars = () => api.get('/');
export const fetchCar = (id) => api.get(`/${id}`);
export const createCar = (car) => api.post('/', car);
export const updateCar = (id, car) => api.put(`/${id}`, car);
export const deleteCar = (id) => api.delete(`/${id}`);

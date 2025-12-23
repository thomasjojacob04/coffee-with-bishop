import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  login(credentials) {
    return api.post('/auth/login', credentials);
  },

  // Registrations
  createRegistration(data) {
    return api.post('/registrations', data);
  },

  getRegistrations() {
    return api.get('/registrations');
  },

  deleteRegistration(id) {
    return api.delete(`/registrations/${id}`);
  }
};
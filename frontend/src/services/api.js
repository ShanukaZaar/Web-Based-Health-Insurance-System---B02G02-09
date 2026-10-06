import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for generic error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Call Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

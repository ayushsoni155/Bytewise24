// src/services/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true,
});

// Attach token to each request if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 🪪 JWT stored here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;

// import axios from 'axios';

// // ✅ Use Render backend in production, fallback to local for development
// const baseURL = import.meta.env.VITE_API_URL 
//   ? `${import.meta.env.VITE_API_URL}/api` 
//   : '/api';

// const api = axios.create({ 
//   baseURL,
//   timeout: 15000 
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;

import axios from 'axios';

// Check if we are running locally or in production
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Hardcode the Render URL for production
const API_URL = isProduction 
  ? 'https://restaurant-system-gmj1.onrender.com/api' 
  : '/api';

const api = axios.create({ 
  baseURL: API_URL,
  timeout: 15000 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
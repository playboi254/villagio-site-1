import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // ✅ FIX: use 'admin_token' key — separate from client's 'auth_token'
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      // ✅ FIX: was '/login' — caused 404 because backend received GET /Admin
      // when the page reloaded and hit an unexpected redirect chain
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
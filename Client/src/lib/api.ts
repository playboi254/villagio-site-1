import axios, { InternalAxiosRequestConfig } from 'axios';

// ✅ FIXED: was localhost:3001 — your backend runs on 8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Type-safe — no more AxiosRequestHeaders error
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ✅ Type-safe — no more 'any' error
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search',
    BY_VENDOR: (vendorId: string) => `/products/vendor/${vendorId}`,
  },
  VENDORS: {
    LIST: '/vendors',
    DETAIL: (id: string) => `/vendors/${id}`,
    PRODUCTS: (id: string) => `/vendors/${id}/products`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    TRACK: (id: string) => `/orders/${id}/track`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  REVIEWS: {
    LIST: (productId: string) => `/products/${productId}/reviews`,
    CREATE: (productId: string) => `/products/${productId}/reviews`,
  },
  USERS: {
    AVATAR: '/users/profile/avatar',
    PROFILE: '/users/profile',
  },
};
import axios from 'axios';

// Define base URL for API requests
// Uses environment variable first, then fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dottie-api-zeta.vercel.app';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper methods for status code checking
export const isSuccess = (status: number) => status >= 200 && status < 300;
export const isClientError = (status: number) => status >= 400 && status < 500;
export const isServerError = (status: number) => status >= 500 && status < 600;

export default apiClient; 
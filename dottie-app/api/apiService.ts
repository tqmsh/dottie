import axios from 'axios';

// Define base URL for API requests
// Uses environment variable first, then fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dottie-api-zeta.vercel.app';

// Create axios instance with default config
const apiClient = axios.create({
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

// API service methods
export const apiService = {
  // Basic GET request
  async getMessage() {
    return apiClient.get('/api/message');
  },

  // DB connection check
  async checkDbConnection() {
    return apiClient.get('/api/db');
  },

  // Generic request methods
  async get(url: string, config = {}) {
    return apiClient.get(url, config);
  },

  async post(url: string, data = {}, config = {}) {
    return apiClient.post(url, data, config);
  },

  async put(url: string, data = {}, config = {}) {
    return apiClient.put(url, data, config);
  },

  async delete(url: string, config = {}) {
    return apiClient.delete(url, config);
  },
  
  // Method to check if a request was successful
  isSuccess(status: number) {
    return status >= 200 && status < 300;
  }
};

export default apiService; 
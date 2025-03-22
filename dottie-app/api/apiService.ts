import axios from 'axios';

// Define base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
};

export default apiService; 
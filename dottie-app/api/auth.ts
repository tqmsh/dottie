import axios from 'axios';
import { apiService } from './apiService';

// Simple authentication service for the test page
export const authService = {
  // Login and store token in localStorage
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await apiService.post('/api/auth/login', credentials);
      
      if (response.data && response.data.token) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user || { email: credentials.email }));
        
        // Add token to API service default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return response.data;
      }
      
      throw new Error('Invalid response format: token missing');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Clear token and user data
  logout() {
    try {
      // Call the logout endpoint if we're authenticated
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiService.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage and headers even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },
  
  // Get the current authentication token
  getToken() {
    return localStorage.getItem('auth_token');
  },
  
  // Add auth header to a request configuration
  addAuthHeader(config: any = {}) {
    const token = this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  }
}; 
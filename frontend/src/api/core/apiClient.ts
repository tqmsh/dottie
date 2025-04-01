import axios from 'axios';

/**
 * Axios instance for making API requests
 * This instance has all the common configurations and interceptors
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory backup storage in case localStorage is not available or blocked
const tokenStorage = {
  authToken: null as string | null,
  refreshToken: null as string | null,
};

// Initialize headers from localStorage if available
try {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('[API Client] Initialized with token from localStorage');
  } else {
    console.log('[API Client] No token found in localStorage during initialization');
  }
} catch (error) {
  console.error('[API Client] Error accessing localStorage:', error);
}

// Add a request interceptor to always try to include the latest token
apiClient.interceptors.request.use(
  (config) => {
    try {
      // Try to get token from localStorage first
      let token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
      
      // Fall back to in-memory storage if needed
      if (!token && tokenStorage.authToken) {
        token = tokenStorage.authToken;
        console.log('[API Client] Using in-memory token fallback');
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API Client] Error in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Stores an authentication token in both localStorage and memory
 * Handles errors gracefully if localStorage is not available
 */
export const setAuthToken = (token: string) => {
  if (!token) return;
  
  // Store in memory first as backup
  tokenStorage.authToken = token;
  
  // Try localStorage but don't break if it fails
  try {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('authToken', token);
    console.log('[API Client] Auth token stored successfully');
  } catch (e) {
    console.error('[API Client] Could not store token in localStorage:', e);
  }
  
  // Set for future API requests
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Stores a refresh token in both localStorage and memory
 * Handles errors gracefully if localStorage is not available
 */
export const setRefreshToken = (token: string) => {
  if (!token) return;
  
  // Store in memory as backup
  tokenStorage.refreshToken = token;
  
  // Try localStorage but don't break if it fails
  try {
    localStorage.setItem('refresh_token', token);
    localStorage.setItem('refreshToken', token);
    console.log('[API Client] Refresh token stored successfully');
  } catch (e) {
    console.error('[API Client] Could not store refresh token in localStorage:', e);
  }
};

// Add response interceptor for common error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with an error status
      console.error(`API Error: ${error.response.status}`, error.response.data);
      
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        // Remove token and redirect to login
        localStorage.removeItem('authToken');
        // Redirect logic would go here for a real app
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network Error:', error.request);
    } else {
      // Something else went wrong
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper functions to check response status
export const isSuccess = (status: number): boolean => status >= 200 && status < 300;
export const isClientError = (status: number): boolean => status >= 400 && status < 500;
export const isServerError = (status: number): boolean => status >= 500;

export { apiClient };
export default apiClient; 
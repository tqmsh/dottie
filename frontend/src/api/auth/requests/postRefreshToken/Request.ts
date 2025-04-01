import { apiClient } from "../../../core/apiClient";
import { AuthResponse } from "../../types";

/**
 * Refresh authentication token
 * @endpoint /api/auth/refresh (POST)
 */
export const postRefreshToken = async (): Promise<AuthResponse> => {
  try {
    // Get the current token from localStorage
    const currentToken = localStorage.getItem('authToken');
    
    if (!currentToken) {
      throw new Error('No authentication token found');
    }
    
    const response = await apiClient.post('/api/auth/refresh');
    
    // Update token in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export default postRefreshToken; 
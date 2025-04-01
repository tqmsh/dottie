import { apiClient } from "../../../core/apiClient";

/**
 * Logout the current user
 * @endpoint /api/auth/logout (POST)
 */
export const postLogout = async (): Promise<void> => {
  try {
    // Get the current token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Make sure to include the token in the request
    await apiClient.post('/api/auth/logout', {}, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
    
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    
    // Remove Authorization header
    delete apiClient.defaults.headers.common['Authorization'];
    
    return;
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Still remove token and headers locally on error
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
    
    throw error;
  }
};

export default postLogout; 
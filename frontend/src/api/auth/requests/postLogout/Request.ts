import { apiClient } from "../../../core/apiClient";

/**
 * Logout the current user
 * @endpoint /api/auth/logout (POST)
 */
export const postLogout = async (): Promise<void> => {
  try {
    // Get the current token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // Make sure to include the token in the request
    await apiClient.post('/api/auth/logout', {}, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
    
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    
    // Remove Authorization header
    delete apiClient.defaults.headers.common['Authorization'];
    
    return;
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Still remove token and headers locally on error
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
    
    throw error;
  }
};

export default postLogout; 
import { apiClient } from "../../../core/apiClient";
import { LoginInput, AuthResponse } from "../../types";

/**
 * Login user with credentials
 * @endpoint /api/auth/login (POST)
 */
export const postLogin = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    console.log('[Login Debug] Making login request with:', {
      email: credentials.email,
      hasPassword: !!credentials.password
    });
    
    const response = await apiClient.post('/api/auth/login', credentials);
    console.log('[Login Debug] Login response:', {
      status: response.status,
      hasToken: !!response.data.token,
      tokenPreview: response.data.token ? response.data.token.substring(0, 10) + '...' : 'none'
    });
    
    // Set the token in localStorage for global access
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      console.log('[Login Debug] Token stored in localStorage');
      
      // Add token to default headers for subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.log('[Login Debug] Token added to default headers');
    } else {
      console.error('[Login Debug] No token received in login response');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default postLogin; 
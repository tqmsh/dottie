import { apiClient } from "../../core/apiClient";
import { LoginInput, AuthResponse } from "../utils/types";

/**
 * Login user with credentials
 * @endpoint /api/auth/login (POST)
 */
export const postLogin = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);
    
    // Set the token in localStorage for global access
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      
      // Add token to default headers for subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default postLogin; 
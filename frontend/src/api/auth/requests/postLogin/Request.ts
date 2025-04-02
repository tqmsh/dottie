import { apiClient } from "../../../core/apiClient";
import { LoginInput, AuthResponse } from "../../types";
import { storeAuthData } from "../../../core/tokenManager";

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
    
    // Log entire response for debugging
    console.log('[Login Debug] FULL login response:', response);
    
    // Use the centralized token manager to handle token storage
    const success = storeAuthData(response.data);
    
    console.log('[Login Debug] Token storage result:', {
      success,
      responseDataKeys: Object.keys(response.data || {}),
      hasUserObject: !!response.data?.user,
      hasToken: !!response.data?.token,
      hasRefreshToken: !!response.data?.refreshToken
    });
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default postLogin; 
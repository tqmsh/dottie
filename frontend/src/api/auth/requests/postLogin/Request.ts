import { apiClient, setAuthToken, setRefreshToken } from "../../../core/apiClient";
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
    
    // Log entire response for debugging
    console.log('[Login Debug] FULL login response:', response);
    
    // Check all possible token field names in the response
    const possibleTokenFields = ['token', 'accessToken', 'jwt', 'access_token', 'auth_token', 'jwtToken'];
    const possibleRefreshTokenFields = ['refreshToken', 'refresh_token', 'refresh'];
    
    // Extract the token from the response using the first matching field name
    let token = null;
    let tokenFieldUsed = null;
    for (const field of possibleTokenFields) {
      if (response.data[field]) {
        token = response.data[field];
        tokenFieldUsed = field;
        break;
      }
    }
    
    // Extract refresh token if available
    let refreshToken = null;
    let refreshTokenFieldUsed = null;
    for (const field of possibleRefreshTokenFields) {
      if (response.data[field]) {
        refreshToken = response.data[field];
        refreshTokenFieldUsed = field;
        break;
      }
    }
    
    console.log('[Login Debug] Response data structure:', {
      keys: Object.keys(response.data || {}),
      hasUserObject: !!response.data?.user,
      userKeys: response.data?.user ? Object.keys(response.data.user) : 'no user object',
      tokenFieldFound: tokenFieldUsed,
      refreshTokenFieldFound: refreshTokenFieldUsed
    });
    
    console.log('[Login Debug] Login response extracted tokens:', {
      status: response.status,
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      tokenPreview: token ? token.substring(0, 10) + '...' : 'none'
    });
    
    // Store token if found under any field name
    if (token) {
      // Use the helper function that handles errors and fallbacks
      setAuthToken(token);
      
      // Verify storage worked immediately
      console.log('[Login Debug] Verification of token storage:', {
        'auth_token in localStorage': !!localStorage.getItem('auth_token'),
        'auth_token value': localStorage.getItem('auth_token')?.substring(0, 10) + '...'
      });
    } else {
      console.error('[Login Debug] No token found in any expected field of the response');
    }
    
    // Also store refresh token if available
    if (refreshToken) {
      setRefreshToken(refreshToken);
      console.log('[Login Debug] Refresh token stored using helper');
    }
    
    // Store user data if available
    if (response.data.user) {
      try {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        console.log('[Login Debug] User data stored in localStorage with keys: user, auth_user');
      } catch (e) {
        console.error('[Login Debug] Error storing user data:', e);
      }
    }
    
    // Dispatch event to notify other components about token change
    try {
      window.dispatchEvent(new Event('auth_token_changed'));
      console.log('[Login Debug] Dispatched auth_token_changed event');
    } catch (e) {
      console.error('[Login Debug] Error dispatching auth_token_changed event:', e);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default postLogin; 
/**
 * Frontend-only function to verify current token status
 * This doesn't make an API request but checks localStorage directly
 */
export default function getTokenVerification() {
  // Get token status from localStorage directly
  let authToken = null;
  let refreshToken = null;
  
  // Try to access localStorage safely (for tests and SSR environments)
  try {
    authToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  } catch (e) {
    console.warn('LocalStorage not available, using mock values');
  }
  
  return {
    data: {
      success: true,
      authTokenExists: !!authToken,
      refreshTokenExists: !!refreshToken,
      authTokenValue: authToken ? `${authToken.substring(0, 10)}...` : null,
      refreshTokenValue: refreshToken ? `${refreshToken.substring(0, 10)}...` : null
    }
  };
} 
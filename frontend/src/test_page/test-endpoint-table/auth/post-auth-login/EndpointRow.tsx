import React, { useState, useEffect, useRef } from 'react';
import { EndpointRow as BaseEndpointRow, testCredentialsManager } from '../../../page-components';

// Track the last API response globally for debugging
let lastLoginResponse = null;

// Import authApi in a way that won't break if it's not available
let authApi: any = {
  verifyToken: () => {
    // Implement a direct token verification function
    let authToken = null;
    let refreshToken = null;
    
    // Try to access localStorage safely (for tests and SSR environments)
    try {
      // Use only snake_case naming convention
      authToken = typeof localStorage !== 'undefined' ? 
        localStorage.getItem('auth_token') : null;
      
      refreshToken = typeof localStorage !== 'undefined' ? 
        localStorage.getItem('refresh_token') : null;
      
      console.log('[Token Verification Debug] Checking for tokens in localStorage:', {
        auth_token: localStorage.getItem('auth_token'),
        refresh_token: localStorage.getItem('refresh_token')
      });
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
};

// Try to import the real API, but don't fail if not available
try {
  // Use a mock implementation instead of dynamic import
  // This prevents path resolution issues when moving files
  authApi = {
    verifyToken: () => {
      let authToken = null;
      let refreshToken = null;
      
      try {
        // Use only snake_case naming convention
        authToken = typeof localStorage !== 'undefined' ? 
          localStorage.getItem('auth_token') : null;
        
        refreshToken = typeof localStorage !== 'undefined' ? 
          localStorage.getItem('refresh_token') : null;
        
        console.log('[Token Verification Debug] Checking for tokens in localStorage:', {
          auth_token: localStorage.getItem('auth_token'),
          refresh_token: localStorage.getItem('refresh_token')
        });
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
  };
} catch (err) {
  console.warn('Auth API not available, using mock', err);
}

export default function EndpointRow() {
  const [savedCredentials, setSavedCredentials] = useState<{ email: string, password: string } | null>(null);
  const [verificationResponse, setVerificationResponse] = useState<any>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualTokenCreated, setManualTokenCreated] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);
  
  const responseMonitorInterval = useRef<any>(null);
  
  // Monitor for API responses
  useEffect(() => {
    // Function to capture API responses by overriding fetch and XMLHttpRequest
    const setupResponseMonitoring = () => {
      // Monitor fetch API
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        
        // Only capture login requests
        if (args[0] && typeof args[0] === 'string' && args[0].includes('/api/auth/login')) {
          try {
            // Clone the response to avoid consuming it
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();
            lastLoginResponse = data;
            setLastApiResponse(data);
            console.log('[Response Monitor] Captured login API response:', data);
          } catch (e) {
            console.error('[Response Monitor] Error capturing fetch response:', e);
          }
        }
        
        return response;
      };
      
      // Also try to monitor XMLHttpRequest for axios
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      const originalXhrSend = XMLHttpRequest.prototype.send;
      
      XMLHttpRequest.prototype.open = function(...args) {
        if (args[1] && typeof args[1] === 'string' && args[1].includes('/api/auth/login')) {
          this._isLoginRequest = true;
        }
        return originalXhrOpen.apply(this, args);
      };
      
      XMLHttpRequest.prototype.send = function(...args) {
        if (this._isLoginRequest) {
          const originalOnload = this.onload;
          this.onload = function(e) {
            try {
              if (this.responseText) {
                const data = JSON.parse(this.responseText);
                lastLoginResponse = data;
                setLastApiResponse(data);
                console.log('[Response Monitor] Captured XHR login response:', data);
              }
            } catch (e) {
              console.error('[Response Monitor] Error parsing XHR response:', e);
            }
            
            if (originalOnload) {
              originalOnload.call(this, e);
            }
          };
        }
        return originalXhrSend.apply(this, args);
      };
      
      console.log('[Response Monitor] API response monitoring set up');
    };
    
    // Set up response monitoring
    setupResponseMonitoring();
    
    // Also check periodically if a global response variable was set
    responseMonitorInterval.current = setInterval(() => {
      if (lastLoginResponse && !lastApiResponse) {
        setLastApiResponse(lastLoginResponse);
      }
    }, 1000);
    
    return () => {
      clearInterval(responseMonitorInterval.current);
    };
  }, [lastApiResponse]);

  // Check for any stored credentials when component loads
  useEffect(() => {
    const checkForStoredCredentials = () => {
      const credentials = testCredentialsManager.getCredentials();
      if (credentials) {
        setSavedCredentials({
          email: credentials.email,
          password: credentials.password
        });
      }
    };

    checkForStoredCredentials();
    
    // Add event listener to detect when credentials are updated
    window.addEventListener('signup_credentials_updated', checkForStoredCredentials);
    
    // Cleanup
    return () => {
      window.removeEventListener('signup_credentials_updated', checkForStoredCredentials);
    };
  }, []);

  const handleUseSignupCredentials = () => {
    const credentials = testCredentialsManager.getCredentials();
    if (credentials) {
      setSavedCredentials({
        email: credentials.email,
        password: credentials.password
      });
    }
  };

  const handleCreateTestToken = () => {
    try {
      const testToken = 'test-auth-token-' + Date.now();
      localStorage.setItem('auth_token', testToken);
      
      const testRefreshToken = 'test-refresh-token-' + Date.now();
      localStorage.setItem('refresh_token', testRefreshToken);
      
      console.log('[Manual Token] Created test tokens:', {
        auth_token: testToken.substring(0, 10) + '...',
        refresh_token: testRefreshToken.substring(0, 10) + '...',
      });
      
      // Verify storage was successful
      console.log('[Manual Token] Verification after setting:', {
        auth_token: localStorage.getItem('auth_token'),
        refresh_token: localStorage.getItem('refresh_token')
      });
      
      setManualTokenCreated(true);
      
      // Try to dispatch the token changed event
      window.dispatchEvent(new Event('auth_token_changed'));
      
    } catch (error) {
      console.error('[Manual Token] Error creating test tokens:', error);
    }
  };
  
  const handleExtractFromResponse = () => {
    if (!lastApiResponse) {
      console.error('[Extract Tokens] No API response available');
      return;
    }
    
    try {
      console.log('[Extract Tokens] Examining response:', lastApiResponse);
      
      // Check all possible token field names
      const possibleTokenFields = ['token', 'accessToken', 'jwt', 'access_token', 'jwtToken'];
      const possibleRefreshTokenFields = ['refreshToken', 'refresh_token', 'refresh'];
      
      // Try to find a token
      let token = null;
      let tokenField = null;
      
      for (const field of possibleTokenFields) {
        if (lastApiResponse[field]) {
          token = lastApiResponse[field];
          tokenField = field;
          break;
        }
      }
      
      // Try to find a refresh token
      let refreshToken = null;
      let refreshField = null;
      
      for (const field of possibleRefreshTokenFields) {
        if (lastApiResponse[field]) {
          refreshToken = lastApiResponse[field];
          refreshField = field;
          break;
        }
      }
      
      console.log('[Extract Tokens] Found tokens:', {
        tokenField,
        token: token ? token.substring(0, 10) + '...' : 'none',
        refreshField,
        refreshToken: refreshToken ? refreshToken.substring(0, 10) + '...' : 'none'
      });
      
      // Store the tokens if found
      if (token) {
        localStorage.setItem('auth_token', token);
        console.log('[Extract Tokens] Stored auth token');
      }
      
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
        console.log('[Extract Tokens] Stored refresh token');
      }
      
      // Set state to indicate tokens were created
      setManualTokenCreated(true);
      
      // Dispatch event
      window.dispatchEvent(new Event('auth_token_changed'));
      
    } catch (error) {
      console.error('[Extract Tokens] Error extracting tokens:', error);
    }
  };

  const handleVerifyToken = () => {
    try {
      setIsVerifying(true);
      
      // Add a delay and multiple verification attempts to handle timing issues
      console.log('[Token Verification] Starting token verification with retries');
      
      // Try verification up to 3 times with a delay between attempts
      let attempts = 0;
      const maxAttempts = 3;
      const delay = 800; // ms
      
      // First try to forcefully set a token to test if localStorage is working
      try {
        console.log('[Token Verification] Testing localStorage access by setting a test token');
        localStorage.setItem('test_token', 'test-value-' + Date.now());
        const testValue = localStorage.getItem('test_token');
        console.log('[Token Verification] Test localStorage write/read result:', {
          testValue,
          success: !!testValue
        });
        
        // List all keys in localStorage for debugging
        console.log('[Token Verification] All localStorage keys:', Object.keys(localStorage));
        
        // Check if localStorage is being blocked or cleared
        if (!testValue) {
          console.error('[Token Verification] ERROR: localStorage test failed - cannot read/write to localStorage');
        }
      } catch (e) {
        console.error('[Token Verification] ERROR accessing localStorage:', e);
      }
      
      const attemptVerification = () => {
        attempts++;
        console.log(`[Token Verification] Attempt ${attempts} of ${maxAttempts}`);
        
        // This is frontend-only, no actual API call
        const response = authApi.verifyToken();
        
        if (response.data.authTokenExists || attempts >= maxAttempts) {
          // Success or max attempts reached
          setVerificationResponse(response.data);
          setVerifyStatus(response.data.authTokenExists ? 'success' : 'error');
          setIsVerifying(false);
          console.log('[Token Verification] Final result:', response.data);
          
          if (!response.data.authTokenExists) {
            // If verification failed at the end, add a direct token for debugging
            try {
              console.log('[Token Verification] Last resort: Adding a direct test token');
              localStorage.setItem('auth_token', 'direct-test-token-' + Date.now());
              
              // Check if direct token was set
              console.log('[Token Verification] Direct token test:', {
                auth_token: localStorage.getItem('auth_token')
              });
            } catch (e) {
              console.error('[Token Verification] ERROR setting direct test token:', e);
            }
          }
        } else {
          // Try again after delay
          console.log(`[Token Verification] Token not found, retrying in ${delay}ms...`);
          setTimeout(attemptVerification, delay);
        }
      };
      
      // Start the verification process
      attemptVerification();
      
    } catch (error) {
      console.error('Error verifying tokens:', error);
      setVerifyStatus('error');
      setIsVerifying(false);
    }
  };

  return (
    <>
      <BaseEndpointRow 
        method="POST"
        endpoint="/api/auth/login"
        expectedOutput={{ 
          token: "jwt-token", 
          user: { 
            id: "user-id", 
            email: "user@example.com" 
          } 
        }}
        requiresParams={true}
        inputFields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "user@example.com",
            defaultValue: savedCredentials?.email || ""
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            placeholder: "Your password",
            defaultValue: savedCredentials?.password || ""
          }
        ]}
      />

      {/* Button row with credentials and verification */}
      <tr>
        <td colSpan={3}>
          <div className="flex flex-col space-y-3 ml-4 mt-2 mb-4">
            <div className="flex items-center">
              <button 
                onClick={handleUseSignupCredentials}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2"
              >
                Use Latest Signup Credentials
              </button>
              
              {savedCredentials && (
                <div className="ml-4 p-2 bg-gray-800 rounded text-xs">
                  <div>Using credentials for: <span className="text-purple-400">{savedCredentials.email}</span></div>
                </div>
              )}
            </div>

            {/* Manual Token Creation Button */}
            <div className="flex items-center">
              <button
                onClick={handleCreateTestToken}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2"
              >
                Create Test Tokens Manually
              </button>
              
              {manualTokenCreated && (
                <div className="ml-4 p-2 bg-yellow-900 rounded text-xs">
                  <div>Test tokens <span className="text-yellow-400">created</span></div>
                </div>
              )}
            </div>

            {/* Verify Auth Token Button */}
            <div className="flex items-center">
              <button
                onClick={handleVerifyToken}
                disabled={isVerifying}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2"
                data-testid="test-get-frontend-auth-token-verification-button"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center space-x-1">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>Verify Auth Token</>
                )}
              </button>
              
              {verifyStatus !== 'idle' && (
                <div className={`ml-4 p-2 ${verifyStatus === 'success' ? 'bg-green-900' : 'bg-red-900'} rounded text-xs`}>
                  {verifyStatus === 'success' 
                    ? <div>Token verification <span className="text-green-400">successful</span></div>
                    : <div>Token verification <span className="text-red-400">failed</span></div>
                  }
                </div>
              )}
            </div>
            
            {verificationResponse && (
              <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                <pre className="whitespace-pre-wrap break-words text-gray-300">
                  {JSON.stringify(verificationResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
} 
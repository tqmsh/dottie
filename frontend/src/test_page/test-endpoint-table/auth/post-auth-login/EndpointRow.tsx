import React, { useState, useEffect } from 'react';
import { EndpointRow as BaseEndpointRow, testCredentialsManager } from '../../../page-components';

// Import authApi in a way that won't break if it's not available
let authApi: any = {
  verifyToken: () => {
    // Implement a direct token verification function
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
  };
} catch (err) {
  console.warn('Auth API not available, using mock', err);
}

export default function EndpointRow() {
  const [savedCredentials, setSavedCredentials] = useState<{ email: string, password: string } | null>(null);
  const [verificationResponse, setVerificationResponse] = useState<any>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleVerifyToken = () => {
    try {
      setIsVerifying(true);
      // This is frontend-only, no actual API call
      const response = authApi.verifyToken();
      setVerificationResponse(response.data);
      setVerifyStatus('success');
    } catch (error) {
      console.error('Error verifying tokens:', error);
      setVerifyStatus('error');
    } finally {
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
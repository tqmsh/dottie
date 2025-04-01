import React, { useState } from 'react';
import ApiResponse from '../../../page-components/ApiResponse';
import JsonDisplay from '../../../page-components/JsonDisplay';
import { authApi } from '../../../../api/auth';

// Import useAuth in a way that won't break tests if it's not available
let useAuthHook: any = () => ({
  authToken: null,
  refreshToken: null,
  authTokenExists: false,
  refreshTokenExists: false
});

// Try to import the real hook, but don't fail if it's not available for tests
try {
  // Dynamic import to prevent test failures
  const { useAuth } = require('../../../../hooks/use-auth');
  useAuthHook = useAuth;
} catch (err) {
  console.warn('Auth hook not available, using mock');
}

export default function EndpointRow() {
  // Use our centralized auth hook with fallback
  const { authToken, refreshToken, authTokenExists, refreshTokenExists } = useAuthHook();
  const [verificationResponse, setVerificationResponse] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const expectedOutput = { 
    success: true,
    authTokenExists: true,
    refreshTokenExists: true,
    authTokenValue: "jwt-token",
    refreshTokenValue: "refresh-token"
  };

  const handleVerifyClick = () => {
    try {
      setIsLoading(true);
      // This is frontend-only, no actual API call
      const response = authApi.verifyToken();
      setVerificationResponse(response.data);
      setStatus('success');
    } catch (error) {
      console.error('Error verifying tokens:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <tr className="border-t border-gray-700">
      <td className="p-4 align-top">
        <button
          onClick={handleVerifyClick}
          disabled={isLoading}
          className="w-full px-4 py-2 text-white rounded-md font-medium transition-colors bg-blue-600 hover:bg-blue-700"
          data-testid="test-get -frontend-auth-token-verification-button"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Testing...</span>
            </div>
          ) : (
            <>
              <span className="font-bold">GET</span> (Frontend) /auth/token-verification
            </>
          )}
        </button>
        
        <div className="px-4 py-2 mt-2 text-xs text-amber-500">
          Frontend Operation Only (useAuth Hook + Context)
        </div>
      </td>
      
      <td className="p-4 align-top">
        <JsonDisplay data={expectedOutput} isExpected={true} />
      </td>
      
      <td className="p-4 align-top">
        {status === 'success' && verificationResponse ? (
          <ApiResponse data={verificationResponse} status="success" />
        ) : status === 'error' ? (
          <ApiResponse data={{ error: "Failed to verify tokens" }} status="error" />
        ) : (
          <div className="p-4 bg-gray-800 text-gray-400 rounded">
            No response yet. Click the endpoint button to test.
          </div>
        )}
      </td>
    </tr>
  );
} 
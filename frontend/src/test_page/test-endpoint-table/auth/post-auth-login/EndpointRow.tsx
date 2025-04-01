import React, { useState, useEffect } from 'react';
import { EndpointRow as BaseEndpointRow, testCredentialsManager } from '../../../page-components';

export default function EndpointRow() {
  const [savedCredentials, setSavedCredentials] = useState<{ email: string, password: string } | null>(null);

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

      {/* Button to use credentials from signup */}
      <tr>
        <td colSpan={3}>
          <div className="flex items-center ml-4 mt-2 mb-4">
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
        </td>
      </tr>
    </>
  );
} 
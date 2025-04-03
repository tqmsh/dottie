import React, { useState, useEffect } from 'react';
import EndpointButton from './EndpointButton';
import JsonDisplay from './JsonDisplay';
import ApiResponse from './ApiResponse';
import InputForm from './InputForm';
import { apiClient } from '../../api';
import { authApi } from '../../api/auth';

interface InputField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'json';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

interface EndpointRowProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  expectedOutput: any;
  requiresAuth?: boolean;
  requiresParams?: boolean;
  inputFields?: InputField[];
  pathParams?: string[];
  onCustomButtonClick?: () => void;
}

/**
 * A reusable row component for an API endpoint
 */
export default function EndpointRow({
  method,
  endpoint,
  expectedOutput,
  requiresAuth = false,
  requiresParams = false,
  inputFields = [],
  pathParams = [],
  onCustomButtonClick,
}: EndpointRowProps) {
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'partial'>('idle');
  const [showInputForm, setShowInputForm] = useState(false);
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  // Prepare path parameters input fields
  const pathParamFields: InputField[] = pathParams.map(param => ({
    name: param,
    label: `${param} (path parameter)`,
    type: 'text',
    required: true,
    placeholder: `Enter value for ${param}`,
  }));

  // Replace path parameters in endpoint
  const getProcessedEndpoint = () => {
    let processedEndpoint = endpoint;
    console.log('Processing endpoint:', endpoint);
    console.log('Path params:', pathParams);
    console.log('Path param values:', pathParamValues);
    
    pathParams.forEach(param => {
      if (pathParamValues[param]) {
        console.log(`Replacing :${param} with ${pathParamValues[param]}`);
        processedEndpoint = processedEndpoint.replace(`:${param}`, pathParamValues[param]);
      } else {
        console.log(`No value provided for path parameter :${param}`);
      }
    });
    
    console.log('Processed endpoint:', processedEndpoint);
    return processedEndpoint;
  };

  const handleApiCall = async (formData?: Record<string, any>) => {
    setIsLoading(true);
    setStatus('idle');
    setAuthError(false);
    
    try {
      let result;
      const processedEndpoint = getProcessedEndpoint();
      console.log('API Call - Method:', method);
      console.log('API Call - Original endpoint:', endpoint);
      console.log('API Call - Processed endpoint:', processedEndpoint);
      console.log('API Call - Form data:', formData);
      
      // Check authentication if required - special case for logout which should still work
      if (requiresAuth && !localStorage.getItem('authToken') && endpoint !== '/api/auth/logout') {
        setAuthError(true);
        throw new Error('Authentication required. Please login first.');
      }
      
      // API client already handles auth headers through interceptors
      
      // Make appropriate API call based on method
      switch (method) {
        case 'GET':
          console.log('Making GET request to:', processedEndpoint);
          result = await apiClient.get(processedEndpoint);
          break;
        case 'POST':
          // Special case for logout endpoint
          if (endpoint === '/api/auth/logout') {
            try {
              // Get tokens before clearing storage
              const refreshToken = localStorage.getItem("refresh_token");
              const authToken = localStorage.getItem("authToken");
              
              console.log('[Logout Debug] Current tokens:', { 
                authTokenExists: !!authToken, 
                refreshTokenExists: !!refreshToken,
                authToken: authToken?.substring(0, 10) + '...',
                refreshToken: refreshToken?.substring(0, 10) + '...'
              });
              
              // Try the API call with the tokens we have
              try {
                // Set up the headers directly for this call
                const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
                console.log('[Logout Debug] Making API call with:', { 
                  headers,
                  refreshToken: refreshToken ? true : false,
                  endpoint: processedEndpoint 
                });
                
                // Directly use axios to have more control over the request
                const response = await fetch(processedEndpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
                  },
                  body: JSON.stringify({ refreshToken })
                });
                
                console.log('[Logout Debug] API response:', { 
                  status: response.status,
                  statusText: response.statusText
                });
                
                if (response.ok) {
                  console.log('[Logout Debug] Logout API call succeeded');
                } else {
                  const errorData = await response.json();
                  console.log('[Logout Debug] API error data:', errorData);
                }
              } catch (error: any) {
                console.log("[Logout Debug] API call error:", error);
              }
              
              // Clear local storage tokens after API call attempt
              console.log('[Logout Debug] Clearing local storage tokens');
              localStorage.removeItem("authToken");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("auth_user");
              
              result = { data: { message: "Logged out successfully" } };
            } catch (error) {
              console.error("[Logout Debug] Error during logout:", error);
              throw error;
            }
          } else {
            result = await apiClient.post(processedEndpoint, formData || {});
          }
          break;
        case 'PUT':
          console.log('Making PUT request to:', processedEndpoint, 'with data:', formData);
          result = await apiClient.put(processedEndpoint, formData || {});
          break;
        case 'DELETE':
          console.log('Making DELETE request to:', processedEndpoint);
          result = await apiClient.delete(processedEndpoint);
          break;
      }
      
      console.log('API Call - Success response:', result.data);
      setResponse(result.data);
      setStatus('success');
      
      // Hide form after successful call
      if (requiresParams) {
        setShowInputForm(false);
      }
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      setResponse(error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    // If a custom handler is provided, use that instead
    if (onCustomButtonClick) {
      onCustomButtonClick();
      return;
    }
    
    // If this endpoint requires parameters, show the form instead of making API call
    if ((requiresParams && inputFields.length > 0) || pathParams.length > 0) {
      setShowInputForm(true);
    } else {
      handleApiCall();
    }
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    console.log('Form submit with data:', formData);
    
    // Extract path parameters if needed
    if (pathParams.length > 0) {
      const newPathParamValues: Record<string, string> = {};
      pathParams.forEach(param => {
        if (formData[param]) {
          console.log(`Extracting path param ${param} with value ${formData[param]}`);
          newPathParamValues[param] = formData[param];
          delete formData[param]; // Remove from form data
        } else {
          console.log(`Path param ${param} not found in form data`);
        }
      });
      console.log('Setting path param values:', newPathParamValues);
      setPathParamValues(newPathParamValues);
    }
    
    console.log('Calling API with form data:', formData);
    handleApiCall(formData);
  };

  const handlePathParamSubmit = (formData: Record<string, any>) => {
    console.log('Path param submit with data:', formData);
    setPathParamValues(formData);
    
    // If no other parameters are needed, make the call
    if (!requiresParams || inputFields.length === 0) {
      console.log('No additional params needed, making API call');
      handleApiCall();
    } else {
      // Otherwise keep the form open for body parameters
      console.log('Keeping form open for body parameters');
      setShowInputForm(true);
    }
  };

  return (
    <tr className="border-t border-gray-700">
      <td className="p-4 align-top">
        <div className="space-y-3">
          <EndpointButton
            label={`${method} ${endpoint}`}
            method={method}
            onClick={handleButtonClick}
            status={status}
            isLoading={isLoading}
          />
          
          {requiresAuth && !isAuthenticated && (
            <div className={`text-xs ${authError ? 'text-red-400' : 'text-yellow-400'} mt-1`}>
              {authError 
                ? 'Authentication required. Please login first.' 
                : 'Requires authentication'}
            </div>
          )}
          
          {/* Show path parameter form if needed */}
          {showInputForm && pathParams.length > 0 && (
            <InputForm
              fields={pathParamFields}
              onSubmit={handlePathParamSubmit}
              submitLabel="Set Path Parameters"
              isLoading={isLoading}
            />
          )}
          
          {/* Show input form for request body if needed */}
          {showInputForm && requiresParams && inputFields.length > 0 && (
            <div className="mt-3">
              <InputForm
                fields={inputFields}
                onSubmit={handleFormSubmit}
                submitLabel={`Send ${method} Request`}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </td>
      
      <td className="p-4 align-top">
        <JsonDisplay data={expectedOutput} isExpected={true} />
      </td>
      
      <td className="p-4 align-top">
        <ApiResponse data={response} status={status} />
      </td>
    </tr>
  );
} 
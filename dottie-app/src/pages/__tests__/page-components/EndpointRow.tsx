import React, { useState, useEffect } from 'react';
import EndpointButton from './EndpointButton';
import JsonDisplay from './JsonDisplay';
import ApiResponse from './ApiResponse';
import InputForm from './InputForm';
import { apiClient } from '../../../api';
import { authApi } from '../../../api/auth';

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
    const token = localStorage.getItem('auth_token');
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
    pathParams.forEach(param => {
      if (pathParamValues[param]) {
        processedEndpoint = processedEndpoint.replace(`:${param}`, pathParamValues[param]);
      }
    });
    return processedEndpoint;
  };

  const handleApiCall = async (formData?: Record<string, any>) => {
    setIsLoading(true);
    setStatus('idle');
    setAuthError(false);
    
    try {
      let result;
      const processedEndpoint = getProcessedEndpoint();
      
      // Check authentication if required - special case for logout which should still work
      if (requiresAuth && !localStorage.getItem('auth_token') && endpoint !== '/api/auth/logout') {
        setAuthError(true);
        throw new Error('Authentication required. Please login first.');
      }
      
      // API client already handles auth headers through interceptors
      
      // Make appropriate API call based on method
      switch (method) {
        case 'GET':
          result = await apiClient.get(processedEndpoint);
          break;
        case 'POST':
          // Special case for logout endpoint
          if (endpoint === '/api/auth/logout') {
            try {
              // Clear local storage tokens first
              localStorage.removeItem("auth_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("auth_user");
              
              // Try the API call but don't fail if it returns 401
              try {
                await apiClient.post(processedEndpoint);
              } catch (error) {
                // Ignore 401 errors during logout
                console.log("Logout API call failed, but local tokens were cleared");
              }
              
              result = { data: { message: "Logged out successfully" } };
            } catch (error) {
              console.error("Error during logout:", error);
              throw error;
            }
          } else {
            result = await apiClient.post(processedEndpoint, formData || {});
          }
          break;
        case 'PUT':
          result = await apiClient.put(processedEndpoint, formData || {});
          break;
        case 'DELETE':
          result = await apiClient.delete(processedEndpoint);
          break;
      }
      
      setResponse(result.data);
      setStatus('success');
      
      // Hide form after successful call
      if (requiresParams) {
        setShowInputForm(false);
      }
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      setResponse(error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    // If this endpoint requires parameters, show the form instead of making API call
    if ((requiresParams && inputFields.length > 0) || pathParams.length > 0) {
      setShowInputForm(true);
    } else {
      handleApiCall();
    }
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    // Extract path parameters if needed
    if (pathParams.length > 0) {
      const newPathParamValues: Record<string, string> = {};
      pathParams.forEach(param => {
        if (formData[param]) {
          newPathParamValues[param] = formData[param];
          delete formData[param]; // Remove from form data
        }
      });
      setPathParamValues(newPathParamValues);
    }
    
    handleApiCall(formData);
  };

  const handlePathParamSubmit = (formData: Record<string, any>) => {
    setPathParamValues(formData);
    
    // If no other parameters are needed, make the call
    if (!requiresParams || inputFields.length === 0) {
      handleApiCall();
    } else {
      // Otherwise keep the form open for body parameters
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
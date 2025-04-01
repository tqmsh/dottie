import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';
import ApiResponse from '../../../page-components/ApiResponse';
import { useAuth } from '../../../../hooks/use-auth';

export default function EndpointRow() {
  // Use our centralized auth hook
  const { authToken, refreshToken, authTokenExists, refreshTokenExists } = useAuth();
  
  return (
    <div>
      <BaseEndpointRow 
        method="GET"
        endpoint="(Frontend) /auth/token-verification"
        expectedOutput={{ 
          success: true,
          authTokenExists: true,
          refreshTokenExists: true,
          authTokenValue: "jwt-token",
          refreshTokenValue: "refresh-token"
        }}
        requiresParams={false}
      />
      
      <div className="px-4 py-2 mt-2">
        <div className="text-sm font-medium text-amber-500 mb-2">
          Frontend Operation Only (useAuth Hook + Context)
        </div>
        <div className="text-sm text-gray-300 mb-2">Current Token Status:</div>
        <ApiResponse
          data={{
            authTokenExists,
            refreshTokenExists,
            authToken: authToken ? `${authToken.substring(0, 10)}...` : null,
            refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null
          }}
          status="success"
        />
      </div>
    </div>
  );
} 
import React from 'react';
import { EndpointTable, EndpointRow } from '../../page-components';

/**
 * Container component for authentication endpoints
 */
export default function AuthEndpoints() {
  return (
    <EndpointTable title="Authentication Endpoints">
      <EndpointRow 
        method="POST"
        endpoint="/api/auth/signup"
        expectedOutput={{ 
          user: { 
            id: "user-id", 
            email: "user@example.com" 
          }, 
          token: "jwt-token" 
        }}
        requiresParams={true}
        inputFields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "user@example.com"
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            placeholder: "Min 6 characters"
          },
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
            placeholder: "Your name"
          }
        ]}
      />
      <EndpointRow 
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
            placeholder: "user@example.com"
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            placeholder: "Your password"
          }
        ]}
      />
      <EndpointRow 
        method="POST"
        endpoint="/api/auth/logout"
        expectedOutput={{ message: "Logged out successfully" }}
        requiresAuth={true}
      />
    </EndpointTable>
  );
} 
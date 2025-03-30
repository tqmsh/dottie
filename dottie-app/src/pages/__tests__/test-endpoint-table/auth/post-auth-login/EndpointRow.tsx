import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
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
  );
} 
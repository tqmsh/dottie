import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
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
  );
} 
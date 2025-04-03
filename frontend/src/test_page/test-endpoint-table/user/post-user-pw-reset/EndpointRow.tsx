import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="POST"
      endpoint="/api/user/pw/reset"
      expectedOutput={{ message: "If a user with that email exists, a password reset link has been sent" }}
      requiresParams={true}
      inputFields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "user@example.com"
        }
      ]}
    />
  );
} 
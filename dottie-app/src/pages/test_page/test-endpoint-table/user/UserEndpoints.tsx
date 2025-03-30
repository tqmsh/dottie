import React from 'react';
import { EndpointTable, EndpointRow } from '../../page-components';

/**
 * Container component for user endpoints
 */
export default function UserEndpoints() {
  return (
    <EndpointTable title="User Endpoints">
      <EndpointRow 
        method="GET"
        endpoint="/api/user/me"
        expectedOutput={{ 
          id: "user-id", 
          email: "user@example.com", 
          name: "User Name"
        }}
        requiresAuth={true}
      />
      <EndpointRow 
        method="GET"
        endpoint="/api/user/:id"
        expectedOutput={{ 
          id: "user-id", 
          email: "user@example.com", 
          name: "User Name"
        }}
        requiresAuth={true}
        pathParams={["id"]}
      />
      <EndpointRow 
        method="PUT"
        endpoint="/api/user/:id"
        expectedOutput={{ message: "User updated" }}
        requiresAuth={true}
        pathParams={["id"]}
        requiresParams={true}
        inputFields={[
          {
            name: "userData",
            label: "User Data",
            type: "json",
            required: true,
            defaultValue: JSON.stringify({
              name: "Updated Name",
              email: "updated@example.com"
            }, null, 2)
          }
        ]}
      />
      <EndpointRow 
        method="DELETE"
        endpoint="/api/user/:id"
        expectedOutput={{ message: "User deleted" }}
        requiresAuth={true}
        pathParams={["id"]}
      />
      <EndpointRow 
        method="POST"
        endpoint="/api/user/pw/reset"
        expectedOutput={{ message: "Password reset email sent" }}
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
      <EndpointRow 
        method="POST"
        endpoint="/api/user/pw/update"
        expectedOutput={{ message: "Password updated successfully" }}
        requiresAuth={true}
        requiresParams={true}
        inputFields={[
          {
            name: "currentPassword",
            label: "Current Password",
            type: "password",
            required: true
          },
          {
            name: "newPassword",
            label: "New Password",
            type: "password",
            required: true
          }
        ]}
      />
    </EndpointTable>
  );
} 
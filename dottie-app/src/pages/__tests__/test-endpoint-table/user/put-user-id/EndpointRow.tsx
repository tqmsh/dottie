import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
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
  );
} 
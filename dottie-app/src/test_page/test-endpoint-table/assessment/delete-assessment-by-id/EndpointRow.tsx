import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="DELETE"
      endpoint="/api/assessment/:id"
      expectedOutput={{ message: "Assessment deleted" }}
      requiresAuth={true}
      pathParams={["id"]}
    />
  );
} 
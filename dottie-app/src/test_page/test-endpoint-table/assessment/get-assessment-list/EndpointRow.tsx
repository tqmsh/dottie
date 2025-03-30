import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="GET"
      endpoint="/api/assessment/list"
      expectedOutput={[
        { id: "assessment-1", date: "2023-06-15" },
        { id: "assessment-2", date: "2023-06-20" }
      ]}
      requiresAuth={true}
    />
  );
} 
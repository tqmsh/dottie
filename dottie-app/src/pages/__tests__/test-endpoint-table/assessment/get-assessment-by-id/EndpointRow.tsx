import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="GET"
      endpoint="/api/assessment/:id"
      expectedOutput={{ 
        id: "assessment-id", 
        data: { 
          age: "18_24", 
          symptoms: {
            physical: ["Bloating"],
            emotional: ["Mood swings"]
          }
        }
      }}
      requiresAuth={true}
      pathParams={["id"]}
    />
  );
} 
import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="PUT"
      endpoint="/api/assessment/:id"
      expectedOutput={{ message: "Assessment updated" }}
      requiresAuth={true}
      pathParams={["id"]}
      requiresParams={true}
      inputFields={[
        {
          name: "assessmentData",
          label: "Updated Assessment Data",
          type: "json",
          required: true,
          defaultValue: JSON.stringify({
            flowHeaviness: "heavy",
            painLevel: "severe"
          }, null, 2)
        }
      ]}
    />
  );
} 
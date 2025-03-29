import React from 'react';
import { EndpointTable, EndpointRow } from '../../page-components';

/**
 * Container component for assessment endpoints
 */
export default function AssessmentEndpoints() {
  return (
    <EndpointTable title="Assessment Endpoints">
      <EndpointRow 
        method="POST"
        endpoint="/api/assessment/send"
        expectedOutput={{ 
          id: "assessment-id", 
          message: "Assessment saved" 
        }}
        requiresAuth={true}
        requiresParams={true}
        inputFields={[
          {
            name: "assessmentData",
            label: "Assessment Data",
            type: "json",
            required: true,
            defaultValue: JSON.stringify({
              age: "18_24",
              cycleLength: "26_30",
              periodDuration: "4_5",
              flowHeaviness: "moderate",
              painLevel: "moderate",
              symptoms: {
                physical: ["Bloating", "Headaches"],
                emotional: ["Mood swings", "Irritability"]
              }
            }, null, 2)
          }
        ]}
      />
      <EndpointRow 
        method="GET"
        endpoint="/api/assessment/list"
        expectedOutput={[
          { id: "assessment-1", date: "2023-06-15" },
          { id: "assessment-2", date: "2023-06-20" }
        ]}
        requiresAuth={true}
      />
      <EndpointRow 
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
      <EndpointRow 
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
      <EndpointRow 
        method="DELETE"
        endpoint="/api/assessment/:id"
        expectedOutput={{ message: "Assessment deleted" }}
        requiresAuth={true}
        pathParams={["id"]}
      />
    </EndpointTable>
  );
} 
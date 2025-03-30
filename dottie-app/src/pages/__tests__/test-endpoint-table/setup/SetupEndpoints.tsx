import React from 'react';
import { EndpointTable, EndpointRow } from '../../page-components';

/**
 * Container component for setup endpoints
 */
export default function SetupEndpoints() {
  return (
    <EndpointTable title="Setup Endpoints">
      <EndpointRow 
        method="GET"
        endpoint="/api/setup/health/hello"
        expectedOutput={{ message: "Hello World from Dottie API!" }}
      />
      <EndpointRow 
        method="GET"
        endpoint="/api/setup/database/status"
        expectedOutput={{ status: "connected" }}
      />
      <EndpointRow 
        method="GET"
        endpoint="/api/setup/database/hello"
        expectedOutput={{ 
          message: "Hello World from SQLite!", 
          dbType: "sqlite3", 
          isConnected: true 
        }}
      />
    </EndpointTable>
  );
} 
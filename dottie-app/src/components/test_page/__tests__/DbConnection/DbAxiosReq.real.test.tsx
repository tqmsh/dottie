import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { isDbApiRunning, conditionalDbTest, dbClient, ensureDbApiRunning } from './db-test-setup';

describe('DbAxiosReq (Real)', () => {
  let dbApiAvailable = false;

  beforeAll(async () => {
    // Try to ensure DB API is running before tests
    dbApiAvailable = await ensureDbApiRunning();
    if (!dbApiAvailable) {
      console.log('⚠️ DB API is not available. Some tests will be skipped.');
    } else {
      console.log('✅ DB API is available. Running real DB API tests.');
    }
  });

  beforeEach(() => {
    // No mocks to clear
  });

  it('makes real request to sql-hello endpoint',
    conditionalDbTest('makes real request to sql-hello endpoint', async () => {
      // Execute
      const response = await dbClient.get('/api/sql-hello');
      
      // Verify
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('dbType');
      expect(response.data).toHaveProperty('isConnected');
      
      // Log actual response for debugging
      console.log('SQL hello response:', {
        message: response.data.message,
        dbType: response.data.dbType,
        isConnected: response.data.isConnected
      });
    })
  );

  it('makes real request to db-status endpoint',
    conditionalDbTest('makes real request to db-status endpoint', async () => {
      // Execute
      const response = await dbClient.get('/api/db-status');
      
      // Verify
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status');
      
      // Log actual response for debugging
      console.log('DB status response:', {
        status: response.data.status
      });
    })
  );

  it('handles non-existent endpoint correctly',
    conditionalDbTest('handles non-existent endpoint correctly', async () => {
      try {
        // Execute request to non-existent endpoint
        await dbClient.get('/api/db-non-existent');
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // Verify
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(404);
        
        // Log error for debugging
        console.log('Non-existent endpoint error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
    })
  );

  it('runs parallel requests to both endpoints',
    conditionalDbTest('runs parallel requests to both endpoints', async () => {
      // Execute parallel requests
      const [sqlResponse, statusResponse] = await Promise.all([
        dbClient.get('/api/sql-hello'),
        dbClient.get('/api/db-status')
      ]);
      
      // Verify
      expect(sqlResponse.status).toBe(200);
      expect(statusResponse.status).toBe(200);
      
      // Log responses for debugging
      console.log('Parallel SQL hello response:', {
        message: sqlResponse.data.message,
        dbType: sqlResponse.data.dbType,
        isConnected: sqlResponse.data.isConnected
      });
      
      console.log('Parallel DB status response:', {
        status: statusResponse.data.status
      });
    })
  );
}); 
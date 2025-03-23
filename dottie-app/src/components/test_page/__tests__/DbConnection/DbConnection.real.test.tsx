import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import axios from 'axios';
import { isDbApiRunning, conditionalDbTest, dbClient, ensureDbApiRunning } from './db-test-setup';

describe('DbConnection (Real API)', () => {
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

  it('fetches real SQL hello message successfully',
    conditionalDbTest('fetches real SQL hello message successfully', async () => {
      // Make a real API call using dbClient
      const response = await dbClient.get('/api/sql-hello');
      
      // Verify real response structure
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('dbType');
      expect(response.data).toHaveProperty('isConnected');
      expect(typeof response.data.message).toBe('string');
      expect(response.data.isConnected).toBe(true);
      console.log('SQL response message:', response.data.message);
      console.log('Database type:', response.data.dbType);
    })
  );

  it('fetches real database status successfully',
    conditionalDbTest('fetches real database status successfully', async () => {
      // Make a real API call to check DB status
      const response = await dbClient.get('/api/db-status');
      
      // Verify real DB status response
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status');
      expect(response.data.status).toBe('connected');
      
      // Log actual status for debugging
      console.log('DB connection status:', response.data.status);
    })
  );

  it('handles non-existent endpoint errors correctly',
    conditionalDbTest('handles non-existent endpoint errors correctly', async () => {
      try {
        // Make a call to a non-existent endpoint to test error handling
        await dbClient.get('/api/db-non-existent');
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // We expect this to fail with 404
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(404);
        console.log('✅ Expected 404 test worked correctly! Error handling test passed successfully.');
      }
    })
  );

  it('tests combined database response functionality',
    conditionalDbTest('tests combined database response functionality', async () => {
      try {
        // Fetch both endpoints
        const [sqlResponse, statusResponse] = await Promise.all([
          dbClient.get('/api/sql-hello'),
          dbClient.get('/api/db-status')
        ]);
        
        // Verify both responses
        expect(sqlResponse.status).toBe(200);
        expect(statusResponse.status).toBe(200);
        
        // Construct expected message format (similar to what the UI does)
        let combinedMessage = '';
        if (sqlResponse.data.message) {
          combinedMessage += `SQL connection successful\n${sqlResponse.data.message}\n`;
        }
        if (statusResponse.data.status === 'connected') {
          combinedMessage += `Database status: ${statusResponse.data.status}`;
        }
        
        // Log combined message
        console.log('Combined DB message:', combinedMessage.trim());
        
        // Ensure both parts are in the combined message
        expect(combinedMessage).toContain('SQL connection successful');
        expect(combinedMessage).toContain('Database status: connected');
      } catch (error: any) {
        console.error('Test failed:', error);
        throw error;
      }
    })
  );
}); 
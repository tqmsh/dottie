import { describe, it, expect } from 'vitest';
import express from 'express';
import serverlessTestRoutes from '../../routes/serverlessTestRoutes.js';
import request from 'supertest';

describe('Serverless API Endpoints', () => {
  // Create a test app
  const app = express();
  app.use(express.json());
  app.use('/api/serverless-test', serverlessTestRoutes);

  it('should respond to basic serverless endpoint', async () => {
    const response = await request(app).get('/api/serverless-test');
    
    console.log('Serverless test response:', response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Serverless function is running');
  });

  it('should attempt to connect to database through serverless endpoint', async () => {
    try {
      const response = await request(app).get('/api/serverless-test/azure-sql-test');
      
      console.log('Azure SQL test response status:', response.status);
      console.log('Azure SQL test response:', response.body);
      
      expect(response.status).toBe(200);
      
      // If we're running with SQLite locally, we might get a success or an error
      // Either way, we just want to make sure the endpoint works
      if (response.body.success) {
        expect(response.body).toHaveProperty('data.currentTime');
      } else {
        // In case of an error, it should have a structured response
        expect(response.body).toHaveProperty('error');
      }
    } catch (error) {
      console.error('Error testing Azure SQL endpoint:', error);
      throw error;
    }
  }, 15000);

  it('should attempt CRUD operations through serverless endpoint', async () => {
    try {
      const response = await request(app).get('/api/serverless-test/azure-sql-crud-test');
      
      console.log('CRUD test response status:', response.status);
      console.log('CRUD test response:', response.body);
      
      expect(response.status).toBe(200);
      
      // If we're running with SQLite locally, we might get a success or an error
      // Either way, we just want to make sure the endpoint works
      if (response.body.success) {
        expect(response.body).toHaveProperty('data.createdRecord');
      } else {
        // In case of an error, it should have a structured response
        expect(response.body).toHaveProperty('error');
      }
    } catch (error) {
      console.error('Error testing CRUD operations endpoint:', error);
      throw error;
    }
  }, 15000);
}); 
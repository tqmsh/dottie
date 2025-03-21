import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import db from '../db/index.js';

describe('Azure SQL Production Connection', () => {
  let server;

  beforeAll(() => {
    // Set environment to production for this test
    process.env.NODE_ENV = 'production';
    server = app.listen();
    return server;
  });

  afterAll(async () => {
    await db.destroy();
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it('should respond with SQL Server database type in production mode', async () => {
    const response = await request(server).get('/api/sql-hello');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('dbType', 'mssql');
    expect(response.body).toHaveProperty('isConnected', true);
  });

  it('should connect to the Azure SQL database and execute a query', async () => {
    const result = await db.raw("SELECT 'Hello World from Azure SQL!' AS message");
    
    // SQL Server returns array with results
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('message', 'Hello World from Azure SQL!');
  });

  it('should report database status as connected', async () => {
    const response = await request(server).get('/api/db-status');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'connected');
  });
}); 
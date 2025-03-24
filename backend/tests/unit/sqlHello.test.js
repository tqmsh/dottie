import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import db from '../../db/index.js';

describe('SQL Hello Endpoint', () => {
  let server;

  beforeAll(() => {
    server = app.listen();
    return server;
  });

  afterAll(async () => {
    await db.destroy();
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it('should respond with SQLite database type in development mode', async () => {
    const response = await request(server).get('/api/sql-hello');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('dbType', 'sqlite3');
    expect(response.body).toHaveProperty('isConnected', true);
  });

  it('should connect to the database and execute a query', async () => {
    const result = await db.raw("SELECT 'Hello World from Test!' AS message");
    
    // SQLite returns array with objects
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('message', 'Hello World from Test!');
  });
});


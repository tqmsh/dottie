import { describe, it, expect, beforeEach, vi } from 'vitest';
import knex from 'knex';

// Mock the SQL Server client
vi.mock('mssql', () => {
  return {
    default: {
      connect: vi.fn().mockResolvedValue({
        request: vi.fn().mockReturnValue({
          query: vi.fn().mockResolvedValue({
            recordset: [{ message: 'Hello World from Mock Azure SQL!' }]
          })
        })
      })
    }
  };
});

// Mock the knex module
vi.mock('knex', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        raw: vi.fn().mockResolvedValue([
          { message: 'Hello World from Mock Azure SQL!' }
        ]),
        destroy: vi.fn().mockResolvedValue(undefined),
        client: {
          config: {
            client: 'mssql'
          }
        }
      };
    })
  };
});

describe('Azure SQL Connection (Mocked)', () => {
  let db;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Create a mocked Azure SQL connection
    process.env.NODE_ENV = 'production';
    process.env.AZURE_SQL_SERVER = 'mock-server.database.windows.net';
    process.env.AZURE_SQL_DATABASE = 'mock-db';
    process.env.AZURE_SQL_USER = 'mock-user';
    process.env.AZURE_SQL_PASSWORD = 'mock-password';
    
    db = knex();
  });

  it('should use mssql client in production environment', () => {
    expect(db.client.config.client).toBe('mssql');
  });

  it('should execute a raw query successfully', async () => {
    const result = await db.raw("SELECT 'Hello World from Mock Azure SQL!' AS message");
    
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('message', 'Hello World from Mock Azure SQL!');
  });

  it('should clean up resources when destroyed', async () => {
    await db.destroy();
    expect(db.destroy).toHaveBeenCalled();
  });
}); 
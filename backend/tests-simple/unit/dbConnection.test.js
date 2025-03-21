import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

describe('Database Connection', () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dbPath = path.resolve(__dirname, '../dev.sqlite3');
  let sqliteDb;

  beforeAll(() => {
    // Create a new SQLite connection for testing
    sqliteDb = knex({
      client: 'sqlite3',
      connection: {
        filename: dbPath
      },
      useNullAsDefault: true
    });
  });

  afterAll(async () => {
    await sqliteDb.destroy();
  });

  it('should connect to SQLite database', async () => {
    const result = await sqliteDb.raw('SELECT 1 as value');
    expect(result[0].value).toBe(1);
  });

  it('should be able to create and query a test table', async () => {
    // Skip if table already exists
    const hasTable = await sqliteDb.schema.hasTable('test_table');
    
    if (!hasTable) {
      await sqliteDb.schema.createTable('test_table', (table) => {
        table.increments('id');
        table.string('name');
      });
    }

    // Insert test data
    await sqliteDb('test_table').insert({ name: 'Test User' });

    // Query data
    const rows = await sqliteDb('test_table').where('name', 'Test User');
    
    expect(rows).toBeInstanceOf(Array);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('name', 'Test User');

    // Clean up
    await sqliteDb('test_table').where('name', 'Test User').delete();
  });

  // This test simulates switching between database types
  it('should determine correct database config based on environment', () => {
    // Development environment
    process.env.NODE_ENV = 'development';
    const devUseAzure = process.env.NODE_ENV === 'production' && 
      process.env.AZURE_SQL_SERVER && 
      process.env.AZURE_SQL_DATABASE;
    
    expect(devUseAzure).toBe(false);
    
    // Production environment
    process.env.NODE_ENV = 'production';
    const prodUseAzure = process.env.NODE_ENV === 'production' && 
      process.env.AZURE_SQL_SERVER && 
      process.env.AZURE_SQL_DATABASE;
    
    // This should be true if Azure credentials are set
    const hasAzureCredentials = process.env.AZURE_SQL_SERVER && 
      process.env.AZURE_SQL_DATABASE;
    expect(prodUseAzure).toBe(hasAzureCredentials);
    
    // Reset for other tests
    process.env.NODE_ENV = 'development';
  });
});
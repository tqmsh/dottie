import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import db from '../../db/index.js';
import { v4 as uuidv4 } from 'uuid';

// This test file verifies CRUD operations against the Azure SQL database
describe('Azure SQL CRUD Operations Tests', () => {
  // Test table name with a random suffix to avoid conflicts
  const testTableName = `test_table_${uuidv4().replace(/-/g, '_')}`;
  
  // Setup - create a test table
  beforeAll(async () => {
    try {
      if (db.client.config.client === 'mssql') {
        // SQL Server table creation
        await db.schema.createTable(testTableName, (table) => {
          table.increments('id').primary();
          table.string('name', 255).notNullable();
          table.string('email', 255);
          table.timestamp('created_at').defaultTo(db.fn.now());
        });
      } else {
        // SQLite table creation
        await db.schema.createTable(testTableName, (table) => {
          table.increments('id').primary();
          table.string('name', 255).notNullable();
          table.string('email', 255);
          table.timestamp('created_at').defaultTo(db.fn.now());
        });
      }
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  // Test 1: Insert data
  it('should insert data into the test table', async () => {
    try {
      const insertResult = await db(testTableName).insert({
        name: 'Test User',
        email: 'test@example.com'
      });
      
      // Different DB providers return different results for inserts
      if (db.client.config.client === 'mssql') {
        expect(insertResult[0]).toBeDefined(); // Should return the inserted ID
      } else {
        expect(insertResult).toBeDefined();
      }
    } catch (error) {
      console.error('Insert test failed:', error);
      expect(error).toBeFalsy();
    }
  });

  // Test 2: Select data
  it('should retrieve inserted data', async () => {
    try {
      const rows = await db.select('*').from(testTableName).where('name', 'Test User');
      expect(rows).toBeDefined();
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].name).toBe('Test User');
      expect(rows[0].email).toBe('test@example.com');
    } catch (error) {
      console.error('Select test failed:', error);
      expect(error).toBeFalsy();
    }
  });

  // Test 3: Update data
  it('should update data in the test table', async () => {
    try {
      // Update the email
      const updateResult = await db(testTableName)
        .where('name', 'Test User')
        .update({ email: 'updated@example.com' });
      
      // Verify update with a select
      const rows = await db.select('*').from(testTableName).where('name', 'Test User');
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].email).toBe('updated@example.com');
    } catch (error) {
      console.error('Update test failed:', error);
      expect(error).toBeFalsy();
    }
  });

  // Test 4: Delete data
  it('should delete data from the test table', async () => {
    try {
      // Delete the record
      const deleteResult = await db(testTableName)
        .where('name', 'Test User')
        .del();
      
      // Verify deletion
      const rows = await db.select('*').from(testTableName).where('name', 'Test User');
      expect(rows.length).toBe(0);
    } catch (error) {
      console.error('Delete test failed:', error);
      expect(error).toBeFalsy();
    }
  });

  // Teardown - drop the test table
  afterAll(async () => {
    try {
      // Drop the test table
      await db.schema.dropTableIfExists(testTableName);
      // Close the database connection
      await db.destroy();
    } catch (error) {
      console.error('Teardown failed:', error);
    }
  });
}); 
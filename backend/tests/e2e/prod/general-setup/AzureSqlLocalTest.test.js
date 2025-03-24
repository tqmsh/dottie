import { describe, it, expect } from 'vitest';
import db from '../../../../db/index.js';
import sql from 'mssql';

describe('Azure SQL Local Connection Test', () => {
  it('should connect to database', async () => {
    try {
      // Check if we're using Azure SQL
      const isAzureSql = db.client.config.client === 'mssql';
      console.log(`Using database type: ${db.client.config.client}`);
      
      if (isAzureSql) {
        console.log('Connected to Azure SQL database');
      } else {
        console.log('Connected to SQLite database (development/test mode)');
      }
      
      // Test a simple query
      const result = await db.raw('SELECT 1 as testValue');
      
      // Different DBs return results in different formats
      let testValue;
      if (isAzureSql) {
        testValue = result[0].testValue;
      } else {
        testValue = result[0].testValue;
      }
      
      console.log('Query executed successfully, result:', testValue);
      expect(testValue).toBe(1);
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Make the test fail if we couldn't connect
      expect.fail('Failed to connect to database: ' + error.message);
    }
  }, 15000);
  
  it('should create a temporary table and perform CRUD operations', async () => {
    try {
      const isAzureSql = db.client.config.client === 'mssql';
      const tableName = 'LocalTest' + Date.now(); // Use unique table name to avoid conflicts
      
      if (isAzureSql) {
        // Create a test table (Azure SQL specific syntax)
        await db.raw(`
          IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${tableName}')
          BEGIN
            CREATE TABLE ${tableName} (
              id INT IDENTITY(1,1) PRIMARY KEY,
              message VARCHAR(255),
              created_at DATETIME DEFAULT GETDATE()
            )
          END
        `);
      } else {
        // Create a test table (SQLite syntax)
        await db.schema.dropTableIfExists(tableName);
        await db.schema.createTable(tableName, (table) => {
          table.increments('id');
          table.string('message');
          table.timestamp('created_at').defaultTo(db.fn.now());
        });
      }
      
      console.log(`Test table "${tableName}" created`);
      
      // Insert a test record
      const testMessage = 'Test message ' + new Date().toISOString();
      
      // Different insert approach for different databases
      let newId;
      if (isAzureSql) {
        const insertResult = await db.raw(`
          INSERT INTO ${tableName} (message) 
          OUTPUT INSERTED.id 
          VALUES ('${testMessage}')
        `);
        newId = insertResult[0].id;
      } else {
        // For SQLite
        const insertedIds = await db(tableName).insert({ message: testMessage });
        newId = insertedIds[0];
      }
      
      console.log('Inserted new record with ID:', newId);
      
      // Read the record back
      let readResult;
      if (isAzureSql) {
        const result = await db.raw(`SELECT * FROM ${tableName} WHERE id = ${newId}`);
        readResult = result[0];
      } else {
        readResult = await db(tableName).where('id', newId).first();
      }
      
      console.log('Retrieved record:', readResult);
      
      if (!readResult) {
        throw new Error(`Failed to retrieve record with ID ${newId}`);
      }
      
      // Verify the message matches what we inserted
      const resultMessage = isAzureSql ? readResult.message : readResult.message;
      expect(resultMessage).toBe(testMessage);
      
      // Update the record
      if (isAzureSql) {
        await db.raw(`UPDATE ${tableName} SET message = 'Updated message' WHERE id = ${newId}`);
      } else {
        await db(tableName).where('id', newId).update({ message: 'Updated message' });
      }
      
      console.log('Updated record');
      
      // Verify update
      let updatedRecord;
      if (isAzureSql) {
        const result = await db.raw(`SELECT * FROM ${tableName} WHERE id = ${newId}`);
        updatedRecord = result[0];
      } else {
        updatedRecord = await db(tableName).where('id', newId).first();
      }
      
      if (!updatedRecord) {
        throw new Error(`Failed to retrieve updated record with ID ${newId}`);
      }
      
      const updatedMessage = isAzureSql ? updatedRecord.message : updatedRecord.message;
      expect(updatedMessage).toBe('Updated message');
      
      // Cleanup - delete the record
      if (isAzureSql) {
        await db.raw(`DELETE FROM ${tableName} WHERE id = ${newId}`);
      } else {
        await db(tableName).where('id', newId).delete();
      }
      
      console.log('Test record deleted');
      
      // Drop the test table to clean up completely
      if (isAzureSql) {
        await db.raw(`DROP TABLE IF EXISTS ${tableName}`);
      } else {
        await db.schema.dropTableIfExists(tableName);
      }
      
      console.log(`Test table "${tableName}" dropped`);
      
    } catch (error) {
      console.error('Error during CRUD test:', error);
      // Make the test fail if we couldn't perform CRUD operations
      expect.fail('Failed during CRUD operations: ' + error.message);
    }
  }, 20000);
}); 
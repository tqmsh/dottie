import express from 'express';
import sql from 'mssql';
import db from '../db/index.js';

const router = express.Router();

// A simple endpoint to test the serverless function
router.get('/', (req, res) => {
  res.json({ 
    message: 'Serverless function is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Test Azure SQL connection
router.get('/azure-sql-test', async (req, res) => {
  try {
    // Determine if we're using Azure SQL
    const isAzureSql = db.client.config.client === 'mssql';
    
    if (!isAzureSql) {
      console.log('Warning: Not using Azure SQL, falling back to SQLite');
    }
    
    // Test a simple query
    const result = await db.raw('SELECT 1 as testValue');
    
    let testValue;
    if (isAzureSql) {
      testValue = result[0].testValue;
    } else {
      testValue = result[0].testValue;
    }
    
    res.json({
      success: true,
      message: `Successfully connected to ${isAzureSql ? 'Azure SQL' : 'SQLite database'}`,
      data: {
        currentTime: new Date().toISOString(),
        testValue: testValue,
        databaseType: db.client.config.client,
        serverInfo: {
          name: isAzureSql ? db.client.config.connection.server : 'local SQLite',
          database: isAzureSql ? db.client.config.connection.database : 'SQLite database',
        }
      }
    });
  } catch (error) {
    console.error('Database connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to database',
      error: {
        name: error.name,
        message: error.message,
      }
    });
  }
});

// Test with a more comprehensive DB operation
router.get('/azure-sql-crud-test', async (req, res) => {
  try {
    const isAzureSql = db.client.config.client === 'mssql';
    const tableName = 'VercelTest' + Date.now(); // Use a unique table name
    
    if (isAzureSql) {
      // Create a test table if it doesn't exist
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
      // Create a test table in SQLite
      await db.schema.createTable(tableName, (table) => {
        table.increments('id');
        table.string('message');
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
    
    // Insert a test record
    let newId;
    const testMessage = 'Test from Vercel ' + new Date().toISOString();
    
    if (isAzureSql) {
      const insertResult = await db.raw(`
        INSERT INTO ${tableName} (message) 
        OUTPUT INSERTED.id 
        VALUES ('${testMessage}')
      `);
      newId = insertResult[0].id;
    } else {
      const insertedIds = await db(tableName).insert({ message: testMessage });
      newId = insertedIds[0];
    }
    
    // Read the record back
    let readResult;
    if (isAzureSql) {
      const result = await db.raw(`SELECT * FROM ${tableName} WHERE id = ${newId}`);
      readResult = result[0];
    } else {
      readResult = await db(tableName).where('id', newId).first();
    }
    
    // Get total count
    let totalCount;
    if (isAzureSql) {
      const result = await db.raw(`SELECT COUNT(*) as count FROM ${tableName}`);
      totalCount = result[0].count;
    } else {
      const result = await db(tableName).count('id as count');
      totalCount = result[0].count;
    }
    
    // Clean up - drop the table
    if (isAzureSql) {
      await db.raw(`DROP TABLE ${tableName}`);
    } else {
      await db.schema.dropTable(tableName);
    }
    
    res.json({
      success: true,
      message: `Successfully performed CRUD operations on ${isAzureSql ? 'Azure SQL' : 'SQLite database'}`,
      data: {
        createdRecord: readResult,
        totalRecords: totalCount,
        databaseType: db.client.config.client
      }
    });
  } catch (error) {
    console.error('Database CRUD test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform CRUD operations on database',
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
});

export default router; 
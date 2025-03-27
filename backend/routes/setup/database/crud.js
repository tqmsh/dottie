import express from 'express';
import db from '../../../db/index.js';

const router = express.Router();

router.get("/crud-test", async (req, res) => {
  try {
    const isAzureSql = db.client.config.client === 'mssql';
    const tableName = 'VercelTest' + Date.now();
    
    if (isAzureSql) {
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
      await db.schema.createTable(tableName, (table) => {
        table.increments('id');
        table.string('message');
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
    
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
    
    let readResult;
    if (isAzureSql) {
      const result = await db.raw(`SELECT * FROM ${tableName} WHERE id = ${newId}`);
      readResult = result[0];
    } else {
      readResult = await db(tableName).where('id', newId).first();
    }
    
    let totalCount;
    if (isAzureSql) {
      const result = await db.raw(`SELECT COUNT(*) as count FROM ${tableName}`);
      totalCount = result[0].count;
    } else {
      const result = await db(tableName).count('id as count');
      totalCount = result[0].count;
    }
    
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
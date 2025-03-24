import express from 'express';
import db from '../../db/index.js';

const router = express.Router();

router.get("/api/sql-hello", async (req, res) => {
  try {
    // Determine the database type
    const dbType = db.client.config.client;
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Create dynamic message based on the database type
    const dbTypeName = dbType === 'mssql' ? 'Azure SQL' : 'SQLite';
    
    // Query with the dynamic message
    const result = await db.raw(`SELECT 'Hello World from ${dbTypeName}!' AS message`);
    
    // Different DB providers return results in different formats
    const message = dbType === 'mssql' 
      ? result[0].message 
      : result[0]?.message || `Hello World from ${dbTypeName}!`;
    
    res.json({ 
      message,
      dbType,
      isConnected: true
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message,
      dbType: db.client.config.client,
      isConnected: false
    });
  }
});

export default router; 
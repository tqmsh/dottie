import db from '../../../db/index.js';
import fs from 'fs';

async function testDB() {
  const output = [];
  const logOutput = (msg) => {
    console.log(msg);
    output.push(msg);
  };

  logOutput('Testing database connection...');
  
  try {
    // First check if connection is working
    await db.raw('SELECT 1 as test');
    logOutput('Database connection successful!');
    
    // Check if we're using SQLite
    const clientType = db.client.config.client;
    logOutput(`Database client: ${clientType}`);
    
    let tables;
    if (clientType === 'sqlite3') {
      // SQLite query for tables
      tables = await db.raw("SELECT name as TABLE_NAME FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    } else {
      // SQL Server query for tables
      tables = await db.raw("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
    }
    
    logOutput('Available tables:');
    logOutput(JSON.stringify(tables, null, 2));
    
    // Write results to file
    fs.writeFileSync('db-tables-output.txt', output.join('\n'));
    console.log('Results written to db-tables-output.txt');
  } catch(err) {
    logOutput('Error connecting to database:');
    logOutput(err.toString());
    logOutput(JSON.stringify(err, null, 2));
    
    // Write error to file
    fs.writeFileSync('db-tables-output.txt', output.join('\n'));
    console.log('Error written to db-tables-output.txt');
  } finally {
    process.exit(0);
  }
}

testDB(); 
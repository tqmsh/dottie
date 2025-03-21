import db from '../../../db/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Explicitly load environment variables from the backend root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../../');
dotenv.config({ path: path.join(rootDir, '.env') });

async function testDB() {
  const output = [];
  const logOutput = (msg) => {
    console.log(msg);
    output.push(msg instanceof Error ? msg.stack || msg.toString() : typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg);
  };

  logOutput('Testing database connection...');
  
  // Print environment info
  logOutput(`NODE_ENV: ${process.env.NODE_ENV}`);
  logOutput(`Using .env from: ${path.join(rootDir, '.env')}`);
  
  // Set a shorter timeout for quicker feedback
  const timeout = setTimeout(() => {
    logOutput('Database connection test timed out after 15 seconds');
    
    // Try to get information about the Azure SQL configuration
    if (process.env.NODE_ENV === 'production') {
      logOutput('Azure SQL Configuration:');
      logOutput(`Server: ${process.env.AZURE_SQL_SERVER || 'Not set'}`);
      logOutput(`Database: ${process.env.AZURE_SQL_DATABASE || 'Not set'}`);
      logOutput(`User: ${process.env.AZURE_SQL_USER ? 'Set' : 'Not set'}`);
      logOutput(`Password: ${process.env.AZURE_SQL_PASSWORD ? 'Set' : 'Not set'}`);
    }
    
    // Write results to file
    fs.writeFileSync('db-connection-error.txt', output.join('\n'));
    console.log('Error information written to db-connection-error.txt');
    process.exit(1);
  }, 15000);
  
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
    logOutput(tables);
    
    // Write results to file
    fs.writeFileSync('db-tables-output.txt', output.join('\n'));
    console.log('Results written to db-tables-output.txt');
    
    // Clear the timeout as we succeeded
    clearTimeout(timeout);
  } catch(err) {
    logOutput('Error connecting to database:');
    logOutput(err);
    
    // Try to get information about the Azure SQL configuration if in production
    if (process.env.NODE_ENV === 'production') {
      logOutput('Azure SQL Configuration:');
      logOutput(`Server: ${process.env.AZURE_SQL_SERVER || 'Not set'}`);
      logOutput(`Database: ${process.env.AZURE_SQL_DATABASE || 'Not set'}`);
      logOutput(`User: ${process.env.AZURE_SQL_USER ? 'Set' : 'Not set'}`);
      logOutput(`Password: ${process.env.AZURE_SQL_PASSWORD ? 'Set' : 'Not set'}`);
    }
    
    // Write error to file
    fs.writeFileSync('db-connection-error.txt', output.join('\n'));
    console.log('Error information written to db-connection-error.txt');
    
    // Clear the timeout as we errored
    clearTimeout(timeout);
  } finally {
    process.exit(0);
  }
}

testDB(); 
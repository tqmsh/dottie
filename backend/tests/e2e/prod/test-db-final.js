// Load environment variables FIRST
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../../');
const envPath = path.join(rootDir, '.env');

console.log(`Loading environment from: ${envPath}`);
dotenv.config({ path: envPath });

// Force NODE_ENV to be production for this test
process.env.NODE_ENV = 'production';

// Now import the database module
import('../../../db/index.js').then(async ({ default: db }) => {
  const output = [];
  const logOutput = (msg) => {
    console.log(msg);
    output.push(msg instanceof Error ? msg.stack || msg.toString() : typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg);
  };

  logOutput('Testing production database connection...');
  logOutput(`NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Check if Azure SQL config variables are set
  logOutput('Azure SQL Configuration:');
  logOutput(`Server: ${process.env.AZURE_SQL_SERVER || 'Not set'}`);
  logOutput(`Database: ${process.env.AZURE_SQL_DATABASE || 'Not set'}`);
  logOutput(`User: ${process.env.AZURE_SQL_USER ? 'Set' : 'Not set'}`);
  logOutput(`Password: ${process.env.AZURE_SQL_PASSWORD ? 'Set' : 'Not set'}`);
  
  // Set a timeout for the test
  const timeout = setTimeout(() => {
    logOutput('Database connection test timed out after 15 seconds');
    fs.writeFileSync('db-prod-test-output.txt', output.join('\n'));
    console.log('Test results written to db-prod-test-output.txt');
    process.exit(1);
  }, 15000);
  
  try {
    // First check if connection is working
    await db.raw('SELECT 1 as test');
    logOutput('Database connection successful!');
    
    // Log database client type
    const clientType = db.client.config.client;
    logOutput(`Database client: ${clientType}`);
    
    if (clientType !== 'mssql') {
      logOutput('WARNING: Not using Azure SQL despite production environment!');
    }
    
    // Query tables
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
    
    clearTimeout(timeout);
  } catch(err) {
    logOutput('Error connecting to database:');
    logOutput(err);
    clearTimeout(timeout);
  } finally {
    // Write results to file
    fs.writeFileSync('db-prod-test-output.txt', output.join('\n'));
    console.log('Test results written to db-prod-test-output.txt');
    process.exit(0);
  }
}); 
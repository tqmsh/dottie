import db from '../../../db/index.js';

async function testDB() {
  console.log('Testing database connection...');
  
  // Set a timeout for the entire operation
  const timeout = setTimeout(() => {
    console.error('Database connection test timed out after 10 seconds');
    process.exit(1);
  }, 10000);
  
  try {
    // First check if connection is working
    await db.raw('SELECT 1 as test');
    console.log('Database connection successful!');
    
    // For SQLite, use different query to get tables
    // Check if we're using SQLite
    const clientType = db.client.config.client;
    console.log(`Database client: ${clientType}`);
    
    let tables;
    if (clientType === 'sqlite3') {
      // SQLite query for tables
      tables = await db.raw("SELECT name as TABLE_NAME FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    } else {
      // SQL Server query for tables
      tables = await db.raw("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
    }
    
    console.log('Available tables:');
    console.log(JSON.stringify(tables, null, 2));
    
    // Show table count
    if (tables && (Array.isArray(tables) ? tables.length : Object.keys(tables).length)) {
      console.log(`Found tables: ${JSON.stringify(Array.isArray(tables) ? tables : Object.keys(tables))}`);
    } else {
      console.log('No tables found or result is in unexpected format.');
    }
    
    // Clear the timeout as we succeeded
    clearTimeout(timeout);
  } catch(err) {
    console.error('Error connecting to database:');
    console.error(err);
    
    // Clear the timeout as we errored
    clearTimeout(timeout);
  } finally {
    console.log('Test complete.');
    process.exit(0);
  }
}

testDB(); 
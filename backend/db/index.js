/**
 * Database configuration and connection module
 */

import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Determine if we're in test mode
const isTestMode = process.env.TEST_MODE === 'true';

// SQLite database file path - Use the same file for both dev and test
const dbPath = path.resolve(__dirname, '../dev.sqlite3');

// Determine database configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
// Only use Azure SQL in production and if the variables are available
const useAzure = isProduction && process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_DATABASE;

let dbConfig;

if (useAzure) {
  // Azure SQL configuration with static connection pool
  dbConfig = {
    client: 'mssql',
    connection: {
      server: process.env.AZURE_SQL_SERVER,
      database: process.env.AZURE_SQL_DATABASE,
      user: process.env.AZURE_SQL_USER,
      password: process.env.AZURE_SQL_PASSWORD,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectTimeout: 15000, // Reduced from 30 seconds to 15 seconds for serverless
        requestTimeout: 15000  // Reduced timeout for serverless
      }
    },
    pool: {
      min: 0,         // Start with no connections for serverless (reduced from 2)
      max: 5,         // Reduced max connections for serverless (was 10)
      idleTimeoutMillis: 60000,  // Reduced idle timeout (was 300000)
      acquireTimeoutMillis: 15000, // Reduced acquisition timeout (was 30000)
      createTimeoutMillis: 15000,  // Reduced creation timeout (was 30000)
      createRetryIntervalMillis: 200,
      propagateCreateError: false
    },
    acquireConnectionTimeout: 30000 // Reduced from 60000
  };
  console.log('Using Azure SQL database');
} else {
  // SQLite configuration (local development)
  dbConfig = {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  };
  console.log('Using SQLite database');
}

// Create a mock database object for testing
const testDb = function(tableName) {
  const mockData = {
    users: [
      {
        id: 'test-user-1',
        username: 'Test User 1',
        email: 'test1@example.com',
        age: '18_24'
      }
    ]
  };

  return {
    where: (field, value) => ({
      first: () => Promise.resolve(mockData[tableName]?.find(item => item[field] === value) || null),
      delete: () => Promise.resolve(1),
      update: () => Promise.resolve(1),
      orderBy: () => ({
        first: () => Promise.resolve(mockData[tableName]?.[0] || null)
      })
    }),
    insert: () => Promise.resolve([1]),
    orderBy: () => ({
      first: () => Promise.resolve(mockData[tableName]?.[0] || null)
    }),
    // Return the mock data array for the table
    then: (resolve) => resolve(mockData[tableName] || [])
  };
};

// Add additional methods to the test database
testDb.schema = {
  hasTable: async (tableName) => {
    console.log(`Mock checking if table ${tableName} exists`);
    return false; // Always say tables don't exist in test mode
  },
  createTable: async (tableName, tableBuilder) => {
    console.log(`Mock creating table ${tableName}`);
    return true;
  }
};

// Add a raw method for testing
testDb.raw = async (query) => {
  console.log(`Mock executing raw query: ${query}`);
  if (query.includes('1')) {
    return [{ testValue: 1 }];
  } else {
    return [{ message: 'Hello World from Mock DB!' }];
  }
};

// Mock database destruction
testDb.destroy = async () => {
  console.log('Mock database connection closed');
  return true;
};

// Initialize database connection or use real SQLite for tests
let db;
if (isTestMode) {
  // Use in-memory SQLite for testing instead of mocks
  const realTestDbConfig = {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  };
  
  db = knex(realTestDbConfig);
  
  // Log when queries are executed
  db.on('query-response', () => {
    console.log('SQLite query executed');
  });
  
  // Initialize the schema in the next tick to avoid blocking
  setTimeout(async () => {
    try {
      // Import the schema creation function
      const { createTables } = await import('./migrations/initialSchema.js');
      await createTables(db);
      console.log('Test database tables created');
    } catch (err) {
      console.error('Failed to create test database tables:', err);
    }
  }, 0);
} else {
  db = knex(dbConfig);
  
  // Handle connection errors
  db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  
  // Only verify connection in non-serverless environment
  // Check if we're in a serverless environment (Vercel)
  const isServerless = process.env.VERCEL === '1';
  
  // Verify connection in non-serverless environments
  if (useAzure && !isServerless) {
    db.raw('SELECT 1')
      .then(() => {
        console.log('Successfully connected to Azure SQL Database');
      })
      .catch((err) => {
        console.error('Failed to connect to Azure SQL Database:', err);
      });
  }
}

// Export the database object
export default db;
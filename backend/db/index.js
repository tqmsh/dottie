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
        connectTimeout: 30000, // 30 seconds
        requestTimeout: 30000  // 30 seconds
      }
    },
    pool: {
      min: 2,         // Minimum connections in pool
      max: 10,        // Maximum connections in pool
      idleTimeoutMillis: 300000,  // How long a connection can be idle before being removed (5 minutes)
      acquireTimeoutMillis: 30000, // Maximum time to acquire a connection (30 seconds)
      createTimeoutMillis: 30000,  // Maximum time to create a connection (30 seconds)
      createRetryIntervalMillis: 200, // Time between connection creation retries
      propagateCreateError: false  // Don't crash the pool on connection errors
    },
    acquireConnectionTimeout: 60000 // How long to wait for a connection from the pool (60 seconds)
  };
  // console.log('Using Azure SQL database with static connection pool');
} else {
  // SQLite configuration (local development)
  dbConfig = {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  };
  // Log could be added here: console.log('Using SQLite database');
}

// Initialize database connection
const db = knex(dbConfig);

// Handle connection errors
db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Verify connection on startup
if (useAzure) {
  db.raw('SELECT 1')
    .then(() => {
      // console.log('Successfully connected to Azure SQL Database');
    })
    .catch((err) => {
      console.error('Failed to connect to Azure SQL Database:', err);
    });
}

export default db;
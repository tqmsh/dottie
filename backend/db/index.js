import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SQLite database file path
const dbPath = path.resolve(__dirname, '../dev.sqlite3');

// Determine database configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
// Only use Azure SQL in production and if the variables are available
const useAzure = isProduction && process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_DATABASE;

let dbConfig;

if (useAzure) {
  // Azure SQL configuration
  dbConfig = {
    client: 'mssql',
    connection: {
      server: process.env.AZURE_SQL_SERVER,
      database: process.env.AZURE_SQL_DATABASE,
      user: process.env.AZURE_SQL_USER,
      password: process.env.AZURE_SQL_PASSWORD,
      options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: false
      }
    },
    pool: {
      min: 2,
      max: 10
    }
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

// Initialize database connection
const db = knex(dbConfig);

export default db;
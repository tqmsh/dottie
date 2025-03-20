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
const useAzure = isProduction && process.env.AZURE_SQL_CONNECTION_STRING;

let dbConfig;

if (useAzure) {
  // Azure SQL configuration
  dbConfig = {
    client: 'mssql',
    connection: process.env.AZURE_SQL_CONNECTION_STRING,
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
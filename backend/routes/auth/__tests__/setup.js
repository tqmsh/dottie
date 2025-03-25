// Test setup file for initializing database
// Set test mode before importing db
process.env.TEST_MODE = 'true';

import db from '../../../db/index.js';
import { createTables, dropTables } from '../../../db/migrations/initialSchema.js';

/**
 * Initialize the test database
 * This function will create the tables if they don't exist
 */
export async function initTestDatabase() {
  try {
    console.log('Setting up test database...');
    
    // First ensure we have a clean start for test database
    // Check if tables exist and recreate them if needed
    const hasUsersTable = await db.schema.hasTable('users');
    
    if (!hasUsersTable) {
      console.log('Users table not found, creating all tables...');
      await createTables(db);
    } else {
      console.log('Tables already exist, continuing...');
    }
    
    // Verify tables were created successfully
    const tablesExist = await Promise.all([
      db.schema.hasTable('users'),
      db.schema.hasTable('period_logs'),
      db.schema.hasTable('symptoms'),
      db.schema.hasTable('assessments')
    ]);
    
    if (!tablesExist.every(exists => exists)) {
      console.error('Failed to create all required tables!');
      // Force recreation of all tables
      await dropTables(db);
      await createTables(db);
      
      // Check again
      const tablesCreated = await db.schema.hasTable('users');
      if (!tablesCreated) {
        throw new Error('Failed to create database tables after retry!');
      }
    }
    
    console.log('Test database setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up test database:', error);
    return false;
  }
}

/**
 * Clear all data from the database tables
 */
export async function clearDatabase() {
  try {
    // console.log('Clearing test database...');
    await db('assessments').delete();
    await db('symptoms').delete();
    await db('period_logs').delete();
    await db('users').delete();
    // console.log('Test database cleared');
    return true;
  } catch (error) {
    console.error('Error clearing test database:', error);
    return false;
  }
}

/**
 * Create a test user in the database
 * @param {object} userData - User data to create
 * @returns {Promise<object|null>} - Created user or null
 */
export async function createTestUser(userData) {
  try {
    const [userId] = await db('users').insert(userData);
    const user = await db('users').where('id', userData.id).first();
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    return null;
  }
} 
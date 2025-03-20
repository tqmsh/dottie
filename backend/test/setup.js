// Test setup file for initializing database
import db from '../db/index.js';
import { createTables } from '../db/migrations/initialSchema.js';

/**
 * Initialize the test database
 * This function will create the tables if they don't exist
 */
export async function initTestDatabase() {
  try {
    console.log('Setting up test database...');
    await createTables(db);
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
    console.log('Clearing test database...');
    await db('assessments').delete();
    await db('symptoms').delete();
    await db('period_logs').delete();
    await db('users').delete();
    console.log('Test database cleared');
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
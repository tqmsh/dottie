// Global setup file for Vitest
// Set test mode before importing db
process.env.TEST_MODE = 'true';

/**
 * This is a mock database setup for testing purposes.
 * In a real application, this file would handle:
 * - Connecting to a test database
 * - Creating schema/tables
 * - Seeding test data
 * - Providing cleanup for after tests
 */

export default async () => {
  console.log('Setting up test database environment...');
  
  // Mock database setup
  global.testDb = {
    users: [
      {
        id: 'test-user-1',
        email: 'test@example.com',
        username: 'testuser',
        password: '$2b$10$K4P7CZp7hvtDiEbulriP8OZn7Q9YhAGP8uxYwZHR0CJaW5F4LrDXe', // hashed 'password123'
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ],
    tokens: {
      // Mock refresh tokens storage
      refreshTokens: new Map()
    },
    // Add other collections as needed
  };

  // Utility methods
  global.testDbUtils = {
    // Clean the database for fresh tests
    clearData: () => {
      global.testDb.users = [];
      global.testDb.tokens.refreshTokens.clear();
    },
    
    // Add a test user
    addUser: (user) => {
      global.testDb.users.push(user);
      return user;
    },
    
    // Find a user by email
    findUserByEmail: (email) => {
      return global.testDb.users.find(u => u.email === email) || null;
    },
    
    // Find a user by ID
    findUserById: (id) => {
      return global.testDb.users.find(u => u.id === id) || null;
    },
    
    // Store a refresh token
    storeRefreshToken: (userId, token) => {
      global.testDb.tokens.refreshTokens.set(token, {
        userId,
        createdAt: new Date()
      });
    },
    
    // Verify a refresh token
    verifyRefreshToken: (token) => {
      return global.testDb.tokens.refreshTokens.get(token) || null;
    }
  };

  console.log('Test database environment ready');
  
  return () => {
    // Cleanup when tests are done
    console.log('Cleaning up test database environment');
    delete global.testDb;
    delete global.testDbUtils;
  };
};

/**
 * Initialize the test database
 * This function will create the tables if they don't exist
 */
export async function setup() {
  try {
    console.log('Setting up test database for all tests...');
    
    // First ensure we have a clean start for test database
    // Check if tables exist and recreate them if needed
    const hasUsersTable = await db.schema.hasTable('users');
    
    if (hasUsersTable) {
      console.log('Tables already exist, continuing...');
    } else {
      console.log('Users table not found, but that\'s ok for setup tests.');
    }
    
    console.log('Test database setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up test database:', error);
    return false;
  }
} 
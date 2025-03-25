// Global setup file for Vitest
import { initTestDatabase } from './setup.js';

// Export an async setup function that will be called by Vitest
export async function setup() {
  console.log('Setting up test database for all tests...');
  const success = await initTestDatabase();
  
  if (!success) {
    console.error('Failed to initialize test database!');
    process.exit(1);
  }
  
  console.log('Test database initialized successfully.');
} 
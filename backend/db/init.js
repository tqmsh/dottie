import db from './index.js';
import { createTables } from './migrations/initialSchema.js';

/**
 * Initialize the database with required tables
 */
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await createTables(db);
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the initialization if this file is executed directly
if (process.argv[1].includes('init.js')) {
  initializeDatabase();
}

export default initializeDatabase; 
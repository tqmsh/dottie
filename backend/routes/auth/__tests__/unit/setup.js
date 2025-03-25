import { resolveFromRoot } from '../../../../test-utilities/paths.js';

// Import models and controllers directly from their absolute paths
export const importModels = async () => {
  try {
    const User = await import(resolveFromRoot('models/User.js')).then(m => m.default);
    return { User };
  } catch (error) {
    console.error('Error importing models:', error);
    // Return mock models for testing if imports fail
    return {
      User: {
        create: jest.fn(),
        findByEmail: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
      }
    };
  }
};

// Setup mocks for dependencies
export const setupMocks = () => {
  return {
    db: {
      // Add mock db functions as needed
      query: jest.fn(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      insert: jest.fn(),
      returning: jest.fn(),
    },
    // Add other mocks as needed
  };
}; 
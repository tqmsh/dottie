import { resolveFromRoot } from '../../../../test-utilities/paths.js';

// Import models and controllers directly from their absolute paths
export const importModels = async () => {
  // These are examples, adjust based on your actual model structure
  try {
    const Assessment = await import(resolveFromRoot('models/Assessment.js')).then(m => m.default);
    return { Assessment };
  } catch (error) {
    console.error('Error importing models:', error);
    // Return mock models for testing if imports fail
    return {
      Assessment: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
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
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import User from '../../../../models/User.js';

// Mock the User model
vi.mock('../../../../models/User.js', () => ({
  default: {
    findById: vi.fn()
  }
}));

// Mock the authentication middleware
vi.mock('../../../auth/middleware/index.js', () => ({
  authenticateToken: (req, res, next) => {
    // Add a mock user to the request
    req.user = {
      id: 'mock-user-id',
      role: 'user'
    };
    next();
  }
}));

// Mock the user access validator
vi.mock('../../../auth/middleware/validators/userValidators.js', () => ({
  validateUserAccess: (req, res, next) => {
    next();
  },
  validateUserUpdate: (req, res, next) => {
    next();
  }
}));

describe('GET /:id - Get User By Id', () => {
  let app;
  let userRoutes;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    
    // Import the route to test using dynamic import
    const routeModule = await import('../../index.js');
    userRoutes = routeModule.default;
    app.use('/users', userRoutes);
    
    // Reset mock implementations
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return test user data when test user ID is requested', async () => {
    const testUserId = 'test-user-123';
    
    // Execute request
    const response = await request(app).get(`/users/${testUserId}`);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(User.findById).not.toHaveBeenCalled(); // Should not call findById for test users
    expect(response.body).toHaveProperty('id', testUserId);
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('age', '18_24');
  });

  it('should return user data when non-test user exists', async () => {
    const userId = 'regular-user-id';
    const mockUser = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'hashvalue',
      age: '18_24'
    };
    
    // Set up mock
    User.findById.mockResolvedValue(mockUser);
    
    // Execute request
    const response = await request(app).get(`/users/${userId}`);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(response.body).not.toHaveProperty('password_hash');
    expect(response.body).toMatchObject({
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      age: '18_24'
    });
  });

  it('should return 404 when user does not exist', async () => {
    const userId = 'non-existent-id';
    
    // Set up mock to return null (user not found)
    User.findById.mockResolvedValue(null);
    
    // Execute request
    const response = await request(app).get(`/users/${userId}`);
    
    // Assertions
    expect(response.status).toBe(404);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should handle database errors', async () => {
    const userId = 'error-user-id';
    
    // Set up mock to throw an error
    User.findById.mockRejectedValue(new Error('Database error'));
    
    // Execute request
    const response = await request(app).get(`/users/${userId}`);
    
    // Assertions
    expect(response.status).toBe(500);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(response.body).toHaveProperty('error', 'Failed to fetch user');
  });
}); 
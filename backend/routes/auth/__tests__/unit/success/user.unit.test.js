import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import { v4 as uuidv4 } from 'uuid';
import { initTestDatabase, clearDatabase, createTestUser } from '../setup.js';

describe('User API Endpoints', { tags: ['authentication', 'unit', 'success'] }, () => {
  // Initialize database before all tests
  beforeAll(async () => {
    await initTestDatabase();
  });

  // Clear database and create a test user before each test
  beforeEach(async () => {
    await clearDatabase();
    
    // Create a test user
    const userId = uuidv4();
    await createTestUser({
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'password123',
      age: 25
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a 200 status code for valid ID', async () => {
      // Get all users to find a valid ID
      const usersResponse = await request(app).get('/api/users');
      expect(usersResponse.status).toBe(200);
      
      // Skip test if no users exist
      if (usersResponse.body.length === 0) {
        return;
      }
      
      const userId = usersResponse.body[0].id;
      const response = await request(app).get(`/api/users/${userId}`);
      expect(response.status).toBe(200);
    });

    it('should return user data with correct properties', async () => {
      // Get all users to find a valid ID
      const usersResponse = await request(app).get('/api/users');
      expect(usersResponse.status).toBe(200);
      
      // Skip test if no users exist
      if (usersResponse.body.length === 0) {
        return;
      }
      
      const userId = usersResponse.body[0].id;
      const response = await request(app).get(`/api/users/${userId}`);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('email');
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = uuidv4();
      const response = await request(app).get(`/api/users/${nonExistentId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should contain user objects with required properties', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      
      // Skip if no users found
      if (response.body.length === 0) {
        return;
      }
      
      const firstUser = response.body[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('username');
      expect(firstUser).toHaveProperty('email');
    });
  });
}); 
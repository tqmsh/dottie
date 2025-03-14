import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('User API Endpoints', () => {
  describe('GET /api/user/:id', () => {
    it('should return a 200 status code for valid ID', async () => {
      const response = await request(app).get('/api/user/1');
      expect(response.status).toBe(200);
    });

    it('should return user data with correct properties', async () => {
      const response = await request(app).get('/api/user/1');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body.id).toBe('1');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/user/999');
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
      const firstUser = response.body[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('email');
    });
  });
}); 
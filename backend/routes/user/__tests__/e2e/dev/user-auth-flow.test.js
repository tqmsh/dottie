// @ts-check
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import db from '../../../../../db/index.js';
import app from '../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Test data
let server;
let request;
let testUser;
let testUserId;
let accessToken;
const TEST_PORT = 5004;

// Setup before all tests
beforeAll(async () => {
  try {
    // Create server and supertest instance
    server = createServer(app);
    request = supertest(app);
    
    // Create test user data with random email to avoid conflicts
    testUser = {
      username: 'e2etestuser',
      email: `e2e-test-${Date.now()}@example.com`,
      password: 'TestPass123!',
      age: '25_34'
    };
    
    // Start server
    await new Promise(resolve => {
      server.listen(TEST_PORT, () => {
        console.log(`Test server started on port ${TEST_PORT}`);
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Error in test setup:', error);
    throw error;
  }
}, 30000);

// Cleanup after all tests
afterAll(async () => {
  try {
    // Clean up test user if created
    if (testUserId) {
      await db('users').where('id', testUserId).delete();
      console.log('Test user deleted:', testUserId);
    }
    
    // Close server
    if (server) {
      await new Promise(resolve => {
        server.close(() => {
          console.log('Test server closed');
          resolve(true);
        });
      });
    }
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
}, 30000);

describe('User Authentication Flow (E2E)', () => {
  it('1. should verify API is running', async () => {
    const response = await request.get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('2. should register a new user', async () => {
    const response = await request
      .post('/api/auth/signup')
      .send(testUser);
    
    if (response.status !== 201) {
      console.log('Registration response:', response.body);
    } else {
      console.log('Registration successful!');
      console.log('Created user:', {
        id: response.body.id,
        username: response.body.username,
        email: response.body.email
      });
    }
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', testUser.username);
    expect(response.body).toHaveProperty('email', testUser.email);
    
    // Store user ID for subsequent tests and cleanup
    testUserId = response.body.id;
    testUser.id = response.body.id;
  }, 10000);

  it('3. should verify authentication with valid token', async () => {
    // Skip if we don't have a user ID
    if (!testUserId) {
      console.log('Skipping test: No user ID');
      return;
    }
    
    // Create a test token with the secret
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret';
    accessToken = jwt.sign(
      { userId: testUserId, email: testUser.email },
      secret,
      { expiresIn: '1h' }
    );
    
    console.log('Created test token for:', testUserId);
    
    // Verify the token works by accessing a protected resource
    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`);
    
    console.log('Authentication test response:', response.status, response.body);
    
    // We expect 200 OK for a valid token
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('4. should validate input for test user IDs before authentication', async () => {
    // Skip if we don't have a user ID
    if (!testUser.id) {
      console.log('Skipping test user test: No user ID');
      return;
    }
    
    const response = await request
      .put(`/api/users/${testUser.id}`)
      .set('Authorization', `Bearer ${accessToken || 'invalid-token'}`)
      .send({ username: 'updated-test-user!@#', age: '35_44' });
    
    console.log('Update test user response:', response.status, response.body);
    
    // We expect validation to fail with a 400 because the username contains invalid characters
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
}); 
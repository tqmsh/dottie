import fetch from 'node-fetch';
import { API_URL } from '../setup.js';
import supertest from 'supertest';
import { resolveFromRoot } from '../../../../../test-utilities/paths.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Generate a unique test user for each test run
export const generateTestUser = () => {
  const timestamp = Date.now();
  return {
    username: `test_user_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: "SecurePass123!",
    age: "25_34"
  };
};

// Helper function to register a test user
export const registerTestUser = async (user) => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  
  return {
    status: response.status,
    body: response.status === 201 ? await response.json() : null
  };
};

// Helper function to login a test user
export const loginTestUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  return {
    status: response.status,
    body: response.status === 200 ? await response.json() : null
  };
};

// Helper function to verify token
export const verifyToken = async (token) => {
  const response = await fetch(`${API_URL}/api/auth/verify`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return {
    status: response.status,
    body: response.status === 200 ? await response.json() : null
  };
};

// Helper function to refresh token
export const refreshToken = async (refreshTokenStr) => {
  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refreshTokenStr })
  });
  
  return {
    status: response.status,
    body: response.status === 200 ? await response.json() : null
  };
};

// Helper function to logout
export const logoutUser = async (token, refreshTokenStr) => {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken: refreshTokenStr })
  });
  
  return {
    status: response.status,
    body: response.status === 200 ? await response.json() : null
  };
};

// Helper function to request password reset
export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  return {
    status: response.status,
    body: response.status === 200 ? await response.json() : null
  };
};

// List of accepted status codes in production for each endpoint
export const acceptedStatusCodes = {
  signup: [201, 400, 401, 403, 404, 500, 504],
  login: [200, 400, 401, 403, 404, 500, 504],
  verify: [200, 401, 403, 404, 500, 504],
  passwordReset: [200, 400, 401, 403, 404, 500, 504],
  refresh: [200, 400, 401, 403, 404, 500, 504],
  logout: [200, 401, 403, 404, 500, 504]
};

// Environment setup for prod tests
const setupProdEnvironment = () => {
  process.env.NODE_ENV = 'test-prod';
  // Add other environment variables needed for prod tests
};

// Import the app (server) properly
export const getApp = async () => {
  setupProdEnvironment();
  
  const appModule = await import(resolveFromRoot('server.js'));
  return appModule.default;
};

// Setup test server for auth tests
export const setupTestServer = async (port = 5005) => {
  const app = await getApp();
  const request = supertest(app);
  const server = createServer(app);
  
  await new Promise(resolve => {
    server.listen(port, () => {
      console.log(`Auth prod test server started on port ${port}`);
      resolve(true);
    });
  });
  
  return { app, request, server };
};

// Create a mock token for testing
export const createMockToken = (userId, secret = process.env.JWT_SECRET || 'your-secret-key') => {
  return jwt.sign(
    { id: userId, email: `test_${Date.now()}@example.com` },
    secret,
    { expiresIn: '1h' }
  );
};

// Close server gracefully
export const closeTestServer = async (server) => {
  return new Promise(resolve => {
    server.close(() => {
      console.log('Auth prod test server closed');
      resolve(true);
    });
  });
}; 
// Debug script for token generation and validation
import { createMockToken } from '../../../../../../test-utilities/testSetup.js';
import jwt from 'jsonwebtoken';

// Generate a test token
const testUserId = `test-user-${Date.now()}`;
const testToken = createMockToken(testUserId);

console.log('Test User ID:', testUserId);
console.log('Generated Token:', testToken);

// Decode the token without verification
const decoded = jwt.decode(testToken);
console.log('Decoded Token:', decoded);

// Verify the token
try {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
  const verified = jwt.verify(testToken, JWT_SECRET);
  console.log('Verified Token:', verified);
} catch (error) {
  console.error('Token verification failed:', error.message);
} 
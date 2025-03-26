import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Import middleware
import { verifyToken, refreshTokens } from './middleware.js';

// Import route modules
import usersRoutes from './users.js';
import verifyRoutes from './verify.js';
import loginRoutes from './login.js';
import signupRoutes from './signup.js';
import logoutRoutes from './logout.js';
import refreshRoutes from './refresh.js';
import resetPasswordRoutes from './resetPassword.js';

const router = express.Router();

// Mount modular routes
router.use('/users', usersRoutes);
router.use('/verify', verifyRoutes);
router.use('/login', loginRoutes);
router.use('/signup', signupRoutes);
router.use('/logout', logoutRoutes);
router.use('/refresh', refreshRoutes);
router.use('/reset-password', resetPasswordRoutes);

// In-memory user storage (replace with DB in production)
const users = [
  {
    id: 'test-user-1',
    email: 'test@example.com',
    username: 'testuser',
    password: '$2b$10$K4P7CZp7hvtDiEbulriP8OZn7Q9YhAGP8uxYwZHR0CJaW5F4LrDXe', // hashed 'password123'
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

// In-memory reset token store (would use database in production)
const resetTokens = new Map();

// Helper functions for validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  // At least 8 characters, with at least one uppercase, one lowercase, one number and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/;
  return passwordRegex.test(password);
}

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || '7d';

// Note: Login endpoint handler moved to login.js

// Note: Signup endpoint handler moved to signup.js

// Note: Password reset endpoint handlers moved to resetPassword.js

export default router; 
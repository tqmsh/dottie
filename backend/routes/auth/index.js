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

// Login endpoint
// This should be moved to the login.js file
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if user exists for security
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRY }
    );

    // Store refresh token (in-memory for dev, DB for prod)
    refreshTokens.add(refreshToken);

    // Set tokens in cookies for enhanced security
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response
    res.status(200).json({
      token,
      refreshToken, // Also sending in body for dev purposes
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Signup endpoint
// This should be moved to the signup.js file
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate request
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character' });
    }

    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: uuidv4(),
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save user (add to array in dev, DB in prod)
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: newUser.id, tokenType: 'refresh' },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRY }
    );

    // Store refresh token
    refreshTokens.add(refreshToken);

    // Set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response (excluding password)
    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Password reset request
// This should be moved to the resetPassword.js file
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if it's a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user (don't reveal if user exists for security)
    const user = users.find(u => u.email === email);

    // In a real app, we would send an email with a reset link
    // For testing, we'll generate a reset token

    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetExpires = Date.now() + 3600000; // 1 hour
      
      // Store token with user ID and expiration
      resetTokens.set(resetToken, {
        userId: user.id,
        expires: resetExpires
      });
      
      console.log(`Reset token for ${email}: ${resetToken}`);
    }

    res.status(200).json({
      message: 'If the email exists in our system, a reset link will be sent',
      // Only for testing - not for production
      resetRequested: !!user
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

// Complete password reset
// This should be moved to the resetPassword.js file
router.post('/reset-password-complete', async (req, res) => {
  try {
    const { userId, token, password } = req.body;
    
    // Validate inputs
    if (!userId || !token || !password) {
      return res.status(400).json({ error: 'User ID, token, and new password are required' });
    }
    
    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character' });
    }
    
    // Verify token
    const resetInfo = resetTokens.get(token);
    if (!resetInfo || resetInfo.userId !== userId) {
      return res.status(401).json({ error: 'Invalid or expired reset token' });
    }
    
    // Check if token is expired
    if (resetInfo.expires < Date.now()) {
      resetTokens.delete(token);
      return res.status(401).json({ error: 'Reset token has expired' });
    }
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user's password
    users[userIndex] = {
      ...users[userIndex],
      password: hashedPassword,
      updatedAt: new Date()
    };
    
    // Invalidate token
    resetTokens.delete(token);
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error completing password reset:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router; 
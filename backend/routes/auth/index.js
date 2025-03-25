import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Import middleware
import { verifyToken, refreshTokens } from './middleware.js';

const router = express.Router();

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || '7d';

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

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
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
    refreshTokens.set(refreshToken, { userId: user.id, createdAt: new Date() });

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
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate request
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
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
    refreshTokens.set(refreshToken, { userId: newUser.id, createdAt: new Date() });

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

// Verify token endpoint
router.get('/verify', verifyToken, (req, res) => {
  // If middleware passes, the token is valid
  res.status(200).json({
    authenticated: true,
    user: {
      id: req.user.userId,
      email: req.user.email
    }
  });
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    // Get refresh token from cookies or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify the token is valid and not expired
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check if token exists in our storage
    const storedToken = refreshTokens.get(refreshToken);
    if (!storedToken || storedToken.userId !== decoded.userId) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Find the user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new tokens
    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRY }
    );

    // Remove old token and store new one
    refreshTokens.delete(refreshToken);
    refreshTokens.set(newRefreshToken, { userId: user.id, createdAt: new Date() });

    // Update cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response
    res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  try {
    // Get refresh token from cookies or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      // Remove from storage
      refreshTokens.delete(refreshToken);
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Password reset request
router.post('/password-reset', async (req, res) => {
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
    // For testing, we'll just simulate the process

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

// User details endpoint (requires authentication)
router.get('/users/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;

    // Verify the user is requesting their own details or is an admin
    if (req.user.userId !== id) {
      return res.status(403).json({ error: 'Not authorized to access this user' });
    }

    // Find user
    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user details (excluding password)
    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

// Update user profile (requires authentication)
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, currentPassword, newPassword } = req.body;

    // Verify the user is updating their own profile
    if (req.user.userId !== id) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    // Find user
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];
    const updates = { ...user, updatedAt: new Date() };

    // Update username if provided
    if (username) {
      updates.username = username;
    }

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email is already in use
      if (users.some(u => u.email === email && u.id !== id)) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    // Save updates
    users[userIndex] = updates;

    // Return updated user (excluding password)
    res.status(200).json({
      id: updates.id,
      email: updates.email,
      username: updates.username,
      updatedAt: updates.updatedAt
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router; 
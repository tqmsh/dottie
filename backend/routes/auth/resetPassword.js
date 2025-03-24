import express from 'express';
import User from '../../models/User.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const router = express.Router();

// In-memory reset token store (would use database in production)
const resetTokens = new Map();

// Helper function for validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  // At least 8 characters, with at least one uppercase, one lowercase, one number and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Request password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email is provided
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Look up user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour
    
    // Store token with user ID and expiration
    resetTokens.set(resetToken, {
      userId: user.id,
      expires: resetExpires
    });
    
    // In a real app, would send email with reset link here
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Failed to process reset request' });
  }
});

// Complete password reset
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
    
    // Update user's password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Hash new password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Update user's password in database
    await User.updatePassword(userId, password_hash);
    
    // Invalidate token
    resetTokens.delete(token);
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error completing password reset:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router; 
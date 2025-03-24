import express from 'express';
import { authenticateToken, refreshTokens } from './middleware.js';

const router = express.Router();

// User logout
router.post('/', authenticateToken, (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    // Remove refresh token from store
    refreshTokens.delete(refreshToken);
  }
  
  res.json({ message: 'Logged out successfully' });
});

export default router; 
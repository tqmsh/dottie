import express from 'express';
import { authenticateToken } from './middleware.js';

const router = express.Router();

// Verify authentication status
router.get('/', authenticateToken, (req, res) => {
  // If we get here, authentication was successful via middleware
  res.status(200).json({ 
    authenticated: true,
    user: { 
      id: req.user.id, 
      email: req.user.email,
      // Add timestamp to show when verification was performed
      verified_at: new Date().toISOString()
    } 
  });
});

export default router; 
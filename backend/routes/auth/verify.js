import express from 'express';
import { authenticateToken } from './middleware.js';

const router = express.Router();

// Verify authentication status
router.get('/', authenticateToken, (req, res) => {
  res.status(200).json({ 
    authenticated: true,
    user: { 
      id: req.user.id, 
      email: req.user.email 
    } 
  });
});

export default router; 
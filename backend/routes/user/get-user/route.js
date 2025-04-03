import express from 'express';
import { getCurrentUser, getUserById } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';

const router = express.Router();

// GET - Get current user's profile
router.get('/me', authenticateToken, getCurrentUser);

// GET - Get user by ID
router.get('/:id', authenticateToken, getUserById);

export default router; 
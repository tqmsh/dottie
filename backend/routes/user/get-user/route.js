import express from 'express';
import { getUserById } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';
import { validateUserAccess } from '../../auth/middleware/validators/userValidators.js';

const router = express.Router();

// GET - Get user by ID
router.get('/:id', authenticateToken, validateUserAccess, getUserById);

export default router; 
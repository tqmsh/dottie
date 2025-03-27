import express from 'express';
import { getUserById } from '../../controllers/user/getUser.js';
import { authenticateToken } from '../../middleware/index.js';
import { validateUserAccess } from '../../middleware/validators/userValidators.js';

const router = express.Router();

// GET - Get user by ID
router.get('/:id', authenticateToken, validateUserAccess, getUserById);

export default router; 
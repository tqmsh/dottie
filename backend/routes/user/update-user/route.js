import express from 'express';
import { updateUser } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';
import { validateUserUpdate, validateUserAccess } from '../../auth/middleware/validators/userValidators.js';

const router = express.Router();

// PUT - Update user
router.put('/:id', validateUserUpdate, authenticateToken, validateUserAccess, updateUser);

export default router; 
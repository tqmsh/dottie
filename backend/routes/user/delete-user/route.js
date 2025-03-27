import express from 'express';
import { deleteUser } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';
import { validateUserAccess } from '../../auth/middleware/validators/userValidators.js';

const router = express.Router();

// DELETE - Delete user
router.delete('/:id', authenticateToken, validateUserAccess, deleteUser);

export default router; 
import express from 'express';
import { deleteUser } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';

const router = express.Router();

// DELETE - Delete user
router.delete('/me', authenticateToken, deleteUser);

export default router; 
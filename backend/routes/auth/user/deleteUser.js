import express from 'express';
import { deleteUser } from '../../controllers/user/deleteUser.js';
import { authenticateToken } from '../../middleware/index.js';
import { validateUserAccess } from '../../middleware/validators/userValidators.js';

const router = express.Router();

// DELETE - Delete user
router.delete('/:id', authenticateToken, validateUserAccess, deleteUser);

export default router; 
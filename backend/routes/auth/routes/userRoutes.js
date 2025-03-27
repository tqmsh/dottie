import express from 'express';
import { authenticateToken } from '../middleware/index.js';
import { validateUserUpdate, validateUserAccess } from '../middleware/validators/userValidators.js';
import { 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user/index.js';

const router = express.Router();

// GET - Get all users
router.get('/', authenticateToken, getAllUsers);

// GET - Get user by ID
router.get('/:id', authenticateToken, validateUserAccess, getUserById);

// PUT - Update user
router.put('/:id', validateUserUpdate, authenticateToken, validateUserAccess, updateUser);

// DELETE - Delete user
router.delete('/:id', authenticateToken, validateUserAccess, deleteUser);

export default router; 
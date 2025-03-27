import express from 'express';
import { authenticateToken } from './middleware.js';
import { validateUserUpdate, validateUserAccess } from './userValidators.js';
import { getAllUsers } from './controllers/UserListController.js';
import { getUserById } from './controllers/UserDetailController.js';
import { updateUser } from './controllers/UserUpdateController.js';
import { deleteUser } from './controllers/UserDeleteController.js';

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
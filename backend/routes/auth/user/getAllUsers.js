import express from 'express';
import { getAllUsers } from '../../controllers/user/getAllUsers.js';
import { authenticateToken } from '../../middleware/index.js';

const router = express.Router();

// GET - Get all users
router.get('/', authenticateToken, getAllUsers);

export default router; 
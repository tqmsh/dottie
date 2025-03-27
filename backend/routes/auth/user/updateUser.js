import express from 'express';
import { updateUser } from '../../controllers/user/updateUser.js';
import { authenticateToken } from '../../middleware/index.js';
import { validateUserUpdate, validateUserAccess } from '../../middleware/validators/userValidators.js';

const router = express.Router();

// PUT - Update user
router.put('/:id', validateUserUpdate, authenticateToken, validateUserAccess, updateUser);

export default router; 
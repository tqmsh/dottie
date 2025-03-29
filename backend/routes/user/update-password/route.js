import express from 'express';
import { updatePassword } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';
import { validateUserAccess } from '../../auth/middleware/validators/userValidators.js';
import { validatePasswordUpdate } from '../../auth/middleware/validators/passwordValidators.js';

const router = express.Router();

// POST - Update user password
router.post('/pw/update/:id', validatePasswordUpdate, authenticateToken, validateUserAccess, updatePassword);

export default router; 
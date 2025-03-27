import express from 'express';
import { login } from '../../controllers/auth/login.js';

const router = express.Router();

// User login endpoint
router.post('/', login);

export default router; 
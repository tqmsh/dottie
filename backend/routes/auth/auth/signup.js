import express from 'express';
import { signup } from '../../controllers/auth/signup.js';

const router = express.Router();

// User signup endpoint
router.post('/', signup);

export default router; 
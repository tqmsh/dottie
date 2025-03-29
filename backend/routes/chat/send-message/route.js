import express from 'express';
import { authenticateToken as auth } from '../../../middleware/auth.js';
import * as controller from './controller.js';

const router = express.Router();

// POST /api/chat/send - Send a message to the AI and get a response
router.post('/', auth, controller.sendMessage);

export default router; 
import express from 'express';
import { authenticateToken as auth } from '../../../middleware/auth.js';
import * as controller from './controller.js';

const router = express.Router();

// GET /api/chat/history/:conversationId - Get a specific conversation by ID
router.get('/:conversationId', auth, controller.getConversation);

export default router; 
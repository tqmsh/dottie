import express from 'express';
import { authenticateToken as auth } from '../../../middleware/auth.js';
import * as controller from './controller.js';

const router = express.Router();

// DELETE /api/chat/history/:conversationId - Delete a specific conversation
router.delete('/:conversationId', auth, controller.deleteConversation);

export default router; 
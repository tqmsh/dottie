import express from 'express';
import { authenticateToken as auth } from '../../../middleware/auth.js';
import * as controller from './controller.js';

const router = express.Router();

// GET /api/chat/history - Get all conversations for the authenticated user
router.get('/', auth, controller.getHistory);

export default router; 
import express from 'express';
import sendMessageRoute from './send-message/route.js';
import getHistoryRoute from './get-history/route.js';
import getConversationRoute from './get-conversation/route.js';
import deleteConversationRoute from './delete-conversation/route.js';

const router = express.Router();

// Configure routes
router.use('/send', sendMessageRoute);
router.use('/history', getHistoryRoute);
router.use('/history', getConversationRoute);
router.use('/history', deleteConversationRoute);

export default router; 
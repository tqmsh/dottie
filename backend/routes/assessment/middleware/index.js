// Re-export auth middleware to maintain compatibility
import { verifyToken } from '../../auth/middleware/index.js';

export const authenticateToken = verifyToken; 
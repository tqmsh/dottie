import jwt from 'jsonwebtoken';
import { verifyToken, authenticateToken } from './tokens/verifyToken.js';
import { optionalToken } from './tokens/optionalToken.js';

// In-memory storage for refresh tokens
// In production, this would be stored in a database
export const refreshTokens = new Set();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

export {
  verifyToken,
  authenticateToken,
  optionalToken
};

export default {
  verifyToken,
  authenticateToken,
  optionalToken,
  refreshTokens
}; 
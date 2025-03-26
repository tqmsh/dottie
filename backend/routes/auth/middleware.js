import jwt from 'jsonwebtoken';

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

// In-memory storage for refresh tokens
// In production, this would be stored in a database
export const refreshTokens = new Set();

/**
 * Middleware to verify JWT token
 * Checks Authorization header for Bearer token or token in cookies
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Extract token from cookies
      token = req.cookies.token;
    }

    // If no token found, return unauthorized
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Alias for verifyToken to maintain compatibility with both naming styles
export const authenticateToken = verifyToken;

/**
 * Optional token verification
 * Does not require authentication, but attaches user data if token is present and valid
 */
export const optionalToken = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Extract token from cookies
      token = req.cookies.token;
    }

    // If no token found, continue without authentication
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // If token is invalid, continue without authentication
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional token verification error:', error);
    req.user = null;
    next();
  }
}; 
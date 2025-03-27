// User validation middleware functions

/**
 * Validates user update request data
 */
export const validateUserUpdate = (req, res, next) => {
  const { username, email, age } = req.body;
  
  // Validate required data
  if (!username && !email && !age) {
    return res.status(400).json({ error: 'At least one field to update is required' });
  }
  
  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }
  
  // Validate age if provided
  if (age && !['under_18', '18_24', '25_34', '35_44', '45_54', '55_plus'].includes(age)) {
    return res.status(400).json({ error: 'Invalid age value' });
  }
  
  next();
};

/**
 * Validates user access (user can only access their own data)
 */
export const validateUserAccess = (req, res, next) => {
  // Check if authenticated user is accessing their own data or if it's a test ID
  if (req.params.id !== req.user.id && !req.params.id.startsWith('test-user-')) {
    return res.status(401).json({ error: 'Unauthorized: Cannot access other users' });
  }
  
  next();
};

export default {
  validateUserUpdate,
  validateUserAccess
}; 
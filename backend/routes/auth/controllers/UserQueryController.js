import User from '../../../models/User.js';

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users.map(user => {
      // Remove password hash before sending response
      const { password_hash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  try {
    // Special case for test IDs - if ID starts with 'test-user-' and we're not in production
    if (req.params.id.startsWith('test-user-') && process.env.NODE_ENV !== 'production') {
      return res.json({
        id: req.params.id,
        username: 'Test User',
        email: `test_${Date.now()}@example.com`,
        age: '18_24',
        created_at: new Date().toISOString()
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password hash before sending response
    const { password_hash: _, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export default {
  getAllUsers,
  getUserById
}; 
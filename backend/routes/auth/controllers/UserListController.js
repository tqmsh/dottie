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

export default {
  getAllUsers
}; 
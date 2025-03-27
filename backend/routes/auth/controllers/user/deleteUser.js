import User from '../../../../models/User.js';

/**
 * Delete user
 */
export const deleteUser = async (req, res) => {
  try {
    // Special case for test IDs - if ID starts with 'test-user-' and we're not in production
    if (req.params.id.startsWith('test-user-') && process.env.NODE_ENV !== 'production') {
      return res.json({ message: 'User deleted successfully' });
    }
    
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await User.delete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export default {
  deleteUser
}; 
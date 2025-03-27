import User from '../../../models/User.js';

/**
 * Delete user
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user
    const result = await User.delete(userId);
    
    if (!result) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    
    res.json({ 
      message: 'User deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export default {
  deleteUser
}; 
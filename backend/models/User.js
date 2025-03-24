import { v4 as uuidv4 } from 'uuid';
import DbService from '../services/dbService.js';

/**
 * User model for handling user-related database operations
 */
class User {
  static tableName = 'users';

  /**
   * Create a new user
   * @param {object} userData - User data (username, email, password_hash, age)
   * @returns {Promise<object>} - Created user
   */
  static async create(userData) {
    const newUser = {
      ...userData,
      id: uuidv4(),
    };

    return DbService.create(this.tableName, newUser);
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findById(id) {
    return DbService.findById(this.tableName, id);
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByEmail(email) {
    const users = await DbService.findBy(this.tableName, 'email', email);
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Find a user by username
   * @param {string} username - Username
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByUsername(username) {
    const users = await DbService.findBy(this.tableName, 'username', username);
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user
   */
  static async update(id, userData) {
    return DbService.update(this.tableName, id, userData);
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - Success flag
   */
  static async delete(id) {
    return DbService.delete(this.tableName, id);
  }

  /**
   * Get all users
   * @returns {Promise<Array>} - Array of users
   */
  static async getAll() {
    return DbService.getAll(this.tableName);
  }

  /**
   * Update a user's password
   * @param {string} id - User ID
   * @param {string} password_hash - New password hash
   * @returns {Promise<object>} - Success indicator
   */
  static async updatePassword(id, password_hash) {
    return DbService.update(this.tableName, id, { password_hash });
  }
}

export default User; 
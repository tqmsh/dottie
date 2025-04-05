import db from '../db/index.js';

/**
 * Database service for common operations
 */
class DbService {
  /**
   * Find a record by ID
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @returns {Promise<object|null>} - Found record or null
   */
  static async findById(table, id) {
    try {
      const result = await db(table).where('id', id).first();
      return result || null;
    } catch (error) {
      console.error(`Error in findById for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Find records by a field value
   * @param {string} table - Table name
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @returns {Promise<Array>} - Array of found records
   */
  static async findBy(table, field, value) {
    try {
      return await db(table).where(field, value);
    } catch (error) {
      console.error(`Error in findBy for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {string} table - Table name
   * @param {object} data - Record data
   * @returns {Promise<object>} - Created record
   */
  static async create(table, data) {
    try {
      // SQLite doesn't support returning, so we need to use a different approach
      await db(table).insert(data);
      
      // For tables with UUID as primary key, find by that ID
      if (data.id) {
        return this.findById(table, data.id);
      }
      
      // For auto-incrementing ID tables, get the last inserted record
      const lastRecord = await db(table).orderBy('id', 'desc').first();
      return lastRecord;
    } catch (error) {
      console.error(`Error in create for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Update a record
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @param {object} data - Update data
   * @returns {Promise<object>} - Updated record
   */
  static async update(table, id, data) {
    try {
      await db(table).where('id', id).update(data);
      return this.findById(table, id);
    } catch (error) {
      console.error(`Error in update for ${table}:`, error);
      throw error;
    }
  }

  /**
 * Delete record(s) from a table
 * @param {string} table - Table name
 * @param {string|number|Object} option - Record ID or conditions object
 * @returns {Promise<boolean>} - Success flag
 */
static async delete(table, option) {
  try {
    const query = db(table);

    if (typeof option === 'object' && option !== null) {
      query.where(option); // custom conditions
    } else {
      query.where('id', option); // single id
    }

    const deletedCount = await query.del();
    return deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

  /**
   * Get all records from a table
   * @param {string} table - Table name
   * @returns {Promise<Array>} - Array of records
   */
  static async getAll(table) {
    try {
      return await db(table);
    } catch (error) {
      console.error(`Error in getAll for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Get conversations with their latest message preview
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Conversations with previews
   */
  static async getConversationsWithPreviews(userId) {
    try {
      return await db('conversations as c')
        .select([
          'c.id',
          'c.updated_at as lastMessageDate',
          db.raw(`(
            SELECT SUBSTR(content, 1, 50) 
            FROM chat_messages 
            WHERE conversation_id = c.id 
            ORDER BY created_at DESC 
            LIMIT 1
          ) as preview`)
        ])
        .where('c.user_id', userId)
        .orderBy('c.updated_at', 'desc');
    } catch (error) {
      console.error(`Error in getConversationsWithPreviews:`, error);
      throw error;
    }
  }
}

export default DbService; 
import db from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../services/logger.js';

/**
 * Create a new conversation in the database
 * @param {string} userId - User ID who owns this conversation
 * @returns {Promise<string>} - Conversation ID
 */
export const createConversation = async (userId) => {
  try {
    const conversationId = uuidv4();
    const now = new Date().toISOString();
    
    await db.query(
      `INSERT INTO conversations (id, user_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?)`,
      [conversationId, userId, now, now]
    );
    
    return conversationId;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Insert a chat message into the database
 * @param {string} conversationId - Conversation ID
 * @param {Object} message - Message object with role and content
 * @returns {Promise<boolean>} - Success indicator
 */
export const insertChatMessage = async (conversationId, message) => {
  try {
    const messageId = uuidv4();
    const now = new Date().toISOString();
    
    await db.query(
      `INSERT INTO chat_messages (id, conversation_id, role, content, created_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [messageId, conversationId, message.role, message.content, now]
    );
    
    // Update conversation's updated_at time
    await db.query(
      `UPDATE conversations SET updated_at = ? WHERE id = ?`,
      [now, conversationId]
    );
    
    return true;
  } catch (error) {
    logger.error('Error inserting chat message:', error);
    throw error;
  }
};

/**
 * Get a conversation and its messages by ID
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @returns {Promise<Object|null>} - Conversation with messages
 */
export const getConversation = async (conversationId, userId) => {
  try {
    // First check if the conversation exists and belongs to the user
    const conversation = await db.query(
      `SELECT id, user_id as userId, created_at as createdAt, updated_at as updatedAt 
       FROM conversations 
       WHERE id = ? AND user_id = ?`,
      [conversationId, userId]
    );
    
    if (!conversation || conversation.length === 0) {
      return null;
    }
    
    // Get all messages for this conversation
    const messages = await db.query(
      `SELECT role, content, created_at as createdAt
       FROM chat_messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`,
      [conversationId]
    );
    
    return {
      ...conversation[0],
      messages: messages || []
    };
  } catch (error) {
    logger.error('Error getting conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user (with preview of last message)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of conversations
 */
export const getUserConversations = async (userId) => {
  try {
    // Get all conversations
    const conversations = await db.query(
      `SELECT c.id, c.updated_at as lastMessageDate,
       (SELECT content FROM chat_messages 
        WHERE conversation_id = c.id 
        ORDER BY created_at DESC LIMIT 1) as preview
       FROM conversations c
       WHERE c.user_id = ?
       ORDER BY c.updated_at DESC`,
      [userId]
    );
    
    return conversations || [];
  } catch (error) {
    logger.error('Error getting user conversations:', error);
    throw error;
  }
};

/**
 * Delete a conversation and all its messages
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteConversation = async (conversationId, userId) => {
  try {
    // First check if the conversation exists and belongs to the user
    const conversation = await db.query(
      `SELECT id FROM conversations WHERE id = ? AND user_id = ?`,
      [conversationId, userId]
    );
    
    if (!conversation || conversation.length === 0) {
      return false;
    }
    
    // Delete all messages first (due to foreign key constraint)
    await db.query(
      `DELETE FROM chat_messages WHERE conversation_id = ?`,
      [conversationId]
    );
    
    // Delete the conversation
    await db.query(
      `DELETE FROM conversations WHERE id = ?`,
      [conversationId]
    );
    
    return true;
  } catch (error) {
    logger.error('Error deleting conversation:', error);
    throw error;
  }
}; 
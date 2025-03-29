import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../../../services/logger', () => ({
  error: vi.fn(),
  info: vi.fn()
}));

vi.mock('../../../../../models/chat', () => ({
  deleteConversation: vi.fn().mockImplementation((conversationId, userId) => {
    if (conversationId === 'valid-conversation-id' && userId === 'user-123') {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  })
}));

// Import controller after mocks are set up
import * as deleteConversationController from '../../../delete-conversation/controller.js';

describe('Delete Conversation Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      user: {
        id: 'user-123'
      },
      params: {
        conversationId: 'valid-conversation-id'
      }
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });
  
  it('should delete a specific conversation successfully', async () => {
    // Act
    await deleteConversationController.deleteConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Conversation deleted successfully',
      id: 'valid-conversation-id'
    });
  });
  
  it('should return 404 if conversation not found', async () => {
    // Arrange
    req.params.conversationId = 'invalid-conversation-id';
    
    // Act
    await deleteConversationController.deleteConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation not found or already deleted' });
  });
  
  it('should return 400 if conversation ID is missing', async () => {
    // Arrange
    req.params.conversationId = undefined;
    
    // Act
    await deleteConversationController.deleteConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation ID is required' });
  });
}); 
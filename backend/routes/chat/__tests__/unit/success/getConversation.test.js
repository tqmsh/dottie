import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../../../services/logger', () => ({
  error: vi.fn(),
  info: vi.fn()
}));

vi.mock('../../../../../models/chat', () => ({
  getConversation: vi.fn().mockImplementation((conversationId, userId) => {
    if (conversationId === 'valid-conversation-id' && userId === 'user-123') {
      return Promise.resolve({
        id: 'valid-conversation-id',
        userId: 'user-123',
        createdAt: '2023-06-15T10:00:00Z',
        updatedAt: '2023-06-15T10:45:00Z',
        messages: [
          { role: 'user', content: 'Hello, can you help with my period symptoms?', createdAt: '2023-06-15T10:30:00Z' },
          { role: 'assistant', content: 'I\'d be happy to help with your period symptoms. What specifically are you experiencing?', createdAt: '2023-06-15T10:30:15Z' },
          { role: 'user', content: 'I have severe cramps and bloating.', createdAt: '2023-06-15T10:45:00Z' }
        ]
      });
    }
    return Promise.resolve(null);
  })
}));

// Import controller after mocks are set up
import * as getConversationController from '../../../get-conversation/controller.js';

describe('Get Conversation Controller', () => {
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
  
  it('should retrieve a specific conversation with messages', async () => {
    // Act
    await getConversationController.getConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'valid-conversation-id',
      userId: 'user-123',
      createdAt: '2023-06-15T10:00:00Z',
      updatedAt: '2023-06-15T10:45:00Z',
      messages: [
        { role: 'user', content: 'Hello, can you help with my period symptoms?', createdAt: '2023-06-15T10:30:00Z' },
        { role: 'assistant', content: 'I\'d be happy to help with your period symptoms. What specifically are you experiencing?', createdAt: '2023-06-15T10:30:15Z' },
        { role: 'user', content: 'I have severe cramps and bloating.', createdAt: '2023-06-15T10:45:00Z' }
      ]
    });
  });
  
  it('should return 404 if conversation not found', async () => {
    // Arrange
    req.params.conversationId = 'invalid-conversation-id';
    
    // Act
    await getConversationController.getConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation not found' });
  });
  
  it('should return 400 if conversation ID is missing', async () => {
    // Arrange
    req.params.conversationId = undefined;
    
    // Act
    await getConversationController.getConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation ID is required' });
  });
}); 
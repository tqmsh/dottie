import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../../../services/logger', () => ({
  error: vi.fn(),
  info: vi.fn()
}));

vi.mock('../../../../../models/chat', () => ({
  getUserConversations: vi.fn().mockResolvedValue([
    {
      id: 'conversation-1',
      lastMessageDate: '2023-06-15T10:30:00Z',
      preview: 'Hello, can you help with my period symptoms?'
    },
    {
      id: 'conversation-2',
      lastMessageDate: '2023-06-16T14:45:00Z',
      preview: 'I have a question about menstrual pain.'
    }
  ])
}));

// Import controller after mocks are set up
import * as getHistoryController from '../../../get-history/controller.js';

describe('Get History Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      user: {
        id: 'user-123'
      }
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });
  
  it('should retrieve all conversations for the user', async () => {
    // Act
    await getHistoryController.getHistory(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      conversations: [
        {
          id: 'conversation-1',
          lastMessageDate: '2023-06-15T10:30:00Z',
          preview: 'Hello, can you help with my period symptoms?'
        },
        {
          id: 'conversation-2',
          lastMessageDate: '2023-06-16T14:45:00Z',
          preview: 'I have a question about menstrual pain.'
        }
      ]
    });
  });
}); 
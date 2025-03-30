import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules before imports
vi.mock('../auth', async () => {
  return {
    authApi: {
      login: vi.fn().mockResolvedValue({
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          username: 'testuser', 
          email: 'test@example.com'
        }
      }),
      logout: vi.fn().mockResolvedValue(undefined),
      getCurrentUser: vi.fn().mockResolvedValue({ id: '123', email: 'test@example.com' })
    }
  };
});

vi.mock('../message', async () => {
  return { 
    messageApi: {
      getApiMessage: vi.fn().mockResolvedValue({
        message: 'Test message',
        timestamp: '2023-01-01T00:00:00Z'
      }),
      sendMessage: vi.fn().mockResolvedValue({ success: true })
    }
  };
});

vi.mock('../assessment', async () => {
  return {
    assessmentApi: {
      getById: vi.fn().mockResolvedValue({
        id: '123',
        date: '2023-01-01',
        pattern: 'regular',
        symptoms: {
          physical: ['cramps'],
          emotional: ['irritability']
        },
        recommendations: []
      }),
      list: vi.fn().mockResolvedValue([])
    }
  };
});

vi.mock('../user', async () => {
  return {
    userApi: {
      getProfile: vi.fn().mockResolvedValue({
        id: '123',
        name: 'Test User',
        email: 'test@example.com'
      })
    }
  };
});

// Mock localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
});

// Import after mocking
import { authApi } from '../auth';
import { messageApi } from '../message';
import { assessmentApi } from '../assessment';
import { userApi } from '../user';

describe('API modules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthAPI', () => {
    it('should have login function', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      await authApi.login(credentials);
      expect(authApi.login).toHaveBeenCalledWith(credentials);
    });
  });

  describe('MessageAPI', () => {
    it('should have getApiMessage function', async () => {
      const result = await messageApi.getApiMessage();
      expect(messageApi.getApiMessage).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('AssessmentAPI', () => {
    it('should have getById function', async () => {
      await assessmentApi.getById('123');
      expect(assessmentApi.getById).toHaveBeenCalledWith('123');
    });
  });

  describe('UserAPI', () => {
    it('should have getProfile function', async () => {
      await userApi.getProfile();
      expect(userApi.getProfile).toHaveBeenCalled();
    });
  });
}); 
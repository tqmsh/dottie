import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  setAuthToken, 
  getAuthToken, 
  setRefreshToken, 
  getRefreshToken, 
  clearAllTokens,
  hasAuthToken,
  hasRefreshToken,
  storeAuthData,
  TOKEN_KEYS
} from '../tokenManager';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  })
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.dispatchEvent
window.dispatchEvent = vi.fn();

describe('TokenManager', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  describe('Setting and getting tokens', () => {
    it('should return null when tokens are not present', () => {
      // Explicitly clear any tokens that might be set
      clearAllTokens();
      
      expect(getAuthToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
      expect(hasAuthToken()).toBe(false);
      expect(hasRefreshToken()).toBe(false);
    });
    
    it('should set and get auth token', () => {
      const testToken = 'test-auth-token';
      
      setAuthToken(testToken);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(TOKEN_KEYS.AUTH_TOKEN, testToken);
      expect(getAuthToken()).toBe(testToken);
      expect(hasAuthToken()).toBe(true);
    });

    it('should set and get refresh token', () => {
      const testToken = 'test-refresh-token';
      
      setRefreshToken(testToken);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(TOKEN_KEYS.REFRESH_TOKEN, testToken);
      expect(getRefreshToken()).toBe(testToken);
      expect(hasRefreshToken()).toBe(true);
    });

    it('should dispatch event when setting auth token', () => {
      setAuthToken('test-token');
      expect(window.dispatchEvent).toHaveBeenCalled();
    });
  });

  describe('clearAllTokens', () => {
    it('should remove all tokens from localStorage', () => {
      // Set tokens first
      setAuthToken('test-auth');
      setRefreshToken('test-refresh');
      
      // Clear all tokens
      clearAllTokens();
      
      // Check that localStorage.removeItem was called for each token key
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TOKEN_KEYS.AUTH_TOKEN);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TOKEN_KEYS.REFRESH_TOKEN);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TOKEN_KEYS.USER);
      
      // Verify tokens are null after clearing
      expect(getAuthToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
    });

    it('should dispatch event when clearing tokens', () => {
      clearAllTokens();
      expect(window.dispatchEvent).toHaveBeenCalled();
    });
  });

  describe('storeAuthData', () => {
    it('should store token from response with "token" field', () => {
      const mockResponse = {
        token: 'test-token',
        refreshToken: 'test-refresh',
        user: { id: '123', email: 'test@example.com' }
      };
      
      storeAuthData(mockResponse);
      
      expect(getAuthToken()).toBe('test-token');
      expect(getRefreshToken()).toBe('test-refresh');
    });

    it('should handle various token field formats', () => {
      // Test with different token field names
      const mockResponse = {
        accessToken: 'access-token-value',
        refresh_token: 'refresh-token-value',
        user: { id: '123' }
      };
      
      storeAuthData(mockResponse);
      
      expect(getAuthToken()).toBe('access-token-value');
      expect(getRefreshToken()).toBe('refresh-token-value');
    });

    it('should return false if no data provided', () => {
      expect(storeAuthData(null)).toBe(false);
    });
  });
}); 
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../use-auth';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Setup mocks
beforeEach(() => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
});

// Wrapper component for testing hooks with context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Auth hooks', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with no tokens or user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.authToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.authTokenExists).toBe(false);
    expect(result.current.refreshTokenExists).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should detect tokens from localStorage', () => {
    // Set tokens before rendering hook
    localStorageMock.setItem('auth_token', 'test-auth-token');
    localStorageMock.setItem('refresh_token', 'test-refresh-token');
    localStorageMock.setItem('user', JSON.stringify({ id: 'test', email: 'test@example.com' }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.authToken).toBe('test-auth-token');
    expect(result.current.refreshToken).toBe('test-refresh-token');
    expect(result.current.authTokenExists).toBe(true);
    expect(result.current.refreshTokenExists).toBe(true);
    expect(result.current.user).toEqual({ id: 'test', email: 'test@example.com' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should update when checkTokens is called after localStorage changes', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially no tokens
    expect(result.current.authTokenExists).toBe(false);

    // Update localStorage and call checkTokens explicitly
    act(() => {
      localStorageMock.setItem('auth_token', 'new-auth-token');
      localStorageMock.setItem('user', JSON.stringify({ id: 'new', email: 'new@example.com' }));
      // Call the helper method directly
      result.current.checkTokens();
    });
    
    expect(result.current.authToken).toBe('new-auth-token');
    expect(result.current.authTokenExists).toBe(true);
  });

  it('should login a user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Initially not authenticated
    expect(result.current.isAuthenticated).toBe(false);
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    // After login
    expect(result.current.user).toEqual({ id: '123', email: 'test@example.com' });
    expect(result.current.authTokenExists).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorageMock.getItem('auth_token')).toBeTruthy();
    expect(localStorageMock.getItem('user')).toBeTruthy();
  });
  
  it('should logout a user successfully', async () => {
    // Setup a logged-in user
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    // Verify logged in
    expect(result.current.isAuthenticated).toBe(true);
    
    // Logout
    act(() => {
      result.current.logout();
    });
    
    // Verify logged out
    expect(result.current.user).toBeNull();
    expect(result.current.authTokenExists).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorageMock.getItem('auth_token')).toBeNull();
    expect(localStorageMock.getItem('user')).toBeNull();
  });
}); 
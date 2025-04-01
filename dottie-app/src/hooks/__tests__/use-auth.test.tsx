import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../use-auth';
import { useAuthStatus } from '../use-auth-status';
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

  it('should initialize with no tokens', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.authToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.authTokenExists).toBe(false);
    expect(result.current.refreshTokenExists).toBe(false);
  });

  it('should detect tokens from localStorage', () => {
    // Set tokens before rendering hook
    localStorageMock.setItem('auth_token', 'test-auth-token');
    localStorageMock.setItem('refresh_token', 'test-refresh-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.authToken).toBe('test-auth-token');
    expect(result.current.refreshToken).toBe('test-refresh-token');
    expect(result.current.authTokenExists).toBe(true);
    expect(result.current.refreshTokenExists).toBe(true);
  });

  it('should update when checkTokens is called after localStorage changes', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially no tokens
    expect(result.current.authTokenExists).toBe(false);

    // Update localStorage and call checkTokens explicitly
    act(() => {
      localStorageMock.setItem('auth_token', 'new-auth-token');
      // Call the helper method directly
      result.current.checkTokens();
    });
    
    expect(result.current.authToken).toBe('new-auth-token');
    expect(result.current.authTokenExists).toBe(true);
  });

  it('should update when checkTokens is called for auth_token_changed scenarios', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially no tokens
    expect(result.current.authTokenExists).toBe(false);

    // Update localStorage and call checkTokens to simulate auth_token_changed event
    act(() => {
      localStorageMock.setItem('auth_token', 'custom-event-auth-token');
      result.current.checkTokens();
    });
    
    expect(result.current.authToken).toBe('custom-event-auth-token');
    expect(result.current.authTokenExists).toBe(true);
  });

  it('useAuthStatus should be backward compatible with useAuth', () => {
    // Set tokens before rendering hook
    localStorageMock.setItem('auth_token', 'backwards-compatible-token');
    localStorageMock.setItem('refresh_token', 'backwards-compatible-refresh');

    const { result } = renderHook(() => useAuthStatus(), { wrapper });

    expect(result.current.authToken).toBe('backwards-compatible-token');
    expect(result.current.refreshToken).toBe('backwards-compatible-refresh');
    expect(result.current.authTokenExists).toBe(true);
    expect(result.current.refreshTokenExists).toBe(true);
  });
}); 
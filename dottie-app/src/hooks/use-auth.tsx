"use client"

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

// Define the context interface
interface AuthContextType {
  authToken: string | null;
  refreshToken: string | null;
  authTokenExists: boolean;
  refreshTokenExists: boolean;
  checkTokens: () => void; // Expose to make testing easier
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  authToken: null,
  refreshToken: null,
  authTokenExists: false,
  refreshTokenExists: false,
  checkTokens: () => {} // Default implementation
});

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [authTokenExists, setAuthTokenExists] = useState<boolean>(false);
  const [refreshTokenExists, setRefreshTokenExists] = useState<boolean>(false);

  // Create a memoized function to check and update tokens
  const checkTokens = useCallback(() => {
    const currentAuthToken = localStorage.getItem('auth_token');
    const currentRefreshToken = localStorage.getItem('refresh_token');
    
    setAuthToken(currentAuthToken);
    setRefreshToken(currentRefreshToken);
    setAuthTokenExists(!!currentAuthToken);
    setRefreshTokenExists(!!currentRefreshToken);
  }, []);

  useEffect(() => {
    // Initial check for tokens
    checkTokens();
    
    // Set up event listeners
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_token' || event.key === 'refresh_token' || event.key === null) {
        checkTokens();
      }
    };
    
    const handleAuthTokenChanged = () => {
      checkTokens();
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth_token_changed', handleAuthTokenChanged);
    
    return () => {
      // Remove event listeners on cleanup
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_token_changed', handleAuthTokenChanged);
    };
  }, [checkTokens]);

  const value = {
    authToken,
    refreshToken,
    authTokenExists,
    refreshTokenExists,
    checkTokens // Expose to make testing easier
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to get authentication status and token values from context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 
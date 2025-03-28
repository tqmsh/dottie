import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, User, LoginInput, SignupInput } from '@/src/api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginInput) => Promise<void>;
  signup: (userData: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get stored auth data
const getStoredAuthData = (): { user: User | null; token: string | null } => {
  const userStr = localStorage.getItem('auth_user');
  const token = localStorage.getItem('auth_token');
  
  return {
    user: userStr ? JSON.parse(userStr) : null,
    token,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user, token } = getStoredAuthData();
        
        if (user && token) {
          // Verify token validity by fetching current user
          const currentUser = await authApi.getCurrentUser();
          setState({
            user: currentUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired. Please login again.',
        });
      }
    };

    initializeAuth();
  }, []);

  // Handle token refresh
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (state.isAuthenticated) {
      // Refresh token every 14 minutes (assuming 15-minute token expiry)
      refreshInterval = setInterval(async () => {
        try {
          const { token } = await authApi.refreshToken();
          localStorage.setItem('auth_token', token);
        } catch (error) {
          // If refresh fails, logout user
          await logout();
        }
      }, 14 * 60 * 1000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [state.isAuthenticated]);

  const login = async (credentials: LoginInput) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await authApi.login(credentials);
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const signup = async (userData: SignupInput) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await authApi.signup(userData);
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
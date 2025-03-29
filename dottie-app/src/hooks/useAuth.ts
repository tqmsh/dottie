import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate fetching the user from localStorage or a token
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would validate a token and get user data from an API
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to authenticate'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    // This would be an API call in a real app
    try {
      setLoading(true);
      
      // Mock successful login
      const user = { id: '123', email };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      // This would be an API call in a real app
      // Mock successful password update
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update password'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    updatePassword
  };
} 
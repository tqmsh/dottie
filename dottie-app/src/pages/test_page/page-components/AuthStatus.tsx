import React, { useState, useEffect } from 'react';
import { InputForm } from './index';
import { LoginInput } from '../../../api/auth/types';

interface AuthStatusProps {
  onLogin: (credentials: LoginInput) => Promise<void>;
  onLogout: () => void;
}

export default function AuthStatus({ onLogin, onLogout }: AuthStatusProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userString = localStorage.getItem('auth_user');
    
    if (token) {
      setIsAuthenticated(true);
      
      if (userString) {
        try {
          setUser(JSON.parse(userString));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  const handleLogin = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const credentials = {
        email: formData.email as string,
        password: formData.password as string
      };
      await onLogin(credentials);
      setIsAuthenticated(true);
      setUser({ email: credentials.email });
      setShowLoginForm(false);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="mb-8 bg-gray-800 rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-semibold">Authentication Status</h2>
          <div className="flex items-center mt-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</span>
          </div>
          {isAuthenticated && user && (
            <div className="mt-2 text-sm text-gray-300">
              Logged in as: {user.email}
            </div>
          )}
        </div>
        
        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showLoginForm ? 'Cancel' : 'Login'}
            </button>
          )}
        </div>
      </div>
      
      {showLoginForm && !isAuthenticated && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <h3 className="text-lg font-medium mb-2">Login</h3>
          <InputForm
            fields={[
              {
                name: "email",
                label: "Email",
                type: "email",
                required: true,
                placeholder: "user@example.com"
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                required: true,
                placeholder: "Your password"
              }
            ]}
            onSubmit={handleLogin}
            submitLabel="Login"
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
} 
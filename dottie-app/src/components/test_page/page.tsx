'use client';

import { useState } from 'react';
import { 
  SetupEndpoints,
  AuthEndpoints,
  AssessmentEndpoints,
  UserEndpoints,
  ChatEndpoints
} from './endpoints';
import { AuthStatus } from './page-components';
import { authService } from '../../../api/auth';

export default function TestPage() {
  const environment = process.env.NODE_ENV || 'development';
  
  const handleLogin = async (credentials: { email: string; password: string }) => {
    return authService.login(credentials);
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Now testing in {environment.toUpperCase()}
        </h1>
        
        {/* Authentication status and login */}
        <AuthStatus 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />
        
        {/* Render all endpoint category components */}
        <SetupEndpoints />
        <AuthEndpoints />
        <AssessmentEndpoints />
        <UserEndpoints />
        <ChatEndpoints />
      </div>
    </div>
  );
} 
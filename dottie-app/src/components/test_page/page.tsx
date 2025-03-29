'use client';

import { useState } from 'react';
import { 
  SetupEndpoints,
  AuthEndpoints,
  AssessmentEndpoints,
  UserEndpoints,
  ChatEndpoints
} from './endpoints';

export default function TestPage() {
  const environment = process.env.NODE_ENV || 'development';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Now testing in {environment.toUpperCase()}
        </h1>
        
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
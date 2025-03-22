'use client';

import { useState } from 'react';

export default function TestPage() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [dbMessage, setDbMessage] = useState<string>('');
  const [loading, setLoading] = useState<{ api: boolean; db: boolean }>({
    api: false,
    db: false,
  });

  const environment = process.env.NODE_ENV || 'development';

  const testApiConnection = async () => {
    setLoading((prev) => ({ ...prev, api: true }));
    try {
      // For testing build only - don't make actual API call
      setApiMessage('API connection test placeholder');
    } catch (error) {
      setApiMessage('An error occurred');
    } finally {
      setLoading((prev) => ({ ...prev, api: false }));
    }
  };

  const testDbConnection = async () => {
    setLoading((prev) => ({ ...prev, db: true }));
    try {
      // For testing build only - don't make actual API call
      setDbMessage('Database connection test placeholder');
    } catch (error) {
      setDbMessage('An error occurred');
    } finally {
      setLoading((prev) => ({ ...prev, db: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Now testing in {environment.toUpperCase()}
        </h1>
        
        <div className="space-y-6">
          {/* API Connection Test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
            <button
              onClick={testApiConnection}
              disabled={loading.api}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.api ? 'Testing...' : 'Test API Message'}
            </button>
            
            {apiMessage && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <p>{apiMessage}</p>
              </div>
            )}
          </div>
          
          {/* SQLite Connection Test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">SQLite Connection Test</h2>
            <button
              onClick={testDbConnection}
              disabled={loading.db}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.db ? 'Testing...' : 'Test SQLite Connection'}
            </button>
            
            {dbMessage && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <p>{dbMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [dbMessage, setDbMessage] = useState<string>('');
  const [loading, setLoading] = useState<{ api: boolean; db: boolean }>({
    api: false,
    db: false,
  });
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dbStatus, setDbStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const environment = process.env.NODE_ENV || 'development';

  const testApiConnection = async () => {
    setLoading((prev) => ({ ...prev, api: true }));
    setApiStatus('idle');
    try {
      const response = await axios.get('/api/message');
      setApiMessage(response.data.message || 'API connection successful');
      setApiStatus('success');
    } catch (error) {
      console.error('API connection error:', error);
      setApiMessage('Could not connect to API');
      setApiStatus('error');
    } finally {
      setLoading((prev) => ({ ...prev, api: false }));
    }
  };

  const testDbConnection = async () => {
    setLoading((prev) => ({ ...prev, db: true }));
    setDbStatus('idle');
    try {
      // For testing build only - don't make actual API call
      setDbMessage('Database connection test placeholder');
      setDbStatus('success');
    } catch (error) {
      setDbMessage('An error occurred');
      setDbStatus('error');
    } finally {
      setLoading((prev) => ({ ...prev, db: false }));
    }
  };

  const getApiButtonClass = () => {
    const baseClass = "w-full px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed";
    if (apiStatus === 'success') return `${baseClass} bg-green-600 hover:bg-green-700`;
    if (apiStatus === 'error') return `${baseClass} bg-red-600 hover:bg-red-700`;
    return `${baseClass} bg-blue-600 hover:bg-blue-700`;
  };

  const getDbButtonClass = () => {
    const baseClass = "w-full px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed";
    if (dbStatus === 'success') return `${baseClass} bg-green-600 hover:bg-green-700`;
    if (dbStatus === 'error') return `${baseClass} bg-red-600 hover:bg-red-700`;
    return `${baseClass} bg-blue-600 hover:bg-blue-700`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Now testing in {environment.toUpperCase()}
        </h1>
        
        <div className="space-y-6">
          {/* API Connection Test */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
            <button
              onClick={testApiConnection}
              disabled={loading.api}
              className={getApiButtonClass()}
              data-testid="test-api-button"
            >
              {loading.api ? 'Testing...' : 'Test API Message'}
            </button>
            
            {apiMessage && (
              <div className="mt-4 p-4 bg-gray-700 rounded-md" data-testid="api-message">
                <p>{apiMessage}</p>
              </div>
            )}
          </div>
          
          {/* SQLite Connection Test */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">SQLite Connection Test</h2>
            <button
              onClick={testDbConnection}
              disabled={loading.db}
              className={getDbButtonClass()}
              data-testid="test-db-button"
            >
              {loading.db ? 'Testing...' : 'Test SQLite Connection'}
            </button>
            
            {dbMessage && (
              <div className="mt-4 p-4 bg-gray-700 rounded-md" data-testid="db-message">
                <p>{dbMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
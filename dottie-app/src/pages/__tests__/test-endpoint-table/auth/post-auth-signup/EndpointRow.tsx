import React, { useState } from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  const [randomCredentials, setRandomCredentials] = useState<{ email: string, password: string } | null>(null);

  const generateRandomCredentials = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const email = `user${randomString}@example.com`;
    const password = `pass${Math.random().toString(36).substring(2, 10)}`;
    setRandomCredentials({ email, password });
    return { email, password };
  };

  return (
    <>
      <BaseEndpointRow 
        method="POST"
        endpoint="/api/auth/signup"
        expectedOutput={{ 
          user: { 
            id: "user-id", 
            email: "user@example.com" 
          }, 
          token: "jwt-token" 
        }}
        requiresParams={true}
        inputFields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "user@example.com",
            defaultValue: randomCredentials?.email || ""
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            placeholder: "Min 6 characters",
            defaultValue: randomCredentials?.password || ""
          },
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
            placeholder: "Your name",
            defaultValue: randomCredentials?.email ? "Random User" : ""
          }
        ]}
      />
      
      <div className="flex items-center ml-4 mt-2 mb-4">
        <button 
          onClick={() => generateRandomCredentials()}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2"
        >
          Generate Random User
        </button>
        
        {randomCredentials && (
          <div className="ml-4 p-2 bg-gray-800 rounded text-xs">
            <div>Email: <span className="text-green-400">{randomCredentials.email}</span></div>
            <div>Password: <span className="text-green-400">{randomCredentials.password}</span></div>
          </div>
        )}
      </div>
    </>
  );
} 
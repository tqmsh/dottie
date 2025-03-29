'use client';

import { useState } from 'react';
import { EndpointTable, EndpointRow } from './page-components';

export default function TestPage() {
  const environment = process.env.NODE_ENV || 'development';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Now testing in {environment.toUpperCase()}
        </h1>
        
        {/* Setup Endpoints */}
        <EndpointTable title="Setup Endpoints">
          <EndpointRow 
            method="GET"
            endpoint="/api/setup/health/hello"
            expectedOutput={{ message: "Hello World from Dottie API!" }}
          />
          <EndpointRow 
            method="GET"
            endpoint="/api/setup/database/status"
            expectedOutput={{ status: "connected" }}
          />
          <EndpointRow 
            method="GET"
            endpoint="/api/setup/database/hello"
            expectedOutput={{ 
              message: "Hello World from SQLite!", 
              dbType: "sqlite3", 
              isConnected: true 
            }}
          />
        </EndpointTable>
        
        {/* Authentication Endpoints */}
        <EndpointTable title="Authentication Endpoints">
          <EndpointRow 
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
                placeholder: "user@example.com"
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                required: true,
                placeholder: "Min 6 characters"
              },
              {
                name: "name",
                label: "Name",
                type: "text",
                required: true,
                placeholder: "Your name"
              }
            ]}
          />
          <EndpointRow 
            method="POST"
            endpoint="/api/auth/login"
            expectedOutput={{ 
              token: "jwt-token", 
              user: { 
                id: "user-id", 
                email: "user@example.com" 
              } 
            }}
            requiresParams={true}
            inputFields={[
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
          />
          <EndpointRow 
            method="POST"
            endpoint="/api/auth/logout"
            expectedOutput={{ message: "Logged out successfully" }}
            requiresAuth={true}
          />
        </EndpointTable>
        
        {/* Assessment Endpoints */}
        <EndpointTable title="Assessment Endpoints">
          <EndpointRow 
            method="POST"
            endpoint="/api/assessment/send"
            expectedOutput={{ 
              id: "assessment-id", 
              message: "Assessment saved" 
            }}
            requiresAuth={true}
            requiresParams={true}
            inputFields={[
              {
                name: "assessmentData",
                label: "Assessment Data",
                type: "json",
                required: true,
                defaultValue: JSON.stringify({
                  age: "18_24",
                  cycleLength: "26_30",
                  periodDuration: "4_5",
                  flowHeaviness: "moderate",
                  painLevel: "moderate",
                  symptoms: {
                    physical: ["Bloating", "Headaches"],
                    emotional: ["Mood swings", "Irritability"]
                  }
                }, null, 2)
              }
            ]}
          />
          <EndpointRow 
            method="GET"
            endpoint="/api/assessment/list"
            expectedOutput={[
              { id: "assessment-1", date: "2023-06-15" },
              { id: "assessment-2", date: "2023-06-20" }
            ]}
            requiresAuth={true}
          />
          <EndpointRow 
            method="GET"
            endpoint="/api/assessment/:id"
            expectedOutput={{ 
              id: "assessment-id", 
              data: { 
                age: "18_24", 
                symptoms: {
                  physical: ["Bloating"],
                  emotional: ["Mood swings"]
                }
              }
            }}
            requiresAuth={true}
            pathParams={["id"]}
          />
          <EndpointRow 
            method="PUT"
            endpoint="/api/assessment/:id"
            expectedOutput={{ message: "Assessment updated" }}
            requiresAuth={true}
            pathParams={["id"]}
            requiresParams={true}
            inputFields={[
              {
                name: "assessmentData",
                label: "Updated Assessment Data",
                type: "json",
                required: true,
                defaultValue: JSON.stringify({
                  flowHeaviness: "heavy",
                  painLevel: "severe"
                }, null, 2)
              }
            ]}
          />
          <EndpointRow 
            method="DELETE"
            endpoint="/api/assessment/:id"
            expectedOutput={{ message: "Assessment deleted" }}
            requiresAuth={true}
            pathParams={["id"]}
          />
        </EndpointTable>
        
        {/* User Endpoints */}
        <EndpointTable title="User Endpoints">
          <EndpointRow 
            method="GET"
            endpoint="/api/user/me"
            expectedOutput={{ 
              id: "user-id", 
              email: "user@example.com", 
              name: "User Name"
            }}
            requiresAuth={true}
          />
          <EndpointRow 
            method="GET"
            endpoint="/api/user/:id"
            expectedOutput={{ 
              id: "user-id", 
              email: "user@example.com", 
              name: "User Name"
            }}
            requiresAuth={true}
            pathParams={["id"]}
          />
          <EndpointRow 
            method="PUT"
            endpoint="/api/user/:id"
            expectedOutput={{ message: "User updated" }}
            requiresAuth={true}
            pathParams={["id"]}
            requiresParams={true}
            inputFields={[
              {
                name: "userData",
                label: "User Data",
                type: "json",
                required: true,
                defaultValue: JSON.stringify({
                  name: "Updated Name",
                  email: "updated@example.com"
                }, null, 2)
              }
            ]}
          />
          <EndpointRow 
            method="DELETE"
            endpoint="/api/user/:id"
            expectedOutput={{ message: "User deleted" }}
            requiresAuth={true}
            pathParams={["id"]}
          />
          <EndpointRow 
            method="POST"
            endpoint="/api/user/pw/reset"
            expectedOutput={{ message: "Password reset email sent" }}
            requiresParams={true}
            inputFields={[
              {
                name: "email",
                label: "Email",
                type: "email",
                required: true,
                placeholder: "user@example.com"
              }
            ]}
          />
          <EndpointRow 
            method="POST"
            endpoint="/api/user/pw/update"
            expectedOutput={{ message: "Password updated successfully" }}
            requiresAuth={true}
            requiresParams={true}
            inputFields={[
              {
                name: "currentPassword",
                label: "Current Password",
                type: "password",
                required: true
              },
              {
                name: "newPassword",
                label: "New Password",
                type: "password",
                required: true
              }
            ]}
          />
        </EndpointTable>
        
        {/* AI Chat Endpoints */}
        <EndpointTable title="AI Chat Endpoints">
          <EndpointRow 
            method="POST"
            endpoint="/api/chat/send"
            expectedOutput={{ 
              message: "AI response message", 
              conversationId: "conversation-id" 
            }}
            requiresAuth={true}
            requiresParams={true}
            inputFields={[
              {
                name: "message",
                label: "Message",
                type: "textarea",
                required: true,
                placeholder: "Enter your message to the AI"
              },
              {
                name: "conversationId",
                label: "Conversation ID (optional)",
                type: "text",
                placeholder: "Leave empty for a new conversation"
              }
            ]}
          />
          <EndpointRow 
            method="GET"
            endpoint="/api/chat/history"
            expectedOutput={{ 
              conversations: [
                { 
                  id: "conversation-1", 
                  lastMessageDate: "2023-06-15T10:30:00Z", 
                  preview: "Hello, can you help with..." 
                },
                { 
                  id: "conversation-2", 
                  lastMessageDate: "2023-06-16T14:20:00Z", 
                  preview: "I'm having trouble with..." 
                }
              ] 
            }}
            requiresAuth={true}
          />
          <EndpointRow 
            method="GET"
            endpoint="/api/chat/history/:conversationId"
            expectedOutput={{ 
              id: "conversation-id", 
              messages: [
                { role: "user", content: "Hello, can you help with my period symptoms?" },
                { role: "assistant", content: "I'd be happy to help with your period symptoms..." }
              ] 
            }}
            requiresAuth={true}
            pathParams={["conversationId"]}
          />
          <EndpointRow 
            method="DELETE"
            endpoint="/api/chat/history/:conversationId"
            expectedOutput={{ message: "Conversation deleted" }}
            requiresAuth={true}
            pathParams={["conversationId"]}
          />
        </EndpointTable>
      </div>
    </div>
  );
} 
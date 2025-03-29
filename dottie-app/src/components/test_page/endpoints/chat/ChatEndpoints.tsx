import React from 'react';
import { EndpointTable, EndpointRow } from '../../page-components';

/**
 * Container component for AI chat endpoints
 */
export default function ChatEndpoints() {
  return (
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
  );
} 
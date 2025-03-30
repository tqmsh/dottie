import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatEndpoints from '../../ChatEndpoints';

// Mock the child components to isolate tests
vi.mock('../../../page-components', () => ({
  EndpointTable: ({ children, title }) => (
    <div data-testid="endpoint-table">
      <h2>{title}</h2>
      <div data-testid="endpoints">{children}</div>
    </div>
  ),
  EndpointRow: (props) => (
    <div data-testid={`endpoint-${props.method}-${props.endpoint}`}>
      <div data-testid="method">{props.method}</div>
      <div data-testid="endpoint">{props.endpoint}</div>
      <div data-testid="requires-auth">{props.requiresAuth ? 'Yes' : 'No'}</div>
      {props.inputFields && (
        <div data-testid="input-fields">
          {props.inputFields.map((field, index) => (
            <div key={index} data-testid={`input-field-${field.name}`}>
              {field.name}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

describe('ChatEndpoints Component', () => {
  it('renders with correct title', () => {
    render(<ChatEndpoints />);
    expect(screen.getByText('AI Chat Endpoints')).toBeInTheDocument();
  });

  it('renders the send message endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('endpoint-POST-/api/chat/send');
    
    expect(endpoint).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/api/chat/send')).toBeInTheDocument();
    
    // Check input fields
    expect(screen.getByTestId('input-field-message')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-conversationId')).toBeInTheDocument();
  });

  it('renders the get history endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('endpoint-GET-/api/chat/history');
    
    expect(endpoint).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/chat/history')).toBeInTheDocument();
  });

  it('renders the get conversation endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('endpoint-GET-/api/chat/history/:conversationId');
    
    expect(endpoint).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/chat/history/:conversationId')).toBeInTheDocument();
  });

  it('renders the delete conversation endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('endpoint-DELETE-/api/chat/history/:conversationId');
    
    expect(endpoint).toBeInTheDocument();
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByText('/api/chat/history/:conversationId')).toBeInTheDocument();
  });
}); 
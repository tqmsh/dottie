import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EndpointRow from '../../EndpointRow';

// Mock the API client
vi.mock('../../../../../../../api', () => ({
  apiClient: {
    get: vi.fn(() => Promise.resolve({
      data: { message: "Hello World from Dottie API!" }
    }))
  }
}));

describe('Get Setup Health Hello EndpointRow E2E', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('makes an API call when button is clicked', async () => {
    // Import the mocked API client
    const { apiClient } = await import('../../../../../../../api');
    
    render(<EndpointRow />);
    
    // Find and click the endpoint button
    const button = screen.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
    fireEvent.click(button);
    
    // Verify the API was called with the correct endpoint
    expect(apiClient.get).toHaveBeenCalledWith('/api/setup/health/hello');
  });
  
  it('displays the API response after successful call', async () => {
    render(<EndpointRow />);
    
    // Find and click the endpoint button
    const button = screen.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
    fireEvent.click(button);
    
    // Wait for the response to be displayed
    await waitFor(() => {
      // Look for the actual response in the response column
      expect(screen.getByText('"message": "Hello World from Dottie API!"', { exact: false })).toBeInTheDocument();
    });
    
    // Verify the success status is displayed
    await waitFor(() => {
      const successElement = screen.getByText(/success/i);
      expect(successElement).toBeInTheDocument();
    });
  });
}); 
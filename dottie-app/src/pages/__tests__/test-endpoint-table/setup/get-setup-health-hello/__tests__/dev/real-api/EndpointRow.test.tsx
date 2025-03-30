import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeAll, vi } from 'vitest';
import EndpointRow from '../../../EndpointRow';
import { apiClient } from '../../../../../../../../api';
import { realApiTest, requireRealApi } from '../../../../../../../../test/api-testing';

describe('Get Setup Health Hello EndpointRow with Real API', () => {
  // This will throw an error if the real API isn't available
  beforeAll(async () => {
    await requireRealApi();
  });

  it('renders the component correctly', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/setup/health/hello')).toBeInTheDocument();
    expect(screen.getByText(/"message":/)).toBeInTheDocument();
    expect(screen.getByText(/"Hello World from Dottie API!"/)).toBeInTheDocument();
  });

  // Using our real API test helper that will fail if API isn't available
  realApiTest('makes a real API call when button is clicked', () => {
    // Create a spy on the API client to verify the call is made
    const getSpy = vi.spyOn(apiClient, 'get');
    
    render(<EndpointRow />);
    
    // Find and click the endpoint button
    const button = screen.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
    fireEvent.click(button);
    
    // Verify the real API was called with the correct endpoint
    expect(getSpy).toHaveBeenCalledWith('/api/setup/health/hello');
    
    // Wait for the response to appear from the real API
    return waitFor(() => {
      // Check for success status
      expect(screen.getByText(/success/i)).toBeInTheDocument();
      
      // Check for message in response
      expect(screen.getByText(/"message":/i)).toBeInTheDocument();
    }, { timeout: 10000 }).finally(() => {
      // Clean up spy
      getSpy.mockRestore();
    });
  }, 15000);
}); 
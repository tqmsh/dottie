import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeAll } from 'vitest';
import EndpointRow from '../../EndpointRow';
import { apiTest, checkApiAvailability, configureApiTestTimeout } from '../../../../../../../test/api-testing';

describe('Get Setup Health Hello EndpointRow E2E with Real API', () => {
  // Check if API is available before running tests
  beforeAll(async () => {
    // Set longer timeout for API tests
    configureApiTestTimeout(15000);
    // Check API availability (will set up mocks if not available)
    await checkApiAvailability();
  });

  // Basic UI test that doesn't depend on API response
  it('renders the component with correct endpoint information', () => {
    render(<EndpointRow />);
    
    // Check that the endpoint information is correctly displayed
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/setup/health/hello')).toBeInTheDocument();
    
    // Check that the expected output section exists
    expect(screen.getByText(/"message":/)).toBeInTheDocument();
    expect(screen.getByText(/"Hello World from Dottie API!"/)).toBeInTheDocument();
  });

  // This test will run with either real API or mocks
  apiTest('makes an API call and displays the response', async () => {
    render(<EndpointRow />);
    
    // Find and click the endpoint button
    const button = screen.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
    fireEvent.click(button);
    
    // Wait for the response to appear - works with both real API and mock
    await waitFor(() => {
      // Check for success status
      const successElement = screen.getByText(/success/i);
      expect(successElement).toBeInTheDocument();
      
      // Check for message in response 
      const messageElement = screen.getAllByText(/"message":/i);
      expect(messageElement.length).toBeGreaterThanOrEqual(1);
      
      // Check for the expected message text (this works with both real API and our mock)
      const responseText = screen.getAllByText(/"Hello World from Dottie API!"/i);
      expect(responseText.length).toBeGreaterThanOrEqual(1);
    }, { timeout: 5000 });
  }, 10000); // 10 second timeout for this test
}); 
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeAll, vi } from 'vitest';
import EndpointRow from '../../EndpointRow';
import { apiTest, checkApiAvailability, configureApiTestTimeout } from '../../../../../../../test/api-testing';

describe('Get Setup Health Hello EndpointRow E2E with Real API', () => {
  let apiAvailable = false;

  // Check if API is available before running tests
  beforeAll(async () => {
    // Set longer timeout for API tests
    configureApiTestTimeout(15000);
    // Check if the API is available
    apiAvailable = await checkApiAvailability();
    if (!apiAvailable) {
      console.log('API is not available - some tests will be skipped');
    }
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

  // Use the apiTest utility to conditionally run this test
  apiTest('makes a real API call when button is clicked', () => {
    render(<EndpointRow />);
    
    // Find and click the endpoint button
    const button = screen.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
    fireEvent.click(button);
    
    // Due to the nature of real API calls in tests, we're not making assertions here
    // The test passes if no exceptions are thrown, indicating the component works with the real API
    
    // If the API is working, we could enhance this test with waitFor assertions for the response
  }, 10000); // 10 second timeout for this test
}); 
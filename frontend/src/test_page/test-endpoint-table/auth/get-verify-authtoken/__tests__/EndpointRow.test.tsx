import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../EndpointRow';
import { useAuthStatus } from '../../../../../hooks/use-auth-status';

// Setup tests - import mocking setup
import './setupTests';

// Mock only the hook we need for this component
jest.mock('../../../../../../hooks/use-auth-status', () => ({
  useAuthStatus: jest.fn()
}));

// Mock ApiResponse component to avoid dependencies
jest.mock('../../../../page-components/ApiResponse', () => {
  return {
    __esModule: true,
    default: jest.fn(({ data }) => (
      <div data-testid="api-response">
        <div data-testid="auth-token-exists">
          {`"authTokenExists": ${data.authTokenExists}`}
        </div>
        <div data-testid="refresh-token-exists">
          {`"refreshTokenExists": ${data.refreshTokenExists}`}
        </div>
      </div>
    ))
  };
});

describe('GetVerifyAuthToken EndpointRow', () => {
  beforeEach(() => {
    // Default mock implementation
    (useAuthStatus as jest.Mock).mockReturnValue({
      authTokenExists: false,
      refreshTokenExists: false,
      authToken: null,
      refreshToken: null
    });
  });

  it('renders with token status when no tokens exist', () => {
    render(<EndpointRow />);
    expect(screen.getByText('GET /api/auth/verify')).toBeInTheDocument();
    expect(screen.getByText('Current Token Status:')).toBeInTheDocument();
    expect(screen.getByTestId('auth-token-exists')).toHaveTextContent('"authTokenExists": false');
    expect(screen.getByTestId('refresh-token-exists')).toHaveTextContent('"refreshTokenExists": false');
  });

  it('renders with token status when tokens exist', () => {
    // Mock tokens existing
    (useAuthStatus as jest.Mock).mockReturnValue({
      authTokenExists: true,
      refreshTokenExists: true,
      authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZyZXNoIjp0cnVlfQ.40pRpTtojzLBgdl5eS0_coFEVqWHiKFhFQBxTNMXpew'
    });

    render(<EndpointRow />);
    expect(screen.getByText('GET /api/auth/verify')).toBeInTheDocument();
    expect(screen.getByText('Current Token Status:')).toBeInTheDocument();
    expect(screen.getByTestId('auth-token-exists')).toHaveTextContent('"authTokenExists": true');
    expect(screen.getByTestId('refresh-token-exists')).toHaveTextContent('"refreshTokenExists": true');
  });
}); 
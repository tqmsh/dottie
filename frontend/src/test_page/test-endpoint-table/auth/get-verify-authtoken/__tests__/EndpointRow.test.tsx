import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import EndpointRow from '../EndpointRow';

// Mock the useAuth hook
vi.mock('../../../../../hooks/use-auth', () => ({
  useAuth: () => ({
    authToken: 'mock-token',
    refreshToken: 'mock-refresh',
    authTokenExists: true,
    refreshTokenExists: true
  })
}));

// Mock the authApi
vi.mock('../../../../../api/auth', () => ({
  authApi: {
    verifyToken: () => ({
      data: {
        success: true,
        authTokenExists: true,
        refreshTokenExists: true,
        authTokenValue: 'mock-token',
        refreshTokenValue: 'mock-refresh'
      }
    })
  }
}));

// Need to render the TR inside a table context to avoid DOM nesting warnings
const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <table>
    <tbody>
      {children}
    </tbody>
  </table>
);

describe('GetVerifyAuthToken EndpointRow', () => {
  it('renders correctly', () => {
    render(<EndpointRow />, { wrapper: TableWrapper });
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('(Frontend) /auth/token-verification')).toBeInTheDocument();
  });
}); 
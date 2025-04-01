import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthEndpoints from '../../AuthEndpoints';

// Don't mock the components, test against the actual rendered output
describe('AuthEndpoints', () => {
  it('renders the authentication endpoints table with correct title', () => {
    render(<AuthEndpoints />);
    
    // Check if the title is rendered correctly
    expect(screen.getByText('Authentication Endpoints')).toBeInTheDocument();
  });

  it('renders all required endpoints with correct methods', () => {
    render(<AuthEndpoints />);
    
    // Check if all endpoints are rendered with the correct method
    const postElements = screen.getAllByText('POST', { selector: 'span.font-bold' });
    expect(postElements.length).toBe(3); // There should be 3 POST methods
    
    // Check if GET method for token verification is rendered
    const getElement = screen.getByText('GET', { selector: 'span.font-bold' });
    expect(getElement).toBeInTheDocument();
    
    expect(screen.getByText('/api/auth/signup')).toBeInTheDocument();
    expect(screen.getByText('/api/auth/login')).toBeInTheDocument();
    expect(screen.getByText('/api/auth/logout')).toBeInTheDocument();
    expect(screen.getByText('(Frontend) /auth/token-verification')).toBeInTheDocument();
  });

  it('renders signup endpoint with correct expected output', () => {
    render(<AuthEndpoints />);
    
    // First find the signup button to help locate the correct row
    const signupButton = screen.getByTestId('test-post -api-auth-signup-button');
    
    // Find the closest tr element to the button
    const signupRow = signupButton.closest('tr');
    expect(signupRow).toBeInTheDocument();
    
    // Check the expected output within this row
    const signupOutput = signupRow?.querySelector('pre');
    expect(signupOutput?.textContent).toContain('"user"');
    expect(signupOutput?.textContent).toContain('"id": "user-id"');
    expect(signupOutput?.textContent).toContain('"email": "user@example.com"');
    expect(signupOutput?.textContent).toContain('"token": "jwt-token"');
  });

  it('renders login endpoint with correct expected output', () => {
    render(<AuthEndpoints />);
    
    // First find the login button to help locate the correct row
    const loginButton = screen.getByTestId('test-post -api-auth-login-button');
    
    // Find the closest tr element to the button
    const loginRow = loginButton.closest('tr');
    expect(loginRow).toBeInTheDocument();
    
    // Check the expected output within this row
    const loginOutput = loginRow?.querySelector('pre');
    expect(loginOutput?.textContent).toContain('"token": "jwt-token"');
    expect(loginOutput?.textContent).toContain('"user"');
    expect(loginOutput?.textContent).toContain('"id": "user-id"');
    expect(loginOutput?.textContent).toContain('"email": "user@example.com"');
  });

  it('renders token verification endpoint', () => {
    render(<AuthEndpoints />);
    
    // Find the token verification button
    const verifyButton = screen.getByTestId('test-get -frontend-auth-token-verification-button');
    expect(verifyButton).toBeInTheDocument();
    
    // Find the closest tr element to the button
    const verifyRow = verifyButton.closest('tr');
    expect(verifyRow).toBeInTheDocument();
    
    // Check the expected output contains token-related fields
    const verifyOutput = verifyRow?.querySelector('pre');
    expect(verifyOutput?.textContent).toContain('"success": true');
    expect(verifyOutput?.textContent).toContain('"authTokenExists": true');
    expect(verifyOutput?.textContent).toContain('"refreshTokenExists": true');
  });

  it('renders logout endpoint with authentication requirement', () => {
    render(<AuthEndpoints />);
    
    const requiresAuth = screen.getByText('Requires authentication');
    expect(requiresAuth).toBeInTheDocument();
  });

  it('renders test buttons for each endpoint', () => {
    render(<AuthEndpoints />);
    
    const signupButton = screen.getByTestId('test-post -api-auth-signup-button');
    const loginButton = screen.getByTestId('test-post -api-auth-login-button');
    const logoutButton = screen.getByTestId('test-post -api-auth-logout-button');
    const verifyButton = screen.getByTestId('test-get -frontend-auth-token-verification-button');
    
    expect(signupButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(verifyButton).toBeInTheDocument();
  });
}); 
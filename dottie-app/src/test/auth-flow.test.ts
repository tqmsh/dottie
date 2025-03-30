import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '../pages/auth/sign-up';
import SignInPage from '../pages/auth/sign-in';

// Mock the AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signup: vi.fn().mockResolvedValue({ id: 'test-id', email: 'test@example.com' }),
    login: vi.fn().mockResolvedValue({}),
  }),
}));

// Mock the react-router-dom navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Authentication Flow', () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should auto-fill login form after successful signup', async () => {
    // Setup test data
    const testEmail = 'user@example.com';
    const testPassword = 'Password123';
    
    // Render the signup form
    const { unmount } = render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );
    
    // Fill out and submit the signup form
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: testEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    
    fireEvent.click(screen.getByText('Create account'));
    
    // Wait for the signup to complete and navigate
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/sign-in');
    });
    
    // Verify data was stored in localStorage
    expect(localStorageMock.getItem('login_email')).toBe(testEmail);
    expect(localStorageMock.getItem('login_password')).toBe(testPassword);
    
    // Unmount the signup component
    unmount();
    
    // Render the signin form
    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );
    
    // Verify the login form is auto-filled (with delay for setValue timeout)
    await waitFor(() => {
      const emailInput = screen.getByLabelText('Email address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      expect(emailInput.value).toBe(testEmail);
      expect(passwordInput.value).toBe(testPassword);
    }, { timeout: 1000 });
    
    // Verify localStorage items were removed after use
    expect(localStorageMock.getItem('login_email')).toBeNull();
    expect(localStorageMock.getItem('login_password')).toBeNull();
  });
}); 
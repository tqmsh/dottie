import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UITestPageSwitch from '../UITestPageSwitch';

describe('UITestPageSwitch', () => {
  it('shows Test Page link when on landing page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('shows Back to UI link when on test page', () => {
    render(
      <MemoryRouter initialEntries={['/test-page']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    expect(screen.getByText('Back to UI')).toBeInTheDocument();
  });
}); 
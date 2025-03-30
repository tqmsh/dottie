import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../EndpointRow';

describe('Put Assessment By Id EndpointRow', () => {
  it('renders correctly', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('PUT')).toBeInTheDocument();
    expect(screen.getByText('/api/assessment/:id')).toBeInTheDocument();
  });
}); 
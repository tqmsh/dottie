import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByText(/Welcome to Dottie/i)).toBeInTheDocument()
  })
  
  it('renders the count button', () => {
    render(<App />)
    expect(screen.getByText(/count is/i)).toBeInTheDocument()
  })
  
  it('renders the HMR instruction', () => {
    render(<App />)
    expect(screen.getByText(/Edit.*and save to test HMR/i)).toBeInTheDocument()
  })
}) 
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the age verification page by default', () => {
    render(<App />)
    expect(screen.getByText(/What is your age range\?/i)).toBeInTheDocument()
  })
  
  it('renders age options', () => {
    render(<App />)
    expect(screen.getByText(/Under 13 years/i)).toBeInTheDocument()
    expect(screen.getByText(/13-17 years/i)).toBeInTheDocument()
    expect(screen.getByText(/18-24 years/i)).toBeInTheDocument()
  })
  
  it('renders navigation buttons', () => {
    render(<App />)
    expect(screen.getByText(/Back/i)).toBeInTheDocument()
    expect(screen.getByText(/Continue/i)).toBeInTheDocument()
  })
}) 
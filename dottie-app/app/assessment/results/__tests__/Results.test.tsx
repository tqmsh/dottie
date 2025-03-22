import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import ResultsPage from '../page'

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Results', () => {
  it('should render the results page correctly', () => {
    renderWithRouter(<ResultsPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('Your Menstrual Pattern is Developing Normally')).toBeInTheDocument()
    
    // Check if cycle summary is displayed
    expect(screen.getByText('Your Cycle Summary')).toBeInTheDocument()
    
    // Check if some cycle metrics are displayed
    expect(screen.getByText('Cycle Length')).toBeInTheDocument()
    expect(screen.getByText('Period Duration')).toBeInTheDocument()
    expect(screen.getByText('Flow Heaviness')).toBeInTheDocument()
    expect(screen.getByText('Pain Level')).toBeInTheDocument()
    
    // Check if recommendations section is displayed
    expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument()
    
    // Check if some recommendation items are displayed
    expect(screen.getByText('Track Your Cycle')).toBeInTheDocument()
    expect(screen.getByText('Exercise Regularly')).toBeInTheDocument()
    expect(screen.getByText('Maintain a Balanced Diet')).toBeInTheDocument()
  })

  it('should have functional buttons', () => {
    renderWithRouter(<ResultsPage />)
    
    // Check if the Ask Dottie button is displayed
    const askDottieButton = screen.getByText('Ask Dottie').closest('button')
    expect(askDottieButton).toBeInTheDocument()
    
    // Check if the Save Results button is displayed
    const saveResultsButton = screen.getByText('Save Results').closest('button')
    expect(saveResultsButton).toBeInTheDocument()
  })

  it('should navigate to resources when clicking the resources button', () => {
    renderWithRouter(<ResultsPage />)
    
    // Check if the View Resources link navigates to the resources page
    const resourcesButton = screen.getByText('View Resources & Next Steps').closest('a')
    expect(resourcesButton).toHaveAttribute('href', '/assessment/resources')
  })

  it('should display the symptoms list', () => {
    renderWithRouter(<ResultsPage />)
    
    // Check if the symptoms section is displayed
    expect(screen.getByText('Symptoms')).toBeInTheDocument()
    
    // Check if common symptoms are listed
    expect(screen.getByText('Bloating')).toBeInTheDocument()
    expect(screen.getByText('Headaches')).toBeInTheDocument()
    expect(screen.getByText('Mood swings')).toBeInTheDocument()
  })
}) 
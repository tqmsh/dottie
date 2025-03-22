import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import test utilities
import { 
  navigateToAgeVerification,
  navigateToCycleLength,
  renderResults,
  clearSessionStorage
} from './test-utils'

describe('Developing Pattern Assessment Path (Adolescent Users)', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should show developing pattern results for young users with variable cycles', async () => {
    // Navigate through essential steps
    await navigateToAgeVerification(user, '13-17 years')
    await navigateToCycleLength(user, 'Variable')
    
    // Setup session storage for results page
    const sessionData = {
      age: '13-17 years',
      cycleLength: 'Variable'
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
    
    // Verify developing pattern (O5 in LogicTree)
    expect(screen.getByText('Your cycles are still establishing a regular pattern, which is normal during adolescence.')).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getByText('13-17 years')).toBeInTheDocument()
    
    // Check for recommendations specific to developing patterns
    expect(screen.getByText('Be Patient', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Track Your Cycle', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Learn About Your Body', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Talk to Someone You Trust', { exact: false })).toBeInTheDocument()
  })
  
  it('should classify adolescent users as developing pattern even with regular cycle length', async () => {
    // For this test, set regular cycle values but adolescent age
    
    // Setup session storage for results page with regular cycle but young age
    const sessionData = {
      age: '13-17 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Mild'
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
    
    // Verify developing pattern (O5 in LogicTree)
    expect(screen.getByText('Your cycles are still establishing a regular pattern, which is normal during adolescence.')).toBeInTheDocument()
    
    // Check for recommendations specific to developing patterns
    expect(screen.getByText('Be Patient', { exact: false })).toBeInTheDocument()
  })
}) 
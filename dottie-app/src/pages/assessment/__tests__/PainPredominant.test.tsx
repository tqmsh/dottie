import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import test utilities
import { 
  navigateToAgeVerification,
  navigateToCycleLength,
  navigateToPeriodDuration,
  navigateToFlow,
  navigateToPain,
  navigateToSymptoms,
  renderResults,
  clearSessionStorage
} from './test-utils'

describe('Pain-Predominant Menstrual Pattern Assessment Path', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should show pain-predominant results when pain is higher than typical', async () => {
    // Navigate through all steps sequentially
    await navigateToAgeVerification(user, '18-24 years')
    await navigateToCycleLength(user, '26-30 days')
    await navigateToPeriodDuration(user, '4-5 days')
    await navigateToFlow(user, 'Moderate')
    await navigateToPain(user, 'Severe')
    await navigateToSymptoms(user, 'Headaches')
    
    // Setup session storage for results page
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Severe',
      symptoms: ['Headaches']
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
    
    // Verify pain-predominant pattern (O3 in LogicTree)
    expect(screen.getByText('Your menstrual pain is higher than typical and may interfere with daily activities.')).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText('Severe')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Headaches')[0]).toBeInTheDocument()
    
    // Check for pain-related recommendations
    expect(screen.getByText('Heat Therapy', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Pain Management', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Gentle Exercise', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Medical Support', { exact: false })).toBeInTheDocument()
  })
  
  it('should show pain pattern even with additional symptoms', async () => {
    // For this test, we'll skip navigation and just set session storage directly
    // with multiple symptoms
    
    // Setup session storage for results page
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Severe',
      symptoms: ['Headaches', 'Bloating', 'Fatigue']
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
    
    // Verify pain-predominant pattern (O3 in LogicTree)
    expect(screen.getByText('Your menstrual pain is higher than typical and may interfere with daily activities.')).toBeInTheDocument()
    
    // Check for multiple symptoms
    expect(screen.getAllByText('Headaches')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Bloating')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Fatigue')[0]).toBeInTheDocument()
    
    // Check for pain-related recommendations
    expect(screen.getByText('Heat Therapy', { exact: false })).toBeInTheDocument()
  })
}) 
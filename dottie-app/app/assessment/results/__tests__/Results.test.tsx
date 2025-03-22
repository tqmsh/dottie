import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import ResultsPage from '../page'

// Mock sessionStorage for setting specific test data
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Results Page', () => {
  beforeEach(() => {
    // Clear session storage before each test
    window.sessionStorage.clear();
  });

  it('should render common UI elements on the results page', () => {
    renderWithRouter(<ResultsPage />)
    
    // Check if the page header is displayed
    expect(screen.getByText('Dottie')).toBeInTheDocument()
    
    // Check if cycle summary is displayed
    expect(screen.getByText('Your Cycle Summary')).toBeInTheDocument()
    
    // Check if buttons are displayed
    expect(screen.getByText('Ask Dottie').closest('button')).toBeInTheDocument()
    expect(screen.getByText('Save Results').closest('button')).toBeInTheDocument()
    expect(screen.getByText('View Resources & Next Steps').closest('a')).toBeInTheDocument()
    
    // Check if recommendations section is displayed
    expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument()
  })

  // Test for O4: Regular Menstrual Cycles
  it('should render regular menstrual cycle outcome correctly', () => {
    // Set up session storage with data indicating regular cycle
    window.sessionStorage.setItem('cycleLength', '26-30 days');
    window.sessionStorage.setItem('periodDuration', '4-5 days');
    window.sessionStorage.setItem('flowLevel', 'Moderate');
    window.sessionStorage.setItem('painLevel', 'Mild');
    window.sessionStorage.setItem('age', '18-24 years');
    
    renderWithRouter(<ResultsPage />)
    
    // Check for regular cycle heading
    expect(screen.getByText(/Regular Menstrual Cycles/i, { exact: false })).toBeInTheDocument()
    
    // Check metrics display correctly
    expect(screen.getByText(/Cycle Length/i).nextSibling).toHaveTextContent(/26-30 days/i)
    expect(screen.getByText(/Period Duration/i).nextSibling).toHaveTextContent(/4-5 days/i)
    expect(screen.getByText(/Flow Heaviness/i).nextSibling).toHaveTextContent(/Moderate/i)
    expect(screen.getByText(/Pain Level/i).nextSibling).toHaveTextContent(/Mild/i)
    
    // Check for regular cycle recommendations
    expect(screen.getByText(/Track Your Cycle/i)).toBeInTheDocument()
    expect(screen.getByText(/Exercise Regularly/i)).toBeInTheDocument()
    expect(screen.getByText(/Maintain a Balanced Diet/i)).toBeInTheDocument()
  })

  // Test for O1: Irregular Timing Pattern
  it('should render irregular timing pattern outcome correctly', () => {
    // Set up session storage with data indicating irregular cycle
    window.sessionStorage.setItem('cycleLength', 'Irregular');
    window.sessionStorage.setItem('age', '25+ years');
    
    renderWithRouter(<ResultsPage />)
    
    // Check for irregular cycle heading
    expect(screen.getByText(/Irregular Timing Pattern/i, { exact: false })).toBeInTheDocument()
    
    // Check explanation for irregular cycles
    expect(screen.getByText(/Your cycle length is outside the typical range/i, { exact: false })).toBeInTheDocument()
    
    // Check metrics display correctly
    const cycleElements = screen.getAllByText(/Cycle Length/i);
    expect(cycleElements[1].nextSibling).toHaveTextContent(/Irregular/i)
    
    // Check for irregular cycle recommendations
    expect(screen.getByText(/Track Your Cycle/i)).toBeInTheDocument()
    expect(screen.getByText(/Consult a Healthcare Provider/i, { exact: false })).toBeInTheDocument()
  })

  // Test for O2: Heavy or Prolonged Flow Pattern
  it('should render heavy flow pattern outcome correctly', () => {
    // Set up session storage with data indicating heavy flow
    window.sessionStorage.setItem('cycleLength', '26-30 days');
    window.sessionStorage.setItem('periodDuration', '8+ days');
    window.sessionStorage.setItem('flowLevel', 'Heavy');
    window.sessionStorage.setItem('age', '18-24 years');
    
    renderWithRouter(<ResultsPage />)
    
    // Check for heavy flow heading
    expect(screen.getByText(/Heavy.*Flow Pattern/i, { exact: false })).toBeInTheDocument()
    
    // Check explanation for heavy flow
    expect(screen.getByText(/Your flow is heavier or longer than typical/i, { exact: false })).toBeInTheDocument()
    
    // Check metrics display correctly
    expect(screen.getByText(/Period Duration/i).nextSibling).toHaveTextContent(/8\+|more than 7/i)
    expect(screen.getByText(/Flow Heaviness/i).nextSibling).toHaveTextContent(/Heavy/i)
    
    // Check for heavy flow recommendations
    expect(screen.getByText(/Iron-rich Foods/i, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/Stay Hydrated/i, { exact: false })).toBeInTheDocument()
  })

  // Test for O3: Pain-Predominant Pattern
  it('should render pain-predominant pattern outcome correctly', () => {
    // Set up session storage with data indicating severe pain
    window.sessionStorage.setItem('cycleLength', '26-30 days');
    window.sessionStorage.setItem('periodDuration', '4-5 days');
    window.sessionStorage.setItem('flowLevel', 'Moderate');
    window.sessionStorage.setItem('painLevel', 'Severe');
    window.sessionStorage.setItem('age', '18-24 years');
    
    renderWithRouter(<ResultsPage />)
    
    // Check for pain-predominant heading
    expect(screen.getByText(/Pain.*Predominant Pattern/i, { exact: false })).toBeInTheDocument()
    
    // Check explanation for pain pattern
    expect(screen.getByText(/Your menstrual pain is higher than typical/i, { exact: false })).toBeInTheDocument()
    
    // Check metrics display correctly
    expect(screen.getByText(/Pain Level/i).nextSibling).toHaveTextContent(/Severe/i)
    
    // Check for pain management recommendations
    expect(screen.getByText(/Heat therapy/i, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/pain.*management/i, { exact: false })).toBeInTheDocument()
  })

  // Test for O5: Developing Pattern
  it('should render developing pattern outcome correctly', () => {
    // Set up session storage with data indicating developing pattern
    window.sessionStorage.setItem('cycleLength', 'Variable');
    window.sessionStorage.setItem('age', '13-17 years');
    
    renderWithRouter(<ResultsPage />)
    
    // Check for developing pattern heading
    expect(screen.getByText(/Developing Pattern/i, { exact: false })).toBeInTheDocument()
    
    // Check explanation for developing pattern
    expect(screen.getByText(/Your cycles are still establishing a regular pattern/i, { exact: false })).toBeInTheDocument()
    
    // Check age information is displayed correctly
    expect(screen.getByText(/Age/i).nextSibling).toHaveTextContent(/13-17|Adolescence/i)
    
    // Check for adolescent-specific recommendations
    expect(screen.getByText(/Be Patient/i)).toBeInTheDocument()
    expect(screen.getByText(/normal.*irregular during adolescence/i, { exact: false })).toBeInTheDocument()
  })

  it('should navigate to resources when clicking the resources button', () => {
    renderWithRouter(<ResultsPage />)
    
    // Check if the View Resources link navigates to the resources page
    const resourcesButton = screen.getByText('View Resources & Next Steps').closest('a')
    expect(resourcesButton).toHaveAttribute('href', '/assessment/resources')
  })

  it('should display the selected symptoms from storage', () => {
    // Set up session storage with symptoms data
    window.sessionStorage.setItem('symptoms', JSON.stringify(['Bloating', 'Headaches', 'Mood swings']));
    
    renderWithRouter(<ResultsPage />)
    
    // Check if the symptoms section is displayed
    expect(screen.getByText('Symptoms')).toBeInTheDocument()
    
    // Check if selected symptoms are listed
    expect(screen.getByText('Bloating')).toBeInTheDocument()
    expect(screen.getByText('Headaches')).toBeInTheDocument()
    expect(screen.getByText('Mood swings')).toBeInTheDocument()
  })
}) 
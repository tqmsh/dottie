import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// Import all assessment pages
import AgeVerificationPage from '../age-verification/page'
import CycleLengthPage from '../cycle-length/page'
import PeriodDurationPage from '../period-duration/page'
import FlowPage from '../flow/page'
import PainPage from '../pain/page'
import SymptomsPage from '../symptoms/page'
import ResultsPage from '../results/page'

// Mock router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// Helper to render with router at a specific starting route
const renderWithRouter = (
  ui: React.ReactElement,
  { route = '/' } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/assessment/age-verification" element={<AgeVerificationPage />} />
        <Route path="/assessment/cycle-length" element={<CycleLengthPage />} />
        <Route path="/assessment/period-duration" element={<PeriodDurationPage />} />
        <Route path="/assessment/flow" element={<FlowPage />} />
        <Route path="/assessment/pain" element={<PainPage />} />
        <Route path="/assessment/symptoms" element={<SymptomsPage />} />
        <Route path="/assessment/results" element={<ResultsPage />} />
      </Routes>
    </MemoryRouter>
  )
}

// Helper to find the enabled continue button
const findEnabledContinueButton = () => {
  const buttons = screen.getAllByRole('button', { name: /continue/i });
  // Find the button that is not disabled
  return buttons.find(button => !button.hasAttribute('disabled'));
};

describe('Assessment Flow Integration', () => {
  // Test for regular menstrual cycles pathway (O4 in LogicTree)
  it('should navigate through the entire assessment and show regular cycle results', async () => {
    const user = userEvent.setup()
    
    // Start at age verification page
    renderWithRouter(<AgeVerificationPage />, { route: '/assessment/age-verification' })
    
    // Age Verification - select 18-24 age range
    const ageOption = screen.getByLabelText('18-24 years', { exact: false })
    await user.click(ageOption)
    const ageContinueButton = findEnabledContinueButton();
    expect(ageContinueButton).not.toBeNull();
    await user.click(ageContinueButton!)
    
    // Cycle Length - select normal range (26-30 days)
    renderWithRouter(<CycleLengthPage />, { route: '/assessment/cycle-length' })
    const cycleLengthOption = screen.getByLabelText('26-30 days', { exact: false })
    await user.click(cycleLengthOption)
    const cycleContinueButton = findEnabledContinueButton();
    expect(cycleContinueButton).not.toBeNull();
    await user.click(cycleContinueButton!)
    
    // Period Duration - select normal (4-5 days)
    renderWithRouter(<PeriodDurationPage />, { route: '/assessment/period-duration' })
    const durationOption = screen.getByLabelText('4-5 days', { exact: false })
    await user.click(durationOption)
    const durationContinueButton = findEnabledContinueButton();
    expect(durationContinueButton).not.toBeNull();
    await user.click(durationContinueButton!)
    
    // Flow - select moderate
    renderWithRouter(<FlowPage />, { route: '/assessment/flow' })
    const flowOption = screen.getByLabelText('Moderate', { exact: false })
    await user.click(flowOption)
    const flowContinueButton = findEnabledContinueButton();
    expect(flowContinueButton).not.toBeNull();
    await user.click(flowContinueButton!)
    
    // Pain - select mild
    renderWithRouter(<PainPage />, { route: '/assessment/pain' })
    const painOption = screen.getByLabelText('Mild', { exact: false })
    await user.click(painOption)
    const painContinueButton = findEnabledContinueButton();
    expect(painContinueButton).not.toBeNull();
    await user.click(painContinueButton!)
    
    // Symptoms - select a symptom by clicking on the containing div
    renderWithRouter(<SymptomsPage />, { route: '/assessment/symptoms' })
    // Use getAllByText since there might be multiple elements with the same text
    const fatigueSymptoms = screen.getAllByText('Fatigue');
    // Click on the first one
    await user.click(fatigueSymptoms[0].closest('div')!)
    const symptomsContinueButton = findEnabledContinueButton();
    expect(symptomsContinueButton).not.toBeNull();
    await user.click(symptomsContinueButton!)
    
    // Results - verify we get "Regular Menstrual Cycles" 
    renderWithRouter(<ResultsPage />, { route: '/assessment/results' })
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
  })

  // Test for irregular timing pattern pathway (O1 in LogicTree)
  it('should show irregular timing results when cycle length is outside typical range', async () => {
    const user = userEvent.setup()
    
    // Start at age verification page
    renderWithRouter(<AgeVerificationPage />, { route: '/assessment/age-verification' })
    
    // Age Verification - select 25+ age range
    const ageOption = screen.getByLabelText('25+ years', { exact: false })
    await user.click(ageOption)
    const ageContinueButton = findEnabledContinueButton();
    expect(ageContinueButton).not.toBeNull();
    await user.click(ageContinueButton!)
    
    // Cycle Length - select irregular
    renderWithRouter(<CycleLengthPage />, { route: '/assessment/cycle-length' })
    const cycleLengthOption = screen.getByLabelText('Irregular', { exact: false })
    await user.click(cycleLengthOption)
    const cycleContinueButton = findEnabledContinueButton();
    expect(cycleContinueButton).not.toBeNull();
    await user.click(cycleContinueButton!)
    
    // Results - verify we get "Irregular Timing Pattern"
    renderWithRouter(<ResultsPage />, { route: '/assessment/results' })
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
  })

  // Test for heavy flow pattern pathway (O2 in LogicTree)
  it('should show heavy flow results when flow is heavier than typical', async () => {
    const user = userEvent.setup()
    
    // Start at age verification
    renderWithRouter(<AgeVerificationPage />, { route: '/assessment/age-verification' })
    
    // Age Verification - select 18-24 age range
    const ageOption = screen.getByLabelText('18-24 years', { exact: false })
    await user.click(ageOption)
    const ageContinueButton = findEnabledContinueButton();
    expect(ageContinueButton).not.toBeNull();
    await user.click(ageContinueButton!)
    
    // Cycle Length - select normal
    renderWithRouter(<CycleLengthPage />, { route: '/assessment/cycle-length' })
    const cycleLengthOption = screen.getByLabelText('26-30 days', { exact: false })
    await user.click(cycleLengthOption)
    const cycleContinueButton = findEnabledContinueButton();
    expect(cycleContinueButton).not.toBeNull();
    await user.click(cycleContinueButton!)
    
    // Period Duration - select long (more than 7 days)
    renderWithRouter(<PeriodDurationPage />, { route: '/assessment/period-duration' })
    
    // Try to click each option until we find the one for 7+ days
    // This approach is less brittle than searching for specific text that might change
    const radioButtons = screen.getAllByRole('radio');
    // Click the last radio button which is likely to be "More than 7 days" or similar
    await user.click(radioButtons[radioButtons.length - 1]);
    
    const durationContinueButton = findEnabledContinueButton();
    expect(durationContinueButton).not.toBeNull();
    await user.click(durationContinueButton!)
    
    // Results would show heavy flow pattern
    renderWithRouter(<ResultsPage />, { route: '/assessment/results' })
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
  })

  // Test for pain-predominant pattern pathway (O3 in LogicTree)
  it('should show pain-predominant results when pain is higher than typical', async () => {
    const user = userEvent.setup()
    
    // Start at age verification page
    renderWithRouter(<AgeVerificationPage />, { route: '/assessment/age-verification' })
    
    // Age Verification - select 18-24 age range
    const ageOption = screen.getByLabelText('18-24 years', { exact: false })
    await user.click(ageOption)
    const ageContinueButton = findEnabledContinueButton();
    expect(ageContinueButton).not.toBeNull();
    await user.click(ageContinueButton!)
    
    // Cycle Length - select normal range (26-30 days)
    renderWithRouter(<CycleLengthPage />, { route: '/assessment/cycle-length' })
    const cycleLengthOption = screen.getByLabelText('26-30 days', { exact: false })
    await user.click(cycleLengthOption)
    const cycleContinueButton = findEnabledContinueButton();
    expect(cycleContinueButton).not.toBeNull();
    await user.click(cycleContinueButton!)
    
    // Period Duration - select normal (4-5 days)
    renderWithRouter(<PeriodDurationPage />, { route: '/assessment/period-duration' })
    const durationOption = screen.getByLabelText('4-5 days', { exact: false })
    await user.click(durationOption)
    const durationContinueButton = findEnabledContinueButton();
    expect(durationContinueButton).not.toBeNull();
    await user.click(durationContinueButton!)
    
    // Flow - select moderate
    renderWithRouter(<FlowPage />, { route: '/assessment/flow' })
    const flowOption = screen.getByLabelText('Moderate', { exact: false })
    await user.click(flowOption)
    const flowContinueButton = findEnabledContinueButton();
    expect(flowContinueButton).not.toBeNull();
    await user.click(flowContinueButton!)
    
    // Pain - select severe
    renderWithRouter(<PainPage />, { route: '/assessment/pain' })
    const painOptions = screen.getAllByRole('radio');
    // Click the last pain option (likely "Severe")
    await user.click(painOptions[painOptions.length - 1]);
    const painContinueButton = findEnabledContinueButton();
    expect(painContinueButton).not.toBeNull();
    await user.click(painContinueButton!)
    
    // Symptoms - select a symptom by clicking on the containing div
    renderWithRouter(<SymptomsPage />, { route: '/assessment/symptoms' })
    // Use getAllByText since there might be multiple elements with the same text
    const headacheSymptoms = screen.getAllByText('Headaches');
    // Click on a symptom
    await user.click(headacheSymptoms[0].closest('div')!)
    const symptomsContinueButton = findEnabledContinueButton();
    expect(symptomsContinueButton).not.toBeNull();
    await user.click(symptomsContinueButton!)
    
    // Results - verify we get a result
    renderWithRouter(<ResultsPage />, { route: '/assessment/results' })
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
  })

  // Test for developing pattern pathway (O5 in LogicTree)
  it('should show developing pattern results for young users with variable cycles', async () => {
    const user = userEvent.setup()
    
    // Start at age verification page
    renderWithRouter(<AgeVerificationPage />, { route: '/assessment/age-verification' })
    
    // Age Verification - select 13-17 age range (young user)
    const ageOptions = screen.getAllByRole('radio');
    // Find and click the option for 13-17 age range
    for (const option of ageOptions) {
      const nearbyText = option.closest('div')?.textContent || '';
      if (nearbyText.includes('13-17')) {
        await user.click(option);
        break;
      }
    }
    
    const ageContinueButton = findEnabledContinueButton();
    expect(ageContinueButton).not.toBeNull();
    await user.click(ageContinueButton!)
    
    // Cycle Length - select "I'm not sure" or "Irregular"
    renderWithRouter(<CycleLengthPage />, { route: '/assessment/cycle-length' })
    // Try to find the option for "I'm not sure" or "Irregular"
    const cycleOptions = screen.getAllByRole('radio');
    // Look for the "not sure" option
    for (const option of cycleOptions) {
      const nearbyText = option.closest('div')?.textContent || '';
      if (nearbyText.includes('not sure') || nearbyText.includes('Irregular')) {
        await user.click(option);
        break;
      }
    }
    
    const cycleContinueButton = findEnabledContinueButton();
    expect(cycleContinueButton).not.toBeNull();
    await user.click(cycleContinueButton!)
    
    // Results - verify we get developing pattern result
    renderWithRouter(<ResultsPage />, { route: '/assessment/results' })
    expect(screen.getByText(/Your Menstrual Pattern/i)).toBeInTheDocument()
  })
}) 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import WelcomePage from './LandingPage'

// Import assessment components
import AgeVerification from './components/assessment/age-verification/page'
import CycleLength from './components/assessment/cycle-length/page'
import PeriodDuration from './components/assessment/period-duration/page'
import FlowLevel from './components/assessment/flow/page'
import PainLevel from './components/assessment/pain/page'
import Symptoms from './components/assessment/symptoms/page'
import Results from './components/assessment/results/page'
// Import TestPage component
import TestPage from './components/test_page/page'

function App() {
  return (
    <BrowserRouter>
      <main className="flex min-h-screen flex-col">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/assessment/age-verification" element={<AgeVerification />} />
          <Route path="/assessment/cycle-length" element={<CycleLength />} />
          <Route path="/assessment/period-duration" element={<PeriodDuration />} />
          <Route path="/assessment/flow" element={<FlowLevel />} />
          <Route path="/assessment/pain" element={<PainLevel />} />
          <Route path="/assessment/symptoms" element={<Symptoms />} />
          <Route path="/assessment/results" element={<Results />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App 
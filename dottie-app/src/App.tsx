import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import assessment components
import AgeVerification from './components/assessment/AgeVerification'
import CycleLength from './components/assessment/CycleLength'
import PeriodDuration from './components/assessment/PeriodDuration'
import FlowLevel from './components/assessment/FlowLevel'
import PainLevel from './components/assessment/PainLevel'
import Symptoms from './components/assessment/Symptoms'
import Results from './components/assessment/Results'

function App() {
  return (
    <Router>
      <main className="flex min-h-screen flex-col">
        <Routes>
          <Route path="/" element={<Navigate to="/assessment/age-verification" replace />} />
          <Route path="/assessment/age-verification" element={<AgeVerification />} />
          <Route path="/assessment/cycle-length" element={<CycleLength />} />
          <Route path="/assessment/period-duration" element={<PeriodDuration />} />
          <Route path="/assessment/flow" element={<FlowLevel />} />
          <Route path="/assessment/pain" element={<PainLevel />} />
          <Route path="/assessment/symptoms" element={<Symptoms />} />
          <Route path="/assessment/results" element={<Results />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App 
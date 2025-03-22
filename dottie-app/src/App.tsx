import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import assessment components
import AgeVerification from './components/assessment/AgeVerification'
import CycleLength from './components/assessment/CycleLength'
import FlowLevel from './components/assessment/FlowLevel'
import PainLevel from './components/assessment/PainLevel'
import Results from './components/assessment/Results'

function App() {
  return (
    <Router>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <Routes>
            <Route path="/" element={<Navigate to="/assessment/age" replace />} />
            <Route path="/assessment/age" element={<AgeVerification />} />
            <Route path="/assessment/cycle-length" element={<CycleLength />} />
            <Route path="/assessment/flow" element={<FlowLevel />} />
            <Route path="/assessment/pain" element={<PainLevel />} />
            <Route path="/assessment/results" element={<Results />} />
          </Routes>
        </div>
      </main>
    </Router>
  )
}

export default App 
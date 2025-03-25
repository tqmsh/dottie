import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
import { AssessmentResultProvider } from '@/context/AssessmentResultContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AssessmentResultProvider>
      <App />
    </AssessmentResultProvider>
  </React.StrictMode>,
) 
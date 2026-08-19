import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './components/pages/auth/auth.context.jsx'
import { BrowserRouter } from 'react-router-dom'
import InterviewProvider from './components/pages/ai/interview.context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <InterviewProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </InterviewProvider>
    </AuthProvider>
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Background from './assets/Background.jsx'
import './index.css'
import './script.js'
createRoot(document.getElementById('background-root')).render(
  <StrictMode>
    <Background />
  </StrictMode>,
)

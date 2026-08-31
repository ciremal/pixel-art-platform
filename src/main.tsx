import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { PixelArtProvider } from './context/PixelArtContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PixelArtProvider>
      <App />
    </PixelArtProvider>
  </StrictMode>,
)

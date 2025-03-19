
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './hooks/use-language.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <App />
        <Toaster position="top-right" />
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

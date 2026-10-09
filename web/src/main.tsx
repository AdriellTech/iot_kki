import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { isMockMode } from './api/client'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 500,
      retry: 1,
    },
  },
})

async function bootstrap() {
  // Demo mock: start simulasi burung+semprot langsung (tanpa MSW/SW — aman di Vercel)
  if (isMockMode()) {
    const { startMockSimulation } = await import('./mocks/store')
    startMockSimulation()
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
}

void bootstrap()

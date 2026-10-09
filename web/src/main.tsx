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
  if (isMockMode()) {
    const { enableMocking } = await import('./mocks/browser')
    await enableMocking()
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

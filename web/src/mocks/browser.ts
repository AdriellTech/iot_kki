import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { startMockSimulation } from './store'

export async function enableMocking() {
  const worker = setupWorker(...handlers)
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    quiet: true,
  })
  startMockSimulation()
}

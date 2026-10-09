import { http, HttpResponse } from 'msw'
import {
  getMockEvents,
  getMockHealth,
  getMockStatus,
  setMockMode,
  stopMockSpray,
  triggerMockSpray,
} from './store'

export const handlers = [
  http.get('/api/status', () => HttpResponse.json(getMockStatus())),
  http.get('/api/events', ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? '50')
    return HttpResponse.json(getMockEvents(limit))
  }),
  http.get('/api/health', () => HttpResponse.json(getMockHealth())),
  http.post('/api/mode', async ({ request }) => {
    const body = (await request.json()) as { auto?: boolean }
    return HttpResponse.json(setMockMode(Boolean(body.auto)))
  }),
  http.post('/api/spray', async ({ request }) => {
    const body = (await request.json()) as {
      zoneId?: string
      durationSec?: number
      manual?: boolean
      stop?: boolean
    }
    if (body.stop) {
      return HttpResponse.json(stopMockSpray())
    }
    return HttpResponse.json(triggerMockSpray(body))
  }),
]

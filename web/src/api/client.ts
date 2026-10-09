import type {
  EventsResponse,
  HealthResponse,
  ModeRequest,
  SprayRequest,
  StatusResponse,
} from './types'

const apiBase = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? ''

function url(path: string) {
  return `${apiBase}${path}`
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

/** Mock demo: default ON di dev; set VITE_USE_MSW=true untuk Vercel (tanpa ESP) */
export function isMockMode(): boolean {
  if (import.meta.env.VITE_USE_MSW === 'true') return true
  if (import.meta.env.VITE_USE_MSW === 'false') return false
  return import.meta.env.DEV
}

/**
 * API client.
 * Mode mock memanggil store langsung (aman di Vercel — tidak bentrok Service Worker PWA).
 * Mode live memakai fetch ke ESP.
 */
async function mockApi() {
  const store = await import('../mocks/store')
  return store
}

export const api = {
  getStatus: async (): Promise<StatusResponse> => {
    if (isMockMode()) {
      const { getMockStatus } = await mockApi()
      return getMockStatus()
    }
    return fetch(url('/api/status')).then((r) => parseJson<StatusResponse>(r))
  },

  getEvents: async (limit = 50): Promise<EventsResponse> => {
    if (isMockMode()) {
      const { getMockEvents } = await mockApi()
      return getMockEvents(limit)
    }
    return fetch(url(`/api/events?limit=${limit}`)).then((r) => parseJson<EventsResponse>(r))
  },

  getHealth: async (): Promise<HealthResponse> => {
    if (isMockMode()) {
      const { getMockHealth } = await mockApi()
      return getMockHealth()
    }
    return fetch(url('/api/health')).then((r) => parseJson<HealthResponse>(r))
  },

  setMode: async (body: ModeRequest): Promise<StatusResponse> => {
    if (isMockMode()) {
      const { setMockMode } = await mockApi()
      return setMockMode(Boolean(body.auto))
    }
    return fetch(url('/api/mode'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => parseJson<StatusResponse>(r))
  },

  spray: async (body: SprayRequest): Promise<StatusResponse> => {
    if (isMockMode()) {
      const { triggerMockSpray, stopMockSpray } = await mockApi()
      if (body.stop) return stopMockSpray()
      return triggerMockSpray({
        zoneId: body.zoneId,
        durationSec: body.durationSec,
        manual: body.manual,
      })
    }
    return fetch(url('/api/spray'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => parseJson<StatusResponse>(r))
  },
}

export function getStreamUrl(): string {
  const env = import.meta.env.VITE_STREAM_URL as string | undefined
  if (env) return env.startsWith('http') ? env : `${apiBase}${env}`
  return `${apiBase}/stream`
}

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

export const api = {
  getStatus: () => fetch(url('/api/status')).then((r) => parseJson<StatusResponse>(r)),
  getEvents: (limit = 50) =>
    fetch(url(`/api/events?limit=${limit}`)).then((r) => parseJson<EventsResponse>(r)),
  getHealth: () => fetch(url('/api/health')).then((r) => parseJson<HealthResponse>(r)),
  setMode: (body: ModeRequest) =>
    fetch(url('/api/mode'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => parseJson<StatusResponse>(r)),
  spray: (body: SprayRequest) =>
    fetch(url('/api/spray'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => parseJson<StatusResponse>(r)),
}

export function getStreamUrl(): string {
  const env = import.meta.env.VITE_STREAM_URL as string | undefined
  if (env) return env.startsWith('http') ? env : `${apiBase}${env}`
  return `${apiBase}/stream`
}

/** Mock MSW: default ON di dev; set VITE_USE_MSW=true untuk demo Vercel */
export function isMockMode(): boolean {
  if (import.meta.env.VITE_USE_MSW === 'true') return true
  if (import.meta.env.VITE_USE_MSW === 'false') return false
  return import.meta.env.DEV
}

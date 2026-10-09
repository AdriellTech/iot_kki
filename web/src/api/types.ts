export type SystemMode = 'auto' | 'manual'

export type SprinklerStatus = {
  id: string
  label: string
  x: number
  z: number
  active: boolean
  lastSprayAt: string | null
}

export type LastDetection = {
  at: string
  confidence: number
  zoneId: string | null
  birdDetected: boolean
} | null

/** Burung terlihat di lahan (belum tentu sudah "terdeteksi") */
export type BirdOnField = {
  at: string
  zoneId: string | null
} | null

export type StatusResponse = {
  version: string
  mode: SystemMode
  connected: boolean
  pumpOn: boolean
  detectionsToday: number
  /** Burung sudah di lahan (visual); deteksi resmi = lastDetection. Opsional di firmware. */
  birdOnField?: BirdOnField
  lastDetection: LastDetection
  sprinklers: SprinklerStatus[]
  sensors: {
    motion: boolean
    cameraOnline: boolean
  }
}

export type EventType = 'detection' | 'spray' | 'mode_change' | 'system'

export type SystemEvent = {
  id: string
  type: EventType
  at: string
  message: string
  zoneId?: string
  manual?: boolean
}

export type EventsResponse = {
  events: SystemEvent[]
}

export type HealthResponse = {
  uptimeSec: number
  wifiClients: number
  heapFree: number
}

export type SprayRequest = {
  zoneId?: string
  durationSec?: number
  manual?: boolean
  /** Mock & firmware opsional — hentikan semprotan aktif */
  stop?: boolean
}

export type ModeRequest = {
  auto: boolean
}

import { CAMERA_MARKER, SPRINKLER_ZONES } from '../config/field'
import type { StatusResponse, SystemEvent, SystemMode } from '../api/types'

const startTime = Date.now()

let mode: SystemMode = 'auto'
let pumpOn = false
let detectionsToday = 0
let events: SystemEvent[] = [
  {
    id: 'evt-boot',
    type: 'system',
    at: new Date().toISOString(),
    message: 'HydroSky Defender mock — sistem siap',
  },
]

let lastDetection: StatusResponse['lastDetection'] = null

const sprinklerState = SPRINKLER_ZONES.map((z) => ({
  id: z.id,
  label: z.label,
  x: z.x,
  z: z.z,
  active: false,
  lastSprayAt: null as string | null,
}))

let sprayTimeout: ReturnType<typeof setTimeout> | null = null
let simulationInterval: ReturnType<typeof setInterval> | null = null

function pushEvent(event: Omit<SystemEvent, 'id' | 'at'> & { at?: string }) {
  const entry: SystemEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: event.at ?? new Date().toISOString(),
    type: event.type,
    message: event.message,
    zoneId: event.zoneId,
    manual: event.manual,
  }
  events = [entry, ...events].slice(0, 200)
}

function clearSpray() {
  sprinklerState.forEach((s) => {
    s.active = false
  })
  pumpOn = false
}

function runSpray(zoneIds: string[], durationSec: number, manual: boolean) {
  if (sprayTimeout) clearTimeout(sprayTimeout)
  pumpOn = true
  const now = new Date().toISOString()
  zoneIds.forEach((id) => {
    const s = sprinklerState.find((x) => x.id === id)
    if (s) {
      s.active = true
      s.lastSprayAt = now
    }
  })
  const labels = zoneIds
    .map((id) => sprinklerState.find((s) => s.id === id)?.label ?? id)
    .join(', ')
  pushEvent({
    type: 'spray',
    message: manual
      ? `Semprot manual: ${labels} (${durationSec}s)`
      : `Semprot otomatis: ${labels} (${durationSec}s)`,
    zoneId: zoneIds[0],
    manual,
  })
  sprayTimeout = setTimeout(() => clearSpray(), durationSec * 1000)
}

export function getMockStatus(): StatusResponse {
  return {
    version: '1.0.0-mock',
    mode,
    connected: true,
    pumpOn,
    detectionsToday,
    lastDetection,
    sprinklers: sprinklerState.map((s) => ({ ...s })),
    sensors: {
      motion: lastDetection?.birdDetected ?? false,
      cameraOnline: true,
    },
  }
}

export function getMockEvents(limit: number) {
  return { events: events.slice(0, limit) }
}

export function getMockHealth() {
  return {
    uptimeSec: Math.floor((Date.now() - startTime) / 1000),
    wifiClients: 1,
    heapFree: 142000,
  }
}

export function setMockMode(auto: boolean) {
  mode = auto ? 'auto' : 'manual'
  pushEvent({
    type: 'mode_change',
    message: auto ? 'Mode otomatis diaktifkan' : 'Mode manual diaktifkan',
  })
  return getMockStatus()
}

export function triggerMockSpray(body: {
  zoneId?: string
  durationSec?: number
  manual?: boolean
}) {
  const duration = body.durationSec ?? 3
  const manual = body.manual ?? true
  const ids = body.zoneId
    ? [body.zoneId]
    : sprinklerState.map((s) => s.id)
  runSpray(ids, duration, manual)
  return getMockStatus()
}

export function stopMockSpray() {
  if (sprayTimeout) clearTimeout(sprayTimeout)
  clearSpray()
  pushEvent({ type: 'system', message: 'Semprotan dihentikan' })
  return getMockStatus()
}

function pickRandomZone() {
  const z = SPRINKLER_ZONES[Math.floor(Math.random() * SPRINKLER_ZONES.length)]
  return z.id
}

/** Durasi burung + semprot otomatis (selaras di UI) */
export const AUTO_SPRAY_SEC = 6

function simulateDetection() {
  // Jangan ganggu semprotan yang sedang jalan
  if (pumpOn) return
  // Selalu deteksi burung saat interval (demo lebih jelas)
  const zoneId = pickRandomZone()
  detectionsToday += 1
  lastDetection = {
    at: new Date().toISOString(),
    confidence: 0.72 + Math.random() * 0.25,
    zoneId,
    birdDetected: true,
  }
  const label = SPRINKLER_ZONES.find((z) => z.id === zoneId)?.label ?? zoneId
  pushEvent({
    type: 'detection',
    message: `Burung terdeteksi dekat ${label} (mock)`,
    zoneId,
  })
  // Mode auto: langsung semprot bersamaan dengan munculnya burung
  if (mode === 'auto') {
    runSpray([zoneId], AUTO_SPRAY_SEC, false)
  }
}

export function startMockSimulation() {
  if (simulationInterval) return
  // Deteksi pertama cepat supaya demo langsung kelihatan
  setTimeout(simulateDetection, 2500)
  simulationInterval = setInterval(simulateDetection, 10000)
}

export function stopMockSimulation() {
  if (simulationInterval) clearInterval(simulationInterval)
  simulationInterval = null
}

export const mockFieldMeta = { CAMERA_MARKER, SPRINKLER_ZONES }

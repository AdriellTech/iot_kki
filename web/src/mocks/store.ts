import { CAMERA_MARKER, SPRINKLER_ZONES } from '../config/field'
import type { BirdOnField, StatusResponse, SystemEvent, SystemMode } from '../api/types'

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
let birdOnField: BirdOnField = null

const sprinklerState = SPRINKLER_ZONES.map((z) => ({
  id: z.id,
  label: z.label,
  x: z.x,
  z: z.z,
  active: false,
  lastSprayAt: null as string | null,
}))

let sprayTimeout: ReturnType<typeof setTimeout> | null = null
let detectDelayTimeout: ReturnType<typeof setTimeout> | null = null
let clearBirdTimeout: ReturnType<typeof setTimeout> | null = null
let simulationInterval: ReturnType<typeof setInterval> | null = null
let cycleBusy = false

/** Burung di lahan → tunggu ini → baru deteksi + semprot */
export const BIRD_TO_DETECT_MS = 2_000
/** Durasi semprot otomatis */
export const AUTO_SPRAY_SEC = 6

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
  sprayTimeout = setTimeout(() => {
    clearSpray()
    // Burung kabur sebentar setelah semprot selesai
    if (clearBirdTimeout) clearTimeout(clearBirdTimeout)
    clearBirdTimeout = setTimeout(() => {
      birdOnField = null
      cycleBusy = false
    }, 1500)
  }, durationSec * 1000)
}

export function getMockStatus(): StatusResponse {
  return {
    version: '1.0.0-mock',
    mode,
    connected: true,
    pumpOn,
    detectionsToday,
    birdOnField: birdOnField ? { ...birdOnField } : null,
    lastDetection,
    sprinklers: sprinklerState.map((s) => ({ ...s })),
    sensors: {
      motion: birdOnField != null,
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
  const ids = body.zoneId ? [body.zoneId] : sprinklerState.map((s) => s.id)
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

/**
 * 1) Burung muncul di lahan (visual)
 * 2) Setelah 2 detik → terdeteksi + semprot (mode auto)
 */
function spawnBirdCycle() {
  if (cycleBusy || pumpOn || birdOnField) return
  cycleBusy = true

  const zoneId = pickRandomZone()
  birdOnField = {
    at: new Date().toISOString(),
    zoneId,
  }

  if (detectDelayTimeout) clearTimeout(detectDelayTimeout)
  detectDelayTimeout = setTimeout(() => {
    // Pastikan burung masih di lahan
    if (!birdOnField) {
      cycleBusy = false
      return
    }

    detectionsToday += 1
    lastDetection = {
      at: new Date().toISOString(),
      confidence: 0.72 + Math.random() * 0.25,
      zoneId: birdOnField.zoneId,
      birdDetected: true,
    }
    const label =
      SPRINKLER_ZONES.find((z) => z.id === birdOnField?.zoneId)?.label ?? birdOnField.zoneId
    pushEvent({
      type: 'detection',
      message: `Burung terdeteksi dekat ${label} (mock)`,
      zoneId: birdOnField.zoneId ?? undefined,
    })

    // Auto: selalu semprot setelah terdeteksi (meski sebelumnya belum semprot)
    if (mode === 'auto') {
      runSpray([zoneId], AUTO_SPRAY_SEC, false)
    } else {
      // Manual: burung tetap sebentar lalu hilang
      if (clearBirdTimeout) clearTimeout(clearBirdTimeout)
      clearBirdTimeout = setTimeout(() => {
        birdOnField = null
        cycleBusy = false
      }, 5000)
    }
  }, BIRD_TO_DETECT_MS)
}

export function startMockSimulation() {
  if (simulationInterval) return
  setTimeout(spawnBirdCycle, 2000)
  simulationInterval = setInterval(spawnBirdCycle, 12000)
}

export function stopMockSimulation() {
  if (simulationInterval) clearInterval(simulationInterval)
  simulationInterval = null
  if (detectDelayTimeout) clearTimeout(detectDelayTimeout)
  if (clearBirdTimeout) clearTimeout(clearBirdTimeout)
}

export const mockFieldMeta = { CAMERA_MARKER, SPRINKLER_ZONES }

/** Ukuran lahan uji PKM: 5 × 5 meter */
export const FIELD_SIZE_M = 5

/**
 * Populasi aktual kedelai di lahan uji (25×25).
 * Scene 3D menampilkan subset rapat dengan rasio representasi.
 */
export const REAL_PLANT_COUNT = 625
/** Sisi grid visual (11×11 ≈ 121) → rasio ~1:5 */
export const VISUAL_PLANT_SIDE = 11
export const VISUAL_PLANT_COUNT = VISUAL_PLANT_SIDE * VISUAL_PLANT_SIDE
/** Tiap tanaman visual mewakili ~5 tanaman aktual */
export const PLANT_SCALE_RATIO = Math.round(REAL_PLANT_COUNT / VISUAL_PLANT_COUNT)

export type SprinklerZone = {
  id: string
  label: string
  x: number
  z: number
}

export type CameraMarker = {
  id: string
  label: string
  x: number
  z: number
}

const half = FIELD_SIZE_M / 2

/** Satu sprinkler tengah — jangkauan seluruh lahan 5×5 m (semprot + siram) */
export const SPRINKLER_ZONES: SprinklerZone[] = [
  { id: 'zone-center', label: 'Sprinkler tengah', x: 0, z: 0 },
]

export const CENTER_SPRINKLER_ID = SPRINKLER_ZONES[0]!.id

/** ESP-CAM di luar lahan, sisi depan (-Z) — menghadap ke dalam plot */
export const CAMERA_MARKER: CameraMarker = {
  id: 'esp-cam',
  label: 'ESP32-CAM',
  x: 0,
  z: -half - 0.55,
}

/** Radius kosong di tengah agar sprinkler tidak tertutup tanaman */
export const SPRINKLER_CLEAR_R = 0.26

/** Kamera tetap saja — tanpa drag/orbit (lebih ringan) */
export type CameraViewPreset = 'isometric' | 'top' | 'side'

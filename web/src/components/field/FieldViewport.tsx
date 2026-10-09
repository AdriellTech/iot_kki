import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'
import {
  PLANT_SCALE_RATIO,
  REAL_PLANT_COUNT,
  type CameraViewPreset,
} from '../../config/field'
import { FieldScene } from './FieldScene'

type Props = {
  view: CameraViewPreset
  selectedZoneId: string | null
  onSelectZone: (id: string | null) => void
}

/** Burung di lahan: dari birdOnField; chip "terdeteksi" dari lastDetection */
const BIRD_VISIBLE_MS = 12_000

export default function FieldViewport({ view, selectedZoneId, onSelectZone }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? true),
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const { data } = useQuery({
    queryKey: ['status'],
    queryFn: () => api.getStatus(),
    refetchInterval: 500,
    staleTime: 200,
  })

  const highlightZoneId = data?.lastDetection?.zoneId ?? data?.birdOnField?.zoneId ?? null
  const sprinklers = data?.sprinklers ?? []
  const pumpOn = data?.pumpOn ?? false

  const { birdActive, birdZoneId, birdDetected } = useMemo(() => {
    const presence = data?.birdOnField
    const det = data?.lastDetection

    if (presence?.at) {
      const age = Date.now() - new Date(presence.at).getTime()
      if (age >= 0 && age < BIRD_VISIBLE_MS) {
        return {
          birdActive: true,
          birdZoneId: presence.zoneId,
          birdDetected: Boolean(det?.birdDetected && det.at && Date.now() - new Date(det.at).getTime() < BIRD_VISIBLE_MS),
        }
      }
    }

    if (det?.birdDetected && det.at) {
      const age = Date.now() - new Date(det.at).getTime()
      if (age >= 0 && age < BIRD_VISIBLE_MS) {
        return { birdActive: true, birdZoneId: det.zoneId, birdDetected: true }
      }
    }

    return { birdActive: false, birdZoneId: null as string | null, birdDetected: false }
  }, [data?.birdOnField, data?.lastDetection])

  const animating = birdActive || pumpOn || sprinklers.some((s) => s.active)
  const frameloop = !inView ? 'never' : animating ? 'always' : 'demand'

  return (
    <div
      ref={wrapRef}
      className="clay-inset relative h-full min-h-0 w-full overflow-hidden rounded-[1.5rem]"
    >
      <Canvas
        className="!h-full !w-full"
        style={{ height: '100%', width: '100%', touchAction: 'pan-y' }}
        dpr={1}
        frameloop={frameloop}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          alpha: false,
        }}
        key={view}
      >
        <Suspense fallback={null}>
          <FieldScene
            view={view}
            sprinklers={sprinklers}
            selectedZoneId={selectedZoneId}
            onSelectZone={onSelectZone}
            highlightZoneId={highlightZoneId}
            birdActive={birdActive}
            birdZoneId={birdZoneId}
            pumpOn={pumpOn}
          />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 left-2 flex flex-wrap gap-1.5">
        <span className="clay-chip !py-1 !text-[0.65rem]">
          {REAL_PLANT_COUNT} tanaman · 1:{PLANT_SCALE_RATIO}
        </span>
        {birdActive && !birdDetected ? (
          <span
            className="clay-chip !border-transparent !py-1 !text-[0.65rem] !text-clay-text"
            style={{
              background: 'linear-gradient(180deg, #e8eef0 0%, #d5dde0 100%)',
            }}
          >
            Burung di lahan…
          </span>
        ) : null}
        {birdDetected ? (
          <span
            className="clay-chip !border-transparent !py-1 !text-[0.65rem] !text-clay-text"
            style={{
              background: 'linear-gradient(180deg, #f8d98a 0%, #f6c96a 100%)',
            }}
          >
            Burung terdeteksi
          </span>
        ) : null}
        {pumpOn ? (
          <span
            className="clay-chip !border-transparent !py-1 !text-[0.65rem] !text-white"
            style={{
              background: 'linear-gradient(180deg, #7ada9e 0%, #5ecf8a 100%)',
              boxShadow: 'var(--shadow-clay-accent)',
            }}
          >
            Semprot aktif
          </span>
        ) : null}
      </div>
    </div>
  )
}

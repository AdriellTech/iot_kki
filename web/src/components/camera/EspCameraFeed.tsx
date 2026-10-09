import { useCallback, useState } from 'react'
import { getStreamUrl, isMockMode } from '../../api/client'
import { ClayButton } from '../clay/ClayButton'
import { ClayCard } from '../clay/ClayCard'

type Props = {
  /** Isi penuh tinggi parent */
  fill?: boolean
  /** Tanpa ClayCard — dipakai di dalam card parent Monitor */
  embedded?: boolean
}

export function EspCameraFeed({ fill = false, embedded = false }: Props) {
  const mock = isMockMode()
  const [streamKey, setStreamKey] = useState(0)
  const [error, setError] = useState(false)

  const streamUrl = getStreamUrl()
  const reload = useCallback(() => {
    setError(false)
    setStreamKey((k) => k + 1)
  }, [])

  const panel = (
    <>
      <div
        className={`clay-inset relative w-full overflow-hidden rounded-[1.5rem] bg-clay-surface-2 ${
          fill || embedded ? 'min-h-0 flex-1' : 'aspect-video min-h-[200px]'
        }`}
      >
        {mock || error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(160deg, #f6c96a 0%, #e8b84a 100%)',
                boxShadow: 'var(--shadow-clay)',
              }}
            >
              <span
                className="h-5 w-5 rounded-full bg-[#2d4035]/80"
                style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.2)' }}
              />
            </div>
            <p className="text-sm font-extrabold text-clay-text">
              {mock ? 'Mode demo — stream MJPEG dari ESP' : 'Menunggu stream…'}
            </p>
            <p className="max-w-[16rem] text-xs leading-relaxed text-clay-muted">
              {mock
                ? 'Saat terhubung ke IP ESP, feed akan tampil di sini (/stream).'
                : 'Periksa kabel kamera dan endpoint /stream di firmware.'}
            </p>
            {!mock ? (
              <ClayButton variant="primary" className="mt-1" onClick={reload}>
                Muat ulang
              </ClayButton>
            ) : null}
          </div>
        ) : (
          <img
            key={streamKey}
            src={streamUrl}
            alt="Live ESP32-CAM"
            className="h-full w-full object-cover"
            onError={() => setError(true)}
          />
        )}
      </div>
      {!mock && !error ? (
        <ClayButton variant="ghost" className="mt-2 w-full shrink-0 !text-xs" onClick={reload}>
          Reconnect stream
        </ClayButton>
      ) : null}
    </>
  )

  if (embedded) {
    return <div className="flex h-full min-h-0 flex-1 flex-col">{panel}</div>
  }

  return (
    <ClayCard
      title="Video ESP32-CAM"
      className={`flex flex-col !p-3 md:!p-4 ${fill ? 'h-full min-h-0' : 'w-full shrink-0'}`}
    >
      {panel}
    </ClayCard>
  )
}

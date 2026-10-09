import type { CameraViewPreset } from '../../config/field'
import type { MediaMode } from './MediaSwitcher'

const mediaLabels: Record<MediaMode, string> = {
  field: 'Lahan 3D',
  video: 'Video',
}

const viewLabels: Record<CameraViewPreset, string> = {
  isometric: 'Isometric',
  top: 'Atas',
  side: 'Samping',
}

type Props = {
  media: MediaMode
  onMediaChange: (m: MediaMode) => void
  view: CameraViewPreset
  onViewChange: (v: CameraViewPreset) => void
}

/**
 * Baris 1: judul besar kiri | divider | Lahan 3D / Video kanan
 * Baris 2 (jika 3D): Isometric / Atas / Samping — full width, dibagi rata
 */
export function MonitorToolbar({ media, onMediaChange, view, onViewChange }: Props) {
  return (
    <header className="mb-3 flex shrink-0 flex-col gap-2.5">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.6rem] font-extrabold tracking-[0.14em] text-clay-muted uppercase">
            Monitor lahan
          </p>
          <h2 className="truncate text-lg font-extrabold tracking-tight text-clay-text md:text-xl">
            {media === 'field' ? 'Visualisasi 3D' : 'Stream video'}
          </h2>
        </div>

        <div
          className="hidden h-10 w-px shrink-0 self-center sm:block"
          style={{ background: 'rgba(120, 145, 130, 0.35)' }}
          aria-hidden
        />

        <div
          className="clay-nav-pill flex shrink-0 gap-1"
          role="group"
          aria-label="Mode tampilan"
        >
          {(Object.keys(mediaLabels) as MediaMode[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`clay-nav-item ${media === key ? 'clay-nav-item-active' : 'clay-nav-item-idle'}`}
              onClick={() => onMediaChange(key)}
            >
              {mediaLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {media === 'field' ? (
        <>
          <div
            className="h-px w-full"
            style={{ background: 'rgba(120, 145, 130, 0.22)' }}
            aria-hidden
          />
          <div
            className="flex w-full gap-1.5 rounded-[1.35rem] p-1"
            style={{
              boxShadow: 'var(--shadow-clay-inset)',
              background: 'var(--color-clay-surface-2)',
            }}
            role="group"
            aria-label="Sudut kamera"
          >
            {(Object.keys(viewLabels) as CameraViewPreset[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`clay-nav-item flex min-w-0 flex-1 items-center justify-center text-center ${
                  view === key ? 'clay-nav-item-active' : 'clay-nav-item-idle'
                }`}
                onClick={() => onViewChange(key)}
              >
                {viewLabels[key]}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </header>
  )
}

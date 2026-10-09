import { lazy, Suspense, useState } from 'react'
import type { CameraViewPreset } from '../config/field'
import { ControlPanel } from '../components/dashboard/ControlPanel'
import { EventLog } from '../components/dashboard/EventLog'
import { HeaderBar } from '../components/dashboard/HeaderBar'
import { KpiCards } from '../components/dashboard/KpiCards'
import { type MediaMode } from '../components/dashboard/MediaSwitcher'
import { MonitorToolbar } from '../components/dashboard/MonitorToolbar'
import { EspCameraFeed } from '../components/camera/EspCameraFeed'
import { ClayCard } from '../components/clay/ClayCard'
import { useIsDesktop } from '../hooks/useIsDesktop'

const FieldViewport = lazy(() => import('../components/field/FieldViewport'))

type MobileTab = MediaMode | 'log'

function MonitorStage({
  media,
  onMediaChange,
  view,
  onViewChange,
  selectedZoneId,
  onSelectZone,
  mobileHeight,
}: {
  media: MediaMode
  onMediaChange: (m: MediaMode) => void
  view: CameraViewPreset
  onViewChange: (v: CameraViewPreset) => void
  selectedZoneId: string | null
  onSelectZone: (id: string | null) => void
  mobileHeight?: boolean
}) {
  return (
    <ClayCard
      className={`flex flex-col !p-3 md:!p-4 ${mobileHeight ? '' : 'h-full min-h-0 flex-1'}`}
    >
      <MonitorToolbar
        media={media}
        onMediaChange={onMediaChange}
        view={view}
        onViewChange={onViewChange}
      />

      <div
        className={
          mobileHeight
            ? 'h-[min(58vh,480px)] min-h-[280px] w-full'
            : 'min-h-0 flex-1'
        }
      >
        {media === 'field' ? (
          <Suspense
            fallback={
              <div className="clay-inset flex h-full items-center justify-center text-sm font-semibold text-clay-muted">
                Memuat scene 3D…
              </div>
            }
          >
            <FieldViewport
              view={view}
              selectedZoneId={selectedZoneId}
              onSelectZone={onSelectZone}
            />
          </Suspense>
        ) : (
          <EspCameraFeed embedded fill />
        )}
      </div>
    </ClayCard>
  )
}

export function MonitoringPage() {
  const isDesktop = useIsDesktop()
  const [view, setView] = useState<CameraViewPreset>('isometric')
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [media, setMedia] = useState<MediaMode>('field')
  const [mobileTab, setMobileTab] = useState<MobileTab>('field')

  const setMobile = (t: MobileTab) => {
    setMobileTab(t)
    if (t === 'field' || t === 'video') setMedia(t)
  }

  const setMediaBoth = (m: MediaMode) => {
    setMedia(m)
    setMobileTab(m)
  }

  return (
    <div className="flex min-h-full flex-col gap-3 p-3 md:gap-3 md:p-4 lg:h-full lg:min-h-0 lg:gap-3 lg:overflow-hidden lg:p-3">
      <HeaderBar />

      {!isDesktop ? (
        <>
          <div className="clay-nav-pill flex shrink-0 gap-1">
            {(
              [
                ['field', 'Monitor'],
                ['log', 'Log'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`clay-nav-item flex-1 ${
                  (id === 'field' && (mobileTab === 'field' || mobileTab === 'video')) ||
                  mobileTab === id
                    ? 'clay-nav-item-active'
                    : 'clay-nav-item-idle'
                }`}
                onClick={() => setMobile(id === 'field' ? media : id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex w-full flex-col gap-3">
            {mobileTab === 'field' || mobileTab === 'video' ? (
              <>
                <KpiCards />
                <ControlPanel
                  selectedZoneId={selectedZoneId}
                  onClearZone={() => setSelectedZoneId(null)}
                />
                <MonitorStage
                  media={media}
                  onMediaChange={setMediaBoth}
                  view={view}
                  onViewChange={setView}
                  selectedZoneId={selectedZoneId}
                  onSelectZone={setSelectedZoneId}
                  mobileHeight
                />
              </>
            ) : null}

            {mobileTab === 'log' ? (
              <div className="min-h-[50vh] w-full">
                <EventLog />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-12 gap-3 overflow-hidden">
          <aside className="col-span-3 flex min-h-0 flex-col gap-2.5 overflow-hidden">
            <div className="shrink-0 space-y-2.5">
              <KpiCards />
              <ControlPanel
                selectedZoneId={selectedZoneId}
                onClearZone={() => setSelectedZoneId(null)}
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <EventLog />
            </div>
          </aside>

          <main className="col-span-9 flex min-h-0 flex-col overflow-hidden">
            <MonitorStage
              media={media}
              onMediaChange={setMediaBoth}
              view={view}
              onViewChange={setView}
              selectedZoneId={selectedZoneId}
              onSelectZone={setSelectedZoneId}
            />
          </main>
        </div>
      )}
    </div>
  )
}

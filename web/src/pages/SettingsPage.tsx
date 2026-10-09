import { Link } from 'react-router-dom'
import { ClayButton } from '../components/clay/ClayButton'
import { ClayCard } from '../components/clay/ClayCard'
import { isMockMode } from '../api/client'

export function SettingsPage() {
  return (
    <div className="mx-auto min-h-full max-w-lg space-y-4 overflow-y-auto p-4 md:p-6 lg:h-full">
      <ClayCard title="Pengaturan">
        <dl className="space-y-3 text-sm">
          <div className="clay-inset p-4">
            <dt className="text-xs font-bold tracking-wide text-clay-muted uppercase">Mode API</dt>
            <dd className="mt-1 font-extrabold text-clay-text">
              {isMockMode() ? 'Mock (MSW) — development' : 'Live ESP'}
            </dd>
          </div>
          <div className="clay-inset p-4">
            <dt className="text-xs font-bold tracking-wide text-clay-muted uppercase">Base URL</dt>
            <dd className="mt-1 font-mono text-xs break-all text-clay-text">
              {(import.meta.env.VITE_API_BASE as string) || '(relative — production ESP)'}
            </dd>
          </div>
          <div className="clay-inset p-4">
            <dt className="text-xs font-bold tracking-wide text-clay-muted uppercase">Stream URL</dt>
            <dd className="mt-1 font-mono text-xs break-all text-clay-text">
              {(import.meta.env.VITE_STREAM_URL as string) || '/stream'}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-clay-muted">
          Untuk uji di lapangan, set{' '}
          <code className="clay-chip !inline !rounded-lg !px-2 !py-0.5 !text-[0.7rem]">
            VITE_USE_MSW=false
          </code>{' '}
          dan arahkan browser ke IP WiFi ESP32.
        </p>
      </ClayCard>
      <Link to="/" className="block">
        <ClayButton variant="primary" className="w-full">
          Kembali ke monitoring
        </ClayButton>
      </Link>
    </div>
  )
}

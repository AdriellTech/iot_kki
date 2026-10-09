import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'

export function HeaderBar() {
  const status = useQuery({
    queryKey: ['status'],
    queryFn: () => api.getStatus(),
    refetchInterval: 2000,
  })

  const online = status.isSuccess && status.data.connected
  const mode = status.data?.mode ?? '—'

  return (
    <header className="clay-surface-lg flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:px-5 md:py-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] md:h-11 md:w-11"
          style={{
            background: 'linear-gradient(160deg, #7ada9e 0%, #5ecf8a 55%, #7ec8e8 100%)',
            boxShadow: 'var(--shadow-clay-accent)',
          }}
          aria-hidden
        >
          <span className="h-4 w-4 rounded-full bg-white/85" style={{ boxShadow: 'var(--shadow-clay-float)' }} />
        </div>
        <div>
          <p className="text-[0.6rem] font-extrabold tracking-[0.18em] text-clay-accent-dark uppercase">
            PKM HydroSky
          </p>
          <h1 className="text-lg font-extrabold tracking-tight text-clay-text md:text-xl">
            HydroSky Defender
          </h1>
          <p className="hidden text-xs font-medium text-clay-muted sm:block">
            Monitoring lahan kedelai 5×5 m
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="clay-chip">
          <span className={`clay-dot ${online ? 'bg-clay-accent' : 'bg-clay-danger'}`} aria-hidden />
          <span>{online ? 'Online' : 'Offline'}</span>
        </div>
        <div className="clay-chip capitalize">{mode}</div>
        <Link to="/settings" className="clay-btn clay-btn-secondary !py-2.5 !text-xs">
          Pengaturan
        </Link>
      </div>
    </header>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { EventType } from '../../api/types'
import { ClayCard } from '../clay/ClayCard'

const badge: Record<EventType, string> = {
  detection: 'bg-clay-warn text-clay-text',
  spray: 'bg-clay-sky text-white',
  mode_change: 'bg-clay-surface-2 text-clay-muted',
  system: 'bg-clay-surface text-clay-muted',
}

export function EventLog() {
  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.getEvents(40),
    refetchInterval: 2000,
  })

  return (
    <ClayCard
      title="Log stream data"
      className="flex h-full min-h-[280px] flex-col !p-3 md:!p-4 lg:min-h-0"
    >
      <ul
        className="max-h-[55vh] min-h-0 flex-1 space-y-2 overflow-y-auto rounded-[1.25rem] p-1.5 lg:max-h-none"
        style={{ boxShadow: 'var(--shadow-clay-inset)', background: 'var(--color-clay-surface-2)' }}
      >
        {(data?.events ?? []).map((ev) => (
          <li
            key={ev.id}
            className="flex gap-2 rounded-[1rem] border border-white/60 bg-clay-surface p-2.5 text-sm"
            style={{ boxShadow: 'var(--shadow-clay-float)' }}
          >
            <span
              className={`shrink-0 self-start rounded-full px-2 py-0.5 text-[0.6rem] font-extrabold tracking-wide uppercase ${badge[ev.type]}`}
              style={{ boxShadow: 'var(--shadow-clay-float)' }}
            >
              {ev.type}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug font-semibold text-clay-text">{ev.message}</p>
              <p className="mt-0.5 text-[0.65rem] text-clay-muted">
                {new Date(ev.at).toLocaleString('id-ID')}
              </p>
            </div>
          </li>
        ))}
        {!data?.events.length ? (
          <li className="py-6 text-center text-sm font-medium text-clay-muted">Belum ada event.</li>
        ) : null}
      </ul>
    </ClayCard>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'
import { ClayCard } from '../clay/ClayCard'

function formatTime(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export function KpiCards() {
  const { data } = useQuery({
    queryKey: ['status'],
    queryFn: () => api.getStatus(),
    refetchInterval: 2000,
  })

  const items = [
    {
      label: 'Deteksi hari ini',
      value: data?.detectionsToday ?? 0,
      tint: 'from-[#b8f0d0] to-[#e8faf0]',
    },
    {
      label: 'Semprot terakhir',
      value: formatTime(
        data?.sprinklers
          .map((s) => s.lastSprayAt)
          .filter(Boolean)
          .sort()
          .pop(),
      ),
      tint: 'from-[#c8e8f8] to-[#eef7fc]',
    },
    {
      label: 'Pompa',
      value: data?.pumpOn ? 'Aktif' : 'Mati',
      tint: data?.pumpOn ? 'from-[#a8e0ff] to-[#e0f4ff]' : 'from-[#eef2ef] to-[#f7fbf8]',
    },
    {
      label: 'Kamera',
      value: data?.sensors.cameraOnline ? 'Online' : 'Offline',
      tint: 'from-[#f8e8b8] to-[#fdf6e0]',
    },
  ]

  return (
    <ClayCard title="Ringkasan" className="!p-3 md:!p-4">
      <ul className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <li
            key={item.label}
            className={`rounded-[1.1rem] border border-white/70 bg-gradient-to-br ${item.tint} p-2.5`}
            style={{ boxShadow: 'var(--shadow-clay)' }}
          >
            <p className="text-[0.58rem] font-bold tracking-wide text-clay-muted uppercase">
              {item.label}
            </p>
            <p className="mt-1 text-base font-extrabold text-clay-text">{item.value}</p>
          </li>
        ))}
      </ul>
    </ClayCard>
  )
}

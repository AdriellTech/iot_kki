import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../../api/client'
import type { SprayRequest } from '../../api/types'
import { ClayButton } from '../clay/ClayButton'
import { ClayCard } from '../clay/ClayCard'
import { ClayModal } from '../clay/ClayModal'
import { ClayToggle } from '../clay/ClayToggle'

type Props = {
  selectedZoneId: string | null
  onClearZone: () => void
}

export function ControlPanel({ selectedZoneId, onClearZone }: Props) {
  const qc = useQueryClient()
  const [confirmAll, setConfirmAll] = useState(false)

  const status = useQuery({
    queryKey: ['status'],
    queryFn: () => api.getStatus(),
    refetchInterval: 2000,
  })

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['status'] })
    void qc.invalidateQueries({ queryKey: ['events'] })
  }

  const modeMutation = useMutation({
    mutationFn: (auto: boolean) => api.setMode({ auto }),
    onSuccess: invalidate,
  })

  const sprayMutation = useMutation({
    mutationFn: (payload: SprayRequest) => api.spray(payload),
    onSuccess: invalidate,
  })

  const auto = status.data?.mode === 'auto'
  const pumping = status.data?.pumpOn

  return (
    <>
      <ClayCard title="Kontrol" className="!p-3 md:!p-4">
        <div className="space-y-2.5">
          <ClayToggle
            checked={auto}
            onChange={(v) => modeMutation.mutate(v)}
            label="Mode otomatis"
            description="Semprot saat burung terdeteksi"
            disabled={modeMutation.isPending}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <ClayButton
              variant="primary"
              className="flex-1"
              loading={sprayMutation.isPending}
              onClick={() => {
                if (selectedZoneId) {
                  sprayMutation.mutate({ zoneId: selectedZoneId, manual: true })
                  onClearZone()
                } else {
                  setConfirmAll(true)
                }
              }}
            >
              {selectedZoneId ? 'Semprot sprinkler' : 'Semprot lahan'}
            </ClayButton>
            <ClayButton
              variant="danger"
              className="flex-1"
              disabled={!pumping}
              loading={sprayMutation.isPending}
              onClick={() => sprayMutation.mutate({ stop: true, manual: true })}
            >
              Hentikan
            </ClayButton>
          </div>
          {selectedZoneId ? (
            <div className="clay-chip !w-full justify-between !text-xs">
              <span>
                Zona: <strong>{selectedZoneId}</strong>
              </span>
              <button type="button" className="font-extrabold text-clay-accent-dark" onClick={onClearZone}>
                Batal
              </button>
            </div>
          ) : null}
        </div>
      </ClayCard>

      <ClayModal
        open={confirmAll}
        title="Semprot seluruh lahan?"
        onClose={() => setConfirmAll(false)}
        onConfirm={() => {
          sprayMutation.mutate({ manual: true, durationSec: 3 })
          setConfirmAll(false)
        }}
        loading={sprayMutation.isPending}
      >
        Sprinkler tengah akan aktif beberapa detik — mencakup seluruh lahan (pengusir + siram).
      </ClayModal>
    </>
  )
}

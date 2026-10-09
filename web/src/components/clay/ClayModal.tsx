import type { ReactNode } from 'react'
import { ClayButton } from './ClayButton'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
}

export function ClayModal({
  open,
  title,
  children,
  confirmLabel = 'Ya',
  cancelLabel = 'Batal',
  onConfirm,
  onClose,
  loading,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#24382c]/30 p-4 backdrop-blur-[6px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clay-modal-title"
      onClick={onClose}
    >
      <div
        className="clay-surface-lg w-full max-w-md p-6 md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(180deg, #a8e0ff 0%, #7ec8e8 100%)',
            boxShadow: 'var(--shadow-clay)',
          }}
          aria-hidden
        >
          <span
            className="block h-5 w-5 rounded-full bg-white/70"
            style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.9)' }}
          />
        </div>
        <h3 id="clay-modal-title" className="text-center text-xl font-extrabold text-clay-text">
          {title}
        </h3>
        <div className="mt-3 text-center text-sm leading-relaxed text-clay-muted">{children}</div>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <ClayButton variant="secondary" className="min-w-[8rem]" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </ClayButton>
          <ClayButton variant="primary" className="min-w-[8rem]" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </ClayButton>
        </div>
      </div>
    </div>
  )
}

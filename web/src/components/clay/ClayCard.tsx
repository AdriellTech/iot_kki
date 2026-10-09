import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}

export function ClayCard({ children, className = '', title, action }: Props) {
  return (
    <section className={`clay-surface-lg p-5 md:p-6 ${className}`}>
      {(title || action) && (
        <header className="mb-2.5 flex shrink-0 flex-wrap items-center justify-between gap-2">
          {title ? (
            <h2 className="text-[0.65rem] font-extrabold tracking-[0.14em] text-clay-muted uppercase">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

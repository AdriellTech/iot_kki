type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}

export function ClayToggle({ checked, onChange, label, description, disabled }: Props) {
  return (
    <label className="clay-inset flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5">
      <span>
        <span className="block text-sm font-bold text-clay-text">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-clay-muted">{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-9 w-[3.75rem] shrink-0 rounded-full border border-white/40 transition-colors duration-200 disabled:opacity-50 ${
          checked ? 'bg-clay-accent' : 'bg-clay-surface'
        }`}
        style={{
          boxShadow: checked
            ? 'inset 4px 4px 8px rgba(40,120,75,0.28), inset -3px -3px 8px rgba(255,255,255,0.35)'
            : 'var(--shadow-clay-inset)',
        }}
      >
        <span
          className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-clay-surface transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
          style={{ boxShadow: 'var(--shadow-clay)' }}
        />
      </button>
    </label>
  )
}

export type MediaMode = 'field' | 'video'

const labels: Record<MediaMode, string> = {
  field: 'Lahan 3D',
  video: 'Video',
}

type Props = {
  value: MediaMode
  onChange: (v: MediaMode) => void
  className?: string
}

/** Pilih Lahan 3D ATAU stream video (satu aktif — lebih ringan) */
export function MediaSwitcher({ value, onChange, className = '' }: Props) {
  return (
    <div className={`clay-nav-pill flex flex-wrap gap-1 ${className}`}>
      {(Object.keys(labels) as MediaMode[]).map((key) => (
        <button
          key={key}
          type="button"
          className={`clay-nav-item ${value === key ? 'clay-nav-item-active' : 'clay-nav-item-idle'}`}
          onClick={() => onChange(key)}
        >
          {labels[key]}
        </button>
      ))}
    </div>
  )
}

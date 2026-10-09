import type { CameraViewPreset } from '../../config/field'

const labels: Record<CameraViewPreset, string> = {
  isometric: 'Isometric',
  top: 'Atas',
  side: 'Samping',
}

type Props = {
  value: CameraViewPreset
  onChange: (v: CameraViewPreset) => void
}

export function ViewSwitcher({ value, onChange }: Props) {
  return (
    <div className="clay-nav-pill flex flex-wrap gap-1">
      {(Object.keys(labels) as CameraViewPreset[]).map((key) => (
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

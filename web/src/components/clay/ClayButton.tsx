import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'clay-btn-primary',
  secondary: 'clay-btn-secondary',
  danger: 'clay-btn-danger',
  ghost: 'clay-btn-ghost',
}

export function ClayButton({
  variant = 'secondary',
  className = '',
  children,
  loading,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`clay-btn ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Memproses…' : children}
    </button>
  )
}

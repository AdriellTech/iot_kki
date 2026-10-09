import { useEffect, useState } from 'react'

/** true pada viewport ≥ 1024px (Tailwind lg) */
export function useIsDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setDesktop(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return desktop
}

import { useMemo } from 'react'
import * as THREE from 'three'

/** Shared toon materials — avoids allocating one material per mesh */
const cache = new Map<string, THREE.MeshToonMaterial>()

export function getClayMaterial(color: string, opacity = 1): THREE.MeshToonMaterial {
  const key = `${color}:${opacity}`
  let mat = cache.get(key)
  if (!mat) {
    mat = new THREE.MeshToonMaterial({
      color,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity >= 1,
    })
    cache.set(key, mat)
  }
  return mat
}

export function ClayMat({ color, opacity = 1 }: { color: string; opacity?: number }) {
  const mat = useMemo(() => getClayMaterial(color, opacity), [color, opacity])
  return <primitive object={mat} attach="material" dispose={null} />
}

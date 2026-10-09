import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Object3D } from 'three'
import { ClayMat } from './ClayMaterials'
import { FIELD_SIZE_M } from '../../config/field'

type BirdProps = {
  active: boolean
  zoneId: string | null
  zonePosition: { x: number; z: number } | null
  fleeing: boolean
}

/** Satu burung clay — 1 useFrame */
export function ClayBirdFlock({ active, zonePosition, fleeing }: BirdProps) {
  const bird = useRef<Group>(null)
  const target = zonePosition ?? { x: 0.6, z: 0.6 }
  const half = FIELD_SIZE_M / 2

  useFrame(({ clock }, delta) => {
    if (!bird.current) return
    if (!active) {
      bird.current.visible = false
      return
    }
    bird.current.visible = true
    const t = clock.elapsedTime

    if (fleeing) {
      const fleeX = target.x + Math.sign(target.x || 1) * (half + (t % 3))
      const fleeZ = target.z + Math.sign(target.z || 1) * (half + (t % 3))
      bird.current.position.x += (fleeX - bird.current.position.x) * Math.min(1, delta * 2.5)
      bird.current.position.z += (fleeZ - bird.current.position.z) * Math.min(1, delta * 2.5)
      bird.current.position.y += delta * 1.8
      bird.current.rotation.y += delta * 3
    } else {
      // hover dekat tepi (bukan di atas sprinkler)
      const cx = target.x + Math.sin(t * 0.8) * 0.25
      const cz = target.z + Math.cos(t * 0.8) * 0.25
      bird.current.position.x += (cx - bird.current.position.x) * Math.min(1, delta * 3)
      bird.current.position.z += (cz - bird.current.position.z) * Math.min(1, delta * 3)
      bird.current.position.y +=
        (1.05 + Math.sin(t * 2) * 0.1 - bird.current.position.y) * Math.min(1, delta * 4)
      bird.current.rotation.y = t * 0.5
    }

    const flap = Math.sin(t * 10) * 0.5
    const wingL = bird.current.getObjectByName('wingL') as Object3D | undefined
    const wingR = bird.current.getObjectByName('wingR') as Object3D | undefined
    if (wingL) wingL.rotation.z = 0.35 + flap
    if (wingR) wingR.rotation.z = -0.35 - flap
  })

  if (!active) return null

  return (
    <group ref={bird} position={[target.x, 1.05, target.z]} scale={0.9}>
      <mesh>
        <sphereGeometry args={[0.11, 7, 7]} />
        <ClayMat color="#6b5b4f" />
      </mesh>
      <mesh position={[0.09, 0.05, 0]}>
        <sphereGeometry args={[0.055, 6, 6]} />
        <ClayMat color="#5a4a40" />
      </mesh>
      <mesh position={[0.15, 0.04, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.016, 0.045, 5]} />
        <ClayMat color="#f5c56b" />
      </mesh>
      <mesh name="wingL" position={[0, 0.02, 0.09]} rotation={[0.2, 0, 0.3]}>
        <sphereGeometry args={[0.065, 5, 4]} />
        <ClayMat color="#7a6a5e" />
      </mesh>
      <mesh name="wingR" position={[0, 0.02, -0.09]} rotation={[-0.2, 0, -0.3]}>
        <sphereGeometry args={[0.065, 5, 4]} />
        <ClayMat color="#7a6a5e" />
      </mesh>
    </group>
  )
}

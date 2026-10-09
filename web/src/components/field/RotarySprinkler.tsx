import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { SPRINKLER_CLEAR_R } from '../../config/field'
import { ClayMat } from './ClayMaterials'
import { WaterDome, WaterJets, WaterPuddle } from './WaterSpray'

const TEAL = '#0f6e72'
const TEAL_LIT = '#1a8a8f'
const BLACK = '#1a1a1a'

type Props = {
  x: number
  z: number
  id: string
  active: boolean
  selected: boolean
  onSelect: (id: string) => void
}

/** Sprinkler + jet air = 1 putaran saja; warna air diperjelas. */
export function RotarySprinkler({ x, z, id, active, selected, onSelect }: Props) {
  const rotor = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!rotor.current || !active) return
    rotor.current.rotation.y += delta * 3.5
  })

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[SPRINKLER_CLEAR_R * 0.92, 24]} />
        <ClayMat color="#cbb892" />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[SPRINKLER_CLEAR_R * 0.72, SPRINKLER_CLEAR_R * 0.92, 24]} />
        <ClayMat color="#b8a878" />
      </mesh>

      {/* base tetap */}
      <group scale={0.85}>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.055, 0.078, 20]} />
          <ClayMat color={selected ? TEAL_LIT : TEAL} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={`spoke-${i}`}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.032,
              0.014,
              Math.sin((i * Math.PI) / 2) * 0.032,
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <boxGeometry args={[0.048, 0.01, 0.012]} />
            <ClayMat color={TEAL} />
          </mesh>
        ))}
        <mesh
          position={[0, 0.04, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(id)
          }}
        >
          <cylinderGeometry args={[0.028, 0.032, 0.055, 10]} />
          <ClayMat color={selected ? TEAL_LIT : TEAL} />
        </mesh>
        <mesh position={[0.045, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.014, 0.028, 8]} />
          <ClayMat color={BLACK} />
        </mesh>
        <mesh position={[0.062, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.016, 6]} />
          <ClayMat color={BLACK} />
        </mesh>
      </group>

      {/* 1 rotor: kepala + lengan + jet air */}
      <group ref={rotor}>
        <group scale={0.85} position={[0, 0.078, 0]}>
          <mesh>
            <cylinderGeometry args={[0.022, 0.024, 0.028, 10]} />
            <ClayMat color={active ? TEAL_LIT : TEAL} />
          </mesh>
          {[0, 1, 2].map((i) => {
            const a = (i * Math.PI * 2) / 3
            return (
              <group key={`arm-${i}`} rotation={[0, a, 0]}>
                <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.007, 0.008, 0.07, 6]} />
                  <ClayMat color={TEAL} />
                </mesh>
                <mesh position={[0.095, 0.004, 0]} rotation={[0, 0, 0.35]}>
                  <boxGeometry args={[0.022, 0.016, 0.014]} />
                  <ClayMat color={BLACK} />
                </mesh>
              </group>
            )
          })}
        </group>
        {active ? <WaterJets /> : null}
      </group>

      {selected ? (
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.11, 20]} />
          <meshBasicMaterial color="#6bc48a" transparent opacity={0.5} />
        </mesh>
      ) : null}

      {/* Kubah lingkup di atas; jet putar di bawahnya */}
      {active ? (
        <>
          <WaterDome />
          <WaterPuddle />
        </>
      ) : null}
    </group>
  )
}

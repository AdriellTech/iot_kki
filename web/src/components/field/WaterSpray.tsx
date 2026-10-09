import * as THREE from 'three'
import { FIELD_SIZE_M } from '../../config/field'

const COVER_R = FIELD_SIZE_M * 0.46
const WATER = '#2eb0ff'
const WATER_SOFT = '#6ecfff'
const DOME = '#5ec4ff'

/**
 * 3 semprotan diagonal (seperti sebelumnya) — putar bersama rotor.
 * Kubah lingkup di atas (WaterDome, terpisah).
 */
export function WaterJets() {
  const nozzleY = 0.09

  return (
    <group position={[0, nozzleY, 0]}>
      {[0, 1, 2].map((i) => {
        const a = (i * Math.PI * 2) / 3
        const len = COVER_R * 0.9
        return (
          <group key={i} rotation={[0, a, 0]}>
            {/* aliran diagonal keluar dari nozzle */}
            <mesh position={[len * 0.48, 0.12, 0]} rotation={[0, 0, -0.42]}>
              <cylinderGeometry args={[0.018, 0.055, len, 6]} />
              <meshBasicMaterial color={WATER} transparent opacity={0.82} depthWrite={false} />
            </mesh>
            <mesh position={[len * 0.85, -0.02, 0]} rotation={[0, 0, -0.7]}>
              <cylinderGeometry args={[0.012, 0.04, len * 0.28, 5]} />
              <meshBasicMaterial color={WATER_SOFT} transparent opacity={0.7} depthWrite={false} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Kubah / lingkup air di atas semprotan diagonal */
export function WaterDome() {
  return (
    <mesh position={[0, 0.12, 0]} scale={[1, 0.52, 1]}>
      <sphereGeometry args={[COVER_R * 0.95, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial
        color={DOME}
        transparent
        opacity={0.28}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/** Jejak basah ringan di tanah */
export function WaterPuddle() {
  return (
    <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[COVER_R * 0.7, 24]} />
      <meshBasicMaterial color="#1a9ae0" transparent opacity={0.18} depthWrite={false} />
    </mesh>
  )
}

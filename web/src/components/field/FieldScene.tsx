import { memo, useLayoutEffect, useMemo } from 'react'
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { SprinklerStatus } from '../../api/types'
import { CAMERA_MARKER, FIELD_SIZE_M, SPRINKLER_ZONES } from '../../config/field'
import type { CameraViewPreset } from '../../config/field'
import { ClayBirdFlock } from './ClayBird'
import { ClayMat } from './ClayMaterials'
import { RotarySprinkler } from './RotarySprinkler'
import { SoyField } from './SoyPlant'

type Props = {
  view: CameraViewPreset
  sprinklers: SprinklerStatus[]
  selectedZoneId: string | null
  onSelectZone: (id: string | null) => void
  highlightZoneId: string | null
  birdActive: boolean
  birdZoneId: string | null
  pumpOn: boolean
}

function LookAtCenter({ view }: { view: CameraViewPreset }) {
  const { camera } = useThree()
  useLayoutEffect(() => {
    camera.lookAt(0, 0.2, 0)
    camera.updateProjectionMatrix()
  }, [camera, view])
  return null
}

function CameraMarker({ scanning }: { scanning: boolean }) {
  return (
    <group position={[CAMERA_MARKER.x, 0, CAMERA_MARKER.z]}>
      {/* pad di luar lahan */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 14]} />
        <ClayMat color="#e8dcc0" />
      </mesh>
      {/* tiang */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
        <ClayMat color="#c8d0c4" />
      </mesh>
      {/* body kamera menghadap ke lahan (+Z) */}
      <mesh position={[0, 0.72, 0.02]}>
        <boxGeometry args={[0.28, 0.2, 0.18]} />
        <ClayMat color={scanning ? '#f5c56b' : '#e8d49a'} />
      </mesh>
      <mesh position={[0, 0.72, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.12, 10]} />
        <ClayMat color="#2d4035" />
      </mesh>
      {scanning ? (
        <mesh position={[0, 0.72, 0.22]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <ClayMat color="#e88a8a" opacity={0.9} />
        </mesh>
      ) : null}
    </group>
  )
}

function FieldSceneInner({
  view,
  sprinklers,
  selectedZoneId,
  onSelectZone,
  highlightZoneId,
  birdActive,
  birdZoneId,
  pumpOn,
}: Props) {
  const half = FIELD_SIZE_M / 2

  const statusMap = useMemo(() => {
    const m = new Map<string, SprinklerStatus>()
    sprinklers.forEach((s) => m.set(s.id, s))
    return m
  }, [sprinklers])

  // Burung di tepi lahan (bukan di atas sprinkler pusat)
  const birdZonePos = useMemo(() => {
    if (birdZoneId === 'zone-center' || !birdZoneId) {
      return { x: 1.35, z: 1.15 }
    }
    const z = SPRINKLER_ZONES.find((s) => s.id === birdZoneId)
    return z ? { x: z.x || 1.2, z: z.z || 1.0 } : { x: 1.35, z: 1.15 }
  }, [birdZoneId])

  const anySprayActive = sprinklers.some((s) => s.active) || pumpOn

  return (
    <>
      <color attach="background" args={['#dfe9e3']} />
      <fog attach="fog" args={['#dfe9e3', 16, 30]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 3]} intensity={0.9} />

      {view === 'top' ? (
        <OrthographicCamera makeDefault position={[0, 12, 0.01]} zoom={55} near={0.1} far={100} />
      ) : null}
      {view === 'isometric' ? (
        <PerspectiveCamera makeDefault position={[6, 7, 6]} fov={42} near={0.1} far={100} />
      ) : null}
      {view === 'side' ? (
        <PerspectiveCamera makeDefault position={[0, 3.2, 8]} fov={40} near={0.1} far={100} />
      ) : null}

      <LookAtCenter view={view} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[FIELD_SIZE_M + 0.6, FIELD_SIZE_M + 0.6]} />
        <ClayMat color="#c4a882" />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={() => onSelectZone(null)}
      >
        <planeGeometry args={[FIELD_SIZE_M, FIELD_SIZE_M]} />
        <ClayMat color="#d4c4a0" />
      </mesh>

      {(
        [
          [0, half + 0.05, FIELD_SIZE_M + 0.2, 0.12],
          [0, -half - 0.05, FIELD_SIZE_M + 0.2, 0.12],
          [half + 0.05, 0, 0.12, FIELD_SIZE_M],
          [-half - 0.05, 0, 0.12, FIELD_SIZE_M],
        ] as const
      ).map(([x, z, w, d], i) => (
        <mesh key={`berm-${i}`} position={[x, 0.04, z]}>
          <boxGeometry args={[w, 0.08, d]} />
          <ClayMat color="#a3b89a" />
        </mesh>
      ))}

      <SoyField />

      {SPRINKLER_ZONES.map((zone) => {
        const st = statusMap.get(zone.id)
        const active = st?.active ?? false
        const selected = selectedZoneId === zone.id
        return (
          <RotarySprinkler
            key={zone.id}
            id={zone.id}
            x={zone.x}
            z={zone.z}
            active={active}
            selected={selected || highlightZoneId === zone.id}
            onSelect={onSelectZone}
          />
        )
      })}

      <CameraMarker scanning={birdActive} />

      <ClayBirdFlock
        active={birdActive}
        zoneId={birdZoneId}
        zonePosition={birdZonePos}
        fleeing={anySprayActive && birdActive}
      />

      {[
        [-half, -half],
        [half, -half],
        [-half, half],
        [half, half],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.16, 0.44, 0.16]} />
            <ClayMat color="#e8f0ea" />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <ClayMat color="#6bc48a" />
          </mesh>
        </group>
      ))}
    </>
  )
}

export const FieldScene = memo(FieldSceneInner)

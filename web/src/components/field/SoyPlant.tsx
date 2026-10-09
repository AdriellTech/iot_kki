import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { FIELD_SIZE_M, SPRINKLER_CLEAR_R, VISUAL_PLANT_SIDE } from '../../config/field'
import { getClayMaterial } from './ClayMaterials'

const _obj = new THREE.Object3D()

/** 2 tingkat × 3 daun trifoliate = ciri khas kedelai stylized */
const TIERS = 2
const LEAFLETS = 3
const LEAVES_PER_PLANT = TIERS * LEAFLETS

/**
 * Ladang kedelai stylized — mirip referensi (semak, daun oval, rapat),
 * tetap rapi & ringan lewat InstancedMesh.
 */
export function SoyField() {
  const stemRef = useRef<THREE.InstancedMesh>(null)
  const leafARef = useRef<THREE.InstancedMesh>(null)
  const leafBRef = useRef<THREE.InstancedMesh>(null)

  const plantCount = VISUAL_PLANT_SIDE * VISUAL_PLANT_SIDE
  const leafSlotCount = plantCount * LEAVES_PER_PLANT

  const positions = useMemo(() => {
    const items: { x: number; z: number; scale: number; yaw: number }[] = []
    const margin = 0.22
    const usable = FIELD_SIZE_M - margin * 2
    const step = usable / (VISUAL_PLANT_SIDE - 1)
    const origin = -usable / 2
    for (let row = 0; row < VISUAL_PLANT_SIDE; row++) {
      for (let col = 0; col < VISUAL_PLANT_SIDE; col++) {
        const n = row * VISUAL_PLANT_SIDE + col
        let x = origin + col * step
        let z = origin + row * step
        // jitter sangat kecil — tetap terasa rapi
        x += ((n * 17) % 5) * 0.004 - 0.008
        z += ((n * 13) % 5) * 0.004 - 0.008
        // kosongkan lingkaran tengah — sprinkler tidak tertutup daun
        if (Math.hypot(x, z) < SPRINKLER_CLEAR_R) continue
        items.push({
          x,
          z,
          scale: 0.92 + ((n * 7) % 6) * 0.028,
          yaw: ((n * 37) % 360) * (Math.PI / 180),
        })
      }
    }
    return items
  }, [])

  const stemMat = useMemo(() => getClayMaterial('#3a553c'), [])
  const leafDark = useMemo(() => getClayMaterial('#3f6f45'), [])
  const leafMid = useMemo(() => getClayMaterial('#5a8f58'), [])

  useLayoutEffect(() => {
    const stems = stemRef.current
    const leafA = leafARef.current
    const leafB = leafBRef.current
    if (!stems || !leafA || !leafB) return

    let aIdx = 0
    let bIdx = 0

    for (let i = 0; i < positions.length; i++) {
      const p = positions[i]!
      const s = p.scale

      // batang tipis sedikit condong
      _obj.position.set(p.x, 0.3 * s, p.z)
      _obj.rotation.set(0.04, p.yaw, ((i % 3) - 1) * 0.03)
      _obj.scale.set(s * 0.65, s * 1.2, s * 0.65)
      _obj.updateMatrix()
      stems.setMatrixAt(i, _obj.matrix)

      for (let tier = 0; tier < TIERS; tier++) {
        const tierY = (0.28 + tier * 0.22) * s
        const reach = (0.09 + tier * 0.02) * s
        const leafletSize = (1.05 - tier * 0.08) * s
        const tierTwist = p.yaw + tier * 0.35

        for (let L = 0; L < LEAFLETS; L++) {
          const ang = tierTwist + (L * Math.PI * 2) / LEAFLETS
          // daun oval pipih, sedikit menghadap keluar & turun (trifoliate)
          _obj.position.set(
            p.x + Math.cos(ang) * reach,
            tierY + Math.sin(L + tier) * 0.012,
            p.z + Math.sin(ang) * reach,
          )
          _obj.rotation.set(0.65, ang + Math.PI / 2, 0.15)
          // skala oval: panjang > lebar > tebal
          _obj.scale.set(leafletSize * 1.15, leafletSize * 0.32, leafletSize * 0.72)
          _obj.updateMatrix()

          // selang-seling material biar kanopi tidak flat
          if ((i + tier + L) % 2 === 0) {
            leafA.setMatrixAt(aIdx++, _obj.matrix)
          } else {
            leafB.setMatrixAt(bIdx++, _obj.matrix)
          }
        }
      }
    }

    stems.instanceMatrix.needsUpdate = true
    leafA.instanceMatrix.needsUpdate = true
    leafB.instanceMatrix.needsUpdate = true
    stems.count = positions.length
    leafA.count = aIdx
    leafB.count = bIdx
  }, [positions])

  return (
    <group>
      {/* bayangan lembut di bawah kanopi */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[FIELD_SIZE_M * 0.92, FIELD_SIZE_M * 0.92]} />
        <meshBasicMaterial color="#2a3a28" transparent opacity={0.14} depthWrite={false} />
      </mesh>

      <instancedMesh ref={stemRef} args={[undefined, undefined, plantCount]}>
        <capsuleGeometry args={[0.016, 0.36, 2, 5]} />
        <primitive object={stemMat} attach="material" dispose={null} />
      </instancedMesh>

      <instancedMesh ref={leafARef} args={[undefined, undefined, leafSlotCount]}>
        <sphereGeometry args={[0.11, 6, 5]} />
        <primitive object={leafDark} attach="material" dispose={null} />
      </instancedMesh>

      <instancedMesh ref={leafBRef} args={[undefined, undefined, leafSlotCount]}>
        <sphereGeometry args={[0.11, 6, 5]} />
        <primitive object={leafMid} attach="material" dispose={null} />
      </instancedMesh>
    </group>
  )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/* ========================================
   Dynamic Lighting Rig — Luxury showroom
   lighting with moving spotlights and
   ambient illumination
   ======================================== */

export default function LightingRig({ scrollProgress = 0 }) {
  const spotLight1Ref = useRef()
  const spotLight2Ref = useRef()
  const pointLight1Ref = useRef()
  const pointLight2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Spotlight 1 — orbits slowly, gold tint
    if (spotLight1Ref.current) {
      spotLight1Ref.current.position.x = Math.sin(t * 0.3) * 8
      spotLight1Ref.current.position.z = Math.cos(t * 0.3) * 6
      spotLight1Ref.current.position.y = 6 + Math.sin(t * 0.2) * 2
      spotLight1Ref.current.intensity = 1.5 + Math.sin(t * 0.5) * 0.5
    }

    // Spotlight 2 — counter-orbit, cool blue tint
    if (spotLight2Ref.current) {
      spotLight2Ref.current.position.x = Math.cos(t * 0.25) * 7
      spotLight2Ref.current.position.z = Math.sin(t * 0.25) * 5
      spotLight2Ref.current.position.y = 5 + Math.cos(t * 0.3) * 1.5
      spotLight2Ref.current.intensity = 1.0 + Math.cos(t * 0.4) * 0.3
    }

    // Point lights — accent lighting that reacts to scroll
    if (pointLight1Ref.current) {
      pointLight1Ref.current.position.y = Math.sin(t * 0.6) * 4
      pointLight1Ref.current.intensity = 0.8 + scrollProgress * 0.5
    }

    if (pointLight2Ref.current) {
      pointLight2Ref.current.position.x = Math.cos(t * 0.4) * 6
      pointLight2Ref.current.position.y = -2 + Math.sin(t * 0.5) * 3
      pointLight2Ref.current.intensity = 0.5 + Math.sin(t * 0.7) * 0.3
    }
  })

  return (
    <>
      {/* Ambient base light — very subtle */}
      <ambientLight intensity={0.08} color="#a0a0c0" />

      {/* Hemisphere light — subtle sky/ground separation */}
      <hemisphereLight
        skyColor="#1a1a3e"
        groundColor="#0a0a0f"
        intensity={0.15}
      />

      {/* Main spotlight — warm gold */}
      <spotLight
        ref={spotLight1Ref}
        position={[5, 8, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#d4af37"
        castShadow={false}
        distance={25}
        decay={2}
      />

      {/* Secondary spotlight — cool blue */}
      <spotLight
        ref={spotLight2Ref}
        position={[-5, 6, -3]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.0}
        color="#4a6fa5"
        castShadow={false}
        distance={20}
        decay={2}
      />

      {/* Accent point light — purple haze */}
      <pointLight
        ref={pointLight1Ref}
        position={[-4, 2, -6]}
        intensity={0.8}
        color="#7c3aed"
        distance={15}
        decay={2}
      />

      {/* Moving accent light — rose */}
      <pointLight
        ref={pointLight2Ref}
        position={[3, -2, -4]}
        intensity={0.5}
        color="#e11d48"
        distance={12}
        decay={2}
      />

      {/* Rim light from behind — creates depth */}
      <directionalLight
        position={[0, 3, -10]}
        intensity={0.3}
        color="#1e40af"
      />
    </>
  )
}

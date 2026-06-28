import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Fog } from 'three'

/* ========================================
   Environment3D — Fog, background, and
   atmospheric effects for the 3D scene
   ======================================== */

function AnimatedFog() {
  useFrame((state) => {
    if (!state.scene.fog) {
      state.scene.fog = new Fog('#050508', 8, 35)
    }
    // Subtly animate fog density
    const t = state.clock.elapsedTime
    state.scene.fog.near = 8 + Math.sin(t * 0.2) * 2
    state.scene.fog.far = 35 + Math.sin(t * 0.15) * 5
  })

  return null
}

// Light beams / volumetric light rays
function LightBeam({ position, rotation, color, opacity, speed }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    meshRef.current.material.opacity = opacity * (0.3 + Math.sin(t) * 0.3)
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.2) * 0.05
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[0.3, 15]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={2}
        depthWrite={false}
      />
    </mesh>
  )
}

// Ground reflection plane
function GroundReflection() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.material.opacity = 0.03 + Math.sin(t * 0.3) * 0.01
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#0a0a1a"
        transparent
        opacity={0.04}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  )
}

export default function Environment3D() {
  return (
    <>
      <AnimatedFog />

      {/* Background color */}
      <color attach="background" args={['#050508']} />

      {/* Light beams for volumetric effect */}
      <LightBeam
        position={[-6, 4, -10]}
        rotation={[0, 0, 0.3]}
        color="#d4af37"
        opacity={0.04}
        speed={0.3}
      />
      <LightBeam
        position={[4, 5, -12]}
        rotation={[0, 0, -0.2]}
        color="#4a6fa5"
        opacity={0.03}
        speed={0.25}
      />
      <LightBeam
        position={[8, 3, -8]}
        rotation={[0, 0, 0.15]}
        color="#7c3aed"
        opacity={0.025}
        speed={0.35}
      />
      <LightBeam
        position={[-3, 6, -15]}
        rotation={[0, 0, -0.1]}
        color="#d4af37"
        opacity={0.03}
        speed={0.2}
      />

      {/* Ground reflection */}
      <GroundReflection />
    </>
  )
}

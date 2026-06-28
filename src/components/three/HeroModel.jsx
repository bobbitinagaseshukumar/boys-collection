import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ========================================
   HeroModel — Large 3D rotating shirt for
   the hero section with luxury materials
   and interactive mouse tracking
   ======================================== */

export default function HeroModel({ mousePosition = { x: 0, y: 0 } }) {
  const groupRef = useRef()
  const materialRef = useRef()

  // Premium shirt material color
  const shirtColor = useMemo(() => new THREE.Color('#1a1a2e'), [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Slow auto-rotation
    groupRef.current.rotation.y = t * 0.15

    // Mouse influence on rotation (subtle)
    const targetRotX = mousePosition.y * 0.15
    const targetRotZ = mousePosition.x * 0.08
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05
    groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * 0.05

    // Breathing scale
    const breathe = 1 + Math.sin(t * 0.8) * 0.02
    groupRef.current.scale.setScalar(breathe)

    // Subtle float
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15
  })

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Main torso */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.5, 0.45, 4, 4, 2]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color={shirtColor}
          roughness={0.35}
          metalness={0.15}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left shoulder + sleeve */}
      <group position={[-0.8, 0.35, 0]} rotation={[0, 0, 0.35]}>
        {/* Shoulder */}
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.4, 0.4]} />
          <meshPhysicalMaterial color={shirtColor} roughness={0.35} metalness={0.15} clearcoat={0.3} />
        </mesh>
        {/* Sleeve */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <boxGeometry args={[0.4, 0.7, 0.35]} />
          <meshPhysicalMaterial color={shirtColor} roughness={0.35} metalness={0.15} clearcoat={0.3} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[0.42, 0.1, 0.37]} />
          <meshPhysicalMaterial color="#d4af37" roughness={0.2} metalness={0.5} clearcoat={0.5} />
        </mesh>
      </group>

      {/* Right shoulder + sleeve */}
      <group position={[0.8, 0.35, 0]} rotation={[0, 0, -0.35]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.4, 0.4]} />
          <meshPhysicalMaterial color={shirtColor} roughness={0.35} metalness={0.15} clearcoat={0.3} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <boxGeometry args={[0.4, 0.7, 0.35]} />
          <meshPhysicalMaterial color={shirtColor} roughness={0.35} metalness={0.15} clearcoat={0.3} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[0.42, 0.1, 0.37]} />
          <meshPhysicalMaterial color="#d4af37" roughness={0.2} metalness={0.5} clearcoat={0.5} />
        </mesh>
      </group>

      {/* Collar */}
      <group position={[0, 0.85, 0]}>
        {/* Left collar flap */}
        <mesh position={[-0.2, 0, 0.15]} rotation={[0.3, 0.2, -0.15]}>
          <boxGeometry args={[0.35, 0.25, 0.05]} />
          <meshPhysicalMaterial color={shirtColor} roughness={0.3} metalness={0.2} clearcoat={0.4} />
        </mesh>
        {/* Right collar flap */}
        <mesh position={[0.2, 0, 0.15]} rotation={[0.3, -0.2, 0.15]}>
          <boxGeometry args={[0.35, 0.25, 0.05]} />
          <meshPhysicalMaterial color={shirtColor} roughness={0.3} metalness={0.2} clearcoat={0.4} />
        </mesh>
      </group>

      {/* Button line */}
      {[0.5, 0.2, -0.1, -0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0.24]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshPhysicalMaterial
            color="#d4af37"
            roughness={0.15}
            metalness={0.7}
            clearcoat={0.8}
            emissive="#d4af37"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Bottom hem */}
      <mesh position={[0, -0.78, 0]}>
        <boxGeometry args={[1.25, 0.06, 0.47]} />
        <meshPhysicalMaterial color={shirtColor} roughness={0.3} metalness={0.2} clearcoat={0.3} />
      </mesh>

      {/* Pocket */}
      <mesh position={[-0.3, 0.15, 0.24]}>
        <boxGeometry args={[0.25, 0.22, 0.02]} />
        <meshPhysicalMaterial
          color={shirtColor}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.2}
        />
      </mesh>

      {/* Brand label on pocket */}
      <mesh position={[-0.3, 0.18, 0.26]}>
        <boxGeometry args={[0.12, 0.06, 0.005]} />
        <meshPhysicalMaterial
          color="#d4af37"
          roughness={0.1}
          metalness={0.8}
          clearcoat={1.0}
          emissive="#d4af37"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  )
}

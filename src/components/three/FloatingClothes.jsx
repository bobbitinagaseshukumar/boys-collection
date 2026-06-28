import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ========================================
   Floating Clothes — Procedural 3D clothing
   shapes at varying depths creating the
   luxury fashion universe background
   ======================================== */

// Shirt-like geometry (box with slight modifications)
function ShirtShape({ position, rotation, scale, speed, color, opacity }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed

    meshRef.current.position.y = initialPos[1] + Math.sin(t + phaseOffset) * 0.8
    meshRef.current.position.x = initialPos[0] + Math.sin(t * 0.3 + phaseOffset) * 0.3
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.15
    meshRef.current.rotation.y = rotation[1] + t * 0.2
    meshRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.1
    meshRef.current.scale.setScalar(scale + Math.sin(t * 0.8 + phaseOffset) * 0.05)
  })

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Torso */}
      <mesh>
        <boxGeometry args={[0.8, 1.0, 0.3]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.4}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
      {/* Left sleeve */}
      <mesh position={[-0.55, 0.2, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.35, 0.6, 0.25]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Right sleeve */}
      <mesh position={[0.55, 0.2, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.35, 0.6, 0.25]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.55, 0.05]}>
        <torusGeometry args={[0.15, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.9} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  )
}

// Pants-like geometry
function PantsShape({ position, rotation, scale, speed, color, opacity }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    meshRef.current.position.y = initialPos[1] + Math.cos(t + phaseOffset) * 0.6
    meshRef.current.position.x = initialPos[0] + Math.cos(t * 0.4 + phaseOffset) * 0.4
    meshRef.current.rotation.y = rotation[1] + t * 0.15
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.08
    meshRef.current.scale.setScalar(scale + Math.sin(t * 0.6 + phaseOffset) * 0.04)
  })

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Waist */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.25, 0.25]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.18, -0.3, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.25]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.18, -0.3, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.25]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.5} metalness={0.05} />
      </mesh>
    </group>
  )
}

// Hoodie-like geometry
function HoodieShape({ position, rotation, scale, speed, color, opacity }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    meshRef.current.position.y = initialPos[1] + Math.sin(t * 0.7 + phaseOffset) * 0.7
    meshRef.current.position.z = initialPos[2] + Math.sin(t * 0.2 + phaseOffset) * 0.3
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.12
    meshRef.current.rotation.y = rotation[1] + t * 0.18
    meshRef.current.scale.setScalar(scale + Math.cos(t * 0.5 + phaseOffset) * 0.06)
  })

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.9, 1.1, 0.35]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 0.7, -0.1]}>
        <sphereGeometry args={[0.35, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.6} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      {/* Left sleeve */}
      <mesh position={[-0.6, 0.1, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.35, 0.7, 0.3]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Right sleeve */}
      <mesh position={[0.6, 0.1, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.35, 0.7, 0.3]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.6} metalness={0.05} />
      </mesh>
    </group>
  )
}

// Shoe-like geometry
function ShoeShape({ position, rotation, scale, speed, color, opacity }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    meshRef.current.position.y = initialPos[1] + Math.sin(t * 0.9 + phaseOffset) * 0.5
    meshRef.current.position.x = initialPos[0] + Math.cos(t * 0.3 + phaseOffset) * 0.5
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.4) * 0.2
    meshRef.current.rotation.y = rotation[1] + t * 0.25
    meshRef.current.scale.setScalar(scale + Math.sin(t * 0.7 + phaseOffset) * 0.03)
  })

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Sole */}
      <mesh position={[0, -0.08, 0.1]}>
        <boxGeometry args={[0.4, 0.1, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={opacity} roughness={0.8} />
      </mesh>
      {/* Upper */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.36, 0.22, 0.7]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Toe cap */}
      <mesh position={[0, 0.02, 0.35]}>
        <sphereGeometry args={[0.18, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  )
}

// Shopping bag shape
function BagShape({ position, rotation, scale, speed, color, opacity }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    meshRef.current.position.y = initialPos[1] + Math.sin(t * 0.6 + phaseOffset) * 0.9
    meshRef.current.position.x = initialPos[0] + Math.sin(t * 0.25 + phaseOffset) * 0.3
    meshRef.current.rotation.y = rotation[1] + t * 0.12
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.35) * 0.06
    meshRef.current.scale.setScalar(scale + Math.cos(t * 0.4 + phaseOffset) * 0.05)
  })

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Bag body */}
      <mesh>
        <boxGeometry args={[0.6, 0.7, 0.3]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} metalness={0.15} />
      </mesh>
      {/* Handle left */}
      <mesh position={[-0.15, 0.5, 0]}>
        <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.8} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Handle right */}
      <mesh position={[0.15, 0.5, 0]}>
        <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.8} roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  )
}

// Cap/hat shape
function CapShape({ position, rotation, scale, speed, color, opacity }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    meshRef.current.position.y = initialPos[1] + Math.cos(t * 0.8 + phaseOffset) * 0.6
    meshRef.current.position.z = initialPos[2] + Math.sin(t * 0.3 + phaseOffset) * 0.4
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.15
    meshRef.current.rotation.y = rotation[1] + t * 0.2
    meshRef.current.scale.setScalar(scale + Math.sin(t * 0.9 + phaseOffset) * 0.04)
  })

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Crown */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Brim */}
      <mesh position={[0, -0.02, 0.12]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.35, 0.03, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  )
}

// Generate deterministic clothing objects
const SHAPE_COMPONENTS = [ShirtShape, PantsShape, HoodieShape, ShoeShape, BagShape, CapShape]

const COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#2c2c3e',
  '#3a1a3e', '#1a3a2e', '#2e2e1a', '#3e2a1a',
  '#252540', '#1e1e35', '#2d1b4e', '#1b2d3e',
]

function generateClothingItems(count) {
  const items = []
  const goldenRatio = (1 + Math.sqrt(5)) / 2

  for (let i = 0; i < count; i++) {
    const angle = i * goldenRatio * Math.PI * 2
    const radius = 3 + (i / count) * 15
    const depth = -5 + (i % 5) * 3

    items.push({
      id: i,
      ShapeComponent: SHAPE_COMPONENTS[i % SHAPE_COMPONENTS.length],
      position: [
        Math.cos(angle) * radius,
        (Math.sin(i * 1.7) * 6) - 2,
        depth + Math.sin(i * 0.8) * 3,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 0.5,
      ],
      scale: 0.3 + (i % 4) * 0.15,
      speed: 0.2 + Math.random() * 0.5,
      color: COLORS[i % COLORS.length],
      opacity: 0.15 + (depth + 5) / 15 * 0.25,
    })
  }
  return items
}

export default function FloatingClothes({ count = 30 }) {
  const items = useMemo(() => generateClothingItems(count), [count])

  return (
    <group>
      {items.map((item) => {
        const { ShapeComponent, id, ...props } = item
        return <ShapeComponent key={id} {...props} />
      })}
    </group>
  )
}

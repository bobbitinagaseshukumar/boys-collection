import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ========================================
   Particles System — Ambient floating
   particles creating atmosphere and depth
   ======================================== */

function Particle({ position, size, speed, color, opacity }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const driftX = useMemo(() => (Math.random() - 0.5) * 0.3, [])
  const driftZ = useMemo(() => (Math.random() - 0.5) * 0.2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed

    meshRef.current.position.y = initialPos[1] + Math.sin(t + phase) * 1.5
    meshRef.current.position.x = initialPos[0] + Math.sin(t * 0.4 + phase) * driftX * 3
    meshRef.current.position.z = initialPos[2] + Math.cos(t * 0.3 + phase) * driftZ * 2

    // Breathing scale
    const breathe = 1 + Math.sin(t * 1.5 + phase) * 0.3
    meshRef.current.scale.setScalar(breathe)

    // Pulsing opacity via material
    if (meshRef.current.material) {
      meshRef.current.material.opacity = opacity * (0.5 + Math.sin(t * 2 + phase) * 0.5)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// Dust-like particle
function DustParticle({ position, speed }) {
  const meshRef = useRef()
  const initialPos = useMemo(() => [...position], [position])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed

    meshRef.current.position.y = initialPos[1] + t * 0.1 % 20 - 10
    meshRef.current.position.x = initialPos[0] + Math.sin(t * 0.5 + phase) * 0.5
    meshRef.current.position.z = initialPos[2] + Math.cos(t * 0.3 + phase) * 0.3

    // Reset when too high
    if (meshRef.current.position.y > 10) {
      meshRef.current.position.y = -10
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.015, 4, 4]} />
      <meshBasicMaterial
        color="#d4af37"
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function generateParticles(count) {
  const particles = []
  for (let i = 0; i < count; i++) {
    const isGold = Math.random() > 0.7
    particles.push({
      id: i,
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5,
      ],
      size: 0.02 + Math.random() * 0.04,
      speed: 0.15 + Math.random() * 0.4,
      color: isGold ? '#d4af37' : '#6366f1',
      opacity: 0.2 + Math.random() * 0.4,
    })
  }
  return particles
}

function generateDust(count) {
  const dust = []
  for (let i = 0; i < count; i++) {
    dust.push({
      id: `dust-${i}`,
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 3,
      ],
      speed: 0.1 + Math.random() * 0.2,
    })
  }
  return dust
}

export default function Particles({ count = 60, dustCount = 30 }) {
  const particles = useMemo(() => generateParticles(count), [count])
  const dust = useMemo(() => generateDust(dustCount), [dustCount])

  return (
    <group>
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
      {dust.map((d) => (
        <DustParticle key={d.id} {...d} />
      ))}
    </group>
  )
}

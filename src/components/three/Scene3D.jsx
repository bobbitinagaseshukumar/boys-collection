import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import FloatingClothes from './FloatingClothes'
import Particles from './Particles'
import LightingRig from './LightingRig'
import Environment3D from './Environment3D'

/* ========================================
   Scene3D — Main 3D canvas wrapper that
   renders the floating fashion universe
   as a fixed background layer
   ======================================== */

export default function Scene3D({
  scrollProgress = 0,
  performanceLevel = 'high',
  showHeroModel: _showHeroModel = false,
  mousePosition: _mousePosition = { x: 0, y: 0 },
}) {
  // Adjust quality based on device performance
  const config = useMemo(() => {
    switch (performanceLevel) {
      case 'low':
        return { clothes: 8, particles: 15, dust: 8, dpr: [0.5, 1] }
      case 'medium':
        return { clothes: 15, particles: 30, dust: 15, dpr: [0.7, 1.2] }
      case 'high':
        return { clothes: 25, particles: 50, dust: 25, dpr: [1, 1.5] }
      case 'ultra':
        return { clothes: 35, particles: 70, dust: 35, dpr: [1, 2] }
      default:
        return { clothes: 20, particles: 40, dust: 20, dpr: [0.8, 1.5] }
    }
  }, [performanceLevel])

  return (
    <div className="canvas-container">
      <Canvas
        dpr={config.dpr}
        camera={{
          position: [0, 0, 10],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: performanceLevel !== 'low',
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Environment (fog, background, light beams) */}
          <Environment3D />

          {/* Dynamic lighting */}
          <LightingRig scrollProgress={scrollProgress} />

          {/* Floating clothing objects */}
          <FloatingClothes count={config.clothes} />

          {/* Particles and dust */}
          <Particles count={config.particles} dustCount={config.dust} />

          {/* Preload all assets */}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

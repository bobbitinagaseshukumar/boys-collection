import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import Scene3D from '@/components/three/Scene3D'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useDevicePerformance } from '@/hooks/useDevicePerformance'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useIsDesktop } from '@/hooks/useMediaQuery'

export default function MainLayout({ children }) {
  const location = useLocation()
  const { progress } = useScrollProgress()
  const { performanceLevel, enable3D } = useDevicePerformance()
  const mouse = useMousePosition()
  const isDesktop = useIsDesktop()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

// Auth pages don't show header/footer/3D bg
  const isAuthPage = ['/login', '/register', '/otp'].includes(location.pathname)

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>

      {/* 3D Background (not on auth pages for performance) */}
      {enable3D && !isAuthPage && (
        <Scene3D
          scrollProgress={progress}
          performanceLevel={performanceLevel}
          mousePosition={{ x: mouse.normalizedX, y: mouse.normalizedY }}
        />
      )}

      {/* Content */}
      <div className="content-overlay">
        {!isAuthPage && <Header />}
        <MobileMenu />
        <main className="min-h-screen" style={{ paddingTop: isAuthPage ? '0px' : '75px' }}>
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </ReactLenis>
  )
}

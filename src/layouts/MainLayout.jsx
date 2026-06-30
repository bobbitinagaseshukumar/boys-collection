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
import { useSettings } from '@/hooks/useSettings'

export default function MainLayout({ children }) {
  const location = useLocation()
  const { progress } = useScrollProgress()
  const { performanceLevel, enable3D } = useDevicePerformance()
  const mouse = useMousePosition()
  const isDesktop = useIsDesktop()
  const { settings } = useSettings()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Auth pages don't show header/footer/3D bg
  const isAuthPage = ['/login', '/register', '/otp'].includes(location.pathname)

  // Dynamic theme parameters
  const theme = settings.themeConfig || {}
  const primaryColor = theme.primaryColor || '#0a0a0f'
  const accentColor = theme.accentColor || '#d4af37'
  const bgColor = theme.bgColor || '#050508'
  const textColor = theme.textColor || '#ffffff'
  const fontDisplay = theme.fontDisplay || '"Outfit", sans-serif'
  const fontBody = theme.fontBody || '"Inter", sans-serif'
  const borderRadius = theme.borderRadius || '8px'
  const cardBgColor = theme.cardBgColor || '#0a0a0f'

  const dynamicStyles = `
    :root {
      --color-surface-900: ${bgColor};
      --color-surface-800: ${cardBgColor};
      --color-surface-700: ${primaryColor};
      --color-gold-500: ${accentColor};
      --font-display: ${fontDisplay};
      --font-body: ${fontBody};
      --radius-lg: ${borderRadius};
      --radius-xl: calc(${borderRadius} * 1.5);
      --radius-2xl: calc(${borderRadius} * 2);
    }
    body {
      background-color: ${bgColor} !important;
      color: ${textColor} !important;
      font-family: ${fontBody} !important;
    }
  `

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />

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
        <main className="min-h-screen">
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </ReactLenis>
  )
}

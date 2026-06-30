import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'motion/react'
import AnimatedText from '@/components/ui/AnimatedText'
import MagneticButton from '@/components/ui/MagneticButton'
import HeroModel from '@/components/three/HeroModel'
import LightingRig from '@/components/three/LightingRig'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useSettings } from '@/hooks/useSettings'

export default function HeroSection() {
  const mouse = useMousePosition()
  const isMobile = useIsMobile()
  const { settings } = useSettings()

  const defaultSlide = {
    headline: 'REDEFINE YOUR STYLE',
    subheadline: 'Discover the latest premium fashion statements curated for men and traditional wear.',
    bgImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974',
    bgVideo: '',
    buttonText: 'Explore Collections',
    buttonLink: '/shop',
    textColor: '#ffffff',
    overlayColor: 'rgba(10,10,15,0.7)',
    animationStyle: 'fadeUp'
  }

  const slides = settings.seoConfig?.heroSlides || [
    {
      ...defaultSlide,
      headline: settings.seoConfig?.hero?.headline || defaultSlide.headline,
      subheadline: settings.seoConfig?.hero?.subheadline || defaultSlide.subheadline,
      bgImage: settings.seoConfig?.hero?.bgImage || defaultSlide.bgImage,
      buttonText: settings.seoConfig?.hero?.buttonText || defaultSlide.buttonText,
      buttonLink: settings.seoConfig?.hero?.buttonLink || defaultSlide.buttonLink,
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  // Autoplay slides
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const s = slides[currentSlide] || defaultSlide

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Media */}
          {s.bgVideo ? (
            <video
              src={s.bgVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          ) : s.bgImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${s.bgImage})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]" />
          )}

          {/* Overlay Color Override */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: s.overlayColor || 'rgba(10,10,15,0.7)' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.04)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.03)_0%,transparent_50%)]" />

      <div className="container-premium relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center pt-24 pb-12 lg:py-0">
        {/* Content */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[#d4af37]/60 text-xs md:text-sm tracking-[0.3em] uppercase font-display mb-4"
          >
            ✦ {settings.shopName} ✦
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-hero mb-6 leading-tight font-display font-extrabold"
                style={{ color: s.textColor || '#ffffff' }}
              >
                {s.headline}
              </h1>

              <p className="text-white/50 text-sm md:text-base max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed font-body">
                {s.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <MagneticButton variant="gold" size="lg" href={s.buttonLink}>
                  {s.buttonText}
                </MagneticButton>
                <MagneticButton variant="outline" size="lg" href="/shop?filter=new">
                  New Arrivals
                </MagneticButton>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-8 mt-12"
          >
            {[
              { value: '500+', label: 'Brands' },
              { value: '10K+', label: 'Products' },
              { value: '50K+', label: 'Customers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-[#d4af37] font-display font-bold text-xl md:text-2xl">{stat.value}</p>
                <p className="text-white/30 text-[10px] md:text-xs uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Model */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="order-1 lg:order-2 h-[300px] sm:h-[400px] lg:h-[550px] xl:h-[600px]"
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={isMobile ? [0.5, 1] : [1, 1.5]}
            gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <LightingRig />
              <HeroModel mousePosition={{ x: mouse.normalizedX, y: mouse.normalizedY }} />
              <fog attach="fog" args={['#0a0a0f', 5, 15]} />
            </Suspense>
          </Canvas>
        </motion.div>
      </div>

      {/* Slide dots if multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'bg-[#d4af37] w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/20 text-[9px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

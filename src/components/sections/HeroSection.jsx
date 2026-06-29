import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'motion/react'
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

  const hero = settings.seoConfig?.hero || {
    headline: 'REDEFINE YOUR STYLE',
    subheadline: 'Discover the latest premium fashion statements curated for men and traditional wear.',
    bgImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974',
    buttonText: 'Explore Collections',
    buttonLink: '/shop'
  }

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]" />
      {hero.bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{ backgroundImage: `url(${hero.bgImage})` }}
        />
      )}
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

          <AnimatedText
            animation="fadeUp"
            delay={0.7}
            className="text-hero text-white mb-6 leading-tight"
            tag="h1"
            triggerOnScroll={false}
          >
            {hero.headline}
          </AnimatedText>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-white/40 text-sm md:text-base max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed font-body"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <MagneticButton variant="gold" size="lg" href={hero.buttonLink}>
              {hero.buttonText}
            </MagneticButton>
            <MagneticButton variant="outline" size="lg" href="/shop?filter=new">
              New Arrivals
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.8 }}
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

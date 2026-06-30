import { useEffect } from 'react'
import { motion } from 'motion/react'
import HeroSection from '@/components/sections/HeroSection'
import NewArrivals from '@/components/sections/NewArrivals'
import TrendingProducts from '@/components/sections/TrendingProducts'
import Categories from '@/components/sections/Categories'
import SpecialOffers from '@/components/sections/SpecialOffers'
import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'
import { useSettings } from '@/hooks/useSettings'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'

export default function HomePage() {
  const { settings } = useSettings()

  useEffect(() => {
    document.title = settings.seoConfig?.title || `${settings.shopName} | Luxury Fashion`
  }, [settings])

  // Custom visual components for optional layout sections
  const GallerySection = () => (
    <section className="section-padding relative">
      <div className="container-premium text-center">
        <h2 className="text-section-title text-white mb-3">Our Style Gallery</h2>
        <p className="text-section-subtitle max-w-lg mx-auto mb-12">Curated lookbook stories from the fashion runways</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600',
            'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600',
            'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600',
            'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600'
          ].map((url, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-white/5 group relative">
              <img src={url} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const VideosSection = () => (
    <section className="section-padding relative">
      <div className="container-premium text-center">
        <h2 className="text-section-title text-white mb-3">Brand Campaigns</h2>
        <p className="text-section-subtitle max-w-lg mx-auto mb-12">Experience luxury through our cinematic stories</p>
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 relative">
          <iframe
            className="w-full aspect-video"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Campaign Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )

  const ContactSection = () => (
    <section className="section-padding relative">
      <div className="container-premium">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Visit Our Showroom</h2>
            <p className="text-white/40 text-sm mb-6">{settings.address}</p>
            <p className="text-[#d4af37] font-semibold text-sm">Call Us: {settings.phone}</p>
          </GlassCard>
        </div>
      </div>
    </section>
  )

  const WhatsAppSection = () => (
    <section className="section-padding relative">
      <div className="container-premium text-center">
        <GlassCard variant="colored" className="max-w-xl mx-auto">
          <h2 className="text-lg md:text-xl font-bold text-white mb-2">Prefer Ordering via Chat?</h2>
          <p className="text-white/50 text-xs mb-6">Connect directly with our customer concierge on WhatsApp for quick inquiries.</p>
          <MagneticButton variant="gold" onClick={() => window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}>
            Chat on WhatsApp
          </MagneticButton>
        </GlassCard>
      </div>
    </section>
  )

  const sectionsMap = {
    'hero': <HeroSection key="hero" />,
    'new-arrivals': <NewArrivals key="new-arrivals" />,
    'trending': <TrendingProducts key="trending" />,
    'categories': <Categories key="categories" />,
    'special-offers': <SpecialOffers key="special-offers" />,
    'testimonials': <Testimonials key="testimonials" />,
    'newsletter': <Newsletter key="newsletter" />,
    'gallery': <GallerySection key="gallery" />,
    'videos': <VideosSection key="videos" />,
    'contact-section': <ContactSection key="contact-section" />,
    'whatsapp-section': <WhatsAppSection key="whatsapp-section" />
  }

  const sortedLayout = [...((settings.homepageLayout && settings.homepageLayout.length > 0) ? settings.homepageLayout : [
    { id: 'hero', enabled: true, order: 0 },
    { id: 'new-arrivals', enabled: true, order: 1 },
    { id: 'trending', enabled: true, order: 2 },
    { id: 'categories', enabled: true, order: 3 },
    { id: 'special-offers', enabled: true, order: 4 },
    { id: 'testimonials', enabled: true, order: 5 },
    { id: 'newsletter', enabled: true, order: 6 }
  ])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {sortedLayout.map(sect => {
        if (!sect.enabled) return null
        return sectionsMap[sect.id] || null
      })}
    </motion.div>
  )
}

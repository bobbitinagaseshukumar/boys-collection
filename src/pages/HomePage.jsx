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

export default function HomePage() {
  const { settings } = useSettings()

  useEffect(() => {
    document.title = `${settings.shopName} | Luxury Fashion`
  }, [settings.shopName])

  const sectionsMap = {
    'hero': <HeroSection key="hero" />,
    'new-arrivals': <NewArrivals key="new-arrivals" />,
    'trending': <TrendingProducts key="trending" />,
    'categories': <Categories key="categories" />,
    'special-offers': <SpecialOffers key="special-offers" />,
    'testimonials': <Testimonials key="testimonials" />,
    'newsletter': <Newsletter key="newsletter" />
  }

  const sortedLayout = [...(settings.homepageLayout || [
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
        return sectionsMap[sect.id]
      })}
    </motion.div>
  )
}

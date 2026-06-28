import { useEffect } from 'react'
import { motion } from 'motion/react'
import HeroSection from '@/components/sections/HeroSection'
import NewArrivals from '@/components/sections/NewArrivals'
import TrendingProducts from '@/components/sections/TrendingProducts'
import Categories from '@/components/sections/Categories'
import SpecialOffers from '@/components/sections/SpecialOffers'
import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'

export default function HomePage() {
  useEffect(() => {
    document.title = 'STYLEX | Luxury Men\'s Fashion'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <NewArrivals />
      <TrendingProducts />
      <Categories />
      <SpecialOffers />
      <Testimonials />
      <Newsletter />
    </motion.div>
  )
}

import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import AnimatedText from '@/components/ui/AnimatedText'
import { categories } from '@/data/categories'

const categoryIcons = {
  shirts: '👔',
  pants: '👖',
  jeans: '👖',
  tshirts: '👕',
  hoodies: '🧥',
  jackets: '🧥',
}

const categoryGradients = [
  'from-[#1a1a3e]/60 to-[#d4af37]/10',
  'from-[#0f3460]/60 to-[#16213e]/30',
  'from-[#16213e]/60 to-[#1a1a3e]/30',
  'from-[#2e1a3e]/60 to-[#3a1a3e]/20',
  'from-[#1a2e2e]/60 to-[#0f3460]/20',
  'from-[#2e2e1a]/60 to-[#3e1a1a]/20',
]

const enterDirections = ['left', 'right', 'bottom', 'left', 'right', 'bottom']

export default function Categories() {
  return (
    <section className="section-padding relative">
      <div className="container-premium">
        <div className="text-center mb-12">
          <AnimatedText animation="fadeUp" className="text-section-title text-white mb-3" tag="h2">
            Shop by Category
          </AnimatedText>
          <AnimatedText animation="fadeUp" delay={0.2} className="text-section-subtitle max-w-lg mx-auto" tag="p">
            Find your perfect style across our curated categories
          </AnimatedText>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} gradient={categoryGradients[i]} direction={enterDirections[i]} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category, index, gradient, direction }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.15 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const initial = direction === 'left' ? { x: -60, opacity: 0 } : direction === 'right' ? { x: 60, opacity: 0 } : { y: 60, opacity: 0 }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isVisible ? { x: 0, y: 0, opacity: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        to={`/shop?category=${category.slug}`}
        className="block group"
        data-cursor="hover"
      >
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} border border-white/[0.06] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.12)] hover:border-[#d4af37]/20 hover:scale-[1.02]`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
          
          <span className="text-5xl md:text-6xl mb-4 block filter drop-shadow-lg">
            {categoryIcons[category.slug] || '🏷️'}
          </span>
          
          <h3 className="text-white font-display font-bold text-xl md:text-2xl mb-1 relative z-10">
            {category.name}
          </h3>
          
          <p className="text-white/30 text-sm mb-3 relative z-10">
            {category.productCount} Products
          </p>
          
          <span className="inline-flex items-center gap-1 text-[#d4af37]/60 text-xs font-medium uppercase tracking-wider group-hover:text-[#d4af37] transition-colors relative z-10">
            Explore
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

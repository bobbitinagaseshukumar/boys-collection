import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/redux/slices/cartSlice'
import { toggleWishlist } from '@/redux/slices/wishlistSlice'
import { formatPrice } from '@/utils/helpers'

const directions = {
  left: { x: -60, y: 0 },
  right: { x: 60, y: 0 },
  bottom: { x: 0, y: 60 },
  top: { x: 0, y: -60 },
}

export default function ProductCard({ product, index = 0, animationDirection = 'bottom' }) {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const dir = directions[animationDirection] || directions.bottom

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
      size: product.sizes?.[1] || 'M',
      color: product.colors?.[0]?.name || 'Default',
    }))
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist(product))
  }

  // Generate gradient placeholder based on product category
  const gradientBg = {
    shirts: 'from-[#1a1a3e] to-[#16213e]',
    pants: 'from-[#1a2e1a] to-[#0f3460]',
    jeans: 'from-[#16213e] to-[#1a1a2e]',
    tshirts: 'from-[#2e1a2e] to-[#1a1a3e]',
    hoodies: 'from-[#1a2e2e] to-[#162e13]',
    jackets: 'from-[#2e2e1a] to-[#3e1a1a]',
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dir }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="block group"
      >
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.08)] hover:-translate-y-2">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden" data-cursor="image">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg[product.category] || 'from-[#1a1a2e] to-[#0f0f18]'} flex items-center justify-center`}>
              <span className="text-6xl opacity-20">
                {product.category === 'shirts' ? '👔' : product.category === 'pants' ? '👖' : product.category === 'jeans' ? '👖' : product.category === 'tshirts' ? '👕' : product.category === 'hoodies' ? '🧥' : '🧥'}
              </span>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.discount > 0 && (
                <span className="px-2.5 py-1 bg-[#d4af37] text-[#0a0a0f] text-[10px] font-bold rounded-full tracking-wide">
                  -{product.discount}%
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full tracking-wide border border-white/10">
                  NEW
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all hover:scale-110"
              data-cursor="hover"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? '#d4af37' : 'none'} stroke={isWishlisted ? '#d4af37' : 'white'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1 font-body">{product.brand}</p>
            <h3 className="text-white/90 text-sm font-display font-semibold mb-1.5 leading-snug line-clamp-1">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? '#d4af37' : 'none'} stroke="#d4af37" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-white/30 text-[10px]">({product.reviewCount})</span>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 mb-3">
              {product.colors?.slice(0, 4).map((c, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.code }} />
              ))}
              {product.colors?.length > 4 && <span className="text-white/30 text-[10px]">+{product.colors.length - 4}</span>}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#d4af37] font-display font-bold text-base">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-white/25 text-xs line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-[#d4af37]/5 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0a0a0f] text-xs font-display font-semibold uppercase tracking-wider rounded-lg border border-[#d4af37]/35 hover:border-[#d4af37] transition-all duration-300 min-h-[44px] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              data-cursor="hover"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

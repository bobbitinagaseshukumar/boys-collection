import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleWishlistDb } from '@/redux/slices/wishlistSlice'
import { addToCartDb } from '@/redux/slices/cartSlice'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import { formatPrice } from '@/utils/helpers'

export default function WishlistPage() {
  const items = useSelector((s) => s.wishlist.items)
  const dispatch = useDispatch()

  useEffect(() => { document.title = 'Wishlist | STYLEX' }, [])

  const handleMoveToCart = (item) => {
    dispatch(addToCartDb({ id: item.id, title: item.name || item.title, price: item.price, image: item.image, size: 'M', color: 'Default' }))
    dispatch(toggleWishlistDb(item))
  }

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-7xl mb-6 block">❤️</motion.span>
          <h2 className="text-white font-display text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-white/40 text-sm mb-8">Save items you love for later</p>
          <MagneticButton variant="gold" href="/shop">Explore Collection</MagneticButton>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-16 min-h-screen">
      <div className="container-premium">
        <h1 className="text-white font-display font-bold text-2xl md:text-3xl mb-8">My Wishlist ({items.length})</h1>
        <div className="product-grid">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard hoverable>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-[#1a1a3e] to-[#0f0f18] flex items-center justify-center mb-4 border border-white/5">
                  {item.image ? (
                    <img src={item.image} alt={item.name || item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl opacity-20">👔</span>
                  )}
                </div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">{item.brand}</p>
                <h3 className="text-white font-display font-semibold text-sm mb-2 line-clamp-1">{item.name || item.title}</h3>
                <p className="text-[#d4af37] font-display font-bold mb-4">{formatPrice(item.price)}</p>
                <div className="flex gap-2">
                  <MagneticButton variant="gold" size="sm" fullWidth onClick={() => handleMoveToCart(item)}>
                    Move to Cart
                  </MagneticButton>
                  <button onClick={() => dispatch(toggleWishlistDb(item))} className="p-2.5 bg-white/[0.04] rounded-lg border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all min-h-[36px]" data-cursor="hover">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

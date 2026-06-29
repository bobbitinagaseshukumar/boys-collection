import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotal, selectCartCount, updateQuantityDb, removeFromCartDb } from '@/redux/slices/cartSlice'
import { formatPrice } from '@/utils/helpers'
import MagneticButton from '@/components/ui/MagneticButton'
import GlassCard from '@/components/ui/GlassCard'

export default function CartPage() {
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)
  const dispatch = useDispatch()

  useEffect(() => { document.title = 'Cart | STYLEX' }, [])

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container flex items-center justify-center">
        <div className="text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-7xl mb-6 block">🛒</motion.span>
          <h2 className="text-white font-display text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-white/40 text-sm mb-8">Discover our premium collections</p>
          <MagneticButton variant="gold" href="/shop">Continue Shopping</MagneticButton>
        </div>
      </motion.div>
    )
  }

  const shipping = total >= 2000 ? 0 : 199

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container">
      <div className="container-premium">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-6">
          <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/60">Cart ({count})</span>
        </div>

        <h1 className="text-white font-display font-bold text-2xl md:text-3xl mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={`${item.id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard padding="p-4 md:p-5">
                  <div className="flex gap-4">
                    {/* Image */}
                    {item.image ? (
                      <img src={item.image} alt={item.name || item.title} className="w-20 h-24 md:w-24 md:h-28 rounded-lg object-cover shrink-0 border border-white/5" />
                    ) : (
                      <div className="w-20 h-24 md:w-24 md:h-28 rounded-lg bg-gradient-to-br from-[#1a1a3e] to-[#0f0f18] flex items-center justify-center shrink-0">
                        <span className="text-3xl opacity-30">👔</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-display font-semibold text-sm md:text-base line-clamp-1">{item.name || item.title}</h3>
                          <p className="text-white/30 text-xs mt-0.5">Size: {item.size} · Color: {item.color}</p>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCartDb({ id: item.id, size: item.size, color: item.color }))}
                          className="text-white/20 hover:text-red-400 transition-colors p-1 shrink-0"
                          data-cursor="hover"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-3">
                        <div className="flex items-center gap-0 border border-white/10 rounded-lg overflow-hidden">
                          <button
                            onClick={() => dispatch(updateQuantityDb({ id: item.id, size: item.size, color: item.color, quantity: Math.max(1, item.quantity - 1) }))}
                            className="w-8 h-8 bg-white/[0.04] text-white/60 hover:bg-white/10 flex items-center justify-center text-sm"
                          >−</button>
                          <motion.span key={item.quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-8 h-8 flex items-center justify-center text-white text-sm font-medium">
                            {item.quantity}
                          </motion.span>
                          <button
                            onClick={() => dispatch(updateQuantityDb({ id: item.id, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                            className="w-8 h-8 bg-white/[0.04] text-white/60 hover:bg-white/10 flex items-center justify-center text-sm"
                          >+</button>
                        </div>
                        <span className="text-[#d4af37] font-display font-bold text-base">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <GlassCard variant="colored">
              <h3 className="text-white font-display font-bold text-lg mb-5">Order Summary</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal ({count} items)</span>
                  <span className="text-white/70">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-400' : 'text-white/70'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-white/20 text-xs">Free shipping on orders above ₹2,000</p>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white font-display font-semibold">Total</span>
                  <span className="text-[#d4af37] font-display font-bold text-xl">{formatPrice(total + shipping)}</span>
                </div>
              </div>

              <MagneticButton variant="gold" size="lg" fullWidth href="/checkout">
                Proceed to Checkout
              </MagneticButton>

              <Link to="/shop" className="block text-center text-white/30 hover:text-white/60 text-xs mt-4 transition-colors" data-cursor="hover">
                ← Continue Shopping
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

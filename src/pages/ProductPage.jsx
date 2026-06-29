import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCartDb } from '@/redux/slices/cartSlice'
import { toggleWishlistDb } from '@/redux/slices/wishlistSlice'
import { fetchProductBySlug, selectSelectedProduct, selectAllProducts } from '@/redux/slices/productSlice'
import { selectUser } from '@/redux/slices/authSlice'
import { formatPrice } from '@/utils/helpers'
import { api } from '@/utils/api'
import { useSettings } from '@/hooks/useSettings'
import MagneticButton from '@/components/ui/MagneticButton'

export default function ProductPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const user = useSelector(selectUser)
  const { settings } = useSettings()
  
  const selectedProduct = useSelector(selectSelectedProduct)
  const products = useSelector(selectAllProducts)
  
  const product = selectedProduct || products.find((p) => p.slug === slug)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    dispatch(fetchProductBySlug(slug))
  }, [slug, dispatch])

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | STYLEX`
      setSelectedSize(product.sizes?.[1] || '')
      window.scrollTo(0, 0)
    }
  }, [product])

  if (!product) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-white text-xl font-display mb-2">Product Not Found</h2>
          <Link to="/shop" className="text-[#d4af37] text-sm hover:underline">← Back to Shop</Link>
        </div>
      </div>
    )
  }

  const isWishlisted = wishlistItems.some((i) => i.id === product.id)

  const handleAddToCart = () => {
    dispatch(addToCartDb({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0]?.url || product.images?.[0] || '/images/placeholder.jpg',
      size: selectedSize,
      color: product.colors?.[selectedColor]?.name || 'Default',
      quantity,
    }))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWhatsAppOrder = async () => {
    const selectedColorName = product.colors?.[selectedColor]?.name || 'Default'
    const productUrl = window.location.href

    try {
      await api.post('/api/orders/whatsapp', {
        productName: product.title,
        productPrice: product.price,
        selectedColor: selectedColorName,
        customerName: user?.name || 'Guest',
        phoneNumber: user?.phone || 'Guest Phone'
      })
    } catch (err) {
      console.error('Failed to log WhatsApp click:', err)
    }

    const message = `Hello, I want to order:
Product: ${product.title}
Price: ₹${product.price}
Color: ${selectedColorName}
Link: ${productUrl}`

    const encodedMessage = encodeURIComponent(message)
    const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`, '_blank')
  }

  const handleCallNow = () => {
    window.location.href = `tel:${settings.phone}`
  }

  const gradientBg = {
    shirts: 'from-[#1a1a3e] to-[#16213e]',
    pants: 'from-[#1a2e1a] to-[#0f3460]',
    jeans: 'from-[#16213e] to-[#1a1a2e]',
    tshirts: 'from-[#2e1a2e] to-[#1a1a3e]',
    hoodies: 'from-[#1a2e2e] to-[#162e13]',
    jackets: 'from-[#2e2e1a] to-[#3e1a1a]',
  }

  const categoryEmoji = { shirts: '👔', pants: '👖', jeans: '👖', tshirts: '👕', hoodies: '🧥', jackets: '🧥' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container">
      <div className="container-premium">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white/60 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white/60">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className={`relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br ${gradientBg[product.category] || 'from-[#1a1a2e] to-[#0f0f18]'} flex items-center justify-center group`}>
              <span className="text-[120px] md:text-[160px] opacity-30 group-hover:scale-110 transition-transform duration-700">
                {categoryEmoji[product.category] || '👔'}
              </span>

              {product.discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#d4af37] text-[#0a0a0f] text-xs font-bold rounded-full">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`flex-1 aspect-square rounded-lg bg-gradient-to-br ${gradientBg[product.category] || 'from-[#1a1a2e] to-[#0f0f18]'} flex items-center justify-center border ${i === 0 ? 'border-[#d4af37]/40' : 'border-white/[0.06]'} cursor-pointer hover:border-[#d4af37]/40 transition-colors`}>
                  <span className="text-2xl opacity-30">{categoryEmoji[product.category] || '👔'}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-2 font-body">{product.brand}</p>
            <h1 className="text-white font-display font-bold text-2xl md:text-3xl lg:text-4xl mb-3">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? '#d4af37' : 'none'} stroke="#d4af37" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-white/40 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#d4af37] font-display font-bold text-3xl">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-white/25 text-lg line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="px-2 py-1 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold rounded">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-white/40 text-sm leading-relaxed mb-8 font-body">{product.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3 font-display">Color: <span className="text-white/70">{product.colors?.[selectedColor]?.name}</span></p>
              <div className="flex gap-2.5">
                {product.colors?.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${i === selectedColor ? 'border-[#d4af37] scale-110 shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'border-white/15 hover:border-white/30'}`}
                    style={{ backgroundColor: c.code }}
                    data-cursor="hover"
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3 font-display">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-display font-medium border transition-all min-h-[44px] ${
                      selectedSize === size
                        ? 'bg-[#d4af37] text-[#0a0a0f] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'bg-white/[0.04] text-white/60 border-white/10 hover:border-[#d4af37]/40 hover:text-white'
                    }`}
                    data-cursor="hover"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3 font-display">Quantity</p>
              <div className="flex items-center gap-0 w-fit border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center text-lg"
                  data-cursor="hover"
                >
                  −
                </button>
                <span className="w-12 h-11 flex items-center justify-center text-white font-display font-medium bg-white/[0.02]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-11 h-11 bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center text-lg"
                  data-cursor="hover"
                >
                  +
                </button>
              </div>
              <p className="text-white/20 text-xs mt-2">{product.stock} items in stock</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <MagneticButton
                  variant="gold"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  icon={addedToCart ? '✓' : undefined}
                >
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </MagneticButton>
                <MagneticButton variant="outline" size="lg" fullWidth href="/checkout">
                  Buy Now (Online)
                </MagneticButton>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] min-h-[44px]"
                  data-cursor="hover"
                >
                  <span className="text-base">💬</span> Order via WhatsApp
                </button>
                <button
                  onClick={handleCallNow}
                  className="flex-1 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]"
                  data-cursor="hover"
                >
                  <span className="text-base">📞</span> Call Now
                </button>
              </div>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => dispatch(toggleWishlistDb(product))}
              className="flex items-center gap-2 text-white/40 hover:text-[#d4af37] text-sm transition-colors"
              data-cursor="hover"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? '#d4af37' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Tags */}
            {product.tags && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/[0.06]">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/[0.03] text-white/30 text-xs rounded-full border border-white/[0.06]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

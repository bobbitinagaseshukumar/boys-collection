import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useSelector } from 'react-redux'
import AnimatedText from '@/components/ui/AnimatedText'
import ProductGrid from '@/components/product/ProductGrid'
import { selectAllProducts, selectCategories } from '@/redux/slices/productSlice'
import { categories as mockCategories } from '@/data/categories'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' },
]

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity },
]

export default function ShopPage() {
  const products = useSelector(selectAllProducts)
  const dbCategories = useSelector(selectCategories)
  const categoriesList = dbCategories.length > 0 ? dbCategories : mockCategories

  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    document.title = 'Shop | STYLEX'
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    const priceRange = PRICE_RANGES[selectedPrice]
    if (priceRange) {
      result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.sort((a, b) => b.id - a.id); break
      case 'name': result.sort((a, b) => a.title.localeCompare(b.title)); break
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return result
  }, [products, searchQuery, selectedCategory, selectedPrice, sortBy])

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedPrice(0)
    setSortBy('featured')
    setSearchQuery('')
    setSearchParams({})
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4 pb-12 min-h-screen">
      <div className="container-premium">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/30 mb-6">
          <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/60">Shop</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <AnimatedText animation="fadeUp" className="text-section-title text-white" tag="h1" triggerOnScroll={false}>
            Shop
          </AnimatedText>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-2.5 bg-white/[0.06] text-white/60 text-sm rounded-lg border border-white/10 min-h-[44px]"
          >
            Filters {showFilters ? '✕' : '☰'}
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-3 w-full md:w-auto`}>
            {/* Category pills */}
            <button
              onClick={() => { setSelectedCategory(''); setSearchParams({}) }}
              className={`px-4 py-2 text-xs rounded-full border transition-all duration-300 min-h-[36px] font-medium tracking-wide uppercase ${
                !selectedCategory ? 'bg-[#d4af37] text-[#0a0a0f] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.35)]' : 'bg-[#d4af37]/5 text-[#d4af37] border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0f] hover:shadow-[0_0_12px_rgba(212,175,55,0.2)]'
              }`}
            >
              All
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setSelectedCategory(cat.slug); setSearchParams({ category: cat.slug }) }}
                className={`px-4 py-2 text-xs rounded-full border transition-all duration-300 min-h-[36px] font-medium tracking-wide uppercase ${
                  selectedCategory === cat.slug ? 'bg-[#d4af37] text-[#0a0a0f] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.35)]' : 'bg-[#d4af37]/5 text-[#d4af37] border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0f] hover:shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                }`}
                data-cursor="hover"
              >
                {cat.name}
              </button>
            ))}

            <div className="w-px h-6 bg-white/10 hidden md:block" />

            {/* Price filter */}
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(Number(e.target.value))}
              className="bg-white/[0.04] text-white/60 text-xs border border-white/10 rounded-lg px-3 py-2.5 outline-none min-h-[36px]"
            >
              {PRICE_RANGES.map((r, i) => (
                <option key={i} value={i} className="bg-[#0a0a0f]">{r.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/[0.04] text-white/60 text-xs border border-white/10 rounded-lg px-3 py-2.5 outline-none min-h-[36px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0a0a0f]">{o.label}</option>
              ))}
            </select>

            {(selectedCategory || selectedPrice > 0 || searchQuery) && (
              <button onClick={clearFilters} className="text-[#d4af37]/60 hover:text-[#d4af37] text-xs transition-colors" data-cursor="hover">
                Clear All
              </button>
            )}
          </div>

          <span className="ml-auto text-white/30 text-xs">{filteredProducts.length} products</span>
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </motion.div>
  )
}

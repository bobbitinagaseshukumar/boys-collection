import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, logoutUser } from '@/redux/slices/authSlice'
import { api } from '@/utils/api'
import { useSettings } from '@/hooks/useSettings'
import GlassCard from '@/components/ui/GlassCard'
import FloatingLabel from '@/components/ui/FloatingLabel'
import MagneticButton from '@/components/ui/MagneticButton'

export default function AdminDashboardPage() {
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { settings, refreshSettings, updateSettingsLocally } = useSettings()

  // Guard access: Only admins can view this page
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin')
    } else if (user.role !== 'ADMIN') {
      navigate('/')
    }
  }, [user, navigate])

  const [activeTab, setActiveTab] = useState('Website Builder')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Global shared admin states
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentReviews: [],
    lowStockProducts: [],
    popularProducts: []
  })
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [whatsappOrders, setWhatsappOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch admin dashboard data on mount
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      setLoading(true)
      Promise.all([
        api.get('/api/admin/stats').then(res => setStats(res.data || res)),
        api.get('/api/products').then(res => setProducts(res.data || res.products || res)),
        api.get('/api/categories').then(res => setCategories(res.data || res.categories || res)),
        api.get('/api/orders').then(res => setOrders(res.data || res.orders || res)),
        api.get('/api/orders/admin/whatsapp').then(res => setWhatsappOrders(res.data || res)),
        api.get('/api/admin/customers').then(res => setCustomers(res.data || res)),
        api.get('/api/reviews').then(res => setReviews(res.data || res))
      ])
        .catch(err => console.error('Error fetching dashboard states:', err))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  if (!user || user.role !== 'ADMIN') {
    return null // Guard active
  }

  const menuItems = [
    { name: 'Website Builder', icon: '🎨' },
    { name: 'Homepage Manager', icon: '🏠' },
    { name: 'Product Manager', icon: '🛍️' },
    { name: 'Category Manager', icon: '📁' },
    { name: 'Orders Manager', icon: '📦' },
    { name: 'WhatsApp Orders', icon: '💬' },
    { name: 'Customers', icon: '👥' },
    { name: 'Reviews', icon: '⭐' },
    { name: 'Offers & Discounts', icon: '📢' },
    { name: 'Media Center', icon: '📂' },
    { name: 'Inventory', icon: '📥' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Theme Customizer', icon: '⚙️' },
    { name: 'Header Manager', icon: '🔝' },
    { name: 'Footer Manager', icon: '🔚' },
    { name: 'Contact Manager', icon: '📞' },
    { name: 'SEO Manager', icon: '🔍' },
    { name: 'Notification Manager', icon: '🔔' },
    { name: 'Security Manager', icon: '🛡️' },
    { name: 'Backup Manager', icon: '💾' }
  ]

  return (
    <div className="page-container min-h-screen bg-[#050508] text-white flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 top-[70px] bottom-0 bg-[#0a0a0f]/90 border-r border-white/5 backdrop-blur-2xl z-40 flex flex-col justify-between overflow-hidden"
      >
        <div className="py-4 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between px-6 mb-4">
              {!isSidebarCollapsed && (
                <span className="font-display font-bold text-xs uppercase tracking-widest text-[#d4af37]">Control Center</span>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="text-white/40 hover:text-white transition-colors p-1"
              >
                {isSidebarCollapsed ? '➡️' : '⬅️'}
              </button>
            </div>

            <nav className="space-y-1 px-4 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar pr-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-300 font-display text-xs font-medium ${
                    activeTab === item.name
                      ? 'bg-[#d4af37] text-[#0a0a0f] shadow-[0_0_15px_rgba(212,175,55,0.25)] font-bold'
                      : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-white/5 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-display text-xs"
            >
              <span>🚪</span>
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 transition-all duration-300" style={{ marginLeft: isSidebarCollapsed ? '80px' : '280px' }}>
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'Website Builder' && <AdminWebsiteBuilderPanel />}
              {activeTab === 'Homepage Manager' && <AdminHomepageManagerPanel />}
              {activeTab === 'Product Manager' && <AdminProductsPanel products={products} setProducts={setProducts} categories={categories} />}
              {activeTab === 'Category Manager' && <AdminCategoriesPanel categories={categories} setCategories={setCategories} />}
              {activeTab === 'Orders Manager' && <AdminOrdersPanel orders={orders} setOrders={setOrders} />}
              {activeTab === 'WhatsApp Orders' && <AdminWhatsAppOrdersPanel whatsappOrders={whatsappOrders} setWhatsappOrders={setWhatsappOrders} />}
              {activeTab === 'Customers' && <AdminCustomersPanel customers={customers} />}
              {activeTab === 'Reviews' && <AdminReviewsPanel reviews={reviews} setReviews={setReviews} />}
              {activeTab === 'Offers & Discounts' && <AdminOffersPanel />}
              {activeTab === 'Media Center' && <AdminMediaLibraryPanel />}
              {activeTab === 'Inventory' && <AdminInventoryPanel products={products} setProducts={setProducts} />}
              {activeTab === 'Analytics' && <AdminAnalyticsPanel stats={stats} />}
              {activeTab === 'Theme Customizer' && <AdminThemeCustomizerPanel />}
              {activeTab === 'Header Manager' && <AdminHeaderManagerPanel />}
              {activeTab === 'Footer Manager' && <AdminFooterManagerPanel />}
              {activeTab === 'Contact Manager' && <AdminContactManagerPanel />}
              {activeTab === 'SEO Manager' && <AdminSEOManagerPanel />}
              {activeTab === 'Notification Manager' && <AdminNotificationManagerPanel />}
              {activeTab === 'Security Manager' && <AdminSecurityManagerPanel />}
              {activeTab === 'Backup Manager' && <AdminBackupManagerPanel />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

/* 1. WEBSITE BUILDER (Hero Slides Control) */
function AdminWebsiteBuilderPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)

  useEffect(() => {
    if (settings) {
      setSlides(settings.seoConfig?.heroSlides || [
        {
          headline: 'REDEFINE YOUR STYLE',
          subheadline: 'Discover the latest premium fashion statements curated for men and traditional wear.',
          bgImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974',
          bgVideo: '',
          buttonText: 'Explore Collections',
          buttonLink: '/shop',
          textColor: '#ffffff',
          overlayColor: 'rgba(10,10,15,0.7)',
          animationStyle: 'fadeUp'
        }
      ])
    }
  }, [settings])

  const handleSave = async (updatedSlides) => {
    setLoading(true)
    try {
      const seoConfigUpdated = { ...(settings.seoConfig || {}), heroSlides: updatedSlides || slides }
      const res = await api.put('/api/settings', {
        ...settings,
        seoConfig: seoConfigUpdated
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Visual sliders saved successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to save visual slider settings.')
    } finally {
      setLoading(false)
    }
  }

  const addSlide = () => {
    const updated = [
      ...slides,
      {
        headline: 'NEW CAMPAIGN',
        subheadline: 'Luxury collections now live on the store.',
        bgImage: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1974',
        bgVideo: '',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        textColor: '#ffffff',
        overlayColor: 'rgba(10,10,15,0.7)',
        animationStyle: 'fadeUp'
      }
    ]
    setSlides(updated)
    setEditingIndex(updated.length - 1)
  }

  const deleteSlide = (index) => {
    if (slides.length <= 1) {
      alert('Must keep at least one slide.')
      return
    }
    const updated = slides.filter((_, i) => i !== index)
    setSlides(updated)
    setEditingIndex(null)
    handleSave(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white font-display font-bold text-xl">Hero Banner Slides</h2>
          <p className="text-white/40 text-xs mt-1">Add, customize, and animate multiple slides for the homepage landing view.</p>
        </div>
        <MagneticButton variant="gold" onClick={addSlide}>+ Add Slide</MagneticButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slides List */}
        <div className="space-y-3">
          {slides.map((s, idx) => (
            <div
              key={idx}
              onClick={() => setEditingIndex(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                editingIndex === idx
                  ? 'border-[#d4af37] bg-[#d4af37]/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold text-sm">Slide #{idx + 1}</p>
                  <p className="text-white/40 text-xs line-clamp-1 mt-0.5">{s.headline}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSlide(idx) }}
                  className="text-rose-400 hover:text-rose-300 text-xs p-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Editor */}
        <div className="lg:col-span-2">
          {editingIndex !== null && slides[editingIndex] ? (
            <GlassCard className="space-y-4">
              <h3 className="text-white font-display font-semibold text-base mb-4">Edit Slide #{editingIndex + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabel label="Headline" value={slides[editingIndex].headline} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].headline = e.target.value; setSlides(updated)
                }} />
                <FloatingLabel label="Subheadline" value={slides[editingIndex].subheadline} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].subheadline = e.target.value; setSlides(updated)
                }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabel label="Bg Image URL" value={slides[editingIndex].bgImage} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].bgImage = e.target.value; setSlides(updated)
                }} />
                <FloatingLabel label="Bg Video URL (optional)" value={slides[editingIndex].bgVideo} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].bgVideo = e.target.value; setSlides(updated)
                }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabel label="Button Text" value={slides[editingIndex].buttonText} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].buttonText = e.target.value; setSlides(updated)
                }} />
                <FloatingLabel label="Button Link" value={slides[editingIndex].buttonLink} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].buttonLink = e.target.value; setSlides(updated)
                }} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FloatingLabel label="Text Color (hex)" value={slides[editingIndex].textColor || '#ffffff'} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].textColor = e.target.value; setSlides(updated)
                }} />
                <FloatingLabel label="Overlay Overlay" value={slides[editingIndex].overlayColor || 'rgba(10,10,15,0.7)'} onChange={(e) => {
                  const updated = [...slides]; updated[editingIndex].overlayColor = e.target.value; setSlides(updated)
                }} />
                <div>
                  <label className="text-[10px] uppercase text-white/40 block mb-1">Animation Style</label>
                  <select
                    value={slides[editingIndex].animationStyle || 'fadeUp'}
                    onChange={(e) => {
                      const updated = [...slides]; updated[editingIndex].animationStyle = e.target.value; setSlides(updated)
                    }}
                    className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="fadeUp">Fade Up</option>
                    <option value="reveal">Letter Reveal</option>
                    <option value="gradient">Golden Glow</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <MagneticButton variant="gold" onClick={() => handleSave(slides)} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Configuration'}
                </MagneticButton>
              </div>
            </GlassCard>
          ) : (
            <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-white/20 text-sm">
              Select a slide on the left to start editing.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* 2. HOMEPAGE MANAGER (Layout sequence, sections show/hide, custom sections) */
function AdminHomepageManagerPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [newSec, setNewSec] = useState({ id: '', name: '', enabled: true })

  useEffect(() => {
    if (settings) {
      setSections((settings.homepageLayout && settings.homepageLayout.length > 0) ? settings.homepageLayout : [
        { id: 'hero', name: 'Hero Section', enabled: true, order: 0 },
        { id: 'new-arrivals', name: 'New Arrivals', enabled: true, order: 1 },
        { id: 'trending', name: 'Trending Products', enabled: true, order: 2 },
        { id: 'categories', name: 'Categories', enabled: true, order: 3 },
        { id: 'special-offers', name: 'Special Offers', enabled: true, order: 4 },
        { id: 'testimonials', name: 'Testimonials', enabled: true, order: 5 },
        { id: 'newsletter', name: 'Newsletter', enabled: true, order: 6 }
      ])
    }
  }, [settings])

  const handleSave = async (updated) => {
    setLoading(true)
    const final = updated || sections
    try {
      const res = await api.put('/api/settings', {
        ...settings,
        homepageLayout: final
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Homepage sections saved!')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (id) => {
    const updated = sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    setSections(updated)
    handleSave(updated)
  }

  const move = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= sections.length) return
    const updated = [...sections]
    const temp = updated[idx]
    updated[idx] = updated[idx + dir]
    updated[idx + dir] = temp
    const reordered = updated.map((s, i) => ({ ...s, order: i }))
    setSections(reordered)
    handleSave(reordered)
  }

  const createSection = () => {
    if (!newSec.id.trim() || !newSec.name.trim()) return
    const updated = [...sections, { ...newSec, order: sections.length }]
    setSections(updated)
    setNewSec({ id: '', name: '', enabled: true })
    handleSave(updated)
  }

  const deleteSection = (id) => {
    const updated = sections.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }))
    setSections(updated)
    handleSave(updated)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-white font-display font-bold text-lg mb-2">Drag-Feel Page Sections Builder</h3>
        {sections.map((sect, idx) => (
          <div key={sect.id} className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs">#{idx + 1}</span>
              <span className="font-semibold text-sm text-white">{sect.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => move(idx, -1)} disabled={idx === 0} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white disabled:opacity-30">▲</button>
              <button onClick={() => move(idx, 1)} disabled={idx === sections.length - 1} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white disabled:opacity-30">▼</button>
              <button onClick={() => toggleSection(sect.id)} className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${sect.enabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                {sect.enabled ? 'Show' : 'Hide'}
              </button>
              <button onClick={() => deleteSection(sect.id)} className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs flex items-center justify-center">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Create Custom Section</h3>
        <div className="space-y-4">
          <FloatingLabel label="Section Identifier (e.g. gallery)" value={newSec.id} onChange={(e) => setNewSec({ ...newSec, id: e.target.value.toLowerCase().replace(/[^a-z-]/g, '') })} />
          <FloatingLabel label="Section Display Name" value={newSec.name} onChange={(e) => setNewSec({ ...newSec, name: e.target.value })} />
          <MagneticButton variant="gold" onClick={createSection} fullWidth>Add Section</MagneticButton>
        </div>
      </GlassCard>
    </div>
  )
}

/* 3. PRODUCT MANAGER (Add, edit, delete, duplicate, archive products) */
function AdminProductsPanel({ products, setProducts, categories }) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    brand: 'STYLEX',
    price: '',
    originalPrice: '',
    discount: '0',
    stock: '50',
    categoryId: '1',
    description: '',
    sizes: 'S, M, L, XL',
    colors: '',
    images: '',
    videoUrl: '',
    rotationImagesUrl: ''
  })

  const handleEditClick = (p) => {
    setEditingProduct(p)
    setFormData({
      title: p.title,
      brand: p.brand || 'STYLEX',
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : p.price.toString(),
      discount: p.discount ? p.discount.toString() : '0',
      stock: p.stock.toString(),
      categoryId: p.categoryId.toString(),
      description: p.description || '',
      sizes: p.sizes ? p.sizes.join(', ') : 'S, M, L, XL',
      colors: p.colors ? p.colors.map(c => `${c.name}:${c.code}`).join(', ') : '',
      images: p.images ? p.images.map(img => img.url || img).join(', ') : '',
      videoUrl: p.videoUrl || '',
      rotationImagesUrl: p.rotationImagesUrl || ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await api.delete(`/api/products/${id}`)
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
        alert('Product deleted successfully.')
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product.')
    }
  }

  const handleDuplicate = (p) => {
    const duplicated = {
      ...p,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy-${Date.now()}`
    }
    const { id, createdAt, updatedAt, reviews, images, colors, sizes, ...payload } = duplicated
    payload.images = p.images ? p.images.map(img => img.url || img) : []
    payload.colors = p.colors ? p.colors.map(c => ({ name: c.name, code: c.code })) : []
    payload.sizes = p.sizes || []

    api.post('/api/products', payload)
      .then(res => {
        setProducts(prev => [res.data || res, ...prev])
        alert('Product duplicated successfully!')
      })
      .catch(err => alert(err.message))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: formData.title,
        brand: formData.brand,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        discount: parseFloat(formData.discount),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        description: formData.description,
        sizes: formData.sizes.split(',').map(s => s.trim()),
        colors: formData.colors ? formData.colors.split(',').map(c => {
          const pts = c.split(':')
          return { name: pts[0]?.trim(), code: pts[1]?.trim() || pts[0]?.trim() }
        }) : [{ name: 'Default', code: '#d4af37' }],
        images: formData.images ? formData.images.split(',').map(u => u.trim()) : [],
        videoUrl: formData.videoUrl,
        rotationImagesUrl: formData.rotationImagesUrl
      }

      if (editingProduct) {
        const res = await api.put(`/api/products/${editingProduct.id}`, payload)
        if (res.success || res.data) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? (res.data || res) : p))
          alert('Product details updated!')
        }
      } else {
        const res = await api.post('/api/products', payload)
        if (res.success || res.data) {
          setProducts(prev => [res.data || res, ...prev])
          alert('Product uploaded successfully!')
        }
      }
      setModalOpen(false)
      setEditingProduct(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.categoryId.toString() === filterCat : true
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-display font-bold text-xl">Product Management</h2>
        <MagneticButton variant="gold" onClick={() => { setEditingProduct(null); setFormData({ title: '', brand: 'STYLEX', price: '', originalPrice: '', discount: '0', stock: '50', categoryId: '1', description: '', sizes: 'S, M, L, XL', colors: '', images: '', videoUrl: '', rotationImagesUrl: '' }); setModalOpen(true) }}>+ Add Product</MagneticButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white/[0.04] text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#d4af37] focus:outline-none"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-white/[0.04] text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#d4af37] focus:outline-none"
        >
          <option value="" className="bg-[#0a0a0f]">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id} className="bg-[#0a0a0f]">{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="rounded-2xl border border-white/5 bg-[#0a0a0f]/80 overflow-hidden shadow-lg flex flex-col justify-between p-4 space-y-4">
            <img src={p.images?.[0]?.url || p.images?.[0] || 'https://placehold.co/300'} className="w-full h-40 object-cover rounded-xl" />
            <div>
              <p className="text-white/30 text-[10px] uppercase font-display tracking-widest">{p.brand}</p>
              <h4 className="text-white font-semibold text-sm line-clamp-1 mt-0.5">{p.title}</h4>
              <p className="text-[#d4af37] font-bold text-sm mt-1">₹{p.price.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleEditClick(p)} className="py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] border border-white/10 transition-colors">Edit</button>
              <button onClick={() => handleDuplicate(p)} className="py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] border border-white/10 transition-colors">Copy</button>
              <button onClick={() => handleDelete(p.id)} className="py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[10px] border border-rose-500/20 transition-colors flex items-center justify-center">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 relative my-8">
            <button onClick={() => setModalOpen(false)} className="absolute right-4 top-4 text-white/40 hover:text-white text-lg">✕</button>
            <h3 className="text-white font-display font-bold text-lg mb-6">{editingProduct ? 'Edit Product Details' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabel label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <FloatingLabel label="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FloatingLabel label="Price (₹)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} type="number" required />
                <FloatingLabel label="Original Price (₹)" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} type="number" />
                <FloatingLabel label="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} type="number" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-white/40 block mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <FloatingLabel label="Discount %" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} type="number" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-white/40 block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full bg-[#050508] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabel label="Sizes (comma separated)" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} />
                <FloatingLabel label="Colors (e.g. Gold:#d4af37, Black:#000000)" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} />
              </div>
              <FloatingLabel label="Image URLs (comma separated)" value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabel label="Video URL" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                <FloatingLabel label="360 Degree Images URL" value={formData.rotationImagesUrl} onChange={(e) => setFormData({ ...formData, rotationImagesUrl: e.target.value })} />
              </div>
              <MagneticButton variant="gold" size="lg" type="submit" fullWidth>Save Product Changes</MagneticButton>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* 4. CATEGORY MANAGER (Custom banners, theme colors, anims) */
function AdminCategoriesPanel({ categories, setCategories }) {
  const [newCat, setNewCat] = useState({ name: '', banner: '', thumbnail: '', themeColor: '#d4af37', animation: 'fade' })

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/categories', {
        name: newCat.name,
        slug: newCat.name.toLowerCase().replace(/ /g, '-'),
        image: newCat.thumbnail,
        themeColor: newCat.themeColor
      })
      if (res.success || res.data) {
        setCategories(prev => [...prev, res.data || res])
        setNewCat({ name: '', banner: '', thumbnail: '', themeColor: '#d4af37', animation: 'fade' })
        alert('Category added successfully!')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await api.delete(`/api/categories/${id}`)
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== id))
        alert('Category deleted.')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-white font-display font-bold text-lg mb-4">Live Product Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(c => (
            <div key={c.id} className="p-4 rounded-xl border border-white/5 bg-[#0a0a0f]/80 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-10 rounded-full" style={{ backgroundColor: c.themeColor || '#d4af37' }} />
                <div>
                  <h4 className="text-white font-semibold text-sm">{c.name}</h4>
                  <p className="text-white/30 text-[10px] font-mono mt-0.5">Slug: {c.slug}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-rose-400 hover:text-rose-300 text-xs">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Create Category</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <FloatingLabel label="Category Name" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} required />
          <FloatingLabel label="Category Thumbnail URL" value={newCat.thumbnail} onChange={(e) => setNewCat({ ...newCat, thumbnail: e.target.value })} />
          <FloatingLabel label="Category Banner URL" value={newCat.banner} onChange={(e) => setNewCat({ ...newCat, banner: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase text-white/40 block mb-1">Theme Color</label>
              <input type="color" value={newCat.themeColor} onChange={(e) => setNewCat({ ...newCat, themeColor: e.target.value })} className="w-full h-9 bg-transparent border-0 rounded cursor-pointer" />
            </div>
            <div>
              <label className="text-[10px] uppercase text-white/40 block mb-1">Enter Animation</label>
              <select
                value={newCat.animation}
                onChange={(e) => setNewCat({ ...newCat, animation: e.target.value })}
                className="w-full bg-[#050508] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="fade">Fade In</option>
                <option value="slide">Slide In</option>
                <option value="zoom">Zoom In</option>
                <option value="flip">3D Flip</option>
              </select>
            </div>
          </div>
          <MagneticButton variant="gold" size="lg" type="submit" fullWidth>Create Category</MagneticButton>
        </form>
      </GlassCard>
    </div>
  )
}

/* 5. ORDERS MANAGER (Paid online orders datatable) */
function AdminOrdersPanel({ orders, setOrders }) {
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/api/orders/${id}/status`, { status })
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        alert('Order status updated.')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <GlassCard>
      <h3 className="text-white font-display font-semibold text-lg mb-6">Paid Orders Datatable</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-3">Order Code</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Total</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3.5 px-3 font-mono text-[10px]">{o.orderNumber}</td>
                <td className="py-3.5 px-3">{o.user?.name || 'Customer'}</td>
                <td className="py-3.5 px-3 text-[#d4af37] font-semibold">₹{o.totalAmount.toLocaleString()}</td>
                <td className="py-3.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${o.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{o.status}</span>
                </td>
                <td className="py-3.5 px-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="bg-[#050508] border border-white/10 rounded p-1 text-[10px] text-white focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

/* 6. WHATSAPP ORDERS (Log details from direct WhatsApp clicks) */
function AdminWhatsAppOrdersPanel({ whatsappOrders, setWhatsappOrders }) {
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/api/orders/admin/whatsapp/${id}/status`, { status })
      if (res.success || res.data) {
        setWhatsappOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        alert('WhatsApp order status updated.')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <GlassCard>
      <h3 className="text-white font-display font-semibold text-lg mb-6">WhatsApp Order Inquiries</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {whatsappOrders.map(o => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3.5 px-3 font-semibold">{o.customerName}</td>
                <td className="py-3.5 px-3 font-mono">{o.phoneNumber}</td>
                <td className="py-3.5 px-3 text-white/80">{o.productName} ({o.selectedColor || 'Default'})</td>
                <td className="py-3.5 px-3 text-[#d4af37] font-semibold">₹{o.productPrice.toLocaleString()}</td>
                <td className="py-3.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${o.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{o.status}</span>
                </td>
                <td className="py-3.5 px-3 flex gap-2">
                  <button onClick={() => window.open(`https://wa.me/${o.phoneNumber.replace(/[^0-9]/g, '')}`, '_blank')} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] border border-emerald-500/20">Chat</button>
                  <button onClick={() => window.location.href = `tel:${o.phoneNumber}`} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] border border-blue-500/20">Call</button>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="bg-[#050508] border border-white/10 rounded p-1 text-[10px] text-white focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

/* 7. CUSTOMERS (User directories) */
function AdminCustomersPanel({ customers }) {
  return (
    <GlassCard>
      <h3 className="text-white font-display font-semibold text-lg mb-6">User accounts directory</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Email Address</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Orders</th>
              <th className="py-3 px-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3.5 px-3 font-semibold">{c.name}</td>
                <td className="py-3.5 px-3 text-white/60">{c.email}</td>
                <td className="py-3.5 px-3 font-mono">{c.phone || '-'}</td>
                <td className="py-3.5 px-3 text-[#d4af37] font-bold">{c.ordersCount || 0}</td>
                <td className="py-3.5 px-3 text-xs uppercase font-bold text-white/40">{c.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

/* 8. REVIEWS (Moderation approval) */
function AdminReviewsPanel({ reviews, setReviews }) {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    try {
      const res = await api.delete(`/api/reviews/${id}`)
      if (res.success) {
        setReviews(prev => prev.filter(r => r.id !== id))
        alert('Review deleted.')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-white font-display font-bold text-lg">Product Reviews Moderation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map(r => (
          <GlassCard key={r.id} className="flex flex-col justify-between p-4 space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-semibold text-sm">{r.user?.name || 'Anonymous User'}</h4>
                  <p className="text-white/30 text-[10px]">For Product ID: {r.productId}</p>
                </div>
                <span className="text-yellow-400 text-xs font-bold">★ {r.rating}</span>
              </div>
              <p className="text-white/60 text-xs italic font-body mt-2">"{r.comment}"</p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] border border-emerald-500/20">Approve</button>
              <button onClick={() => handleDelete(r.id)} className="px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded text-[10px] border border-rose-500/20">Delete</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

/* 9. OFFERS & DISCOUNTS (Campaigns & Coupon Voucher Creator) */
function AdminOffersPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [coupons, setCoupons] = useState([])
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 10, minOrder: 500, endDate: '' })
  const [flashSale, setFlashSale] = useState({ title: '', description: '', discount: 10, endDate: '' })

  useEffect(() => {
    api.get('/api/coupons')
      .then(res => setCoupons(res.data || res.coupons || res))
      .catch(err => console.error(err))
    if (settings?.popups?.flashSale) {
      setFlashSale(settings.popups.flashSale)
    }
  }, [settings])

  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/coupons', newCoupon)
      alert('Coupon created successfully!')
      setNewCoupon({ code: '', discount: 10, minOrder: 500, endDate: '' })
      const res = await api.get('/api/coupons')
      setCoupons(res.data || res.coupons || res)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSaveFlashSale = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put('/api/settings', {
        ...settings,
        popups: { ...(settings.popups || {}), flashSale }
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Flash sale schedule saved!')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Create Discount Coupon</h3>
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <FloatingLabel label="Coupon Code" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} required />
          <div className="grid grid-cols-2 gap-4">
            <FloatingLabel label="Discount %" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) || 0 })} required />
            <FloatingLabel label="Min Order Value (₹)" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: parseFloat(e.target.value) || 0 })} required />
          </div>
          <FloatingLabel label="End Date" type="date" value={newCoupon.endDate} onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })} required />
          <MagneticButton variant="gold" size="lg" type="submit" fullWidth>Create Coupon</MagneticButton>
        </form>

        <div className="mt-8 space-y-2">
          <h4 className="text-white/40 text-xs font-semibold uppercase">Active Vouchers</h4>
          {coupons.map(c => (
            <div key={c.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-xs">
              <span className="font-bold text-[#d4af37]">{c.code}</span>
              <span className="text-white/50">{c.discount}% Off (Min: ₹{c.minOrder})</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Flash Sale Event Scheduler</h3>
        <form onSubmit={handleSaveFlashSale} className="space-y-4">
          <FloatingLabel label="Sale Campaign Title" value={flashSale.title || ''} onChange={(e) => setFlashSale({ ...flashSale, title: e.target.value })} />
          <FloatingLabel label="Sale description" value={flashSale.description || ''} onChange={(e) => setFlashSale({ ...flashSale, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <FloatingLabel label="Discount %" value={flashSale.discount || ''} onChange={(e) => setFlashSale({ ...flashSale, discount: parseFloat(e.target.value) || 0 })} />
            <FloatingLabel label="End Date" type="date" value={flashSale.endDate || ''} onChange={(e) => setFlashSale({ ...flashSale, endDate: e.target.value })} />
          </div>
          <MagneticButton variant="gold" size="lg" type="submit" fullWidth>Schedule Flash Sale</MagneticButton>
        </form>
      </GlassCard>
    </div>
  )
}

/* 10. MEDIA CENTER (Dynamic images catalog library indexer) */
function AdminMediaLibraryPanel() {
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('All')
  const [mediaItems, setMediaItems] = useState([])
  const [loadingMedia, setLoadingMedia] = useState(true)
  const folders = ['All', 'Products', 'Categories', 'Banners']

  useEffect(() => {
    Promise.all([api.get('/api/products'), api.get('/api/categories')])
      .then(([productsRes, categoriesRes]) => {
        const products = productsRes.data || productsRes.products || productsRes
        const categories = categoriesRes.data || categoriesRes.categories || categoriesRes
        const items = []

        if (Array.isArray(products)) {
          products.forEach(p => {
            const imgs = p.images || []
            imgs.forEach((img, i) => {
              const url = img.url || img
              if (url && typeof url === 'string') {
                items.push({ name: `${p.title}_img_${i + 1}`, url, folder: 'Products' })
              }
            })
          })
        }
        if (Array.isArray(categories)) {
          categories.forEach(c => {
            if (c.image) {
              items.push({ name: `cat_${c.name}`, url: c.image, folder: 'Categories' })
            }
          })
        }
        setMediaItems(items)
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingMedia(false))
  }, [])

  const filtered = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesFolder = selectedFolder === 'All' || item.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  return (
    <GlassCard className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white font-display font-semibold text-lg">Central Media Library</h3>
          <p className="text-white/40 text-xs mt-0.5">Asset manager scans all database products and categories photos instantly.</p>
        </div>
        <input
          type="text"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/[0.04] text-white border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {folders.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFolder(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-display border transition-colors whitespace-nowrap ${
              selectedFolder === f
                ? 'bg-[#d4af37]/15 border-[#d4af37]/30 text-[#d4af37]'
                : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white'
            }`}
          >
            📁 {f}
          </button>
        ))}
      </div>

      {loadingMedia ? (
        <div className="min-h-[20vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filtered.map((item, idx) => (
            <div key={idx} className="group relative bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
              <img src={item.url} alt={item.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="text-xs text-white/80 font-medium truncate">{item.name}</p>
                <span className="text-[10px] text-white/30">{item.folder}</span>
              </div>
              <div className="absolute inset-0 bg-[#0a0a0f]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => navigator.clipboard.writeText(item.url).then(() => alert('Copied image URL!'))} className="px-3 py-1.5 bg-[#d4af37] text-black font-semibold text-xs rounded">Copy URL</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}

/* 11. INVENTORY (Manual stock checks) */
function AdminInventoryPanel({ products, setProducts }) {
  const handleStockOverride = async (p, val) => {
    try {
      const newStock = parseInt(val)
      if (isNaN(newStock) || newStock === p.stock) return
      const res = await api.put(`/api/products/${p.id}`, { stock: newStock })
      if (res.success || res.data) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: newStock } : item))
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <GlassCard>
      <h3 className="text-white font-display font-semibold text-lg mb-6">Stock Override Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Current Stock</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Manual Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-3 font-semibold">{p.title}</td>
                <td className="py-3 px-3">{p.stock} units</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{p.stock < 10 ? 'Low Stock' : 'Good'}</span>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => handleStockOverride(p, e.target.value)}
                    className="w-20 bg-white/[0.04] text-white border border-white/10 rounded px-2 py-1 text-center focus:outline-none focus:border-[#d4af37]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

/* 12. ANALYTICS (Real dashboard counters) */
function AdminAnalyticsPanel({ stats }) {
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    api.get('/api/admin/analytics')
      .then(res => setAnalyticsData(res.data || res))
      .catch(err => console.error(err))
  }, [])

  const sales = analyticsData?.salesData || [0, 0, 0, 0, 0, 0]
  const maxSales = Math.max(...sales, 1)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  const cards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-amber-500/20 to-yellow-500/5' },
    { title: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'from-blue-500/20 to-indigo-500/5' },
    { title: 'Total Products', value: stats.totalProducts, icon: '🛍️', color: 'from-emerald-500/20 to-teal-500/5' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: 'from-purple-500/20 to-pink-500/5' }
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map(c => (
          <div key={c.title} className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${c.color} relative overflow-hidden shadow-lg`}>
            <span className="text-3xl absolute right-4 top-4 opacity-25">{c.icon}</span>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">{c.title}</p>
            <h3 className="text-2xl font-bold mt-2 text-white">{c.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard>
          <h3 className="text-white font-display font-semibold text-base mb-6">Sales Growth Ticker</h3>
          <div className="h-48 flex items-end justify-between px-2 pt-6">
            {sales.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div
                  style={{ height: `${(val / maxSales) * 110}px` }}
                  className="w-6 bg-gradient-to-t from-[#d4af37]/20 to-[#d4af37] rounded-t-md shadow-md"
                />
                <span className="text-[10px] text-white/40">{months[idx]}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-white font-display font-semibold text-base mb-4">Top Rated Items</h3>
          <div className="space-y-3">
            {analyticsData?.topProducts?.slice(0, 3).map(p => (
              <div key={p.id} className="flex justify-between items-center text-xs p-2.5 rounded bg-white/[0.01] border border-white/5">
                <span>{p.title}</span>
                <span className="text-yellow-400 font-bold">★ {p.avgRating?.toFixed(1) || '5.0'}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

/* 13. THEME CUSTOMIZER (Colors, typography variables) */
function AdminThemeCustomizerPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [theme, setTheme] = useState({
    primaryColor: '#0a0a0f',
    accentColor: '#d4af37',
    bgColor: '#050508',
    textColor: '#ffffff',
    fontDisplay: 'Outfit, sans-serif',
    fontBody: 'Inter, sans-serif',
    borderRadius: '8px',
    cardBgColor: '#0a0a0f'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings?.themeConfig) {
      setTheme({ ...theme, ...settings.themeConfig })
    }
  }, [settings])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await api.put('/api/settings', {
        ...settings,
        themeConfig: theme
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Site theme custom styling updated successfully!')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="max-w-xl">
      <h3 className="text-white font-display font-semibold text-lg mb-6">Website Theme Customizer</h3>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-white/40 block mb-1">Primary Color (Menu/Header)</label>
            <input type="color" value={theme.primaryColor} onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })} className="w-full h-10 bg-transparent border-0 rounded cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] uppercase text-white/40 block mb-1">Accent Gold Color</label>
            <input type="color" value={theme.accentColor} onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })} className="w-full h-10 bg-transparent border-0 rounded cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-white/40 block mb-1">Global Background</label>
            <input type="color" value={theme.bgColor} onChange={(e) => setTheme({ ...theme, bgColor: e.target.value })} className="w-full h-10 bg-transparent border-0 rounded cursor-pointer" />
          </div>
          <div>
            <label className="text-[10px] uppercase text-white/40 block mb-1">Card Background</label>
            <input type="color" value={theme.cardBgColor} onChange={(e) => setTheme({ ...theme, cardBgColor: e.target.value })} className="w-full h-10 bg-transparent border-0 rounded cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-white/40 block mb-1">Display Font</label>
            <select value={theme.fontDisplay} onChange={(e) => setTheme({ ...theme, fontDisplay: e.target.value })} className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none">
              <option value='Outfit, sans-serif'>Outfit (Modern luxury)</option>
              <option value='Playfair Display, serif'>Playfair (Classic Elegant)</option>
              <option value='Montserrat, sans-serif'>Montserrat (Sleek)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase text-white/40 block mb-1">Body Font</label>
            <select value={theme.fontBody} onChange={(e) => setTheme({ ...theme, fontBody: e.target.value })} className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none">
              <option value='Inter, sans-serif'>Inter (Highly readable)</option>
              <option value='Roboto, sans-serif'>Roboto (Standard)</option>
            </select>
          </div>
        </div>

        <FloatingLabel label="Border Radius (e.g. 8px, 16px)" value={theme.borderRadius} onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })} />
        <FloatingLabel label="Text Color (hex)" value={theme.textColor} onChange={(e) => setTheme({ ...theme, textColor: e.target.value })} />

        <MagneticButton variant="gold" size="lg" onClick={handleSave} disabled={loading} fullWidth>
          {loading ? 'Applying Theme...' : 'Apply Theme Styles'}
        </MagneticButton>
      </div>
    </GlassCard>
  )
}

/* 14. HEADER MANAGER (Logo, navigation lists order) */
function AdminHeaderManagerPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [header, setHeader] = useState({ logoUrl: '', menuItems: [] })
  const [loading, setLoading] = useState(false)
  const [newLink, setNewLink] = useState({ label: '', to: '' })

  useEffect(() => {
    if (settings) {
      setHeader({
        logoUrl: settings.logo || settings.headerConfig?.logoUrl || '',
        menuItems: settings.headerConfig?.menuItems || [
          { to: '/', label: 'Home' },
          { to: '/shop', label: 'Shop' },
          { to: '/shop?category=shirts', label: 'Categories' },
          { to: '/about', label: 'About' }
        ]
      })
    }
  }, [settings])

  const handleSave = async (updatedItems) => {
    setLoading(true)
    const finalMenu = updatedItems || header.menuItems
    try {
      const res = await api.put('/api/settings', {
        ...settings,
        logo: header.logoUrl,
        headerConfig: { ...header, logoUrl: header.logoUrl, menuItems: finalMenu }
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Header menu settings saved!')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addLink = () => {
    if (!newLink.label.trim() || !newLink.to.trim()) return
    const updated = [...header.menuItems, newLink]
    setHeader({ ...header, menuItems: updated })
    setNewLink({ label: '', to: '' })
    handleSave(updated)
  }

  const removeLink = (idx) => {
    const updated = header.menuItems.filter((_, i) => i !== idx)
    setHeader({ ...header, menuItems: updated })
    handleSave(updated)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Logo Image URL</h3>
        <FloatingLabel label="Header Image Logo URL (optional)" value={header.logoUrl} onChange={(e) => setHeader({ ...header, logoUrl: e.target.value })} />
        <div className="pt-4 flex justify-end">
          <MagneticButton variant="gold" onClick={() => handleSave(null)} disabled={loading}>Save Header Logo</MagneticButton>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Header Navigation Menu</h3>
        <div className="space-y-3 mb-6">
          {header.menuItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs">
              <span>{item.label} → <span className="text-white/40">{item.to}</span></span>
              <button onClick={() => removeLink(idx)} className="text-rose-400 hover:text-rose-300">Remove</button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <FloatingLabel label="Link Label" value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} />
          <FloatingLabel label="Destination Path" value={newLink.to} onChange={(e) => setNewLink({ ...newLink, to: e.target.value })} />
        </div>
        <MagneticButton variant="gold" onClick={addLink} fullWidth>Add Navigation Link</MagneticButton>
      </GlassCard>
    </div>
  )
}

/* 15. FOOTER MANAGER (Custom text descriptions, copy right overrides) */
function AdminFooterManagerPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [footer, setFooter] = useState({ description: '', copyright: '', logoUrl: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setFooter({
        description: settings.footerConfig?.description || "Redefining luxury men's fashion and traditional wear with curated collections that blend timeless elegance with contemporary style.",
        copyright: settings.footerConfig?.copyright || `© ${new Date().getFullYear()} ${settings.shopName}. All rights reserved.`,
        logoUrl: settings.footerConfig?.logoUrl || ''
      })
    }
  }, [settings])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/api/settings', {
        ...settings,
        footerConfig: footer
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Footer settings saved!')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="max-w-xl">
      <h3 className="text-white font-display font-semibold text-lg mb-6">Footer Details Editor</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <FloatingLabel label="Footer Logo URL (optional)" value={footer.logoUrl} onChange={(e) => setFooter({ ...footer, logoUrl: e.target.value })} />
        <div>
          <label className="text-[10px] uppercase text-white/40 block mb-1">Footer Brand Text Description</label>
          <textarea
            value={footer.description}
            onChange={(e) => setFooter({ ...footer, description: e.target.value })}
            rows="3"
            className="w-full bg-[#050508] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none resize-none"
          />
        </div>
        <FloatingLabel label="Copyright Notice Text" value={footer.copyright} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} />
        <MagneticButton variant="gold" size="lg" type="submit" disabled={loading} fullWidth>{loading ? 'Saving Footer...' : 'Save Footer Settings'}</MagneticButton>
      </form>
    </GlassCard>
  )
}

/* 16. CONTACT MANAGER (Addresses, phone support coordinates) */
function AdminContactManagerPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [contact, setContact] = useState({ whatsapp: '', phone: '', address: '', instagram: '', facebook: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setContact({
        whatsapp: settings.whatsapp || '',
        phone: settings.phone || '',
        address: settings.address || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || ''
      })
    }
  }, [settings])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/api/settings', contact)
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Contact channels updated successfully!')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="max-w-xl">
      <h3 className="text-white font-display font-semibold text-lg mb-6">Contact & Social Channels</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabel label="WhatsApp Hotline" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} required />
          <FloatingLabel label="Phone Support" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
        </div>
        <FloatingLabel label="Store Address" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabel label="Instagram Profile URL" value={contact.instagram} onChange={(e) => setContact({ ...contact, instagram: e.target.value })} />
          <FloatingLabel label="Facebook Profile URL" value={contact.facebook} onChange={(e) => setContact({ ...contact, facebook: e.target.value })} />
        </div>
        <MagneticButton variant="gold" size="lg" type="submit" disabled={loading} fullWidth>Save Contact Channels</MagneticButton>
      </form>
    </GlassCard>
  )
}

/* 17. SEO MANAGER (Global titles metadata, analytics tags) */
function AdminSEOManagerPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [seo, setSeo] = useState({ title: '', description: '', keywords: '', gaTagId: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings?.seoConfig) {
      setSeo({
        title: settings.seoConfig.title || '',
        description: settings.seoConfig.description || '',
        keywords: settings.seoConfig.keywords || '',
        gaTagId: settings.seoConfig.gaTagId || ''
      })
    }
  }, [settings])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const seoConfigUpdated = { ...(settings.seoConfig || {}), ...seo }
      const res = await api.put('/api/settings', {
        ...settings,
        seoConfig: seoConfigUpdated
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('SEO metadata tags saved!')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="max-w-xl">
      <h3 className="text-white font-display font-semibold text-lg mb-6">SEO Metadata & Tagging</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <FloatingLabel label="Global Website Meta Title" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} required />
        <div>
          <label className="text-[10px] uppercase text-white/40 block mb-1">Global Page Meta Description</label>
          <textarea
            value={seo.description}
            onChange={(e) => setSeo({ ...seo, description: e.target.value })}
            rows="3"
            className="w-full bg-[#050508] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none resize-none"
          />
        </div>
        <FloatingLabel label="Metadata keywords (comma separated)" value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
        <FloatingLabel label="Google Analytics Tag ID (e.g. G-XXXX)" value={seo.gaTagId} onChange={(e) => setSeo({ ...seo, gaTagId: e.target.value })} />
        <MagneticButton variant="gold" size="lg" type="submit" disabled={loading} fullWidth>Apply SEO Metadata</MagneticButton>
      </form>
    </GlassCard>
  )
}

/* 18. NOTIFICATION MANAGER (Popups, announcers alerts) */
function AdminNotificationManagerPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [popups, setPopups] = useState({ welcomePopup: { enabled: false, title: '', text: '', delay: 3 } })
  const [announcements, setAnnouncements] = useState([])
  const [newAnnounce, setNewAnnounce] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setPopups(settings.popups || { welcomePopup: { enabled: false, title: '', text: '', delay: 3 } })
      setAnnouncements(settings.announcements || [])
    }
  }, [settings])

  const handleSavePopups = async () => {
    setLoading(true)
    try {
      const res = await api.put('/api/settings', { ...settings, popups })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Welcome popup settings saved!')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAnnouncement = async () => {
    if (!newAnnounce.trim()) return
    const updated = [...announcements, { text: newAnnounce, active: true }]
    try {
      const res = await api.put('/api/settings', { ...settings, announcements: updated })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        setAnnouncements(updated)
        setNewAnnounce('')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteAnnouncement = async (idx) => {
    const updated = announcements.filter((_, i) => i !== idx)
    try {
      const res = await api.put('/api/settings', { ...settings, announcements: updated })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        setAnnouncements(updated)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Welcome Promo Popups</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-xs font-medium text-white/80">Enable Welcome popup modal</span>
            <input
              type="checkbox"
              checked={popups.welcomePopup?.enabled || false}
              onChange={(e) => setPopups({
                ...popups,
                welcomePopup: { ...(popups.welcomePopup || {}), enabled: e.target.checked }
              })}
              className="w-4 h-4 accent-[#d4af37]"
            />
          </div>
          <FloatingLabel
            label="Popup Title"
            value={popups.welcomePopup?.title || ''}
            onChange={(e) => setPopups({
              ...popups,
              welcomePopup: { ...(popups.welcomePopup || {}), title: e.target.value }
            })}
          />
          <FloatingLabel
            label="Popup Promo Text"
            value={popups.welcomePopup?.text || ''}
            onChange={(e) => setPopups({
              ...popups,
              welcomePopup: { ...(popups.welcomePopup || {}), text: e.target.value }
            })}
          />
          <FloatingLabel
            label="Modal Delay (seconds)"
            value={popups.welcomePopup?.delay || 3}
            onChange={(e) => setPopups({
              ...popups,
              welcomePopup: { ...(popups.welcomePopup || {}), delay: parseInt(e.target.value) || 3 }
            })}
          />
          <MagneticButton variant="gold" size="sm" onClick={handleSavePopups} disabled={loading} fullWidth>
            {loading ? 'Saving...' : 'Save Popup Settings'}
          </MagneticButton>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-white font-display font-semibold text-base mb-6">Scrolling Announcement Banners</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Announcement text..."
              value={newAnnounce}
              onChange={(e) => setNewAnnounce(e.target.value)}
              className="flex-1 bg-white/[0.04] text-white border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
            />
            <button onClick={handleAddAnnouncement} className="px-3 py-1 bg-[#d4af37] text-black font-semibold rounded text-xs">
              Add
            </button>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {announcements.map((announce, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs">
                <span>{announce.text}</span>
                <button onClick={() => handleDeleteAnnouncement(idx)} className="text-rose-400 hover:text-rose-300">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

/* 19. SECURITY MANAGER (Activity logs db logs) */
function AdminSecurityManagerPanel() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/logs')
      .then(res => setLogs(res.data || res))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <GlassCard>
      <h3 className="text-white font-display font-semibold text-lg mb-6">Admin activity auditing logs</h3>
      {loading ? (
        <div className="min-h-[20vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center text-white/20 text-xs py-8">
          No audits found in database logs.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/70 border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-white/40">
                <th className="pb-3 px-2">Admin Account</th>
                <th className="pb-3 px-2">Action performed</th>
                <th className="pb-3 px-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                  <td className="py-3 px-2 font-medium text-white text-xs">{log.user?.email || 'Admin User'}</td>
                  <td className="py-3 px-2 text-xs">{log.action}</td>
                  <td className="py-3 px-2 text-xs text-white/40">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  )
}

/* 20. BACKUP MANAGER (Export / restore settings backup) */
function AdminBackupManagerPanel() {
  const [loading, setLoading] = useState(false)

  const handleExportBackup = async () => {
    try {
      const res = await api.get('/api/admin/backup/export')
      const backupData = res.data || res
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `style_inverse_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      alert('Failed to export backup: ' + err.message)
    }
  }

  const handleImportBackup = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const backupJson = JSON.parse(evt.target.result)
        const payload = backupJson.data || backupJson
        setLoading(true)
        const res = await api.post('/api/admin/backup/import', payload)
        if (res.success) {
          alert('Database restored successfully! Reloading...')
          window.location.reload()
        }
      } catch (err) {
        alert('Failed to parse or restore database JSON backup: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <GlassCard className="max-w-xl">
      <h3 className="text-white font-display font-semibold text-lg mb-6">Database Backup Control Center</h3>
      <p className="text-xs text-white/40 leading-relaxed mb-6">
        Export the complete database contents (settings, layout builders, products listings, categories records, order logs) into a single downloadable JSON backup file. Upload any valid JSON backup file to restore the website back in time.
      </p>
      <div className="space-y-4">
        <MagneticButton variant="gold" onClick={handleExportBackup} fullWidth>📥 Download Complete DB Backup</MagneticButton>
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
          />
          <button className="w-full px-6 py-3 text-xs font-semibold uppercase bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white/90" disabled={loading}>
            {loading ? 'Restoring Database...' : '📤 Upload & Restore Backup'}
          </button>
        </div>
      </div>
    </GlassCard>
  )
}

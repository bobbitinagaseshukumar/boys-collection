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

  // Guard access: Only admins can view this page
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin')
    } else if (user.role !== 'ADMIN') {
      navigate('/')
    }
  }, [user, navigate])

  const [activeTab, setActiveTab] = useState('Dashboard')
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
    { name: 'Dashboard', icon: '📊' },
    { name: 'Website Builder', icon: '🎨' },
    { name: 'Products', icon: '🛍️' },
    { name: 'Categories', icon: '📁' },
    { name: 'Orders', icon: '📦' },
    { name: 'WhatsApp Orders', icon: '💬' },
    { name: 'Customers', icon: '👥' },
    { name: 'Reviews', icon: '⭐' },
    { name: 'Inventory', icon: '📥' },
    { name: 'Marketing', icon: '📢' },
    { name: 'Media Library', icon: '📂' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Logs & Backups', icon: '🛡️' }
  ]

  return (
    <div className="page-container min-h-screen bg-[#050508] text-white flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 top-[70px] bottom-0 bg-[#0a0a0f]/90 border-r border-white/5 backdrop-blur-2xl z-40 flex flex-col justify-between overflow-hidden"
      >
        <div className="py-6">
          <div className="flex items-center justify-between px-6 mb-8">
            {!isSidebarCollapsed && (
              <span className="font-display font-bold text-xs uppercase tracking-widest text-[#d4af37]">Jeshuvesre Panel</span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-white/40 hover:text-white transition-colors"
            >
              {isSidebarCollapsed ? '➡️' : '⬅️'}
            </button>
          </div>

          <nav className="space-y-1.5 px-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-display text-sm font-medium ${
                  activeTab === item.name
                    ? 'bg-[#d4af37] text-[#0a0a0f] shadow-[0_0_15px_rgba(212,175,55,0.25)] font-bold'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-display text-sm"
          >
            <span>🚪</span>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 transition-all duration-300" style={{ marginLeft: isSidebarCollapsed ? '80px' : '260px' }}>
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
              {activeTab === 'Dashboard' && (
                <AdminDashboardHome stats={stats} setActiveTab={setActiveTab} />
              )}
              {activeTab === 'Website Builder' && (
                <AdminWebsiteBuilderPanel />
              )}
              {activeTab === 'Products' && (
                <AdminProductsPanel products={products} setProducts={setProducts} categories={categories} />
              )}
              {activeTab === 'Categories' && (
                <AdminCategoriesPanel categories={categories} setCategories={setCategories} />
              )}
              {activeTab === 'Orders' && (
                <AdminOrdersPanel orders={orders} setOrders={setOrders} />
              )}
              {activeTab === 'WhatsApp Orders' && (
                <AdminWhatsAppOrdersPanel whatsappOrders={whatsappOrders} setWhatsappOrders={setWhatsappOrders} />
              )}
              {activeTab === 'Customers' && (
                <AdminCustomersPanel customers={customers} />
              )}
              {activeTab === 'Reviews' && (
                <AdminReviewsPanel reviews={reviews} setReviews={setReviews} />
              )}
              {activeTab === 'Inventory' && (
                <AdminInventoryPanel products={products} setProducts={setProducts} />
              )}
              {activeTab === 'Marketing' && (
                <AdminMarketingPanel />
              )}
              {activeTab === 'Media Library' && (
                <AdminMediaLibraryPanel />
              )}
              {activeTab === 'Analytics' && (
                <AdminAnalyticsPanel />
              )}
              {activeTab === 'Settings' && (
                <AdminSettingsPanel />
              )}
              {activeTab === 'Logs & Backups' && (
                <AdminLogsAndBackupsPanel />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

/* 1. DASHBOARD HOME SUBCOMPONENT */
function AdminDashboardHome({ stats, setActiveTab }) {
  const cards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-amber-500/20 to-yellow-500/5' },
    { title: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'from-blue-500/20 to-indigo-500/5' },
    { title: 'Total Products', value: stats.totalProducts, icon: '🛍️', color: 'from-emerald-500/20 to-teal-500/5' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: 'from-purple-500/20 to-pink-500/5' }
  ]

  return (
    <div className="space-y-8">
      {/* Dynamic Count Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((c) => (
          <motion.div
            key={c.title}
            whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
            className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${c.color} shadow-xl relative overflow-hidden`}
          >
            <span className="text-4xl absolute right-4 top-4 opacity-30">{c.icon}</span>
            <p className="text-white/40 text-xs font-display uppercase tracking-widest">{c.title}</p>
            <motion.h3
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-2xl md:text-3xl font-display font-extrabold text-white mt-2"
            >
              {c.value}
            </motion.h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-display font-bold text-lg">Recent Orders</h3>
            <button onClick={() => setActiveTab('Orders')} className="text-[#d4af37] text-xs hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                <div>
                  <p className="text-white text-sm font-medium">{o.orderNumber}</p>
                  <p className="text-white/30 text-xs">{o.user?.name || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#d4af37] font-semibold text-sm">₹{o.totalAmount.toLocaleString()}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{o.paymentStatus}</span>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-white/20 text-sm">No orders recorded yet.</p>}
          </div>
        </GlassCard>

        {/* Low Stock Alerts */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-display font-bold text-lg">Low Stock Alerts</h3>
            <button onClick={() => setActiveTab('Inventory')} className="text-[#d4af37] text-xs hover:underline">Manage Stock</button>
          </div>
          <div className="space-y-4">
            {stats.lowStockProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="flex justify-between items-center p-3 rounded-xl border border-red-500/10 bg-red-500/[0.02]">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0]?.url || p.images?.[0] || 'https://placehold.co/50'} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-white text-sm font-medium">{p.title}</p>
                    <p className="text-white/30 text-xs">{p.brand}</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 font-bold">{p.stock} Left</span>
              </div>
            ))}
            {stats.lowStockProducts.length === 0 && <p className="text-white/20 text-sm">All inventory is fully stocked!</p>}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

/* 2. PRODUCTS CRUD SUBCOMPONENT */
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
    images: ''
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
      images: p.images ? p.images.map(img => img.url || img).join(', ') : ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await api.delete(`/api/products/${id}`)
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product.')
    }
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
        images: formData.images ? formData.images.split(',').map(u => u.trim()) : []
      }

      if (editingProduct) {
        const res = await api.put(`/api/products/${editingProduct.id}`, payload)
        if (res.success || res.data) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? (res.data || res) : p))
          alert('Product updated successfully!')
        }
      } else {
        const res = await api.post('/api/products', payload)
        if (res.success || res.data) {
          setProducts(prev => [res.data || res, ...prev])
          alert('Product created successfully!')
        }
      }
      setModalOpen(false)
      setEditingProduct(null)
    } catch (err) {
      alert(err.message || 'Failed to save product.')
    }
  }

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.categoryId.toString() === filterCat : true
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-white font-display font-bold text-xl">Product Inventory</h2>
        <MagneticButton variant="gold" onClick={() => { setEditingProduct(null); setFormData({ title: '', brand: 'STYLEX', price: '', originalPrice: '', discount: '0', stock: '50', categoryId: '1', description: '', sizes: 'S, M, L, XL', colors: '', images: '' }); setModalOpen(true) }}>+ Add New Product</MagneticButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white/[0.04] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] focus:outline-none"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-white/[0.04] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] focus:outline-none"
        >
          <option value="" className="bg-[#0a0a0f]">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id} className="bg-[#0a0a0f]">{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -8, rotateY: 2 }}
            className="rounded-2xl border border-white/5 bg-[#0a0a0f]/80 overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <img src={p.images?.[0]?.url || p.images?.[0] || 'https://placehold.co/300'} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-white/40 text-[10px] uppercase font-display tracking-widest">{p.brand}</p>
                <h4 className="text-white font-semibold text-sm line-clamp-1">{p.title}</h4>
                <p className="text-[#d4af37] font-bold text-sm">₹{p.price.toLocaleString()}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => handleEditClick(p)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs border border-white/10 transition-colors">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/20 transition-colors">🗑️</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 relative my-8">
            <button onClick={() => setModalOpen(false)} className="absolute right-4 top-4 text-white/40 hover:text-white text-lg">✕</button>
            <h3 className="text-white font-display font-bold text-lg mb-6">{editingProduct ? 'Edit Product details' : 'Add New Product'}</h3>
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
              <div>
                <label className="text-[10px] uppercase text-white/40 block mb-1">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-[#050508] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
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
                <FloatingLabel label="Sizes (e.g. S, M, L)" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} />
                <FloatingLabel label="Colors (e.g. Gold:#d4af37, Red:#ff0000)" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} />
              </div>
              <FloatingLabel label="Images URLs (comma separated)" value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} />

              <MagneticButton variant="gold" size="lg" type="submit" fullWidth>Save Changes</MagneticButton>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* 3. CATEGORIES MANAGEMENT SUBCOMPONENT */
function AdminCategoriesPanel({ categories, setCategories }) {
  const [name, setName] = useState('')
  const [themeColor, setThemeColor] = useState('#d4af37')
  const [image, setImage] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/categories', { name, slug: name.toLowerCase().replace(/ /g, '-'), themeColor, image })
      if (res.success || res.data) {
        setCategories(prev => [...prev, res.data || res])
        setName('')
        setImage('')
        alert('Category created successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to create category.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await api.delete(`/api/categories/${id}`)
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== id))
        alert('Category deleted successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to delete category.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-white font-display font-bold text-lg mb-4">Live Product Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl border border-white/5 bg-[#0a0a0f]/80 relative overflow-hidden flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-4 h-12 rounded-full" style={{ backgroundColor: c.themeColor || '#d4af37' }} />
                <div>
                  <h4 className="text-white font-display font-bold">{c.name}</h4>
                  <p className="text-white/30 text-xs">Slug: {c.slug}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300 transition-colors text-sm">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Add New Category</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <FloatingLabel label="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label className="text-[10px] uppercase text-white/40 block mb-1">Color Theme</label>
            <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-full h-12 bg-transparent border-0 rounded-lg cursor-pointer" />
          </div>
          <FloatingLabel label="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} />
          <MagneticButton variant="gold" size="lg" type="submit" fullWidth>Create Category</MagneticButton>
        </form>
      </GlassCard>
    </div>
  )
}

/* 4. ORDERS DATATABLE SUBCOMPONENT */
function AdminOrdersPanel({ orders, setOrders }) {
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/api/orders/${id}/status`, { status })
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        alert('Order status updated successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status.')
    }
  }

  return (
    <GlassCard>
      <h3 className="text-white font-display font-bold text-lg mb-6">Paid Orders Logs</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-4">Order Code</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4 px-4 font-mono text-xs">{o.orderNumber}</td>
                <td className="py-4 px-4">{o.user?.name || 'Guest'}</td>
                <td className="py-4 px-4 text-[#d4af37] font-semibold">₹{o.totalAmount.toLocaleString()}</td>
                <td className="py-4 px-4 text-xs font-bold uppercase">{o.paymentMethod}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    o.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>{o.status}</span>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="bg-[#050508] border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
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

/* 5. WHATSAPP ORDERS LOGGER SUBCOMPONENT */
function AdminWhatsAppOrdersPanel({ whatsappOrders, setWhatsappOrders }) {
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/api/orders/admin/whatsapp/${id}/status`, { status })
      if (res.success || res.data) {
        setWhatsappOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        alert('WhatsApp order status updated successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to update whatsapp order status.')
    }
  }

  const triggerCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  const triggerWhatsApp = (o) => {
    const msg = `Hello, following up regarding your WhatsApp order query for the product ${o.productName}.`
    window.open(`https://wa.me/${o.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <GlassCard>
      <h3 className="text-white font-display font-bold text-lg mb-6">WhatsApp Selling Requests</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 font-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {whatsappOrders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4 px-4 font-semibold text-white">{o.customerName}</td>
                <td className="py-4 px-4 font-mono text-xs">{o.phoneNumber}</td>
                <td className="py-4 px-4 text-white/80">{o.productName} ({o.selectedColor})</td>
                <td className="py-4 px-4 text-[#d4af37] font-semibold">₹{o.productPrice.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    o.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>{o.status}</span>
                </td>
                <td className="py-4 px-4 flex gap-2">
                  <button onClick={() => triggerWhatsApp(o)} className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-xs border border-emerald-500/20">Chat</button>
                  <button onClick={() => triggerCall(o.phoneNumber)} className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/20">Call</button>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="bg-[#050508] border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
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

/* 6. CUSTOMER DIRECTORY SUBCOMPONENT */
function AdminCustomersPanel({ customers }) {
  return (
    <GlassCard>
      <h3 className="text-white font-display font-bold text-lg mb-6">User Accounts Directory</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Orders count</th>
              <th className="py-3 px-4">Join Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4 px-4 text-white font-medium">{c.name}</td>
                <td className="py-4 px-4 text-white/60">{c.email}</td>
                <td className="py-4 px-4 text-xs font-mono">{c.phone}</td>
                <td className="py-4 px-4 text-[#d4af37] font-bold text-center">{c.ordersCount}</td>
                <td className="py-4 px-4 text-white/30 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

/* 7. REVIEW MANAGER SUBCOMPONENT */
function AdminReviewsPanel({ reviews, setReviews }) {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product review?')) return
    try {
      const res = await api.delete(`/api/reviews/${id}`)
      if (res.success) {
        setReviews(prev => prev.filter(r => r.id !== id))
        alert('Review deleted successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to delete review.')
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-white font-display font-bold text-lg">Product Reviews</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <GlassCard key={r.id} className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-semibold">{r.user?.name || 'Anonymous User'}</h4>
                  <p className="text-white/30 text-xs">For Product ID: {r.productId}</p>
                </div>
                <span className="text-yellow-400 font-display font-bold">★ {r.rating}</span>
              </div>
              <p className="text-white/60 text-sm italic font-body">"{r.comment}"</p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-4">
              <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/20 transition-colors">Delete Review</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

/* 8. INVENTORY / LOW STOCK ALERTS SUBCOMPONENT */
function AdminInventoryPanel({ products, setProducts }) {
  const handleStockOverride = async (p, val) => {
    try {
      const res = await api.put(`/api/products/${p.id}`, { ...p, stock: parseInt(val) })
      if (res.success || res.data) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: parseInt(val) } : item))
      }
    } catch (err) {
      alert(err.message || 'Failed to override stock.')
    }
  }

  return (
    <GlassCard>
      <h3 className="text-white font-display font-bold text-lg mb-6">Stock & Inventory Override</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Manual Override</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4 px-4 flex items-center gap-3">
                  <img src={p.images?.[0]?.url || p.images?.[0] || 'https://placehold.co/50'} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-white font-medium">{p.title}</p>
                    <p className="text-white/30 text-xs">{p.brand}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-white font-semibold">{p.stock} units</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    p.stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>{p.stock < 10 ? 'Low Stock' : 'Good'}</span>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => handleStockOverride(p, e.target.value)}
                    className="w-20 bg-white/[0.04] text-white border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs focus:outline-none focus:border-[#d4af37]"
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

/* 9. ANALYTICS CHARTS SUBCOMPONENT */
function AdminAnalyticsPanel() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const sales = [45, 58, 62, 78, 95, 120] // in thousands

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Sales Analytics Chart (SVG animated) */}
      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Sales Growth (₹ in Thousands)</h3>
        <div className="relative h-60 w-full flex items-end justify-between px-2 pt-6">
          {/* Vertical axis guides */}
          <div className="absolute inset-0 flex flex-col justify-between border-l border-white/5 pl-2 text-[10px] text-white/30 select-none">
            <div>120K</div>
            <div>80K</div>
            <div>40K</div>
            <div>0</div>
          </div>
          {/* Chart Columns */}
          {sales.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 z-10 flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(val / 120) * 160}px` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="w-8 bg-gradient-to-t from-[#d4af37]/20 to-[#d4af37] rounded-t-lg relative group shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <div className="absolute top-[-25px] left-1/2 translate-x-[-50%] bg-[#0a0a0f] text-[10px] text-[#d4af37] px-1.5 py-0.5 rounded border border-[#d4af37]/30 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  ₹{val}K
                </div>
              </motion.div>
              <span className="text-xs text-white/40">{months[idx]}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Customer Growth Chart (SVG animated) */}
      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Customer Registrations</h3>
        <div className="relative h-60 w-full flex items-end justify-between px-2 pt-6">
          <div className="absolute inset-0 flex flex-col justify-between border-l border-white/5 pl-2 text-[10px] text-white/30 select-none">
            <div>150</div>
            <div>100</div>
            <div>50</div>
            <div>0</div>
          </div>
          {[15, 28, 42, 60, 85, 110].map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 z-10 flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(val / 150) * 160}px` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="w-8 bg-gradient-to-t from-blue-500/20 to-blue-400 rounded-t-lg relative group shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <div className="absolute top-[-25px] left-1/2 translate-x-[-50%] bg-[#0a0a0f] text-[10px] text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {val}
                </div>
              </motion.div>
              <span className="text-xs text-white/40">{months[idx]}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

/* 10. SETTINGS SUBCOMPONENT */
function AdminSettingsPanel() {
  const { settings, refreshSettings, updateSettingsLocally } = useSettings()
  const [formData, setFormData] = useState({
    shopName: '',
    whatsapp: '',
    phone: '',
    address: '',
    instagram: '',
    facebook: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData({
        shopName: settings.shopName || '',
        whatsapp: settings.whatsapp || '',
        phone: settings.phone || '',
        address: settings.address || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || ''
      })
    }
  }, [settings])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/api/settings', formData)
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Configurations updated successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to save configurations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="max-w-xl">
      <h3 className="text-white font-display font-bold text-lg mb-6">Store & Contact Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FloatingLabel label="Shop Name" value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabel label="WhatsApp Number" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} required />
          <FloatingLabel label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
        </div>
        <FloatingLabel label="Shop Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabel label="Instagram URL" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} />
          <FloatingLabel label="Facebook URL" value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} />
        </div>
        <MagneticButton variant="gold" size="lg" type="submit" disabled={loading} fullWidth>{loading ? 'Saving...' : 'Save Configurations'}</MagneticButton>
      </form>
    </GlassCard>
  )
}

/* 11. WEBSITE BUILDER SUBCOMPONENT */
function AdminWebsiteBuilderPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [layout, setLayout] = useState([])
  const [hero, setHero] = useState({ headline: '', subheadline: '', bgImage: '', buttonText: '', buttonLink: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setLayout((settings.homepageLayout && settings.homepageLayout.length > 0) ? settings.homepageLayout : [
        { id: 'hero', name: 'Hero Section', enabled: true, order: 0 },
        { id: 'new-arrivals', name: 'New Arrivals', enabled: true, order: 1 },
        { id: 'trending', name: 'Trending Products', enabled: true, order: 2 },
        { id: 'categories', name: 'Categories', enabled: true, order: 3 },
        { id: 'special-offers', name: 'Special Offers', enabled: true, order: 4 },
        { id: 'testimonials', name: 'Testimonials', enabled: true, order: 5 },
        { id: 'newsletter', name: 'Newsletter', enabled: true, order: 6 }
      ])
      setHero(settings.seoConfig?.hero || {
        headline: 'REDEFINE YOUR STYLE',
        subheadline: 'Discover the latest premium fashion statements curated for men and traditional wear.',
        bgImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974',
        buttonText: 'Explore Collections',
        buttonLink: '/shop'
      })
    }
  }, [settings])

  const toggleSection = (id) => {
    const updated = layout.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    setLayout(updated)
  }

  const moveSection = (idx, direction) => {
    if (idx + direction < 0 || idx + direction >= layout.length) return
    const updated = [...layout]
    const temp = updated[idx]
    updated[idx] = updated[idx + direction]
    updated[idx + direction] = temp
    const ordered = updated.map((s, i) => ({ ...s, order: i }))
    setLayout(ordered)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const seoConfigUpdated = { ...(settings.seoConfig || {}), hero }
      const res = await api.put('/api/settings', {
        ...settings,
        homepageLayout: layout,
        seoConfig: seoConfigUpdated
      })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Website builder configurations saved successfully!')
      }
    } catch (err) {
      alert(err.message || 'Failed to save website builder settings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Homepage Sections Manager */}
      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Homepage Layout Sections</h3>
        <div className="space-y-4">
          {layout.map((sect, idx) => (
            <div key={sect.id} className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-sm">#{idx + 1}</span>
                <span className="font-medium text-sm text-white/90">{sect.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveSection(idx, -1)}
                  disabled={idx === 0}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/70 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveSection(idx, 1)}
                  disabled={idx === layout.length - 1}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/70 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ▼
                </button>
                <button
                  onClick={() => toggleSection(sect.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    sect.enabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {sect.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Hero Visual Customizer */}
      <GlassCard className="flex flex-col justify-between">
        <div>
          <h3 className="text-white font-display font-bold text-lg mb-6">Hero Section Customizer</h3>
          <div className="space-y-4">
            <FloatingLabel label="Headline text" value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
            <FloatingLabel label="Subheadline text" value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} />
            <FloatingLabel label="Background Image URL" value={hero.bgImage} onChange={(e) => setHero({ ...hero, bgImage: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <FloatingLabel label="Button Text" value={hero.buttonText} onChange={(e) => setHero({ ...hero, buttonText: e.target.value })} />
              <FloatingLabel label="Button Redirect Link" value={hero.buttonLink} onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <MagneticButton variant="gold" disabled={loading} onClick={handleSave} fullWidth>
            {loading ? 'Saving Layout...' : 'Save Visual Builder Settings'}
          </MagneticButton>
        </div>
      </GlassCard>
    </div>
  )
}

/* 12. MARKETING & OFFERS SUBCOMPONENT */
function AdminMarketingPanel() {
  const { settings, updateSettingsLocally } = useSettings()
  const [coupons, setCoupons] = useState([])
  const [popups, setPopups] = useState({ welcomePopup: { enabled: false, title: '', text: '', delay: 3 } })
  const [announcements, setAnnouncements] = useState([])
  const [newAnnounce, setNewAnnounce] = useState('')
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 10, minOrder: 500, endDate: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setPopups(settings.popups || { welcomePopup: { enabled: false, title: '', text: '', delay: 3 } })
      setAnnouncements(settings.announcements || [])
    }
    api.get('/api/coupons')
      .then(res => setCoupons(res.data || res.coupons || res))
      .catch(err => console.error(err))
  }, [settings])

  const handleSavePopups = async () => {
    setLoading(true)
    try {
      const res = await api.put('/api/settings', { ...settings, popups })
      if (res.success || res.data) {
        updateSettingsLocally(res.data || res)
        alert('Popup configurations updated!')
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

  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/coupons', newCoupon)
      alert('Coupon created successfully!')
      setNewCoupon({ code: '', discount: 10, minOrder: 500, endDate: '' })
      // Reload coupons list
      const res = await api.get('/api/coupons')
      setCoupons(res.data || res.coupons || res)
    } catch (err) {
      alert(err.message || 'Failed to create coupon.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Popups Customizer */}
      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Welcome & Promo Popups</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-sm font-medium text-white/80">Enable Welcome Popup</span>
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
            label="Popup Description Text"
            value={popups.welcomePopup?.text || ''}
            onChange={(e) => setPopups({
              ...popups,
              welcomePopup: { ...(popups.welcomePopup || {}), text: e.target.value }
            })}
          />
          <FloatingLabel
            label="Timing Delay (seconds)"
            value={popups.welcomePopup?.delay || 3}
            onChange={(e) => setPopups({
              ...popups,
              welcomePopup: { ...(popups.welcomePopup || {}), delay: parseInt(e.target.value) || 3 }
            })}
          />
          <MagneticButton variant="gold" size="sm" onClick={handleSavePopups} disabled={loading} fullWidth>
            {loading ? 'Saving Popup...' : 'Save Popup Settings'}
          </MagneticButton>
        </div>
      </GlassCard>

      {/* Announcements Manager */}
      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Scrolling Announcement Tickers</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Announce banner text..."
              value={newAnnounce}
              onChange={(e) => setNewAnnounce(e.target.value)}
              className="flex-1 bg-white/[0.04] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
            />
            <button onClick={handleAddAnnouncement} className="px-3 bg-[#d4af37] text-black font-semibold rounded-lg text-sm hover:bg-[#e0bf4a]">
              Add
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {announcements.map((announce, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-xs text-white/70 max-w-[200px] truncate">{announce.text}</span>
                <button onClick={() => handleDeleteAnnouncement(idx)} className="text-xs text-rose-400 hover:text-rose-300">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Coupons Creator */}
      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Create Discount Coupon</h3>
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <FloatingLabel label="Coupon Code" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} required />
          <div className="grid grid-cols-2 gap-4">
            <FloatingLabel label="Discount %" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) || 0 })} required />
            <FloatingLabel label="Min Order Value (₹)" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: parseFloat(e.target.value) || 0 })} required />
          </div>
          <FloatingLabel label="End Date" type="date" value={newCoupon.endDate} onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })} required />
          <MagneticButton variant="gold" size="sm" type="submit" fullWidth>Create Coupon</MagneticButton>
        </form>
      </GlassCard>
    </div>
  )
}

/* 13. MEDIA CENTER SUBCOMPONENT */
function AdminMediaLibraryPanel() {
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('All')
  const folders = ['All', 'Products', 'Categories', 'Banners', 'Marketing']
  const mockMedia = [
    { name: 'silk_saree_hero.jpg', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600', folder: 'Products', size: '240 KB' },
    { name: 'designer_suit_banner.jpg', url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600', folder: 'Banners', size: '420 KB' },
    { name: 'diwali_discount_card.png', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600', folder: 'Marketing', size: '180 KB' },
    { name: 'category_men_shirts.jpg', url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600', folder: 'Categories', size: '120 KB' }
  ]

  const filtered = mockMedia.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesFolder = selectedFolder === 'All' || item.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  return (
    <GlassCard className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-display font-bold text-lg">Central Media Library</h3>
          <p className="text-white/40 text-xs mt-0.5">Manage and organize all uploaded catalog photos and campaign banner assets.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.04] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] w-full md:w-48"
          />
          <button className="px-4 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-sm hover:bg-white/10 whitespace-nowrap">
            📤 Upload File
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 border-b border-white/5 mb-6">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="group relative bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300">
            <img src={item.url} alt={item.name} className="w-full h-32 object-cover" />
            <div className="p-3">
              <p className="text-xs text-white/80 font-medium truncate mb-0.5">{item.name}</p>
              <div className="flex justify-between items-center text-[10px] text-white/30">
                <span>{item.folder}</span>
                <span>{item.size}</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-[#0a0a0f]/80 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => navigator.clipboard.writeText(item.url).then(() => alert('Image URL copied to clipboard!'))} className="p-1.5 bg-white/10 hover:bg-white/20 text-xs rounded border border-white/10">
                🔗 Copy URL
              </button>
              <button className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs rounded border border-rose-500/30">
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

/* 14. SECURITY LOGS & BACKUPS SUBCOMPONENT */
function AdminLogsAndBackupsPanel() {
  const [loading, setLoading] = useState(false)

  const mockLogs = [
    { user: 'nagaseshukumarbobbiti@gmail.com', action: 'Update settings metadata logo text', time: 'Just now', ip: '103.45.67.92' },
    { user: 'nagaseshukumarbobbiti@gmail.com', action: 'Change homepage Hero title', time: '10 mins ago', ip: '103.45.67.92' },
    { user: 'nagaseshukumarbobbiti@gmail.com', action: 'Verify order #1002 payment status', time: '1 hour ago', ip: '103.45.67.92' },
    { user: 'nagaseshukumarbobbiti@gmail.com', action: 'Delete old product code #9203', time: 'Yesterday', ip: '103.45.67.92' }
  ]

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
          alert('Database restored successfully! Reloading to apply changes.')
          window.location.reload()
        }
      } catch (err) {
        alert('Invalid backup payload or restore failed: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Activity Logs */}
      <GlassCard className="lg:col-span-2">
        <h3 className="text-white font-display font-bold text-lg mb-6">Admin Activity Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs font-semibold uppercase tracking-wider">
                <th className="pb-3">Admin</th>
                <th className="pb-3">Action performed</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log, idx) => (
                <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                  <td className="py-3 font-medium text-white/90 text-xs">{log.user}</td>
                  <td className="py-3 text-xs">{log.action}</td>
                  <td className="py-3 text-xs text-white/40">{log.time}</td>
                  <td className="py-3 text-xs text-mono text-white/30">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Backup controls */}
      <GlassCard>
        <h3 className="text-white font-display font-bold text-lg mb-6">Database Backup Suite</h3>
        <div className="space-y-6">
          <p className="text-xs text-white/40 leading-relaxed">
            Create full JSON snapshot backups of the catalog database (Products, Settings, Reviews, Categories, and Orders). Restore from any backup file instantly.
          </p>
          <div className="space-y-4">
            <MagneticButton variant="gold" onClick={handleExportBackup} fullWidth>
              📥 Download DB Backup
            </MagneticButton>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
              />
              <button className="w-full px-6 py-3 text-sm font-semibold uppercase bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white/90" disabled={loading}>
                {loading ? 'Restoring Database...' : '📤 Upload & Restore Backup'}
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/slices/authSlice'
import { api } from '@/utils/api'
import GlassCard from '@/components/ui/GlassCard'
import FloatingLabel from '@/components/ui/FloatingLabel'
import MagneticButton from '@/components/ui/MagneticButton'

const TABS = ['Profile', 'Orders', 'Addresses', 'Settings']

const mockOrders = [
  { id: 'STX-584921', date: '2026-06-15', status: 'Delivered', total: 7498, items: 2 },
  { id: 'STX-583104', date: '2026-06-08', status: 'Shipped', total: 4999, items: 1 },
  { id: 'STX-581290', date: '2026-05-28', status: 'Delivered', total: 12497, items: 3 },
]

const statusColors = { Delivered: 'text-emerald-400 bg-emerald-400/10', Shipped: 'text-blue-400 bg-blue-400/10', Processing: 'text-yellow-400 bg-yellow-400/10', Cancelled: 'text-red-400 bg-red-400/10' }

export default function ProfilePage() {
  const user = useSelector(selectUser)
  const tabsList = user?.role === 'ADMIN' ? [...TABS, 'Admin Panel'] : TABS

  const [activeTab, setActiveTab] = useState(0)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    document.title = 'Profile | STYLEX'
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="container-premium max-w-4xl mx-auto">
        {/* Profile Header */}
        <GlassCard className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/5 flex items-center justify-center text-[#d4af37] font-display font-bold text-2xl border border-[#d4af37]/20">
              {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-white font-display font-bold text-xl">{profile.name}</h1>
              <p className="text-white/40 text-sm">{profile.email}</p>
              <p className="text-white/20 text-xs mt-1">Member since June 2026</p>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
          {tabsList.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 text-sm font-display font-medium rounded-lg transition-all whitespace-nowrap min-h-[44px] ${
                activeTab === i ? 'bg-[#d4af37] text-[#0a0a0f]' : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
              }`}
              data-cursor="hover"
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
            {activeTab === 0 && (
              <GlassCard>
                <h2 className="text-white font-display font-bold text-lg mb-6">Edit Profile</h2>
                <div className="space-y-4 max-w-md">
                  <FloatingLabel label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <FloatingLabel label="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} type="email" />
                  <FloatingLabel label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} type="tel" />
                  <MagneticButton variant="gold">Save Changes</MagneticButton>
                </div>
              </GlassCard>
            )}

            {activeTab === 1 && (
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <GlassCard key={order.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <p className="text-white font-display font-semibold">{order.id}</p>
                        <p className="text-white/30 text-xs">{order.date} · {order.items} items</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="text-[#d4af37] font-display font-bold">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {activeTab === 2 && (
              <GlassCard>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-white font-display font-bold text-lg">Saved Addresses</h2>
                  <MagneticButton variant="outline" size="sm">+ Add New</MagneticButton>
                </div>
                <div className="p-4 rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.03]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium text-sm flex items-center gap-2">Home <span className="text-[10px] px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] rounded-full">Default</span></p>
                      <p className="text-white/40 text-xs mt-1">42, Marine Drive, South Mumbai, Maharashtra - 400020</p>
                      <p className="text-white/30 text-xs mt-0.5">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeTab === 3 && (
              <GlassCard>
                <h2 className="text-white font-display font-bold text-lg mb-6">Settings</h2>
                <div className="space-y-4">
                  {['Email Notifications', 'Push Notifications', 'Order Updates'].map((setting) => (
                    <div key={setting} className="flex items-center justify-between py-2">
                      <span className="text-white/60 text-sm">{setting}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-[#d4af37] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {activeTab === 4 && user?.role === 'ADMIN' && (
              <AdminPanel />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function AdminPanel() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '0',
    brand: 'STYLEX',
    stock: '50',
    categoryId: '1',
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    images: '',
    colors: '',
    sizes: 'S, M, L, XL',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/api/categories')
      .then(res => {
        const cats = res.categories || res.data || res
        setCategories(cats)
        if (cats.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: cats[0].id.toString() }))
        }
      })
      .catch(err => console.error(err))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const colorsFormatted = formData.colors
        ? formData.colors.split(',').map(c => {
            const parts = c.split(':')
            const name = parts[0]?.trim() || 'Color'
            const code = parts[1]?.trim() || parts[0]?.trim()
            return { name, code }
          })
        : [{ name: 'Default', code: '#d4af37' }]

      const sizesFormatted = formData.sizes
        ? formData.sizes.split(',').map(s => s.trim())
        : ['S', 'M', 'L']

      const imagesFormatted = formData.images
        ? formData.images.split(',').map(u => u.trim())
        : ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80']

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        discount: parseFloat(formData.discount),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        images: imagesFormatted,
        colors: colorsFormatted,
        sizes: sizesFormatted
      }

      const res = await api.post('/api/products', payload)
      if (res.success || res.data) {
        setMsg({ type: 'success', text: 'Product created successfully!' })
        setFormData({
          title: '',
          description: '',
          price: '',
          originalPrice: '',
          discount: '0',
          brand: 'STYLEX',
          stock: '50',
          categoryId: categories[0]?.id?.toString() || '1',
          isFeatured: false,
          isTrending: false,
          isNewArrival: false,
          images: '',
          colors: '',
          sizes: 'S, M, L, XL',
        })
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed to create product.' })
      }
    } catch (error) {
      setMsg({ type: 'error', text: error.message || 'Error occurred while creating product.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard>
      <h2 className="text-white font-display font-bold text-lg mb-6">Admin Panel — Upload New Product</h2>
      {msg && (
        <div className={`p-4 mb-6 rounded-xl border text-sm ${
          msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {msg.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabel label="Product Title" name="title" value={formData.title} onChange={handleChange} required />
          <FloatingLabel label="Brand Name" name="brand" value={formData.brand} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingLabel label="Selling Price (₹)" name="price" type="number" value={formData.price} onChange={handleChange} required />
          <FloatingLabel label="Original Price (₹)" name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} required />
          <FloatingLabel label="Discount (%)" name="discount" type="number" value={formData.discount} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-[10px] uppercase text-white/40 tracking-wider block mb-1">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full bg-[#0a0a0f] text-white border border-white/10 rounded-lg p-3 text-sm focus:border-[#d4af37] focus:outline-none"
              required
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <FloatingLabel label="Stock Quantity" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
        </div>

        <div>
          <label className="text-[10px] uppercase text-white/40 tracking-wider block mb-1">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a premium description..."
            className="w-full bg-[#0a0a0f] text-white border border-white/10 rounded-lg p-3 text-sm focus:border-[#d4af37] focus:outline-none resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingLabel label="Sizes (e.g. S, M, L)" name="sizes" value={formData.sizes} onChange={handleChange} />
          <FloatingLabel label="Colors (e.g. Gold:#d4af37, Black:#000)" name="colors" value={formData.colors} onChange={handleChange} />
          <FloatingLabel label="Image URLs (comma separated)" name="images" value={formData.images} onChange={handleChange} />
        </div>

        <div className="flex flex-wrap gap-6 py-2 border-y border-white/5">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="accent-[#d4af37]" />
            Featured Product
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white">
            <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="accent-[#d4af37]" />
            Trending Product
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white">
            <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="accent-[#d4af37]" />
            New Arrival
          </label>
        </div>

        <MagneticButton variant="gold" size="lg" type="submit" disabled={loading} fullWidth>
          {loading ? 'Uploading...' : 'Publish Product'}
        </MagneticButton>
      </form>
    </GlassCard>
  )
}

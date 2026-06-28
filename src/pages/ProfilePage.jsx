import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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
  const [activeTab, setActiveTab] = useState(0)
  const [profile, setProfile] = useState({ name: 'Arjun Malhotra', email: 'arjun@stylex.in', phone: '+91 98765 43210' })

  useEffect(() => { document.title = 'Profile | STYLEX' }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-16 min-h-screen">
      <div className="container-premium max-w-4xl mx-auto">
        {/* Profile Header */}
        <GlassCard className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/5 flex items-center justify-center text-[#d4af37] font-display font-bold text-2xl border border-[#d4af37]/20">
              AM
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
          {TABS.map((tab, i) => (
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
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleMobileMenu } from '@/redux/slices/uiSlice'

const menuLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/shop', label: 'Shop', icon: '🛍️' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/wishlist', label: 'Wishlist', icon: '❤️' },
  { to: '/login', label: 'Login', icon: '👤' },
  { to: '/profile', label: 'Profile', icon: '⚙️' },
]

export default function MobileMenu() {
  const isOpen = useSelector((s) => s.ui.isMobileMenuOpen)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isOpen) dispatch(toggleMobileMenu()) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, dispatch])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-[#050508]/95 backdrop-blur-2xl"
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => dispatch(toggleMobileMenu())}
            className="absolute top-5 right-5 p-3 text-white/60 hover:text-white transition-colors z-10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </motion.button>

          {/* Menu Content */}
          <div className="flex flex-col items-center justify-center h-full px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <span className="text-3xl font-display font-extrabold tracking-[0.15em] text-gradient-gold">
                STYLEX
              </span>
            </motion.div>

            {/* Links */}
            <nav className="flex flex-col items-center gap-1 w-full max-w-xs">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full"
                >
                  <NavLink
                    to={link.to}
                    onClick={() => dispatch(toggleMobileMenu())}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-display font-medium tracking-wide transition-all duration-300 ${
                        isActive
                          ? 'text-[#d4af37] bg-[#d4af37]/[0.08]'
                          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 mt-12"
            >
              {['Instagram', 'Twitter', 'YouTube'].map((s) => (
                <span key={s} className="text-white/20 text-xs">{s}</span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

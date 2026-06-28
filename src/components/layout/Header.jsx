import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartCount } from '@/redux/slices/cartSlice'
import { toggleMobileMenu, toggleSearch } from '@/redux/slices/uiSlice'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const cartCount = useSelector(selectCartCount)
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const dispatch = useDispatch()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?category=shirts', label: 'Categories' },
    { to: '/about', label: 'About' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="container-premium flex items-center justify-between h-[70px] md:h-[70px]">
        {/* Logo */}
        <Link to="/" className="relative z-10" data-cursor="hover">
          <span className="text-2xl md:text-3xl font-display font-extrabold tracking-[0.15em] text-gradient-gold">
            STYLEX
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              data-cursor="hover"
              className={({ isActive }) =>
                `relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                  isActive ? 'text-[#d4af37]' : 'text-white/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#d4af37]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          <button
            onClick={() => dispatch(toggleSearch())}
            className="p-2 text-white/60 hover:text-white transition-colors hidden md:block"
            data-cursor="hover"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-2 text-white/60 hover:text-white transition-colors" data-cursor="hover">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            {wishlistItems.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#d4af37] text-[#0a0a0f] text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {wishlistItems.length}
              </motion.span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-white/60 hover:text-white transition-colors" data-cursor="hover">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#d4af37] text-[#0a0a0f] text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 hover:bg-white/5"
            data-cursor="hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Login
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            data-cursor="hover"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className="block h-[2px] w-full bg-current transition-transform" />
              <span className="block h-[2px] w-3/4 bg-current transition-all" />
              <span className="block h-[2px] w-full bg-current transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  )
}

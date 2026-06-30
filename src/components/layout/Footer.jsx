import { Link } from 'react-router-dom'
import { useSettings } from '@/hooks/useSettings'

export default function Footer() {
  const { settings } = useSettings()

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/profile', label: 'My Account' },
    { to: '/cart', label: 'Cart' },
    { to: '/wishlist', label: 'Wishlist' },
  ]

  const categories = [
    { to: '/shop?category=shirts', label: 'Shirts' },
    { to: '/shop?category=pants', label: 'Pants' },
    { to: '/shop?category=jeans', label: 'Jeans' },
    { to: '/shop?category=tshirts', label: 'T-Shirts' },
    { to: '/shop?category=hoodies', label: 'Hoodies' },
    { to: '/shop?category=jackets', label: 'Jackets' },
  ]

  const footer = settings.footerConfig || {}
  const description = footer.description || "Redefining luxury men's fashion and traditional wear with curated collections that blend timeless elegance with contemporary style."
  const copyright = footer.copyright || `© ${new Date().getFullYear()} ${settings.shopName}. All rights reserved.`
  
  const socialLinks = footer.socials || [
    { label: 'Instagram', href: settings.instagram || 'https://instagram.com/style_inverse', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z' },
    { label: 'Facebook', href: settings.facebook || 'https://facebook.com/style_inverse', path: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z' }
  ]

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050508]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#0a0a12] to-transparent pointer-events-none" />

      <div className="container-premium relative z-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              {footer.logoUrl ? (
                <img src={footer.logoUrl} alt={settings.shopName} className="h-8 object-contain" />
              ) : (
                <span className="text-xl font-display font-extrabold tracking-wider text-gradient-gold">
                  {settings.shopName}
                </span>
              )}
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              {description}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-[#d4af37] hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 transition-all duration-300"
                  data-cursor="hover"
                  aria-label={social.label}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={social.path || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#d4af37] font-display font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/40 hover:text-white text-sm transition-colors duration-300" data-cursor="hover">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#d4af37] font-display font-semibold text-sm uppercase tracking-wider mb-5">Categories</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.to}>
                  <Link to={cat.to} className="text-white/40 hover:text-white text-sm transition-colors duration-300" data-cursor="hover">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-[#d4af37] font-display font-semibold text-sm uppercase tracking-wider mb-5">Stay Connected</h4>
            <div className="space-y-4">
              <p className="text-white/40 text-sm">Get exclusive offers and updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/[0.04] border border-white/10 border-r-0 rounded-l-lg px-3 py-2.5 text-sm text-white/80 outline-none focus:border-[#d4af37]/40 transition-colors min-h-[44px]"
                />
                <button className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-[#d4af37] text-[#0a0a0f] text-lg rounded-r-lg hover:bg-[#e0bf4a] transition-colors" data-cursor="hover">
                  →
                </button>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-white/30 text-xs flex items-start gap-2 max-w-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  {settings.address}
                </p>
                <p className="text-white/30 text-xs flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  {settings.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">{copyright}</p>
          <div className="flex items-center gap-6">
            {['Terms', 'Privacy', 'Cookies'].map((link) => (
              <a key={link} href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors" data-cursor="hover">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

export default function MagneticButton({
  children,
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  className = '',
  icon,
  loading = false,
  disabled = false,
  onClick,
  href,
  type = 'button',
}) {
  const btnRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.15, y: y * 0.15 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs min-h-[36px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-base min-h-[52px]',
  }

  const variants = {
    gold: 'bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#0a0a0f] shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)]',
    outline: 'bg-transparent text-[#d4af37] border border-[#d4af37]/50 hover:bg-[#d4af37]/10 hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
    glass: 'bg-white/5 backdrop-blur-xl text-[#e8e8f0] border border-white/10 hover:bg-white/10 hover:border-white/20',
  }

  const baseClasses = `relative inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-wider rounded overflow-hidden transition-all duration-400 flex-shrink-0 whitespace-nowrap ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`

  const content = (
    <>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="text-lg">{icon}</span>}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </>
  )

  const motionProps = {
    ref: btnRef,
    className: baseClasses,
    'data-cursor': 'hover',
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 200, damping: 20 },
    whileTap: { scale: 0.96 },
    whileHover: { y: -2 },
  }

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link to={href} className="absolute inset-0 z-20" />
        {content}
      </motion.div>
    )
  }

  return (
    <motion.button {...motionProps} type={type} disabled={disabled} onClick={onClick}>
      {content}
    </motion.button>
  )
}

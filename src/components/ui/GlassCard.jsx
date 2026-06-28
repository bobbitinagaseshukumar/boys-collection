import { useRef, useState } from 'react'
import { motion } from 'motion/react'

export default function GlassCard({
  children,
  variant = 'default',
  className = '',
  hoverable = true,
  tilt = false,
  glowColor = 'rgba(212,175,55,0.15)',
  padding = 'p-6',
}) {
  const cardRef = useRef(null)
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e) => {
    if (!tilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTiltStyle({ rotateX: y * -10, rotateY: x * 10 })
  }

  const handleMouseLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0 })
  }

  const variants = {
    default: 'bg-white/[0.06] border-white/[0.1]',
    dark: 'bg-black/40 border-white/[0.06]',
    colored: 'bg-[#d4af37]/[0.06] border-[#d4af37]/[0.15]',
    transparent: 'bg-transparent border-white/[0.08]',
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${variants[variant]} ${padding} ${hoverable ? 'transition-all duration-500' : ''} ${className}`}
      style={{ perspective: tilt ? 1000 : undefined, transformStyle: tilt ? 'preserve-3d' : undefined }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={tilt ? tiltStyle : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={hoverable ? { y: -4, boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 30px ${glowColor}` } : undefined}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

import { useEffect } from 'react'
import { motion } from 'motion/react'
import MagneticButton from '@/components/ui/MagneticButton'

const floatingItems = ['👔', '👖', '👕', '🧥', '👟', '🧢', '👜', '⌚']

export default function NotFoundPage() {
  useEffect(() => { document.title = '404 | STYLEX' }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0a0a1a] to-[#0f0f20]" />

      {/* Floating fashion items */}
      {floatingItems.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-5xl md:text-6xl opacity-[0.05]"
          style={{ left: `${10 + (i * 12) % 80}%`, top: `${15 + (i * 17) % 70}%` }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.span>
      ))}

      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-[120px] md:text-[180px] font-display font-black text-gradient-gold leading-none"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white font-display font-bold text-xl md:text-2xl mb-3"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/40 text-sm mb-8 max-w-md mx-auto"
        >
          Looks like this style doesn't exist yet. Let's get you back to something fashionable.
        </motion.p>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          <MagneticButton variant="gold" size="lg" href="/">
            Back to Home
          </MagneticButton>
        </motion.div>
      </div>
    </motion.div>
  )
}

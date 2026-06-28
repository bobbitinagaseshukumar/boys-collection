import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const duration = 2200
    const interval = 20
    const step = 100 / (duration / interval)
    let current = 0

    const timer = setInterval(() => {
      current += step + Math.random() * step * 0.5
      if (current >= 100) {
        current = 100
        clearInterval(timer)
        setTimeout(() => {
          setIsComplete(true)
          setTimeout(() => onComplete?.(), 600)
        }, 300)
      }
      setProgress(current)
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  const logoText = 'STYLEX'

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="loading-screen"
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#d4af37]/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex overflow-hidden mb-2">
              {logoText.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.1 + i * 0.1,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="text-5xl md:text-7xl font-display font-extrabold tracking-[0.2em] text-gradient-gold"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/25 text-xs tracking-[0.3em] uppercase mb-10 font-body"
            >
              Luxury Men's Fashion
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5 }}
              className="loading-progress-bar"
            >
              <div
                className="loading-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1 }}
              className="text-white text-[10px] tracking-widest uppercase mt-4 font-body"
            >
              Loading luxury experience...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import AnimatedText from '@/components/ui/AnimatedText'
import GlassCard from '@/components/ui/GlassCard'
import { testimonials } from '@/data/testimonials'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const t = testimonials[current]

  return (
    <section className="section-padding relative">
      <div className="container-premium">
        <div className="text-center mb-12">
          <AnimatedText animation="fadeUp" className="text-section-title text-white mb-3" tag="h2">
            What Our Customers Say
          </AnimatedText>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <GlassCard className="text-center">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < t.rating ? '#d4af37' : 'none'} stroke="#d4af37" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <p className="text-white/60 text-sm md:text-base italic leading-relaxed mb-6 font-body">
                  "{t.comment}"
                </p>

                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10 flex items-center justify-center text-[#d4af37] font-display font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-white/80 font-display font-semibold text-sm flex items-center gap-1.5">
                      {t.name}
                      {t.verified && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4af37" className="shrink-0">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                    </p>
                    <p className="text-white/30 text-xs">{t.location}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-[#d4af37] w-6' : 'bg-white/15 hover:bg-white/30'
                }`}
                data-cursor="hover"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

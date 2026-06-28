import { useState } from 'react'
import { motion } from 'motion/react'
import AnimatedText from '@/components/ui/AnimatedText'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="section-padding relative">
      <div className="container-premium">
        <div className="max-w-2xl mx-auto">
          <GlassCard variant="colored" className="text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              <AnimatedText animation="fadeUp" className="text-2xl md:text-3xl text-white font-bold mb-3" tag="h2">
                Join the STYLEX Club
              </AnimatedText>
              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                Get exclusive early access, premium discounts, and style updates delivered to your inbox.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6"
                >
                  <span className="text-4xl mb-3 block">✨</span>
                  <p className="text-[#d4af37] font-display font-semibold text-lg">Welcome to the club!</p>
                  <p className="text-white/40 text-sm mt-1">Check your inbox for a special welcome offer.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="input-premium flex-1"
                  />
                  <MagneticButton variant="gold" type="submit">
                    Subscribe
                  </MagneticButton>
                </form>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

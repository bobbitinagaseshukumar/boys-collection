import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import AnimatedText from '@/components/ui/AnimatedText'
import GlassCard from '@/components/ui/GlassCard'
import { offers } from '@/data/offers'

function CountdownTimer({ endDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calcTime = () => {
      const diff = new Date(endDate) - new Date()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    setTime(calcTime())
    const timer = setInterval(() => setTime(calcTime()), 1000)
    return () => clearInterval(timer)
  }, [endDate])

  const units = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ]

  return (
    <div className="flex items-center gap-2">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="text-center">
            <motion.span
              key={unit.value}
              initial={{ y: -5, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              className="block text-lg md:text-xl font-display font-bold text-[#d4af37] tabular-nums"
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider">{unit.label}</span>
          </div>
          {i < units.length - 1 && <span className="text-white/20 text-lg font-light -mt-4">:</span>}
        </div>
      ))}
    </div>
  )
}

export default function SpecialOffers() {
  const [copiedCode, setCopiedCode] = useState(null)

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <section className="section-padding relative">
      <div className="container-premium">
        <div className="text-center mb-12">
          <AnimatedText animation="fadeUp" className="text-section-title text-white mb-3" tag="h2">
            Special Offers
          </AnimatedText>
          <AnimatedText animation="fadeUp" delay={0.2} className="text-section-subtitle max-w-lg mx-auto" tag="p">
            Limited time deals on premium fashion
          </AnimatedText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {offers.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} copiedCode={copiedCode} onCopy={copyCode} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OfferCard({ offer, index, copiedCode, onCopy }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.15 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <GlassCard className="relative overflow-hidden">
        {/* Floating discount badge */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 right-4 w-14 h-14 rounded-full bg-[#d4af37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <span className="text-[#0a0a0f] font-display font-extrabold text-sm">
            {offer.discount}%
          </span>
        </motion.div>

        <h3 className="text-white font-display font-bold text-xl mb-1">{offer.title}</h3>
        <p className="text-white/40 text-sm mb-4">{offer.description}</p>

        <CountdownTimer endDate={offer.endDate} />

        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 bg-white/[0.04] rounded-lg px-3 py-2 border border-dashed border-white/15 text-center">
            <span className="text-[#d4af37] font-display font-bold text-sm tracking-wider">{offer.code}</span>
          </div>
          <button
            onClick={() => onCopy(offer.code)}
            className="px-4 py-2 bg-white/[0.06] text-white/60 text-sm rounded-lg border border-white/10 hover:bg-white/10 hover:text-white transition-all min-h-[40px]"
            data-cursor="hover"
          >
            {copiedCode === offer.code ? '✓' : 'Copy'}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  )
}

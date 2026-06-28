import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import GlassCard from '@/components/ui/GlassCard'
import FloatingLabel from '@/components/ui/FloatingLabel'
import MagneticButton from '@/components/ui/MagneticButton'

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', password: '', confirm: '' })
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Register | STYLEX' }, [])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const passwordStrength = () => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-400']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strength = passwordStrength()

  const handleSubmit = () => {
    navigate('/otp')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0a0a1a] to-[#0f0f20]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,rgba(212,175,55,0.04)_0%,transparent_50%)]" />

      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-[#d4af37]/15" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
      ))}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-md">
        <GlassCard tilt>
          <div className="text-center mb-6">
            <Link to="/"><span className="text-3xl font-display font-extrabold tracking-[0.15em] text-gradient-gold">STYLEX</span></Link>
            <p className="text-white/30 text-sm mt-2">Create your account</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {['Personal', 'Contact', 'Security'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? 'bg-[#d4af37] text-[#0a0a0f]' : 'bg-white/[0.06] text-white/30'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-[2px] ${i < step ? 'bg-[#d4af37]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div className="space-y-4">
                  <FloatingLabel label="Full Name" value={form.name} onChange={update('name')} required />
                  <FloatingLabel label="Email Address" value={form.email} onChange={update('email')} type="email" required />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <FloatingLabel label="Phone Number" value={form.phone} onChange={update('phone')} type="tel" required />
                  <FloatingLabel label="City" value={form.city} onChange={update('city')} required />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <FloatingLabel label="Password" value={form.password} onChange={update('password')} type="password" required />
                  {form.password && (
                    <div>
                      <div className="flex gap-1 mb-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength - 1] : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-white/30">{strength > 0 ? strengthLabels[strength - 1] : ''}</p>
                    </div>
                  )}
                  <FloatingLabel label="Confirm Password" value={form.confirm} onChange={update('confirm')} type="password" required error={form.confirm && form.confirm !== form.password ? 'Passwords do not match' : ''} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <MagneticButton variant="glass" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</MagneticButton>
            {step < 2 ? (
              <MagneticButton variant="gold" size="sm" onClick={() => setStep(step + 1)}>Next</MagneticButton>
            ) : (
              <MagneticButton variant="gold" size="sm" onClick={handleSubmit}>Create Account</MagneticButton>
            )}
          </div>

          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{' '}<Link to="/login" className="text-[#d4af37] hover:underline">Sign In</Link>
          </p>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

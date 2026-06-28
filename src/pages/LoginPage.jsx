import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/slices/authSlice'
import GlassCard from '@/components/ui/GlassCard'
import FloatingLabel from '@/components/ui/FloatingLabel'
import MagneticButton from '@/components/ui/MagneticButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Login | STYLEX' }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      dispatch(setUser({ id: 1, name: 'Arjun Malhotra', email, avatar: null }))
      setLoading(false)
      navigate('/')
    }, 1500)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0a0a1a] to-[#0f0f20]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(79,70,229,0.04)_0%,transparent_50%)]" />

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#d4af37]/20"
          style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Floating clothes */}
      {['👔', '👖', '👕', '🧥'].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl opacity-[0.04]"
          style={{ left: `${15 + i * 20}%`, top: `${20 + (i % 2) * 40}%` }}
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard tilt variant="default" className="relative overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl border border-[#d4af37]/10 animate-[border-glow_3s_ease-in-out_infinite] pointer-events-none" />

          <div className="text-center mb-8">
            <Link to="/">
              <span className="text-3xl font-display font-extrabold tracking-[0.15em] text-gradient-gold">STYLEX</span>
            </Link>
            <p className="text-white/30 text-sm mt-2">Welcome back to luxury</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FloatingLabel label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <FloatingLabel label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-white/30 text-xs cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#d4af37]" />
                Remember me
              </label>
              <Link to="/otp" className="text-[#d4af37]/60 hover:text-[#d4af37] text-xs transition-colors">Forgot Password?</Link>
            </div>

            <MagneticButton variant="gold" size="lg" fullWidth type="submit" loading={loading}>
              Sign In
            </MagneticButton>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#d4af37] hover:underline">Register</Link>
          </p>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

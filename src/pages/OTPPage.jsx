import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verified, setVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([])
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Verify OTP | STYLEX' }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }

    if (newOtp.every((d) => d !== '')) {
      setTimeout(() => setVerified(true), 600)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    data.split('').forEach((d, i) => { newOtp[i] = d })
    setOtp(newOtp)
    if (data.length === 6) setTimeout(() => setVerified(true), 600)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0a0a1a] to-[#0f0f20]" />

      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-[#d4af37]/15" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }} />
      ))}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-md">
        <GlassCard tilt className="text-center">
          <Link to="/"><span className="text-2xl font-display font-extrabold tracking-[0.15em] text-gradient-gold">STYLEX</span></Link>

          {verified ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-6xl block my-6">✅</motion.span>
              <h2 className="text-[#d4af37] font-display font-bold text-xl mb-2">Verified!</h2>
              <p className="text-white/40 text-sm mb-6">Your account has been verified successfully</p>
              <MagneticButton variant="gold" onClick={() => navigate('/')}>Continue to STYLEX</MagneticButton>
            </motion.div>
          ) : (
            <>
              <h2 className="text-white font-display font-bold text-xl mt-6 mb-2">Verify Your Account</h2>
              <p className="text-white/40 text-sm mb-8">Enter the 6-digit code sent to your email</p>

              <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    whileFocus={{ scale: 1.05, borderColor: 'rgba(212,175,55,0.6)' }}
                    className="w-12 h-14 text-center text-xl font-display font-bold text-white bg-white/[0.04] border border-white/10 rounded-xl outline-none focus:border-[#d4af37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all"
                  />
                ))}
              </div>

              <MagneticButton variant="gold" fullWidth onClick={() => setVerified(true)}>
                Verify
              </MagneticButton>

              <p className="text-white/30 text-xs mt-5">
                {resendTimer > 0 ? (
                  <>Resend code in <span className="text-[#d4af37]">{resendTimer}s</span></>
                ) : (
                  <button onClick={() => setResendTimer(30)} className="text-[#d4af37] hover:underline">Resend Code</button>
                )}
              </p>
            </>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

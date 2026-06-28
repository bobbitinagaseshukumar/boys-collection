import { useState } from 'react'
import { motion } from 'motion/react'

export default function FloatingLabel({
  label,
  value = '',
  onChange,
  type = 'text',
  error = '',
  success = false,
  required = false,
  name,
  icon,
  disabled = false,
}) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isActive = focused || value.length > 0

  const inputType = type === 'password' && showPassword ? 'text' : type

  const borderColor = error
    ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
    : focused
    ? 'border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
    : success
    ? 'border-emerald-500/40'
    : 'border-white/10'

  return (
    <div className="relative w-full">
      <div className={`relative flex items-center bg-white/[0.04] rounded-lg border transition-all duration-300 ${borderColor}`}>
        {icon && (
          <span className="pl-4 text-white/30">{icon}</span>
        )}
        <div className="relative flex-1">
          <motion.label
            className="absolute left-4 pointer-events-none text-white/40 origin-left"
            animate={{
              y: isActive ? -22 : 0,
              scale: isActive ? 0.75 : 1,
              color: isActive ? (error ? '#ef4444' : focused ? '#d4af37' : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.4)',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {label}{required && ' *'}
          </motion.label>
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            className="w-full bg-transparent px-4 pt-5 pb-2 text-[#e8e8f0] text-[0.95rem] outline-none font-body min-h-[52px] disabled:opacity-50"
            autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
          />
        </div>
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-white/30 hover:text-white/60 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
        {success && !error && (
          <span className="pr-4 text-emerald-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-1.5 pl-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

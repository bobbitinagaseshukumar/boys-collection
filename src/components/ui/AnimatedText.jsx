import { useRef, useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function AnimatedText({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className = '',
  tag = 'h2',
  triggerOnScroll = true,
  stagger = 0.03,
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(!triggerOnScroll)

  useEffect(() => {
    if (!triggerOnScroll || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [triggerOnScroll])

  const text = typeof children === 'string' ? children.trim().replace(/\s+/g, ' ') : ''
  const Tag = tag

  if (animation === 'reveal' && text) {
    const letters = text.split('')
    return (
      <Tag ref={ref} className={`font-display ${className}`}>
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: delay + i * stagger, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </Tag>
    )
  }

  if (animation === 'fadeUp' && text) {
    const words = text.split(' ')
    return (
      <Tag ref={ref} className={`font-display ${className}`}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-2">
            <motion.span
              className="inline-block"
              initial={{ y: '100%', opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: delay + i * 0.08, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Tag>
    )
  }

  if (animation === 'gradient') {
    return (
      <Tag ref={ref} className={`font-display text-gradient-premium ${className}`}>
        {children}
      </Tag>
    )
  }

  // Default: simple fade up
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Tag className={`font-display ${className}`}>{children}</Tag>
    </motion.div>
  )
}

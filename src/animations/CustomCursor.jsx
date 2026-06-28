import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/* ──────────────────────────────────────────────
 * useMediaQuery – detect screen size
 * ────────────────────────────────────────────── */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/* ──────────────────────────────────────────────
 * Cursor variant configurations
 * ────────────────────────────────────────────── */
const CURSOR_VARIANTS = {
  default: {
    outerSize: 40,
    innerSize: 8,
    outerBorderColor: 'rgba(201, 165, 92, 0.6)',
    innerBg: '#c9a55c',
    label: '',
    outerBorderWidth: 1.5,
  },
  hover: {
    outerSize: 60,
    innerSize: 6,
    outerBorderColor: 'rgba(201, 165, 92, 0.9)',
    innerBg: '#f0d78c',
    label: '',
    outerBorderWidth: 2,
  },
  image: {
    outerSize: 80,
    innerSize: 0,
    outerBorderColor: 'rgba(255, 255, 255, 0.8)',
    innerBg: 'transparent',
    label: 'VIEW',
    outerBorderWidth: 1.5,
  },
  text: {
    outerSize: 80,
    innerSize: 0,
    outerBorderColor: 'rgba(201, 165, 92, 0.8)',
    innerBg: 'transparent',
    label: 'READ',
    outerBorderWidth: 1.5,
  },
  drag: {
    outerSize: 70,
    innerSize: 4,
    outerBorderColor: 'rgba(201, 165, 92, 0.7)',
    innerBg: '#c9a55c',
    label: 'DRAG',
    outerBorderWidth: 1.5,
  },
  hidden: {
    outerSize: 0,
    innerSize: 0,
    outerBorderColor: 'transparent',
    innerBg: 'transparent',
    label: '',
    outerBorderWidth: 0,
  },
}

/* ──────────────────────────────────────────────
 * CustomCursor Component
 *
 * Premium dual-element cursor with spring physics,
 * context-aware states, and mix-blend-mode.
 *
 * Features:
 *  - Outer ring follows with spring delay
 *  - Inner dot follows precisely
 *  - Detects data-cursor attributes on elements
 *  - Click pulse animation
 *  - Hidden on mobile / touch devices
 *  - mix-blend-mode: difference
 *
 * Data attributes on elements:
 *   data-cursor="hover"  → enlarge + glow
 *   data-cursor="image"  → "VIEW" text
 *   data-cursor="text"   → "READ" text
 *   data-cursor="drag"   → "DRAG" text
 *   data-cursor="hidden" → hide cursor
 * ────────────────────────────────────────────── */
export default function CustomCursor() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTouchDevice = useMediaQuery('(pointer: coarse)')
  const shouldHide = isMobile || isTouchDevice

  const [variant, setVariant] = useState('default')
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const styleRef = useRef(null)

  // Raw mouse position
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Outer ring – spring physics (delayed follow)
  const outerX = useSpring(mouseX, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  })
  const outerY = useSpring(mouseY, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  })

  // Inner dot – tight spring (near-instant follow)
  const innerX = useSpring(mouseX, {
    stiffness: 600,
    damping: 35,
    mass: 0.1,
  })
  const innerY = useSpring(mouseY, {
    stiffness: 600,
    damping: 35,
    mass: 0.1,
  })

  // Get current variant config
  const config = CURSOR_VARIANTS[variant] || CURSOR_VARIANTS.default

  /* ── Mouse Move Handler ────────────────────── */
  const handleMouseMove = useCallback(
    (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      if (!isVisible) setIsVisible(true)

      // Detect data-cursor attribute on hovered element
      const target = e.target
      const cursorAttr =
        target?.closest('[data-cursor]')?.getAttribute('data-cursor') || null

      if (cursorAttr && CURSOR_VARIANTS[cursorAttr]) {
        setVariant(cursorAttr)
      } else if (
        target?.closest('a, button, [role="button"], input, select, textarea, label')
      ) {
        setVariant('hover')
      } else if (target?.closest('img, video, [data-cursor-image]')) {
        setVariant('image')
      } else {
        setVariant('default')
      }
    },
    [mouseX, mouseY, isVisible]
  )

  /* ── Click Handlers ────────────────────────── */
  const handleMouseDown = useCallback(() => setIsClicking(true), [])
  const handleMouseUp = useCallback(() => setIsClicking(false), [])

  /* ── Hide when cursor leaves window ────────── */
  const handleMouseLeave = useCallback(() => setIsVisible(false), [])
  const handleMouseEnter = useCallback(() => setIsVisible(true), [])

  /* ── Setup & Teardown ──────────────────────── */
  useEffect(() => {
    if (shouldHide) return

    // Inject global style to hide default cursor
    const style = document.createElement('style')
    style.id = 'stylex-cursor-hide'
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)
    styleRef.current = style

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      // Remove injected style
      if (styleRef.current) {
        styleRef.current.remove()
        styleRef.current = null
      }

      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [shouldHide, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter])

  // Don't render on mobile / touch
  if (shouldHide) return null

  return (
    <>
      {/* ── Outer Ring ──────────────────────────── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          x: outerX,
          y: outerY,
          width: config.outerSize,
          height: config.outerSize,
          marginLeft: -config.outerSize / 2,
          marginTop: -config.outerSize / 2,
          borderRadius: '50%',
          border: `${config.outerBorderWidth}px solid ${config.outerBorderColor}`,
          mixBlendMode: 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform, width, height',
          backdropFilter: variant === 'image' || variant === 'text' || variant === 'drag'
            ? 'blur(4px)'
            : 'none',
          background:
            variant === 'image' || variant === 'text' || variant === 'drag'
              ? 'rgba(201, 165, 92, 0.08)'
              : 'transparent',
        }}
        animate={{
          width: isClicking ? config.outerSize * 0.85 : config.outerSize,
          height: isClicking ? config.outerSize * 0.85 : config.outerSize,
          marginLeft: isClicking
            ? -(config.outerSize * 0.85) / 2
            : -config.outerSize / 2,
          marginTop: isClicking
            ? -(config.outerSize * 0.85) / 2
            : -config.outerSize / 2,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          width: { type: 'spring', stiffness: 300, damping: 20 },
          height: { type: 'spring', stiffness: 300, damping: 20 },
          marginLeft: { type: 'spring', stiffness: 300, damping: 20 },
          marginTop: { type: 'spring', stiffness: 300, damping: 20 },
          opacity: { duration: 0.2 },
        }}
        aria-hidden="true"
      >
        {/* Label text for image / text / drag variants */}
        {config.label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            style={{
              color: '#fff',
              fontSize: '10px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              userSelect: 'none',
              mixBlendMode: 'difference',
            }}
          >
            {config.label}
          </motion.span>
        )}
      </motion.div>

      {/* ── Inner Dot ───────────────────────────── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          x: innerX,
          y: innerY,
          width: config.innerSize,
          height: config.innerSize,
          marginLeft: -config.innerSize / 2,
          marginTop: -config.innerSize / 2,
          borderRadius: '50%',
          backgroundColor: config.innerBg,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
        animate={{
          width: isClicking ? config.innerSize * 2.5 : config.innerSize,
          height: isClicking ? config.innerSize * 2.5 : config.innerSize,
          marginLeft: isClicking
            ? -(config.innerSize * 2.5) / 2
            : -config.innerSize / 2,
          marginTop: isClicking
            ? -(config.innerSize * 2.5) / 2
            : -config.innerSize / 2,
          opacity: isVisible && config.innerSize > 0 ? 1 : 0,
        }}
        transition={{
          width: { type: 'spring', stiffness: 400, damping: 25 },
          height: { type: 'spring', stiffness: 400, damping: 25 },
          opacity: { duration: 0.15 },
        }}
        aria-hidden="true"
      />

      {/* ── Trailing glow (subtle ambient light) ─ */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99998]"
        style={{
          x: outerX,
          y: outerY,
          width: config.outerSize * 2,
          height: config.outerSize * 2,
          marginLeft: -config.outerSize,
          marginTop: -config.outerSize,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201, 165, 92, 0.06) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
        animate={{
          opacity: isVisible && variant !== 'hidden' ? 1 : 0,
          scale: isClicking ? 1.5 : 1,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { type: 'spring', stiffness: 200, damping: 15 },
        }}
        aria-hidden="true"
      />
    </>
  )
}

/* ──────────────────────────────────────────────
 * useCursorVariant – hook to programmatically
 * set cursor variant via data attribute
 *
 * Usage:
 *   const cursorRef = useCursorVariant('hover')
 *   <div ref={cursorRef}>Hover me</div>
 * ────────────────────────────────────────────── */
export function useCursorVariant(variant = 'hover') {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.setAttribute('data-cursor', variant)
    return () => el.removeAttribute('data-cursor')
  }, [variant])

  return ref
}

/* ──────────────────────────────────────────────
 * CursorHover – wrapper that sets data-cursor
 *
 * <CursorHover variant="image">
 *   <img src="..." />
 * </CursorHover>
 * ────────────────────────────────────────────── */
export function CursorHover({
  children,
  variant = 'hover',
  className = '',
  as: Component = 'div',
  ...rest
}) {
  return (
    <Component data-cursor={variant} className={className} {...rest}>
      {children}
    </Component>
  )
}

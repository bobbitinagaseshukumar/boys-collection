import { motion, AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router-dom'

/* ──────────────────────────────────────────────
 * Transition Variants
 * ────────────────────────────────────────────── */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
    filter: 'blur(6px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // easeOutQuint
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: 0.4,
      ease: [0.55, 0, 1, 0.45], // easeInQuint
    },
  },
}

/* ──────────────────────────────────────────────
 * Overlay Curtain Variants
 *
 * A dark overlay that sweeps across the screen
 * during page transitions for a cinematic feel.
 * ────────────────────────────────────────────── */
const overlayVariants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  enter: {
    scaleX: [0, 1, 1, 0],
    originX: [0, 0, 1, 1],
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.35, 0.65, 1],
    },
  },
  exit: {
    scaleX: [0, 1, 1, 0],
    originX: [1, 1, 0, 0],
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.35, 0.65, 1],
    },
  },
}

/* ──────────────────────────────────────────────
 * Accent line that slides across during transition
 * ────────────────────────────────────────────── */
const accentLineVariants = {
  initial: {
    scaleX: 0,
    opacity: 0,
    originX: 0,
  },
  enter: {
    scaleX: [0, 1, 0],
    opacity: [0, 1, 0],
    originX: [0, 0, 1],
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
  exit: {
    scaleX: [0, 1, 0],
    opacity: [0, 1, 0],
    originX: [1, 1, 0],
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
}

/* ──────────────────────────────────────────────
 * PageTransition Component
 *
 * Wraps page content with enter/exit animations
 * and a sweeping overlay curtain.
 *
 * Usage:
 *   <PageTransition>
 *     <HomePage />
 *   </PageTransition>
 *
 * Or with AnimatePresence in a router:
 *   <AnimatePresence mode="wait">
 *     <PageTransition key={location.pathname}>
 *       <Outlet />
 *     </PageTransition>
 *   </AnimatePresence>
 * ────────────────────────────────────────────── */
export default function PageTransition({
  children,
  className = '',
  enableOverlay = true,
}) {
  return (
    <>
      {/* Sweeping overlay curtain */}
      {enableOverlay && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="pointer-events-none fixed inset-0 z-[9999]"
            style={{
              background:
                'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
            }}
            aria-hidden="true"
          />

          {/* Gold accent line */}
          <motion.div
            variants={accentLineVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="pointer-events-none fixed left-0 right-0 top-1/2 z-[10000] h-[2px] -translate-y-1/2"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #c9a55c 20%, #f0d78c 50%, #c9a55c 80%, transparent 100%)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Page content */}
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={`min-h-screen ${className}`}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {children}
      </motion.div>
    </>
  )
}

/* ──────────────────────────────────────────────
 * AnimatedRoutes
 *
 * Helper wrapper that handles AnimatePresence
 * with location-based keys automatically.
 *
 * Usage:
 *   <AnimatedRoutes>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/shop" element={<Shop />} />
 *   </AnimatedRoutes>
 * ────────────────────────────────────────────── */
export function AnimatedRoutes({ children, className = '', enableOverlay = true }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition
        key={location.pathname}
        className={className}
        enableOverlay={enableOverlay}
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  )
}

/* ──────────────────────────────────────────────
 * PageSection – animated section within a page
 *
 * Each section fades in as the page enters,
 * staggered with siblings via pageVariants'
 * staggerChildren.
 * ────────────────────────────────────────────── */
const sectionVariants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.55, 0, 1, 0.45],
    },
  },
}

export function PageSection({ children, className = '', ...rest }) {
  return (
    <motion.section variants={sectionVariants} className={className} {...rest}>
      {children}
    </motion.section>
  )
}

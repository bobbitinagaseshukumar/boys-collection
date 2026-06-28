import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ──────────────────────────────────────────────
 * Animation preset map
 * Each preset returns { from, to } gsap vars
 * ────────────────────────────────────────────── */
const ANIMATION_PRESETS = {
  fadeUp: {
    from: { y: 80, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' },
  },
  fadeDown: {
    from: { y: -80, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' },
  },
  fadeLeft: {
    from: { x: -100, opacity: 0 },
    to: { x: 0, opacity: 1, ease: 'power3.out' },
  },
  fadeRight: {
    from: { x: 100, opacity: 0 },
    to: { x: 0, opacity: 1, ease: 'power3.out' },
  },
  scaleIn: {
    from: { scale: 0.6, opacity: 0 },
    to: { scale: 1, opacity: 1, ease: 'elastic.out(1, 0.5)' },
  },
  scaleUp: {
    from: { scale: 0.85, y: 40, opacity: 0 },
    to: { scale: 1, y: 0, opacity: 1, ease: 'power4.out' },
  },
  rotateIn: {
    from: { rotation: 12, scale: 0.85, opacity: 0 },
    to: { rotation: 0, scale: 1, opacity: 1, ease: 'power4.out' },
  },
  clipReveal: {
    from: { clipPath: 'inset(100% 0% 0% 0%)' },
    to: { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power4.inOut' },
  },
  blurIn: {
    from: { filter: 'blur(20px)', opacity: 0 },
    to: { filter: 'blur(0px)', opacity: 1, ease: 'power3.out' },
  },
  slideUp: {
    from: { y: '100%', opacity: 0 },
    to: { y: '0%', opacity: 1, ease: 'power4.out' },
  },
}

/* ──────────────────────────────────────────────
 * useScrollAnimation
 *
 * Returns a ref to attach to the element you
 * want to animate on scroll entry.
 *
 * @param {Object} options
 *   animation  – preset name (see ANIMATION_PRESETS)
 *   delay      – seconds before animation starts
 *   duration   – animation duration in seconds
 *   stagger    – stagger offset for child elements
 *   threshold  – how far into viewport to trigger ("top XX%")
 *   once       – if true, animation plays only once
 *   scrub      – if true/number, animation is scroll-linked
 * ────────────────────────────────────────────── */
export function useScrollAnimation(options = {}) {
  const {
    animation = 'fadeUp',
    delay = 0,
    duration = 1,
    stagger = 0,
    threshold = 85,
    once = false,
    scrub = false,
  } = options

  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const preset = ANIMATION_PRESETS[animation]
    if (!preset) {
      console.warn(`[useScrollAnimation] Unknown animation preset: "${animation}"`)
      return
    }

    // Determine targets – if stagger > 0, animate direct children
    const targets = stagger > 0 ? el.children : el

    // Set initial state
    gsap.set(targets, { ...preset.from })

    const tween = gsap.to(targets, {
      ...preset.to,
      delay,
      duration,
      stagger: stagger > 0 ? stagger : undefined,
      scrollTrigger: {
        trigger: el,
        start: `top ${threshold}%`,
        end: scrub ? 'bottom 20%' : undefined,
        toggleActions: once
          ? 'play none none none'
          : 'play none none reverse',
        scrub: scrub === true ? 1 : scrub || false,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [animation, delay, duration, stagger, threshold, once, scrub])

  return ref
}

/* ──────────────────────────────────────────────
 * useScrollProgress
 *
 * Returns a ref and a progress value (0 → 1)
 * representing how far the element has scrolled
 * through the viewport.
 * ────────────────────────────────────────────── */
export function useScrollProgress() {
  const ref = useRef(null)
  const progress = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })

    return () => trigger.kill()
  }, [])

  return { ref, progress }
}

/* ──────────────────────────────────────────────
 * ScrollReveal Component
 *
 * Wrapper component that animates its children
 * when they enter the viewport.
 *
 * <ScrollReveal animation="fadeUp" delay={0.2}>
 *   <h2>Hello</h2>
 * </ScrollReveal>
 * ────────────────────────────────────────────── */
export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 1,
  stagger = 0,
  threshold = 85,
  once = false,
  scrub = false,
  className = '',
  as: Component = 'div',
  style = {},
  ...rest
}) {
  const ref = useScrollAnimation({
    animation,
    delay,
    duration,
    stagger,
    threshold,
    once,
    scrub,
  })

  return (
    <Component ref={ref} className={className} style={style} {...rest}>
      {children}
    </Component>
  )
}

/* ──────────────────────────────────────────────
 * StaggerRevealGroup Component
 *
 * Animates each direct child with a stagger.
 *
 * <StaggerRevealGroup stagger={0.12}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </StaggerRevealGroup>
 * ────────────────────────────────────────────── */
export function StaggerRevealGroup({
  children,
  animation = 'fadeUp',
  stagger = 0.1,
  delay = 0,
  duration = 0.9,
  threshold = 85,
  once = false,
  className = '',
  as: Component = 'div',
  style = {},
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const preset = ANIMATION_PRESETS[animation]
    if (!preset) return

    const targets = Array.from(el.children)
    if (targets.length === 0) return

    gsap.set(targets, { ...preset.from })

    const tween = gsap.to(targets, {
      ...preset.to,
      delay,
      duration,
      stagger,
      scrollTrigger: {
        trigger: el,
        start: `top ${threshold}%`,
        toggleActions: once
          ? 'play none none none'
          : 'play none none reverse',
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [animation, stagger, delay, duration, threshold, once])

  return (
    <Component ref={ref} className={className} style={style} {...rest}>
      {children}
    </Component>
  )
}

/* ──────────────────────────────────────────────
 * Export presets for external use
 * ────────────────────────────────────────────── */
export { ANIMATION_PRESETS }

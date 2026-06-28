import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ──────────────────────────────────────────────
 * Global scroll-trigger defaults
 * ────────────────────────────────────────────── */
export function initScrollAnimations() {
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
    start: 'top 85%',
    end: 'bottom 15%',
    markers: false,
  })

  // Refresh triggers after all fonts / images are ready
  window.addEventListener('load', () => {
    ScrollTrigger.refresh()
  })

  // Refresh on resize with debounce
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250)
  })
}

/* ──────────────────────────────────────────────
 * Fade In Up
 * ────────────────────────────────────────────── */
export function fadeInUp(element, delay = 0) {
  if (!element) return null

  return gsap.from(element, {
    y: 80,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  })
}

/* ──────────────────────────────────────────────
 * Fade In Left
 * ────────────────────────────────────────────── */
export function fadeInLeft(element, delay = 0) {
  if (!element) return null

  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  })
}

/* ──────────────────────────────────────────────
 * Fade In Right
 * ────────────────────────────────────────────── */
export function fadeInRight(element, delay = 0) {
  if (!element) return null

  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  })
}

/* ──────────────────────────────────────────────
 * Stagger Reveal – animates a set of elements
 * in sequence with configurable stagger offset
 * ────────────────────────────────────────────── */
export function staggerReveal(elements, stagger = 0.1) {
  if (!elements || elements.length === 0) return null

  return gsap.from(elements, {
    y: 60,
    opacity: 0,
    duration: 0.9,
    stagger,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  })
}

/* ──────────────────────────────────────────────
 * Parallax Element – moves element at a fraction
 * of the scroll speed for depth effect
 * ────────────────────────────────────────────── */
export function parallaxElement(element, speed = 0.5) {
  if (!element) return null

  return gsap.to(element, {
    yPercent: -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/* ──────────────────────────────────────────────
 * Magnetic Hover – element pulls toward the cursor
 * when hovering, then springs back on leave
 * ────────────────────────────────────────────── */
export function magneticHover(element) {
  if (!element) return null

  const strength = 0.35
  const boundingRect = () => element.getBoundingClientRect()

  const handleMove = (e) => {
    const rect = boundingRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2

    gsap.to(element, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const handleLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    })
  }

  element.addEventListener('mousemove', handleMove)
  element.addEventListener('mouseleave', handleLeave)

  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMove)
    element.removeEventListener('mouseleave', handleLeave)
    gsap.set(element, { x: 0, y: 0 })
  }
}

/* ──────────────────────────────────────────────
 * Text Reveal – splits text into chars and
 * animates each character with stagger
 * ────────────────────────────────────────────── */
export function textReveal(element) {
  if (!element) return null

  const text = element.textContent
  const chars = text.split('')

  // Clear and rebuild with spans
  element.textContent = ''
  element.style.overflow = 'hidden'

  const wrapper = document.createElement('span')
  wrapper.style.display = 'inline-block'

  chars.forEach((char) => {
    const span = document.createElement('span')
    span.textContent = char === ' ' ? '\u00A0' : char
    span.style.display = 'inline-block'
    span.style.willChange = 'transform, opacity'
    wrapper.appendChild(span)
  })

  element.appendChild(wrapper)

  const charSpans = wrapper.querySelectorAll('span')

  return gsap.from(charSpans, {
    y: 120,
    rotateX: -80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.03,
    ease: 'power4.out',
    transformOrigin: 'center bottom',
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  })
}

/* ──────────────────────────────────────────────
 * Scale In – element scales from 0 to 1
 * with a satisfying overshoot
 * ────────────────────────────────────────────── */
export function scaleIn(element, delay = 0) {
  if (!element) return null

  return gsap.from(element, {
    scale: 0,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'elastic.out(1, 0.5)',
    transformOrigin: 'center center',
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  })
}

/* ──────────────────────────────────────────────
 * Rotate In – element rotates in from angle
 * with fade and slight scale
 * ────────────────────────────────────────────── */
export function rotateIn(element, delay = 0) {
  if (!element) return null

  return gsap.from(element, {
    rotation: 15,
    scale: 0.85,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power4.out',
    transformOrigin: 'center center',
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  })
}

/* ──────────────────────────────────────────────
 * Create Scroll Timeline – utility to build
 * a scroll-linked GSAP timeline from a
 * configuration array
 *
 * @param {Element}  trigger     – ScrollTrigger element
 * @param {Array}    animations  – Array of animation configs:
 *   {
 *     target:   Element | string,
 *     from:     { ... gsap vars },
 *     to:       { ... gsap vars },
 *     position: '<' | '>' | number | string (timeline position)
 *   }
 *
 * @param {Object}  scrollOptions – optional ScrollTrigger overrides
 * ────────────────────────────────────────────── */
export function createScrollTimeline(trigger, animations = [], scrollOptions = {}) {
  if (!trigger) return null

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      ...scrollOptions,
    },
  })

  animations.forEach(({ target, from, to, position = '>' }) => {
    if (!target) return

    if (from && to) {
      tl.fromTo(target, from, to, position)
    } else if (from) {
      tl.from(target, from, position)
    } else if (to) {
      tl.to(target, to, position)
    }
  })

  return tl
}

/* ──────────────────────────────────────────────
 * Cleanup – kills all ScrollTrigger instances
 * and GSAP tweens (use on unmount / route change)
 * ────────────────────────────────────────────── */
export function killAllAnimations() {
  ScrollTrigger.getAll().forEach((st) => st.kill())
  gsap.killTweensOf('*')
}

/* ──────────────────────────────────────────────
 * Re-export for convenience
 * ────────────────────────────────────────────── */
export { gsap, ScrollTrigger }

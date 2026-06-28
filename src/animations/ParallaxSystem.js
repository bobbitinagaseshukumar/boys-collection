import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ──────────────────────────────────────────────
 * 8 Parallax Layers Configuration
 *
 * Each layer defines:
 *   name     – descriptive label
 *   speed    – parallax intensity (higher = faster movement)
 *   zIndex   – stacking order
 *   opacity  – base opacity range [start, end]
 *   scale    – subtle scale shift [start, end]
 * ────────────────────────────────────────────── */
export const PARALLAX_LAYERS = [
  {
    name: 'deep-background',
    speed: 0.05,
    zIndex: 0,
    opacity: [0.3, 0.5],
    scale: [1, 1.02],
    description: 'Farthest background — ambient grain / gradient',
  },
  {
    name: 'far-background',
    speed: 0.1,
    zIndex: 1,
    opacity: [0.5, 0.7],
    scale: [1, 1.04],
    description: 'Distant atmospheric elements — particles / blurs',
  },
  {
    name: 'mid-background',
    speed: 0.2,
    zIndex: 2,
    opacity: [0.6, 0.85],
    scale: [1, 1.06],
    description: 'Secondary imagery — decorative shapes / patterns',
  },
  {
    name: 'background',
    speed: 0.3,
    zIndex: 3,
    opacity: [0.75, 1],
    scale: [1, 1.05],
    description: 'Main background imagery — hero images / textures',
  },
  {
    name: 'mid-ground',
    speed: 0.45,
    zIndex: 4,
    opacity: [0.9, 1],
    scale: [1, 1.03],
    description: 'Content support layer — cards / dividers',
  },
  {
    name: 'foreground',
    speed: 0.6,
    zIndex: 5,
    opacity: [1, 1],
    scale: [1, 1.02],
    description: 'Primary content layer — text / headings',
  },
  {
    name: 'near-foreground',
    speed: 0.8,
    zIndex: 6,
    opacity: [1, 1],
    scale: [1, 1.01],
    description: 'Interactive elements — buttons / badges',
  },
  {
    name: 'overlay',
    speed: 1.0,
    zIndex: 7,
    opacity: [1, 1],
    scale: [1, 1],
    description: 'Top-most layer — floating elements / cursor effects',
  },
]

/* ──────────────────────────────────────────────
 * useParallax Hook
 *
 * Returns a ref to attach to an element.
 * The element translates on Y axis based on
 * scroll position, creating a depth illusion.
 *
 * @param {number}  speed       – Movement intensity (0.05 – 1.0)
 * @param {Object}  options     – Additional configuration
 *   direction   – 'vertical' | 'horizontal' | 'both'
 *   scale       – [startScale, endScale] array
 *   opacity     – [startOpacity, endOpacity] array
 *   rotate      – rotation amount in degrees
 *   scrub       – scrub smoothness (default 1)
 * ────────────────────────────────────────────── */
export function useParallax(speed = 0.5, options = {}) {
  const {
    direction = 'vertical',
    scale = null,
    opacity = null,
    rotate = 0,
    scrub = 1,
  } = options

  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Clamp speed between 0.01 and 2
    const clampedSpeed = Math.max(0.01, Math.min(speed, 2))

    // Calculate movement distance
    const distance = clampedSpeed * 150

    // Build the animation target object
    const animVars = {
      ease: 'none',
    }

    if (direction === 'vertical' || direction === 'both') {
      animVars.y = -distance
    }
    if (direction === 'horizontal' || direction === 'both') {
      animVars.x = -distance * 0.5
    }
    if (rotate) {
      animVars.rotation = rotate
    }
    if (scale) {
      animVars.scale = scale[1]
    }
    if (opacity) {
      animVars.opacity = opacity[1]
    }

    // Build initial state
    const fromVars = {}
    if (direction === 'vertical' || direction === 'both') {
      fromVars.y = distance
    }
    if (direction === 'horizontal' || direction === 'both') {
      fromVars.x = distance * 0.5
    }
    if (rotate) {
      fromVars.rotation = -rotate
    }
    if (scale) {
      fromVars.scale = scale[0]
      gsap.set(el, { scale: scale[0] })
    }
    if (opacity) {
      fromVars.opacity = opacity[0]
      gsap.set(el, { opacity: opacity[0] })
    }

    const tween = gsap.fromTo(el, fromVars, {
      ...animVars,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
      },
    })

    // Set will-change for GPU acceleration
    el.style.willChange = 'transform'

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      el.style.willChange = ''
    }
  }, [speed, direction, rotate, scrub, scale, opacity])

  return ref
}

/* ──────────────────────────────────────────────
 * ParallaxLayer Component
 *
 * Wrapper component that applies parallax
 * movement to its children.
 *
 * <ParallaxLayer speed={0.3} className="z-10">
 *   <img src="/hero.jpg" alt="" />
 * </ParallaxLayer>
 * ────────────────────────────────────────────── */
export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = 'vertical',
  scale = null,
  opacity = null,
  rotate = 0,
  scrub = 1,
  className = '',
  as: Component = 'div',
  style = {},
  ...rest
}) {
  const ref = useParallax(speed, {
    direction,
    scale,
    opacity,
    rotate,
    scrub,
  })

  return (
    <Component
      ref={ref}
      className={className}
      style={{ position: 'relative', ...style }}
      {...rest}
    >
      {children}
    </Component>
  )
}

/* ──────────────────────────────────────────────
 * ParallaxScene Component
 *
 * Container that sets up multiple parallax
 * layers using the PARALLAX_LAYERS config.
 *
 * Accepts a render prop / function-as-children:
 *
 * <ParallaxScene>
 *   {(Layer, layers) => (
 *     <>
 *       <Layer index={0}><BgGradient /></Layer>
 *       <Layer index={3}><HeroImage /></Layer>
 *       <Layer index={5}><Heading /></Layer>
 *     </>
 *   )}
 * </ParallaxScene>
 * ────────────────────────────────────────────── */
export function ParallaxScene({
  children,
  className = '',
  style = {},
  ...rest
}) {
  // Layer component configured from PARALLAX_LAYERS
  const Layer = ({ index, children: layerChildren, className: layerClass = '', style: layerStyle = {}, ...layerRest }) => {
    const config = PARALLAX_LAYERS[index] || PARALLAX_LAYERS[0]

    return (
      <ParallaxLayer
        speed={config.speed}
        scale={config.scale}
        opacity={config.opacity}
        className={layerClass}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: config.zIndex,
          ...layerStyle,
        }}
        {...layerRest}
      >
        {layerChildren}
      </ParallaxLayer>
    )
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      {...rest}
    >
      {typeof children === 'function'
        ? children(Layer, PARALLAX_LAYERS)
        : children}
    </div>
  )
}

/* ──────────────────────────────────────────────
 * getLayerByName – helper to look up a layer
 * ────────────────────────────────────────────── */
export function getLayerByName(name) {
  return PARALLAX_LAYERS.find((l) => l.name === name) || null
}

/* ──────────────────────────────────────────────
 * getLayerByIndex – helper with bounds check
 * ────────────────────────────────────────────── */
export function getLayerByIndex(index) {
  return PARALLAX_LAYERS[index] || null
}

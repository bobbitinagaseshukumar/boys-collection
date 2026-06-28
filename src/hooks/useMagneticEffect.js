import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

/**
 * useMagneticEffect
 * Creates a magnetic pull effect on a DOM element.
 *
 * @param {Object}  [options]
 * @param {number}  [options.threshold=100]  - Distance in px within which the magnet activates
 * @param {number}  [options.strength=0.35]  - Pull strength multiplier (0 = no pull, 1 = snap to cursor)
 * @param {number}  [options.springDuration=0.6] - Duration of the spring-back animation in seconds
 * @param {string}  [options.springEase="elastic.out(1, 0.4)"] - GSAP ease for spring-back
 *
 * @returns {{ magneticRef: React.RefObject, isHovered: boolean }}
 */
export function useMagneticEffect({
  threshold = 100,
  strength = 0.35,
  springDuration = 0.6,
  springEase = "elastic.out(1, 0.4)",
} = {}) {
  const magneticRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isActive = useRef(false);
  const rafId = useRef(null);
  const latestEvent = useRef(null);

  /* ── Apply magnetic pull ── */
  const applyMagnetic = useCallback(() => {
    const el = magneticRef.current;
    const e = latestEvent.current;
    if (!el || !e) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < threshold) {
      if (!isActive.current) {
        isActive.current = true;
        setIsHovered(true);
      }

      gsap.to(el, {
        x: distX * strength,
        y: distY * strength,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else if (isActive.current) {
      isActive.current = false;
      setIsHovered(false);

      gsap.to(el, {
        x: 0,
        y: 0,
        duration: springDuration,
        ease: springEase,
        overwrite: "auto",
      });
    }

    rafId.current = null;
  }, [threshold, strength, springDuration, springEase]);

  useEffect(() => {
    const el = magneticRef.current;
    if (!el) return;

    /* Use a parent-level listener for better hit detection */
    const handleMouseMove = (e) => {
      latestEvent.current = e;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(applyMagnetic);
      }
    };

    const handleMouseLeave = () => {
      latestEvent.current = null;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }

      if (isActive.current) {
        isActive.current = false;
        setIsHovered(false);

        gsap.to(el, {
          x: 0,
          y: 0,
          duration: springDuration,
          ease: springEase,
          overwrite: "auto",
        });
      }
    };

    /* Listen on window so we detect approach from any direction */
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    /* Also listen on the element itself for a crisp leave */
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      gsap.killTweensOf(el);
    };
  }, [applyMagnetic, springDuration, springEase]);

  return { magneticRef, isHovered };
}

export default useMagneticEffect;

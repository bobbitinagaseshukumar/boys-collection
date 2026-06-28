import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useScrollProgress
 * Tracks document scroll progress with rAF-driven updates.
 *
 * @returns {{ progress: number, scrollY: number, direction: 'up' | 'down' }}
 *   progress  – 0 at top, 1 at bottom
 *   scrollY   – current vertical scroll offset in px
 *   direction – last scroll direction
 */
export function useScrollProgress() {
  const [scrollData, setScrollData] = useState({
    progress: 0,
    scrollY: 0,
    direction: "down",
  });

  const ticking = useRef(false);
  const prevScrollY = useRef(0);

  const update = useCallback(() => {
    const currentScrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress = docHeight > 0 ? Math.min(currentScrollY / docHeight, 1) : 0;
    const direction = currentScrollY >= prevScrollY.current ? "down" : "up";

    prevScrollY.current = currentScrollY;

    setScrollData({
      progress,
      scrollY: currentScrollY,
      direction,
    });

    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    /* Capture initial state */
    update();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [update]);

  return scrollData;
}

export default useScrollProgress;

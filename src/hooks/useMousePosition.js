import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useMousePosition
 * Tracks mouse position globally with throttled updates.
 *
 * @param {number} [throttleMs=16] - Throttle interval in ms (~60fps default)
 * @returns {{ x: number, y: number, normalizedX: number, normalizedY: number }}
 *   x, y            – raw pixel coordinates
 *   normalizedX/Y   – values mapped to [-1, 1] relative to viewport center
 */
export function useMousePosition(throttleMs = 16) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const lastUpdate = useRef(0);
  const rafId = useRef(null);
  const latestEvent = useRef(null);

  const processEvent = useCallback(() => {
    const e = latestEvent.current;
    if (!e) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const normalizedX = (clientX / innerWidth) * 2 - 1;
    const normalizedY = (clientY / innerHeight) * 2 - 1;

    setPosition({
      x: clientX,
      y: clientY,
      normalizedX,
      normalizedY,
    });

    latestEvent.current = null;
    rafId.current = null;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = performance.now();

      if (now - lastUpdate.current < throttleMs) {
        latestEvent.current = e;
        if (!rafId.current) {
          rafId.current = requestAnimationFrame(() => {
            lastUpdate.current = performance.now();
            processEvent();
          });
        }
        return;
      }

      lastUpdate.current = now;
      latestEvent.current = e;
      processEvent();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [throttleMs, processEvent]);

  return position;
}

export default useMousePosition;

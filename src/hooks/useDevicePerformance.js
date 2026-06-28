import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
 * Performance tiers
 * ───────────────────────────────────────────── */

const TIERS = {
  low: {
    performanceLevel: "low",
    particleCount: 50,
    shadowQuality: "none",
    enablePostProcessing: false,
    enable3D: false,
  },
  medium: {
    performanceLevel: "medium",
    particleCount: 200,
    shadowQuality: "low",
    enablePostProcessing: false,
    enable3D: true,
  },
  high: {
    performanceLevel: "high",
    particleCount: 500,
    shadowQuality: "medium",
    enablePostProcessing: true,
    enable3D: true,
  },
  ultra: {
    performanceLevel: "ultra",
    particleCount: 1000,
    shadowQuality: "high",
    enablePostProcessing: true,
    enable3D: true,
  },
};

/**
 * Classify measured FPS into a performance tier.
 */
function classifyPerformance(fps, prefersReducedMotion, cores) {
  if (prefersReducedMotion) return "low";
  if (fps < 30) return "low";

  /* Factor in CPU core count as a secondary signal */
  const coreBoost = cores >= 8 ? 5 : cores >= 4 ? 0 : -5;
  const adjustedFps = fps + coreBoost;

  if (adjustedFps < 30) return "low";
  if (adjustedFps < 45) return "medium";
  if (adjustedFps < 55) return "high";
  return "ultra";
}

/**
 * useDevicePerformance
 * Profiles the device by sampling FPS over a short window on mount.
 *
 * @param {number} [sampleDuration=500] - Duration in ms to sample FPS
 * @returns {{
 *   performanceLevel: 'low' | 'medium' | 'high' | 'ultra',
 *   particleCount: number,
 *   shadowQuality: 'none' | 'low' | 'medium' | 'high',
 *   enablePostProcessing: boolean,
 *   enable3D: boolean
 * }}
 */
export function useDevicePerformance(sampleDuration = 500) {
  const [profile, setProfile] = useState(TIERS.high);
  const measured = useRef(false);

  useEffect(() => {
    if (measured.current) return;
    measured.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cores = navigator.hardwareConcurrency || 4;

    /* Fast-path: if user explicitly wants reduced motion, skip FPS sampling */
    if (prefersReducedMotion) {
      setProfile(TIERS.low);
      return;
    }

    let frameCount = 0;
    let rafId;
    const startTime = performance.now();

    const countFrame = (now) => {
      frameCount++;

      if (now - startTime >= sampleDuration) {
        const elapsed = now - startTime;
        const fps = (frameCount / elapsed) * 1000;
        const tier = classifyPerformance(fps, prefersReducedMotion, cores);
        setProfile(TIERS[tier]);
        return;
      }

      rafId = requestAnimationFrame(countFrame);
    };

    rafId = requestAnimationFrame(countFrame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sampleDuration]);

  return profile;
}

export default useDevicePerformance;

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";

/* ─────────────────────────────────────────────
 * Core: useMediaQuery
 * ───────────────────────────────────────────── */

/**
 * useMediaQuery
 * Reactively matches a CSS media query string.
 *
 * @param {string} query - e.g. "(max-width: 767px)"
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ─────────────────────────────────────────────
 * Convenience breakpoint hooks
 * ───────────────────────────────────────────── */

/**
 * @returns {boolean} true when viewport < 768px
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * @returns {boolean} true when 768px ≤ viewport ≤ 1023px
 */
export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

/**
 * @returns {boolean} true when viewport ≥ 1024px
 */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

/* ─────────────────────────────────────────────
 * Breakpoint classifier
 * ───────────────────────────────────────────── */

const BREAKPOINTS = [
  { name: "mobile", query: "(max-width: 767px)" },
  { name: "tablet", query: "(min-width: 768px) and (max-width: 1023px)" },
  { name: "laptop", query: "(min-width: 1024px) and (max-width: 1439px)" },
  { name: "desktop", query: "(min-width: 1440px) and (max-width: 2559px)" },
  { name: "2k", query: "(min-width: 2560px) and (max-width: 3839px)" },
  { name: "4k", query: "(min-width: 3840px)" },
];

/**
 * useBreakpoint
 * Returns the current named breakpoint.
 *
 * @returns {'mobile' | 'tablet' | 'laptop' | 'desktop' | '2k' | '4k'}
 */
export function useBreakpoint() {
  const getBreakpoint = useCallback(() => {
    for (const bp of BREAKPOINTS) {
      if (window.matchMedia(bp.query).matches) {
        return bp.name;
      }
    }
    return "desktop";
  }, []);

  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    return getBreakpoint();
  });

  useEffect(() => {
    const mediaQueryLists = BREAKPOINTS.map((bp) => ({
      name: bp.name,
      mql: window.matchMedia(bp.query),
    }));

    const handleChange = () => {
      setBreakpoint(getBreakpoint());
    };

    mediaQueryLists.forEach(({ mql }) => {
      mql.addEventListener("change", handleChange);
    });

    /* Sync on mount */
    handleChange();

    return () => {
      mediaQueryLists.forEach(({ mql }) => {
        mql.removeEventListener("change", handleChange);
      });
    };
  }, [getBreakpoint]);

  return breakpoint;
}

export default useMediaQuery;

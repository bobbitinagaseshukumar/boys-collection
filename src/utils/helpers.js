/**
 * Format a numeric price as Indian Rupees (₹X,XXX)
 * Uses the Indian numbering system (lakh/crore grouping).
 *
 * @param {number} price - The price value in whole rupees
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  if (price == null || isNaN(price)) return "₹0";
  return `₹${price.toLocaleString("en-IN")}`;
}

/**
 * Truncate text to a maximum length and append an ellipsis.
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character count (default 100)
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Calculate the discount percentage between an original and current price.
 *
 * @param {number} price - Current / sale price
 * @param {number} originalPrice - Original / MRP price
 * @returns {number} Discount percentage (0–100), rounded to nearest integer
 */
export function calculateDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Generate a random delay value between min and max (inclusive).
 * Useful for staggered animation start times.
 *
 * @param {number} min - Minimum delay in seconds (default 0)
 * @param {number} max - Maximum delay in seconds (default 0.5)
 * @returns {number} Random delay value
 */
export function getRandomDelay(min = 0, max = 0.5) {
  return Math.random() * (max - min) + min;
}

/**
 * Merge CSS class names, filtering out falsy values.
 * A lightweight alternative to the `clsx` / `classnames` package.
 *
 * @param  {...(string|boolean|null|undefined)} classes - Class names to merge
 * @returns {string} Merged class string
 *
 * @example
 * classNames("btn", isActive && "btn-active", false, "btn-lg")
 * // => "btn btn-active btn-lg"
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Create a debounced version of a function.
 * The function will only execute after `delay` ms have elapsed
 * since the last invocation.
 *
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Debounce delay in milliseconds (default 300)
 * @returns {Function} Debounced function with a `.cancel()` method
 */
export function debounce(fn, delay = 300) {
  let timeoutId;

  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}

/**
 * Create a throttled version of a function.
 * The function will execute at most once every `limit` ms.
 *
 * @param {Function} fn - The function to throttle
 * @param {number} limit - Throttle interval in milliseconds (default 300)
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 300) {
  let inThrottle = false;

  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Generate a URL-friendly slug from a string.
 *
 * @param {string} text - The text to slugify
 * @returns {string} URL-safe slug
 *
 * @example
 * slugify("Premium Oxford Shirt") // => "premium-oxford-shirt"
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate the remaining time until a target date.
 * Returns an object with days, hours, minutes, seconds.
 *
 * @param {string|Date} endDate - The target end date
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isExpired: boolean }}
 */
export function getCountdown(endDate) {
  const now = new Date().getTime();
  const target = new Date(endDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

/**
 * Generate a random unique ID string (for keys, temp IDs, etc.).
 *
 * @param {number} length - Length of the ID (default 8)
 * @returns {string} Random alphanumeric ID
 */
export function generateId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Smoothly scroll to an element by its ID.
 *
 * @param {string} elementId - The target element's ID (without #)
 * @param {number} offset - Offset from the top in pixels (default 80)
 */
export function scrollToElement(elementId, offset = 80) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Get the star rating breakdown as an array of "full", "half", or "empty".
 *
 * @param {number} rating - Rating value (e.g. 4.5)
 * @param {number} maxStars - Maximum stars (default 5)
 * @returns {Array<"full"|"half"|"empty">} Star type array
 *
 * @example
 * getStarRating(4.5) // => ["full", "full", "full", "full", "half"]
 */
export function getStarRating(rating, maxStars = 5) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 <= 0.75;

  for (let i = 0; i < maxStars; i++) {
    if (i < fullStars) {
      stars.push("full");
    } else if (i === fullStars && hasHalf) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }

  return stars;
}

/**
 * Deep clone a plain object or array (no functions, dates, etc.).
 *
 * @param {*} obj - The value to clone
 * @returns {*} Deep-cloned value
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

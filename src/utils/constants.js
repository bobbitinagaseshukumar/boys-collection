// ─────────────────────────────────────────────
// Navigation Links
// ─────────────────────────────────────────────
export const NAV_LINKS = [
  { id: 1, label: "Home", path: "/" },
  { id: 2, label: "Shop", path: "/shop" },
  { id: 3, label: "Collections", path: "/collections" },
  { id: 4, label: "New Arrivals", path: "/new-arrivals" },
  { id: 5, label: "About", path: "/about" },
  { id: 6, label: "Contact", path: "/contact" },
];

// ─────────────────────────────────────────────
// Social Links
// ─────────────────────────────────────────────
export const SOCIAL_LINKS = [
  {
    id: 1,
    name: "Instagram",
    url: "https://instagram.com/stylex",
    icon: "instagram",
    followers: "125K",
  },
  {
    id: 2,
    name: "Twitter",
    url: "https://twitter.com/stylex",
    icon: "twitter",
    followers: "48K",
  },
  {
    id: 3,
    name: "Facebook",
    url: "https://facebook.com/stylex",
    icon: "facebook",
    followers: "89K",
  },
  {
    id: 4,
    name: "YouTube",
    url: "https://youtube.com/@stylex",
    icon: "youtube",
    followers: "67K",
  },
  {
    id: 5,
    name: "Pinterest",
    url: "https://pinterest.com/stylex",
    icon: "pinterest",
    followers: "34K",
  },
];

// ─────────────────────────────────────────────
// Company Information
// ─────────────────────────────────────────────
export const COMPANY_INFO = {
  name: "STYLEX",
  tagline: "Luxury Men's Fashion",
  description:
    "STYLEX is a premium men's fashion brand dedicated to crafting timeless pieces from the world's finest fabrics. Every garment is designed with precision, passion, and an unwavering commitment to quality.",
  email: "hello@stylex.com",
  phone: "+91 98765 43210",
  address: "42 Fashion Street, Bandra West, Mumbai, Maharashtra 400050, India",
  workingHours: "Mon – Sat: 10:00 AM – 8:00 PM",
  foundedYear: 2020,
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 2999,
  returnDays: 30,
  supportEmail: "support@stylex.com",
  socialHandle: "@stylex",
};

// ─────────────────────────────────────────────
// Sort Options (for Shop page filters)
// ─────────────────────────────────────────────
export const SORT_OPTIONS = [
  { id: "featured", label: "Featured", value: "featured" },
  { id: "newest", label: "Newest First", value: "newest" },
  { id: "price-low", label: "Price: Low to High", value: "price-asc" },
  { id: "price-high", label: "Price: High to Low", value: "price-desc" },
  { id: "rating", label: "Highest Rated", value: "rating" },
  { id: "popular", label: "Most Popular", value: "popular" },
  { id: "discount", label: "Biggest Discount", value: "discount" },
];

// ─────────────────────────────────────────────
// Size Options
// ─────────────────────────────────────────────
export const SIZE_OPTIONS = [
  { id: "xs", label: "XS", value: "XS" },
  { id: "s", label: "S", value: "S" },
  { id: "m", label: "M", value: "M" },
  { id: "l", label: "L", value: "L" },
  { id: "xl", label: "XL", value: "XL" },
  { id: "xxl", label: "XXL", value: "XXL" },
  { id: "28", label: "28", value: "28" },
  { id: "30", label: "30", value: "30" },
  { id: "32", label: "32", value: "32" },
  { id: "34", label: "34", value: "34" },
  { id: "36", label: "36", value: "36" },
  { id: "38", label: "38", value: "38" },
];

// ─────────────────────────────────────────────
// Price Range Filters
// ─────────────────────────────────────────────
export const PRICE_RANGES = [
  { id: "under-2000", label: "Under ₹2,000", min: 0, max: 1999 },
  { id: "2000-4000", label: "₹2,000 – ₹4,000", min: 2000, max: 4000 },
  { id: "4000-6000", label: "₹4,000 – ₹6,000", min: 4000, max: 6000 },
  { id: "6000-8000", label: "₹6,000 – ₹8,000", min: 6000, max: 8000 },
  { id: "8000-10000", label: "₹8,000 – ₹10,000", min: 8000, max: 10000 },
  { id: "above-10000", label: "Above ₹10,000", min: 10000, max: Infinity },
];

// ─────────────────────────────────────────────
// Footer Link Groups
// ─────────────────────────────────────────────
export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", path: "/shop" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Best Sellers", path: "/shop?sort=popular" },
    { label: "Sale", path: "/shop?sale=true" },
    { label: "Gift Cards", path: "/gift-cards" },
  ],
  company: [
    { label: "About Us", path: "/about" },
    { label: "Our Story", path: "/about#story" },
    { label: "Careers", path: "/careers" },
    { label: "Press", path: "/press" },
    { label: "Blog", path: "/blog" },
  ],
  support: [
    { label: "Contact Us", path: "/contact" },
    { label: "FAQs", path: "/faqs" },
    { label: "Shipping & Returns", path: "/shipping-returns" },
    { label: "Size Guide", path: "/size-guide" },
    { label: "Track Order", path: "/track-order" },
  ],
  legal: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Refund Policy", path: "/refund-policy" },
    { label: "Cookie Policy", path: "/cookies" },
  ],
};

// ─────────────────────────────────────────────
// Announcement Bar Messages
// ─────────────────────────────────────────────
export const ANNOUNCEMENTS = [
  "Free shipping on orders above ₹2,999",
  "Summer Sale — Up to 50% off | Code: SUMMER50",
  "30-day hassle-free returns on all orders",
  "New Arrivals just dropped — Shop Now",
];

// ─────────────────────────────────────────────
// Animation Constants
// ─────────────────────────────────────────────
export const ANIMATION = {
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    verySlow: 1.2,
  },
  ease: {
    smooth: [0.25, 0.46, 0.45, 0.94],
    snappy: [0.68, -0.55, 0.27, 1.55],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
};

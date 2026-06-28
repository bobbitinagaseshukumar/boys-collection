import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const categoriesData = [
  {
    name: "Shirts",
    slug: "shirts",
    description: "Premium shirts crafted from the world's finest fabrics — Egyptian cotton, Italian linen, and silk blends for the modern gentleman.",
    image: "/images/categories/cat-shirts.jpg",
  },
  {
    name: "Pants",
    slug: "pants",
    description: "Tailored trousers and versatile pants engineered for impeccable fit. From boardroom wool to weekend chinos, every pair is precision-cut.",
    image: "/images/categories/cat-pants.jpg",
  },
  {
    name: "Jeans",
    slug: "jeans",
    description: "Premium denim from Japanese selvedge to Italian stretch — jeans that age with character and fit like they were made for you.",
    image: "/images/categories/cat-jeans.jpg",
  },
  {
    name: "T-Shirts",
    slug: "tshirts",
    description: "Elevated essentials in Pima cotton, organic blends, and heavyweight cuts. The foundation of every great wardrobe, perfected.",
    image: "/images/categories/cat-tshirts.jpg",
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    description: "Luxury hoodies in French terry, tech fleece, and cashmere blends. Comfort elevated to an art form for those who refuse to compromise.",
    image: "/images/categories/cat-hoodies.jpg",
  },
  {
    name: "Jackets",
    slug: "jackets",
    description: "Statement outerwear from Italian leather biker jackets to tailored wool overcoats. The finishing layer that defines your presence.",
    image: "/images/categories/cat-jackets.jpg",
  }
]

const offersData = [
  {
    code: "SUMMER50",
    discount: 50,
    maxDiscount: 3000,
    minOrder: 2999,
    endDate: new Date("2026-07-15T23:59:59"),
    active: true
  },
  {
    code: "NEWDROP30",
    discount: 30,
    maxDiscount: 2500,
    minOrder: 1999,
    endDate: new Date("2026-08-01T23:59:59"),
    active: true
  },
  {
    code: "PREMIUM25",
    discount: 25,
    maxDiscount: 5000,
    minOrder: 4999,
    endDate: new Date("2026-09-30T23:59:59"),
    active: true
  },
  {
    code: "MONSOON40",
    discount: 40,
    maxDiscount: 4000,
    minOrder: 2499,
    endDate: new Date("2026-08-31T23:59:59"),
    active: true
  }
]

const productsData = [
  {
    title: "Premium Oxford Shirt",
    slug: "premium-oxford-shirt",
    description: "Crafted from the finest Egyptian cotton with a subtle texture weave, this Oxford shirt delivers unparalleled comfort and a tailored silhouette. Mother-of-pearl buttons and reinforced collar stays complete the refined look.",
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    rating: 4.8,
    reviewCount: 142,
    brand: "STYLEX",
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Midnight Black", code: "#1a1a2e" },
      { name: "Royal Navy", code: "#16213e" },
      { name: "Pearl White", code: "#f0ead6" }
    ],
    images: [
      "/images/products/oxford-shirt-1.jpg",
      "/images/products/oxford-shirt-2.jpg",
      "/images/products/oxford-shirt-3.jpg",
      "/images/products/oxford-shirt-4.jpg"
    ],
    isFeatured: true,
    isTrending: false,
    isNewArrival: true,
    stock: 45
  },
  {
    title: "Italian Linen Shirt",
    slug: "italian-linen-shirt",
    description: "Woven from pure Italian linen in Tuscany, this shirt embodies Mediterranean elegance. The relaxed drape and natural breathability make it perfect for warm-weather sophistication.",
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    rating: 4.7,
    reviewCount: 98,
    brand: "STYLEX",
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sand Beige", code: "#d4b896" },
      { name: "Olive Green", code: "#4a5e3a" },
      { name: "Sky Blue", code: "#87ceeb" }
    ],
    images: [
      "/images/products/linen-shirt-1.jpg",
      "/images/products/linen-shirt-2.jpg",
      "/images/products/linen-shirt-3.jpg",
      "/images/products/linen-shirt-4.jpg"
    ],
    isFeatured: false,
    isTrending: true,
    isNewArrival: false,
    stock: 32
  },
  {
    title: "Silk Blend Dress Shirt",
    slug: "silk-blend-dress-shirt",
    description: "A masterfully tailored dress shirt blending premium silk and cotton for a lustrous finish. French cuffs and a spread collar elevate any formal ensemble to black-tie perfection.",
    price: 7999,
    originalPrice: 12999,
    discount: 38,
    rating: 4.9,
    reviewCount: 67,
    brand: "STYLEX",
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Champagne", code: "#f7e7ce" },
      { name: "Charcoal", code: "#36454f" },
      { name: "Ivory", code: "#fffff0" }
    ],
    images: [
      "/images/products/silk-shirt-1.jpg",
      "/images/products/silk-shirt-2.jpg",
      "/images/products/silk-shirt-3.jpg",
      "/images/products/silk-shirt-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    stock: 18
  },
  {
    title: "Mandarin Collar Shirt",
    slug: "mandarin-collar-shirt",
    description: "A contemporary take on the classic band collar, this shirt features premium Supima cotton with a subtle jacquard pattern. Perfect for the modern gentleman who values understated elegance.",
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    rating: 4.6,
    reviewCount: 203,
    brand: "STYLEX",
    category: "shirts",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Jet Black", code: "#0a0a0a" },
      { name: "Burgundy", code: "#800020" },
      { name: "Steel Grey", code: "#71797e" }
    ],
    images: [
      "/images/products/mandarin-shirt-1.jpg",
      "/images/products/mandarin-shirt-2.jpg",
      "/images/products/mandarin-shirt-3.jpg",
      "/images/products/mandarin-shirt-4.jpg"
    ],
    isFeatured: false,
    isTrending: false,
    isNewArrival: true,
    stock: 56
  },
  {
    title: "Tailored Wool Trousers",
    slug: "tailored-wool-trousers",
    description: "Hand-finished wool trousers with a precision-cut slim taper. The premium Italian wool blend drapes beautifully and holds its crease all day. Features a hidden flex waistband for effortless comfort.",
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    rating: 4.8,
    reviewCount: 115,
    brand: "STYLEX",
    category: "pants",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Midnight Navy", code: "#191970" },
      { name: "Charcoal Grey", code: "#36454f" },
      { name: "Black", code: "#0d0d0d" }
    ],
    images: [
      "/images/products/wool-trousers-1.jpg",
      "/images/products/wool-trousers-2.jpg",
      "/images/products/wool-trousers-3.jpg",
      "/images/products/wool-trousers-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    stock: 28
  },
  {
    title: "Stretch Chino Pants",
    slug: "stretch-chino-pants",
    description: "Engineered with a 4-way stretch cotton-elastane blend for all-day mobility. The garment-dyed finish gives each pair a unique, lived-in character while maintaining a polished silhouette.",
    price: 3499,
    originalPrice: 5499,
    discount: 36,
    rating: 4.5,
    reviewCount: 287,
    brand: "STYLEX",
    category: "pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Khaki", code: "#c3b091" },
      { name: "Olive", code: "#556b2f" },
      { name: "Stone", code: "#928e85" },
      { name: "Navy", code: "#1b2a4a" }
    ],
    images: [
      "/images/products/chino-pants-1.jpg",
      "/images/products/chino-pants-2.jpg",
      "/images/products/chino-pants-3.jpg",
      "/images/products/chino-pants-4.jpg"
    ],
    isFeatured: false,
    isTrending: false,
    isNewArrival: true,
    stock: 73
  },
  {
    title: "Linen Drawstring Trousers",
    slug: "linen-drawstring-trousers",
    description: "Relaxed-fit linen trousers with an adjustable drawstring waist and tapered ankle. Crafted from breathable European flax linen that softens beautifully with every wash.",
    price: 4499,
    originalPrice: 6999,
    discount: 36,
    rating: 4.6,
    reviewCount: 156,
    brand: "STYLEX",
    category: "pants",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Natural White", code: "#f5f5dc" },
      { name: "Sand", code: "#c2b280" },
      { name: "Slate Blue", code: "#6a7b8b" }
    ],
    images: [
      "/images/products/linen-trousers-1.jpg",
      "/images/products/linen-trousers-2.jpg",
      "/images/products/linen-trousers-3.jpg",
      "/images/products/linen-trousers-4.jpg"
    ],
    isFeatured: false,
    isTrending: true,
    isNewArrival: false,
    stock: 41
  },
  {
    title: "Pleated Dress Pants",
    slug: "pleated-dress-pants",
    description: "Classic double-pleated dress pants in a luxurious tropical wool blend. The high-rise cut and full break create a distinguished, timeless aesthetic favored by discerning gentlemen.",
    price: 5999,
    originalPrice: 8499,
    discount: 29,
    rating: 4.7,
    reviewCount: 89,
    brand: "STYLEX",
    category: "pants",
    sizes: ["30", "32", "34", "36", "38"],
    colors: [
      { name: "Black", code: "#0d0d0d" },
      { name: "Heather Grey", code: "#9b9ea1" },
      { name: "Dark Brown", code: "#3b2f2f" }
    ],
    images: [
      "/images/products/dress-pants-1.jpg",
      "/images/products/dress-pants-2.jpg",
      "/images/products/dress-pants-3.jpg",
      "/images/products/dress-pants-4.jpg"
    ],
    isFeatured: true,
    isTrending: false,
    isNewArrival: true,
    stock: 35
  },
  {
    title: "Selvedge Raw Denim Jeans",
    slug: "selvedge-raw-denim-jeans",
    description: "Crafted from premium Japanese selvedge denim on vintage shuttle looms, these raw jeans develop a unique patina over time. The 14oz heavyweight fabric is built for decades, not seasons.",
    price: 6499,
    originalPrice: 9999,
    discount: 35,
    rating: 4.9,
    reviewCount: 234,
    brand: "STYLEX",
    category: "jeans",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Raw Indigo", code: "#1a1b4b" },
      { name: "Deep Black", code: "#111111" }
    ],
    images: [
      "/images/products/selvedge-jeans-1.jpg",
      "/images/products/selvedge-jeans-2.jpg",
      "/images/products/selvedge-jeans-3.jpg",
      "/images/products/selvedge-jeans-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    stock: 22
  },
  {
    title: "Slim Fit Stretch Jeans",
    slug: "slim-fit-stretch-jeans",
    description: "Modern slim-fit jeans engineered with advanced stretch technology for unmatched comfort. The hand-sanded whisker wash and subtle distressing deliver effortless downtown style.",
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    rating: 4.6,
    reviewCount: 312,
    brand: "STYLEX",
    category: "jeans",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Medium Wash", code: "#4169e1" },
      { name: "Dark Wash", code: "#1a2744" },
      { name: "Light Wash", code: "#8db0d4" }
    ],
    images: [
      "/images/products/slim-jeans-1.jpg",
      "/images/products/slim-jeans-2.jpg",
      "/images/products/slim-jeans-3.jpg",
      "/images/products/slim-jeans-4.jpg"
    ],
    isFeatured: false,
    isTrending: true,
    isNewArrival: true,
    stock: 64
  },
  {
    title: "Relaxed Tapered Jeans",
    slug: "relaxed-tapered-jeans",
    description: "A relaxed thigh that tapers to a clean ankle — the ideal balance of comfort and contemporary style. Premium Turkish cotton denim with a structured twill weave for enduring quality.",
    price: 4499,
    originalPrice: 6999,
    discount: 36,
    rating: 4.5,
    reviewCount: 178,
    brand: "STYLEX",
    category: "jeans",
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Vintage Blue", code: "#3b5998" },
      { name: "Washed Black", code: "#2c2c2c" },
      { name: "Stone Grey", code: "#8e8e8e" }
    ],
    images: [
      "/images/products/tapered-jeans-1.jpg",
      "/images/products/tapered-jeans-2.jpg",
      "/images/products/tapered-jeans-3.jpg",
      "/images/products/tapered-jeans-4.jpg"
    ],
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    stock: 49
  },
  {
    title: "Distressed Designer Jeans",
    slug: "distressed-designer-jeans",
    description: "Each pair is individually hand-distressed by artisans for a one-of-a-kind finish. The premium Italian stretch denim moves with you while the ripped detailing adds bold, editorial edge.",
    price: 5499,
    originalPrice: 8999,
    discount: 39,
    rating: 4.7,
    reviewCount: 145,
    brand: "STYLEX",
    category: "jeans",
    sizes: ["28", "30", "32", "34"],
    colors: [
      { name: "Faded Blue", code: "#6b8cae" },
      { name: "Off Black", code: "#1e1e1e" }
    ],
    images: [
      "/images/products/distressed-jeans-1.jpg",
      "/images/products/distressed-jeans-2.jpg",
      "/images/products/distressed-jeans-3.jpg",
      "/images/products/distressed-jeans-4.jpg"
    ],
    isFeatured: true,
    isTrending: false,
    isNewArrival: true,
    stock: 27
  },
  {
    title: "Pima Cotton Crew Tee",
    slug: "pima-cotton-crew-tee",
    description: "The quintessential luxury t-shirt in ultra-soft Peruvian Pima cotton. A heavier 200 GSM weight provides structure and opacity while the pre-shrunk finish ensures a consistent fit wash after wash.",
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    rating: 4.7,
    reviewCount: 456,
    brand: "STYLEX",
    category: "tshirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#0d0d0d" },
      { name: "White", code: "#fafafa" },
      { name: "Heather Grey", code: "#b0b0b0" },
      { name: "Navy", code: "#1b2a4a" }
    ],
    images: [
      "/images/products/pima-tee-1.jpg",
      "/images/products/pima-tee-2.jpg",
      "/images/products/pima-tee-3.jpg",
      "/images/products/pima-tee-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    stock: 120
  },
  {
    title: "Graphic Art Print Tee",
    slug: "graphic-art-print-tee",
    description: "Limited-edition graphic tee featuring original artwork by emerging Indian artists. Printed using eco-friendly water-based inks on organic cotton for a soft hand-feel that lasts.",
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    rating: 4.4,
    reviewCount: 189,
    brand: "STYLEX",
    category: "tshirts",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Vintage Black", code: "#1c1c1c" },
      { name: "Off White", code: "#faf0e6" },
      { name: "Dusty Rose", code: "#b76e79" }
    ],
    images: [
      "/images/products/graphic-tee-1.jpg",
      "/images/products/graphic-tee-2.jpg",
      "/images/products/graphic-tee-3.jpg",
      "/images/products/graphic-tee-4.jpg"
    ],
    isFeatured: false,
    isTrending: true,
    isNewArrival: true,
    stock: 85
  },
  {
    title: "Henley Long Sleeve Tee",
    slug: "henley-long-sleeve-tee",
    description: "A refined henley with a three-button placket and raglan sleeves, cut from a luxurious modal-cotton blend. The garment-dyed finish creates rich, dimensional color with a worn-in softness.",
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    rating: 4.6,
    reviewCount: 134,
    brand: "STYLEX",
    category: "tshirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Burgundy Wine", code: "#722f37" },
      { name: "Forest Green", code: "#2d4a22" },
      { name: "Charcoal", code: "#3a3a3a" }
    ],
    images: [
      "/images/products/henley-tee-1.jpg",
      "/images/products/henley-tee-2.jpg",
      "/images/products/henley-tee-3.jpg",
      "/images/products/henley-tee-4.jpg"
    ],
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    stock: 58
  },
  {
    title: "Oversized Drop Shoulder Tee",
    slug: "oversized-drop-shoulder-tee",
    description: "Intentionally oversized with dropped shoulders and an extended body for a contemporary streetwear aesthetic. The heavyweight 280 GSM cotton delivers a premium, structured drape.",
    price: 2299,
    originalPrice: 3499,
    discount: 34,
    rating: 4.5,
    reviewCount: 267,
    brand: "STYLEX",
    category: "tshirts",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Smoke Black", code: "#171717" },
      { name: "Bone White", code: "#e8dcc8" },
      { name: "Sage", code: "#9caf88" },
      { name: "Lavender", code: "#b4a7d6" }
    ],
    images: [
      "/images/products/oversized-tee-1.jpg",
      "/images/products/oversized-tee-2.jpg",
      "/images/products/oversized-tee-3.jpg",
      "/images/products/oversized-tee-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    stock: 93
  },
  {
    title: "Premium Zip-Up Hoodie",
    slug: "premium-zip-up-hoodie",
    description: "A luxury zip-up hoodie in heavyweight French terry with a brushed interior. Swiss-made YKK zippers, ribbed cuffs, and a lined hood with an adjustable drawcord make this a cut above the rest.",
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    rating: 4.8,
    reviewCount: 198,
    brand: "STYLEX",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Obsidian", code: "#0b0b0b" },
      { name: "Ash Grey", code: "#696969" },
      { name: "Deep Navy", code: "#0f1e3d" }
    ],
    images: [
      "/images/products/zip-hoodie-1.jpg",
      "/images/products/zip-hoodie-2.jpg",
      "/images/products/zip-hoodie-3.jpg",
      "/images/products/zip-hoodie-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    stock: 37
  },
  {
    title: "Pullover Fleece Hoodie",
    slug: "pullover-fleece-hoodie",
    description: "Wrapped in plush Italian fleece, this pullover hoodie is the ultimate in cozy luxury. The oversized kangaroo pocket and double-layered hood provide warmth and effortless street style.",
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    rating: 4.7,
    reviewCount: 223,
    brand: "STYLEX",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cream", code: "#fffdd0" },
      { name: "Mocha", code: "#6b4423" },
      { name: "Graphite", code: "#383838" }
    ],
    images: [
      "/images/products/pullover-hoodie-1.jpg",
      "/images/products/pullover-hoodie-2.jpg",
      "/images/products/pullover-hoodie-3.jpg",
      "/images/products/pullover-hoodie-4.jpg"
    ],
    isFeatured: false,
    isTrending: false,
    isNewArrival: true,
    stock: 52
  },
  {
    title: "Tech Fleece Hoodie",
    slug: "tech-fleece-hoodie",
    description: "Engineered with a dual-layer spacer fabric that traps warmth without bulk. Bonded seams, laser-cut ventilation panels, and zip pockets deliver a futuristic, performance-driven silhouette.",
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    rating: 4.9,
    reviewCount: 167,
    brand: "STYLEX",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Stealth Black", code: "#121212" },
      { name: "Cement Grey", code: "#8d8d8d" },
      { name: "Dark Olive", code: "#3c4a2e" }
    ],
    images: [
      "/images/products/tech-hoodie-1.jpg",
      "/images/products/tech-hoodie-2.jpg",
      "/images/products/tech-hoodie-3.jpg",
      "/images/products/tech-hoodie-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    stock: 29
  },
  {
    title: "Cashmere Blend Hoodie",
    slug: "cashmere-blend-hoodie",
    description: "The pinnacle of hoodie luxury — crafted from a cashmere-merino wool blend sourced from the highlands of Mongolia. Impossibly soft, naturally temperature-regulating, and built to age gracefully.",
    price: 9999,
    originalPrice: 12999,
    discount: 23,
    rating: 4.9,
    reviewCount: 76,
    brand: "STYLEX",
    category: "hoodies",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Camel", code: "#c19a6b" },
      { name: "Charcoal Heather", code: "#4a4a4a" },
      { name: "Oatmeal", code: "#d3c9b8" }
    ],
    images: [
      "/images/products/cashmere-hoodie-1.jpg",
      "/images/products/cashmere-hoodie-2.jpg",
      "/images/products/cashmere-hoodie-3.jpg",
      "/images/products/cashmere-hoodie-4.jpg"
    ],
    isFeatured: true,
    isTrending: false,
    isNewArrival: false,
    stock: 14
  },
  {
    title: "Italian Leather Biker Jacket",
    slug: "italian-leather-biker-jacket",
    description: "Handcrafted from buttery-soft Italian lambskin leather with asymmetric zip closure and antique brass hardware. Fully lined in quilted satin with interior pockets. A timeless rebellion staple.",
    price: 12999,
    originalPrice: 18999,
    discount: 32,
    rating: 4.9,
    reviewCount: 89,
    brand: "STYLEX",
    category: "jackets",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", code: "#0d0d0d" },
      { name: "Dark Brown", code: "#3e2723" }
    ],
    images: [
      "/images/products/leather-jacket-1.jpg",
      "/images/products/leather-jacket-2.jpg",
      "/images/products/leather-jacket-3.jpg",
      "/images/products/leather-jacket-4.jpg"
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    stock: 12
  },
  {
    title: "Quilted Bomber Jacket",
    slug: "quilted-bomber-jacket",
    description: "A modern bomber silhouette elevated with diamond quilting and a premium satin shell. The ribbed collar, cuffs, and hem provide a snug fit while the lightweight insulation keeps you warm without bulk.",
    price: 7499,
    originalPrice: 10999,
    discount: 32,
    rating: 4.7,
    reviewCount: 156,
    brand: "STYLEX",
    category: "jackets",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Matte Black", code: "#1a1a1a" },
      { name: "Olive Drab", code: "#4a5535" },
      { name: "Midnight Blue", code: "#191970" }
    ],
    images: [
      "/images/products/bomber-jacket-1.jpg",
      "/images/products/bomber-jacket-2.jpg",
      "/images/products/bomber-jacket-3.jpg",
      "/images/products/bomber-jacket-4.jpg"
    ],
    isFeatured: false,
    isTrending: true,
    isNewArrival: true,
    stock: 33
  },
  {
    title: "Wool Overcoat",
    slug: "wool-overcoat",
    description: "A statement overcoat in double-faced Italian wool with a notch lapel and single-breasted construction. The mid-thigh length and clean lines make it the definitive piece for sharp winter layering.",
    price: 11999,
    originalPrice: 16999,
    discount: 29,
    rating: 4.8,
    reviewCount: 67,
    brand: "STYLEX",
    category: "jackets",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Camel", code: "#c19a6b" },
      { name: "Charcoal", code: "#36454f" },
      { name: "Black", code: "#0d0d0d" }
    ],
    images: [
      "/images/products/overcoat-1.jpg",
      "/images/products/overcoat-2.jpg",
      "/images/products/overcoat-3.jpg",
      "/images/products/overcoat-4.jpg"
    ],
    isFeatured: true,
    isTrending: false,
    isNewArrival: false,
    stock: 19
  },
  {
    title: "Windbreaker Track Jacket",
    slug: "windbreaker-track-jacket",
    description: "A lightweight, water-resistant windbreaker with sealed seams and reflective accents. The packable design folds into its own pocket, making it the perfect travel companion for the jet-setting gentleman.",
    price: 4999,
    originalPrice: 7499,
    discount: 33,
    rating: 4.5,
    reviewCount: 201,
    brand: "STYLEX",
    category: "jackets",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Shadow Black", code: "#151515" },
      { name: "Storm Grey", code: "#5a5a5a" },
      { name: "Racing Green", code: "#1a3a2a" },
      { name: "Deep Red", code: "#7b1818" }
    ],
    images: [
      "/images/products/windbreaker-1.jpg",
      "/images/products/windbreaker-2.jpg",
      "/images/products/windbreaker-3.jpg",
      "/images/products/windbreaker-4.jpg"
    ],
    isFeatured: false,
    isTrending: false,
    isNewArrival: true,
    stock: 61
  }
]

const testimonialsData = [
  {
    name: "Arjun Kapoor",
    rating: 5,
    comment: "The quality of the leather jacket is absolutely phenomenal. The Italian lambskin feels incredible and the fit is spot-on. I've received more compliments in one week than I have all year. STYLEX has earned a customer for life.",
    location: "Mumbai"
  },
  {
    name: "Vikram Mehta",
    rating: 5,
    comment: "I was skeptical about buying premium clothes online, but the Oxford shirt exceeded every expectation. The fabric weight, the stitching, the collar construction — everything screams quality. Fast shipping to Delhi too.",
    location: "New Delhi"
  },
  {
    name: "Rohan Sharma",
    rating: 4,
    comment: "The selvedge jeans are stunning — you can feel the difference in the denim quality immediately. They're stiff out of the box (as expected with raw denim) but are already breaking in beautifully. Worth every rupee.",
    location: "Bangalore"
  },
  {
    name: "Aditya Patel",
    rating: 5,
    comment: "The cashmere hoodie is hands down the softest piece of clothing I've ever owned. It feels like wearing a cloud. My wife keeps stealing it, so I'm ordering a second one. The packaging was premium too — felt like a gift.",
    location: "Ahmedabad"
  }
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.shippingAddress.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.color.deleteMany()
  await prisma.size.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.user.deleteMany()
  await prisma.oTP.deleteMany()

  console.log('🧹 Cleaned up existing data tables.')

  // Seed Categories
  const categoryMap = {}
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: cat
    })
    categoryMap[cat.slug] = createdCat.id
  }
  console.log(`✓ Seeded ${categoriesData.length} categories.`)

  // Seed Coupons
  for (const coupon of offersData) {
    await prisma.coupon.create({
      data: coupon
    })
  }
  console.log(`✓ Seeded ${offersData.length} coupons.`)

  // Seed Products
  for (const p of productsData) {
    const categoryId = categoryMap[p.category]
    if (!categoryId) continue

    await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        reviewCount: p.reviewCount,
        brand: p.brand,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isTrending: p.isTrending,
        isNewArrival: p.isNewArrival,
        categoryId: categoryId,
        images: {
          create: p.images.map(img => ({ url: img }))
        },
        colors: {
          create: p.colors.map(col => ({ name: col.name, code: col.code }))
        },
        sizes: {
          create: p.sizes.map(sz => ({ value: sz }))
        }
      }
    })
  }
  console.log(`✓ Seeded ${productsData.length} products.`)

  // Seed Users
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const customerPassword = await bcrypt.hash('Customer@123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@stylex.in',
      password: adminPassword,
      name: 'STYLEX Admin',
      role: 'ADMIN'
    }
  })

  const customer = await prisma.user.create({
    data: {
      email: 'customer@stylex.in',
      password: customerPassword,
      name: 'Arjun Malhotra',
      phone: '+91 98765 43210',
      role: 'CUSTOMER'
    }
  })
  console.log('✓ Seeded default Admin and Customer accounts.')

  // Seed Testimonials as Reviews linked to the default customer
  const seededProducts = await prisma.product.findMany()
  for (let i = 0; i < testimonialsData.length; i++) {
    const t = testimonialsData[i]
    // Link to a product dynamically
    const product = seededProducts[i % seededProducts.length]
    await prisma.review.create({
      data: {
        rating: t.rating,
        comment: t.comment,
        verified: true,
        userId: customer.id,
        productId: product.id
      }
    })
  }
  console.log(`✓ Seeded ${testimonialsData.length} testimonials/reviews.`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

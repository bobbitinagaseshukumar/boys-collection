import ProductCard from './ProductCard'

const directionOptions = ['left', 'right', 'bottom', 'top']

export default function ProductGrid({ products = [], className = '' }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🔍</span>
        <h3 className="text-white/60 text-lg font-display font-medium mb-2">No products found</h3>
        <p className="text-white/30 text-sm">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className={`product-grid ${className}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          animationDirection={directionOptions[index % directionOptions.length]}
        />
      ))}
    </div>
  )
}

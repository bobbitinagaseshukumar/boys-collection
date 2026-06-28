import { useMemo } from 'react'
import AnimatedText from '@/components/ui/AnimatedText'
import ProductCard from '@/components/product/ProductCard'
import { products } from '@/data/products'

export default function TrendingProducts() {
  const trending = useMemo(() => products.filter((p) => p.isTrending).slice(0, 8), [])

  return (
    <section className="section-padding relative">
      <div className="container-premium">
        <div className="text-center mb-12">
          <AnimatedText animation="gradient" className="text-section-title mb-3" tag="h2">
            Trending Now
          </AnimatedText>
          <AnimatedText animation="fadeUp" delay={0.2} className="text-section-subtitle max-w-lg mx-auto" tag="p">
            Most popular styles chosen by our customers
          </AnimatedText>
        </div>

        <div className="product-grid">
          {trending.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} animationDirection={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>
      </div>
    </section>
  )
}

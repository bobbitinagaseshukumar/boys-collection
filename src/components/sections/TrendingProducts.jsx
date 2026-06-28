import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import AnimatedText from '@/components/ui/AnimatedText'
import ProductCard from '@/components/product/ProductCard'
import { selectAllProducts } from '@/redux/slices/productSlice'

export default function TrendingProducts() {
  const products = useSelector(selectAllProducts)
  const trending = useMemo(() => products.filter((p) => p.isTrending || p.trending).slice(0, 8), [products])

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

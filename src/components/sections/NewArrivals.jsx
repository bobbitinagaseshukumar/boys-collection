import { useMemo } from 'react'
import AnimatedText from '@/components/ui/AnimatedText'
import ProductCard from '@/components/product/ProductCard'
import MagneticButton from '@/components/ui/MagneticButton'
import { products } from '@/data/products'

export default function NewArrivals() {
  const newProducts = useMemo(() => products.filter((p) => p.isNewArrival).slice(0, 8), [])

  return (
    <section className="section-padding relative">
      <div className="container-premium">
        <div className="text-center mb-12">
          <AnimatedText animation="fadeUp" className="text-section-title text-white mb-3" tag="h2">
            New Arrivals
          </AnimatedText>
          <AnimatedText animation="fadeUp" delay={0.2} className="text-section-subtitle max-w-lg mx-auto" tag="p">
            Be the first to wear our latest premium collections
          </AnimatedText>
        </div>

        <div className="product-grid">
          {newProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} animationDirection="left" />
          ))}
        </div>

        <div className="text-center mt-10">
          <MagneticButton variant="outline" href="/shop?filter=new">
            View All New Arrivals
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

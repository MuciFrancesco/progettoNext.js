import { Product } from '@/lib/types'
import HeroBanner from '@/components/organisms/HeroBanner'
import ProductGrid from '@/components/organisms/ProductGrid'

interface HomeTemplateProps {
  products: Product[]
  onProductView: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function HomeTemplate({
  products,
  onProductView,
  onAddToCart,
}: HomeTemplateProps) {
  return (
    <main className="page-content page-enter">
      <HeroBanner onExplore={() => {}} />
      <ProductGrid
        products={products}
        onView={onProductView}
        onAddToCart={onAddToCart}
      />
    </main>
  )
}

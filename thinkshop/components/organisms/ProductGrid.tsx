import { Product } from '@/lib/types'
import ProductCard from '@/components/molecules/ProductCard'

interface ProductGridProps {
  products: Product[]
  onView: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({
  products,
  onView,
  onAddToCart,
}: ProductGridProps) {
  return (
    <>
      <div className="section-header">
        <h2 className="section-header__title">Prodotti in evidenza</h2>
        <button className="section-header__link">Vedi tutti →</button>
      </div>

      <ul className="product-grid" role="list">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              onView={onView}
              onAddToCart={onAddToCart}
            />
          </li>
        ))}
      </ul>
    </>
  )
}

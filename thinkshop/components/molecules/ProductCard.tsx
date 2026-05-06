'use client'

import { Product } from '@/lib/types'
import Badge from '@/components/atoms/Badge'
import StarRating from '@/components/atoms/StarRating'
import Button from '@/components/atoms/Button'

interface ProductCardProps {
  product: Product
  onView: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function ProductCard({
  product,
  onView,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.inStock) onAddToCart(product)
  }

  return (
    <article className="product-card" onClick={() => onView(product)}>
      <div className="product-card__image-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card__image"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23F0F2F5' width='300' height='200'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%23CCC' font-size='50'%3E📦%3C/text%3E%3C/svg%3E"
          }}
        />
        <div className="product-card__discount">
          <Badge type="discount" value={product.discount} />
        </div>
        {!product.inStock && (
          <div className="product-card__overlay">
            <Badge type="stock" inStock={false} />
          </div>
        )}
      </div>

      <p className="product-card__brand">{product.brand}</p>

      <h2 className="product-card__name">{product.name}</h2>

      <StarRating rating={product.rating} reviewCount={product.reviewCount} />

      <div className="product-card__price">
        <span className="product-card__price-current">
          €{product.price.toFixed(2)}
        </span>
        <span className="product-card__price-original">
          €{product.originalPrice.toFixed(2)}
        </span>
      </div>

      <Button
        variant={product.inStock ? 'gold' : 'outline'}
        size="sm"
        onClick={handleAddToCart}
        disabled={!product.inStock}
      >
        {product.inStock ? 'Aggiungi al carrello' : 'Non disponibile'}
      </Button>
    </article>
  )
}

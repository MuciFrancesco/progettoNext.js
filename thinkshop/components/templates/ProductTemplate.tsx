import Link from 'next/link'
import { Product } from '@/lib/types'
import ProductGallery from '@/components/organisms/ProductGallery'
import BuyBox from '@/components/organisms/BuyBox'
import StarRating from '@/components/atoms/StarRating'
import PriceDisplay from '@/components/molecules/PriceDisplay'

interface ProductTemplateProps {
  product: Product
  onAddToCart: (product: Product, qty: number) => void
  onBuyNow: (product: Product, qty: number) => void
}

export default function ProductTemplate({
  product,
  onAddToCart,
  onBuyNow,
}: ProductTemplateProps) {
  return (
    <main className="page-content page-enter">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Percorso">
        <Link href="/" className="breadcrumb__link">Home</Link>
        <span className="breadcrumb__separator">›</span>
        <Link href="/" className="breadcrumb__link">{product.category}</Link>
        <span className="breadcrumb__separator">›</span>
        <span>{product.name.substring(0, 50)}…</span>
      </nav>

      {/* Gallery + Info + BuyBox */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 24, alignItems: 'start' }}>
        {/* Left: Gallery + Info */}
        <div className="product-info">
          <ProductGallery product={product} />

          <div style={{ marginTop: 24 }}>
            <p className="product-info__brand">{product.brand}</p>
            <h1 className="product-info__title">{product.name}</h1>

            <div className="product-info__meta">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              <span className="product-info__top-tag">Top 3 in {product.category}</span>
            </div>

            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              showInstallments
            />

            {/* Features */}
            <div style={{ marginBottom: 24 }}>
              <h2 className="product-info__features-title">Caratteristiche principali</h2>
              <ul className="product-info__features" aria-label="Caratteristiche">
                {product.features.map((f, i) => (
                  <li key={i} className="product-info__feature">
                    <span className="product-info__feature-dot" aria-hidden="true">◆</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specs */}
            <h2 className="specs-table__title">Specifiche tecniche</h2>
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: BuyBox */}
        <BuyBox
          product={product}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />
      </div>
    </main>
  )
}

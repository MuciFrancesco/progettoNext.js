'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'

interface ProductGalleryProps {
  product: Product
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // In production these would be distinct images from the API
  const images = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ]

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    ;(e.target as HTMLImageElement).src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='250'%3E%3Crect fill='%23F0F2F5' width='300' height='250'/%3E%3Ctext x='150' y='125' text-anchor='middle' fill='%23CCC' font-size='60'%3E📦%3C/text%3E%3C/svg%3E"
  }

  return (
    <div className="gallery">
      {/* Thumbnails */}
      <div className="gallery__thumbs" role="tablist" aria-label="Immagini prodotto">
        {images.map((src, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Immagine ${i + 1}`}
            className={`gallery__thumb ${i === activeIndex ? 'gallery__thumb--active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            <img src={src} alt={`${product.name} vista ${i + 1}`} onError={handleError} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="gallery__main" role="tabpanel">
        <img
          src={images[activeIndex]}
          alt={product.name}
          onError={handleError}
        />
      </div>
    </div>
  )
}

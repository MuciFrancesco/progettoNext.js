'use client'

import { useState } from 'react'
import Image from 'next/image'

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='250'%3E%3Crect fill='%23F0F2F5' width='300' height='250'/%3E%3Ctext x='150' y='125' text-anchor='middle' fill='%23CCC' font-size='60'%3E📦%3C/text%3E%3C/svg%3E"

interface ProductImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
}

export default function ProductImage({
  src,
  alt,
  fill = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      onError={() => setImgSrc(PLACEHOLDER)}
      style={{ objectFit: fill ? 'cover' : 'contain' }}
      unoptimized
    />
  )
}

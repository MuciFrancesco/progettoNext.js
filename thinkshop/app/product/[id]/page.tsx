'use client'

import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/lib/data'
import { Product } from '@/lib/types'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/organisms/Navbar'
import Footer from '@/components/organisms/Footer'
import ProductTemplate from '@/components/templates/ProductTemplate'

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { addItem, totalItems } = useCartStore()
  const { user } = useAuthStore()

  const product = PRODUCTS.find((p) => p.id === Number(params.id))
  if (!product) notFound()

  const handleAddToCart = (prod: Product, qty: number) => {
    for (let i = 0; i < qty; i++) addItem(prod)
  }

  const handleBuyNow = (prod: Product, qty: number) => {
    handleAddToCart(prod, qty)
    router.push('/cart')
  }

  return (
    <>
      <Navbar cartCount={totalItems()} user={user} />
      <ProductTemplate
        product={product}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
      <Footer />
    </>
  )
}

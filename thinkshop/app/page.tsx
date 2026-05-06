'use client'

import { useRouter } from 'next/navigation'
import { PRODUCTS } from '@/lib/data'
import { Product } from '@/lib/types'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/organisms/Navbar'
import Footer from '@/components/organisms/Footer'
import HomeTemplate from '@/components/templates/HomeTemplate'

export default function HomePage() {
  const router = useRouter()
  const { addItem, totalItems } = useCartStore()
  const { user } = useAuthStore()

  const handleProductView = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
  }

  return (
    <>
      <Navbar cartCount={totalItems()} user={user} />
      <HomeTemplate
        products={PRODUCTS}
        onProductView={handleProductView}
        onAddToCart={handleAddToCart}
      />
      <Footer />
    </>
  )
}

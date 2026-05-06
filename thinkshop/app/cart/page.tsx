'use client'

import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/organisms/Navbar'
import Footer from '@/components/organisms/Footer'
import CartTemplate from '@/components/templates/CartTemplate'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems } = useCartStore()
  const { user } = useAuthStore()

  return (
    <>
      <Navbar cartCount={totalItems()} user={user} />
      <CartTemplate
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      <Footer />
    </>
  )
}

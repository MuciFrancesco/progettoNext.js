'use client'

import { useRouter } from 'next/navigation'
import { ORDERS, PRODUCTS } from '@/lib/data'
import { Order } from '@/lib/types'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/organisms/Navbar'
import Footer from '@/components/organisms/Footer'
import OrdersTemplate from '@/components/templates/OrdersTemplate'

export default function OrdersPage() {
  const router = useRouter()
  const { addItem, totalItems } = useCartStore()
  const { user } = useAuthStore()

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => addItem(item))
    router.push('/cart')
  }

  const handleReturn = (order: Order) => {
    // In production: open a return modal or navigate to return flow
    console.info('Return requested for order:', order.id)
  }

  return (
    <>
      <Navbar cartCount={totalItems()} user={user} />
      <OrdersTemplate
        orders={ORDERS}
        onReorder={handleReorder}
        onReturn={handleReturn}
      />
      <Footer />
    </>
  )
}

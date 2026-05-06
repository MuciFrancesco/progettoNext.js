import { Order } from '@/lib/types'
import OrderList from '@/components/organisms/OrderList'

interface OrdersTemplateProps {
  orders: Order[]
  onReorder: (order: Order) => void
  onReturn: (order: Order) => void
}

export default function OrdersTemplate({
  orders,
  onReorder,
  onReturn,
}: OrdersTemplateProps) {
  return (
    <main className="page-content page-enter">
      <h1 className="page-title">Resi & Ordini</h1>
      <OrderList orders={orders} onReorder={onReorder} onReturn={onReturn} />
    </main>
  )
}

import { Order } from '@/lib/types'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

interface OrderRowProps {
  order: Order
  onReorder: (order: Order) => void
  onReturn: (order: Order) => void
}

export default function OrderRow({ order, onReorder, onReturn }: OrderRowProps) {
  return (
    <div className="order-card">
      <div className="order-card__header">
        <div>
          <p className="order-card__id">Ordine {order.id}</p>
          <p className="order-card__date">{order.date}</p>
        </div>

        <Badge type="status" status={order.status} />

        {order.trackingCode && (
          <span style={{ fontSize: 12, color: 'var(--color-text-3)' }}>
            Tracking: {order.trackingCode}
          </span>
        )}

        <p className="order-card__total">€{order.total.toFixed(2)}</p>
      </div>

      <div className="order-card__body">
        {order.items.map((item) => (
          <div key={item.id} className="order-item">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="order-item__image"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='58' height='58'%3E%3Crect fill='%23F0F2F5' width='58' height='58'/%3E%3C/svg%3E"
              }}
            />
            <div style={{ flex: 1 }}>
              <p className="order-item__name">{item.name}</p>
              <p className="order-item__brand">
                {item.brand} · €{item.price.toFixed(2)}
              </p>
            </div>

            <div className="order-item__actions">
              {order.status === 'Consegnato' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth={false}
                    onClick={() => onReturn(order)}
                  >
                    Avvia reso
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    fullWidth={false}
                    onClick={() => onReorder(order)}
                  >
                    Riacquista
                  </Button>
                </>
              )}
              {order.status === 'Reso avviato' && (
                <Button variant="outline" size="sm" fullWidth={false}>
                  Stato reso →
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

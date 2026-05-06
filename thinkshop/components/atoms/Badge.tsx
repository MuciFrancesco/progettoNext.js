import { OrderStatus } from '@/lib/types'

type BadgeProps =
  | { type: 'discount'; value: number }
  | { type: 'stock'; inStock: boolean }
  | { type: 'status'; status: OrderStatus }

export default function Badge(props: BadgeProps) {
  if (props.type === 'discount') {
    return (
      <span className="badge badge--discount">
        -{props.value}%
      </span>
    )
  }

  if (props.type === 'stock') {
    return props.inStock ? (
      <span className="badge badge--stock">✓ Disponibile</span>
    ) : (
      <span className="badge badge--outofstock">Esaurito</span>
    )
  }

  const statusMap: Record<OrderStatus, string> = {
    Consegnato:    'badge--status-consegnato',
    'In transito': 'badge--status-transito',
    'Reso avviato':'badge--status-reso',
    Annullato:     'badge--status-annullato',
  }

  return (
    <span className={`badge ${statusMap[props.status]}`}>
      {props.status}
    </span>
  )
}

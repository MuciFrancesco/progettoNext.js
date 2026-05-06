import Button from '@/components/atoms/Button'
import Link from 'next/link'

interface CartSummaryProps {
  subtotal: number
  itemCount: number
}

const FREE_SHIPPING_THRESHOLD = 49

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99
  const total = subtotal + shipping
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <aside className="order-summary" aria-label="Riepilogo ordine">
      <h2 className="order-summary__title">Riepilogo ordine</h2>

      <div className="order-summary__row">
        <span>Subtotale ({itemCount} articoli)</span>
        <span>€{subtotal.toFixed(2)}</span>
      </div>

      <div className="order-summary__row">
        <span>Spedizione</span>
        <span className={shipping === 0 ? 'order-summary__row-value--free' : ''}>
          {shipping === 0 ? 'GRATUITA' : `€${shipping.toFixed(2)}`}
        </span>
      </div>

      <div className="order-summary__row">
        <span>Coupon</span>
        <span>—</span>
      </div>

      <div className="order-summary__total">
        <span>Totale</span>
        <span>€{total.toFixed(2)}</span>
      </div>

      {remaining > 0 && (
        <p className="order-summary__banner">
          🎁 Aggiungi €{remaining.toFixed(2)} per la spedizione gratuita!
        </p>
      )}

      <div className="order-summary__actions">
        <Button variant="gold" style={{ fontSize: 15, padding: '12px 0' }}>
          Procedi al pagamento →
        </Button>
        <p className="order-summary__security">🔒 Checkout sicuro — SSL 256-bit</p>
        <Link href="/">
          <Button variant="outline">← Continua gli acquisti</Button>
        </Link>
      </div>
    </aside>
  )
}

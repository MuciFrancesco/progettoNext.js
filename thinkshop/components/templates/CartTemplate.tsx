import Link from 'next/link'
import { CartItem as CartItemType } from '@/lib/types'
import CartItemComponent from '@/components/molecules/CartItem'
import CartSummary from '@/components/organisms/CartSummary'
import Button from '@/components/atoms/Button'

interface CartTemplateProps {
  items: CartItemType[]
  onUpdateQuantity: (id: number, qty: number) => void
  onRemoveItem: (id: number) => void
}

export default function CartTemplate({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartTemplateProps) {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <main className="page-content page-enter">
      <h1 className="page-title">🛒 Il tuo carrello</h1>

      <div className="cart-layout">
        {/* Items list */}
        <div className="cart-box">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="cart-empty__icon">🛒</p>
              <h2 className="cart-empty__title">Il carrello è vuoto</h2>
              <p className="cart-empty__subtitle">
                Sfoglia i prodotti e aggiungi qualcosa di interessante
              </p>
              <Link href="/">
                <Button variant="gold" fullWidth={false}>
                  Vai ai prodotti
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}

              <p className="cart-subtotal">
                Subtotale ({itemCount} articoli):{' '}
                <strong>€{subtotal.toFixed(2)}</strong>
              </p>
            </>
          )}
        </div>

        {/* Order summary */}
        <CartSummary subtotal={subtotal} itemCount={itemCount} />
      </div>
    </main>
  )
}

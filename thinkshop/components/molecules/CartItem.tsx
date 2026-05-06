'use client'

import { CartItem as CartItemType } from '@/lib/types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: number, qty: number) => void
  onRemove: (id: number) => void
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="cart-item">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="cart-item__image"
        onError={(e) => {
          ;(e.target as HTMLImageElement).src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23F0F2F5' width='96' height='96'/%3E%3C/svg%3E"
        }}
      />

      <div>
        <p className="cart-item__brand">{item.brand}</p>
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__availability">✓ Disponibile — Consegna rapida</p>

        <div className="cart-item__actions">
          <div className="cart-item__qty-control">
            <button
              className="cart-item__qty-btn"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label="Diminuisci quantità"
            >
              −
            </button>
            <span className="cart-item__qty-value">{item.quantity}</span>
            <button
              className="cart-item__qty-btn"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label="Aumenta quantità"
            >
              +
            </button>
          </div>

          <button
            className="cart-item__link"
            onClick={() => onRemove(item.id)}
          >
            Rimuovi
          </button>

          <button className="cart-item__link">Salva</button>
        </div>
      </div>

      <div>
        <p className="cart-item__total">
          €{(item.price * item.quantity).toFixed(2)}
        </p>
        {item.quantity > 1 && (
          <p className="cart-item__unit-price">
            €{item.price.toFixed(2)} cad.
          </p>
        )}
      </div>
    </div>
  )
}

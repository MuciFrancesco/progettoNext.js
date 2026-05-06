'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

interface BuyBoxProps {
  product: Product
  onAddToCart: (product: Product, qty: number) => void
  onBuyNow: (product: Product, qty: number) => void
}

const TRUST_ITEMS = [
  { icon: '🔄', text: 'Reso gratuito entro 30 giorni' },
  { icon: '🔒', text: 'Pagamento 100% sicuro' },
  { icon: '🛡️', text: 'Garanzia Think Shop 2 anni' },
]

export default function BuyBox({ product, onAddToCart, onBuyNow }: BuyBoxProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    onBuyNow(product, quantity)
  }

  return (
    <aside className="buybox" aria-label="Acquisto rapido">
      <div style={{ marginBottom: 12 }}>
        <Badge type="stock" inStock={product.inStock} />
      </div>

      <p className="buybox__price">€{product.price.toFixed(2)}</p>

      {product.inStock && (
        <div className="buybox__delivery">
          <p className="buybox__delivery-title">🚀 Consegna rapida disponibile</p>
          <p className="buybox__delivery-date">Domani se ordini entro 2h</p>
          <p className="buybox__delivery-vendor">Venduto da Think Shop s.r.l.</p>
        </div>
      )}

      <label className="buybox__qty-label" htmlFor="buybox-qty">
        Quantità
      </label>
      <select
        id="buybox-qty"
        className="buybox__qty-select"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <div className="buybox__actions">
        <Button
          variant="gold"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {added ? '✓ Aggiunto al carrello!' : 'Aggiungi al carrello'}
        </Button>

        <Button
          variant="indigo"
          onClick={handleBuyNow}
          disabled={!product.inStock}
        >
          Acquista subito
        </Button>

        <Button variant="outline">♡ Salva nei preferiti</Button>
      </div>

      <ul className="buybox__trust" aria-label="Garanzie">
        {TRUST_ITEMS.map(({ icon, text }) => (
          <li key={text} className="buybox__trust-item">
            <span aria-hidden="true">{icon}</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

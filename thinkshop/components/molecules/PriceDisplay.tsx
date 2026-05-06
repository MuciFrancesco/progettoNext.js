import Badge from '@/components/atoms/Badge'

interface PriceDisplayProps {
  price: number
  originalPrice: number
  discount: number
  showInstallments?: boolean
}

export default function PriceDisplay({
  price,
  originalPrice,
  discount,
  showInstallments = false,
}: PriceDisplayProps) {
  const installment = (price / 3).toFixed(2)

  return (
    <div className="price-display">
      <div className="price-display__row">
        <span className="price-display__current">
          €{price.toFixed(2)}
        </span>
        <span className="price-display__original">
          €{originalPrice.toFixed(2)}
        </span>
        <Badge type="discount" value={discount} />
      </div>
      {showInstallments && (
        <p className="price-display__installments">
          💳 Oppure 3 rate da €{installment} senza interessi
        </p>
      )}
    </div>
  )
}

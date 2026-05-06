interface StarRatingProps {
  rating: number
  reviewCount?: number
  showCount?: boolean
}

export default function StarRating({
  rating,
  reviewCount,
  showCount = true,
}: StarRatingProps) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  const stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)

  return (
    <div className="star-rating">
      <span className="star-rating__stars" aria-label={`${rating} su 5 stelle`}>
        {stars}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="star-rating__count">
          {reviewCount.toLocaleString('it-IT')} rec.
        </span>
      )}
    </div>
  )
}

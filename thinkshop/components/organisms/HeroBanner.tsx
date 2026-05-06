import Button from '@/components/atoms/Button'
import { QUICK_CATEGORIES } from '@/lib/data'

interface HeroBannerProps {
  onExplore: () => void
}

export default function HeroBanner({ onExplore }: HeroBannerProps) {
  return (
    <>
      <section className="hero" aria-label="Banner principale">
        <div className="hero__content">
          <span className="hero__tag">✦ TECH WEEK — OFFERTE LIMITATE</span>
          <h1 className="hero__title">
            Tecnologia
            <br />
            che ispira.
          </h1>
          <p className="hero__subtitle">
            Fino al 40% di sconto su centinaia di prodotti tech selezionati.
          </p>
          <div className="hero__actions">
            <Button variant="gold" fullWidth={false} onClick={onExplore}>
              Vedi le offerte
            </Button>
            <button className="hero__cta-secondary">
              Tutte le categorie →
            </button>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          💡
        </div>
      </section>

      <nav className="quick-cats" aria-label="Categorie rapide">
        {QUICK_CATEGORIES.map(({ icon, label }) => (
          <button key={label} className="quick-cat">
            <span className="quick-cat__icon" aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}

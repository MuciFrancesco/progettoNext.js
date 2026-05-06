import Link from 'next/link'
import { User } from '@/lib/types'

interface AccountTemplateProps {
  user: User
  onLogout: () => void
}

const ACCOUNT_SECTIONS = [
  { icon: '📦', title: 'I miei ordini', desc: 'Traccia e gestisci i tuoi ordini', href: '/orders' },
  { icon: '🔄', title: 'Resi & Rimborsi', desc: 'Avvia un reso o controlla lo stato', href: '/orders' },
  { icon: '❤️', title: 'Lista desideri', desc: 'I prodotti che hai salvato', href: '/' },
  { icon: '💳', title: 'Metodi di pagamento', desc: 'Carte, PayPal, bonifico', href: '/' },
  { icon: '📍', title: 'Indirizzi salvati', desc: 'Casa, lavoro e altre destinazioni', href: '/' },
  { icon: '🔔', title: 'Notifiche', desc: 'Gestisci le tue preferenze', href: '/' },
  { icon: '🔒', title: 'Privacy & Sicurezza', desc: 'Password e dati personali', href: '/' },
  { icon: '⭐', title: 'Le mie recensioni', desc: 'Prodotti che hai valutato', href: '/' },
]

export default function AccountTemplate({ user, onLogout }: AccountTemplateProps) {
  const initial = user.name[0]?.toUpperCase() ?? 'U'

  return (
    <main className="page-content page-enter">
      {/* Hero */}
      <div className="account-hero">
        <div className="account-hero__avatar" aria-hidden="true">
          {initial}
        </div>
        <div>
          <p className="account-hero__greeting">Bentornato,</p>
          <h1 className="account-hero__name">{user.name}</h1>
          <p className="account-hero__email">{user.email}</p>
        </div>
        <button className="account-hero__logout" onClick={onLogout}>
          Esci
        </button>
      </div>

      {/* Sections grid */}
      <div className="account-grid" role="list">
        {ACCOUNT_SECTIONS.map((section) => (
          <Link key={section.title} href={section.href} style={{ textDecoration: 'none' }}>
            <article className="account-card" role="listitem">
              <p className="account-card__icon" aria-hidden="true">
                {section.icon}
              </p>
              <h2 className="account-card__title">{section.title}</h2>
              <p className="account-card__desc">{section.desc}</p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import Logo from '@/components/atoms/Logo'
import SearchBar from '@/components/molecules/SearchBar'
import { User } from '@/lib/types'
import { NAV_CATEGORIES } from '@/lib/data'

interface NavbarProps {
  cartCount: number
  user: User | null
}

const SUB_ITEMS = [
  '🏷️ Offerte Flash',
  '📦 Nuovi Arrivi',
  '⭐ Top Rated',
  '🔄 Usato Certificato',
  '💼 Business',
  '🎁 Idee Regalo',
]

export default function Navbar({ cartCount, user }: NavbarProps) {
  return (
    <nav className="navbar" aria-label="Navigazione principale">
      <div className="navbar__main">
        <Logo />

        {/* Category dropdown */}
        <div className="dropdown">
          <button className="navbar__nav-item dropdown__trigger">
            ☰ Categorie ▾
          </button>
          <div className="dropdown__menu" role="menu">
            {NAV_CATEGORIES.map((cat) => (
              <button key={cat} className="dropdown__item" role="menuitem">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <SearchBar />

        {/* User */}
        <Link
          href={user ? '/account' : '/login'}
          className="navbar__nav-item"
        >
          <span className="navbar__nav-item-label">
            {user ? `Ciao, ${user.name}` : 'Benvenuto'}
          </span>
          <span className="navbar__nav-item-value">
            {user ? 'Account ▾' : 'Accedi / Registrati'}
          </span>
        </Link>

        {/* Orders */}
        <Link href="/orders" className="navbar__nav-item">
          <span className="navbar__nav-item-label">I tuoi</span>
          <span className="navbar__nav-item-value">Resi & Ordini</span>
        </Link>

        {/* Cart */}
        <Link href="/cart" className="navbar__cart" aria-label={`Carrello, ${cartCount} articoli`}>
          <span className="navbar__cart-icon" aria-hidden="true">
            🛒
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </span>
          <span className="navbar__cart-label">Carrello</span>
        </Link>
      </div>

      {/* Sub navigation */}
      <div className="navbar__sub" aria-label="Navigazione secondaria">
        {SUB_ITEMS.map((item) => (
          <button key={item} className="navbar__sub-item">
            {item}
          </button>
        ))}
      </div>
    </nav>
  )
}

'use client'

import { useState, FormEvent } from 'react'

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form className="navbar__search" onSubmit={handleSubmit} role="search">
      <label htmlFor="site-search" className="sr-only">
        Cerca prodotti
      </label>
      <input
        id="site-search"
        type="search"
        className="navbar__search-input"
        placeholder="Cerca prodotti, brand, categorie…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      <button
        type="submit"
        className="navbar__search-btn"
        aria-label="Cerca"
      >
        🔍
      </button>
    </form>
  )
}

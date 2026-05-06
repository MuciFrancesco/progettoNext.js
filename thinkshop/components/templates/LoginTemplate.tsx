'use client'

import { useState, FormEvent } from 'react'
import { User } from '@/lib/types'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

interface LoginTemplateProps {
  onLogin: (user: User) => void
}

type Mode = 'login' | 'register'

export default function LoginTemplate({ onLogin }: LoginTemplateProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'))
    setError('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Compila tutti i campi obbligatori.')
      return
    }
    if (mode === 'register' && !name) {
      setError('Inserisci il tuo nome.')
      return
    }

    const derivedName = mode === 'register' ? name : email.split('@')[0]
    onLogin({ name: derivedName, email })
  }

  return (
    <main className="login-page page-enter">
      <div className="login-card">
        <header className="login-card__header">
          <p className="login-card__icon">💡</p>
          <h1 className="login-card__title">
            {mode === 'login' ? 'Accedi al tuo account' : 'Crea account Think Shop'}
          </h1>
          <p className="login-card__subtitle">
            {mode === 'login'
              ? 'Bentornato! Inserisci le credenziali.'
              : 'Unisciti alla community Think Shop.'}
          </p>
        </header>

        {error && <p className="login-card__error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <Input
              label="Nome e cognome"
              id="name"
              type="text"
              placeholder="Mario Rossi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}

          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="email@esempio.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'login' && (
            <div className="login-card__forgot">
              <button type="button" className="login-card__forgot-link">
                Password dimenticata?
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="gold" type="submit" style={{ fontSize: 15, padding: '12px 0' }}>
              {mode === 'login' ? 'Accedi' : 'Registrati'}
            </Button>

            <p className="login-card__divider">— oppure —</p>

            <Button variant="outline" type="button">
              G&nbsp;&nbsp;Continua con Google
            </Button>

            <Button variant="outline" type="button">
              &nbsp;Continua con Apple
            </Button>
          </div>
        </form>

        <p className="login-card__footer">
          {mode === 'login' ? 'Nuovo su Think Shop? ' : 'Hai già un account? '}
          <button className="login-card__footer-link" onClick={toggleMode}>
            {mode === 'login' ? 'Crea un account gratuito' : 'Accedi'}
          </button>
        </p>
      </div>
    </main>
  )
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.scss';

// This page is opened as a popup window during PayPal demo checkout.
// After the user "approves", it posts a message to the opener and closes.
export default function PayPalPopupPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'login' | 'review' | 'approved'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const amount = searchParams.get('amount') ?? '0.00';

  useEffect(() => {
    document.title = 'PayPal';
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Inserisci email e password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('review');
    }, 1200);
  }

  function handleApprove() {
    setStep('approved');
    setTimeout(() => {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'PAYPAL_APPROVED', orderId: `pp-demo-${Date.now()}` },
            window.location.origin
          );
        }
      } catch {}
      window.close();
    }, 800);
  }

  function handleCancel() {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'PAYPAL_CANCELLED' }, window.location.origin);
      }
    } catch {}
    window.close();
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <svg
          width="80"
          height="20"
          viewBox="0 0 80 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="PayPal"
        >
          <text x="0" y="16" fontSize="18" fontWeight="bold" fill="#009cde">
            Pay
          </text>
          <text x="28" y="16" fontSize="18" fontWeight="bold" fill="#012169">
            Pal
          </text>
        </svg>
        <button onClick={handleCancel} className={styles.closeButton} aria-label="Close">
          x
        </button>
      </div>

      <div className={styles.body}>
        {step === 'login' && (
          <div className={styles.card}>
            <h2 className={styles.heading}>Accedi a PayPal</h2>
            <p className={styles.subtitle}>Demo - nessun pagamento reale verra effettuato.</p>
            <form onSubmit={handleLogin}>
              <label className={styles.label}>Indirizzo email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className={styles.input}
                autoComplete="email"
              />
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={styles.input}
                autoComplete="current-password"
              />
              {loginError ? <p className={styles.errorText}>{loginError}</p> : null}
              <button type="submit" disabled={loading} className={styles.primaryButton}>
                {loading ? 'Accesso...' : 'Accedi'}
              </button>
            </form>
            <p className={styles.footerText}>
              Non hai un account? <span className={styles.signupLink}>Registrati</span>
            </p>
          </div>
        )}

        {step === 'review' && (
          <div className={styles.card}>
            <h2 className={styles.heading}>Conferma pagamento</h2>
            <p className={styles.reviewEmail}>{email}</p>

            <div className={styles.reviewBox}>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Importo</span>
                <strong className={styles.reviewAmount}>EUR {amount}</strong>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewMeta}>Metodo</span>
                <span className={styles.reviewLabel}>Saldo PayPal / Carta collegata</span>
              </div>
            </div>

            <button onClick={handleApprove} className={styles.primaryButton}>
              Autorizza e paga
            </button>
            <button onClick={handleCancel} className={styles.secondaryButton}>
              Annulla
            </button>
          </div>
        )}

        {step === 'approved' && (
          <div className={styles.approved}>
            <div className={styles.approvedIcon}>OK</div>
            <h2 className={styles.approvedTitle}>Pagamento autorizzato</h2>
            <p className={styles.approvedSubtitle}>Chiusura finestra...</p>
          </div>
        )}
      </div>
    </div>
  );
}

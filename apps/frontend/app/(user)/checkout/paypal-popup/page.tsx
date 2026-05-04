'use client';

import { useState, useEffect, useRef } from 'react';

// This page is opened as a popup window during PayPal demo checkout.
// After the user "approves", it posts a message to the opener and closes.
export default function PayPalPopupPage() {
  const [step, setStep] = useState<'login' | 'review' | 'approved'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const amountRef = useRef<string>('0.00');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    amountRef.current = params.get('amount') ?? '0.00';

    // Set popup window title
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
    // Notify parent window and close after brief delay
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
    <div
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#003087',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
        <button
          onClick={handleCancel}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px',
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px' }}>
        {step === 'login' && (
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: '32px 28px',
              width: '100%',
              maxWidth: 360,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}
          >
            <h2 style={{ margin: '0 0 6px', color: '#003087', fontSize: 22 }}>Accedi a PayPal</h2>
            <p style={{ margin: '0 0 24px', color: '#666', fontSize: 14 }}>
              Demo – nessun pagamento reale verrà effettuato.
            </p>
            <form onSubmit={handleLogin}>
              <label style={labelStyle}>Indirizzo email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                style={inputStyle}
                autoComplete="email"
              />
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={inputStyle}
                autoComplete="current-password"
              />
              {loginError && (
                <p style={{ color: '#c0392b', fontSize: 13, margin: '4px 0 12px' }}>{loginError}</p>
              )}
              <button type="submit" disabled={loading} style={primaryBtnStyle}>
                {loading ? 'Accesso...' : 'Accedi'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#666' }}>
              Non hai un account?{' '}
              <span style={{ color: '#009cde', cursor: 'pointer' }}>Registrati</span>
            </p>
          </div>
        )}

        {step === 'review' && (
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: '32px 28px',
              width: '100%',
              maxWidth: 360,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}
          >
            <h2 style={{ margin: '0 0 6px', color: '#003087', fontSize: 22 }}>Conferma pagamento</h2>
            <p style={{ margin: '0 0 20px', color: '#666', fontSize: 14 }}>{email}</p>

            <div
              style={{
                background: '#f0f8ff',
                border: '1px solid #b3d9f0',
                borderRadius: 6,
                padding: '16px',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#333', fontSize: 14 }}>Importo</span>
                <strong style={{ color: '#003087', fontSize: 16 }}>€ {amountRef.current}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Metodo</span>
                <span style={{ color: '#333', fontSize: 13 }}>Saldo PayPal / Carta collegata</span>
              </div>
            </div>

            <button onClick={handleApprove} style={primaryBtnStyle}>
              Autorizza e paga
            </button>
            <button
              onClick={handleCancel}
              style={{ ...primaryBtnStyle, marginTop: 8, background: 'transparent', color: '#003087', border: '1px solid #003087' }}
            >
              Annulla
            </button>
          </div>
        )}

        {step === 'approved' && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h2 style={{ color: '#003087' }}>Pagamento autorizzato</h2>
            <p style={{ color: '#666' }}>Chiusura finestra...</p>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  color: '#333',
  marginBottom: 4,
  marginTop: 12,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: 4,
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '13px',
  background: '#0070ba',
  color: '#fff',
  border: 'none',
  borderRadius: 24,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 16,
};

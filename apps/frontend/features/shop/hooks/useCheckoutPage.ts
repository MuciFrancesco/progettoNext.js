'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { useCart } from '@/providers/CartProvider';
import type { CardBrand } from '@/components/Checkout/CardPaymentForm';

type CheckoutStatus = 'idle' | 'loading' | 'ready' | 'processing' | 'paypal-open' | 'error';
export type PaymentMethod = 'card' | 'paypal';

export function useCheckoutPage(locale: Locale) {
  const t = useMemo(() => createTranslator(locale), [locale]);
  const router = useRouter();
  const cart = useCart();
  const { clearCart } = cart;

  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [message, setMessage] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');

  const popupRef = useRef<Window | null>(null);
  const popupPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const payload = useMemo(
    () => ({
      items: cart.items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
    }),
    [cart.items]
  );

  // ── Init checkout ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (cart.items.length === 0) {
      router.replace('/cart');
      return;
    }

    setStatus('loading');
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = (await res.json().catch(() => null)) as { code?: unknown; message?: unknown } | null;
          if (err?.code === 'INVALID_CART') {
            clearCart();
            router.replace('/cart');
          }
          throw new Error(typeof err?.message === 'string' ? err.message : t('checkoutInitError'));
        }
        return res.json() as Promise<{ mode: 'stripe' | 'demo' }>;
      })
      .then(() => {
        setStatus('ready');
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : t('checkoutUnavailable'));
        setStatus('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.items.length]);

  // ── Capture helper ─────────────────────────────────────────────────────────

  const capture = useCallback(
    async (endpoint: string): Promise<boolean> => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setMessage(t('checkoutPaymentFailed'));
        setStatus('error');
        return false;
      }
      return true;
    },
    [payload, t]
  );

  // ── Card payment ───────────────────────────────────────────────────────────

  async function submitCardPayment(info: { last4: string; brand: CardBrand }) {
    void info;
    setStatus('processing');
    setMessage('');
    const ok = await capture('/api/checkout/capture');
    if (ok) router.push('/checkout/success');
  }

  // ── PayPal flow ────────────────────────────────────────────────────────────

  function openPayPalPopup() {
    setMessage('');

    const amount = (cart.totalInCents / 100).toFixed(2);
    const url = `/checkout/paypal-popup?amount=${amount}`;

    const w = 460;
    const h = 600;
    const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
    const features = `width=${w},height=${h},left=${left},top=${top},resizable=no,scrollbars=yes`;

    const popup = window.open(url, 'paypal_checkout', features);

    if (!popup) {
      setMessage(t('checkoutPaypalPopupBlocked'));
      setStatus('error');
      return;
    }

    popupRef.current = popup;
    setStatus('paypal-open');

    // Listen for postMessage from popup
    function handleMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string };

      if (data?.type === 'PAYPAL_APPROVED') {
        cleanup();
        setStatus('processing');
        capture('/api/checkout/paypal/capture').then((ok) => {
          if (ok) router.push('/checkout/success');
        });
      }

      if (data?.type === 'PAYPAL_CANCELLED') {
        cleanup();
        setStatus('ready');
      }
    }

    // Poll for manual close (user closes popup without messaging)
    const poll = setInterval(() => {
      if (popup.closed) {
        cleanup();
        setStatus('ready');
      }
    }, 500);

    popupPollRef.current = poll;
    window.addEventListener('message', handleMessage);

    function cleanup() {
      clearInterval(poll);
      popupPollRef.current = null;
      window.removeEventListener('message', handleMessage);
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      popupRef.current = null;
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (popupPollRef.current) clearInterval(popupPollRef.current);
      if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    };
  }, []);

  // ── Labels ─────────────────────────────────────────────────────────────────

  const labels = {
    title: t('checkoutTitle'),
    subtitle: t('checkoutSubtitle'),
    cardTab: t('checkoutCardTab'),
    paypalTab: t('checkoutPaypalTab'),
    summary: t('checkoutSummary'),
    total: t('cartTotal'),
    paypalOpening: t('checkoutPaypalOpening'),
    paypalAwait: t('checkoutPaypalAwait'),
  };

  return {
    ...cart,
    status,
    message,
    locale,
    labels,
    selectedMethod,
    setSelectedMethod,
    submitCardPayment,
    openPayPalPopup,
  };
}

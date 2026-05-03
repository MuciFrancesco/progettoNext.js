'use client';

import { useEffect } from 'react';

const SESSION_CHECK_MS = 10000;

function hideSensitiveContent(): void {
  document.body.style.visibility = 'hidden';
}

function showSensitiveContent(): void {
  document.body.style.visibility = 'visible';
}

async function checkSession(hideDuringCheck = false): Promise<void> {
  if (hideDuringCheck) {
    hideSensitiveContent();
  }

  try {
    const response = await fetch('/auth/session', {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });

    if (response.status === 401) {
      const payload = (await response.json()) as { expired?: boolean };
      if (payload.expired) {
        globalThis.location.replace('/not-found');
        return;
      }
      try {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      } finally {
        globalThis.location.replace('/logout');
      }
      return;
    }

    showSensitiveContent();
  } catch {
    showSensitiveContent();
    // Ignore transient network errors; next check will retry.
  }
}

export default function SessionExpiryWatcher() {
  useEffect(() => {
    void checkSession(true);

    const interval = globalThis.setInterval(() => {
      void checkSession();
    }, SESSION_CHECK_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkSession(true);
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      // If restored from BFCache, force immediate revalidation.
      if (event.persisted) {
        void checkSession(true);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    globalThis.addEventListener('pageshow', onPageShow);

    return () => {
      showSensitiveContent();
      globalThis.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      globalThis.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return null;
}

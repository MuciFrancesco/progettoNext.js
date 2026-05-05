'use client';

import { useEffect } from 'react';

export function useAutoRedirect(href: string, delayMs = 350) {
  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      globalThis.location.replace(href);
    }, delayMs);

    return () => {
      globalThis.clearTimeout(timer);
    };
  }, [delayMs, href]);
}

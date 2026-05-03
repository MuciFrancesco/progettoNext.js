'use client';

import { useEffect } from 'react';

type AutoRedirectProps = {
  href: string;
  delayMs?: number;
};

export default function AutoRedirect({ href, delayMs = 350 }: Readonly<AutoRedirectProps>) {
  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      globalThis.location.replace(href);
    }, delayMs);

    return () => {
      globalThis.clearTimeout(timer);
    };
  }, [delayMs, href]);

  return null;
}

'use client';

import { useAutoRedirect } from '@/features/utils/hooks/useAutoRedirect';

type AutoRedirectProps = {
  href: string;
  delayMs?: number;
};

export default function AutoRedirect({ href, delayMs = 350 }: Readonly<AutoRedirectProps>) {
  useAutoRedirect(href, delayMs);
  return null;
}

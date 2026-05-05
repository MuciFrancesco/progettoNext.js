'use client';

import { useSessionExpiry } from '@/features/auth/hooks/useSessionExpiry';

export default function SessionExpiryFeature() {
  useSessionExpiry();
  return null;
}

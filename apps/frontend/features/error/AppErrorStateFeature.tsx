'use client';

import { readLocaleFromCookie } from '@/features/auth/hooks/useLocaleFromCookie';
import AppErrorState from '@/components/ErrorState/AppErrorState';

type AppErrorStateFeatureProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function AppErrorStateFeature(props: AppErrorStateFeatureProps) {
  return <AppErrorState {...props} locale={readLocaleFromCookie()} />;
}

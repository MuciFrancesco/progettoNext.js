'use client';

import MuiButton from '@mui/material/Button';
import { useRouter } from 'next/navigation';

type BackToPreviousButtonProps = {
  label: string;
  fallbackHref?: string;
  className?: string;
};

export function BackToPreviousButton({
  label,
  fallbackHref = '/login?mode=signin',
  className,
}: Readonly<BackToPreviousButtonProps>) {
  const router = useRouter();

  return (
    <MuiButton
      variant="outlined"
      className={className}
      onClick={() => {
        if (globalThis.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
    >
      {label}
    </MuiButton>
  );
}

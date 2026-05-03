'use client';

import { setLocaleAction } from '@/lib/actions/locale';
import type { Locale } from '@/lib/i18n/translation';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';

type LocaleSwitcherProps = {
  readonly currentLocale: Locale;
  readonly label: string;
  readonly options: ReadonlyArray<{ value: Locale; label: string }>;
  readonly testIdPrefix?: string;
};

export default function LocaleSwitcher({
  currentLocale,
  label,
  options,
  testIdPrefix = 'locale-switcher',
}: Readonly<LocaleSwitcherProps>) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <label data-testid={`${testIdPrefix}-root`} className="inline-flex items-center gap-2 text-sm">
      <span data-testid={`${testIdPrefix}-label`}>{label}</span>
      <select
        data-testid={`${testIdPrefix}-select`}
        className="rounded-md border bg-background px-2 py-1 text-foreground"
        value={currentLocale}
        disabled={isPending}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;

          startTransition(async () => {
            await setLocaleAction(nextLocale, pathname || '/');
          });
        }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            data-testid={`${testIdPrefix}-option-${option.value}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

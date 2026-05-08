'use client';

import LogOut from '@/components/LogOut/LogOut';
import type { Locale } from '@/lib/i18n/translation';
import { LogoutButton } from './LogOutButton/LogOutButton';

type LogOutFeatureProps = {
  readonly locale: Locale;
};

export default function LogOutFeature({ locale }: Readonly<LogOutFeatureProps>) {
  return (
    <main>
      <LogOut />
      <LogoutButton locale={locale} />
    </main>
  );
}

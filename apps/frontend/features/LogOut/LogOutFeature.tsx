import LogOut from '@/components/LogOut/LogOut';
import type { Locale } from '@/lib/i18n/translation';
import { LogoutButton } from './LogOutButton/LogOutButton';
import styles from './LogOutFeature.module.scss';

type LogOutFeatureProps = {
  readonly locale: Locale;
};

export default function LogOutFeature({ locale }: Readonly<LogOutFeatureProps>) {
  return (
    <section className={styles.section}>
      <LogOut>
        <LogoutButton locale={locale} />
      </LogOut>
    </section>
  );
}

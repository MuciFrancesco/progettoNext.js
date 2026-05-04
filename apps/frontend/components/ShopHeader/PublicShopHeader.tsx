import { getCurrentSession } from '@/lib/auth/session';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { APP_NAME } from '@/lib/constants';
import { PublicShopHeaderShell } from './PublicShopHeaderShell';

export async function PublicShopHeader() {
  const [session, locale, t] = await Promise.all([
    getCurrentSession(),
    getCurrentLocale(),
    getTranslator(),
  ]);

  return (
    <PublicShopHeaderShell
      appName={APP_NAME}
      cartLabel={t('cartTitle')}
      loginLabel={t('signinSubmit')}
      locale={locale}
      purchasesLabel={t('navPurchaseHistory')}
      showPurchases={Boolean(session)}
    />
  );
}

import { getCurrentSession } from '@/lib/auth/session';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { PublicShopHeaderShell } from './PublicShopHeaderShell';

export async function PublicShopHeader() {
  const [session, locale, t] = await Promise.all([
    getCurrentSession(),
    getCurrentLocale(),
    getTranslator(),
  ]);

  return (
    <PublicShopHeaderShell
      appName="ThinkShop"
      cartLabel={t('cartTitle')}
      loginLabel={t('signinSubmit')}
      locale={locale}
      purchasesLabel={t('navPurchaseHistory')}
      showPurchases={Boolean(session)}
    />
  );
}

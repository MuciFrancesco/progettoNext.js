import { getCurrentSession } from '@/lib/auth/session';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { APP_NAME } from '@/lib/constants';
import { PublicShopHeaderShell } from '@/components/ShopHeader/PublicShopHeaderShell/PublicShopHeaderShell';
import { PublicShopHeaderActions } from '@/components/ShopHeader/PublicShopHeaderActions/PublicShopHeaderActions';

export async function ShopHeaderFeature() {
  const [session, locale, t] = await Promise.all([
    getCurrentSession(),
    getCurrentLocale(),
    getTranslator(),
  ]);

  return (
    <PublicShopHeaderShell
      appName={APP_NAME}
      cartLabel={t('cartTitle')}
      actionsSlot={
        <PublicShopHeaderActions
          loginLabel={t('signinSubmit')}
          locale={locale}
          purchasesLabel={t('navPurchaseHistory')}
          showPurchases={Boolean(session)}
        />
      }
    />
  );
}

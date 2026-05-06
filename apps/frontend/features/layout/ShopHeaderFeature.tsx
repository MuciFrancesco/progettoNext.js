import { getCurrentSession } from '@/lib/auth/session';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { APP_NAME } from '@/lib/constants';
import { listCatalogNavigation } from '@/lib/api/products';
import { PublicShopHeaderClientFeature } from '@/features/layout/PublicShopHeaderClientFeature';

export async function ShopHeaderFeature() {
  const [session, locale, t, navigation] = await Promise.all([
    getCurrentSession(),
    getCurrentLocale(),
    getTranslator(),
    listCatalogNavigation({ revalidate: 60 }).catch(() => ({ categories: [] })),
  ]);

  return (
    <PublicShopHeaderClientFeature
      appName={APP_NAME}
      cartLabel={t('cartTitle')}
      homeLabel={t('navHome')}
      loginLabel={t('signinSubmit')}
      locale={locale}
      purchasesLabel={t('navPurchaseHistory')}
      showPurchases={Boolean(session)}
      searchLabel={t('catalogSearch')}
      categoryLabel={t('productSearchCategory')}
      categoryOptions={navigation.categories.map((category) => ({
        slug: category.slug,
        label: category.label,
      }))}
    />
  );
}

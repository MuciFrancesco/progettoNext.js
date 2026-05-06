'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n/translation';
import { PublicShopHeaderShell } from '@/components/ShopHeader/PublicShopHeaderShell/PublicShopHeaderShell';
import { PublicShopHeaderActions } from '@/components/ShopHeader/PublicShopHeaderActions/PublicShopHeaderActions';

type HeaderCategoryOption = {
  readonly slug: string;
  readonly label: string;
};

type PublicShopHeaderClientFeatureProps = {
  readonly appName: string;
  readonly cartLabel: string;
  readonly homeLabel: string;
  readonly loginLabel: string;
  readonly locale: Locale;
  readonly purchasesLabel: string;
  readonly showPurchases: boolean;
  readonly searchLabel: string;
  readonly categoryLabel: string;
  readonly categoryOptions: readonly HeaderCategoryOption[];
};

export function PublicShopHeaderClientFeature({
  appName,
  cartLabel,
  homeLabel,
  loginLabel,
  locale,
  purchasesLabel,
  showPurchases,
  searchLabel,
  categoryLabel,
  categoryOptions,
}: Readonly<PublicShopHeaderClientFeatureProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = pathname.startsWith('/categoria/') ? pathname.split('/')[2] ?? '' : '';
  const [draftQuery, setDraftQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setDraftQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const navigateToCatalog = (nextQuery: string) => {
    const params = new URLSearchParams();
    const normalizedQuery = nextQuery.trim();

    if (normalizedQuery) {
      params.set('q', normalizedQuery);
    }

    const href = params.toString() ? `/?${params.toString()}` : '/';

    if (pathname === '/') {
      router.push(href, { scroll: false });
      return;
    }

    router.push(href);
  };

  return (
    <PublicShopHeaderShell
      appName={appName}
      cartLabel={cartLabel}
      homeLabel={homeLabel}
      searchLabel={searchLabel}
      searchValue={draftQuery}
      categoryLabel={categoryLabel}
      categoryOptions={categoryOptions}
      selectedCategory={selectedCategory}
      onSearchValueChange={setDraftQuery}
      onSearchSubmit={() => navigateToCatalog(draftQuery)}
      onCategorySelect={(slug) => router.push(`/categoria/${slug}`)}
      actionsSlot={
        <PublicShopHeaderActions
          loginLabel={loginLabel}
          locale={locale}
          purchasesLabel={purchasesLabel}
          showPurchases={showPurchases}
        />
      }
    />
  );
}

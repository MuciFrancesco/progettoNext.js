/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n/translation';
import { PublicShopHeaderShell } from '@/components/ShopHeader/PublicShopHeaderShell/PublicShopHeaderShell';
import type { HeaderSearchSuggestion } from '@/components/ShopHeader/PublicShopHeaderShell/PublicShopHeaderShell';
import { PublicShopHeaderActions } from '@/components/ShopHeader/PublicShopHeaderActions/PublicShopHeaderActions';
import { CartBadgeLink } from '@/components/CartBadgeLink/CartBadgeLink';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { createTranslator } from '@/lib/i18n/translator';
import { resolveProductImageSrc } from '@/lib/shop/format';
import type { BackendProduct } from '@/types/api/product';
import { useCart } from '@/store/CartContext';

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
  const selectedCategory = pathname.startsWith('/categoria/') ? (pathname.split('/')[2] ?? '') : '';
  const [draftQuery, setDraftQuery] = useState(searchParams.get('q') ?? '');
  const [suggestions, setSuggestions] = useState<HeaderSearchSuggestion[]>([]);
  const { totalQuantity } = useCart();
  const t = useMemo(() => createTranslator(locale), [locale]);

  useEffect(() => {
    setDraftQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const normalizedQuery = draftQuery.trim();
    if (normalizedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/products/search?q=${encodeURIComponent(normalizedQuery)}&limit=6`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { data: [] }))
      .then((payload: { data?: BackendProduct[] }) => {
        const nextSuggestions = (payload.data ?? []).map((product) => ({
          id: product.id,
          title: product.title,
          brand: product.brand,
          categoryLabel: t(categoryTranslationKey(product.category)),
          subcategoryLabel: product.subcategory?.label ?? null,
          imageSrc: resolveProductImageSrc(product.imagePath),
          href: `/product/${product.id}`,
        }));
        setSuggestions(nextSuggestions);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setSuggestions([]);
      });

    return () => controller.abort();
  }, [draftQuery, t]);

  const navigateToCatalog = (nextQuery: string) => {
    const params = new URLSearchParams();
    const normalizedQuery = nextQuery.trim();

    if (normalizedQuery) {
      params.set('q', normalizedQuery);
    }

    const href = params.toString() ? `/search?${params.toString()}` : '/search';
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
      searchSuggestions={suggestions}
      showSearchSuggestions={draftQuery.trim().length >= 3}
      cartSlot={<CartBadgeLink label={cartLabel} totalQuantity={totalQuantity} />}
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

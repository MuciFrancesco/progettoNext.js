import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FooterFeature } from '@/features/footer/FooterFeature';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { SearchResultsGrid } from '@/features/shop/components/SearchResultsFeature/SearchResultsGrid';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { APP_NAME } from '@/lib/constants';
import { listPublicProducts } from '@/lib/api/products';
import { getPublicFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Search',
};

type SearchPageProps = {
  readonly searchParams?: Promise<{ q?: string }>;
};

function buildSuggestionQuery(query: string): string {
  const normalizedQuery = query.trim();
  const firstWord = normalizedQuery.split(/\s+/).find((word) => word.length >= 3);

  if (firstWord && firstWord !== normalizedQuery) return firstWord;
  if (normalizedQuery.length > 3) return normalizedQuery.slice(0, 3);

  return normalizedQuery;
}

export default async function SearchPage({ searchParams }: Readonly<SearchPageProps>) {
  const [locale, t, params] = await Promise.all([
    getCurrentLocale(),
    getTranslator(),
    searchParams,
  ]);
  const query = params?.q?.trim() ?? '';
  const canSearch = query.length >= 3;
  const results = canSearch
    ? await listPublicProducts({ q: query, limit: 100, cache: 'no-store' }).catch(() => ({
        data: [],
        total: 0,
      }))
    : { data: [], total: 0 };
  const suggestionQuery = buildSuggestionQuery(query);
  const suggestions =
    canSearch && results.data.length === 0 && suggestionQuery
      ? await listPublicProducts({ q: suggestionQuery, limit: 8, cache: 'no-store' }).catch(
          () => ({
            data: [],
            total: 0,
          })
        )
      : { data: [], total: 0 };

  return (
    <Box className={styles.shell}>
      <PublicShopHeader />
      <Box component="main" className={styles.main}>
        <Box className={styles.header}>
          <Typography variant="overline" className={styles.eyebrow}>
            {t('catalogSearch')}
          </Typography>
          <Typography variant="h4" component="h1" className={styles.title}>
            {t('searchResultsTitle')}
          </Typography>
          <Typography className={styles.subtitle}>
            {canSearch ? t('searchResultsSubtitle', { query }) : t('catalogSubtitle')}
          </Typography>
        </Box>

        {results.data.length > 0 ? (
          <SearchResultsGrid products={results.data} locale={locale} />
        ) : (
          <Paper variant="outlined" className={styles.emptyState}>
            <Typography>
              {canSearch ? t('searchResultsEmpty', { query }) : t('catalogEmpty')}
            </Typography>
          </Paper>
        )}

        {results.data.length === 0 && suggestions.data.length > 0 ? (
          <Box className={styles.header}>
            <Typography variant="h5" component="h2" className={styles.sectionTitle}>
              {t('searchSuggestionsTitle')}
            </Typography>
            <SearchResultsGrid products={suggestions.data} locale={locale} />
          </Box>
        ) : null}
      </Box>
      <FooterFeature
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerUserNote')}
        sections={[
          ...getPublicFooterSections(t),
          ...getSharedFooterSections(t).filter((section) => section.title !== t('footerSupport')),
        ]}
      />
    </Box>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { requireAdminOrEmployeeSession } from '@/lib/auth/session';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import { AdminUpdateProductsTable } from '@/features/admin/components/AdminUpdateProductsTable/AdminUpdateProductsTable';
import { getAdminProductsAction } from '@/lib/actions/admin';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('updateProductPageTitle') };
}

export default async function AdminUpdateProductPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string; id?: string }>;
}>) {
  await requireAdminOrEmployeeSession();
  const t = await getTranslator();
  const locale = await getCurrentLocale();
  const params = await searchParams;
  const initialResponse = await getAdminProductsAction({
    page: 1,
    limit: 20,
    name: params.q || undefined,
  });

  return (
    <section className={styles.section}>
      <Suspense
        fallback={
          <GlobalPageLoading
            title={t('updateProductPageTitle')}
            subtitle={t('loadingAwaitingServer')}
          />
        }
      >
        <AdminUpdateProductsTable
          initialResponse={initialResponse}
          locale={locale}
          initialSearchName={params.q}
          initialProductId={params.id}
        />
      </Suspense>
    </section>
  );
}

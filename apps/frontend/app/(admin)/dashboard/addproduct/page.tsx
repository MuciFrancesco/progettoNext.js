import type { Metadata } from 'next';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { AdminAddProductForm } from '@/features/admin/components/AdminAddProductForm';
import { requireAdminOrEmployeeSession } from '@/lib/auth/session';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { Suspense } from 'react';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('addProductPageTitle') };
}

export default async function AdminAddProductPage() {
  await requireAdminOrEmployeeSession();
  const t = await getTranslator();
  const locale = await getCurrentLocale();

  return (
    <section className={styles.section}>
      <Suspense
        fallback={
          <GlobalPageLoading
            title={t('addProductPageTitle')}
            subtitle={t('loadingAwaitingServer')}
          />
        }
      >
        <AdminAddProductForm locale={locale} />
      </Suspense>
    </section>
  );
}

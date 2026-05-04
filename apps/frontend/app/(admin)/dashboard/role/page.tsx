import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { requireAdminSession } from '@/lib/auth/session';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import { AdminRoleManager } from '@/features/admin/components/AdminRoleManager';
import { listAdminUsers } from '@/lib/api/admin';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('rolePageTitle') };
}

export default async function AdminRolePage() {
  const session = await requireAdminSession();
  const t = await getTranslator();
  const locale = await getCurrentLocale();
  const initialResponse = await listAdminUsers({ page: 1, limit: 20 });
  return (
    <section className={styles.section}>
      <Suspense
        fallback={
          <GlobalPageLoading title={t('rolePageTitle')} subtitle={t('loadingAwaitingServer')} />
        }
      >
        <AdminRoleManager
          initialResponse={initialResponse}
          locale={locale}
          currentUserId={session.user.id}
        />
      </Suspense>
    </section>
  );
}

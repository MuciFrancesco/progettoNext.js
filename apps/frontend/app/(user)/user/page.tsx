import type { Metadata } from 'next';
import { requireUserSession } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n/locale';
import { PanelsGrid } from '@/components/PanelsGrid/PanelsGrid';
import { userPanelsConfig } from '@/features/user/config/userPanels';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('navDashboard') };
}

export default async function UserPage() {
  const { user } = await requireUserSession();
  const t = await getTranslator();
  const displayName = user.firstname ?? user.email;

  const panels = userPanelsConfig.map((panel) => ({
    ...panel,
    title: t(panel.titleKey),
    description: t(panel.descKey),
  }));

  return (
    <section
      data-testid="user-page"
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10"
    >
      <div data-testid="user-page-header">
        <h1 data-testid="user-page-title" className="text-3xl font-semibold tracking-tight">
          {t('userAreaTitle')}
        </h1>
      </div>
      <p data-testid="user-page-greeting" className="text-muted-foreground">
        {t('userGreeting', { name: displayName })}
      </p>
      <PanelsGrid panels={panels} goToLabel={t('dashboardPanelGoTo')} />
    </section>
  );
}

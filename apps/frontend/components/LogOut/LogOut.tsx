import { getTranslator } from '@/lib/i18n/locale';
import Link from 'next/link';

export default async function LogOut() {
  const t = await getTranslator();
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">{t('sessionExpiredTitle')}</h1>
      <p className="max-w-xl text-sm text-muted-foreground">{t('sessionExpiredSubtitle')}</p>
      <Link
        href="/login?mode=signin"
        className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
      >
        {t('sessionExpiredLoginCta')}
      </Link>
    </main>
  );
}

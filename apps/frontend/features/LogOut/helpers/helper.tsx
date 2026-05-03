import { getTranslator } from '@/lib/i18n/locale';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('sessionExpiredTitle') };
}

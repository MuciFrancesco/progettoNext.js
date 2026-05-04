import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function CheckoutLoading() {
  const t = await getTranslator();

  return <GlobalPageLoading title={t('checkoutTitle')} subtitle={t('loadingAwaitingServer')} />;
}

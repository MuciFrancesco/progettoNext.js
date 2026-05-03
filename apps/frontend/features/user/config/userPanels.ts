import { UserRoutes } from '@/lib/routes';
import type { TranslationKey } from '@/lib/i18n/translator';

export interface UserPanelConfig {
  readonly href: string;
  readonly titleKey: TranslationKey;
  readonly descKey: TranslationKey;
  readonly icon: string;
  readonly testId: string;
}

export const userPanelsConfig: UserPanelConfig[] = [
  {
    href: UserRoutes.PURCHASE_HISTORY,
    titleKey: 'purchaseHistoryPanelTitle',
    descKey: 'purchaseHistoryPanelDesc',
    icon: '🛍️',
    testId: 'panel-purchase-history',
  },
];

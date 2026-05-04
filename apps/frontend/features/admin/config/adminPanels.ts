import { AdminRoutes } from '@/lib/routes';
import type { TranslationKey } from '@/lib/i18n/translator';
import type { UserRole } from '@/types/api/user';

export interface AdminPanelConfig {
  readonly href: string;
  readonly titleKey: TranslationKey;
  readonly descKey: TranslationKey;
  readonly icon: string;
  readonly testId: string;
}

const allPanels: AdminPanelConfig[] = [
  {
    href: AdminRoutes.ROLE,
    titleKey: 'dashboardPanelRoleTitle',
    descKey: 'dashboardPanelRoleDesc',
    icon: '👥',
    testId: 'panel-role',
  },
  {
    href: AdminRoutes.ADD_PRODUCT,
    titleKey: 'dashboardPanelAddProductTitle',
    descKey: 'dashboardPanelAddProductDesc',
    icon: '➕',
    testId: 'panel-add-product',
  },
  {
    href: AdminRoutes.UPDATE_PRODUCT,
    titleKey: 'dashboardPanelUpdateProductTitle',
    descKey: 'dashboardPanelUpdateProductDesc',
    icon: '📦',
    testId: 'panel-update-product',
  },
  {
    href: AdminRoutes.ORDERS,
    titleKey: 'dashboardPanelOrdersTitle',
    descKey: 'dashboardPanelOrdersDesc',
    icon: '📊',
    testId: 'panel-orders',
  },
];

const employeePanelTestIds = new Set(['panel-add-product', 'panel-update-product']);

export function getAdminPanelsConfig(role: UserRole): AdminPanelConfig[] {
  if (role === 'EMPLOYEE') {
    return allPanels.filter((p) => employeePanelTestIds.has(p.testId));
  }
  return allPanels;
}

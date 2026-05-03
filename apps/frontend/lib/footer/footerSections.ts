import type { TranslationKey } from '@/lib/i18n/translator';
import { AdminRoutes, UserRoutes } from '@/lib/routes';

type TranslateFn = (key: TranslationKey, params?: Record<string, string | number>) => string;

export interface FooterSection {
  title: string;
  items: { label: string; href: string }[];
}

/** Sezione navigazione footer per il layout admin */
export function getAdminFooterSections(t: TranslateFn): FooterSection[] {
  return [
    {
      title: t('footerNavigation'),
      items: [
        { label: t('navOverview'), href: AdminRoutes.DASHBOARD },
        { label: t('navRole'), href: AdminRoutes.ROLE },
        { label: t('navAddProduct'), href: AdminRoutes.ADD_PRODUCT },
        { label: t('navUpdateProduct'), href: AdminRoutes.UPDATE_PRODUCT },
      ],
    },
  ];
}

/** Sezione navigazione footer per il layout user */
export function getUserFooterSections(t: TranslateFn): FooterSection[] {
  return [
    {
      title: t('footerNavigation'),
      items: [
        { label: t('navUserArea'), href: UserRoutes.USER_AREA },
        { label: t('navPurchaseHistory'), href: UserRoutes.PURCHASE_HISTORY },
      ],
    },
  ];
}

/** Sezioni Legal e Support condivise tra layout admin e user */
export function getSharedFooterSections(t: TranslateFn): FooterSection[] {
  return [
    {
      title: t('footerLegal'),
      items: [
        { label: t('footerPrivacy'), href: '/privacy' },
        { label: t('footerTerms'), href: '/terms' },
      ],
    },
    {
      title: t('footerSupport'),
      items: [{ label: t('footerContact'), href: '/contact' }],
    },
  ];
}

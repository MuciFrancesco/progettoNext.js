import {
  getPrivacyDataItems,
  privacyRightsItemKeys,
  privacySecurityItemKeys,
  privacyUsageItemKeys,
  translatePolicyItems,
} from '@/components/PrivacyPolicy/PolicyItemList/helpers/policyItems';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { toDisplayLocale } from '@/utils/format';
import { ReactNode } from 'react';

export type SectionConfig =
  | { kind: 'text'; title: string; text: string }
  | { kind: 'list'; title: string; items: ReactNode[] }
  | { kind: 'intro-list'; title: string; intro: string; items: ReactNode[] }
  | {
      kind: 'intro-list-closing';
      title: string;
      intro: string;
      items: ReactNode[];
      closing: string;
    };

const [t, locale] = await Promise.all([getTranslator(), getCurrentLocale()]);
export const lastUpdated = new Date().toLocaleDateString(toDisplayLocale(locale), {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const sections: SectionConfig[] = [
  { kind: 'text', title: t('privacyS1Title'), text: t('privacyS1Body') },
  {
    kind: 'intro-list',
    title: t('privacyS2Title'),
    intro: t('privacyS2Intro'),
    items: getPrivacyDataItems(t),
  },
  {
    kind: 'list',
    title: t('privacyS3Title'),
    items: translatePolicyItems(t, privacyUsageItemKeys),
  },
  { kind: 'text', title: t('privacyS4Title'), text: t('privacyS4Body') },
  { kind: 'text', title: t('privacyS5Title'), text: t('privacyS5Body') },
  {
    kind: 'intro-list-closing',
    title: t('privacyS6Title'),
    intro: t('privacyS6Intro'),
    items: translatePolicyItems(t, privacyRightsItemKeys),
    closing: t('privacyS6Closing'),
  },
  {
    kind: 'intro-list-closing',
    title: t('privacyS7Title'),
    intro: t('privacyS7Intro'),
    items: translatePolicyItems(t, privacySecurityItemKeys),
    closing: t('privacyS7Closing'),
  },
  { kind: 'text', title: t('privacyS8Title'), text: t('privacyS8Body') },
  { kind: 'text', title: t('privacyS9Title'), text: t('privacyS9Body') },
  { kind: 'text', title: t('privacyS10Title'), text: t('privacyS10Body') },
];

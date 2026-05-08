import {
  termsLiabilityItemKeys,
  termsOrderItemKeys,
  termsUseItemKeys,
  translatePolicyItems,
} from '@/components/PrivacyPolicy/PolicyItemList/helpers/policyItems';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { toDisplayLocale } from '@/utils/format';
import { ReactNode } from 'react';

const [t, locale] = await Promise.all([getTranslator(), getCurrentLocale()]);

export type SectionConfig =
  | { kind: 'text'; title: string; text: string }
  | { kind: 'ordered-list'; title: string; items: ReactNode[] }
  | { kind: 'text+list'; title: string; text: string; items: ReactNode[] };

export const sections: SectionConfig[] = [
  { kind: 'text', title: t('termsS1Title'), text: t('termsS1Body') },
  { kind: 'text', title: t('termsS2Title'), text: t('termsS2Body') },
  {
    kind: 'text+list',
    title: t('termsS3Title'),
    text: t('termsS3Body'),
    items: translatePolicyItems(t, termsUseItemKeys),
  },
  { kind: 'text', title: t('termsS4Title'), text: t('termsS4Body') },
  {
    kind: 'ordered-list',
    title: t('termsS5Title'),
    items: translatePolicyItems(t, termsOrderItemKeys),
  },
  { kind: 'text', title: t('termsS6Title'), text: t('termsS6Body') },
  { kind: 'text', title: t('termsS7Title'), text: t('termsS7Body') },
  {
    kind: 'text+list',
    title: t('termsS8Title'),
    text: t('termsS8Body'),
    items: translatePolicyItems(t, termsLiabilityItemKeys),
  },
  { kind: 'text', title: t('termsS9Title'), text: t('termsS9Body') },
  { kind: 'text', title: t('termsS10Title'), text: t('termsS10Body') },
  { kind: 'text', title: t('termsS11Title'), text: t('termsS11Body') },
  { kind: 'text', title: t('termsS12Title'), text: t('termsS12Body') },
];

export const lastUpdated = new Date().toLocaleDateString(toDisplayLocale(locale), {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

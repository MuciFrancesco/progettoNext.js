import {
  termsLiabilityItemKeys,
  termsOrderItemKeys,
  termsUseItemKeys,
  translatePolicyItems,
} from '@/components/PrivacyPolicy/PolicyItemList/helpers/policyItems';
import type { Locale } from '@/lib/i18n/translation';
import type { createTranslator } from '@/lib/i18n/translator';
import { toDisplayLocale } from '@/utils/format';
import { ReactNode } from 'react';

export type SectionConfig =
  | { kind: 'text'; title: string; text: string }
  | { kind: 'ordered-list'; title: string; items: ReactNode[] }
  | { kind: 'text+list'; title: string; text: string; items: ReactNode[] };

type Translator = ReturnType<typeof createTranslator>;

export function buildTermsSections(t: Translator): SectionConfig[] {
  return [
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
}

export function formatTermsLastUpdated(locale: Locale) {
  return new Date().toLocaleDateString(toDisplayLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

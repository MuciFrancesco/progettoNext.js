import type { ReactNode } from 'react';
import type { TranslationKey } from '@/lib/i18n/translator';

type Translator = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function getPrivacyDataItems(t: Translator): ReactNode[] {
  return [
    <>
      <strong>{t('privacyS2Item1Label')}</strong> {t('privacyS2Item1Desc')}
    </>,
    <>
      <strong>{t('privacyS2Item2Label')}</strong> {t('privacyS2Item2Desc')}
    </>,
    <>
      <strong>{t('privacyS2Item3Label')}</strong> {t('privacyS2Item3Desc')}
    </>,
    <>
      <strong>{t('privacyS2Item4Label')}</strong> {t('privacyS2Item4Desc')}
    </>,
  ];
}

export const privacyUsageItemKeys = [
  'privacyS3Item1',
  'privacyS3Item2',
  'privacyS3Item3',
  'privacyS3Item4',
  'privacyS3Item5',
  'privacyS3Item6',
] as const satisfies readonly TranslationKey[];

export const privacyRightsItemKeys = [
  'privacyS6Item1',
  'privacyS6Item2',
  'privacyS6Item3',
  'privacyS6Item4',
] as const satisfies readonly TranslationKey[];

export const privacySecurityItemKeys = [
  'privacyS7Item1',
  'privacyS7Item2',
  'privacyS7Item3',
  'privacyS7Item4',
  'privacyS7Item5',
  'privacyS7Item6',
  'privacyS7Item7',
] as const satisfies readonly TranslationKey[];

export const termsUseItemKeys = [
  'termsS3Item1',
  'termsS3Item2',
  'termsS3Item3',
] as const satisfies readonly TranslationKey[];

export const termsOrderItemKeys = [
  'termsS5Item1',
  'termsS5Item2',
  'termsS5Item3',
  'termsS5Item4',
] as const satisfies readonly TranslationKey[];

export const termsLiabilityItemKeys = [
  'termsS8Item1',
  'termsS8Item2',
  'termsS8Item3',
] as const satisfies readonly TranslationKey[];

export function translatePolicyItems(t: Translator, keys: readonly TranslationKey[]): ReactNode[] {
  return keys.map((key) => t(key));
}

// ─────────────────────────────────────────────
// Terms of Service – dichiarative section config
// ─────────────────────────────────────────────

export interface TermsSectionConfig {
  readonly titleKey: TranslationKey;
  readonly bodyKey?: TranslationKey;
  readonly list?: {
    readonly keys: readonly TranslationKey[];
    readonly ordered: boolean;
  };
}

export const termsSections = [
  { titleKey: 'termsS1Title', bodyKey: 'termsS1Body' },
  { titleKey: 'termsS2Title', bodyKey: 'termsS2Body' },
  {
    titleKey: 'termsS3Title',
    bodyKey: 'termsS3Body',
    list: { keys: termsUseItemKeys, ordered: false },
  },
  { titleKey: 'termsS4Title', bodyKey: 'termsS4Body' },
  {
    titleKey: 'termsS5Title',
    list: { keys: termsOrderItemKeys, ordered: true },
  },
  { titleKey: 'termsS6Title', bodyKey: 'termsS6Body' },
  { titleKey: 'termsS7Title', bodyKey: 'termsS7Body' },
  {
    titleKey: 'termsS8Title',
    bodyKey: 'termsS8Body',
    list: { keys: termsLiabilityItemKeys, ordered: false },
  },
  { titleKey: 'termsS9Title', bodyKey: 'termsS9Body' },
  { titleKey: 'termsS10Title', bodyKey: 'termsS10Body' },
  { titleKey: 'termsS11Title', bodyKey: 'termsS11Body' },
  { titleKey: 'termsS12Title', bodyKey: 'termsS12Body' },
] as const satisfies readonly TermsSectionConfig[];

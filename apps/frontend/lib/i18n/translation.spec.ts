import { describe, expect, it } from 'vitest';
import type { Dictionary } from './dictionary';
import { defaultLocale, dictionaries, locales } from './translation';
import { getLanguageOptions, translate } from './translator';

describe('i18n registry', () => {
  it('exports one dictionary for every declared locale', () => {
    expect(locales).toEqual(['it', 'en', 'fr', 'es', 'de']);

    for (const locale of locales) {
      expect(dictionaries[locale]).toBeDefined();
    }
  });

  it('keeps locale dictionaries aligned with the Dictionary contract', () => {
    const baseKeys = Object.keys(dictionaries[defaultLocale]).sort();

    for (const locale of locales) {
      const subject = dictionaries[locale] satisfies Dictionary;
      expect(Object.keys(subject).sort()).toEqual(baseKeys);
    }
  });

  it('resolves translated labels and parameter substitution', () => {
    expect(translate('it', 'errorRetry')).toBe('Riprova');
    expect(translate('en', 'footerCopyright', { year: 2026 })).toContain('2026');
  });

  it('builds language switcher options from the shared registry', () => {
    expect(getLanguageOptions('it')).toEqual([
      { value: 'it', label: 'Italiano' },
      { value: 'en', label: 'Inglese' },
      { value: 'fr', label: 'Francese' },
      { value: 'es', label: 'Spagnolo' },
      { value: 'de', label: 'Tedesco' },
    ]);
  });
});

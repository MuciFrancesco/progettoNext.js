# Frontend I18n Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the monolithic frontend translation registry into one file per locale without changing the public i18n API.

**Architecture:** Keep `dictionary.ts`, `translator.ts`, and `locale.ts` as the stable public surface. Move each locale dictionary into `lib/i18n/locales/<locale>.ts`, then rebuild `translation.ts` as a small registry module that re-exports `Locale`, `defaultLocale`, `locales`, and `dictionaries`.

**Tech Stack:** Next.js 16, TypeScript, Vitest, ESLint

---

## Critical Review Before Execution

- The frontend workspace currently has no unit-test runner for pure TypeScript utility modules. This plan adds a minimal Vitest setup first so the i18n refactor can follow a real red/green loop.
- The repo already has unrelated frontend lint failures in checkout/cookie-consent code. Do not treat those as regressions from this plan. Verification for this plan should target the i18n unit test file first, then run a broader lint/build pass and compare failures.
- `translation.ts` currently contains all locale payloads inline. To avoid transcription bugs, the locale object bodies must be moved by copy/paste from the exact ranges noted below instead of being retyped.

## File Structure

- Create: `apps/frontend/vitest.config.ts`
- Create: `apps/frontend/lib/i18n/locales/it.ts`
- Create: `apps/frontend/lib/i18n/locales/en.ts`
- Create: `apps/frontend/lib/i18n/locales/fr.ts`
- Create: `apps/frontend/lib/i18n/locales/es.ts`
- Create: `apps/frontend/lib/i18n/locales/de.ts`
- Create: `apps/frontend/lib/i18n/translation.spec.ts`
- Modify: `apps/frontend/package.json`
- Modify: `apps/frontend/lib/i18n/translation.ts`
- Reuse unchanged: `apps/frontend/lib/i18n/dictionary.ts`
- Reuse unchanged API: `apps/frontend/lib/i18n/translator.ts`, `apps/frontend/lib/i18n/locale.ts`

---

### Task 1: Add Frontend Unit Test Harness For I18n Contracts

**Files:**
- Create: `apps/frontend/vitest.config.ts`
- Create: `apps/frontend/lib/i18n/translation.spec.ts`
- Modify: `apps/frontend/package.json`

- [ ] **Step 1: Write the failing test and test runner config**

Create `apps/frontend/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
});
```

Create `apps/frontend/lib/i18n/translation.spec.ts`:

```ts
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
```

Modify `apps/frontend/package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test",
    "test:gherkin": "playwright test --grep @gherkin"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.1",
    "sass": "^1.99.0",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 2: Install the new test dependency**

Run:

```bash
npm install -D vitest -w apps/frontend
```

Expected: install completes and `apps/frontend/package.json` plus the root lockfile are updated.

- [ ] **Step 3: Run the test to verify the initial red state**

Run:

```bash
npm run test:unit -w apps/frontend -- lib/i18n/translation.spec.ts
```

Expected: FAIL because the workspace does not yet have the split locale modules this plan will introduce, or because imports/types are still coupled to the monolithic registry.

- [ ] **Step 4: Commit the harness and failing contract test**

```bash
git add apps/frontend/package.json package-lock.json apps/frontend/vitest.config.ts apps/frontend/lib/i18n/translation.spec.ts
git commit -m "test: add i18n contract harness"
```

---

### Task 2: Split The Monolithic Translation Registry Into Locale Modules

**Files:**
- Create: `apps/frontend/lib/i18n/locales/it.ts`
- Create: `apps/frontend/lib/i18n/locales/en.ts`
- Create: `apps/frontend/lib/i18n/locales/fr.ts`
- Create: `apps/frontend/lib/i18n/locales/es.ts`
- Create: `apps/frontend/lib/i18n/locales/de.ts`
- Modify: `apps/frontend/lib/i18n/translation.ts`

- [ ] **Step 1: Create the locale module wrappers**

Create `apps/frontend/lib/i18n/locales/it.ts` with this wrapper:

```ts
import type { Dictionary } from '../dictionary';

export const it: Dictionary = {
  // Copy the exact object body currently inside apps/frontend/lib/i18n/translation.ts lines 10-460
};
```

Create `apps/frontend/lib/i18n/locales/en.ts` with this wrapper:

```ts
import type { Dictionary } from '../dictionary';

export const en: Dictionary = {
  // Copy the exact object body currently inside apps/frontend/lib/i18n/translation.ts lines 461-908
};
```

Create `apps/frontend/lib/i18n/locales/fr.ts` with this wrapper:

```ts
import type { Dictionary } from '../dictionary';

export const fr: Dictionary = {
  // Copy the exact object body currently inside apps/frontend/lib/i18n/translation.ts lines 909-1358
};
```

Create `apps/frontend/lib/i18n/locales/es.ts` with this wrapper:

```ts
import type { Dictionary } from '../dictionary';

export const es: Dictionary = {
  // Copy the exact object body currently inside apps/frontend/lib/i18n/translation.ts lines 1359-1810
};
```

Create `apps/frontend/lib/i18n/locales/de.ts` with this wrapper:

```ts
import type { Dictionary } from '../dictionary';

export const de: Dictionary = {
  // Copy the exact object body currently inside apps/frontend/lib/i18n/translation.ts lines 1811-2255
};
```

Important: do not rewrite string contents manually. Move the exact existing object bodies so keys, apostrophes, and current transliteration stay byte-for-byte identical.

- [ ] **Step 2: Replace the giant registry file with a thin composition module**

Rewrite `apps/frontend/lib/i18n/translation.ts` to:

```ts
import type { Dictionary } from './dictionary';
import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { it } from './locales/it';

export const locales = ['it', 'en', 'fr', 'es', 'de'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'it';

export const dictionaries: Record<Locale, Dictionary> = {
  it,
  en,
  fr,
  es,
  de,
};
```

- [ ] **Step 3: Run the targeted unit test to verify green**

Run:

```bash
npm run test:unit -w apps/frontend -- lib/i18n/translation.spec.ts
```

Expected: PASS, with all registry and translation contract assertions green.

- [ ] **Step 4: Run a type check against the frontend workspace**

Run:

```bash
npx tsc --noEmit -p apps/frontend/tsconfig.json
```

Expected: PASS with no new TypeScript errors introduced by the split.

- [ ] **Step 5: Commit the split registry**

```bash
git add apps/frontend/lib/i18n/translation.ts apps/frontend/lib/i18n/locales
git commit -m "refactor: split frontend translations by locale"
```

---

### Task 3: Verify Public API Stability And Regression Surface

**Files:**
- Modify only if needed: `apps/frontend/lib/i18n/translator.ts`
- Modify only if needed: `apps/frontend/lib/i18n/locale.ts`
- Test: `apps/frontend/lib/i18n/translation.spec.ts`

- [ ] **Step 1: Confirm no downstream imports need changes**

Inspect:

```bash
rg "from '@/lib/i18n/translation'|from './translation'|from '@/lib/i18n/translator'" apps/frontend
```

Expected: existing import sites should continue working because `Locale`, `defaultLocale`, `locales`, and `dictionaries` remain exported from `translation.ts`.

- [ ] **Step 2: Keep `translator.ts` unchanged unless the test reveals a real need**

Target file should remain:

```ts
import type { Dictionary } from './dictionary';
import { locales, type Locale, defaultLocale, dictionaries } from './translation';

export type TranslationKey = keyof Dictionary;

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && locales.includes(value as Locale);
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const text = dictionaries[locale][key] ?? dictionaries[defaultLocale][key];

  if (!params) {
    return text;
  }

  return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
    return acc.replace(`{${paramKey}}`, String(paramValue));
  }, text);
}
```

This step is a stability check: if the targeted tests already pass, do not refactor this file further.

- [ ] **Step 3: Run broader verification**

Run:

```bash
npm run lint -w apps/frontend
```

Expected: no new i18n-related failures. Existing unrelated lint failures in checkout/cookie-consent code may still appear and should be documented as pre-existing.

Then run:

```bash
npm run build -w apps/frontend
```

Expected: frontend build succeeds with the split locale modules.

- [ ] **Step 4: Commit verification-only cleanup if any import path or formatting changes were needed**

```bash
git add apps/frontend/lib/i18n/translator.ts apps/frontend/lib/i18n/locale.ts apps/frontend/lib/i18n/translation.spec.ts apps/frontend/package.json package-lock.json
git commit -m "chore: verify split i18n registry stability"
```

---

## Self-Review

### Spec coverage

- Audit requirement to split `translation.ts` into per-locale files: covered by Task 2.
- Preserve existing public API for callers using `Locale`, `defaultLocale`, `dictionaries`, `translate()`: covered by Tasks 2 and 3.
- Add meaningful verification rather than blind file moves: covered by Tasks 1 and 3.

### Placeholder scan

- No `TODO`, `TBD`, or “implement later” language remains.
- The only copy step references exact file paths and exact source line ranges from the current monolithic file, because reproducing 2,200+ lines verbatim inside the plan would add noise without increasing correctness.

### Type consistency

- `Locale`, `Dictionary`, and `dictionaries` stay defined in the same modules used today.
- The new locale modules all type their payloads as `Dictionary`.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-04-frontend-i18n-restructure.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**

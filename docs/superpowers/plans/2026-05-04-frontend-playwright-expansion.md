# Frontend Playwright Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ampliare la copertura Playwright/Gherkin sui journey utente ad alto valore senza trasformare la suite in un duplicato lento dei test unit/backend.

**Architecture:** Si mantiene l’organizzazione per dominio (`auth`, `user`, `admin`, `shop`) e si riusano support helpers e seed API. I nuovi scenari devono essere leggibili come comportamento business, con step piccoli e locator stabili.

**Tech Stack:** Playwright, Gherkin-style specs, page helpers, API seeding utilities

---

### Task 1: Normalize E2E Domain Layout

**Files:**
- Review/Modify: `apps/frontend/e2e/auth/**`
- Review/Modify: `apps/frontend/e2e/user/**`
- Review/Modify: `apps/frontend/e2e/admin/**`
- Create: `apps/frontend/e2e/shop/**` if missing
- Review/Modify: `apps/frontend/e2e/utils/support/**`

- [ ] Keep domain folders stable and documented.
- [ ] Move or rename files only when it improves discoverability enough to justify churn.
- [ ] Keep shared support under `utils/support` unless a cleaner domain split is clearly beneficial.

### Task 2: Strengthen Auth And User Gherkin

**Files:**
- Modify: `apps/frontend/e2e/auth/auth.feature`
- Modify: `apps/frontend/e2e/auth/auth.steps.ts`
- Modify: `apps/frontend/e2e/auth/auth.gherkin.spec.ts`
- Modify: `apps/frontend/e2e/user/user.feature`
- Modify: `apps/frontend/e2e/user/user.steps.ts`
- Modify: `apps/frontend/e2e/user/user.gherkin.spec.ts`

- [ ] Add one scenario for successful sign-in and role-correct landing.
- [ ] Add locale persistence/signout assertions that are robust to current UI structure.
- [ ] Keep lockout coverage, but ensure data setup/cleanup is deterministic.

### Task 3: Expand Admin Gherkin Coverage

**Files:**
- Modify: `apps/frontend/e2e/admin/admin.feature`
- Modify: `apps/frontend/e2e/admin/admin.gherkin.spec.ts`
- Optional create: `apps/frontend/e2e/admin/admin.steps.ts`
- Modify if needed: `apps/frontend/e2e/utils/support/pages/admin-page.ts`

- [ ] Cover admin dashboard access, locale change, and at least one admin surface beyond initial visibility.
- [ ] Prefer stable assertions on table/panel presence and guarded navigation over brittle cosmetic checks.
- [ ] Add one negative scenario for standard user redirect if not already covered strongly enough in user domain.

### Task 4: Add Shop / Checkout Journeys

**Files:**
- Create: `apps/frontend/e2e/shop/shop.feature`
- Create: `apps/frontend/e2e/shop/shop.steps.ts`
- Create: `apps/frontend/e2e/shop/shop.gherkin.spec.ts`
- Optional review existing: `apps/frontend/e2e/ecommerce_flow.spec.ts`
- Optional review existing: `apps/frontend/e2e/auth_redirect.spec.ts`

- [ ] Cover catalog browsing and add-to-cart with deterministic product assumptions.
- [ ] Cover cart to checkout transition for an authenticated user.
- [ ] Cover one main checkout branch and one failure/blocked branch, reusing current demo payment flow where practical.

### Task 5: Strengthen Support Contracts

**Files:**
- Modify: `apps/frontend/e2e/utils/support/auth-api.ts`
- Modify: `apps/frontend/e2e/utils/support/auth-test-ids.ts`
- Modify: `apps/frontend/e2e/utils/support/pages/*.ts`
- Modify if needed: frontend components/pages to expose stable `data-testid`

- [ ] Centralize any missing selectors in a single stable contract.
- [ ] Add helper APIs only when they reduce duplication across multiple domains.
- [ ] Avoid leaking text-based locators back into the suite.

### Verification

- [ ] `npm run test:gherkin -w apps/frontend`
- [ ] `npm run test:e2e -w apps/frontend`
- [ ] Re-run targeted scenarios for changed domains before broad suite execution

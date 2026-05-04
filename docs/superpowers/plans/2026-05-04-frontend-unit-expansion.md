# Frontend Unit Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Estendere i unit test frontend sui nodi ad alta centralità e sui flussi a rischio, oltre l’area admin già coperta.

**Architecture:** Si riusa la harness Vitest esistente e si aggiungono test mirati su hook e helper con branching reale. I componenti presentazionali rimangono poco testati salvo quando nascondono comportamento critico o servono a bloccare regressioni di UX/logica.

**Tech Stack:** Vitest, React Testing Library, jsdom, Next.js hooks/components

---

### Task 1: User-Area Hook Coverage

**Files:**
- Create: `apps/frontend/features/user/hooks/useMyOrders.spec.ts`
- Optional helper updates: `apps/frontend/test/setup.ts`

- [ ] Cover `useMyOrders` for filter options, server pagination request shape, revenue updates and sort toggling.
- [ ] Mock `@/lib/actions/user` instead of the network.
- [ ] Include one regression test for keeping `page` and `filter` in sync after filter change.

### Task 2: Catalog And Cart-Adjacent Logic Coverage

**Files:**
- Create: `apps/frontend/features/shop/hooks/useProductCatalog.spec.ts`
- Optional create: `apps/frontend/features/shop/hooks/useCartPage.spec.ts` if hook exists and has nontrivial branching

- [ ] Cover category filtering, text search, empty-state behavior and cart sync invocation for `useProductCatalog`.
- [ ] Assert labels derived from translator/constants stay stable where they drive UI behavior.
- [ ] Test only cart logic with meaningful branching; skip trivial pass-through render wiring.

### Task 3: Checkout Flow Unit Coverage

**Files:**
- Create: `apps/frontend/features/shop/hooks/useCheckoutPage.spec.ts`
- Create or extend: `apps/frontend/components/Checkout/CardPaymentForm.spec.tsx` if needed

- [ ] Cover redirect-to-cart behavior when checkout opens with empty cart.
- [ ] Cover init success vs init failure, card capture path, and PayPal popup-blocked path.
- [ ] Add narrow tests around card validation helpers if extracting them makes the suite cleaner.

### Task 4: Stability Fixes That Unblock Tests

**Files:**
- Modify: `apps/frontend/components/CookieConsent/CookieConsentController.tsx`
- Modify: `apps/frontend/components/Checkout/CardPaymentForm.tsx`
- Modify: `apps/frontend/app/(user)/checkout/paypal-popup/page.tsx`

- [ ] Fix the three known lint issues in a test-friendly way before or during related suite additions.
- [ ] Keep behavior unchanged while removing direct ref reads during render and sync setState-in-effect patterns.
- [ ] Add regression tests only where the fix changes observable logic.

### Task 5: Final Frontend Unit Gate

**Files:**
- Modify if needed: root `package.json`
- Modify if needed: `apps/frontend/package.json`

- [ ] Keep `npm run test:unit -w apps/frontend` as the main frontend fast gate.
- [ ] Do not fold Playwright into this fast lane.
- [ ] Document any optional focused commands for local iteration.

### Verification

- [ ] `npm run test:unit -w apps/frontend`
- [ ] `npx tsc --noEmit -p apps/frontend/tsconfig.json`
- [ ] `npm run lint -w apps/frontend`

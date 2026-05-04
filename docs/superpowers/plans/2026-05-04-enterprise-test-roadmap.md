# Enterprise Test Roadmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare il progetto a una copertura test alta ma pragmatica, allineata ai flussi reali e sostenibile nel tempo.

**Architecture:** Il lavoro viene diviso in cinque sottoprogetti indipendenti ma coordinati: allineamento della strategia, espansione unit frontend, hardening backend unit/e2e, ampliamento Playwright/Gherkin e rifinitura script/docs CI. Ogni piano produce valore autonomo e riduce rischio prima del successivo.

**Tech Stack:** Vitest, React Testing Library, Jest, Supertest, Playwright, Gherkin-style specs, Next.js, NestJS

---

### Task 1: Strategy Alignment

**Files:**
- Modify: `TEST_STRATEGY.md`
- Modify: root `package.json`
- Optional modify: `apps/frontend/playwright.config.ts`
- Reference: `docs/superpowers/specs/2026-05-04-enterprise-test-strategy-design.md`

- [ ] Align docs, scripts and directory descriptions to the real repo layout.
- [ ] Decide final command surface for unit, backend-e2e and frontend-playwright.
- [ ] Keep existing working scripts stable unless a rename clearly improves maintainability.

### Task 2: Frontend Unit Expansion

**Files:**
- Create/Modify under: `apps/frontend/features/**/*.spec.ts`
- Create/Modify under: `apps/frontend/lib/**/*.spec.ts`
- Create optional helpers under: `apps/frontend/test/**`

- [ ] Extend unit coverage on high-value hooks and helper logic.
- [ ] Add tests for user/shop/auth areas, not just admin.
- [ ] Fix any testability blockers uncovered by the new suites.

### Task 3: Backend Unit And E2E Hardening

**Files:**
- Modify: `apps/backend/src/**/*.spec.ts`
- Create/Modify: `apps/backend/test/e2e/*.e2e-spec.ts`

- [ ] Expand unit coverage on auth/admin/mailer/guards/upload logic.
- [ ] Add realistic API contract tests for locale, bookmarks and admin access matrix.
- [ ] Keep e2e focused on security and integration seams, not every endpoint permutation.

### Task 4: Frontend Playwright Domain Expansion

**Files:**
- Create/Modify: `apps/frontend/e2e/auth/**`
- Create/Modify: `apps/frontend/e2e/user/**`
- Create/Modify: `apps/frontend/e2e/admin/**`
- Create/Modify: `apps/frontend/e2e/shop/**`
- Create/Modify: `apps/frontend/e2e/utils/support/**`

- [ ] Keep Gherkin business-readable and organized by domain.
- [ ] Cover auth, user, admin and the most valuable shop/checkout journeys.
- [ ] Normalize support utilities and stable selectors.

### Task 5: Final Integration And Verification

**Files:**
- Modify: root `package.json`
- Modify: `TEST_STRATEGY.md`
- Optional create: CI-facing notes if command surface changes materially

- [ ] Ensure the full command matrix is documented and reproducible locally.
- [ ] Verify unit and e2e layers can run independently.
- [ ] Document known environment requirements and residual gaps.

### Verification

- [ ] `npm run test:unit`
- [ ] `npm run test:e2e -w apps/backend`
- [ ] `npm run test:gherkin -w apps/frontend`
- [ ] Update `graphify-out` after major structural changes

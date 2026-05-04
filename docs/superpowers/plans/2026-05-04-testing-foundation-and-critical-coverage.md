# Testing Foundation And Critical Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add enough automated coverage to support the risky admin frontend and backend refactors identified in the audit.

**Architecture:** Add a lightweight unit-test harness for frontend hooks/components and expand backend service coverage around auth/admin workflows. Land harness first, then add narrow high-value tests around stateful admin logic.

**Tech Stack:** Vitest, React Testing Library, Jest/Nest test runner, Playwright

---

### Task 1: Frontend Unit Test Harness

**Files:**
- Create: `apps/frontend/vitest.config.ts` (or extend if created by the i18n plan)
- Create: `apps/frontend/test/setup.ts`
- Modify: `apps/frontend/package.json`

- [ ] Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
- [ ] Add `test:unit` and `test:unit:watch` scripts.
- [ ] Add a shared test setup file that registers `@testing-library/jest-dom`.
- [ ] Verify with a trivial smoke test under `apps/frontend/features/admin`.

### Task 2: Admin Hook Coverage

**Files:**
- Create: `apps/frontend/features/admin/hooks/useAdminRoleManager.spec.ts`
- Create: `apps/frontend/features/admin/hooks/useAdminUpdateProductsTable.spec.ts`
- Create: `apps/frontend/features/admin/hooks/useAdminOrders.spec.ts`

- [ ] Cover pagination requests, search/reset behavior, bulk selection constraints, and success/error toast paths.
- [ ] Mock `@/lib/actions/admin` rather than hitting the backend.
- [ ] Verify the tests reproduce current behavior before any decomposition work begins.

### Task 3: Backend Critical Service Coverage

**Files:**
- Modify: `apps/backend/src/auth/auth.service.spec.ts`
- Create: `apps/backend/src/admin/admin.service.spec.ts`

- [ ] Add coverage for admin bulk-update/delete behavior and remote busy state semantics.
- [ ] Extend auth coverage around refresh rotation, reuse detection, and logout/session invalidation.
- [ ] Keep tests narrow around business logic instead of booting the full app when not necessary.

### Task 4: Regression Gate

**Files:**
- Modify: root `package.json`
- Optional create: `TEST_STRATEGY.md` follow-up note if scripts change materially

- [ ] Add top-level scripts if needed to run backend plus frontend unit tests consistently.
- [ ] Keep Playwright as a separate slower layer; do not block small refactors on full E2E by default.

---

### Verification

- [ ] `npm run test:unit -w apps/frontend`
- [ ] `npm test -w apps/backend` or the repo’s existing backend test script
- [ ] Document remaining gaps before proceeding to the admin decomposition plan

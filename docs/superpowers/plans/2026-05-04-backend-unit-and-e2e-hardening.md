# Backend Unit And E2E Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rafforzare il backend con coverage su security rules, contratti API e behavior dei nuovi boundary introdotti dai refactor recenti.

**Architecture:** La logica di business resta coperta da unit test veloci su service e guard. I contratti tra moduli vengono difesi da e2e Supertest su un’app Nest reale. L’attenzione è su auth, locale, bookmark ownership, admin matrix e upload/mailer boundary.

**Tech Stack:** Jest, Nest TestingModule, Supertest, Prisma-backed e2e

---

### Task 1: Expand Auth Unit Coverage

**Files:**
- Modify: `apps/backend/src/auth/auth.service.spec.ts`
- Optional create helpers inside the same spec if repeated setup grows

- [ ] Add coverage for refresh rotation success path.
- [ ] Add coverage for revoked/expired/reused refresh token handling.
- [ ] Add coverage for password reset request flow and mailer invocation/fallback behavior.

### Task 2: Cover New Backend Boundaries

**Files:**
- Create: `apps/backend/src/auth/guard/admin.guard.spec.ts`
- Create: `apps/backend/src/auth/guard/admin-or-employee.guard.spec.ts`
- Create: `apps/backend/src/auth/mailer.service.spec.ts`
- Optional create: `apps/backend/src/admin/upload.controller.spec.ts` only if validation can be isolated cleanly

- [ ] Test the new declarative guards against allowed and denied claims.
- [ ] Test `MailerService` in provider-configured and fallback-logging modes.
- [ ] Keep upload validation unit tests narrow if extraction is required for maintainability.

### Task 3: Extend Backend E2E For User/Profile Contracts

**Files:**
- Create: `apps/backend/test/e2e/user-locale.e2e-spec.ts`
- Optional modify: `apps/backend/test/e2e/auth.e2e-spec.ts`

- [ ] Cover `PATCH /users/me/locale` for valid locale updates.
- [ ] Cover unsupported locale or malformed payload rejection.
- [ ] Verify auth is required and the updated locale is persisted.

### Task 4: Add Bookmark Ownership E2E

**Files:**
- Create: `apps/backend/test/e2e/bookmark-ownership.e2e-spec.ts`

- [ ] Cover create/read/update/delete for the owner.
- [ ] Cover cross-user access denial on read/update/delete.
- [ ] Make the scenarios explicit about IDOR prevention.

### Task 5: Expand Admin Matrix E2E

**Files:**
- Modify or create: `apps/backend/test/e2e/admin-access.e2e-spec.ts`
- Optional merge with `access-control.e2e-spec.ts` only if readability improves

- [ ] Cover standard user denial on admin routes.
- [ ] Cover employee access on product-management routes if semantics allow it.
- [ ] Cover admin-only access on user-management and orders routes.
- [ ] Add one upload spoof rejection scenario if environment/setup supports it cleanly.

### Verification

- [ ] `npm test -w apps/backend`
- [ ] `npm run test:e2e -w apps/backend`
- [ ] `npx tsc --noEmit -p apps/backend/tsconfig.json`

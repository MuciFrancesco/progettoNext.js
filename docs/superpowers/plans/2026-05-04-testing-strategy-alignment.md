# Testing Strategy Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Riallineare documentazione, path e script della suite test alla struttura reale del repo.

**Architecture:** Prima si fotografa la topologia esistente, poi si correggono i riferimenti incoerenti in docs e script senza rompere i comandi già funzionanti. Si preferisce normalizzare i nomi e le convenzioni piuttosto che fare rename invasivi se non necessari.

**Tech Stack:** Markdown docs, npm workspaces, Playwright config, Jest e Vitest scripts

---

### Task 1: Align Test Strategy Document

**Files:**
- Modify: `TEST_STRATEGY.md`
- Reference: `docs/superpowers/specs/2026-05-04-enterprise-test-strategy-design.md`

- [ ] Replace stale path references such as `apps/frontend/e2e/features` and `apps/frontend/e2e/specs` with the real layout under `apps/frontend/e2e/auth`, `user`, `admin`, `utils/support`.
- [ ] Update the current coverage snapshot to include the new Vitest suites already added under `apps/frontend/features/admin/hooks/*.spec.ts` and backend coverage under `apps/backend/src/admin/admin.service.spec.ts`.
- [ ] Rewrite the “Blind spot residui” section so it reflects today’s actual gaps: shop/checkout coverage, locale API coverage, bookmark ownership, admin product/user flows, and mailer configured-environment behavior.

### Task 2: Normalize Command Surface

**Files:**
- Modify: root `package.json`
- Modify: `apps/frontend/package.json`
- Optional modify: `apps/backend/package.json`

- [ ] Keep `npm run test:unit` at root as the fast regression gate.
- [ ] Add root-level convenience scripts if missing, such as `test:e2e:backend` and `test:e2e:frontend`, without removing workspace-local commands.
- [ ] Ensure naming is predictable: unit, backend e2e, frontend playwright/gherkin each have a single obvious entrypoint.

### Task 3: Verify Playwright Configuration Contracts

**Files:**
- Review/Modify: `apps/frontend/playwright.config.ts`
- Review/Modify: `apps/frontend/e2e/utils/support/auth-api.ts`
- Review/Modify: `apps/frontend/e2e/utils/support/test-user-store.ts`

- [ ] Confirm the Playwright config points to the actual `e2e` tree and stores output under a stable artifacts directory.
- [ ] Document the environment variables really required by the support layer (`BACKEND_URL`, `E2E_PASSWORD`, database access for admin promotion).
- [ ] If needed, rename or move only the support directories that reduce confusion without causing broad churn.

### Task 4: Lock Down Documentation For Execution

**Files:**
- Modify: `TEST_STRATEGY.md`
- Optional create: `docs/superpowers/plans/2026-05-04-enterprise-test-roadmap.md` cross-links only if needed

- [ ] Add a concise command matrix for local development and CI.
- [ ] Add one section explaining what belongs in unit vs backend-e2e vs Playwright to prevent future duplication.
- [ ] Record known setup prerequisites for deterministic runs.

### Verification

- [ ] `npm run test:unit`
- [ ] `npm run test:e2e -w apps/backend -- --runInBand` or the repo’s stable backend e2e invocation
- [ ] `npm run test:gherkin -w apps/frontend -- --list` if supported, otherwise a narrow tag run

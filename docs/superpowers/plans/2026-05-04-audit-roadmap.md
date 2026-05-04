# Audit Remediation Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Break the technical audit into independent, sequenced implementation plans and execute them in a safe order.

**Architecture:** Use plan-per-subsystem. Start with isolated, high-signal work that can add its own verification harness, then move into riskier admin and backend restructures only after tests exist.

**Tech Stack:** Next.js 16, React 19, NestJS, Prisma, TypeScript, Playwright, Vitest

---

### Execution Order

- [ ] `2026-05-04-frontend-i18n-restructure.md`
  Purpose: split `translation.ts`, add unit harness, keep public i18n API stable.

- [ ] `2026-05-04-testing-foundation-and-critical-coverage.md`
  Purpose: establish frontend/backend test scaffolding for risky admin refactors.

- [ ] `2026-05-04-frontend-admin-decomposition.md`
  Purpose: reduce frontend admin file size, props drilling, and feature colocation debt.

- [ ] `2026-05-04-backend-admin-hardening.md`
  Purpose: replace manual role checks with guards, remove sync upload IO, address `bulkBusy`.

- [ ] `2026-05-04-platform-mailer-and-caching.md`
  Purpose: make password-reset mail operational in production and improve public catalog caching.

---

### Notes

- `error.tsx`, shared constants, cookie name deduplication, and toast replacement are already partially completed and should be treated as done unless a later plan finds regressions.
- Existing unrelated frontend lint failures are known and should not be confused with regressions from the first plan.

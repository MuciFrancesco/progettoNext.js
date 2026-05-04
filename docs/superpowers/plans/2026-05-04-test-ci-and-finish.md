# Test CI And Finish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chiudere il lavoro con una superficie di esecuzione chiara, documentata e adatta a una pipeline enterprise moderna.

**Architecture:** Si consolidano i comandi root e workspace, si aggiorna la documentazione finale e si separano mentalmente e operativamente le lane `unit`, `backend-e2e`, `frontend-playwright`. Nessun cambio comportamentale di prodotto in questo piano.

**Tech Stack:** npm workspaces, Markdown docs, existing test runners

---

### Task 1: Root Script Cleanup

**Files:**
- Modify: root `package.json`
- Optional modify: `apps/frontend/package.json`
- Optional modify: `apps/backend/package.json`

- [ ] Add or normalize root convenience scripts for backend e2e and frontend playwright if still missing after the earlier plans.
- [ ] Keep unit and e2e commands independent.
- [ ] Ensure command names remain obvious for developers and CI maintainers.

### Task 2: Final Test Strategy Update

**Files:**
- Modify: `TEST_STRATEGY.md`

- [ ] Update file lists, coverage notes and command examples to match the final implemented suites.
- [ ] Record environment requirements for backend DB, Playwright stack and mailer-related configured-environment tests.
- [ ] List residual blind spots honestly instead of implying full coverage.

### Task 3: Optional CI Notes

**Files:**
- Optional create: `docs/testing-ci-notes.md` or append to `TEST_STRATEGY.md`

- [ ] Document the recommended CI lane split: `frontend-unit`, `backend-unit`, `backend-e2e`, `frontend-playwright`.
- [ ] Note which suites are safe as fast gates vs slower nightly or branch protection jobs.
- [ ] Keep this lightweight; do not invent CI config files unless the repo already wants them.

### Task 4: Final Verification Pass

**Files:**
- No mandatory code files; run full command matrix

- [ ] Run the unit gate.
- [ ] Run backend e2e.
- [ ] Run frontend gherkin/playwright.
- [ ] Update Graphify if file structure changed during the test work.

### Verification

- [ ] `npm run test:unit`
- [ ] `npm run test:e2e -w apps/backend`
- [ ] `npm run test:gherkin -w apps/frontend`
- [ ] `python -m graphify update .`

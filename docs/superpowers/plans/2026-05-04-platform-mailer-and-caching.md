# Platform Mailer And Caching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the production-readiness gaps around password-reset email delivery and public catalog caching.

**Architecture:** Introduce a real mail transport behind the existing `MailerService` abstraction, then make public product listing opt into cache/revalidation without weakening authenticated request handling.

**Tech Stack:** NestJS, Next.js App Router, backend HTTP client layer, chosen mail provider SDK/SMTP transport

---

### Task 1: Real Mail Provider Integration

**Files:**
- Modify: `apps/backend/src/auth/mailer.service.ts`
- Modify/Create: config files for provider credentials
- Optional create: provider adapter module

- [ ] Choose one provider path and keep it injectable/config-driven.
- [ ] Preserve development logging fallback when credentials are absent.
- [ ] Verify forgot-password and phishing-alert flows send real mail in non-dev environments.

### Task 2: Public Catalog Caching

**Files:**
- Modify: `apps/frontend/lib/api/backend.ts`
- Modify: `apps/frontend/lib/api/products.ts` or equivalent public data wrapper
- Modify: `apps/frontend/app/page.tsx`

- [ ] Allow public requests to supply cache/revalidation options without changing authenticated defaults.
- [ ] Keep admin/user/private requests on `no-store`.
- [ ] Apply ISR or revalidation for the home catalog request.

### Task 3: Dynamic Rendering Documentation

**Files:**
- Modify: `apps/frontend/app/(admin)/dashboard/layout.tsx`
- Modify: `apps/frontend/app/(user)/user/layout.tsx`

- [ ] Add short comments explaining why `force-dynamic` is required where session cookies are read.
- [ ] Do not change runtime behavior in this step.

---

### Verification

- [ ] Password reset sends real email in configured environments
- [ ] Home page product list responds with expected revalidation behavior
- [ ] Private routes still bypass cache

# Frontend Admin Decomposition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce frontend admin complexity by improving colocation, shrinking monolithic files, and lowering props drilling.

**Architecture:** Move feature-owned UI closer to `features/admin`, split the biggest components by responsibility, and only attempt the hook decomposition after the testing foundation plan is green.

**Tech Stack:** Next.js App Router, React 19, TypeScript, MUI

---

### Task 1: Feature Colocation

**Files:**
- Move: `apps/frontend/components/RoleManager/*`
- Move: `apps/frontend/components/AddProductForm/*`
- Move: `apps/frontend/components/UpdateProduct/*`
- Move: `apps/frontend/components/AddUserModal/*`
- Target: `apps/frontend/features/admin/ui/**`

- [ ] Move feature-owned admin UI into `features/admin/ui`.
- [ ] Update imports from admin pages and admin feature containers.
- [ ] Leave truly shared primitives where they are.

### Task 2: Update Product Surface Split

**Files:**
- Modify/Create under: `apps/frontend/features/admin/ui/update-product/**`

- [ ] Extract the search/filter strip from `UpdateProduct.tsx`.
- [ ] Extract the edit dialog from `UpdateProduct.tsx`.
- [ ] Extract the bulk action toolbar from `UpdateProduct.tsx`.
- [ ] Keep the container wiring stable until tests prove behavior is preserved.

### Task 3: Role Manager Surface Split

**Files:**
- Modify/Create under: `apps/frontend/features/admin/ui/role-manager/**`
- Modify: `apps/frontend/features/admin/components/AdminRoleManager.tsx`

- [ ] Reduce the pass-through prop surface by grouping view models or introducing a local feature context only if tests stay green.
- [ ] Keep table head/body split but pull search/actions into focused presentational units.

### Task 4: Route UX Follow-Ups

**Files:**
- Create: `apps/frontend/app/(admin)/**/loading.tsx` where missing
- Create or adjust: route-level loading states in `apps/frontend/app/(user)`
- Optional later: rename `addproduct`/`updateproduct` routes behind redirects if accepted

- [ ] Add missing loading boundaries for admin sub-routes and user area routes.
- [ ] Do not rename routes until link surfaces and redirects are planned, since that changes URLs.

---

### Verification

- [ ] Frontend unit tests for admin hooks/components stay green
- [ ] `npm run lint -w apps/frontend`
- [ ] `npm run build -w apps/frontend`

# Backend Admin Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin backend more declarative, scalable, and event-loop-safe.

**Architecture:** Replace per-endpoint role assertions with reusable guards, make upload validation async, and move the bulk-operation busy flag behind a persistence-friendly abstraction.

**Tech Stack:** NestJS, Prisma, TypeScript, Node.js fs/promises

---

### Task 1: Declarative Role Guards

**Files:**
- Create: `apps/backend/src/auth/guards/admin.guard.ts`
- Create: `apps/backend/src/auth/guards/admin-or-employee.guard.ts`
- Modify: `apps/backend/src/admin/admin.controller.ts`
- Modify if needed: auth/admin module registration files

- [ ] Implement role guards using request user claims already produced by `JwtGuard`.
- [ ] Apply guards at endpoint level and remove `assertAdmin`/`assertAdminOrEmployee`.
- [ ] Preserve current authorization semantics while reducing duplication.

### Task 2: Async Upload Validation

**Files:**
- Modify: `apps/backend/src/admin/upload.controller.ts`

- [ ] Replace `readFileSync` with `readFile` from `node:fs/promises`.
- [ ] Keep existing cleanup behavior for spoofed files.
- [ ] Preserve MIME/extension/magic-byte validation order.

### Task 3: Bulk Busy Abstraction

**Files:**
- Modify: `apps/backend/src/admin/admin.service.ts`
- Create optional abstraction: `apps/backend/src/admin/bulk-status.store.ts`

- [ ] Hide `bulkBusy` behind an interface so future Redis/DB-backed state can replace in-memory storage cleanly.
- [ ] Keep the current single-instance behavior identical.
- [ ] Add TODO/context in the abstraction boundary instead of leaving bare mutable service state.

---

### Verification

- [ ] Backend unit tests for guards/admin service pass
- [ ] Admin endpoints still accept admin/employee combinations exactly as before
- [ ] Upload flow still rejects spoofed files after the async change

# Developer Guide — progettoNext.js

This document is the authoritative reference for Claude, Codex, or any AI/developer writing new code in this project. Every convention, pattern, and architectural decision documented here was derived from the actual codebase. Follow it exactly.

---

## Table of Contents

1. [Monorepo Structure](#1-monorepo-structure)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [How to Add a New Translation Key](#4-how-to-add-a-new-translation-key)
5. [How to Create a New Atomic Component](#5-how-to-create-a-new-atomic-component)
6. [How to Create a New Feature](#6-how-to-create-a-new-feature)
7. [How to Add a New Backend Endpoint (Full-Stack)](#7-how-to-add-a-new-backend-endpoint-full-stack)
8. [How to Add a New Page (App Router)](#8-how-to-add-a-new-page-app-router)
9. [State Management](#9-state-management)
10. [API Layer Conventions](#10-api-layer-conventions)
11. [i18n Conventions](#11-i18n-conventions)
12. [TypeScript Conventions](#12-typescript-conventions)
13. [SCSS / Styling Conventions](#13-scss--styling-conventions)
14. [Authentication Pattern](#14-authentication-pattern)
15. [Checklist for Every New Feature](#15-checklist-for-every-new-feature)

---

## 1. Monorepo Structure

```
progettoNext.js/
├── apps/
│   ├── frontend/          # Next.js 16 App Router (React 19, MUI 9, Sass)
│   └── backend/           # NestJS 11, Prisma 7, PostgreSQL
├── packages/              # Shared packages (currently empty / future)
├── package.json           # npm workspaces root
└── CLAUDE.md              # This file
```

**Root scripts:**

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start all workspaces in parallel |
| `npm run frontend:dev` | Frontend only |
| `npm run backend:dev` | Backend only |
| `npm run db:dev:up` | Start PostgreSQL via Docker |
| `npm run db:seed:demo` | Seed demo products/users |
| `npm run e2e:stack` | Backend + frontend for E2E tests |

**Never** import between `apps/frontend` and `apps/backend` directly — they communicate only via HTTP.

---

## 2. Frontend Architecture

### 2.1 Folder Map

```
apps/frontend/
├── app/                    # Next.js App Router: pages, layouts, API routes
│   ├── (admin)/            # Route group — admin-only routes
│   ├── (user)/             # Route group — authenticated user routes
│   ├── api/                # Next.js API routes (proxy bridge to backend)
│   ├── layout.tsx          # Root layout (providers, global setup)
│   └── page.tsx            # Home/catalog page
│
├── components/             # Atomic, reusable, stateless UI components
│   ├── Cart/
│   ├── CartItem/
│   ├── ContentCard/
│   ├── ProductCard/
│   └── ...
│
├── features/               # Domain features (client components, hooks, helpers)
│   ├── shop/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── helpers/
│   ├── favorites/
│   ├── recently-viewed/
│   ├── admin/
│   ├── footer/
│   ├── layout/
│   └── user/
│
├── store/                  # Global state — Context + useReducer
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   └── LocaleContext.tsx
│
├── providers/              # App-level provider wrappers
│   ├── CartProvider.tsx
│   ├── MuiThemeProvider.tsx
│   └── LocaleProvider.tsx
│
├── lib/                    # Utilities, API clients, i18n, services
│   ├── api/                # Typed backend request functions
│   ├── i18n/               # Translation system
│   ├── shop/               # Format utilities (currency, image src)
│   ├── recently-viewed/    # localStorage utilities
│   ├── footer/             # Footer section builders
│   └── constants.ts        # App-wide constants (APP_NAME, etc.)
│
├── types/                  # TypeScript types for API contracts
│   └── api/
│       ├── product.ts
│       ├── auth.ts
│       └── ...
│
└── styles/                 # Global SCSS: variables, mixins, reset
    ├── _variables.scss
    ├── _mixins.scss
    └── globals.scss
```

### 2.2 The Three Layers

This frontend follows a strict three-layer model:

```
Page (RSC, server)
  └── Feature (client, orchestrates)
        └── Atomic Component (presentation, pure)
```

- **Pages** (`app/`) are React Server Components. They fetch data, resolve locale, and pass everything as props to features.
- **Features** (`features/`) are `'use client'` components. They hold business logic via custom hooks and compose atomic components.
- **Atoms** (`components/`) are pure presentation components. They receive data via props and emit events via callbacks. No context access, no direct API calls.

---

## 3. Backend Architecture

```
apps/backend/src/
├── app.module.ts           # Root NestJS module
├── prisma/                 # @Global() PrismaService
├── auth/                   # JWT auth, OAuth, refresh tokens, password reset
│   ├── strategy/           # Passport strategies
│   ├── guard/              # JwtGuard, AdminGuard, AdminOrEmployeeGuard
│   └── decorator/          # @GetUser() decorator
├── wishlist/               # Saved-for-later (Module, Controller, Service, DTO)
├── product/                # Product CRUD + public listing
├── admin/                  # Admin user + product management
├── checkout/               # Stripe + PayPal checkout
├── user/                   # User profile management
├── bookmark/               # Bookmarks
└── types/                  # Shared NestJS DTOs
```

**Module structure (copy this for every new module):**

```
src/example/
├── example.module.ts
├── example.controller.ts
├── example.service.ts
└── dto/
    ├── index.ts
    ├── create-example.dto.ts
    └── update-example.dto.ts
```

Register every new module in `app.module.ts`.

---

## 4. How to Add a New Translation Key

Every user-visible string must be translated. Never hardcode strings in UI.

### Step 1 — Add to `dictionary.ts`

```ts
// apps/frontend/lib/i18n/dictionary.ts
export type Dictionary = {
  // ... existing keys ...
  readonly myNewFeatureTitle: string;
  readonly myNewFeatureAction: string;
};
```

### Step 2 — Add to all 5 locale files

Add the key to **every** locale file in the same relative position.

```ts
// apps/frontend/lib/i18n/locales/it.ts
  myNewFeatureTitle: 'Il mio titolo',
  myNewFeatureAction: 'Esegui azione',

// apps/frontend/lib/i18n/locales/en.ts
  myNewFeatureTitle: 'My title',
  myNewFeatureAction: 'Execute action',

// de.ts, fr.ts, es.ts — same pattern
```

### Step 3 — Use in components

**Client feature (receives `locale` as prop):**
```tsx
import { createTranslator } from '@/lib/i18n/translator';
const t = createTranslator(locale);
const label = t('myNewFeatureTitle');
```

**Client component (via context):**
```tsx
const { t } = useLocale();
```

**Server component:**
```tsx
const t = await getTranslator();
```

**With parameters** (use `{paramName}` in the string):
```tsx
// Dictionary: 'Ciao {name}, hai {count} articoli'
t('greeting', { name: 'Mario', count: 3 })
```

---

## 5. How to Create a New Atomic Component

Atomic components live in `apps/frontend/components/`. They are **pure UI**: no context, no API calls, no business logic.

### File Structure

```
components/MyComponent/
├── MyComponent.tsx
└── MyComponent.module.scss
```

### Component Template

```tsx
// components/MyComponent/MyComponent.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './MyComponent.module.scss';

type MyComponentProps = {
  readonly title: string;
  readonly description?: string;
  readonly onAction: () => void;
  readonly children?: React.ReactNode;
};

export function MyComponent({
  title,
  description,
  onAction,
  children,
}: Readonly<MyComponentProps>) {
  return (
    <Box className={styles.root} data-testid="my-component">
      <Typography variant="h6" className={styles.title}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" className={styles.description}>
          {description}
        </Typography>
      )}
      <Box className={styles.actions}>{children}</Box>
    </Box>
  );
}
```

### SCSS Module Template

```scss
// components/MyComponent/MyComponent.module.scss
.root {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.title {
  font-weight: 600 !important;
}

.description {
  color: var(--muted-foreground);
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

@media (min-width: 640px) {
  .root {
    padding: 1.5rem;
  }
}
```

### Rules for Atomic Components

- `Readonly<T>` wrapper on props type — always
- Named export: `export function MyComponent` — never default export
- No `useState` unless purely UI state (e.g., open/close)
- No `useContext` — receive data via props
- No async operations — receive data via props
- No hardcoded strings — receive labels via props
- Use `data-testid` on the root element

### Composing with ContentCard

The `ContentCard` + `ContentCardBody` atoms are the standard container for sidebar/preview panels:

```tsx
import { ContentCard, ContentCardBody } from '@/components/ContentCard';

<ContentCard variant="outlined" testId="my-panel" className={styles.card}>
  <ContentCardBody title={labels.title}>
    {/* content */}
  </ContentCardBody>
</ContentCard>
```

---

## 6. How to Create a New Feature

Features live in `apps/frontend/features/`. They are always `'use client'` and represent a complete user-facing domain area.

### File Structure

```
features/myFeature/
├── MyFeature.tsx                    # Root feature component
├── MyFeature.module.scss
├── hooks/
│   └── useMyFeature.ts              # Business logic hook
└── components/                      # Sub-components scoped to this feature (optional)
    ├── MyFeatureItem.tsx
    └── MyFeatureItem.module.scss
```

### Feature Component Template

```tsx
// features/myFeature/MyFeature.tsx
'use client';

import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { useMyFeature } from './hooks/useMyFeature';
import styles from './MyFeature.module.scss';

type MyFeatureProps = {
  readonly locale: Locale;
};

export function MyFeature({ locale }: Readonly<MyFeatureProps>) {
  const { items, isLoading, labels, handleAction } = useMyFeature(locale);

  if (isLoading) return null;

  return (
    <Box component="section" className={styles.section} data-testid="my-feature">
      {/* compose atoms */}
    </Box>
  );
}
```

### Feature Hook Template

```ts
// features/myFeature/hooks/useMyFeature.ts
import { useState, useCallback } from 'react';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { useCart } from '@/store/CartContext';

export function useMyFeature(locale: Locale) {
  const t = createTranslator(locale);
  const cart = useCart();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(async (id: string) => {
    // business logic
  }, [cart]);

  return {
    items,
    isLoading,
    handleAction,
    labels: {
      title: t('myFeatureTitle'),
      action: t('myFeatureAction'),
    },
  };
}
```

### Wiring a Feature into a Page

```tsx
// app/my-page/page.tsx
import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame/PublicPageFrame';
import { MyFeature } from '@/features/myFeature/MyFeature';

export const metadata: Metadata = { title: 'My Page' };

export default async function MyPage() {
  const locale = await getCurrentLocale();
  return (
    <PublicPageFrame>
      <MyFeature locale={locale} />
    </PublicPageFrame>
  );
}
```

### Rules for Features

- Always `'use client'` at top
- Accept `locale: Locale` as a prop
- All labels/strings via `createTranslator(locale)` inside the hook
- All business logic in the hook, not inline in JSX
- Compose atomic components — avoid raw MUI inline unless trivial
- `data-testid` on the section root

---

## 7. How to Add a New Backend Endpoint (Full-Stack)

Follow every step in order.

### Step 1 — Prisma model (if new resource)

```prisma
// apps/backend/prisma/schema.prisma
model MyResource {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  data      String
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("my_resources")
}
```

Create migration file manually:

```
apps/backend/prisma/migrations/YYYYMMDDHHMMSS_add_my_resource/migration.sql
```

```sql
CREATE TABLE IF NOT EXISTS "my_resources" (
  "id"         TEXT NOT NULL,
  "user_id"    TEXT NOT NULL,
  "data"       TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "my_resources_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "my_resources_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "my_resources_user_id_idx" ON "my_resources" ("user_id");
```

Run: `npx prisma migrate deploy` inside `apps/backend/`.

### Step 2 — DTO

```ts
// apps/backend/src/my-resource/dto/create-my-resource.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMyResourceDto {
  @IsString()
  @IsNotEmpty()
  data: string;
}
```

```ts
// apps/backend/src/my-resource/dto/index.ts
export { CreateMyResourceDto } from './create-my-resource.dto';
```

### Step 3 — Service

```ts
// apps/backend/src/my-resource/my-resource.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMyResourceDto } from './dto';

@Injectable()
export class MyResourceService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(userId: string) {
    return this.prisma.myResource.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateMyResourceDto) {
    return this.prisma.myResource.create({
      data: { userId, data: dto.data },
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    const entry = await this.prisma.myResource.findUnique({ where: { id } });
    if (!entry || entry.userId !== userId) throw new NotFoundException();
    await this.prisma.myResource.delete({ where: { id } });
  }
}
```

Use `prisma.upsert` instead of findUnique + ConflictException when the operation should be idempotent (e.g., wishlist add).

### Step 4 — Controller

```ts
// apps/backend/src/my-resource/my-resource.controller.ts
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MyResourceService } from './my-resource.service';
import { CreateMyResourceDto } from './dto';

@UseGuards(JwtGuard)
@Controller('my-resources')
export class MyResourceController {
  constructor(private readonly myResourceService: MyResourceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(@GetUser('id') userId: string) {
    return this.myResourceService.getAll(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser('id') userId: string, @Body() dto: CreateMyResourceDto) {
    return this.myResourceService.create(userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.myResourceService.delete(userId, id);
  }
}
```

### Step 5 — Module + Registration

```ts
// apps/backend/src/my-resource/my-resource.module.ts
import { Module } from '@nestjs/common';
import { MyResourceController } from './my-resource.controller';
import { MyResourceService } from './my-resource.service';

@Module({
  controllers: [MyResourceController],
  providers: [MyResourceService],
})
export class MyResourceModule {}
```

Add to `app.module.ts` imports array.

### Step 6 — Next.js API Route (bridge)

```ts
// apps/frontend/app/api/my-resources/route.ts
import { NextResponse } from 'next/server';
import { authenticatedBackendRequest } from '@/lib/api/backend';

export async function GET() {
  try {
    const data = await authenticatedBackendRequest('/my-resources');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await authenticatedBackendRequest('/my-resources', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
```

```ts
// apps/frontend/app/api/my-resources/[id]/route.ts
import { NextResponse } from 'next/server';
import { authenticatedBackendRequest } from '@/lib/api/backend';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await authenticatedBackendRequest(`/my-resources/${id}`, { method: 'DELETE' });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
```

### Step 7 — Frontend Context (if global state needed)

Follow the `WishlistContext.tsx` pattern:

```tsx
// store/MyResourceContext.tsx
'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

type MyResourceItem = { readonly id: string; readonly data: string };
type State = { readonly items: readonly MyResourceItem[]; readonly isLoaded: boolean };
type Action =
  | { type: 'LOAD'; items: MyResourceItem[] }
  | { type: 'ADD'; item: MyResourceItem }
  | { type: 'REMOVE'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return { items: action.items, isLoaded: true };
    case 'ADD':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    default:
      return state;
  }
}

type ContextValue = {
  readonly items: readonly MyResourceItem[];
  readonly isLoaded: boolean;
  readonly addItem: (data: string) => Promise<void>;
  readonly removeItem: (id: string) => Promise<void>;
};

const MyResourceContext = createContext<ContextValue | null>(null);

export function MyResourceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isLoaded: false });

  useEffect(() => {
    fetch('/api/my-resources')
      .then((r) => r.json())
      .then((items: MyResourceItem[]) => dispatch({ type: 'LOAD', items }))
      .catch(() => dispatch({ type: 'LOAD', items: [] }));
  }, []);

  const addItem = useCallback(async (data: string) => {
    const res = await fetch('/api/my-resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    const item: MyResourceItem = await res.json();
    dispatch({ type: 'ADD', item });
  }, []);

  const removeItem = useCallback(async (id: string) => {
    dispatch({ type: 'REMOVE', id });
    await fetch(`/api/my-resources/${id}`, { method: 'DELETE' });
  }, []);

  return (
    <MyResourceContext.Provider value={{ ...state, addItem, removeItem }}>
      {children}
    </MyResourceContext.Provider>
  );
}

export function useMyResource(): ContextValue {
  const ctx = useContext(MyResourceContext);
  if (!ctx) throw new Error('useMyResource must be used inside MyResourceProvider');
  return ctx;
}
```

Add `<MyResourceProvider>` to `app/layout.tsx` inside the existing provider chain.

---

## 8. How to Add a New Page (App Router)

### Public page

```tsx
// apps/frontend/app/my-page/page.tsx
import type { Metadata } from 'next';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame/PublicPageFrame';
import { MyFeature } from '@/features/myFeature/MyFeature';

export const metadata: Metadata = { title: 'My Page' };

export default async function MyPage() {
  const [locale, t] = await Promise.all([getCurrentLocale(), getTranslator()]);
  return (
    <PublicPageFrame>
      <MyFeature locale={locale} />
    </PublicPageFrame>
  );
}
```

### Protected user page

Place inside `app/(user)/` — the route group handles auth redirect via middleware.

### Protected admin page

Place inside `app/(admin)/dashboard/`.

### Pages with search params

```tsx
type PageProps = {
  readonly searchParams?: Promise<{ q?: string; category?: string }>;
};

export default async function MyPage({ searchParams }: Readonly<PageProps>) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? '';
  // ...
}
```

---

## 9. State Management

### Global State → Context + useReducer

Used for: cart, wishlist, locale.

**Rules:**
1. Define `State` and `Action` as readonly discriminated union types
2. Pure `reducer(state, action): State` — testable without React
3. Provider component owns `useReducer` + `useEffect` for side effects
4. Export a `use*` hook that throws if used outside provider
5. localStorage sync goes in `useEffect` inside the Provider (see CartProvider)

**Access in features:**
```tsx
const { items, addItem, removeItem } = useWishlist();
const { items: cartItems, totalInCents } = useCart();
const { locale, t } = useLocale();
```

### Local State → useState / useReducer in hook

For state belonging to one feature (draft quantities, form state, active filters).

### Server State → Props from RSC

Data fetched server-side is passed as props to client features. Never re-fetch on the client what the server already provided unless real-time updates are needed.

---

## 10. API Layer Conventions

All API calls go through typed functions in `apps/frontend/lib/api/`. Never write raw `fetch()` directly in components or features.

### Core Functions

**Unauthenticated (server-side):**
```ts
import { backendRequest } from '@/lib/api/backend';
const products = await backendRequest<BackendProduct[]>('/products/public');
```

**Authenticated (server-side — RSC or Next.js API route):**
```ts
import { authenticatedBackendRequest } from '@/lib/api/backend';
const wishlist = await authenticatedBackendRequest('/wishlists');
```

**Client-side (via Next.js API routes only):**
```ts
const res = await fetch('/api/my-resources');
const data = await res.json();
```

### Domain Modules

Create one module per resource in `lib/api/`:

```ts
// lib/api/myResource.ts
import { backendRequest } from './backend';

export async function listMyResources(): Promise<MyResource[]> {
  return backendRequest('/my-resources');
}
```

### Error Handling

```ts
try {
  const data = await backendRequest('/endpoint');
} catch (error: unknown) {
  if (error instanceof BackendRequestError) {
    if (error.status === 401) { /* handle auth */ }
    if (error.status === 400) { /* handle validation */ }
  }
}
```

### Caching / Revalidation (server-side fetches)

```ts
listPublicProducts({ revalidate: 60 })      // ISR: revalidate every 60s
getPublicProduct(id, { cache: 'no-store' }) // always fresh
```

---

## 11. i18n Conventions

- Supported locales: `it` (default), `en`, `de`, `fr`, `es`
- Dictionary type: `lib/i18n/dictionary.ts` — **add new keys here first**
- Every key must exist in all 5 locale files
- Keys: camelCase, grouped by prefix — `cart*`, `checkout*`, `product*`, `wishlist*`
- Parameters: `{paramName}` in strings — `"Ciao {name}"`
- Never pass untranslated strings to UI components

---

## 12. TypeScript Conventions

### Props — always Readonly

```tsx
type Props = Readonly<{
  title: string;
  items: readonly Item[];
  onSelect: (id: string) => void;
}>;
```

### No `any`

- Use `unknown` for external data, then narrow with `instanceof` or type guards
- Use generics for reusable utilities

### Immutability

```ts
// WRONG — mutation
state.items.push(newItem);

// CORRECT — new object
return { ...state, items: [...state.items, newItem] };
```

### ViewModel Pattern

Transform domain types to UI ViewModels via pure helper functions:

```ts
// features/shop/helpers/mapCartItems.ts
type CartItemViewModel = {
  readonly productId: string;
  readonly title: string;
  readonly imageSrc: string;       // pre-resolved URL
  readonly unitPriceLabel: string; // pre-formatted "€12,50"
  readonly lineTotalLabel: string;
};

export function mapCartItemsToViewModels(items, options): CartItemViewModel[] { ... }
```

### Named Exports

Always `export function` or `export type` — never `export default` for components.

---

## 13. SCSS / Styling Conventions

### Every component gets its own `.module.scss`

No exceptions.

### CSS Variables for Colors

```scss
.root {
  background-color: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
}

.muted { color: var(--muted-foreground); }
.danger:hover { color: var(--destructive); }
```

Available tokens: `--primary`, `--primary-foreground`, `--secondary`, `--background`, `--card`, `--border`, `--foreground`, `--muted`, `--muted-foreground`, `--destructive`

### Responsive Breakpoints

```scss
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 1024px) { /* md */ }
@media (min-width: 1280px) { /* lg */ }
```

### Common Layout Patterns

```scss
// Flex column list
.list { display: flex; flex-direction: column; gap: 0.75rem; }

// Item row: image + content + action
.item { display: grid; grid-template-columns: 64px 1fr auto; align-items: center; gap: 0.75rem; }

// 2-column image grid (for RecentlyViewed / Favorites preview)
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }

// Sidebar card (1/3 of max 80rem)
.card { max-width: calc(80rem / 3); }
.section { width: 100%; max-width: 80rem; margin: 0 auto; padding: 1.5rem 1rem 0; display: flex; justify-content: flex-start; }
```

### MUI Overrides

```scss
.btn {
  font-size: 0.75rem !important;
  text-transform: none !important;
}
```

---

## 14. Authentication Pattern

### How It Works

1. User signs in → backend sets `access_token` (15 min) + `refresh_token` (7 days) as HTTP-only cookies
2. Next.js API routes read tokens server-side via `authenticatedBackendRequest()`
3. Client components **never** touch tokens directly

### Protecting a Backend Route

```ts
@UseGuards(JwtGuard)
@Controller('my-route')
export class MyController {
  @Get()
  getData(@GetUser('id') userId: string) { ... }
}
```

Admin only: `@UseGuards(JwtGuard, AdminGuard)`
Admin or employee: `@UseGuards(JwtGuard, AdminOrEmployeeGuard)`

### Protecting a Next.js API Route

```ts
// Always use authenticatedBackendRequest, never backendRequest, for protected resources
const data = await authenticatedBackendRequest('/protected-endpoint');
```

---

## 15. Checklist for Every New Feature

### Backend
- [ ] Prisma model added to `schema.prisma`
- [ ] Migration SQL file created in `prisma/migrations/` with timestamp name
- [ ] DTO with class-validator decorators
- [ ] Service uses `upsert` for idempotent operations
- [ ] Controller uses `@UseGuards(JwtGuard)` and `@GetUser('id')`
- [ ] Module registered in `app.module.ts`

### Frontend API Bridge
- [ ] Next.js API route in `app/api/`
- [ ] Uses `authenticatedBackendRequest` for protected endpoints
- [ ] Error cases return correct HTTP status codes

### Frontend State (if global)
- [ ] Context in `store/` with pure reducer
- [ ] Provider added to `app/layout.tsx`
- [ ] `use*` hook exported with null-check guard

### Frontend Feature
- [ ] Folder in `features/` with `Feature.tsx` + `Feature.module.scss`
- [ ] `'use client'` at top
- [ ] Business logic isolated in `hooks/useMyFeature.ts`
- [ ] Accepts `locale: Locale` as prop
- [ ] Zero hardcoded strings — all via `createTranslator(locale)`
- [ ] `data-testid` on root element

### Translation
- [ ] Keys added to `lib/i18n/dictionary.ts`
- [ ] All 5 locale files updated: `it`, `en`, `de`, `fr`, `es`

### Atomic Component (if new)
- [ ] Lives in `components/MyComponent/`
- [ ] `Readonly<T>` on props type
- [ ] No context, no API calls
- [ ] Named export
- [ ] SCSS module alongside `.tsx`
- [ ] CSS variables for colors

### TypeScript
- [ ] No `any`
- [ ] Props are `readonly`
- [ ] ViewModels used for formatted/derived UI data

---

## Quick Reference

| What | Where |
|------|-------|
| All translation keys (type) | `apps/frontend/lib/i18n/dictionary.ts` |
| Italian translations | `apps/frontend/lib/i18n/locales/it.ts` |
| Backend request functions | `apps/frontend/lib/api/backend.ts` |
| Product API functions | `apps/frontend/lib/api/products.ts` |
| Auth API functions | `apps/frontend/lib/api/auth.ts` |
| Currency / image formatting | `apps/frontend/lib/shop/format.ts` |
| Cart global state | `apps/frontend/store/CartContext.tsx` |
| Wishlist global state | `apps/frontend/store/WishlistContext.tsx` |
| Locale global state | `apps/frontend/store/LocaleContext.tsx` |
| App root layout | `apps/frontend/app/layout.tsx` |
| Home page | `apps/frontend/app/page.tsx` |
| Prisma schema | `apps/backend/prisma/schema.prisma` |
| NestJS root module | `apps/backend/src/app.module.ts` |
| JWT Guard | `apps/backend/src/auth/guard/` |
| GetUser decorator | `apps/backend/src/auth/decorator/` |

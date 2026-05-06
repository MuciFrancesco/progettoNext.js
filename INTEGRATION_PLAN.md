# Thinkshop Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the Amazon-like `/thinkshop` product detail, gallery, cart, reviews, and order behavior into `apps/frontend` and `apps/backend` without mass copy-paste.

**Architecture:** Treat `/thinkshop` as a design and behavior source, not as production code. Backend owns product retail data, reviews, image gallery, features, specifications, stock, order totals, and role enforcement. Frontend consumes typed APIs and rebuilds the UI with MUI components plus SCSS Modules inside the existing `features/`, `components/`, `lib/`, and `types/` structure.

**Tech Stack:** Next.js 16, React 19, MUI v9, SCSS Modules, Nest.js 11, Prisma 7, PostgreSQL, class-validator, Jest, Vitest, Playwright, Graphify.

---

## Approved Product Decisions

- Reviews are real authenticated-user reviews.
- Reviews publish immediately as `PUBLISHED`.
- Any authenticated user can review any product.
- `isVerifiedPurchase` is computed by the backend from real order history.
- Each user can have one review per product, editable.
- Product features and technical specifications stay separate, Amazon-style.
- Technical specifications use flexible key/value records.
- Gallery moves to `ProductImage` with `url`, `altText`, `sortOrder`, `isPrimary`.
- Orders become real multi-product orders: `Order` plus `OrderItem`.

## Source Mapping From `/thinkshop`

- `thinkshop/lib/types.ts`: source shape for `Product`, `Order`, `CartItem`, review aggregates, features, specs.
- `thinkshop/lib/data.ts`: hardcoded product data to convert into seed/demo data and Prisma relations.
- `thinkshop/components/templates/ProductTemplate.tsx`: target product detail layout.
- `thinkshop/components/organisms/ProductGallery.tsx`: target gallery behavior.
- `thinkshop/components/organisms/BuyBox.tsx`: target purchase box behavior.
- `thinkshop/components/molecules/ProductCard.tsx`: target catalog card behavior.
- `thinkshop/components/templates/OrdersTemplate.tsx`: target multi-item order history behavior.

## Current System Anchors

- `apps/backend/prisma/schema.prisma`: current `Product` has minimal fields and `Order` is one product per order.
- `apps/backend/src/product/product.service.ts`: public list/status API.
- `apps/backend/src/product/product.controller.ts`: public product endpoints.
- `apps/backend/src/admin/admin.controller.ts`: Admin/Employee product guards already exist.
- `apps/backend/src/checkout/checkout.service.ts`: stock and checkout validation.
- `apps/frontend/types/api/product.ts`: frontend product API contract.
- `apps/frontend/lib/api/products.ts`: public product client.
- `apps/frontend/components/ProductCatalog/ProductCatalog.tsx`: current catalog UI already uses MUI and SCSS Modules.
- `apps/frontend/features/admin/*`: existing admin product add/update workflows.

---

## Task 1: Prisma Retail Product Model

**Files:**
- Modify: `apps/backend/prisma/schema.prisma`
- Create: `apps/backend/prisma/migrations/<timestamp>_thinkshop_retail_model/migration.sql`
- Modify: `apps/backend/scripts/seed-demo-data.mjs`
- Test: `apps/backend/src/product/product.service.spec.ts`

- [ ] **Step 1: Add failing backend service tests for product detail shape**

Create `apps/backend/src/product/product.service.spec.ts` with tests that assert `ProductService.getProductById()` returns product gallery, features, specifications, and review aggregates.

```ts
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';

describe('ProductService retail detail', () => {
  const product = {
    id: 'product-1',
    title: 'Wireless Headphones',
    name: 'Noise Cancelling Pro',
    description: 'Premium headphones',
    brand: 'SoundCore',
    priceInCents: 21990,
    originalPriceInCents: 31990,
    imagePath: '/uploads/headphones.jpg',
    imagePaths: ['/uploads/headphones.jpg'],
    category: 'TECHNOLOGY',
    stockQuantity: 7,
    isAvailableForPurchase: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    images: [{ id: 'img-1', url: '/uploads/headphones.jpg', altText: 'Headphones front', sortOrder: 0, isPrimary: true }],
    features: [{ id: 'feat-1', text: 'Active noise cancelling', sortOrder: 0 }],
    specifications: [{ id: 'spec-1', label: 'Connectivity', value: 'Bluetooth 5.3', sortOrder: 0 }],
    reviews: [{ rating: 5 }, { rating: 4 }],
  };

  function serviceWithProduct(result: unknown) {
    return new ProductService({
      product: {
        findUnique: jest.fn().mockResolvedValue(result),
      },
      productReview: {
        aggregate: jest.fn().mockResolvedValue({ _avg: { rating: 4.5 }, _count: { rating: 2 } }),
      },
    } as never);
  }

  it('returns a retail product detail with ordered relations and review aggregates', async () => {
    const service = serviceWithProduct(product);
    await expect(service.getProductById('product-1')).resolves.toMatchObject({
      id: 'product-1',
      brand: 'SoundCore',
      originalPriceInCents: 31990,
      averageRating: 4.5,
      reviewCount: 2,
      images: [{ url: '/uploads/headphones.jpg', isPrimary: true }],
      features: [{ text: 'Active noise cancelling' }],
      specifications: [{ label: 'Connectivity', value: 'Bluetooth 5.3' }],
    });
  });

  it('throws NotFoundException for missing products', async () => {
    const service = serviceWithProduct(null);
    await expect(service.getProductById('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
```

- [ ] **Step 2: Run the failing test**

Run: `npm test -w apps/backend -- product.service.spec.ts`

Expected: FAIL because `getProductById` and new Prisma fields do not exist yet.

- [ ] **Step 3: Extend Prisma schema**

Add these models and relations to `apps/backend/prisma/schema.prisma`.

```prisma
enum ReviewStatus {
  PUBLISHED
  HIDDEN
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  RETURN_REQUESTED
  CANCELLED
}

model Product {
  id          String   @id @default(uuid())
  title       String
  name        String
  description String
  brand       String?  @db.VarChar(120)
  category    ProductCategory @default(OTHER)
  priceInCents Int @default(0)
  originalPriceInCents Int? @map("original_price_in_cents")
  imagePath   String
  imagePaths  String[] @default([])
  stockQuantity Int @default(0) @map("stock_quantity")
  isAvailableForPurchase Boolean @default(true)
  orders OrderItem[]
  reviews ProductReview[]
  images ProductImage[]
  features ProductFeature[]
  specifications ProductSpecification[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  downloadVerifications DownloadVerification[]

  @@index([title])
  @@index([name])
  @@index([imagePath])
  @@index([category])
  @@index([brand])
  @@map("products")
}

model ProductImage {
  id        String  @id @default(uuid())
  productId String  @map("product_id")
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  altText   String? @map("alt_text")
  sortOrder Int     @default(0) @map("sort_order")
  isPrimary Boolean @default(false) @map("is_primary")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([productId, sortOrder])
  @@map("product_images")
}

model ProductFeature {
  id        String  @id @default(uuid())
  productId String  @map("product_id")
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  text      String  @db.VarChar(500)
  sortOrder Int     @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([productId, sortOrder])
  @@map("product_features")
}

model ProductSpecification {
  id        String  @id @default(uuid())
  productId String  @map("product_id")
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  label     String  @db.VarChar(120)
  value     String  @db.VarChar(500)
  sortOrder Int     @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([productId, sortOrder])
  @@map("product_specifications")
}

model ProductReview {
  id        String  @id @default(uuid())
  productId String  @map("product_id")
  userId    String  @map("user_id")
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  rating    Int
  title     String  @db.VarChar(120)
  body      String  @db.VarChar(5000)
  status    ReviewStatus @default(PUBLISHED)
  isVerifiedPurchase Boolean @default(false) @map("is_verified_purchase")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([userId, productId])
  @@index([productId, status])
  @@map("product_reviews")
}

model Order {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  status      OrderStatus @default(PAID)
  totalPriceInCents Int @map("total_price_in_cents")
  trackingCode String? @map("tracking_code")
  items       OrderItem[]
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([userId, createdAt])
  @@map("orders")
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String   @map("order_id")
  productId   String   @map("product_id")
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  quantity    Int
  unitPriceInCents Int @map("unit_price_in_cents")
  lineTotalInCents Int @map("line_total_in_cents")
  productTitleSnapshot String @map("product_title_snapshot")
  productImageSnapshot String? @map("product_image_snapshot")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}
```

Also add `reviews ProductReview[]` to `User`.

- [ ] **Step 4: Generate and apply migration**

Run: `npm run db:dev:migrate -w apps/backend -- --name thinkshop_retail_model`

Expected: migration succeeds and Prisma Client regenerates.

- [ ] **Step 5: Implement product detail query**

Modify `apps/backend/src/product/product.service.ts` to add `getProductById(id: string)` using:

```ts
const product = await this.prisma.product.findUnique({
  where: { id },
  include: {
    images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
    features: { orderBy: { sortOrder: 'asc' } },
    specifications: { orderBy: { sortOrder: 'asc' } },
  },
});
```

Aggregate reviews with:

```ts
const reviews = await this.prisma.productReview.aggregate({
  where: { productId: id, status: 'PUBLISHED' },
  _avg: { rating: true },
  _count: { rating: true },
});
```

Return `averageRating: reviews._avg.rating ?? 0` and `reviewCount: reviews._count.rating`.

- [ ] **Step 6: Run backend test**

Run: `npm test -w apps/backend -- product.service.spec.ts`

Expected: PASS.

- [ ] **Step 7: Update Graphify**

Run: `graphify update .`

Expected: graph updates without errors.

- [ ] **Step 8: Checkpoint**

Run `/compact` in the chat before starting Task 2.

---

## Task 2: Public Product Detail and Review APIs

**Files:**
- Modify: `apps/backend/src/product/product.controller.ts`
- Create: `apps/backend/src/product/dto/create-product-review.dto.ts`
- Create: `apps/backend/src/product/dto/update-product-review.dto.ts`
- Modify: `apps/backend/src/product/product.service.ts`
- Test: `apps/backend/src/product/product-review.service.spec.ts`

- [ ] **Step 1: Write review service tests**

Create tests for:

- authenticated user creates a `PUBLISHED` review
- duplicate create is rejected with `ConflictException`
- `isVerifiedPurchase` becomes true when an `OrderItem` exists for same user/product
- user can update own review
- public list returns only `PUBLISHED` reviews

Run: `npm test -w apps/backend -- product-review.service.spec.ts`

Expected: FAIL because endpoints and DTOs do not exist.

- [ ] **Step 2: Add DTOs**

`create-product-review.dto.ts`:

```ts
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateProductReviewDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  body!: string;
}
```

`update-product-review.dto.ts`:

```ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateProductReviewDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @MaxLength(120)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(5000)
  @IsOptional()
  body?: string;
}
```

- [ ] **Step 3: Add service methods**

Add methods:

- `listProductReviews(productId: string)`
- `createProductReview(productId: string, userId: string, dto: CreateProductReviewDto)`
- `updateMyProductReview(productId: string, userId: string, dto: UpdateProductReviewDto)`
- `hideProductReview(reviewId: string)`

Compute verified purchase with:

```ts
const verified = await this.prisma.orderItem.findFirst({
  where: {
    productId,
    order: { userId, status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
  },
  select: { id: true },
});
```

- [ ] **Step 4: Add controller routes**

Add to `ProductController`:

- `GET /products/:productId`
- `GET /products/:productId/reviews`
- `POST /products/:productId/reviews` guarded by `JwtGuard`
- `PATCH /products/:productId/reviews/me` guarded by `JwtGuard`

Add moderation route to `AdminController`:

- `PATCH /admin/reviews/:reviewId/hide` guarded by `AdminGuard`

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -w apps/backend -- product.service.spec.ts product-review.service.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Update Graphify and compact**

Run: `graphify update .`

Run `/compact`.

---

## Task 3: Multi-Product Checkout and Orders

**Files:**
- Modify: `apps/backend/src/checkout/checkout.service.ts`
- Modify: `apps/backend/src/admin/admin.service.ts`
- Modify: `apps/backend/src/user/user.controller.ts`
- Modify: `apps/frontend/types/api/order.ts`
- Test: `apps/backend/src/checkout/checkout.service.spec.ts`

- [ ] **Step 1: Write checkout tests**

Add tests that call `captureOrder(userId, items)` with two products and assert:

- one `Order` is created
- two `OrderItem` rows are created
- stock decrements per item
- total equals sum of line totals
- product snapshots are stored

Run: `npm test -w apps/backend -- checkout.service.spec.ts`

Expected: FAIL because `captureOrder` currently creates one order per product.

- [ ] **Step 2: Update `captureOrder`**

Inside the transaction:

1. decrement stock for every validated item
2. create one `Order`
3. create `OrderItem` rows with quantity, unit price, line total, title snapshot, image snapshot

The returned shape must be:

```ts
{
  order: { id: string; totalPriceInCents: number; createdAt: Date },
  totalInCents: number
}
```

- [ ] **Step 3: Update admin/user order queries**

Admin orders should include:

```ts
items: {
  select: {
    id: true,
    quantity: true,
    unitPriceInCents: true,
    lineTotalInCents: true,
    productTitleSnapshot: true,
    productImageSnapshot: true,
    product: { select: { id: true, title: true, imagePath: true, imagePaths: true } },
  },
}
```

User orders should use the same item shape but filter by current `userId`.

- [ ] **Step 4: Run backend tests**

Run: `npm test -w apps/backend -- checkout.service.spec.ts`

Expected: PASS.

- [ ] **Step 5: Update Graphify and compact**

Run: `graphify update .`

Run `/compact`.

---

## Task 4: Admin Product DTOs for Retail Data

**Files:**
- Modify: `apps/backend/src/admin/dto/create-product.dto.ts`
- Modify: `apps/backend/src/admin/dto/update-product.dto.ts`
- Modify: `apps/backend/src/admin/admin.service.ts`
- Modify: `apps/frontend/types/api/product.ts`
- Modify: `apps/frontend/lib/api/admin.ts`
- Test: `apps/backend/src/admin/admin.service.spec.ts`

- [ ] **Step 1: Write admin product tests**

Test creating and updating products with:

- `brand`
- `originalPriceInCents`
- `images`
- `features`
- `specifications`

Run: `npm test -w apps/backend -- admin.service.spec.ts`

Expected: FAIL.

- [ ] **Step 2: Add nested DTO types**

Use class-validator nested objects:

```ts
class ProductImageInputDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url!: string;

  @IsString()
  @MaxLength(180)
  @IsOptional()
  altText?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder!: number;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
```

Create equivalent DTOs for feature text and specification label/value.

- [ ] **Step 3: Update AdminService writes**

For create:

- create `Product`
- nested create `images`, `features`, `specifications`
- set `imagePath` to the primary image URL or first image URL
- set legacy `imagePaths` to all image URLs during migration compatibility

For update:

- update scalar fields
- if nested arrays are supplied, delete existing related rows for that product and recreate them inside one transaction

- [ ] **Step 4: Update frontend API types**

Extend `BackendProduct` with:

```ts
readonly brand: string | null;
readonly originalPriceInCents: number | null;
readonly averageRating?: number;
readonly reviewCount?: number;
readonly images: readonly ProductImage[];
readonly features: readonly ProductFeature[];
readonly specifications: readonly ProductSpecification[];
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -w apps/backend -- admin.service.spec.ts
npm run test:unit -w apps/frontend
```

Expected: PASS.

- [ ] **Step 6: Update Graphify and compact**

Run: `graphify update .`

Run `/compact`.

---

## Task 5: Frontend Product Detail Feature

**Files:**
- Create: `apps/frontend/app/product/[id]/page.tsx`
- Create: `apps/frontend/features/shop/components/ProductDetailFeature/ProductDetailFeature.tsx`
- Create: `apps/frontend/features/shop/components/ProductDetailFeature/ProductDetailFeature.module.scss`
- Create: `apps/frontend/features/shop/hooks/useProductReviews.ts`
- Create: `apps/frontend/lib/api/reviews.ts`
- Modify: `apps/frontend/lib/api/products.ts`
- Modify: `apps/frontend/components/ProductCatalog/ProductCatalog.tsx`
- Test: `apps/frontend/features/shop/hooks/useProductReviews.spec.ts`

- [ ] **Step 1: Write hook tests**

Test:

- unauthenticated users see review list but submit is blocked by API route/session
- authenticated submit posts review
- update changes the current user's review
- published reviews refresh after submit/update

Run: `npm run test:unit -w apps/frontend -- useProductReviews.spec.ts`

Expected: FAIL.

- [ ] **Step 2: Add product detail API client**

Add:

```ts
export async function getPublicProduct(productId: string, params?: { cache?: RequestCache }) {
  return backendRequest<BackendProduct>(`/products/${productId}`, undefined, 'Request failed', {
    cache: params?.cache,
  });
}
```

- [ ] **Step 3: Build MUI detail UI**

Implement `ProductDetailFeature` using only MUI primitives for native structure:

- `Box` for `main`, `section`, `article`, gallery frames
- `Stack` for layout groups
- `Typography` for text
- `Button`, `IconButton`, `Select`, `MenuItem` for actions and quantity
- `Table`, `TableBody`, `TableRow`, `TableCell` for specifications
- `Rating` for rating display and review input

Use SCSS Module classes for all styling. Do not use `sx={{}}` for layout or color styling.

- [ ] **Step 4: Wire catalog cards to detail pages**

Make product cards link to `/product/${product.id}` while preserving add-to-cart behavior.

- [ ] **Step 5: Run frontend tests and build**

Run:

```powershell
npm run test:unit -w apps/frontend
npm run build -w apps/frontend
```

Expected: PASS.

- [ ] **Step 6: Update Graphify and compact**

Run: `graphify update .`

Run `/compact`.

---

## Task 6: Frontend Admin Product Retail Editing

**Files:**
- Modify: `apps/frontend/features/admin/ui/add-product/AddProductForm.tsx`
- Modify: `apps/frontend/features/admin/ui/add-product/AddProductForm.module.scss`
- Modify: `apps/frontend/features/admin/ui/update-product/UpdateProduct.tsx`
- Modify: `apps/frontend/features/admin/ui/update-product/UpdateProduct.module.scss`
- Modify: `apps/frontend/features/admin/hooks/useAdminAddProductForm.ts`
- Modify: `apps/frontend/features/admin/hooks/useAdminUpdateProductsTable.ts`
- Test: `apps/frontend/features/admin/hooks/useAdminAddProductForm.spec.ts`
- Test: `apps/frontend/features/admin/hooks/useAdminUpdateProductsTable.spec.ts`

- [ ] **Step 1: Write admin hook tests**

Add tests for:

- adding/removing/reordering images
- exactly one primary image after changes
- adding/removing features
- adding/removing specifications
- payload includes `brand` and `originalPriceInCents`

Run:

```powershell
npm run test:unit -w apps/frontend -- useAdminAddProductForm.spec.ts useAdminUpdateProductsTable.spec.ts
```

Expected: FAIL.

- [ ] **Step 2: Extend admin forms**

Add MUI controls:

- `TextField` for brand
- `TextField type="number"` for original price cents or euro input converted to cents
- gallery manager with primary toggle
- feature repeater
- specification key/value repeater

Use SCSS Modules for layout. Avoid native `div`, `p`, `button` in new UI.

- [ ] **Step 3: Preserve RBAC**

Do not create new frontend-only permission checks for product write access. Keep page/session guards:

- `requireAdminOrEmployeeSession()` for product add/update pages
- backend `AdminOrEmployeeGuard` for product write endpoints

- [ ] **Step 4: Run tests and build**

Run:

```powershell
npm run test:unit -w apps/frontend
npm run build -w apps/frontend
```

Expected: PASS.

- [ ] **Step 5: Update Graphify and compact**

Run: `graphify update .`

Run `/compact`.

---

## Task 7: Thinkshop Visual Migration Cleanup

**Files:**
- Inspect only: `thinkshop/app/globals.css`
- Create or modify SCSS Modules under `apps/frontend/features/shop/components/ProductDetailFeature/`
- Modify: `apps/frontend/components/ProductCatalog/ProductCatalog.module.scss`

- [ ] **Step 1: Extract design tokens**

Map `thinkshop` visual intent into existing SCSS token usage:

- gold action color maps to existing theme primary/secondary button variants
- indigo action color maps to existing MUI theme secondary action
- product cards keep 8px max border radius unless current design system says otherwise
- no inline styles from `/thinkshop` are copied

- [ ] **Step 2: Run static scans**

Run:

```powershell
rg "className=\"|style=\\{\\{|<div|<p|<button|<main|<section|<article" apps/frontend/features/shop apps/frontend/components/ProductCatalog
```

Expected: existing legacy matches may remain outside touched files; new `ProductDetailFeature` must not contain native layout tags or inline styles.

- [ ] **Step 3: Run frontend build**

Run: `npm run build -w apps/frontend`

Expected: PASS.

- [ ] **Step 4: Update Graphify and compact**

Run: `graphify update .`

Run `/compact`.

---

## Task 8: Security and OWASP Verification

**Files:**
- Modify as needed: `apps/backend/src/product/product.service.ts`
- Modify as needed: `apps/backend/src/admin/admin.controller.ts`
- Modify as needed: `apps/frontend/features/shop/components/ProductDetailFeature/ProductDetailFeature.tsx`
- Test: backend and frontend suites

- [ ] **Step 1: Verify backend trust boundaries**

Confirm in code:

- review `userId` always comes from `GetUser('id')`
- review `status` defaults to `PUBLISHED` server-side
- review `isVerifiedPurchase` is server-computed
- product write endpoints remain guarded by `AdminOrEmployeeGuard`
- review moderation is guarded by `AdminGuard`
- public review list filters `status: PUBLISHED`
- no endpoint accepts `isVerifiedPurchase`, `userId`, or `status` from user review payloads

- [ ] **Step 2: Verify output rendering**

Confirm frontend renders user/product text as React text nodes, not `dangerouslySetInnerHTML`.

Run:

```powershell
rg "dangerouslySetInnerHTML|innerHTML|insertAdjacentHTML" apps/frontend apps/backend
```

Expected: no new usage in touched product/review files.

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm run test:unit
npm run build
```

Expected: PASS.

- [ ] **Step 4: Update Graphify**

Run: `graphify update .`

Expected: PASS.

---

## Execution Notes

- Do not copy `/thinkshop` components directly into production.
- Use `/thinkshop` only to transfer behavior, layout intent, and data requirements.
- Keep every new frontend UI piece MUI plus SCSS Modules.
- Prefer backend-calculated facts over frontend-supplied values.
- After each task, run `/compact` as requested before continuing.
- Keep commits task-sized if committing during execution.

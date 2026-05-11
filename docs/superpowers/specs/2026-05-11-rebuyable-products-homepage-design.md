# Rebuyable Products Homepage Box Design

## Goal

Show a personalized homepage box for products the signed-in user has already purchased and may reasonably buy again, such as pencils, pens, nasal spray, or other everyday consumables. The box appears only when at least four previously purchased products are marked as rebuyable.

## Data Model

Add a product-level boolean field:

```prisma
isRebuyable Boolean @default(false) @map("is_rebuyable")
```

This field belongs to `Product` because rebuyability is an editorial/catalog attribute, not an order attribute. A product can be marked rebuyable once and then reused wherever product data is returned.

The field must be exposed through:

- Prisma migration SQL for the `products` table.
- Backend product selects that feed the admin/product/order APIs.
- Frontend product API types, including `BackendProduct` and `BackendOrderProduct`.

## Data Flow

Use the existing authenticated user orders flow:

1. Homepage renders a client feature, `RebuyableProductsFeature`.
2. The feature loads the user's orders through the existing user orders action/API path.
3. The feature flattens order items into products.
4. It filters products where `product.isRebuyable === true`.
5. It deduplicates by `product.id`, preserving newest-order priority from the order response.
6. It displays the first four products.
7. If fewer than four rebuyable purchased products exist, the feature renders `null`.

This keeps the feature tied to real purchase history and avoids showing generic catalog products.

## UI

The new feature lives in:

```text
apps/frontend/features/rebuyable/RebuyableProductsFeature.tsx
apps/frontend/features/rebuyable/RebuyableProductsFeature.module.scss
```

It follows the same visual pattern as `RecentlyViewedFeature` and `FavoritesFeature`:

- Client component.
- Accepts `locale: Locale`.
- Uses `ContentCard` and `ContentCardBody`.
- Uses a 2x2 image grid with links to product detail pages.
- Uses translated title text, for example `rebuyableProductsTitle`.
- Shows at most four products.

## Homepage Layout

The homepage wraps these three optional boxes in one flex container:

- Recently viewed.
- Favorites.
- Rebuyable products.

The layout should let visible boxes share the available row width:

- Three boxes visible: each uses roughly one third of the max content width.
- Two boxes visible: each expands to roughly half of the row.
- One box visible: it expands cleanly within the row.
- Mobile: boxes stack vertically.

The feature components should not each impose their own independent `max-width: 80rem` section behavior that prevents them from aligning as siblings. Shared row behavior belongs to the homepage or a small shared class pattern.

## Empty and Auth States

If the user is not signed in, the orders request should fail gracefully and the rebuyable box should not render.

If the user has no orders, no rebuyable purchased products, or fewer than four qualifying products, the box should not render.

Favorites and recently viewed must keep their current behavior.

## Admin/Product Editing

The `isRebuyable` field must be editable through the existing admin product create/update flows because those flows already manage product catalog attributes. It should default to `false` so existing products are not shown accidentally.

Seed/demo data may mark a small set of everyday products as rebuyable so the feature can be demonstrated locally.

## Testing

Use TDD for production code changes.

Backend tests should cover at least:

- Product/order selects expose `isRebuyable` for purchased products.
- Product creation/update can persist `isRebuyable` through the admin product flows.

Frontend tests should cover at least:

- The rebuyable mapper returns four unique purchased products marked `isRebuyable`.
- It ignores non-rebuyable products.
- It returns no renderable result when fewer than four products qualify.

Verification should include typecheck/tests for touched frontend and backend workspaces, then `graphify update .` after code modifications.

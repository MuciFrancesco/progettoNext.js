-- Migration: 20260505120000_thinkshop_retail_model
-- Adds Amazon-like retail product data, authenticated reviews, image galleries,
-- flexible product specifications, and real multi-product order items.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReviewStatus') THEN
    CREATE TYPE "ReviewStatus" AS ENUM ('PUBLISHED', 'HIDDEN');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
    CREATE TYPE "OrderStatus" AS ENUM (
      'PENDING',
      'PAID',
      'SHIPPED',
      'DELIVERED',
      'RETURN_REQUESTED',
      'CANCELLED'
    );
  END IF;
END $$;

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "brand" VARCHAR(120),
  ADD COLUMN IF NOT EXISTS "original_price_in_cents" INTEGER;

CREATE INDEX IF NOT EXISTS "products_brand_idx" ON "products" ("brand");

CREATE TABLE IF NOT EXISTS "product_images" (
  "id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "alt_text" VARCHAR(180),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "product_images_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_images_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "product_images_product_id_sort_order_idx"
  ON "product_images" ("product_id", "sort_order");

CREATE TABLE IF NOT EXISTS "product_features" (
  "id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "text" VARCHAR(500) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "product_features_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_features_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "product_features_product_id_sort_order_idx"
  ON "product_features" ("product_id", "sort_order");

CREATE TABLE IF NOT EXISTS "product_specifications" (
  "id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "label" VARCHAR(120) NOT NULL,
  "value" VARCHAR(500) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_specifications_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "product_specifications_product_id_sort_order_idx"
  ON "product_specifications" ("product_id", "sort_order");

CREATE TABLE IF NOT EXISTS "product_reviews" (
  "id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "body" VARCHAR(5000) NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PUBLISHED',
  "is_verified_purchase" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_reviews_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "product_reviews_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_reviews_user_id_product_id_key"
  ON "product_reviews" ("user_id", "product_id");

CREATE INDEX IF NOT EXISTS "product_reviews_product_id_status_idx"
  ON "product_reviews" ("product_id", "status");

ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "status" "OrderStatus" NOT NULL DEFAULT 'PAID',
  ADD COLUMN IF NOT EXISTS "trackingCode" TEXT;

CREATE INDEX IF NOT EXISTS "orders_userId_createdAt_idx" ON "orders" ("userId", "createdAt");

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" TEXT NOT NULL,
  "order_id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price_in_cents" INTEGER NOT NULL,
  "line_total_in_cents" INTEGER NOT NULL,
  "product_title_snapshot" TEXT NOT NULL,
  "product_image_snapshot" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "order_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "order_items_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "orders"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "order_items_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items" ("order_id");
CREATE INDEX IF NOT EXISTS "order_items_product_id_idx" ON "order_items" ("product_id");

INSERT INTO "order_items" (
  "id",
  "order_id",
  "product_id",
  "quantity",
  "unit_price_in_cents",
  "line_total_in_cents",
  "product_title_snapshot",
  "product_image_snapshot",
  "created_at"
)
SELECT
  gen_random_uuid()::text,
  o."id",
  o."productId",
  1,
  o."totalPriceInCents",
  o."totalPriceInCents",
  COALESCE(p."title", p."name", 'Prodotto'),
  p."imagePath",
  o."createdAt"
FROM "orders" o
JOIN "products" p ON p."id" = o."productId"
WHERE EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_name = 'orders'
    AND column_name = 'productId'
)
AND NOT EXISTS (
  SELECT 1 FROM "order_items" oi WHERE oi."order_id" = o."id"
);

ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_productId_fkey";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "productId";

INSERT INTO "product_images" (
  "id",
  "product_id",
  "url",
  "alt_text",
  "sort_order",
  "is_primary",
  "created_at",
  "updated_at"
)
SELECT
  gen_random_uuid()::text,
  p."id",
  p."imagePath",
  p."title",
  0,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "products" p
WHERE p."imagePath" IS NOT NULL
  AND p."imagePath" <> ''
  AND NOT EXISTS (
    SELECT 1 FROM "product_images" pi WHERE pi."product_id" = p."id"
  );

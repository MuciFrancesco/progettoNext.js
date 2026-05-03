ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "can_create_cart" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "can_order_products" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS "products" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priceInCents" INTEGER NOT NULL DEFAULT 0,
  "imagePath" TEXT NOT NULL,
  "stock_quantity" INTEGER NOT NULL DEFAULT 0,
  "isAvailableForPurchase" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "title" TEXT,
  ADD COLUMN IF NOT EXISTS "stock_quantity" INTEGER NOT NULL DEFAULT 0;

UPDATE "products"
SET "title" = COALESCE(NULLIF(TRIM("name"), ''), 'Prodotto senza titolo')
WHERE "title" IS NULL OR TRIM("title") = '';

UPDATE "products"
SET "description" = 'Descrizione non disponibile'
WHERE "description" IS NULL;

ALTER TABLE "products"
  ALTER COLUMN "title" SET NOT NULL,
  ALTER COLUMN "description" SET NOT NULL,
  ALTER COLUMN "priceInCents" SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS "products_title_idx" ON "products" ("title");
CREATE INDEX IF NOT EXISTS "products_name_idx" ON "products" ("name");
CREATE INDEX IF NOT EXISTS "products_imagePath_idx" ON "products" ("imagePath");

CREATE TABLE IF NOT EXISTS "product_subcategories" (
  "id" TEXT PRIMARY KEY,
  "category" "ProductCategory" NOT NULL,
  "slug" VARCHAR(80) NOT NULL UNIQUE,
  "label" VARCHAR(120) NOT NULL,
  "hero_title" VARCHAR(180) NOT NULL,
  "hero_subtitle" VARCHAR(500) NOT NULL,
  "hero_image_path" VARCHAR(500) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "subcategory_id" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_subcategory_id_fkey'
  ) THEN
    ALTER TABLE "products"
      ADD CONSTRAINT "products_subcategory_id_fkey"
      FOREIGN KEY ("subcategory_id")
      REFERENCES "product_subcategories"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "product_subcategories_category_sort_order_idx"
  ON "product_subcategories"("category", "sort_order");

CREATE INDEX IF NOT EXISTS "products_subcategory_id_idx"
  ON "products"("subcategory_id");

-- Migration: 20260511000000_add_wishlists
-- Creates the wishlists table for "save for later" functionality

CREATE TABLE IF NOT EXISTS "wishlists" (
  "id"         TEXT      NOT NULL,
  "user_id"    TEXT      NOT NULL,
  "product_id" TEXT      NOT NULL,
  "quantity"   INTEGER   NOT NULL DEFAULT 1,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "wishlists_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "wishlists_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "wishlists_user_id_product_id_key"
    UNIQUE ("user_id", "product_id")
);

CREATE INDEX IF NOT EXISTS "wishlists_user_id_idx" ON "wishlists" ("user_id");

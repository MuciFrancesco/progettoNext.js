-- Add imagePaths column (TEXT array) to products table
ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "imagePaths" TEXT[] NOT NULL DEFAULT '{}';

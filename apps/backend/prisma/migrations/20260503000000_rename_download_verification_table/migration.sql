-- Rename table: fix typo "dowloadVerification" -> "download_verifications"
ALTER TABLE "dowloadVerification" RENAME TO "download_verifications";

-- Rename primary key constraint
ALTER TABLE "download_verifications" RENAME CONSTRAINT "dowloadVerification_pkey" TO "download_verifications_pkey";

-- Rename foreign key constraint
ALTER TABLE "download_verifications" RENAME CONSTRAINT "dowloadVerification_productId_fkey" TO "download_verifications_productId_fkey";

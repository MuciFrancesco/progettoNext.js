-- Migration: 20260101000000_init
-- Crea tabelle users e bookmarks

CREATE TABLE "users" (
  "id"         TEXT         NOT NULL,
  "email"      TEXT         NOT NULL,
  "hash"       TEXT         NOT NULL,
  "first_name" TEXT,
  "last_name"  TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "bookmarks" (
  "id"          TEXT         NOT NULL,
  "title"       TEXT         NOT NULL,
  "description" TEXT,
  "link"        TEXT         NOT NULL,
  "user_id"     TEXT         NOT NULL,
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"  TIMESTAMP(3) NOT NULL,

  CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE INDEX "bookmarks_user_id_idx" ON "bookmarks"("user_id");

ALTER TABLE "bookmarks"
  ADD CONSTRAINT "bookmarks_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

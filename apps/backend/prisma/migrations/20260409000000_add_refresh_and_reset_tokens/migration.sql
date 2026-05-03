-- Migration: 20260409000000_add_refresh_and_reset_tokens

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id"          TEXT        NOT NULL,
  "token_hash"  TEXT        NOT NULL,
  "user_id"     TEXT        NOT NULL,
  "family"      TEXT        NOT NULL,
  "expires_at"  TIMESTAMP(3) NOT NULL,
  "is_revoked"  BOOLEAN     NOT NULL DEFAULT false,
  "used_at"     TIMESTAMP(3),
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "refresh_tokens_token_hash_key" UNIQUE ("token_hash"),
  CONSTRAINT "refresh_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx"   ON "refresh_tokens" ("user_id");
CREATE INDEX IF NOT EXISTS "refresh_tokens_family_idx"    ON "refresh_tokens" ("family");

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id"          TEXT        NOT NULL,
  "token_hash"  TEXT        NOT NULL,
  "user_id"     TEXT        NOT NULL,
  "expires_at"  TIMESTAMP(3) NOT NULL,
  "used_at"     TIMESTAMP(3),
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "password_reset_tokens_token_hash_key" UNIQUE ("token_hash"),
  CONSTRAINT "password_reset_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_id_idx"   ON "password_reset_tokens" ("user_id");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_token_hash_idx" ON "password_reset_tokens" ("token_hash");

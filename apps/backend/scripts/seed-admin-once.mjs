import process from 'node:process';
import argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Errore: DATABASE_URL non configurata');
  process.exit(1);
}

const email = process.env.SEED_ADMIN_EMAIL ?? 'adolf123@gmail.com';
const password = process.env.SEED_ADMIN_PASSWORD ?? 'Amacabanane97!';

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const hash = await argon2.hash(password);

  await client.query(
    `
      INSERT INTO "users" (
        "id",
        "email",
        "hash",
        "is_admin",
        "preferred_locale",
        "can_create_cart",
        "can_order_products",
        "created_at",
        "updated_at"
      )
      VALUES ($1, $2, $3, true, 'it', true, true, NOW(), NOW())
      ON CONFLICT ("email")
      DO UPDATE SET
        "hash" = EXCLUDED."hash",
        "is_admin" = true,
        "can_create_cart" = true,
        "can_order_products" = true,
        "updated_at" = NOW()
    `,
    [randomUUID(), email, hash]
  );

  const { rows } = await client.query(
    `
      SELECT "id", "email", "is_admin", "can_create_cart", "can_order_products"
      FROM "users"
      WHERE "email" = $1
      LIMIT 1
    `,
    [email]
  );

  await client.end();

  console.log('Admin one-shot pronto:', rows[0]);
}

try {
  await main();
} catch (error) {
  console.error('Errore seed admin:', error);
  process.exit(1);
}

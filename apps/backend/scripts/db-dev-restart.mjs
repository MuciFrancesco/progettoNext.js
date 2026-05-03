/**
 * Reset del DB di sviluppo e ri-applicazione di tutte le migration SQL.
 * Non usa Prisma CLI — evita problemi con antivirus su Windows.
 *
 * Avviato da: npm run db:dev:restart
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Client } from 'pg';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  console.error('Errore: DATABASE_URL non è configurata nel file .env');
  process.exit(1);
}

const migrationsDir = path.resolve('prisma', 'migrations');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const client = new Client({ connectionString: databaseUrl });
    try {
      await client.connect();
      await client.query('SELECT 1');
      console.log('Database connesso.');
      return client;
    } catch {
      await client.end().catch(() => undefined);
      if (attempt === maxAttempts) {
        console.error(`Impossibile connettersi dopo ${maxAttempts} tentativi.`);
        process.exit(1);
      }
      console.log(`Tentativo ${attempt}/${maxAttempts}...`);
      await sleep(1000);
    }
  }
}

async function getMigrationFiles() {
  const entries = await readdir(migrationsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(migrationsDir, e.name, 'migration.sql'))
    .sort((a, b) => a.localeCompare(b));
}

async function main() {
  const client = await connectWithRetry();

  try {
    // Reset schema
    await client.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log('Schema resettato.');

    // Applica migrations in ordine
    const files = await getMigrationFiles();
    for (const file of files) {
      const sql = await readFile(file, 'utf8');
      const name = path.basename(path.dirname(file));
      console.log(`Applicando: ${name}`);
      await client.query(sql);
    }

    console.log('Database pronto.');
  } finally {
    await client.end().catch(() => undefined);
  }
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}

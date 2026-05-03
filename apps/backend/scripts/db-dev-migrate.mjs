/**
 * Crea lo scaffold per una nuova migration SQL manuale.
 *
 * Uso:
 *   node scripts/db-dev-migrate.mjs <nome_migrazione>
 *   node scripts/db-dev-migrate.mjs add_user_avatar
 *
 * Dopo la creazione:
 *   1. Scrivi il SQL in prisma/migrations/<timestamp>_<nome>/migration.sql
 *   2. Lancia: npm run db:dev:restart
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Errore: specifica un nome per la migrazione.');
  console.error('  Uso: node scripts/db-dev-migrate.mjs <nome>');
  process.exit(1);
}

// FIX: replaceAll() invece di replace() per evitare lint warning
const timestamp = new Date().toISOString().replaceAll(/\D/g, '').slice(0, 14);
const folderName = `${timestamp}_${migrationName.replaceAll(/\s+/g, '_')}`;
const migrationDir = path.resolve('prisma', 'migrations', folderName);
const migrationFile = path.join(migrationDir, 'migration.sql');

await mkdir(migrationDir, { recursive: true });
await writeFile(
  migrationFile,
  `-- Migration: ${folderName}\n-- Scrivi qui il SQL della migrazione\n\n`,
  'utf8',
);

console.log(`\nCreata: prisma/migrations/${folderName}/migration.sql`);
console.log('Prossimi passi:');
console.log('  1. Scrivi il SQL nel file');
console.log('  2. npm run db:dev:restart\n');

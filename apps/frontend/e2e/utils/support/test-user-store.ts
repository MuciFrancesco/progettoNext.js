import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const envPaths = [
    resolve(process.cwd(), '../backend/.env'),
    resolve(process.cwd(), 'apps/backend/.env'),
  ];

  for (const envPath of envPaths) {
    try {
      const envContent = readFileSync(envPath, 'utf8');
      const line = envContent
        .split(/\r?\n/)
        .find((entry) => entry.trim().startsWith('DATABASE_URL='));

      if (!line) {
        continue;
      }

      const rawValue = line.split('=').slice(1).join('=').trim();
      const databaseUrl = rawValue.replaceAll('"', '');

      if (databaseUrl) {
        process.env.DATABASE_URL = databaseUrl;
        return databaseUrl;
      }
    } catch {
      continue;
    }
  }

  throw new Error('DATABASE_URL non disponibile per i test Playwright admin.');
}

export async function promoteUserToAdmin(email: string): Promise<void> {
  const client = new Client({ connectionString: resolveDatabaseUrl() });
  await client.connect();

  try {
    await client.query('UPDATE users SET is_admin = $1 WHERE email = $2', [true, email]);
  } finally {
    await client.end();
  }
}

export async function disposeTestUserStore(): Promise<void> {
  return Promise.resolve();
}

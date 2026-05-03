import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

type OAuthTokens = { access_token: string; refresh_token: string };

@Injectable()
export class OAuthCodeService {
  private readonly codes = new Map<string, { tokens: OAuthTokens; expiresAt: number }>();
  private readonly TTL_MS = 60_000;

  store(tokens: OAuthTokens): string {
    const code = randomBytes(32).toString('hex');
    this.codes.set(code, { tokens, expiresAt: Date.now() + this.TTL_MS });
    // Purge stale entries opportunistically.
    for (const [k, v] of this.codes) {
      if (v.expiresAt < Date.now()) this.codes.delete(k);
    }
    return code;
  }

  exchange(code: string): OAuthTokens | null {
    const entry = this.codes.get(code);
    this.codes.delete(code);
    if (!entry || entry.expiresAt < Date.now()) return null;
    return entry.tokens;
  }
}

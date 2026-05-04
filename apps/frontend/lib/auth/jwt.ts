export function decodeJwtPayload(
  token: string
): { email: string; isAdmin?: boolean; isEmployee?: boolean } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    ) as Record<string, unknown>;
    if (typeof decoded.email !== 'string') return null;
    return {
      email: decoded.email,
      isAdmin: decoded.isAdmin === true,
      isEmployee: decoded.isEmployee === true,
    };
  } catch {
    return null;
  }
}

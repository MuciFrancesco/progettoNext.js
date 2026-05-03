import type { UserRole } from '@/types/api/user';

function getAdminEmails(): Set<string> {
  if (process.env.NODE_ENV === 'production') return new Set();
  const raw = process.env.ADMIN_EMAILS ?? '';
  return new Set(
    raw
      .split(',')
      .map((email) => email.toLowerCase().trim())
      .filter(Boolean)
  );
}

export function resolveRole(
  email: string,
  backendRole?: UserRole,
  backendIsAdmin?: boolean
): UserRole {
  if (typeof backendIsAdmin === 'boolean') {
    return backendIsAdmin ? 'ADMIN' : 'USER';
  }
  if (backendRole === 'ADMIN' || backendRole === 'USER') {
    return backendRole;
  }
  return getAdminEmails().has(email.toLowerCase()) ? 'ADMIN' : 'USER';
}

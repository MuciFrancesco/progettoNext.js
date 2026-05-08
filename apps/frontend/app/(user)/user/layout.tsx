import React from 'react';
import { UserPageFrame } from '@/features/layout/UserPageFrame/UserPageFrame';

// Reads session cookies on each request, so this layout must stay dynamically rendered.
export const dynamic = 'force-dynamic';

export default function UserLayout({ children }: { children?: React.ReactNode }) {
  return <UserPageFrame>{children}</UserPageFrame>;
}

import React from 'react';
import { AdminPageFrame } from '@/features/layout/AdminPageFrame/AdminPageFrame';

// Reads session cookies on each request, so this layout must stay dynamically rendered.
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return <AdminPageFrame>{children}</AdminPageFrame>;
}

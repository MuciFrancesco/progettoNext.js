import React from 'react';
import { AdminPageFrame } from '@/features/layout/AdminPageFrame/AdminPageFrame';

// Reads session cookies on each request, so this layout must stay dynamically rendered.
export const dynamic = 'force-dynamic';

type DashboardLayoutProps = {
  readonly children?: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AdminPageFrame>{children}</AdminPageFrame>;
}

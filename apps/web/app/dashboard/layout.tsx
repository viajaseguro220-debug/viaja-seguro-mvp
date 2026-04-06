'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import DashboardRoleShell from '@/components/dashboard-role-shell';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inAdminModule = pathname.startsWith('/dashboard/admin');

  if (inAdminModule) {
    return <>{children}</>;
  }

  return <DashboardRoleShell>{children}</DashboardRoleShell>;
}


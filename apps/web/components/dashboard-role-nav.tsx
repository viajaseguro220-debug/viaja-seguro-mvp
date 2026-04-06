'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest, getToken } from '@/lib/api';
import { ADMIN_DASHBOARD_NAV, DRIVER_DASHBOARD_NAV, PASSENGER_DASHBOARD_NAV, type DashboardNavItem } from '@/lib/dashboard-nav';

interface MeResponse {
  role: 'passenger' | 'driver' | 'admin';
  fullName: string;
}

function isActivePath(currentPath: string, href: string) {
  if (href === '/dashboard') return currentPath === '/dashboard';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function DashboardRoleNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<MeResponse['role'] | null>(null);

  useEffect(() => {
    async function loadRole() {
      const token = getToken();
      if (!token) return;

      try {
        const me = await apiRequest<MeResponse>('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRole(me.role);
      } catch {
        setRole(null);
      }
    }

    void loadRole();
  }, []);

  const items = useMemo<DashboardNavItem[]>(() => {
    if (role === 'driver') return DRIVER_DASHBOARD_NAV;
    if (role === 'passenger') return PASSENGER_DASHBOARD_NAV;
    if (role === 'admin') return ADMIN_DASHBOARD_NAV;
    return [];
  }, [role]);

  if (!role || items.length === 0) return null;

  return (
    <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Navegacion rapida</p>
        <Link href="/dashboard" className="text-xs text-slate-600 underline">Volver a resumen</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                active ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

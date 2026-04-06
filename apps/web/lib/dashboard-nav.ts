export type DashboardNavItem = {
  href: string;
  label: string;
};

export const PASSENGER_DASHBOARD_NAV: DashboardNavItem[] = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/search-trips', label: 'Buscar viajes' },
  { href: '/dashboard/routes', label: 'Rutas publicadas' },
  { href: '/dashboard/my-reservations', label: 'Mis reservas' },
  { href: '/dashboard/my-payments', label: 'Mis pagos' },
  { href: '/dashboard/verification', label: 'Verificacion' },
  { href: '/dashboard/incidents', label: 'Soporte' }
];

export const DRIVER_DASHBOARD_NAV: DashboardNavItem[] = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/routes', label: 'Rutas' },
  { href: '/dashboard/trips', label: 'Viajes' },
  { href: '/dashboard/vehicle', label: 'Vehiculo' },
  { href: '/dashboard/verification', label: 'Verificacion' },
  { href: '/dashboard/driver/payouts', label: 'Liquidaciones' },
  { href: '/dashboard/incidents', label: 'Soporte' }
];

export const ADMIN_DASHBOARD_NAV: DashboardNavItem[] = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/admin', label: 'Panel admin' },
  { href: '/dashboard/admin/verifications', label: 'Verificaciones' },
  { href: '/dashboard/admin/vehicles', label: 'Vehiculos' },
  { href: '/dashboard/admin/routes', label: 'Rutas' },
  { href: '/dashboard/admin/payments', label: 'Pagos' },
  { href: '/dashboard/admin/trips', label: 'Viajes' },
  { href: '/dashboard/admin/reservations', label: 'Reservas' },
  { href: '/dashboard/admin/incidents', label: 'Soporte' }
];


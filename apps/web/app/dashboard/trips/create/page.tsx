'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateTripPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/routes');
  }, [router]);

  return (
    <section className="mx-auto max-w-3xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Flujo actualizado</h1>
      <p className="text-sm text-slate-700">
        En esta fase ya no se crea viaje manualmente. Primero toma una ruta activa y el viaje se genera en automatico.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/routes" className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white">
          Ir a rutas
        </Link>
        <Link href="/dashboard/trips" className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700">
          Ver mis viajes
        </Link>
      </div>
    </section>
  );
}

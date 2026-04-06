'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiRequest, getToken } from '@/lib/api';
import { getTripStatusMeta } from '@/lib/status';
import { DriverTrip } from '@/lib/trips';

const FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'scheduled', label: 'Programados' },
  { value: 'started', label: 'En curso' },
  { value: 'finished', label: 'Finalizados' },
  { value: 'cancelled', label: 'Cancelados' }
] as const;

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<DriverTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<(typeof FILTERS)[number]['value']>('started');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) {
        setError('No hay sesion activa.');
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest<DriverTrip[]>('/trips/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(data);
        setSelectedTripId(data[0]?.id ?? null);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los viajes.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const filteredTrips = useMemo(() => trips.filter((trip) => statusFilter === 'all' || trip.status === statusFilter), [statusFilter, trips]);
  const selectedTrip = filteredTrips.find((trip) => trip.id === selectedTripId) ?? filteredTrips[0] ?? null;

  if (loading) {
    return <p className="text-slate-700">Cargando viajes del sistema...</p>;
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin - Viajes</h1>
        <p className="mt-2 text-sm text-slate-600">Vista operativa para supervisar viajes iniciados, cuadrar horarios y detectar actividad fuera de flujo.</p>
      </header>

      {error && <p className="rounded-md bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-full px-3 py-2 text-sm ${statusFilter === filter.value ? 'bg-brand-500 text-white' : 'border border-slate-300 text-slate-700'}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-3">
          {filteredTrips.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">No hay viajes para este filtro.</p>
          ) : (
            filteredTrips.map((trip) => {
              const status = getTripStatusMeta(trip.status);
              const tripDriver = (trip as DriverTrip & { driver?: { fullName?: string } | null }).driver;
              return (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`w-full rounded-xl border p-4 text-left shadow-sm ${selectedTrip?.id === trip.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{trip.route?.title ?? `${trip.route?.origin ?? 'Ruta'} {'->'} ${trip.route?.destination ?? ''}`}</p>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{new Date(trip.tripDate).toLocaleDateString()} - {trip.departureTimeSnapshot}</p>
                  <p className="text-sm text-slate-600">Conductor: {tripDriver?.fullName ?? trip.driverUserId}</p>
                </button>
              );
            })
          )}
        </aside>

        <section>
          {!selectedTrip ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">Selecciona un viaje para ver detalle.</p>
          ) : (
            <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{selectedTrip.route?.title ?? 'Viaje operativo'}</h2>
                  <p className="mt-1 text-sm text-slate-600">{selectedTrip.route?.origin} {'->'} {selectedTrip.route?.destination}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getTripStatusMeta(selectedTrip.status).className}`}>{getTripStatusMeta(selectedTrip.status).label}</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Programacion</p>
                  <p className="mt-2 text-sm text-slate-700">Fecha: {new Date(selectedTrip.tripDate).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-700">Salida: {selectedTrip.departureTimeSnapshot}</p>
                  <p className="text-sm text-slate-700">Llegada estimada: {selectedTrip.estimatedArrivalTimeSnapshot}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operacion</p>
                  <p className="mt-2 text-sm text-slate-700">Asientos snapshot: {selectedTrip.availableSeatsSnapshot}</p>
                  <p className="text-sm text-slate-700">Precio snapshot: ${selectedTrip.pricePerSeatSnapshot.toFixed(2)} MXN</p>
                  <p className="text-sm text-slate-700">Driver user id: {selectedTrip.driverUserId}</p>
                </div>
              </div>
            </article>
          )}
        </section>
      </div>
    </section>
  );
}



'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiRequest, getToken } from '@/lib/api';
import { getPayoutStatusMeta } from '@/lib/status';
import {
  GenerateWeeklyPayoutPayload,
  WeeklyPayout,
  WeeklyPayoutStatsResponse
} from '@/lib/weekly-payouts';

export default function AdminWeeklyPayoutsPage() {
  const [payouts, setPayouts] = useState<WeeklyPayout[]>([]);
  const [stats, setStats] = useState<WeeklyPayoutStatsResponse | null>(null);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [driverUserId, setDriverUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadPayouts() {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest<WeeklyPayout[]>('/weekly-payouts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPayouts(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las liquidaciones');
    } finally {
      setLoading(false);
    }
  }

  async function loadStats(periodStartFilter?: string, periodEndFilter?: string) {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      return;
    }

    setLoadingStats(true);

    try {
      const params = new URLSearchParams();
      if (periodStartFilter && periodEndFilter) {
        params.set('periodStart', new Date(periodStartFilter).toISOString());
        params.set('periodEnd', new Date(periodEndFilter).toISOString());
      }

      const query = params.toString();
      const data = await apiRequest<WeeklyPayoutStatsResponse>(`/weekly-payouts/stats${query ? `?${query}` : ''}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las estadisticas');
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    async function bootstrap() {
      await loadPayouts();
      await loadStats();
    }

    void bootstrap();
  }, []);

  const filteredPayouts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return payouts;

    return payouts.filter((payout) => {
      const tokens = [
        payout.id,
        payout.driverUserId,
        payout.driver?.fullName ?? '',
        payout.driver?.email ?? ''
      ]
        .join(' ')
        .toLowerCase();

      return tokens.includes(normalizedSearch);
    });
  }, [payouts, searchTerm]);

  async function onGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      return;
    }

    if (!periodStart || !periodEnd) {
      setError('Debes definir periodStart y periodEnd.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload: GenerateWeeklyPayoutPayload = {
      periodStart: new Date(periodStart).toISOString(),
      periodEnd: new Date(periodEnd).toISOString(),
      driverUserId: driverUserId.trim() || undefined
    };

    try {
      await apiRequest('/weekly-payouts/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      setSuccess('Liquidaciones generadas correctamente.');
      await loadPayouts();
      await loadStats(periodStart, periodEnd);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo generar la liquidacion semanal');
    } finally {
      setSubmitting(false);
    }
  }

  async function markPaid(payoutId: string) {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      return;
    }

    try {
      await apiRequest(`/weekly-payouts/${payoutId}/mark-paid`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      setSuccess('Liquidacion marcada como pagada.');
      await loadPayouts();
      await loadStats(periodStart || undefined, periodEnd || undefined);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo marcar como pagada');
    }
  }

  async function applyStatsFilter() {
    setError(null);
    if ((periodStart && !periodEnd) || (!periodStart && periodEnd)) {
      setError('Para filtrar estadisticas define ambas fechas: inicio y fin.');
      return;
    }

    await loadStats(periodStart || undefined, periodEnd || undefined);
  }

  if (loading) {
    return <p className="text-slate-700">Cargando liquidaciones...</p>;
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin - Liquidaciones semanales</h1>
        <p className="mt-2 text-sm text-slate-600">Visualiza viajes realizados, ingresos, porcentaje de app y detalle por conductor.</p>
        <p className="mt-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">La cuenta debe estar a nombre del usuario de la cuenta de Viaje Seguro.</p>
      </header>
<form onSubmit={onGenerate} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <label className="text-sm text-slate-700">
          Period start
          <input
            type="date"
            value={periodStart}
            onChange={(event) => setPeriodStart(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm text-slate-700">
          Period end
          <input
            type="date"
            value={periodEnd}
            onChange={(event) => setPeriodEnd(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm text-slate-700">
          Driver user id (opcional)
          <input
            type="text"
            value={driverUserId}
            onChange={(event) => setDriverUserId(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="md:col-span-3 flex flex-wrap gap-2">
          {error && <p className="w-full rounded-md bg-red-50 p-3 text-red-700">{error}</p>}
          {success && <p className="w-full rounded-md bg-emerald-50 p-3 text-emerald-700">{success}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? 'Generando...' : 'Generar liquidaciones'}
          </button>
          <button
            type="button"
            onClick={() => void applyStatsFilter()}
            disabled={loadingStats}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:opacity-60"
          >
            {loadingStats ? 'Cargando estadisticas...' : 'Actualizar estadisticas'}
          </button>
        </div>
      </form>

      {stats && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Estadisticas generales</h2>
          <div className="grid gap-3 md:grid-cols-5">
            <article className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Viajes realizados</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{stats.totals.totalCompletedTrips}</p>
            </article>
            <article className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total dinero</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">${stats.totals.totalMoney.toFixed(2)}</p>
            </article>
            <article className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Comision app</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">${stats.totals.appCommissionAmount.toFixed(2)}</p>
            </article>
            <article className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">% app a retirar</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{stats.totals.appCommissionPercent.toFixed(2)}%</p>
            </article>
            <article className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Neto conductores</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">${stats.totals.netAmount.toFixed(2)}</p>
            </article>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2 pr-3">Conductor</th>
                  <th className="py-2 pr-3">Viajes</th>
                  <th className="py-2 pr-3">Total</th>
                  <th className="py-2 pr-3">Comision app</th>
                  <th className="py-2 pr-3">% app</th>
                  <th className="py-2 pr-3">Neto</th>
                </tr>
              </thead>
              <tbody>
                {stats.byDriver.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-3 text-slate-600">Sin datos por conductor para el periodo seleccionado.</td>
                  </tr>
                ) : (
                  stats.byDriver.map((row) => (
                    <tr key={row.driverUserId} className="border-b border-slate-100 text-slate-700">
                      <td className="py-2 pr-3">{row.driver?.fullName ?? row.driverUserId}</td>
                      <td className="py-2 pr-3">{row.completedTrips}</td>
                      <td className="py-2 pr-3">${row.totalMoney.toFixed(2)}</td>
                      <td className="py-2 pr-3">${row.appCommissionAmount.toFixed(2)}</td>
                      <td className="py-2 pr-3">{row.appCommissionPercent.toFixed(2)}%</td>
                      <td className="py-2 pr-3">${row.netAmount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block text-sm text-slate-700">
          Buscar liquidacion por conductor
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Nombre, email o user id del conductor"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      {filteredPayouts.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700">No hay liquidaciones semanales.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPayouts.map((payout) => {
            const status = getPayoutStatusMeta(payout.status);
            return (
              <article key={payout.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{payout.driver?.fullName ?? payout.driverUserId}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Driver user id: {payout.driverUserId}</p>
                <p className="mt-2 text-sm text-slate-700">
                  Periodo: {new Date(payout.periodStart).toLocaleDateString()} - {new Date(payout.periodEnd).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-slate-700">Gross: ${payout.grossAmount.toFixed(2)} MXN</p>
                <p className="text-sm text-slate-700">Comision app: ${payout.appCommissionAmount.toFixed(2)} MXN</p>
                <p className="text-sm text-slate-700">Refunded: ${payout.refundedAmount.toFixed(2)} MXN</p>
                <p className="text-sm font-medium text-slate-900">Neto: ${payout.netAmount.toFixed(2)} MXN</p>

                {payout.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => void markPaid(payout.id)}
                    className="mt-3 rounded-md border border-emerald-300 px-3 py-2 text-sm text-emerald-700"
                  >
                    Marcar pagado
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}









'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiRequest, buildApiAssetUrl, getToken } from '@/lib/api';
import { getVehicleStatusMeta } from '@/lib/status';
import { AdminVehicleDetail, PendingVehicleSummary, VEHICLE_DOCUMENT_TYPE_OPTIONS } from '@/lib/vehicles';

export default function AdminVehiclesPage() {
  const [pendingVehicles, setPendingVehicles] = useState<PendingVehicleSummary[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminVehicleDetail | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadPendingVehicles() {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest<PendingVehicleSummary[]>('/admin/vehicles/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingVehicles(data);
      if (!selectedVehicleId && data.length > 0) {
        setSelectedVehicleId(data[0].vehicleId);
      }
      if (data.length === 0) {
        setSelectedVehicleId(null);
        setDetail(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los vehiculos pendientes');
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(vehicleId: string) {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      return;
    }

    setDetailLoading(true);
    setError(null);

    try {
      const data = await apiRequest<AdminVehicleDetail>(`/admin/vehicles/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el detalle del vehiculo');
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    void loadPendingVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      void loadDetail(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  async function review(action: 'approve' | 'reject') {
    if (!selectedVehicleId) return;

    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await apiRequest<AdminVehicleDetail>(`/admin/vehicles/${selectedVehicleId}/${action}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: notes.trim() || undefined })
      });
      setDetail(updated);
      setNotes('');
      setSuccess(action === 'approve' ? 'Vehiculo aprobado correctamente.' : 'Vehiculo rechazado correctamente.');
      await loadPendingVehicles();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo procesar la revision del vehiculo');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-slate-700">Cargando vehiculos pendientes...</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin - Vehiculos</h1>
          <p className="text-sm text-slate-600">Revisa vehiculos de conductores y decide su aprobacion operativa.</p>
        </div>
<div className="flex gap-2">
          <Link href="/dashboard/admin/verifications" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">Verificaciones</Link>
          <Link href="/dashboard" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">Dashboard</Link>
        </div>
</div>
{error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Pendientes</h2>
          {pendingVehicles.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">No hay vehiculos pendientes de revision.</p>
          ) : (
            pendingVehicles.map((vehicle) => {
              const statusMeta = getVehicleStatusMeta(vehicle.status);
              return (
                <button
                  key={vehicle.vehicleId}
                  type="button"
                  onClick={() => setSelectedVehicleId(vehicle.vehicleId)}
                  className={`w-full rounded-xl border p-4 text-left shadow-sm ${selectedVehicleId === vehicle.vehicleId ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{vehicle.driverName}</p>
                      <p className="text-sm text-slate-600">{vehicle.driverEmail}</p>
                      <p className="text-sm text-slate-600">{vehicle.brand} {vehicle.model}</p>
                    </div>
<span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMeta.className}`}>{statusMeta.label}</span>
                  </div>
<p className="mt-2 text-sm text-slate-700">Placas: {vehicle.plates}</p>
                  <p className="text-sm text-slate-700">Documentos pendientes: {vehicle.pendingDocumentsCount}</p>
                  <p className="text-xs text-slate-500">Actualizado: {new Date(vehicle.updatedAt).toLocaleString()}</p>
                </button>
              );
            })
          )}
        </aside>

        <section className="space-y-4">
          {detailLoading ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">Cargando detalle...</p>
          ) : !detail ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">Selecciona un vehiculo para revisar.</p>
          ) : (
            <>
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{detail.brand} {detail.model}</h2>
                    <p className="text-sm text-slate-700">Placas: {detail.plates}</p>
                    <p className="text-sm text-slate-700">Anio: {detail.year}</p>
                    <p className="text-sm text-slate-700">Asientos: {detail.seatCount}</p>
                    {detail.color && <p className="text-sm text-slate-700">Color: {detail.color}</p>}
                    {detail.insurancePolicy && <p className="text-sm text-slate-700">Poliza: {detail.insurancePolicy}</p>}
                  </div>
<span className={`rounded-full px-2 py-1 text-xs font-medium ${getVehicleStatusMeta(detail.status).className}`}>{getVehicleStatusMeta(detail.status).label}</span>
                </div>
{detail.driver && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Conductor</p>
                    <p>{detail.driver.fullName}</p>
                    <p>{detail.driver.email}</p>
                    <p>{detail.driver.phone || 'Sin telefono registrado'}</p>
                  </div>
)}
              </article>

              <div className="grid gap-4 md:grid-cols-2">
                {detail.documents.map((document) => {
                  const typeLabel = VEHICLE_DOCUMENT_TYPE_OPTIONS.find((item) => item.value === document.documentType)?.label ?? document.documentType;
                  const fileUrl = buildApiAssetUrl(document.fileUrl);
                  const statusMeta = getVehicleStatusMeta(document.status);

                  return (
                    <article key={document.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{typeLabel}</h3>
                          <p className="text-sm text-slate-600">{new Date(document.createdAt).toLocaleString()}</p>
                        </div>
<span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMeta.className}`}>{statusMeta.label}</span>
                      </div>
{document.notes && <p className="mt-2 text-sm text-slate-700">Notas: {document.notes}</p>}
                      {document.fileName && <p className="text-sm text-slate-700">Archivo: {document.fileName}</p>}
                      {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-brand-600 underline">Ver archivo</a>}
                    </article>
                  );
                })}
              </div>
<article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">Revision admin</h3>
                <label className="mt-3 block text-sm text-slate-700">
                  Nota de revision (opcional)
                  <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" disabled={submitting} onClick={() => review('approve')} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {submitting ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button type="button" disabled={submitting} onClick={() => review('reject')} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {submitting ? 'Procesando...' : 'Rechazar'}
                  </button>
                </div>
</article>
            </>
          )}
        </section>
      </div>
</section>
  );
}







'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiRequest, buildApiAssetUrl, getToken } from '@/lib/api';
import { getVerificationStatusMeta } from '@/lib/status';
import { PendingVerificationSummary, VerificationDetail, USER_DOCUMENT_TYPE_OPTIONS } from '@/lib/user-documents';

export default function AdminVerificationsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingVerificationSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detail, setDetail] = useState<VerificationDetail | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadPendingUsers() {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest<PendingVerificationSummary[]>('/admin/verifications/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingUsers(data);
      if (!selectedUserId && data.length > 0) {
        setSelectedUserId(data[0].userId);
      }
      if (data.length === 0) {
        setSelectedUserId(null);
        setDetail(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las verificaciones');
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(userId: string) {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      return;
    }

    setDetailLoading(true);
    setError(null);

    try {
      const data = await apiRequest<VerificationDetail>(`/admin/verifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el detalle de verificacion');
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    void loadPendingUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      void loadDetail(selectedUserId);
    }
  }, [selectedUserId]);

  async function review(action: 'approve' | 'reject') {
    if (!selectedUserId) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await apiRequest<VerificationDetail>(`/admin/verifications/${selectedUserId}/${action}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: notes.trim() || undefined })
      });
      setSuccess(action === 'approve' ? 'Usuario aprobado correctamente.' : 'Usuario rechazado correctamente.');
      setDetail(updated);
      setNotes('');
      await loadPendingUsers();
      if (action === 'approve' || action === 'reject') {
        const stillExists = pendingUsers.some((item) => item.userId !== selectedUserId);
        if (!stillExists) {
          setSelectedUserId(null);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo procesar la verificacion');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-slate-700">Cargando verificaciones pendientes...</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin - Verificaciones</h1>
          <p className="text-sm text-slate-600">Revisa documentos y aprueba o rechaza usuarios.</p>
        </div>
<div className="flex gap-2">
          <Link href="/dashboard/admin/payments" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
            Pagos
          </Link>
          <Link href="/dashboard" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
            Dashboard
          </Link>
        </div>
</div>
{error && <p className="rounded-md bg-red-50 p-3 text-red-700">{error}</p>}
      {success && <p className="rounded-md bg-emerald-50 p-3 text-emerald-700">{success}</p>}

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Pendientes</h2>
          {pendingUsers.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">No hay usuarios pendientes de revision.</p>
          ) : (
            pendingUsers.map((user) => {
              const statusMeta = getVerificationStatusMeta(user.verificationStatus);

              return (
                <button
                  key={user.userId}
                  type="button"
                  onClick={() => setSelectedUserId(user.userId)}
                  className={`w-full rounded-xl border p-4 text-left shadow-sm ${
                    selectedUserId === user.userId ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{user.fullName}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <p className="text-sm text-slate-600">Rol: {user.role}</p>
                    </div>
<span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMeta.className}`}>{statusMeta.label}</span>
                  </div>
<p className="mt-2 text-sm text-slate-700">Documentos pendientes: {user.pendingDocumentsCount}</p>
                  <p className="text-xs text-slate-500">
                    Ultimo envio: {user.lastDocumentAt ? new Date(user.lastDocumentAt).toLocaleString() : 'N/A'}
                  </p>
                </button>
              );
            })
          )}
        </aside>

        <section className="space-y-4">
          {detailLoading ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">Cargando detalle...</p>
          ) : !detail ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">Selecciona un usuario para revisar.</p>
          ) : (
            <>
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{detail.user.fullName}</h2>
                    <p className="text-sm text-slate-700">{detail.user.email}</p>
                    <p className="text-sm text-slate-700">Telefono: {detail.user.phone}</p>
                    <p className="text-sm text-slate-700">Rol: {detail.user.role}</p>
                  </div>
<span className={`rounded-full px-2 py-1 text-xs font-medium ${getVerificationStatusMeta(detail.user.verificationStatus).className}`}>
                    {getVerificationStatusMeta(detail.user.verificationStatus).label}
                  </span>
                </div>
</article>

              <div className="grid gap-4 md:grid-cols-2">
                {detail.documents.map((document) => {
                  const typeLabel = USER_DOCUMENT_TYPE_OPTIONS.find((item) => item.value === document.documentType)?.label ?? document.documentType;
                  const fileUrl = buildApiAssetUrl(document.fileUrl);
                  const statusMeta = getVerificationStatusMeta(document.status);

                  return (
                    <article key={document.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{typeLabel}</h3>
                          <p className="text-sm text-slate-600">{new Date(document.createdAt).toLocaleString()}</p>
                        </div>
<span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMeta.className}`}>{statusMeta.label}</span>
                      </div>
{document.documentNumber && <p className="mt-2 text-sm text-slate-700">Referencia: {document.documentNumber}</p>}
                      {document.notes && <p className="text-sm text-slate-700">Notas: {document.notes}</p>}
                      {document.fileName && <p className="text-sm text-slate-700">Archivo: {document.fileName}</p>}
                      {fileUrl && (
                        <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-brand-600 underline">
                          Ver archivo
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
<article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">Revision admin</h3>
                <label className="mt-3 block text-sm text-slate-700">
                  Nota de revision (opcional)
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => review('approve')}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {submitting ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => review('reject')}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
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







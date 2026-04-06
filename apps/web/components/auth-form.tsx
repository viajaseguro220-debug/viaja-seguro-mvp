'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { apiRequest, AuthResponse, saveSession } from '@/lib/api';

type RegisterMode = 'passenger' | 'driver';

interface AuthFormProps {
  mode: 'login' | RegisterMode;
}

const COPY = {
  login: {
    title: 'Entra a tu cuenta',
    subtitle: 'Retoma tu operacion con una sesion clara por pestana para probar pasajero, conductor y admin sin cruces inesperados.',
    badge: 'Acceso seguro',
    bullets: ['Consulta tu panel en segundos', 'Estados claros para pagos y abordaje', 'Ideal para pruebas reales del MVP'],
    button: 'Entrar ahora'
  },
  passenger: {
    title: 'Crea tu cuenta de pasajero',
    subtitle: 'Reserva con horario fijo, tarifa clara y validacion ordenada. Todo pensado para que moverte se sienta simple.',
    badge: 'Reserva con confianza',
    bullets: ['Tu asiento seguro, a tiempo', 'Pago validado antes del abordaje', 'Mas orden, mas seguridad, mejor traslado'],
    button: 'Crear cuenta de pasajero'
  },
  driver: {
    title: 'Registra tu cuenta de conductor',
    subtitle: 'Publica rutas, organiza salidas y valida abordajes con una operacion mas limpia para tu dia a dia.',
    badge: 'Operacion profesional',
    bullets: ['Rutas recurrentes con horario fijo', 'Control de abordaje simple', 'Mas orden para conductor y pasajero'],
    button: 'Crear cuenta de conductor'
  }
} as const;

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';
  const copy = COPY[mode];

  const sideLabel = useMemo(() => {
    if (mode === 'driver') return 'Flujo para conductores';
    if (mode === 'passenger') return 'Flujo para pasajeros';
    return 'Acceso al sistema';
  }, [mode]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? '')
    };

    if (!isLogin) {
      payload.fullName = String(formData.get('fullName') ?? '').trim();
      payload.phone = String(formData.get('phone') ?? '').trim();
      payload.emergencyContactName = String(formData.get('emergencyContactName') ?? '').trim();
      payload.emergencyContactPhone = String(formData.get('emergencyContactPhone') ?? '').trim();
    }

    try {
      const endpoint = isLogin ? '/auth/login' : `/auth/register/${mode}`;
      const data = await apiRequest<AuthResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      saveSession(data.accessToken, data.user.role, data.user.fullName);
      router.push('/dashboard');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo completar la operacion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="vs-grid-hero items-start">
      <article className="relative overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_30px_90px_-45px_rgba(7,17,31,0.85)] md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(21,184,166,0.25),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="relative space-y-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
            {copy.badge}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-300">{sideLabel}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">{copy.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-200">{copy.subtitle}</p>
          </div>
          <div className="grid gap-3">
            {copy.bullets.map((bullet) => (
              <div key={bullet} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-100">
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </article>

      <section className="vs-card w-full max-w-xl">
        <div className="mb-6 space-y-2">
          <p className="vs-kicker">Datos de acceso</p>
          <h2 className="text-2xl font-semibold text-slate-950">{copy.title}</h2>
          <p className="text-sm leading-6 text-slate-600">Completa la informacion esencial. Lo demas lo iremos confirmando en el flujo operativo.</p>
          {mode === 'driver' && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Para operar como conductor necesitas 2 aprobaciones: 1) verificacion de identidad oficial y 2) vehiculo aprobado.
            </p>
          )}
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {!isLogin && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-slate-700 md:col-span-2">
                Nombre completo
                <input required name="fullName" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" />
              </label>
              <label className="block text-sm text-slate-700">
                Telefono
                <input required name="phone" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" />
              </label>
              <label className="block text-sm text-slate-700">
                Contacto de emergencia
                <input name="emergencyContactName" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" />
              </label>
              <label className="block text-sm text-slate-700 md:col-span-2">
                Telefono de emergencia
                <input name="emergencyContactPhone" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" />
              </label>
            </div>
          )}

          <label className="block text-sm text-slate-700">
            Correo electronico
            <input required type="email" name="email" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" />
          </label>

          <label className="block text-sm text-slate-700">
            Contrasena
            <input required type="password" minLength={8} name="password" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" />
          </label>

          {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="vs-button-accent w-full">
            {loading ? 'Procesando...' : copy.button}
          </button>
        </form>
      </section>
    </section>
  );
}


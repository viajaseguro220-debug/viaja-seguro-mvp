import Link from 'next/link';

const highlights = [
  'Tu asiento seguro, a tiempo',
  'Viaja con horario fijo y tarifa clara',
  'Reserva, paga y aborda sin complicaciones',
  'Mas orden, mas seguridad, mejor traslado'
];

const operationalSteps = [
  { title: '1. Registrate', detail: 'Crea tu cuenta como pasajero, conductor o admin.' },
  { title: '2. Valida tu cuenta', detail: 'Completa tu verificacion para habilitar acciones clave.' },
  { title: '3. Reserva o publica tu viaje', detail: 'Busca viajes cercanos o publica tu ruta con horario real.' },
  { title: '4. Realiza tu pago', detail: 'Sube comprobante y espera validacion administrativa.' },
  { title: '5. Recibe tu codigo y aborda', detail: 'Con pago validado, se habilita tu codigo y QR de abordaje.' }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="vs-grid-hero">
        <article className="relative overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_30px_90px_-45px_rgba(7,17,31,0.9)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(21,184,166,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_25%)]" />
          <div className="relative space-y-6">
            <p className="vs-kicker text-cyan-200">Movilidad programada con confianza</p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Tu asiento seguro, a tiempo.</h1>
              <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                VIAJA SEGURO organiza rutas, pagos y abordaje en una sola experiencia clara para pasajero, conductor y admin.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register/passenger" className="vs-button-accent">Quiero reservar</Link>
              <Link href="/register/driver" className="vs-button-secondary border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">Quiero conducir</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlights.map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-slate-100">{item}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="vs-card space-y-5">
          <div>
            <p className="vs-kicker">Como funciona</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Operacion simple y guiada</h2>
          </div>
          <div className="grid gap-3">
            {operationalSteps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{step.detail}</p>
              </div>
            ))}
          </div>
          <Link href="/login" className="vs-button-primary w-full">Entrar al sistema</Link>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="vs-card">
          <p className="vs-kicker">Pasajeros</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Reserva clara y validacion segura</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Consulta horarios, revisa el monto, sube tu comprobante y recibe tu codigo solo cuando el pago este confirmado.</p>
        </article>
        <article className="vs-card">
          <p className="vs-kicker">Conductores</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Rutas recurrentes y operacion controlada</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Publica salidas reales, monitorea ocupacion y valida abordaje con un flujo simple y visible.</p>
        </article>
        <article className="vs-card">
          <p className="vs-kicker">Administracion</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Mas control, menos improvisacion</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Aprueba cuentas, vehiculos y pagos desde un panel limpio para pruebas reales del piloto.</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="vs-card">
          <p className="vs-kicker">Reglas generales</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Operacion clara desde el inicio</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Completa datos reales y documentos vigentes.</li>
            <li>Tu reserva se confirma cuando el pago sea validado.</li>
            <li>El codigo de abordaje se habilita solo con pago aprobado.</li>
            <li>Revisa horario, unidad y asientos antes de abordar.</li>
          </ul>
        </article>
        <article className="vs-card">
          <p className="vs-kicker">Beneficios</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Listo para pruebas reales</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Todo el flujo queda visible: verificacion, vehiculo, reserva, pago, abordaje y liquidaciones en una experiencia consistente.</p>
        </article>
      </div>
    </section>
  );
}



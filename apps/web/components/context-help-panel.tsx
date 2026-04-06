import Link from 'next/link';

type ContextHelpPanelProps = {
  title?: string;
  subtitle?: string;
  points: string[];
  nextStep?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function ContextHelpPanel({
  title = 'Guia rapida',
  subtitle,
  points,
  nextStep,
  ctaHref,
  ctaLabel
}: ContextHelpPanelProps) {
  return (
    <aside className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_-38px_rgba(13,27,47,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(21,184,166,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(13,27,47,0.08),transparent_30%)]" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
        {subtitle && <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>}
        <ul className="mt-4 space-y-2">
          {points.slice(0, 5).map((point) => (
            <li key={point} className="flex gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">+</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {nextStep && <p className="mt-3 text-sm font-semibold text-slate-900">Que sigue: {nextStep}</p>}
        {ctaHref && ctaLabel && (
          <Link href={ctaHref} className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            {ctaLabel}
          </Link>
        )}
      </div>
    </aside>
  );
}

import { PriorityLevel } from '../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    alta: {
      label: 'Alta',
      className: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    },
    media: {
      label: 'Media',
      className: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    },
    baja: {
      label: 'Baja',
      className: 'bg-slate-800 text-slate-300 border-slate-700',
    },
  }[priority] || {
    label: 'Media',
    className: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${config.className}`}
    >
      Prioridad {config.label}
    </span>
  );
}

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { COURSE_MODULES } from '../../data/sampleData';
import { CourseClass, CourseNote, CourseTask, TabId } from '../../types';
import { formatShortDate } from '../../utils/dateUtils';
import { PWAInstallButton } from '../PWAInstallButton';

interface ProgresoViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
  onNavigate: (tab: TabId) => void;
  onRequestResetSampleData: () => void;
}

export function ProgresoView({
  classes,
  tasks,
  notes,
  onNavigate,
  onRequestResetSampleData,
}: ProgresoViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks
    .filter((t) => t.status === 'pending')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completionPercent =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercent / 100) * circumference;

  const moduleBreakdown = COURSE_MODULES.map((mod) => {
    const modTasks = tasks.filter((t) => t.module === mod);
    const done = modTasks.filter((t) => t.status === 'completed').length;
    return {
      module: mod,
      total: modTasks.length,
      done,
      percent: modTasks.length > 0 ? Math.round((done / modTasks.length) * 100) : 0,
    };
  }).filter((item) => item.total > 0);

  return (
    <div className="space-y-4">
      {/* Tarjeta principal de avance */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="9"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                {completionPercent}%
              </span>
              <span className="text-[11px] font-medium text-slate-500">Avance</span>
            </div>
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Tu progreso
            </h2>
            <p className="text-sm text-slate-600 leading-snug">
              <strong className="text-slate-900 tabular-nums">
                {completedTasks.length}
              </strong>{' '}
              de{' '}
              <strong className="text-slate-900 tabular-nums">
                {totalTasks}
              </strong>{' '}
              tareas completadas en Google AI Studio.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('tareas')}
          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span>Ver todas las tareas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Indicadores en cuadrícula 2x2 móvil */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Completadas</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {completedTasks.length}
          </p>
          <p className="text-xs text-slate-500">Tareas terminadas</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Pendientes</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {pendingTasks.length}
          </p>
          <p className="text-xs text-slate-500">Por entregar</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Clases</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {classes.length}
          </p>
          <p className="text-xs text-slate-500">En agenda</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <FileText className="w-4 h-4 shrink-0" />
            <span>Apuntes</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {notes.length}
          </p>
          <p className="text-xs text-slate-500">Notas guardadas</p>
        </div>
      </section>

      {/* Avance por módulo */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3.5">
        <h3 className="text-base font-bold text-slate-900">Avance por módulo</h3>

        {moduleBreakdown.length === 0 ? (
          <p className="text-sm text-slate-500">
            Agrega tareas asignadas a un módulo para ver tu avance.
          </p>
        ) : (
          <div className="space-y-3.5">
            {moduleBreakdown.map((item) => (
              <div key={item.module} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-800 truncate">
                    {item.module}
                  </span>
                  <span className="text-slate-600 tabular-nums shrink-0">
                    {item.done}/{item.total} ({item.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all duration-300"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Próximas entregas */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900">
            Próximas entregas
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="min-h-[40px] px-2 text-xs font-semibold text-blue-700"
          >
            Gestionar
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <p className="text-sm text-slate-600 py-1">
            ¡Excelente trabajo! Todas tus tareas están completadas.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pendingTasks.slice(0, 5).map((task) => (
              <li
                key={task.id}
                className="py-2.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {task.module}
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-700 shrink-0 tabular-nums">
                  {formatShortDate(task.dueDate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Instalación móvil PWA */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Aplicación en tu teléfono
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Instala Mi Agenda en tu pantalla de inicio para abrirla como aplicación independiente y consultarla sin conexión.
          </p>
        </div>
        <PWAInstallButton variant="full" />
      </section>

      {/* Restaurar datos */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Datos de ejemplo
          </h3>
          <p className="text-sm text-slate-600">
            Restaura las clases, tareas y apuntes iniciales del curso de Google AI Studio.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestResetSampleData}
          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restaurar datos de ejemplo</span>
        </button>
      </section>
    </div>
  );
}

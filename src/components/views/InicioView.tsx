import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask, TabId } from '../../types';
import { formatDayHeader, formatShortDate, getTodayKey, isOverdue } from '../../utils/dateUtils';
import { PriorityBadge } from '../PriorityBadge';

interface InicioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onNavigate: (tab: TabId) => void;
  onAddClass: () => void;
  onEditClass: (cls: CourseClass) => void;
  onDeleteClass: (cls: CourseClass) => void;
  onAddTask: () => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (id: string) => void;
}

export function InicioView({
  classes,
  tasks,
  onNavigate,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: InicioViewProps) {
  const today = getTodayKey();

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today)
    .sort((a, b) =>
      a.date === b.date
        ? a.startTime.localeCompare(b.startTime)
        : a.date.localeCompare(b.date)
    )
    .slice(0, 4);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pending')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-5">
      {/* Tarjeta de resumen diario para teléfono */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-700 capitalize">
            {formatDayHeader(today)}
          </p>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Curso de Google AI Studio
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900 tabular-nums">
              {upcomingClasses.length}
            </span>{' '}
            {upcomingClasses.length === 1 ? 'clase próxima' : 'clases próximas'} ·{' '}
            <span className="font-semibold text-slate-900 tabular-nums">
              {pendingTasks.length}
            </span>{' '}
            {pendingTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
            {tasks.length > 0 && (
              <>
                {' '}
                · <span className="tabular-nums">{completedCount}/{tasks.length}</span> hechas
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onAddClass}
            className="min-h-[48px] px-3 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Nueva clase</span>
          </button>
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0 text-blue-700" />
            <span>Nueva tarea</span>
          </button>
        </div>
      </section>

      {/* Próximas clases */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            <span>Próximas clases</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('calendario')}
            className="min-h-[44px] px-2 text-sm font-semibold text-blue-700 flex items-center gap-1 whitespace-nowrap"
          >
            <span>Calendario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {upcomingClasses.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-base font-medium text-slate-800">
              Sin clases próximas programadas
            </p>
            <button
              type="button"
              onClick={onAddClass}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar clase</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <article
                key={cls.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">
                      {formatShortDate(cls.date)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-semibold text-slate-700">
                      {cls.startTime}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{cls.durationMinutes} min</span>
                  </div>
                  <PriorityBadge priority={cls.priority} />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {cls.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500">
                    {cls.module} · {cls.modality}
                  </p>
                  {cls.description && (
                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {cls.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onEditClass(cls)}
                    className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClass(cls)}
                    className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50/70 active:bg-rose-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Tareas pendientes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Tareas pendientes</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="min-h-[44px] px-2 text-sm font-semibold text-blue-700 flex items-center gap-1 whitespace-nowrap"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-base font-medium text-slate-800">
              ¡Estás al día con tus tareas!
            </p>
            <button
              type="button"
              onClick={onAddTask}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar tarea</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.slice(0, 4).map((task) => {
              const overdue = isOverdue(task.dueDate);
              return (
                <article
                  key={task.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                      <span
                        className={`font-semibold ${
                          overdue ? 'text-rose-700' : 'text-amber-700'
                        }`}
                      >
                        {overdue
                          ? `Atrasada · ${formatShortDate(task.dueDate)}`
                          : `Entrega: ${formatShortDate(task.dueDate)}`}
                      </span>
                      <span className="text-slate-400" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-slate-500">{task.module}</span>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onToggleTaskStatus(task.id)}
                      className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Marcar completada</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50/70 active:bg-rose-100 flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

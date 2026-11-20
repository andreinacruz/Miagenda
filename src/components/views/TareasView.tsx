import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseTask } from '../../types';
import { formatCompactDay, formatShortDate, isOverdue } from '../../utils/dateUtils';
import { PriorityBadge } from '../PriorityBadge';

interface TareasViewProps {
  tasks: CourseTask[];
  onAddTask: () => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (id: string) => void;
}

type TaskFilter = 'all' | 'pending' | 'completed';

export function TareasView({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TareasViewProps) {
  const [filter, setFilter] = useState<TaskFilter>('all');

  const totalTasks = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const completionPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const filteredTasks = [...tasks]
    .filter((t) => {
      if (filter === 'pending') return t.status === 'pending';
      if (filter === 'completed') return t.status === 'completed';
      return true;
    })
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Mis tareas
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 tabular-nums">
            {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'} ·{' '}
            {completedCount} {completedCount === 1 ? 'completada' : 'completadas'}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva tarea</span>
        </button>
      </div>

      {/* Tarjeta de resumen con barra de progreso visual */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-bold text-slate-900">Progreso de entregas</span>
          <span className="font-extrabold text-blue-700 tabular-nums">
            {completedCount} de {totalTasks} ({completionPercent}%)
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-700 rounded-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </section>

      {/* Filtros segmentados */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap tabular-nums ${
            filter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          Todas ({totalTasks})
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap tabular-nums ${
            filter === 'pending'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          Pendientes ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap tabular-nums ${
            filter === 'completed'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          Hechas ({completedCount})
        </button>
      </div>

      {/* Lista vertical de tareas */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-base font-semibold text-slate-800">
            {filter === 'pending'
              ? 'No tienes tareas pendientes'
              : filter === 'completed'
              ? 'Aún no completas tareas'
              : 'No hay tareas registradas'}
          </p>
          <button
            type="button"
            onClick={onAddTask}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear tarea</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const overdue = !isDone && isOverdue(task.dueDate);

            return (
              <article
                key={task.id}
                className={`bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 ${
                  isDone ? 'opacity-85' : ''
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          isDone
                            ? 'text-emerald-700'
                            : overdue
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>
                          {isDone
                            ? 'Completada'
                            : overdue
                            ? 'Atrasada'
                            : 'Pendiente'}
                        </span>
                      </span>
                      <span className="text-slate-400" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-slate-700 font-medium">
                        {formatShortDate(task.dueDate)} ({formatCompactDay(task.dueDate)})
                      </span>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  <h3
                    className={`text-base font-bold leading-snug ${
                      isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {task.module}
                  </p>
                  {task.description && (
                    <p className="text-sm text-slate-600 leading-relaxed pt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`w-full min-h-[44px] px-4 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
                      isDone
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Marcar pendiente</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Marcar completada</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 flex items-center justify-center gap-1.5"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task)}
                      className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50/70 flex items-center justify-center gap-1.5"
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
    </div>
  );
}

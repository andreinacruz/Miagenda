import { useState } from 'react';
import {
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask } from '../../types';
import {
  addDaysToKey,
  formatCompactDay,
  formatDayHeader,
  formatWeekRange,
  getDayNumber,
  getTodayKey,
  getWeekDates,
  getWeekdayInitial,
} from '../../utils/dateUtils';
import { PriorityBadge } from '../PriorityBadge';

interface CalendarioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onAddClass: (defaultDate?: string) => void;
  onEditClass: (cls: CourseClass) => void;
  onDeleteClass: (cls: CourseClass) => void;
  onAddTask: (defaultDate?: string) => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (id: string) => void;
}

type CalendarMode = 'day' | 'week';

export function CalendarioView({
  classes,
  tasks,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: CalendarioViewProps) {
  const today = getTodayKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [mode, setMode] = useState<CalendarMode>('day');

  const weekDates = getWeekDates(selectedDate);

  const handlePrevWeek = () => {
    setSelectedDate((prev) => addDaysToKey(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => addDaysToKey(prev, 7));
  };

  const handleGoToday = () => {
    setSelectedDate(today);
  };

  const getDayActivities = (dateStr: string) => {
    const dayClasses = classes
      .filter((c) => c.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
    return { dayClasses, dayTasks };
  };

  const selectedDayData = getDayActivities(selectedDate);
  const weekRangeLabel = formatWeekRange(weekDates);

  return (
    <div className="space-y-4">
      {/* Selector de modo y semana */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3.5">
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('day')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              mode === 'day'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Por día
          </button>
          <button
            type="button"
            onClick={() => setMode('week')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              mode === 'week'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Por semana
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrevWeek}
            aria-label="Semana anterior"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center min-w-0">
            <p className="text-sm font-bold text-slate-900 capitalize truncate">
              {weekRangeLabel}
            </p>
            {selectedDate !== today && (
              <button
                type="button"
                onClick={handleGoToday}
                className="text-xs font-semibold text-blue-700 py-0.5"
              >
                Volver a hoy
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleNextWeek}
            aria-label="Semana siguiente"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:bg-slate-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Tira de 7 días */}
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((dateStr) => {
            const { dayClasses, dayTasks } = getDayActivities(dateStr);
            const totalCount = dayClasses.length + dayTasks.length;
            const isSelected = dateStr === selectedDate && mode === 'day';
            const isToday = dateStr === today;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => {
                  setSelectedDate(dateStr);
                  if (mode === 'week') setMode('day');
                }}
                className={`min-h-[60px] py-2 px-0.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700'
                    : isToday
                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                    : 'bg-slate-50/70 text-slate-800 border-transparent active:bg-slate-100'
                }`}
              >
                <span
                  className={`text-[11px] font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {getWeekdayInitial(dateStr)}
                </span>
                <span className="text-base font-bold tabular-nums leading-none">
                  {getDayNumber(dateStr)}
                </span>
                <span
                  className={`text-[10px] font-semibold tabular-nums leading-none ${
                    totalCount === 0
                      ? 'opacity-0'
                      : isSelected
                      ? 'text-blue-100'
                      : 'text-blue-700'
                  }`}
                >
                  {totalCount > 0 ? `${totalCount}` : '·'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Botones rápidos */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onAddClass(selectedDate)}
          className="min-h-[48px] px-3 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Agregar clase</span>
        </button>
        <button
          type="button"
          onClick={() => onAddTask(selectedDate)}
          className="min-h-[48px] px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 shrink-0 text-blue-700" />
          <span>Agregar tarea</span>
        </button>
      </div>

      {/* Vista Por Día */}
      {mode === 'day' ? (
        <section className="space-y-3">
          <div className="px-0.5 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {formatDayHeader(selectedDate)}
            </h2>
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {selectedDayData.dayClasses.length + selectedDayData.dayTasks.length}{' '}
              act.
            </span>
          </div>

          {selectedDayData.dayClasses.length === 0 &&
          selectedDayData.dayTasks.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-2">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-base font-semibold text-slate-800">
                Sin actividades este día
              </p>
              <p className="text-sm text-slate-500">
                Toca los botones superiores para programar algo.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayData.dayClasses.map((cls) => (
                <article
                  key={cls.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="font-semibold text-blue-700">Clase</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-semibold text-slate-700">
                        {cls.startTime}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{cls.durationMinutes} min</span>
                    </div>
                    <PriorityBadge priority={cls.priority} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {cls.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {cls.module} · {cls.modality}
                    </p>
                    {cls.description && (
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                        {cls.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onEditClass(cls)}
                      className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 flex items-center justify-center gap-1.5"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(cls)}
                      className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50/70 flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}

              {selectedDayData.dayTasks.map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <article
                    key={task.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span
                          className={`font-semibold ${
                            isDone ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          Entrega · {isDone ? 'Completada' : 'Pendiente'}
                        </span>
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <div>
                      <h3
                        className={`text-base font-bold ${
                          isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {task.module}
                      </p>
                      {task.description && (
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 ${
                          isDone
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDone ? 'Marcar pendiente' : 'Marcar completada'}</span>
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
        </section>
      ) : (
        /* Vista Por Semana */
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 px-0.5">
            Resumen semanal
          </h2>

          <div className="space-y-3">
            {weekDates.map((dateStr) => {
              const { dayClasses, dayTasks } = getDayActivities(dateStr);
              const isToday = dateStr === today;

              return (
                <div
                  key={dateStr}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setMode('day');
                      }}
                      className="text-left min-h-[40px] flex items-center gap-1.5 font-bold text-sm text-slate-900"
                    >
                      <span className="capitalize">{formatCompactDay(dateStr)}</span>
                      {isToday && (
                        <span className="text-xs font-semibold text-blue-700">
                          · Hoy
                        </span>
                      )}
                    </button>
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      {dayClasses.length + dayTasks.length} act.
                    </span>
                  </div>

                  {dayClasses.length === 0 && dayTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 py-1">
                      Sin actividades este día.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {dayClasses.map((cls) => (
                        <li
                          key={cls.id}
                          className="py-2.5 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-blue-700 tabular-nums">
                                Clase · {cls.startTime}
                              </span>
                              <PriorityBadge priority={cls.priority} />
                            </div>
                            <p className="text-sm font-semibold text-slate-900 leading-snug truncate">
                              {cls.title}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onEditClass(cls)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 active:bg-slate-100 shrink-0"
                            aria-label={`Editar clase ${cls.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </li>
                      ))}

                      {dayTasks.map((task) => {
                        const isDone = task.status === 'completed';
                        return (
                          <li
                            key={task.id}
                            className="py-2.5 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-semibold ${
                                    isDone ? 'text-emerald-700' : 'text-amber-700'
                                  }`}
                                >
                                  Tarea · {isDone ? 'Completada' : 'Pendiente'}
                                </span>
                                <PriorityBadge priority={task.priority} />
                              </div>
                              <p
                                className={`text-sm font-semibold leading-snug truncate ${
                                  isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                                }`}
                              >
                                {task.title}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onToggleTaskStatus(task.id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-emerald-700 active:bg-emerald-50 shrink-0"
                              aria-label={
                                isDone
                                  ? `Marcar como pendiente: ${task.title}`
                                  : `Marcar como completada: ${task.title}`
                              }
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

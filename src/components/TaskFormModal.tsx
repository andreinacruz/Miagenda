import React, { useEffect, useState } from 'react';
import { COURSE_MODULES } from '../data/sampleData';
import { CourseTask, PriorityLevel, TaskStatus } from '../types';
import { getTodayKey } from '../utils/dateUtils';
import { BottomSheetModal } from './BottomSheetModal';

interface TaskFormModalProps {
  isOpen: boolean;
  editingTask: CourseTask | null;
  defaultDate?: string;
  onSave: (data: Omit<CourseTask, 'id'>) => void;
  onClose: () => void;
}

export function TaskFormModal({
  isOpen,
  editingTask,
  defaultDate,
  onSave,
  onClose,
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayKey());
  const [module, setModule] = useState(COURSE_MODULES[0]);
  const [priority, setPriority] = useState<PriorityLevel>('media');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setModule(editingTask.module);
      setPriority(editingTask.priority || 'media');
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(defaultDate || getTodayKey());
      setModule(COURSE_MODULES[1]);
      setPriority('media');
      setStatus('pending');
    }
    setError('');
  }, [isOpen, editingTask, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Debes escribir una actividad.');
      return;
    }
    if (!dueDate) {
      setError('Selecciona una fecha de entrega.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      module,
      priority,
      status,
    });
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? 'Editar tarea' : 'Nueva tarea'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pb-2">
        {error && (
          <p className="text-sm font-medium text-rose-300 bg-rose-950/85 border border-rose-800 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="task-title" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Nombre de la tarea
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Probar prompt multimodal en AI Studio"
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="task-desc" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Descripción
          </label>
          <textarea
            id="task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalla qué debes entregar o practicar..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-date" className="block text-sm font-semibold text-slate-200 mb-1.5">
              Fecha de entrega
            </label>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white tabular-nums focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="task-module" className="block text-sm font-semibold text-slate-200 mb-1.5">
              Módulo
            </label>
            <select
              id="task-module"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white focus:border-blue-500 focus:outline-none"
            >
              {COURSE_MODULES.map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">
            Nivel de prioridad
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {(
              [
                { id: 'baja', label: 'Baja' },
                { id: 'media', label: 'Media' },
                { id: 'alta', label: 'Alta' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  priority === p.id
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-slate-200 mb-1.5">
            Estado de la tarea
          </span>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setStatus('pending')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                status === 'pending'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              Pendiente
            </button>
            <button
              type="button"
              onClick={() => setStatus('completed')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                status === 'completed'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              Completada
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 font-semibold text-base active:scale-[0.98] transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/30"
          >
            {editingTask ? 'Guardar cambios' : 'Guardar tarea'}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}

import React, { useEffect, useState } from 'react';
import { COURSE_MODULES } from '../data/sampleData';
import { CourseClass, PriorityLevel } from '../types';
import { getTodayKey } from '../utils/dateUtils';
import { BottomSheetModal } from './BottomSheetModal';

interface ClassFormModalProps {
  isOpen: boolean;
  editingClass: CourseClass | null;
  defaultDate?: string;
  onSave: (data: Omit<CourseClass, 'id'>) => void;
  onClose: () => void;
}

export function ClassFormModal({
  isOpen,
  editingClass,
  defaultDate,
  onSave,
  onClose,
}: ClassFormModalProps) {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState(COURSE_MODULES[0]);
  const [date, setDate] = useState(getTodayKey());
  const [startTime, setStartTime] = useState('18:30');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [modality, setModality] = useState('Clase en vivo');
  const [priority, setPriority] = useState<PriorityLevel>('media');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingClass) {
      setTitle(editingClass.title);
      setModule(editingClass.module);
      setDate(editingClass.date);
      setStartTime(editingClass.startTime);
      setDurationMinutes(String(editingClass.durationMinutes));
      setModality(editingClass.modality);
      setPriority(editingClass.priority || 'media');
      setDescription(editingClass.description);
    } else {
      setTitle('');
      setModule(COURSE_MODULES[0]);
      setDate(defaultDate || getTodayKey());
      setStartTime('18:30');
      setDurationMinutes('60');
      setModality('Clase en vivo');
      setPriority('media');
      setDescription('');
    }
    setError('');
  }, [isOpen, editingClass, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Debes escribir una actividad.');
      return;
    }
    if (!date) {
      setError('Selecciona una fecha para la clase.');
      return;
    }

    onSave({
      title: title.trim(),
      module: module.trim() || COURSE_MODULES[0],
      date,
      startTime: startTime || '18:00',
      durationMinutes: Math.max(15, Number(durationMinutes) || 60),
      modality: modality.trim() || 'Clase en vivo',
      priority,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingClass ? 'Editar clase' : 'Nueva clase'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pb-2">
        {error && (
          <p className="text-sm font-medium text-rose-300 bg-rose-950/85 border border-rose-800 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="class-title" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Nombre de la clase
          </label>
          <input
            id="class-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Prompts con salida en JSON"
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="class-module" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Módulo del curso
          </label>
          <select
            id="class-module"
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="class-date" className="block text-sm font-semibold text-slate-200 mb-1.5">
              Fecha
            </label>
            <input
              id="class-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white tabular-nums focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="class-time" className="block text-sm font-semibold text-slate-200 mb-1.5">
              Hora de inicio
            </label>
            <input
              id="class-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white tabular-nums focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="class-duration" className="block text-sm font-semibold text-slate-200 mb-1.5">
              Duración (min)
            </label>
            <input
              id="class-duration"
              type="number"
              min={15}
              max={300}
              step={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white tabular-nums focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="class-modality" className="block text-sm font-semibold text-slate-200 mb-1.5">
              Modalidad
            </label>
            <select
              id="class-modality"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Clase en vivo" className="bg-slate-900 text-white">Clase en vivo</option>
              <option value="Taller práctico" className="bg-slate-900 text-white">Taller práctico</option>
              <option value="Grabación disponible" className="bg-slate-900 text-white">Grabación disponible</option>
              <option value="Sesión de dudas" className="bg-slate-900 text-white">Sesión de dudas</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="class-desc" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Resumen o temas a ver
          </label>
          <textarea
            id="class-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Ejemplos prácticos en Google AI Studio y preguntas frecuentes..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
          />
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
            {editingClass ? 'Guardar cambios' : 'Guardar clase'}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}

import React, { useEffect, useState } from 'react';
import { NOTE_TOPICS } from '../data/sampleData';
import { CourseNote } from '../types';
import { BottomSheetModal } from './BottomSheetModal';

interface NoteFormModalProps {
  isOpen: boolean;
  editingNote: CourseNote | null;
  onSave: (data: Omit<CourseNote, 'id' | 'updatedAt'>) => void;
  onClose: () => void;
}

export function NoteFormModal({
  isOpen,
  editingNote,
  onSave,
  onClose,
}: NoteFormModalProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState(NOTE_TOPICS[0]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingNote) {
      setTitle(editingNote.title);
      setTopic(editingNote.topic);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setTopic(NOTE_TOPICS[0]);
      setContent('');
    }
    setError('');
  }, [isOpen, editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para tu apunte.');
      return;
    }
    if (!content.trim()) {
      setError('Escribe el contenido del apunte.');
      return;
    }

    onSave({
      title: title.trim(),
      topic: topic.trim() || NOTE_TOPICS[0],
      content: content.trim(),
    });
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingNote ? 'Editar apunte' : 'Nuevo apunte'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pb-2">
        {error && (
          <p className="text-sm font-medium text-rose-300 bg-rose-950/85 border border-rose-800 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="note-title" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Título del apunte
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Consejos para mejorar System Instructions"
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="note-topic" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Tema del curso
          </label>
          <select
            id="note-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-base text-white focus:border-blue-500 focus:outline-none"
          >
            {NOTE_TOPICS.map((t) => (
              <option key={t} value={t} className="bg-slate-900 text-white">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note-content" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Apuntes
          </label>
          <textarea
            id="note-content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe ideas clave, ejemplos de prompts o recordatorios..."
            className="w-full px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-950 text-base text-white leading-relaxed placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-y"
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
            {editingNote ? 'Guardar cambios' : 'Guardar apunte'}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}

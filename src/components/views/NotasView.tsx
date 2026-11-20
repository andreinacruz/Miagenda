import { useMemo, useState } from 'react';
import { FileText, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { CourseNote } from '../../types';
import { formatShortDate } from '../../utils/dateUtils';

interface NotasViewProps {
  notes: CourseNote[];
  onAddNote: () => void;
  onEditNote: (note: CourseNote) => void;
  onDeleteNote: (note: CourseNote) => void;
}

export function NotasView({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: NotasViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Todos');

  const availableTopics = useMemo(() => {
    const topics = Array.from(new Set(notes.map((n) => n.topic)));
    return ['Todos', ...topics];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesTopic =
        selectedTopic === 'Todos' || note.topic === selectedTopic;
      const matchesQuery =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.topic.toLowerCase().includes(q);
      return matchesTopic && matchesQuery;
    });
  }, [notes, selectedTopic, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Apuntes
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 tabular-nums">
            {notes.length} {notes.length === 1 ? 'nota guardada' : 'notas guardadas'}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNote}
          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo apunte</span>
        </button>
      </div>

      {/* Buscador y temas */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en tus apuntes..."
            aria-label="Buscar en tus apuntes"
            className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {availableTopics.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {availableTopics.map((topic) => {
              const active = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all border ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lista vertical de notas */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-base font-semibold text-slate-800">
            {searchQuery || selectedTopic !== 'Todos'
              ? 'No hay apuntes que coincidan'
              : 'Sin apuntes guardados'}
          </p>
          <button
            type="button"
            onClick={onAddNote}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear apunte</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span className="font-semibold text-blue-700">{note.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span>Editado: {formatShortDate(note.updatedAt)}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {note.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50/70 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

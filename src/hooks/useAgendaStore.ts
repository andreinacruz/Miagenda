import { useCallback, useEffect, useState } from 'react';
import { createSampleAgendaState } from '../data/sampleData';
import { AgendaState, CourseClass, CourseNote, CourseTask } from '../types';
import { getTodayKey } from '../utils/dateUtils';

const STORAGE_KEY = 'mi_agenda_aprendizaje_v1';

function loadInitialState(): AgendaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createSampleAgendaState();
    }
    const parsed = JSON.parse(raw) as Partial<AgendaState>;
    if (
      Array.isArray(parsed.classes) &&
      Array.isArray(parsed.tasks) &&
      Array.isArray(parsed.notes)
    ) {
      return {
        classes: parsed.classes,
        tasks: parsed.tasks,
        notes: parsed.notes,
      };
    }
  } catch {
    // Si hay error de lectura, cargar datos de ejemplo
  }
  return createSampleAgendaState();
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function useAgendaStore() {
  const [state, setState] = useState<AgendaState>(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignorar errores de cuota de almacenamiento
    }
  }, [state]);

  // Clases
  const addClass = useCallback((input: Omit<CourseClass, 'id'>) => {
    const newClass: CourseClass = { ...input, id: generateId('cls') };
    setState((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass],
    }));
  }, []);

  const updateClass = useCallback((id: string, input: Omit<CourseClass, 'id'>) => {
    setState((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === id ? { ...input, id } : c)),
    }));
  }, []);

  const deleteClass = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== id),
    }));
  }, []);

  // Tareas
  const addTask = useCallback((input: Omit<CourseTask, 'id'>) => {
    const newTask: CourseTask = { ...input, id: generateId('tsk') };
    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  }, []);

  const updateTask = useCallback((id: string, input: Omit<CourseTask, 'id'>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...input, id } : t)),
    }));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      ),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  // Notas
  const addNote = useCallback((input: Omit<CourseNote, 'id' | 'updatedAt'>) => {
    const newNote: CourseNote = {
      ...input,
      id: generateId('not'),
      updatedAt: getTodayKey(),
    };
    setState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  }, []);

  const updateNote = useCallback((id: string, input: Omit<CourseNote, 'id' | 'updatedAt'>) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...input, id, updatedAt: getTodayKey() } : n
      ),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  }, []);

  const resetSampleData = useCallback(() => {
    setState(createSampleAgendaState());
  }, []);

  return {
    classes: state.classes,
    tasks: state.tasks,
    notes: state.notes,
    addClass,
    updateClass,
    deleteClass,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    addNote,
    updateNote,
    deleteNote,
    resetSampleData,
  };
}

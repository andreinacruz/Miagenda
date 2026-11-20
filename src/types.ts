export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pending' | 'completed';

export type PriorityLevel = 'baja' | 'media' | 'alta';

export interface CourseClass {
  id: string;
  title: string;
  module: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  modality: string;
  description: string;
  priority: PriorityLevel;
}

export interface CourseTask {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  module: string;
  priority: PriorityLevel;
}

export interface CourseNote {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}

export interface AgendaState {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
}

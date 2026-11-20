import { useEffect, useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  GraduationCap,
  Home,
} from 'lucide-react';
import { AccountModal } from './components/AccountModal';
import { ClassFormModal } from './components/ClassFormModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { NoteFormModal } from './components/NoteFormModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { TaskFormModal } from './components/TaskFormModal';
import { CalendarioView } from './components/views/CalendarioView';
import { InicioView } from './components/views/InicioView';
import { NotasView } from './components/views/NotasView';
import { ProgresoView } from './components/views/ProgresoView';
import { TareasView } from './components/views/TareasView';
import { useAgendaStore } from './hooks/useAgendaStore';
import { useAuth } from './hooks/useAuth';
import { CourseClass, CourseNote, CourseTask, TabId } from './types';

interface NavItem {
  id: TabId;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'calendario', label: 'Calendario', icon: Calendar },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  { id: 'notas', label: 'Notas', icon: FileText },
  { id: 'progreso', label: 'Progreso', icon: BarChart3 },
];

type DeleteTarget =
  | { type: 'class'; item: CourseClass }
  | { type: 'task'; item: CourseTask }
  | { type: 'note'; item: CourseNote }
  | { type: 'reset' };

export default function App() {
  const {
    classes,
    tasks,
    notes,
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
  } = useAgendaStore();

  const { user, loginWithGoogle, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabId>('inicio');

  const [classModal, setClassModal] = useState<{
    isOpen: boolean;
    editing: CourseClass | null;
    defaultDate?: string;
  }>({ isOpen: false, editing: null });

  const [taskModal, setTaskModal] = useState<{
    isOpen: boolean;
    editing: CourseTask | null;
    defaultDate?: string;
  }>({ isOpen: false, editing: null });

  const [noteModal, setNoteModal] = useState<{
    isOpen: boolean;
    editing: CourseNote | null;
  }>({ isOpen: false, editing: null });

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = window.setTimeout(() => setFeedbackMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const handleNavigate = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingTasksCount = tasks.filter((t) => t.status === 'pending').length;

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'class') {
      deleteClass(deleteTarget.item.id);
      setFeedbackMessage('Clase eliminada.');
    } else if (deleteTarget.type === 'task') {
      deleteTask(deleteTarget.item.id);
      setFeedbackMessage('Tarea eliminada.');
    } else if (deleteTarget.type === 'note') {
      deleteNote(deleteTarget.item.id);
      setFeedbackMessage('Apunte eliminado.');
    } else if (deleteTarget.type === 'reset') {
      resetSampleData();
      setFeedbackMessage('Datos de ejemplo restaurados.');
    }
    setDeleteTarget(null);
  };

  const getDeleteModalInfo = () => {
    if (!deleteTarget) {
      return { title: '', itemName: '', confirmLabel: 'Sí, eliminar' };
    }
    if (deleteTarget.type === 'class') {
      return {
        title: 'Eliminar clase',
        itemName: deleteTarget.item.title,
        confirmLabel: 'Sí, eliminar clase',
      };
    }
    if (deleteTarget.type === 'task') {
      return {
        title: 'Eliminar tarea',
        itemName: deleteTarget.item.title,
        confirmLabel: 'Sí, eliminar tarea',
      };
    }
    if (deleteTarget.type === 'note') {
      return {
        title: 'Eliminar apunte',
        itemName: deleteTarget.item.title,
        confirmLabel: 'Sí, eliminar apunte',
      };
    }
    return {
      title: 'Restaurar datos de ejemplo',
      itemName: 'los datos actuales y volver al curso inicial de Google AI Studio',
      confirmLabel: 'Sí, restaurar',
    };
  };

  const currentNavItem = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];
  const deleteInfo = getDeleteModalInfo();

  return (
    <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto bg-slate-50 text-slate-900 flex flex-col sm:border-x sm:border-slate-200/80 sm:shadow-xl">
      {/* Barra superior nativa móvil con perfil de Google */}
      <header className="sticky top-0 z-30 h-13 pt-safe px-4 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-slate-900 truncate leading-tight">
              Mi Agenda de Aprendizaje
            </h1>
            <p className="text-[11px] font-medium text-blue-700 leading-tight truncate">
              {currentNavItem.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton variant="compact" />
          <button
            type="button"
            onClick={() => setAccountModalOpen(true)}
            className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center border border-blue-200 active:scale-95 transition-all shadow-xs"
            aria-label="Cuenta de Google"
            title={user.isAuthenticated ? user.email : 'Iniciar sesión con Google'}
          >
            {user.isAuthenticated && user.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <span className="text-xs">G</span>
            )}
          </button>
        </div>
      </header>

      <OfflineIndicator />

      {/* Contenido scrollable exclusivo de teléfono */}
      <main className="flex-1 px-4 pt-4 pb-24">
        {activeTab === 'inicio' && (
          <InicioView
            classes={classes}
            tasks={tasks}
            onNavigate={handleNavigate}
            onAddClass={() => setClassModal({ isOpen: true, editing: null })}
            onEditClass={(cls) =>
              setClassModal({ isOpen: true, editing: cls })
            }
            onDeleteClass={(cls) =>
              setDeleteTarget({ type: 'class', item: cls })
            }
            onAddTask={() => setTaskModal({ isOpen: true, editing: null })}
            onEditTask={(task) =>
              setTaskModal({ isOpen: true, editing: task })
            }
            onDeleteTask={(task) =>
              setDeleteTarget({ type: 'task', item: task })
            }
            onToggleTaskStatus={(id) => {
              toggleTaskStatus(id);
              setFeedbackMessage('Estado de tarea actualizado.');
            }}
          />
        )}

        {activeTab === 'calendario' && (
          <CalendarioView
            classes={classes}
            tasks={tasks}
            onAddClass={(defaultDate) =>
              setClassModal({ isOpen: true, editing: null, defaultDate })
            }
            onEditClass={(cls) =>
              setClassModal({ isOpen: true, editing: cls })
            }
            onDeleteClass={(cls) =>
              setDeleteTarget({ type: 'class', item: cls })
            }
            onAddTask={(defaultDate) =>
              setTaskModal({ isOpen: true, editing: null, defaultDate })
            }
            onEditTask={(task) =>
              setTaskModal({ isOpen: true, editing: task })
            }
            onDeleteTask={(task) =>
              setDeleteTarget({ type: 'task', item: task })
            }
            onToggleTaskStatus={(id) => {
              toggleTaskStatus(id);
              setFeedbackMessage('Estado de tarea actualizado.');
            }}
          />
        )}

        {activeTab === 'tareas' && (
          <TareasView
            tasks={tasks}
            onAddTask={() => setTaskModal({ isOpen: true, editing: null })}
            onEditTask={(task) =>
              setTaskModal({ isOpen: true, editing: task })
            }
            onDeleteTask={(task) =>
              setDeleteTarget({ type: 'task', item: task })
            }
            onToggleTaskStatus={(id) => {
              toggleTaskStatus(id);
              setFeedbackMessage('Estado de tarea actualizado.');
            }}
          />
        )}

        {activeTab === 'notas' && (
          <NotasView
            notes={notes}
            onAddNote={() => setNoteModal({ isOpen: true, editing: null })}
            onEditNote={(note) =>
              setNoteModal({ isOpen: true, editing: note })
            }
            onDeleteNote={(note) =>
              setDeleteTarget({ type: 'note', item: note })
            }
          />
        )}

        {activeTab === 'progreso' && (
          <ProgresoView
            classes={classes}
            tasks={tasks}
            notes={notes}
            onNavigate={handleNavigate}
            onRequestResetSampleData={() => setDeleteTarget({ type: 'reset' })}
          />
        )}
      </main>

      {/* Aviso breve */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-lg whitespace-nowrap"
        >
          {feedbackMessage}
        </div>
      )}

      {/* Barra inferior fija de navegación por pulgar (5 pestañas) */}
      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`h-full min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors relative select-none ${
                  isActive
                    ? 'text-blue-700'
                    : 'text-slate-500 active:text-slate-900'
                }`}
              >
                <div className="relative">
                  <Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={isActive ? 2.4 : 1.9}
                  />
                  {item.id === 'tareas' && pendingTasksCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {pendingTasksCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold tracking-tight leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modales / Bottom Sheets */}
      <AccountModal
        isOpen={accountModalOpen}
        user={user}
        onLogin={(email, name) => {
          loginWithGoogle(email, name);
          setFeedbackMessage(`Sesión iniciada con ${email}`);
        }}
        onLogout={() => {
          logout();
          setFeedbackMessage('Sesión cerrada.');
        }}
        onClose={() => setAccountModalOpen(false)}
      />

      <ClassFormModal
        isOpen={classModal.isOpen}
        editingClass={classModal.editing}
        defaultDate={classModal.defaultDate}
        onClose={() => setClassModal({ isOpen: false, editing: null })}
        onSave={(data) => {
          if (classModal.editing) {
            updateClass(classModal.editing.id, data);
            setFeedbackMessage('Clase actualizada.');
          } else {
            addClass(data);
            setFeedbackMessage('Clase agregada.');
          }
        }}
      />

      <TaskFormModal
        isOpen={taskModal.isOpen}
        editingTask={taskModal.editing}
        defaultDate={taskModal.defaultDate}
        onClose={() => setTaskModal({ isOpen: false, editing: null })}
        onSave={(data) => {
          if (taskModal.editing) {
            updateTask(taskModal.editing.id, data);
            setFeedbackMessage('Tarea actualizada.');
          } else {
            addTask(data);
            setFeedbackMessage('Tarea agregada.');
          }
        }}
      />

      <NoteFormModal
        isOpen={noteModal.isOpen}
        editingNote={noteModal.editing}
        onClose={() => setNoteModal({ isOpen: false, editing: null })}
        onSave={(data) => {
          if (noteModal.editing) {
            updateNote(noteModal.editing.id, data);
            setFeedbackMessage('Apunte actualizado.');
          } else {
            addNote(data);
            setFeedbackMessage('Apunte guardado.');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        title={deleteInfo.title}
        itemName={deleteInfo.itemName}
        confirmLabel={deleteInfo.confirmLabel}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

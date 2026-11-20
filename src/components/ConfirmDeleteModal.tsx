import { BottomSheetModal } from './BottomSheetModal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  itemName,
  confirmLabel = 'Sí, eliminar',
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <BottomSheetModal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-5 pb-2">
        <p className="text-base text-slate-300 leading-relaxed">
          ¿Seguro que quieres eliminar <strong className="font-semibold text-white">"{itemName}"</strong>? Esta acción no se puede deshacer.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 font-semibold text-base active:scale-[0.98] transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-rose-600 text-white font-semibold text-base hover:bg-rose-700 active:scale-[0.98] transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </BottomSheetModal>
  );
}

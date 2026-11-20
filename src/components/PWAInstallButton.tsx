import { Download, Share, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { BottomSheetModal } from './BottomSheetModal';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
}

export function PWAInstallButton({ variant = 'compact' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'full') {
      return (
        <div className="min-h-[48px] px-4 py-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Aplicación instalada en tu teléfono</span>
        </div>
      );
    }
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className={
          variant === 'full'
            ? 'w-full min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all'
            : 'min-h-[40px] px-3 py-1.5 rounded-xl bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 active:scale-[0.97] transition-all whitespace-nowrap shrink-0'
        }
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Instalar app</span>
      </button>
    );
  }

  if (isIOS || variant === 'full') {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className={
            variant === 'full'
              ? 'w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all'
              : 'min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 active:scale-[0.97] transition-all whitespace-nowrap shrink-0'
          }
        >
          <Download className="w-4 h-4 shrink-0 text-blue-700" />
          <span>Instalar app</span>
        </button>

        <BottomSheetModal
          isOpen={showGuide}
          onClose={() => setShowGuide(false)}
          title="Instalar en tu teléfono"
        >
          <div className="space-y-4 pb-2">
            <p className="text-sm text-slate-600 leading-relaxed">
              Agrega <strong>Mi Agenda de Aprendizaje</strong> a la pantalla de inicio de tu teléfono para abrirla en pantalla completa y usarla sin conexión.
            </p>

            {isIOS ? (
              <ol className="space-y-3 text-sm text-slate-800">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    1
                  </span>
                  <span>
                    Toca el botón <strong className="inline-flex items-center gap-1">Compartir <Share className="w-3.5 h-3.5 inline" /></strong> en la barra inferior de Safari.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    2
                  </span>
                  <span>
                    Desliza hacia abajo y selecciona <strong>Agregar a inicio</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    3
                  </span>
                  <span>
                    Toca <strong>Agregar</strong> en la esquina superior derecha.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-sm text-slate-800">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    1
                  </span>
                  <span>
                    Abre el menú de tu navegador móvil (los tres puntos en la esquina superior).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    2
                  </span>
                  <span>
                    Elige <strong>Instalar aplicación</strong> o <strong>Añadir a la pantalla de inicio</strong>.
                  </span>
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base active:scale-[0.98] transition-all"
            >
              Entendido
            </button>
          </div>
        </BottomSheetModal>
      </>
    );
  }

  return null;
}

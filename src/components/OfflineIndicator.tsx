import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-4 mt-3 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2"
    >
      <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
      <span>Modo sin conexión · Tus datos locales siguen disponibles</span>
    </div>
  );
}

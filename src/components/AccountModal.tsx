import React, { useState } from 'react';
import { LogOut, Mail, ShieldCheck, User } from 'lucide-react';
import { UserProfile } from '../hooks/useAuth';
import { BottomSheetModal } from './BottomSheetModal';

interface AccountModalProps {
  isOpen: boolean;
  user: UserProfile;
  onLogin: (email: string, name: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export function AccountModal({
  isOpen,
  user,
  onLogin,
  onLogout,
  onClose,
}: AccountModalProps) {
  const [emailInput, setEmailInput] = useState('andreinacruzvargas458@gmail.com');
  const [nameInput, setNameInput] = useState('Andreina Cruz');
  const [error, setError] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const em = emailInput.trim();
    if (!em || !em.includes('@')) {
      setError('Escribe un correo electrónico válido.');
      return;
    }
    onLogin(em, nameInput.trim());
    setError('');
    onClose();
  };

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} title="Cuenta de Google">
      <div className="space-y-5 pb-2">
        {user.isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-blue-700 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-slate-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-blue-700 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sesión sincronizada</span>
              </div>
              <p className="text-xs leading-relaxed">
                Tu agenda está vinculada a esta cuenta de Google. Puedes cerrar sesión o cambiar de correo cuando quieras.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión de Google</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Iniciar sesión con Google
              </h3>
              <p className="text-sm text-slate-600">
                Usa tu correo @gmail.com favorito para sincronizar tu agenda.
              </p>
            </div>

            {error && (
              <p className="text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="account-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Tu nombre
              </label>
              <input
                id="account-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ej. Andreina Cruz"
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="account-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Correo de Gmail (@gmail.com)
              </label>
              <input
                id="account-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="tucorreo@gmail.com"
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-md"
            >
              <svg className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Acceder con este correo</span>
            </button>
          </form>
        )}
      </div>
    </BottomSheetModal>
  );
}

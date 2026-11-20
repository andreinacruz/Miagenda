import { useEffect, useState } from 'react';

export interface UserProfile {
  email: string;
  name: string;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'mi_agenda_auth_v1';

const DEFAULT_USER: UserProfile = {
  email: 'andreinacruzvargas458@gmail.com',
  name: 'Andreina Cruz',
  isAuthenticated: true,
};

export function useAuth() {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  const loginWithGoogle = (
    email = 'andreinacruzvargas458@gmail.com',
    name = 'Usuario'
  ) => {
    const cleanEmail = email.trim() || 'andreinacruzvargas458@gmail.com';
    const cleanName =
      name.trim() || cleanEmail.split('@')[0] || 'Estudiante';
    setUser({
      email: cleanEmail,
      name: cleanName,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setUser({
      email: '',
      name: '',
      isAuthenticated: false,
    });
  };

  return {
    user,
    loginWithGoogle,
    logout,
  };
}

// components/parents/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      // 1. Llamar al endpoint de logout (borra la cookie)
      await fetch('/api/auth/logout', { 
        method: 'POST' 
      });

      // 2. Limpiar localStorage (datos antiguos)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hs_parent');
        localStorage.removeItem('hs_parent_session');
      }

      // 3. Redirigir al login
      router.push('/parents/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así redirigir
      router.push('/parents/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50"
      style={{ borderColor: 'var(--hs-blue)', color: 'var(--hs-blue)' }}
    >
      {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  );
}

// Para estudiantes
export function StudentLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/student-auth/logout', { 
        method: 'POST' 
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem('hs_student');
        localStorage.removeItem('hs_student_session');
      }

      router.push('/student/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      router.push('/student/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50"
      style={{ borderColor: 'var(--hs-blue)', color: 'var(--hs-blue)' }}
    >
      {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  );
}

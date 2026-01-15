// hooks/useStudentAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type StudentUser = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  // ... otros campos de tu API
};

type AuthState = {
  user: StudentUser | null;
  loading: boolean;
  error: string | null;
};

/**
 * Hook para proteger rutas del portal de estudiantes.
 * Redirige al login si no hay autenticación válida.
 */
export function useStudentAuth(redirectOnError = true) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch("/api/student-auth/me", {
          cache: "no-store",
        });

        if (cancelled) return;

        if (res.status === 401) {
          setState({ user: null, loading: false, error: "No autenticado" });
          
          if (redirectOnError) {
            const currentPath = window.location.pathname;
            router.push(`/academics/login?from=${encodeURIComponent(currentPath)}`);
          }
          return;
        }

        if (!res.ok) {
          setState({ 
            user: null, 
            loading: false, 
            error: `Error ${res.status}` 
          });
          return;
        }

        const data = await res.json();
        setState({ 
          user: data as StudentUser, 
          loading: false, 
          error: null 
        });

      } catch (error) {
        if (cancelled) return;
        setState({ 
          user: null, 
          loading: false, 
          error: error instanceof Error ? error.message : "Error desconocido" 
        });
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router, redirectOnError]);

  return state;
}

export function useStudentAuthOptional() {
  return useStudentAuth(false);
}

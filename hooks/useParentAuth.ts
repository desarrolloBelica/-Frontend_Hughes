// hooks/useParentAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type ParentUser = {
  id: number;
  email: string;
  fullName?: string;
  // ... otros campos de tu API
};

type AuthState = {
  user: ParentUser | null;
  loading: boolean;
  error: string | null;
};

/**
 * Hook para proteger rutas del portal de padres.
 * Redirige al login si no hay autenticación válida.
 * 
 * @param redirectOnError - Si true, redirige al login cuando hay 401
 */
export function useParentAuth(redirectOnError = true) {
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
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (cancelled) return;

        // Usuario no autenticado
        if (res.status === 401) {
          setState({ user: null, loading: false, error: "No autenticado" });
          
          // Redirigir al login
          if (redirectOnError) {
            const currentPath = window.location.pathname;
            router.push(`/parents/login?from=${encodeURIComponent(currentPath)}`);
          }
          return;
        }

        // Error del servidor
        if (!res.ok) {
          setState({ 
            user: null, 
            loading: false, 
            error: `Error ${res.status}` 
          });
          return;
        }

        // Autenticado correctamente
        const data = await res.json();
        setState({ 
          user: data as ParentUser, 
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

/**
 * Hook para obtener usuario sin redirigir (para componentes opcionales)
 */
export function useParentAuthOptional() {
  return useParentAuth(false);
}

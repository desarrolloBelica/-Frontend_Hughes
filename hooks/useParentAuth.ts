// hooks/useParentAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipos para las relaciones de estudiantes
export type StudentSection = {
  id: number;
  documentId?: string;
  name?: string;
  [key: string]: unknown;
};

export type StudentArtGroup = {
  id: number;
  documentId?: string;
  name?: string;
  [key: string]: unknown;
};

export type ParentStudent = {
  id: number;
  documentId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  section?: StudentSection | null;
  art_group?: StudentArtGroup | null;
  [key: string]: unknown;
};

export type ParentUser = {
  id: number;
  documentId?: string;
  email: string;
  fullName?: string;
  students?: ParentStudent[];
  [key: string]: unknown;
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
        // Extraer el objeto parent del response (el backend retorna { parent: {...} })
        const parentData = data?.parent || data;
        setState({ 
          user: parentData as ParentUser, 
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

/**
 * Función para obtener los datos completos del padre (con estudiantes) desde la API de Next.js.
 * Útil para páginas que necesitan los estudiantes para cargar horarios.
 * Esta función usa cookies httpOnly para autenticación (más seguro que localStorage).
 */
export async function fetchParentFromAPI(): Promise<ParentUser | null> {
  try {
    const res = await fetch("/api/auth/me", {
      cache: "no-store",
      credentials: "include", // Asegurar que se envíen las cookies
    });

    if (!res.ok) {
      console.warn("fetchParentFromAPI: respuesta no ok", res.status);
      return null;
    }

    const data = await res.json();
    const parentData = data?.parent || data;
    
    if (!parentData || (!parentData.id && !parentData.documentId)) {
      console.warn("fetchParentFromAPI: datos de padre inválidos", data);
      return null;
    }

    return parentData as ParentUser;
  } catch (error) {
    console.error("fetchParentFromAPI: error", error);
    return null;
  }
}

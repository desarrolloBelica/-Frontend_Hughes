// app/parents/login/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Evita prerender estático cuando dependes de searchParams
export const dynamic = "force-dynamic";

/* ───────────────────────────────
   Helpers de marca / estilos
─────────────────────────────── */
const hs = {
  navy: "#0b1b2b",
  gold: "#ffb800",
};

/* ───────────────────────────────
   Sesión de Padre (localStorage)
─────────────────────────────── */
type ParentSession = {
  id: number;
  email: string;
  fullName?: string;
};


const PARENT_KEY = "hs_parent";
const PARENT_SESSION_KEY = "hs_parent_session";

function saveParentSession(s: ParentSession) {
  try {
    // Guardar en hs_parent
    localStorage.setItem(PARENT_KEY, JSON.stringify(s));
    // Guardar en hs_parent_session (agregando createdAt)
    const session = { ...s, createdAt: new Date().toISOString() };
    localStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(session));
  } catch {
    // no-op
  }
}

/* ───────────────────────────────
   Tipos mínimos de Strapi
─────────────────────────────── */
type StrapiList<T> = { data: Array<{ id: number; attributes: T }>; meta?: unknown };
type ParentAttrs = { fullName?: string; email: string };

/* ───────────────────────────────
   Inner (usa hooks y searchParams)
─────────────────────────────── */
function ParentLoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("from") || "/help-center";

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPass, setShowPass] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) Hacemos el login a través de tu API interna
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: any = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Credenciales inválidas");
      }

      // 2) Extraemos los datos del padre y el token DIRECTAMENTE de la respuesta
      const parentData = data.parent || data.user;
      const uid = parentData?.id || parentData?.documentId;
      const token = data.jwt || data.token || "";
      // Usar el email del backend si está disponible (normalizado), sino el del input
      const normalizedEmail = parentData?.email || email;

      // 3) Creamos el objeto de sesión (Igual que el del estudiante)
      const session = {
        id: uid,
        email: normalizedEmail,
        fullName: parentData?.fullName || parentData?.name || "",
        tokenU: token, // ¡Vital para que funcione la página de horarios!
        createdAt: new Date().toISOString()
      };

      // 4) Guardamos en localStorage
      try {
        localStorage.setItem(PARENT_KEY, JSON.stringify(session));
        localStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(session));
      } catch (err) {
        console.warn("No se pudo escribir en localStorage", err);
      }

      // 5) Redirigimos al portal
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] bg-slate-50">
      {/* Top bar / brand */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-widest text-slate-500">Hughes Schools</p>
            <h1 className="text-base font-semibold" style={{ color: hs.navy }}>
              Parent Portal
            </h1>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero band */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-yellow-50 to-white" />
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow ring-1 ring-slate-200">
                <span className="h-2 w-2 rounded-full bg-[#2e7d32]" />
                <span className="text-xs font-medium text-slate-600">
                  Acceso seguro para Padres de Familia
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: hs.navy }}>
                Bienvenido al Centro de Padres de Familia
              </h2>
              <p className="mt-3 max-w-prose text-slate-600">
                Consulta horarios, Formularios de Pedido de Licencias y Formularios para reservar
                plazas.
              </p>
            </div>

            {/* Card */}
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-100 p-5">
                  <h3 className="text-lg font-semibold" style={{ color: hs.navy }}>
                    Login de Padres de Familia
                  </h3>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-offset-2 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contraseña</label>
                    <div className="flex items-stretch gap-2">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-offset-2 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="whitespace-nowrap rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPass ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60"
                    style={{ background: hs.gold, color: "#111827" }}
                  >
                    {loading ? "Ingresando…" : "Ingresar"}
                    <svg
                      className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    ¿Olvidaste tu contraseña? Contacta a soporte académico.
                  </p>
                </form>
              </div>

              {/* línea decorativa */}
              <div className="pointer-events-none mt-6 h-2 w-full rounded-full" style={{ background: hs.navy }} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-slate-200 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Hughes Schools</span>
          <span className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full" style={{ background: hs.navy }} />
            <span className="h-2 w-2 rounded-full" style={{ background: hs.gold }} />
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────────────────
   Boundary de Suspense requerido
─────────────────────────────── */
export default function Page() {
  return (
    <React.Suspense fallback={null /* o un loader simple */}>
      <ParentLoginInner />
    </React.Suspense>
  );
}

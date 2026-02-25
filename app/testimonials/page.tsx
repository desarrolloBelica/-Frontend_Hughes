"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** ───────────── Tipos (Strapi v4/v5) ───────────── */

type Media = {
  id?: number | string;
  url?: string;
  alternativeText?: string | null;
  formats?: Record<string, { url: string; width: number; height: number }>;
  attributes?: {
    url?: string;
    alternativeText?: string | null;
    formats?: Record<string, { url: string; width: number; height: number }>;
  };
};

type RowV5 = {
  id: number | string;
  name?: string;
  rol?: string;        // Student | Graduate | Parent
  message?: string;
  date?: string;
  photo?: Media[] | Media | null;
};

type RowV4 = {
  id: number | string;
  attributes?: {
    name?: string;
    rol?: string;
    message?: string;
    date?: string;
    photo?: { data?: Media[] | Media | null } | Media[] | Media | null;
  };
};

type Testimonial = RowV4 | RowV5;
type KnownKey = "name" | "rol" | "message" | "date" | "photo";

/** ───────────── Helpers v4/v5 ───────────── */

function getAttr<T = unknown>(row: Testimonial, key: KnownKey): T | undefined {
  const root = row as Record<string, unknown>; // v5
  if (root[key] !== undefined) return root[key] as T;
  const attrs = (row as RowV4).attributes as Record<string, unknown> | undefined; // v4
  if (attrs && attrs[key] !== undefined) return attrs[key] as T;
  return undefined;
}

function getMediaArray(val: unknown): Media[] {
  if (Array.isArray(val)) return val as Media[];
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if ("url" in obj || (obj as { url?: string }).url === undefined) return [obj as Media];
    const d = (obj as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Media[];
    if (d && typeof d === "object") return [d as Media];
  }
  return [];
}

function abs(u?: string | null) {
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}

function mediaUrl(m?: Media | null): string | null {
  if (!m) return null;
  const fmts = m.formats ?? m.attributes?.formats;
  const best = fmts?.medium?.url ?? fmts?.small?.url ?? m.url ?? m.attributes?.url ?? null;
  return abs(best);
}

function mediaAlt(m?: Media | null): string | undefined {
  return m?.alternativeText ?? m?.attributes?.alternativeText ?? undefined;
}

function normalizeRole(raw?: string | null): string {
  const v = (raw ?? "").trim();
  if (!v) return "";
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(); // student -> Student
}

/** ───────────── UI Bits ───────────── */

function RoleChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-hs-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest text-hs-bluenavy shadow-sm">
      {children}
    </span>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl border-2 border-hs-yellow/10 bg-white/5 p-6 md:p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-hs-yellow hover:bg-white/10 flex flex-col justify-between">
      {children}
    </div>
  );
}

/** ───────────── Encabezado con icono ───────────── */

function HeaderIconOnly({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative w-full py-16 md:py-24 text-center overflow-hidden bg-hs-yellow rounded-b-[40px] shadow-lg mb-12">
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        {/* Icono navy (comillas) */}
        <div className="inline-flex items-center justify-center mb-4">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="var(--hs-bluenavy)" aria-hidden>
            <path d="M7 10c1.657 0 3 1.343 3 3 0 1.306-.835 2.417-2 2.83V18H4v-3c0-2.761 2.239-5 5-5zm10 0c1.657 0 3 1.343 3 3 0 1.306-.835 2.417-2 2.83V18h-4v-3c0-2.761 2.239-5 5-5z" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy">
          {title}
        </h1>
        <p className="text-lg md:text-xl mt-4 font-medium text-hs-bluenavy opacity-90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

/** ───────────── Página principal ───────────── */

const PAGE_SIZE = 9;

export default function AllTestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtro de roles
  const [roleFilter, setRoleFilter] = useState<string>("All");

  // Paginación
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("populate[photo]", "true");
        qs.set("pagination[pageSize]", "100");
        const res = await fetch(`${base}/api/testimonials?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json();
        const items: Testimonial[] = Array.isArray(json)
          ? (json as Testimonial[])
          : (json as { data?: Testimonial[] }).data ?? [];
        if (!cancelled) setRows(items);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Roles disponibles dinámicamente
  const availableRoles = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      const val = normalizeRole(getAttr<string>(r, "rol") ?? "");
      if (val) set.add(val);
    });
    const preferred = ["Student", "Graduate", "Parent"];
    const dynamic = Array.from(set);
    dynamic.sort((a, b) => {
      const ai = preferred.indexOf(a);
      const bi = preferred.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return ["All", ...dynamic];
  }, [rows]);

  // Aplicar filtro
  const filteredRows = useMemo(() => {
    if (roleFilter === "All") return rows;
    return rows.filter((r) => normalizeRole(getAttr<string>(r, "rol") ?? "") === roleFilter);
  }, [rows, roleFilter]);

  // Paginación derivada del filtro
  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    setPage(1); // reset al cambiar filtro
  }, [roleFilter]);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  return (
    <main className="min-h-screen bg-hs-bluenavy">
      {/* Header */}
      <HeaderIconOnly
        title="All Testimonials"
        subtitle="Read what students, graduates, and parents say about Hughes Schools."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          
          {/* Filtros por rol */}
          <div className="mb-10 flex flex-wrap items-center gap-3 justify-center">
            {availableRoles.map((r) => {
              const active = r === roleFilter;
              return (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold border-2 transition-all duration-300 ${
                    active 
                      ? "bg-hs-yellow border-hs-yellow text-hs-bluenavy shadow-md scale-105" 
                      : "bg-transparent border-hs-yellow text-hs-yellow hover:bg-hs-yellow/10"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          {/* Grid / Contenido */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="h-[250px] rounded-3xl border-2 border-white/10 bg-white/5 p-8 animate-pulse"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="h-14 w-14 bg-white/10 rounded-full" />
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="h-4 w-32 bg-white/10 rounded" />
                      <div className="h-4 w-16 bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="h-20 w-full bg-white/10 rounded mt-6" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border-2 border-red-500 bg-red-500/10 p-8 text-center text-white font-bold text-lg">
              Error loading testimonials: {error}
            </div>
          ) : total === 0 ? (
            <p className="text-center text-xl text-hs-yellow font-bold py-12">No testimonials match this category yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                {pageItems.map((t) => {
                  const name = (getAttr<string>(t, "name") ?? "Anonymous") as string;
                  const role = normalizeRole(getAttr<string>(t, "rol") ?? "");
                  const msg = (getAttr<string>(t, "message") ?? "") as string;

                  const photoRaw = getAttr(t, "photo");
                  const photoArr = getMediaArray(photoRaw);
                  const photo = photoArr[0] ?? null;
                  const avatarUrl = mediaUrl(photo);
                  const avatarAlt = mediaAlt(photo) ?? name;

                  return (
                    <CardShell key={String(t.id)}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-hs-yellow flex-shrink-0 bg-hs-bluenavy">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={avatarAlt}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-white/10 flex items-center justify-center text-white/50 text-xl font-bold">
                              {name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xl text-white truncate">{name}</div>
                          {role && (
                            <div className="mt-2">
                              <RoleChip>{role}</RoleChip>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <svg className="absolute -top-4 -left-2 w-8 h-8 text-hs-yellow/20 -z-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="leading-relaxed text-base font-medium text-white/90 z-10 relative">
                          {msg}
                        </p>
                      </div>
                    </CardShell>
                  );
                })}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-full px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 border-2 border-hs-yellow bg-transparent text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5 inline-block mr-1" /> Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const active = p === page;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`rounded-full h-10 w-10 flex items-center justify-center text-sm font-bold transition-all ${
                          active
                            ? "bg-hs-yellow text-hs-bluenavy scale-110 shadow-lg"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-full px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 border-2 border-hs-yellow bg-transparent text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy"
                    aria-label="Next page"
                  >
                    Next <ChevronRight className="w-5 h-5 inline-block ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
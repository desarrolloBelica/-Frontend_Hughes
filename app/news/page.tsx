"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Evita el prerender estático (útil si dependes de searchParams)
export const dynamic = "force-dynamic";

/* ───────────── Tipos v4/v5 ───────────── */

type Media = {
  id?: number | string;
  url?: string;
  alternativeText?: string | null;
  attributes?: {
    url?: string;
    alternativeText?: string | null;
  };
};

type KnownFieldKey = "title" | "slug" | "date" | "gallery" | "featured_image";

type NewsV5 = {
  id: number | string;
  title?: string;
  slug?: string;
  date?: string;
  gallery?: Media[] | Media | null;
  featured_image?: Media | null;
};

type NewsV4 = {
  id: number | string;
  attributes?: {
    title?: string;
    slug?: string;
    date?: string;
    gallery?: { data?: Media[] | Media | null } | Media[] | Media | null;
    featured_image?: { data?: Media | null } | Media | null;
  };
};

type News = NewsV4 | NewsV5;

/* ───────────── Helpers v4/v5 ───────────── */

function getAttr<T = unknown>(row: News, key: KnownFieldKey): T | undefined {
  if ((row as Record<string, unknown>)[key] !== undefined) {
    return (row as Record<string, unknown>)[key] as T; // v5 directo
  }
  const attrs = (row as NewsV4).attributes as Record<string, unknown> | undefined; // v4
  if (attrs && attrs[key] !== undefined) {
    return attrs[key] as T;
  }
  return undefined;
}

function getMediaArray(val: unknown): Media[] {
  if (Array.isArray(val)) return val as Media[];
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if (typeof (obj as { url?: string }).url === "string" || (obj as { url?: string }).url === undefined) {
      return [obj as Media]; // v5: objeto media directo
    }
    const d = obj.data as unknown; // v4: { data }
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
  if (typeof m?.url === "string") return abs(m.url);
  if (m?.attributes?.url) return abs(m.attributes.url);
  return null;
}

function mediaAlt(m?: Media | null): string | undefined {
  return m?.alternativeText ?? m?.attributes?.alternativeText ?? undefined;
}

function pickCover(item: News): { url: string; alt: string } | null {
  const title = (getAttr<string>(item, "title") ?? "") as string;

  const galRaw = getAttr(item, "gallery");
  const galArr = getMediaArray(galRaw);
  const first = galArr[0];
  if (first) {
    const u = mediaUrl(first);
    if (u) return { url: u, alt: mediaAlt(first) ?? title };
  }

  const fiRaw = getAttr(item, "featured_image");
  const fiArr = getMediaArray(fiRaw);
  const fi = fiArr[0] ?? null;
  const u = mediaUrl(fi);
  if (u) return { url: u, alt: mediaAlt(fi) ?? title };

  return null;
}

function detailHref(item: News): string {
  const slug = (getAttr<string>(item, "slug") ?? "").trim();
  if (slug) return `/news/${encodeURIComponent(slug)}`;
  return `/news/${encodeURIComponent(String(item.id))}`;
}

/* ───────────── Constantes ───────────── */

const PAGE_SIZE = 9; // 9 por página
type SortOrder = "desc" | "asc";

/* ───────────── Botón Read More ───────────── */

function ReadMore({ href }: { href: string }) {
  return (
    <a href={href} className="group inline-flex items-center mt-4">
      <span className="relative text-lg font-bold text-hs-bluenavy">
        Read more
        <span
          // CAMBIO: La línea que aparece en hover ahora es azul navy
          className="absolute left-0 -bottom-1 h-[3px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-hs-bluenavy"
        />
      </span>
    </a>
  );
}

/* ───────────── Componente interno (usa useSearchParams) ───────────── */

function AllNewsInner() {
  const router = useRouter();
  const params = useSearchParams();

  const pageParam = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const sortParam = (params.get("sort") as SortOrder) || "desc";

  const [sortOrder, setSortOrder] = useState<SortOrder>(sortParam === "asc" ? "asc" : "desc");
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("populate[gallery]", "true");
        qs.set("populate[featured_image]", "true");
        qs.set("pagination[pageSize]", "100");
        const res = await fetch(`${base}/api/newspapers?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as { data?: News[] } | News[];
        const items: News[] = Array.isArray(json) ? json : json?.data ?? [];
        if (!cancelled) setData(items);
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

  // Orden configurable por fecha (desc/asc)
  const sorted = useMemo(() => {
    const a = [...data];
    a.sort((x, y) => {
      const dx = new Date((getAttr<string>(x, "date") ?? "") as string).getTime();
      const dy = new Date((getAttr<string>(y, "date") ?? "") as string).getTime();
      const xNaN = Number.isNaN(dx);
      const yNaN = Number.isNaN(dy);

      if (xNaN && yNaN) return 0;
      if (sortOrder === "desc") {
        if (xNaN) return 1; // sin fecha al final
        if (yNaN) return -1;
        return dy - dx; // más nuevo primero
      } else {
        if (xNaN) return -1; // sin fecha al inicio
        if (yNaN) return 1;
        return dx - dy; // más antiguo primero
      }
    });
    return a;
  }, [data, sortOrder]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageParam, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(start, start + PAGE_SIZE);

  function setQuery(next: { page?: number; sort?: SortOrder }) {
    const search = new URLSearchParams(params.toString());
    if (next.page) search.set("page", String(next.page));
    if (next.sort) search.set("sort", next.sort);
    router.push(`/news?${search.toString()}`, { scroll: true });
  }

  // Sincroniza selector con el querystring
  useEffect(() => {
    const qSort = (params.get("sort") as SortOrder) || "desc";
    if (qSort !== sortOrder) setSortOrder(qSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    // CAMBIO: Fondo general a hs-yellow
    <main className="min-h-screen bg-hs-yellow py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Encabezado */}
        <div className="mb-12 flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 text-center">
            {/* Pequeño acento decorativo (navy) */}
            <span aria-hidden className="inline-block h-4 w-4 rounded-full bg-hs-bluenavy" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy leading-tight">
              Hughes Schools Newspaper
            </h1>
          </div>

          <p className="text-center text-lg md:text-xl font-medium text-hs-bluenavy opacity-90">
            Updates and highlights from our community.
          </p>

          {/* Controles: Orden */}
          <div className="mt-6 flex w-full items-center justify-end gap-3">
            <label htmlFor="orderBy" className="text-base font-bold text-hs-bluenavy">Order by</label>
            <select
              id="orderBy"
              value={sortOrder}
              onChange={(e) => {
                const next = (e.target.value as SortOrder) || "desc";
                setQuery({ page: 1, sort: next });
              }}
              className="rounded-full border-2 border-hs-bluenavy bg-transparent px-5 py-2.5 text-base font-bold text-hs-bluenavy focus:outline-none focus:ring-2 focus:ring-hs-bluenavy/50 cursor-pointer"
            >
              <option value="desc">Newest → Oldest</option>
              <option value="asc">Oldest → Newest</option>
            </select>
          </div>
        </div>

        {/* Grid con animación */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="h-[400px] bg-hs-bluenavy/10 rounded-3xl animate-pulse border-2 border-hs-bluenavy/20" />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl border-2 border-red-500 bg-red-500/10 p-8 text-center text-hs-bluenavy font-bold text-lg"
            >
              Error loading news: {error}
            </motion.div>
          ) : total === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-xl font-bold text-hs-bluenavy py-12"
            >
              No news published yet.
            </motion.p>
          ) : (
            <motion.div
              key={`page-${page}-${sortOrder}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {pageItems.map((item) => {
                const title = (getAttr<string>(item, "title") ?? "Untitled") as string;
                const cover = pickCover(item);
                const href = detailHref(item);
                const date = (getAttr<string>(item, "date") ?? "") as string;

                return (
                  <article key={String(item.id)} className="group flex flex-col h-full">
                    {/* Contenedor de la imagen (Navy background si no hay foto, y borde para contraste) */}
                    <a href={href} className="block relative overflow-hidden rounded-3xl border-2 border-hs-bluenavy shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                      <div className="relative aspect-[16/10] w-full bg-hs-bluenavy">
                        {cover ? (
                          <Image
                            src={cover.url}
                            alt={cover.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-hs-yellow/50 font-bold">No Image</div>
                        )}
                      </div>
                    </a>
                    
                    {/* Textos de la tarjeta */}
                    <div className="mt-6 flex-grow flex flex-col items-start px-2">
                      <div className="text-sm font-bold tracking-widest uppercase text-hs-bluenavy opacity-80 mb-2">
                        {date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'}) : "No Date"}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-hs-bluenavy mb-4 line-clamp-3">
                        {title}
                      </h3>
                      <div className="mt-auto">
                        <ReadMore href={href} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-3">
            <button
              className="rounded-full border-2 border-hs-bluenavy p-3 text-hs-bluenavy hover:bg-hs-bluenavy hover:text-hs-yellow transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-hs-bluenavy"
              onClick={() => setQuery({ page: Math.max(1, page - 1), sort: sortOrder })}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const active = p === page;
              return (
                <button
                  key={p}
                  onClick={() => setQuery({ page: p, sort: sortOrder })}
                  className={`h-12 w-12 rounded-full border-2 font-bold text-base transition-all ${
                    active 
                      ? "bg-hs-bluenavy border-hs-bluenavy text-hs-yellow scale-110 shadow-lg" 
                      : "border-hs-bluenavy text-hs-bluenavy hover:bg-hs-bluenavy/10"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}
            
            <button
               className="rounded-full border-2 border-hs-bluenavy p-3 text-hs-bluenavy hover:bg-hs-bluenavy hover:text-hs-yellow transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-hs-bluenavy"
              onClick={() => setQuery({ page: Math.min(totalPages, page + 1), sort: sortOrder })}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/* ───────────── Boundary de Suspense ───────────── */
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hs-yellow" />}>
      <AllNewsInner />
    </Suspense>
  );
}
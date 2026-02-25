"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* ───────── Tipos ───────── */
export const TYPES = ["All", "Academic", "Performing Arts", "Other"] as const;
export type EventType = (typeof TYPES)[number];

type Media = {
  id?: number | string;
  url?: string;
  alternativeText?: string | null;
  attributes?: {
    url?: string;
    alternativeText?: string | null;
  };
};

type KnownFieldKey = "title" | "type" | "gallery" | "featured_image" | "slug" | "date";

type BlogV5 = {
  id: number | string;
  title?: string;
  type?: string;
  slug?: string;
  date?: string;
  gallery?: Media[] | Media | null;
  featured_image?: Media | null;
};

type BlogV4 = {
  id: number | string;
  attributes?: {
    title?: string;
    type?: string;
    slug?: string;
    date?: string;
    gallery?:
      | { data?: Media[] | Media | null }
      | Media[]
      | Media
      | null;
    featured_image?:
      | { data?: Media | null }
      | Media
      | null;
  };
};

type Blog = BlogV4 | BlogV5;

/* ───────── Helpers de tipo ───────── */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getAttr<T = unknown>(row: Blog, key: KnownFieldKey): T | undefined {
  if (isRecord(row) && key in row) {
    return (row as Record<KnownFieldKey, unknown>)[key] as T; // v5
  }
  const attrs = (row as { attributes?: unknown }).attributes;
  if (isRecord(attrs) && key in attrs) {
    return (attrs as Record<KnownFieldKey, unknown>)[key] as T; // v4
  }
  return undefined;
}

function getMediaArray(val: unknown): Media[] {
  if (Array.isArray(val)) return val as Media[];
  if (isRecord(val)) {
    if ("url" in val) return [val as Media]; // v5: media directo
    const d = (val as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Media[];
    if (isRecord(d)) return [d as Media];
  }
  return [];
}

function abs(u?: string | null): string | null {
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}

function mediaUrl(m?: Media | null): string | null {
  if (!m) return null;
  if (typeof m.url === "string") return abs(m.url);
  if (m.attributes?.url) return abs(m.attributes.url);
  return null;
}

function mediaAlt(m?: Media | null): string | undefined {
  return m?.alternativeText ?? m?.attributes?.alternativeText ?? undefined;
}

function normalizeCover(blog: Blog): { url: string; alt: string } | null {
  const title = (getAttr<string>(blog, "title") ?? "") as string;

  const gRaw = getAttr(blog, "gallery");
  const gArr = getMediaArray(gRaw);
  const first = gArr[0];
  const u1 = mediaUrl(first);
  if (u1) return { url: u1, alt: mediaAlt(first) ?? title };

  const fRaw = getAttr(blog, "featured_image");
  const fArr = getMediaArray(fRaw);
  const f = fArr[0] ?? null;
  const u2 = mediaUrl(f);
  if (u2) return { url: u2, alt: mediaAlt(f) ?? title };

  return null;
}

function recapHref(item: Blog): string {
  const slug = (getAttr<string>(item, "slug") ?? "").trim();
  return slug ? `/events/${encodeURIComponent(slug)}` : `/events/${encodeURIComponent(String(item.id))}`;
}

/* ───────── Constantes ───────── */
const PAGE_SIZE = 6;

/* ───────── Props ───────── */
type Props = {
  initialType: EventType;
  initialPage: number;
};

/* ───────── Component ───────── */
export default function EventsClient({ initialType, initialPage }: Props) {
  const router = useRouter();

  const [typeParam, setTypeParam] = useState<EventType>(initialType);
  const [pageParam, setPageParam] = useState<number>(initialPage);

  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("populate[gallery]", "true");
        qs.set("populate[featured_image]", "true");
        qs.set("pagination[pageSize]", "100");

        const res = await fetch(`${base}/api/blogs?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: unknown = await res.json();
        const items: Blog[] = Array.isArray(json)
          ? (json as Blog[])
          : (isRecord(json) && Array.isArray(json.data) ? (json.data as Blog[]) : []);

        if (!cancelled) setData(items);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = data;
    if (typeParam !== "All") {
      result = data.filter((b) => (getAttr<string>(b, "type") || "") === typeParam);
    }
    // Ordenar por fecha descendente (más recientes primero)
    return result.sort((a, b) => {
      const dateA = new Date((getAttr<string>(a, "date") ?? "") as string).getTime();
      const dateB = new Date((getAttr<string>(b, "date") ?? "") as string).getTime();
      if (Number.isNaN(dateA)) return 1;
      if (Number.isNaN(dateB)) return -1;
      return dateB - dateA;
    });
  }, [data, typeParam]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageParam, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  function pushQuery(next: { page?: number; type?: EventType }) {
    const nextType = next.type ?? typeParam;
    const nextPage = next.page ?? (next.type ? 1 : pageParam);

    const qs = new URLSearchParams();
    if (nextType !== "All") qs.set("type", nextType);
    if (nextPage > 1) qs.set("page", String(nextPage));

    setTypeParam(nextType);
    setPageParam(nextPage);
    router.push(qs.toString() ? `/events?${qs.toString()}` : "/events", { scroll: true });
  }

  return (
    <main className="min-h-screen bg-hs-yellow py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Encabezado */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-hs-bluenavy text-hs-yellow font-bold text-sm uppercase tracking-wider shadow-sm">
            <CalendarDays className="w-4 h-4" /> Event Recaps
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy leading-tight">
            All Events
          </h1>
          <p className="text-lg md:text-xl font-medium text-hs-bluenavy opacity-90 max-w-2xl">
            Browse our academic, performing arts, and other unforgettable moments.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {TYPES.map((t) => {
            const active = t === typeParam;
            return (
              <button
                key={t}
                className={`rounded-full px-6 py-2.5 text-sm md:text-base font-bold border-2 transition-all duration-300 ${
                  active 
                    ? "bg-hs-bluenavy border-hs-bluenavy text-hs-yellow shadow-md scale-105" 
                    : "bg-transparent border-hs-bluenavy text-hs-bluenavy hover:bg-hs-bluenavy/10"
                }`}
                onClick={() => pushQuery({ type: t })}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Grid */}
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
              Error loading events: {error}
            </motion.div>
          ) : total === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-xl font-bold text-hs-bluenavy py-12"
            >
              No events published yet.
            </motion.p>
          ) : (
            <motion.div
              key={`${typeParam}-${page}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {pageItems.map((item) => {
                const title = (getAttr<string>(item, "title") ?? "Untitled") as string;
                const type = (getAttr<string>(item, "type") ?? "") as string;
                const cover = normalizeCover(item);
                const href = recapHref(item);

                return (
                  <article key={String(item.id)} className="group flex flex-col h-full">
                    <Link href={href} className="block relative overflow-hidden rounded-3xl border-2 border-hs-bluenavy shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
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
                    </Link>
                    
                    <div className="mt-6 flex-grow flex flex-col items-start px-2">
                      <div className="text-sm font-bold tracking-widest uppercase text-hs-bluenavy opacity-80 mb-2">
                        {type || "Event"}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-hs-bluenavy mb-4 line-clamp-3">
                        {title}
                      </h3>
                      <div className="mt-auto">
                        <Link href={href} className="group/link inline-flex items-center">
                          <span className="relative text-lg font-bold text-hs-bluenavy">
                            Read more
                            <span
                              className="absolute left-0 -bottom-1 h-[3px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100 bg-hs-bluenavy"
                            />
                          </span>
                        </Link>
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
              onClick={() => pushQuery({ page: Math.max(1, page - 1) })}
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
                  onClick={() => pushQuery({ page: p })}
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
              onClick={() => pushQuery({ page: Math.min(totalPages, page + 1) })}
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
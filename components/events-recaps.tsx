"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// ───────────── Tipos ─────────────
type Media = {
  id?: number | string;
  url?: string;
  alternativeText?: string | null;
  attributes?: {
    url?: string;
    alternativeText?: string | null;
  };
};

type KnownFieldKey = "title" | "type" | "gallery" | "featured_image" | "slug" | "date" | "publishedAt" | "createdAt";

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
    gallery?: { data?: Media[] | Media | null } | Media[] | Media | null;
    featured_image?: { data?: Media | null } | Media | null;
  };
};

type Blog = BlogV4 | BlogV5;

// ───────────── Helpers v4/v5 ─────────────
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getAttr<T = unknown>(row: Blog, key: KnownFieldKey): T | undefined {
  if (isRecord(row) && key in row) return (row as Partial<Record<KnownFieldKey, unknown>>)[key] as T;
  const attrs = (row as { attributes?: unknown }).attributes;
  if (isRecord(attrs) && key in attrs) return (attrs as Partial<Record<KnownFieldKey, unknown>>)[key] as T;
  return undefined;
}

function getMediaArray(val: unknown): Media[] {
  if (Array.isArray(val)) return val as Media[];
  if (isRecord(val)) {
    if ("url" in val) return [val as Media];
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

function parseDateMs(val?: string): number {
  if (!val) return 0;
  const t = Date.parse(val);
  return Number.isFinite(t) ? t : 0;
}

// ───────────── Página ─────────────
export default function EventsRecaps({ viewAllHref = "/events" }: { viewAllHref?: string }) {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

        const params = new URLSearchParams();
        params.set("populate[gallery]", "true");
        params.set("populate[featured_image]", "true");
        params.set("pagination[pageSize]", "25");
        params.set("pagination[page]", "1");
        // Some Strapi setups reject unknown fields; sort by publishedAt/createdAt to be safe.
        params.set("sort[0]", "publishedAt:desc");
        params.set("sort[1]", "createdAt:desc");

        const res = await fetch(`${base}/api/blogs?${params.toString()}`);
        if (!res.ok) {
          // Try to surface the Strapi error message for easier debugging.
          let detail = "";
          try {
            const errJson = (await res.json()) as { error?: { message?: string; details?: unknown } };
            detail = errJson?.error?.message ? ` - ${errJson.error.message}` : "";
          } catch {
            try {
              detail = ` - ${(await res.text()).slice(0, 200)}`;
            } catch {
              detail = "";
            }
          }
          throw new Error(`HTTP ${res.status}${detail}`);
        }

        const json: unknown = await res.json();
        const items: Blog[] = Array.isArray(json)
          ? (json as Blog[])
          : (isRecord(json) && Array.isArray((json as { data?: unknown }).data)
              ? ((json as { data: Blog[] }).data)
              : []);

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

  const slides = useMemo(() => {
    const mapped = data
      .map((b) => {
        const cover = normalizeCover(b);
        if (!cover) return null;
        const title = (getAttr<string>(b, "title") ?? "Untitled") as string;
        const type = (getAttr<string>(b, "type") ?? "") as string;
        const date =
          (getAttr<string>(b, "date") ??
            getAttr<string>(b, "publishedAt") ??
            getAttr<string>(b, "createdAt") ??
            "") as string;
        const href = recapHref(b);
        return {
          id: String((b as { id?: unknown }).id ?? title),
          title,
          type,
          date,
          href,
          cover,
        };
      })
      .filter(Boolean) as {
        id: string;
        title: string;
        type: string;
        date: string;
        href: string;
        cover: { url: string; alt: string };
      }[];

    mapped.sort((a, b) => {
      const diff = parseDateMs(b.date) - parseDateMs(a.date);
      if (diff !== 0) return diff;
      return b.id.localeCompare(a.id);
    });

    return mapped.slice(0, 8);
  }, [data]);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[index] ?? null;
  const bg = "radial-gradient(circle at 15% 20%, #fff6d4 0, #f6f7fb 35%, #f6f7fb 100%)";

  return (
    <section className="w-full py-14" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-hughes-blue shadow-sm" style={{ border: "1px solid var(--hs-yellow)" }}>
              <Sparkles className="h-4 w-4" /> Últimos eventos
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-hughes-blue">
              Mira lo reciente y entra al recap
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--hs-yellow)] px-4 py-2 text-sm font-semibold text-hughes-blue transition hover:bg-yellow-100"
          >
            Ver todos
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl border bg-white shadow-[0_10px_50px_-25px_rgba(0,0,0,0.35)]" style={{ borderColor: "#ececf4" }}>
          {loading ? (
            <div className="aspect-[16/8] w-full animate-pulse bg-gray-100" />
          ) : error ? (
            <div className="aspect-[16/8] w-full grid place-content-center text-center text-hughes-blue p-8">
              Error al cargar eventos: {error}
            </div>
          ) : current ? (
            <div className="relative aspect-[16/8] w-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0.4, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={current.cover.url}
                    alt={current.cover.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.58)] via-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0.05)]" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-hughes-blue">
                    {current.type || "Evento"}
                  </span>
                  {current.date && (
                    <span className="text-xs font-semibold text-white/90">
                      {new Date(current.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                  {current.title}
                </h3>
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <Link
                    href={current.href}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-hughes-blue shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Leer recap
                  </Link>
                  <span className="text-xs font-semibold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">
                    Últimos eventos
                  </span>
                </div>
              </div>

              {slides.length > 1 && (
                <>
                  <button
                    aria-label="Anterior"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-hughes-blue shadow hover:bg-white"
                    onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    aria-label="Siguiente"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-hughes-blue shadow hover:bg-white"
                    onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                    {slides.map((s, i) => (
                      <button
                        key={s.id}
                        aria-label={`Ir al evento ${s.title}`}
                        className="h-2.5 rounded-full transition-all"
                        style={{
                          width: i === index ? "32px" : "10px",
                          backgroundColor: i === index ? "var(--hs-yellow)" : "rgba(255,255,255,0.7)",
                        }}
                        onClick={() => setIndex(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-[16/8] w-full grid place-content-center text-center text-hughes-blue p-8">
              No hay eventos disponibles.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

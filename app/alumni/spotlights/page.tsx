"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

type RowV5 = {
  id: number | string;
  documentId?: string;
  fullname?: string;
  city?: string;
  university?: string;
  profession?: string;
  graduationYear?: string; // date string
  artisticPath?: string;
  biography?: string;
  hughesImpact?: string;
  messageForStudents?: string;
  approved?: boolean;
  createdAt?: string;
};

type RowV4 = {
  id: number | string;
  attributes?: Omit<RowV5, "id">;
};

type Spotlight = RowV4 | RowV5;

function sAttr<T = unknown>(row: Spotlight, key: keyof RowV5): T | undefined {
  const root = row as Record<string, unknown>;
  if (root[key as string] !== undefined) return root[key as string] as T; // v5
  const attrs = (row as RowV4).attributes as Record<string, unknown> | undefined;
  if (attrs && attrs[key as string] !== undefined) return attrs[key as string] as T;
  return undefined;
}

function parseYear(d?: string | number): number | null {
  if (d === undefined || d === null) return null;
  if (typeof d === "number") {
    return d > 1900 && d < 3000 ? d : null;
  }
  const raw = d.trim();
  const match = raw.match(/\b(19|20)\d{2}\b/);
  if (match) {
    const n = Number(match[0]);
    return Number.isNaN(n) ? null : n;
  }
  const n = new Date(raw).getFullYear();
  return Number.isNaN(n) ? null : n;
}

const PAGE_SIZE = 10;

export default function SpotlightsListPage() {
  const [rows, setRows] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<string>("");
  const [sort, setSort] = useState<"createdAt" | "gradAsc" | "gradDesc">("createdAt");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

        async function tryFetch(url: string): Promise<Spotlight[] | null> {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) return null;
          const json: unknown = await res.json();
          if (Array.isArray(json)) return json as Spotlight[];
          const data = (json as { data?: Spotlight[] }).data;
          if (Array.isArray(data)) return data;
          return null;
        }

        const attempts = [
          `${base}/api/spothights?filters[approved][$eq]=true&pagination[pageSize]=200&sort[0]=createdAt:desc&populate[medias]=*`,
          `${base}/api/spothights?filters[approved][$eq]=true&pagination[pageSize]=200&populate[medias]=*`,
          `${base}/api/spothights?pagination[pageSize]=200&populate[medias]=*`,
          `${base}/api/spothights?pagination[pageSize]=200`,
        ];

        let rowsFetched: Spotlight[] | null = null;
        for (const url of attempts) {
          rowsFetched = await tryFetch(url);
          if (rowsFetched) break;
        }

        if (!rowsFetched) throw new Error("Unable to load spotlights (all attempts failed)");

        const approvedOnly = rowsFetched.filter((r) => sAttr<boolean>(r, "approved") ?? false);
        if (!cancelled) setRows(approvedOnly);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const yr = year.trim();
    return rows.filter((r) => {
      if (!yr) return true;
      const gy = parseYear(sAttr<string | number>(r, "graduationYear"));
      if (gy !== null && String(gy) === yr) return true;
      const raw = sAttr<string | number>(r, "graduationYear");
      const rawStr = raw !== undefined && raw !== null ? String(raw) : "";
      return rawStr.includes(yr);
    });
  }, [rows, year]);

  const sorted = useMemo(() => {
    const a = [...filtered];
    if (sort === "createdAt") {
      a.sort((x, y) => {
        const dx = new Date((sAttr<string>(x, "createdAt") ?? "") as string).getTime();
        const dy = new Date((sAttr<string>(y, "createdAt") ?? "") as string).getTime();
        return dy - dx;
      });
    } else if (sort === "gradAsc" || sort === "gradDesc") {
      a.sort((x, y) => {
        const gx = parseYear(sAttr<string>(x, "graduationYear")) ?? 0;
        const gy = parseYear(sAttr<string>(y, "graduationYear")) ?? 0;
        return sort === "gradAsc" ? gx - gy : gy - gx;
      });
    }
    return a;
  }, [filtered, sort]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  useEffect(() => {
    setPage(1); 
  }, [year, sort]);

  return (
    <main className="min-h-screen bg-hs-bluenavy">
      <section className="relative w-full overflow-hidden pb-24">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--hs-yellow)_0%,_transparent_60%)] blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 md:pt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-white mb-16">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-hs-yellow/10 border-2 border-hs-yellow/30 px-5 py-2 text-sm font-bold uppercase tracking-widest text-hs-yellow">
                Alumni Spotlights
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Stories that carry <br/> Hughes forward.
              </h1>
              <p className="text-lg font-medium opacity-90 leading-relaxed">
                Read journeys from our graduates, filter by year, and see how they lead across arts, science, business, and service.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/alumni/spotlights/submit" className="inline-flex rounded-full bg-hs-yellow text-hs-bluenavy font-bold px-6 py-3 hover:bg-white transition-colors">
                  Share your spotlight
                </Link>
                <Link href="/alumni" className="inline-flex rounded-full border-2 border-hs-yellow text-hs-yellow font-bold px-6 py-3 hover:bg-hs-yellow hover:text-hs-bluenavy transition-colors">
                  Back to Alumni
                </Link>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="rounded-3xl border-2 border-hs-bluenavy/50 bg-white/5 p-6 backdrop-blur-md">
              <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-3">Graduation Year</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2022"
                  className="w-full rounded-full border-2 border-white/20 bg-transparent py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-hs-yellow transition-colors"
                />
              </div>
            </div>

            <div className="rounded-3xl border-2 border-hs-bluenavy/50 bg-white/5 p-6 backdrop-blur-md">
              <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-3">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full rounded-full border-2 border-white/20 bg-hs-bluenavy py-3 px-4 text-white focus:outline-none focus:border-hs-yellow transition-colors cursor-pointer appearance-none"
              >
                <option value="createdAt">Newest first (created)</option>
                <option value="gradDesc">Graduation year: Newest</option>
                <option value="gradAsc">Graduation year: Oldest</option>
              </select>
            </div>

            <div className="rounded-3xl border-2 border-hs-yellow/30 bg-hs-yellow/10 p-6 flex flex-col justify-center">
              <div className="text-3xl font-extrabold text-hs-yellow">{total}</div>
              <div className="text-base font-bold text-white opacity-90 uppercase tracking-widest mt-1">Spotlight{total === 1 ? "" : "s"} found</div>
            </div>
          </div>

          {/* Grid de Resultados */}
          <div className="grid gap-8 md:grid-cols-2">
            {loading && <div className="col-span-full text-center text-xl font-bold text-hs-yellow animate-pulse py-12">Loading spotlights…</div>}
            {error && <div className="col-span-full text-center p-8 bg-red-500/20 border-2 border-red-500 rounded-3xl text-white font-bold">{error}</div>}
            {!loading && !error && sorted.length === 0 && <div className="col-span-full text-center text-xl font-bold text-white/70 py-12">No spotlights found for this year.</div>}

            {pageItems.map((s) => {
              const id = sAttr<string>(s, "documentId") ?? String((s as { id?: unknown }).id ?? "");
              const fullName = (sAttr<string>(s, "fullname") ?? "Anonymous").trim();
              const gy = parseYear(sAttr<string>(s, "graduationYear"));
              const city = sAttr<string>(s, "city") ?? "";
              const university = sAttr<string>(s, "university") ?? "";
              const profession = sAttr<string>(s, "profession") ?? "";

              return (
                <article
                  key={id}
                  className="group rounded-[32px] border-2 border-white/10 bg-white/5 p-8 shadow-xl hover:bg-white/10 hover:border-hs-yellow transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-hs-yellow transition-colors leading-tight">
                        {fullName}{gy ? <span className="opacity-70"> · {gy}</span> : ""}
                      </h3>
                    </div>
                    
                    <p className="text-base font-medium text-white/80 leading-relaxed min-h-[3rem]">
                      {[city, university, profession].filter(Boolean).join(" · ")}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                       <span className="inline-flex items-center gap-2 rounded-full bg-hs-yellow/20 px-3 py-1.5 text-xs font-bold text-hs-yellow uppercase tracking-widest">
                        Spotlight
                      </span>
                      <Link
                        href={`/alumni/spotlights/${encodeURIComponent(id)}`}
                        className="inline-flex items-center text-base font-bold text-hs-yellow group-hover:underline"
                      >
                        Read story <ChevronRight className="w-5 h-5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-hs-yellow text-hs-yellow disabled:opacity-30 disabled:hover:bg-transparent hover:bg-hs-yellow hover:text-hs-bluenavy transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white font-bold text-lg">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-hs-yellow text-hs-yellow disabled:opacity-30 disabled:hover:bg-transparent hover:bg-hs-yellow hover:text-hs-bluenavy transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
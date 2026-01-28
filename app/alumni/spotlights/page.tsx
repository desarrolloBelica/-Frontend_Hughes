"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const HS_YELLOW = "var(--hs-yellow)";
const HS_BLUE = "var(--hs-blue)";
const HS_NAVY = "var(--hs-bluenavy)";
const HS_BLUE_MEDIUM = "var(--hs-blue-medium)";

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
  // Handle numeric years directly
  if (typeof d === "number") {
    return d > 1900 && d < 3000 ? d : null;
  }
  const raw = d.trim();
  // Try direct 4-digit year
  const match = raw.match(/\b(19|20)\d{2}\b/);
  if (match) {
    const n = Number(match[0]);
    return Number.isNaN(n) ? null : n;
  }
  // Fallback: Date parse
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
          // Primary: filter approved and populate medias
          `${base}/api/spothights?filters[approved][$eq]=true&pagination[pageSize]=200&sort[0]=createdAt:desc&populate[medias]=*`,
          // Fallback: remove sort
          `${base}/api/spothights?filters[approved][$eq]=true&pagination[pageSize]=200&populate[medias]=*`,
          // Fallback: no filters (we will filter approved client-side)
          `${base}/api/spothights?pagination[pageSize]=200&populate[medias]=*`,
          // Last resort: no populate
          `${base}/api/spothights?pagination[pageSize]=200`,
        ];

        let rowsFetched: Spotlight[] | null = null;
        for (const url of attempts) {
          rowsFetched = await tryFetch(url);
          if (rowsFetched) break;
        }

        if (!rowsFetched) throw new Error("Unable to load spotlights (all attempts failed)");

        // Keep only approved client-side to be safe
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

  // Pagination derived from sorted
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  useEffect(() => {
    setPage(1); // reset when filters change
  }, [year, sort]);

  return (
    <main className="min-h-screen" style={{ background: "#f5f6fb" }}>
      <section className="relative w-full overflow-hidden pb-14">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(120deg, ${HS_NAVY} 0%, ${HS_BLUE} 50%, ${HS_BLUE_MEDIUM} 100%)` }}
        />
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(60rem 40rem at 20% 20%, rgba(255,187,0,0.18), transparent 50%), radial-gradient(40rem 30rem at 85% 10%, rgba(255,187,0,0.12), transparent 55%)" }} />

        <div className="relative mx-auto max-w-6xl px-6 pt-14">
          <div className="flex items-center justify-between flex-wrap gap-4 text-white">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] border border-white/20">
                Alumni Spotlights
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Stories that carry Hughes forward.</h1>
              <p className="text-white/80 max-w-3xl">Read journeys from our graduates, filter by year, and see how they lead across arts, science, business, and service.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/alumni/spotlights/submit" className="btn-hs-primary">Share your spotlight</Link>
                <Link href="/alumni" className="btn-hs-secondary">Back to Alumni</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: "#e6e8f2" }}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Graduation Year</label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2022"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: "#e2e6f0" }}
              />
            </div>
            <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: "#e6e8f2" }}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: "#e2e6f0" }}
              >
                <option value="createdAt">Newest first (created)</option>
                <option value="gradDesc">Graduation year: Newest</option>
                <option value="gradAsc">Graduation year: Oldest</option>
              </select>
            </div>
            <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: "#e6e8f2" }}>
              <div className="text-sm font-semibold text-hughes-blue/80">{total} spotlight{total === 1 ? "" : "s"}</div>
              <p className="text-xs text-hughes-blue/60 mt-1">Showing stories approved by Hughes Schools.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {loading && <div className="col-span-full text-hughes-blue/70">Loading spotlights…</div>}
            {error && <div className="col-span-full text-red-600">{error}</div>}
            {!loading && !error && sorted.length === 0 && <div className="col-span-full text-hughes-blue/70">No spotlights found.</div>}

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
                  className="rounded-2xl border bg-white p-5 shadow-sm hover-lift"
                  style={{ borderColor: "#e8ebf3" }}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>
                      {fullName}{gy ? ` · ${gy}` : ""}
                    </h3>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--hs-yellow-light)] px-3 py-1 text-[11px] font-semibold text-[var(--hs-blue)]">
                      <span className="h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} />
                      Spotlight
                    </span>
                  </div>
                  <p className="mt-1 text-hughes-blue/80 text-sm">{[city, university, profession].filter(Boolean).join(" · ")}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/alumni/spotlights/${encodeURIComponent(id)}`}
                      className="inline-flex items-center text-[15px] font-semibold hover-underline"
                      style={{ color: HS_BLUE }}
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50 bg-white shadow-sm"
              style={{ borderColor: "#d7dce8", color: HS_BLUE }}
            >
              ← Prev
            </button>
            <span className="text-hughes-blue/70 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50 bg-white shadow-sm"
              style={{ borderColor: "#d7dce8", color: HS_BLUE }}
            >
              Next →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

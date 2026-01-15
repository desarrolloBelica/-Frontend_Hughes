"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const HS_YELLOW = "var(--hs-yellow)";
const HS_BLUE = "var(--hs-blue)";

type RowV5 = {
  id: number | string;
  documentId?: string;
  fullname?: string;
  city?: string;
  university?: string;
  profession?: string;
  graduationYear?: string; // date string
  artisticPath?: string;
  accomplishments?: string;
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

function parseYear(d?: string): number | null {
  if (!d) return null;
  const n = new Date(d).getFullYear();
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
        const qs = new URLSearchParams();
        qs.set("filters[approved][$eq]", "true");
        // fetch generous page size; could be adjusted if needed
        qs.set("pagination[pageSize]", "200");
        qs.set("sort[0]", "createdAt:desc");
        const res = await fetch(`${base}/api/spothights?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json();
        const data = Array.isArray(json)
          ? (json as Spotlight[])
          : ((json as { data?: Spotlight[] }).data ?? []);
        if (!cancelled) setRows(data);
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
      const gy = parseYear(sAttr<string>(r, "graduationYear"));
      return gy !== null && String(gy) === yr;
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
    <main className="min-h-screen" style={{ background: "#f9f9fb" }}>
      <section className="relative w-full py-12 md:py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: HS_BLUE }}>Alumni Spotlights</h1>
              <p className="text-hughes-blue/80 mt-2">Read stories from our graduates. Search by graduation year or sort by seniority.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/alumni/spotlights/submit" className="inline-flex items-center rounded-full bg-[var(--hs-blue)] px-4 py-2 text-sm font-semibold text-white">Submit Spotlight</Link>
              <Link href="/alumni" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
                ← Back to Alumni Network
              </Link>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-4" style={{ borderColor: "#e9ecf4" }}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Graduation Year</label>
              <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2022" className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
            </div>
            <div className="rounded-xl border bg-white p-4" style={{ borderColor: "#e9ecf4" }}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }}>
                <option value="createdAt">Newest first (created)</option>
                <option value="gradDesc">Graduation year: Newest</option>
                <option value="gradAsc">Graduation year: Oldest</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {loading && (
              <div className="col-span-full text-hughes-blue/70">Loading spotlights…</div>
            )}
            {error && (
              <div className="col-span-full text-red-600">{error}</div>
            )}
            {!loading && !error && sorted.length === 0 && (
              <div className="col-span-full text-hughes-blue/70">No spotlights found.</div>
            )}
            {pageItems.map((s) => {
              const id = sAttr<string>(s, "documentId") ?? String((s as { id?: unknown }).id ?? "");
              const fullName = (sAttr<string>(s, "fullname") ?? "Anonymous").trim();
              const gy = parseYear(sAttr<string>(s, "graduationYear"));
              const city = sAttr<string>(s, "city") ?? "";
              const university = sAttr<string>(s, "university") ?? "";
              const profession = sAttr<string>(s, "profession") ?? "";

              return (
                <article key={id} className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#e8ebf3" }}>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>{fullName}{gy ? ` · ${gy}` : ""}</h3>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} /> Spotlight
                    </span>
                  </div>
                  <p className="mt-1 text-hughes-blue/80 text-sm">{[city, university, profession].filter(Boolean).join(" · ")}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <Link href={`/alumni/spotlights/${encodeURIComponent(id)}`} className="inline-flex items-center text-[15px] font-semibold" style={{ color: HS_BLUE }}>
                      Read more →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
              ← Prev
            </button>
            <span className="text-hughes-blue/70 text-sm">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
              Next →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

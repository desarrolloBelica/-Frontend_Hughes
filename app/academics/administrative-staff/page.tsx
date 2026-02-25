"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { User, ClipboardList } from "lucide-react";

/**********************
 * Types (Strapi v4/v5)
 **********************/

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

type SubjectV5 = { id: number | string; name?: string };

type SubjectV4 = {
  id: number | string;
  attributes?: { name?: string };
};

type RowV5 = {
  id: number | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  foto?: Media[] | Media | null;
  staff?: string;
  subjects?: SubjectV5[] | SubjectV5 | null;
};

type RowV4 = {
  id: number | string;
  attributes?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    staff?: string;
    foto?: { data?: Media[] | Media | null } | Media[] | Media | null;
    subjects?: { data?: SubjectV4[] | SubjectV4 | null } | SubjectV4[] | SubjectV4 | null;
  };
};

type Teacher = RowV4 | RowV5;

type KnownKey =
  | "firstName"
  | "lastName"
  | "email"
  | "staff"
  | "foto"
  | "subjects";

/**********************
 * Helpers v4/v5
 **********************/

function getAttr<T = unknown>(row: Teacher, key: KnownKey): T | undefined {
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
    if ("url" in obj || (obj as { url?: string }).url !== undefined) return [obj as Media];
    const d = (obj as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Media[];
    if (d && typeof d === "object") return [d as Media];
  }
  return [];
}

function getSubjectArray(val: unknown): (SubjectV5 | SubjectV4)[] {
  if (Array.isArray(val)) return val as (SubjectV5 | SubjectV4)[];
  if (val && typeof val === "object") {
    const d = (val as { data?: unknown }).data;
    if (Array.isArray(d)) return d as (SubjectV5 | SubjectV4)[];
    if (d && typeof d === "object") return [d as SubjectV5 | SubjectV4];
  }
  return [];
}

function subjectName(s: SubjectV5 | SubjectV4): string {
  const v5 = s as SubjectV5;
  if (v5 && v5.name !== undefined) return v5.name ?? "";
  const v4 = s as SubjectV4;
  return v4.attributes?.name ?? "";
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

function fullName(row: Teacher): string {
  const fn = (getAttr<string>(row, "firstName") ?? "").trim();
  const ln = (getAttr<string>(row, "lastName") ?? "").trim();
  const joined = `${fn} ${ln}`.trim();
  return joined || "Unnamed";
}

function normalizeStaff(raw?: string | null): string {
  const v = (raw ?? "").trim();
  if (!v) return "";
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
}

/**********************
 * Simple UI atoms
 **********************/

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-hs-yellow px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-hs-bluenavy shadow-sm">
      {children}
    </span>
  );
}

function SubjectTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm font-medium text-white opacity-90">
      {children}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl border-2 border-[var(--hs-yellow)] bg-hs-bluenavy p-8 md:p-10 shadow-[0_10px_30px_rgba(255,187,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,187,0,0.3)] flex flex-col justify-between">
      {children}
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative w-full py-16 md:py-24 text-center overflow-hidden bg-hs-yellow rounded-b-[40px] shadow-lg mb-12">
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative flex items-center justify-center">
            {/* Persona */}
            <User className="w-16 h-16" style={{ color: "var(--hs-bluenavy)" }} strokeWidth={2.5} />
            {/* Documento administrativo */}
            <ClipboardList className="w-8 h-8 absolute -bottom-2 -right-3" style={{ color: "var(--hs-bluenavy)", fill: "var(--hs-yellow)" }} strokeWidth={2.5} />
          </div>
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

/**********************
 * Page
 **********************/

const PAGE_SIZE = 8;

export default function AdministrativeStaffPage() {
  const [rows, setRows] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState<string>("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("populate[foto]", "true");
        qs.set("populate[subjects]", "true");
        qs.set("pagination[pageSize]", "300");
        const res = await fetch(`${base}/api/teachers?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json();
        const items: Teacher[] = Array.isArray(json)
          ? (json as Teacher[])
          : ((json as { data?: Teacher[] }).data ?? []);
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

  // Only Academic coordination staff; exclude Art always
  const filtered = useMemo(() => {
    return rows
      .filter((r) => {
        const sNorm = normalizeStaff(getAttr<string>(r, "staff") ?? "").toLowerCase();
        if (sNorm === "art") return false;
        if (sNorm !== "academic coordination") return false;
        if (q.trim()) {
          const name = fullName(r).toLowerCase();
          const email = (getAttr<string>(r, "email") ?? "").toLowerCase();
          const hay = (name + " " + email).includes(q.trim().toLowerCase());
          if (!hay) return false;
        }
        return true;
      })
      .sort((a, b) => fullName(a).localeCompare(fullName(b)));
  }, [rows, q]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => setPage(1), [q]);
  useEffect(() => setPage((p) => Math.min(p, totalPages)), [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <main className="min-h-screen bg-hs-bluenavy">
      <Header title="Administrative Staff" subtitle="Meet our academic coordinators." />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Search */}
          <div className="mb-10 flex items-center justify-end">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email..."
              className="rounded-full border-2 border-white/20 bg-white/10 px-6 py-3 text-base min-w-[300px] text-white placeholder-white/50 focus:outline-none focus:border-hs-yellow transition-colors"
            />
          </div>

          {/* Grid / Content */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="h-full rounded-3xl border-2 border-hs-yellow/30 bg-white/5 p-8 animate-pulse flex flex-col sm:flex-row gap-6"
                >
                  <div className="h-32 w-32 md:h-40 md:w-40 bg-white/10 rounded-full mx-auto sm:mx-0 flex-shrink-0" />
                  <div className="flex-1 space-y-4 pt-4">
                    <div className="h-8 w-3/4 bg-white/10 rounded mx-auto sm:mx-0" />
                    <div className="h-6 w-1/2 bg-white/10 rounded mx-auto sm:mx-0" />
                    <div className="h-16 w-full bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border-2 border-red-500 bg-red-500/10 p-8 text-center text-white font-bold text-lg">
              Error loading staff: {error}
            </div>
          ) : total === 0 ? (
            <p className="text-center text-xl text-hs-yellow font-bold py-12">No staff found matching your criteria.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 auto-rows-fr">
                {pageItems.map((r) => {
                  const name = fullName(r);
                  const staff = normalizeStaff(getAttr<string>(r, "staff") ?? "");
                  const email = getAttr<string>(r, "email") ?? "";

                  const fotoRaw = getAttr(r, "foto");
                  const fotoArr = getMediaArray(fotoRaw);
                  const foto = fotoArr[0] ?? null;
                  const avatarUrl = mediaUrl(foto);
                  const avatarAlt = mediaAlt(foto) ?? name;

                  const subjectsArr = getSubjectArray(getAttr(r, "subjects"));
                  const subjects = subjectsArr.map(subjectName).filter(Boolean);

                  return (
                    <Card key={String(r.id)}>
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-6">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden flex-shrink-0 bg-white/5 relative">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={avatarAlt}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-white/10 flex items-center justify-center text-white/40">
                              <span className="text-4xl font-bold">{name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 text-center sm:text-left mt-2 sm:mt-0">
                          <h3 className="font-bold text-2xl md:text-3xl text-hs-yellow leading-tight mb-4 break-words">
                            {name}
                          </h3>
                          <div className="flex flex-col items-center sm:items-start gap-3">
                            {staff && <Badge>{staff}</Badge>}
                            {email && (
                              <a
                                href={`mailto:${email}`}
                                className="text-base font-medium text-white opacity-80 hover:text-hs-yellow hover:opacity-100 transition-colors break-all"
                              >
                                {email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {subjects.length > 0 && (
                        <div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap justify-center sm:justify-start gap-2">
                          {subjects.map((s, i) => (
                            <SubjectTag key={`${r.id}-sub-${i}`}>{s}</SubjectTag>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 border-2 border-hs-yellow bg-transparent text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy"
                    aria-label="Previous page"
                  >
                    Prev
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
                    disabled={page === totalPages}
                    className="rounded-full px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 border-2 border-hs-yellow bg-transparent text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy"
                    aria-label="Next page"
                  >
                    Next
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
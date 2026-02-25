"use client";

import * as React from "react";
import Link from "next/link";
import { FileDown, Download, Search, Filter } from "lucide-react";

/* ─────────── Tipos & helpers Strapi v4/v5 ─────────── */
type MediaAttrs = { url?: string; name?: string; mime?: string };
type MediaEntry = { id?: number | string; attributes?: MediaAttrs } & MediaAttrs;
type RelationData<T> = { data?: T | T[] | null } | T | T[] | null;

type ResourceV4 = { id: number | string; attributes?: { name?: string; file?: RelationData<MediaEntry> } };
type ResourceV5 = { id: number | string; name?: string; file?: RelationData<MediaEntry> };
type ResourceRow = ResourceV4 | ResourceV5;

type MediaNormalized = { url: string; name: string; mime?: string };

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function hasData(x: unknown): x is { data?: unknown } {
  return isObject(x) && "data" in x;
}
function abs(u?: string | null): string {
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}
function toMedia(m: unknown): MediaNormalized {
  if (!isObject(m)) return { url: "", name: "" };
  const me = m as MediaEntry;
  return {
    url: me.url ?? me.attributes?.url ?? "",
    name: me.name ?? me.attributes?.name ?? "",
    mime: me.mime ?? me.attributes?.mime ?? undefined,
  };
}
function normalizeMedia(rel: RelationData<MediaEntry>): MediaNormalized[] {
  if (!rel) return [];
  if (Array.isArray(rel)) return rel.map(toMedia);
  if (hasData(rel)) {
    const d = (rel as { data?: unknown }).data;
    if (!d) return [];
    return Array.isArray(d) ? d.map(toMedia) : [toMedia(d)];
  }
  return [toMedia(rel)];
}
function isV4(r: ResourceRow): r is ResourceV4 {
  return (r as ResourceV4).attributes !== undefined;
}
function getName(r: ResourceRow): string {
  return isV4(r) ? r.attributes?.name ?? "" : (r as ResourceV5).name ?? "";
}
function getFiles(r: ResourceRow): MediaNormalized[] {
  const rel = isV4(r) ? r.attributes?.file : (r as ResourceV5).file;
  return normalizeMedia(rel ?? null);
}
function asResourceArray(input: unknown): ResourceRow[] {
  if (Array.isArray(input)) return input as ResourceRow[];
  if (isObject(input) && "data" in input) {
    const d = (input as { data?: unknown }).data;
    if (Array.isArray(d)) return d as ResourceRow[];
  }
  return [];
}
function fileBadgeName(mime?: string, url?: string) {
  const u = (url ?? "").toLowerCase();
  if (mime?.includes("pdf") || u.endsWith(".pdf")) return "PDF";
  if (mime?.includes("word") || u.endsWith(".docx") || u.endsWith(".doc")) return "DOCX";
  return "FILE";
}
type Kind = "ALL" | "PDF" | "DOCX" | "OTHER";
function kindOf(mime?: string, url?: string): Kind {
  const badge = fileBadgeName(mime, url);
  if (badge === "PDF") return "PDF";
  if (badge === "DOCX") return "DOCX";
  return "OTHER";
}

/* ─────────── Página Resources ─────────── */
export default function ResourcesPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<
    Array<{ id: string; title: string; url: string; mime?: string }>
  >([]);

  // filtros
  const [q, setQ] = React.useState("");
  const [kind, setKind] = React.useState<Kind>("ALL");

  React.useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("populate[file]", "true");
        qs.set("pagination[pageSize]", "300");
        const res = await fetch(`${base}/api/resources?${qs.toString()}`);
        
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("Access denied. Please enable 'find' permission for Resources in Strapi.");
          }
          throw new Error(`HTTP ${res.status}`);
        }
        
        const json: unknown = await res.json();
        const rows = asResourceArray(json);

        const flat: Array<{ id: string; title: string; url: string; mime?: string }> = [];
        rows.forEach((r) => {
          const baseName = getName(r) || "Untitled";
          getFiles(r).forEach((m, i) => {
            const url = abs(m.url);
            if (!url) return;
            flat.push({ id: `${String(r.id)}-${i}`, title: m.name || baseName, url, mime: m.mime });
          });
        });

        if (!cancel) setFiles(flat);
      } catch (e) {
        if (!cancel) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    return files.filter((f) => {
      const okSearch = !term || f.title.toLowerCase().includes(term);
      const k = kindOf(f.mime, f.url);
      const okKind = kind === "ALL" || k === kind;
      return okSearch && okKind;
    });
  }, [files, q, kind]);

  return (
    <main className="min-h-screen bg-hs-bluenavy pb-24">
      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16 border-b-2 border-white/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--hs-yellow)_0%,_transparent_60%)] blur-[100px]" />
        
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 flex items-center justify-center">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-[32px] bg-hs-yellow shadow-[0_0_40px_rgba(255,187,0,0.5)]">
              <FileDown size={48} className="text-hs-bluenavy ml-1" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            School <span className="text-hs-yellow">Resources</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-white/80 leading-relaxed">
            Download essential school regulations, handbooks, and official documents.
          </p>
        </div>
      </section>

      {/* CONTROLES (buscador + filtros) */}
      <section className="pt-12 pb-6 relative z-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border-2 border-white/10 p-4 md:p-6 rounded-[32px] backdrop-blur-md shadow-2xl">
            
            {/* buscador */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search resources by name…"
                className="w-full rounded-full border-2 border-white/20 bg-hs-bluenavy py-3 pl-14 pr-6 text-white placeholder-white/40 outline-none focus:border-hs-yellow transition-colors text-base font-medium shadow-inner"
              />
            </div>

            {/* chips de filtro */}
            <div className="flex items-center flex-wrap gap-3">
              <div className="hidden lg:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-hs-yellow/80 mr-2">
                <Filter size={16} /> Filter:
              </div>

              {(["ALL", "PDF", "DOCX", "OTHER"] as Kind[]).map((k) => {
                const active = kind === k;
                return (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={`rounded-full border-2 px-5 py-2 text-sm font-bold transition-all ${
                      active
                        ? "bg-hs-yellow border-hs-yellow text-hs-bluenavy shadow-lg scale-105"
                        : "bg-transparent border-hs-yellow/50 text-hs-yellow hover:bg-hs-yellow/10"
                    }`}
                  >
                    {k === "ALL" ? "All Files" : k}
                  </button>
                );
              })}
            </div>
          </div>

          {/* conteo */}
          <div className="mt-6 text-sm font-bold uppercase tracking-widest text-hs-yellow/80 text-center md:text-left ml-4">
            Showing <span className="text-white">{filtered.length}</span> of {files.length} documents
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 pb-20">
          {loading && (
            <div className="rounded-3xl border-2 border-white/10 bg-white/5 p-8 shadow-xl">
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/10" />
                ))}
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border-2 border-red-500 bg-red-500/20 p-8 text-white font-bold text-center text-lg shadow-xl">
              Error loading resources: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {filtered.length === 0 ? (
                <div className="rounded-3xl border-2 border-white/10 bg-white/5 p-16 text-center text-xl font-bold text-white/60 shadow-xl">
                  No resources match your search criteria.
                </div>
              ) : (
                <ul className="space-y-5">
                  {filtered.map((f) => (
                    <li key={f.id}>
                      <a
                        href={f.url}
                        download
                        target={f.url.startsWith("http") ? "_blank" : undefined}
                        rel="noopener"
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl border-2 border-white/10 bg-white/5 p-6 md:p-8 transition-all hover:border-hs-yellow hover:bg-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                      >
                        <div className="flex items-center gap-5 min-w-0">
                          <span className="inline-flex items-center justify-center shrink-0 rounded-full border-2 border-hs-yellow bg-hs-yellow/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-hs-yellow">
                            {fileBadgeName(f.mime, f.url)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-extrabold text-white text-xl md:text-2xl group-hover:text-hs-yellow transition-colors">
                              {f.title}
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 inline-flex justify-center items-center gap-3 rounded-full bg-hs-yellow px-6 py-3 text-base font-bold text-hs-bluenavy shadow-[0_0_20px_rgba(255,187,0,0.3)] transition-transform group-hover:scale-105">
                          <Download size={20} />
                          Download
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-16 flex justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-hs-yellow px-8 py-4 font-bold text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy transition-all shadow-lg"
                >
                  ← Back to home
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
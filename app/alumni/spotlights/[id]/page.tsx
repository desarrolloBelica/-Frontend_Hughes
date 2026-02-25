import Link from "next/link";
import SpotlightMediaCarousel from "../../../../components/SpotlightMediaCarousel";
import type { SpotlightMedia } from "../../../../components/SpotlightMediaCarousel";

type Media = {
  url?: string;
  alternativeText?: string | null;
  name?: string;
  attributes?: { url?: string; alternativeText?: string | null; name?: string };
};

type RowV5 = {
  id: number | string;
  documentId?: string;
  fullname?: string;
  city?: string;
  university?: string;
  profession?: string;
  graduationYear?: string; 
  artisticPath?: string;
  biography?: string;
  hughesImpact?: string;
  messageForStudents?: string;
  approved?: boolean;
  createdAt?: string;
  medias?: Media[] | Media | { data?: Media[] | Media | null } | null;
};

type RowV4 = {
  id: number | string;
  attributes?: Omit<RowV5, "id">;
};

type Spotlight = RowV4 | RowV5;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function sAttr<T = unknown>(row: Spotlight, key: keyof RowV5): T | undefined {
  const root = row as Record<string, unknown>;
  if (root[key as string] !== undefined) return root[key as string] as T; 
  const attrs = (row as RowV4).attributes as Record<string, unknown> | undefined;
  if (attrs && attrs[key as string] !== undefined) return attrs[key as string] as T;
  return undefined;
}

function abs(u?: string | null): string | null {
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}

function parseYear(d?: string): number | null {
  if (!d) return null;
  const n = new Date(d).getFullYear();
  return Number.isNaN(n) ? null : n;
}

function mediaUrl(m?: Media | null): string | null {
  if (!m) return null;
  if (typeof m?.url === "string") return abs(m.url);
  if (m?.attributes?.url) return abs(m.attributes.url);
  return null;
}

function mediaAlt(m?: Media | null): string | undefined {
  return m?.alternativeText ?? m?.attributes?.alternativeText ?? m?.name ?? m?.attributes?.name ?? undefined;
}

function mediaArray(val: unknown): Media[] {
  if (Array.isArray(val)) return val as Media[];
  if (isRecord(val)) {
    if ("url" in val) return [val as Media];
    const d = (val as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Media[];
    if (isRecord(d)) return [d as Media];
  }
  return [];
}

function extractMedias(row: Spotlight): SpotlightMedia[] {
  const raw = sAttr<unknown>(row, "medias");
  const arr = mediaArray(raw);
  const seen = new Set<string>();
  const out: SpotlightMedia[] = [];
  for (const m of arr) {
    const url = mediaUrl(m);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({ url, alt: mediaAlt(m) });
  }
  return out;
}

function rowsFromListJson(json: unknown): Spotlight[] {
  if (Array.isArray(json)) return json as Spotlight[];
  if (isRecord(json) && Array.isArray((json as { data?: unknown }).data)) return (json as { data?: Spotlight[] }).data ?? [];
  return [];
}

async function fetchSpotlightByDocumentId(documentId: string): Promise<Spotlight | null> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  const qs = new URLSearchParams();
  qs.set("filters[documentId][$eq]", documentId);
  qs.set("filters[approved][$eq]", "true");
  qs.set("populate[medias]", "true");
  qs.set("pagination[pageSize]", "1");

  const res = await fetch(`${base}/api/spothights?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) return null;
  const rows = rowsFromListJson(await res.json());
  return rows[0] ?? null;
}

export default async function SpotlightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await fetchSpotlightByDocumentId(id);

  if (!item) {
    return (
      <main className="min-h-screen bg-hs-bluenavy flex items-center justify-center">
        <section className="mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-hs-yellow bg-hs-yellow/10 px-5 py-2 text-sm font-bold uppercase text-hs-yellow tracking-widest mb-6">
            Not Found
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            We couldn’t find this spotlight
          </h1>
          <p className="text-lg text-white/70 mb-10">It may be awaiting approval or the link might be incorrect.</p>
          <Link
            href="/alumni/spotlights"
            className="inline-flex rounded-full border-2 border-hs-yellow px-8 py-3 font-bold text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy transition-colors"
          >
            ← Back to Spotlights
          </Link>
        </section>
      </main>
    );
  }

  const fullName = (sAttr<string>(item, "fullname") ?? "Anonymous").trim();
  const gy = parseYear(sAttr<string>(item, "graduationYear"));
  const city = sAttr<string>(item, "city") ?? "";
  const university = sAttr<string>(item, "university") ?? "";
  const profession = sAttr<string>(item, "profession") ?? "";
  const artisticPath = sAttr<string>(item, "artisticPath") ?? "";
  const biography = sAttr<string>(item, "biography") ?? "";
  const impact = sAttr<string>(item, "hughesImpact") ?? "";
  const message = sAttr<string>(item, "messageForStudents") ?? "";
  const medias = extractMedias(item);

  return (
    <main className="min-h-screen bg-hs-bluenavy">
      <section className="relative overflow-hidden pb-24 pt-16 md:pt-24">
        
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="mb-8">
            <Link 
              href="/alumni/spotlights" 
              className="inline-flex items-center text-sm font-bold text-hs-yellow hover:opacity-80 transition-opacity"
            >
              ← Back to Spotlights
            </Link>
          </div>

          <div className="rounded-[40px] bg-hs-yellow border-4 border-hs-yellow shadow-2xl p-8 md:p-12">
            
            <div className="border-b-2 border-hs-bluenavy/20 pb-8 mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-hs-bluenavy px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-hs-yellow mb-4">
                Hughes Alumni
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy leading-tight">
                {fullName}{gy ? <span className="opacity-70"> · {gy}</span> : ""}
              </h1>
              <p className="text-hs-bluenavy/80 mt-4 text-xl font-bold">
                {[city, university, profession].filter(Boolean).join(" · ")}
              </p>
            </div>

            <div className="grid gap-8">
              {medias.length > 0 && (
                <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-hs-bluenavy">
                  <SpotlightMediaCarousel items={medias} />
                </div>
              )}

              {/* Tarjetas de Información en azul para contrastar el fondo amarillo */}
              {artisticPath && <InfoCard label="Professional or artistic path" content={artisticPath} />}
              {biography && <InfoCard label="Biography" content={biography} />}
              {impact && <InfoCard label="How Hughes shaped my life" content={impact} />}
              {message && <InfoCard label="Message for current students" content={message} />}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

// Componente helper interno para las respuestas del form
function InfoCard({ label, content }: { label: string; content: string }) {
  return (
    <div className="rounded-3xl bg-hs-bluenavy p-6 md:p-8 shadow-md">
      <h3 className="text-sm font-bold uppercase tracking-widest text-hs-yellow opacity-90 mb-4">{label}</h3>
      <p className="text-lg md:text-xl font-medium text-white leading-relaxed whitespace-pre-line text-justify">
        {content}
      </p>
    </div>
  );
}
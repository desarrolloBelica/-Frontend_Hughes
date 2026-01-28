import Link from "next/link";
import SpotlightMediaCarousel from "../../../../components/SpotlightMediaCarousel";
import type { SpotlightMedia } from "../../../../components/SpotlightMediaCarousel";

const HS_YELLOW = "var(--hs-yellow)";
const HS_BLUE = "var(--hs-blue)";
const HS_NAVY = "var(--hs-bluenavy)";

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
  graduationYear?: string; // date string
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
  if (root[key as string] !== undefined) return root[key as string] as T; // v5
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
  // The folder is [id] but the value contains documentId for Strapi findOne
  const { id } = await params;
  const item = await fetchSpotlightByDocumentId(id);
  if (!item) {
    return (
      <main className="min-h-screen" style={{ background: "#f5f6fb" }}>
        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 border" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
            Spotlight Hughes
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight" style={{ color: HS_BLUE }}>We couldn’t find this spotlight</h1>
          <p className="mt-2 text-hughes-blue/80">It may be awaiting approval or the link might be incorrect.</p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/alumni/spotlights"
              className="btn-hs-secondary"
            >
              ← Back to Spotlights
            </Link>
          </div>
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
    <main className="min-h-screen" style={{ background: "#f5f6fb" }}>
      <section className="relative overflow-hidden pb-16">
        <div
          className="absolute inset-x-0 top-0 h-64"
          style={{ background: `linear-gradient(135deg, ${HS_NAVY} 0%, ${HS_BLUE} 60%, ${HS_YELLOW} 120%)` }}
        />
        <div className="relative mx-auto max-w-4xl px-6 pt-14">
          <div className="rounded-2xl bg-white border border-[#e6e8f2] shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--hs-yellow-light)] px-4 py-2 text-[11px] font-semibold text-[var(--hs-blue)]">
                  Spotlight Hughes
                </div>
                <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: HS_BLUE }}>
                  {fullName}{gy ? ` · ${gy}` : ""}
                </h1>
                <p className="text-hughes-blue/80 mt-1 text-sm">{[city, university, profession].filter(Boolean).join(" · ")}</p>
              </div>
              <Link href="/alumni/spotlights" className="btn-hs-secondary">
                ← Back to Spotlights
              </Link>
            </div>

            <div className="mt-8 grid gap-4">
              {medias.length > 0 && (
                <SpotlightMediaCarousel items={medias} />
              )}
              {artisticPath && (
                <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Professional or artistic path</div>
                  <div className="mt-1 text-hughes-blue whitespace-pre-line">{artisticPath}</div>
                </div>
              )}
              {biography && (
                <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Biography</div>
                  <div className="mt-1 text-hughes-blue whitespace-pre-line">{biography}</div>
                </div>
              )}
              {impact && (
                <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">How Hughes shaped my life</div>
                  <div className="mt-1 text-hughes-blue whitespace-pre-line">{impact}</div>
                </div>
              )}
              {message && (
                <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Message for current students</div>
                  <div className="mt-1 text-hughes-blue whitespace-pre-line">{message}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

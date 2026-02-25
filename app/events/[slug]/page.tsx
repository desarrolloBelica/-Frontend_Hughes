import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

/* ───────── Tipos ───────── */
type Media = {
  url?: string;
  alternativeText?: string | null;
  attributes?: { url?: string; alternativeText?: string | null };
};

type V5 = {
  id: number | string;
  title?: string;
  type?: string;
  slug?: string;
  date?: string;
  gallery?: Media[] | Media | null;
  featured_image?: Media | null;
  content?: unknown; // string (v4) o JSON rich-text (v5)
};

type V4 = {
  id: number | string;
  attributes?: {
    title?: string;
    type?: string;
    slug?: string;
    date?: string;
    gallery?: { data?: Media[] | Media | null } | Media[] | Media | null;
    featured_image?: { data?: Media | null } | Media | null;
    content?: unknown;
  };
};

type Row = V4 | V5;

type KnownFieldKey =
  | "title"
  | "type"
  | "slug"
  | "date"
  | "gallery"
  | "featured_image"
  | "content";

/* ───────── Helpers de tipo ───────── */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function abs(u?: string | null): string | null {
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}

function getAttr<T = unknown>(row: Row, key: KnownFieldKey): T | undefined {
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
    if ("url" in val) return [val as Media]; // v5 (media directo)
    const d = (val as { data?: unknown }).data; // v4 ({ data })
    if (Array.isArray(d)) return d as Media[];
    if (isRecord(d)) return [d as Media];
  }
  return [];
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

function pickCover(item: Row): { url: string; alt: string } | null {
  const title = (getAttr<string>(item, "title") ?? "") as string;
  const gRaw = getAttr(item, "gallery");
  const gArr = getMediaArray(gRaw);
  const first = gArr[0];
  const u1 = mediaUrl(first);
  if (u1) return { url: u1, alt: mediaAlt(first) ?? title };

  const fRaw = getAttr(item, "featured_image");
  const fArr = getMediaArray(fRaw);
  const f = fArr[0];
  const u2 = mediaUrl(f);
  if (u2) return { url: u2, alt: mediaAlt(f) ?? title };

  return null;
}

/* Galería completa (urls + alt), deduplicada y (opcional) sin el cover */
function pickGallery(item: Row, excludeUrl?: string | null): Array<{ url: string; alt: string }> {
  const title = (getAttr<string>(item, "title") ?? "") as string;
  const raw = getAttr(item, "gallery");
  const arr = getMediaArray(raw);

  const seen = new Set<string>();
  const out: Array<{ url: string; alt: string }> = [];

  for (const m of arr) {
    const u = mediaUrl(m);
    if (!u) continue;
    if (excludeUrl && u === excludeUrl) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    out.push({ url: u, alt: mediaAlt(m) ?? title });
  }
  return out;
}

/* ───────── Parse helpers (sin any) ───────── */
function rowsFromListJson(json: unknown): Row[] {
  if (Array.isArray(json)) return json as Row[];
  if (isRecord(json) && Array.isArray(json.data)) return json.data as Row[];
  return [];
}
function rowFromItemJson(json: unknown): Row | null {
  if (isRecord(json) && isRecord(json.data)) return json.data as Row;
  return null;
}

/* ───────── Rich text → texto plano (fallback) ───────── */
function toPlainText(val: unknown): string {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.map(toPlainText).filter(Boolean).join(" ");

  if (isRecord(val)) {
    if (typeof (val as { text?: unknown }).text === "string") {
      return String((val as { text?: string }).text);
    }
    const children = (val as { children?: unknown }).children;
    if (Array.isArray(children)) return children.map(toPlainText).filter(Boolean).join(" ");
  }
  return "";
}

/* ───────── Página ───────── */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

  const common = new URLSearchParams();
  common.set("populate[gallery]", "true");
  common.set("populate[featured_image]", "true");

  let row: Row | null = null;

  if (/^\d+$/.test(slug)) {
    const res = await fetch(`${base}/api/blogs/${slug}?${common.toString()}`, { cache: "no-store" });
    if (!res.ok) notFound();
    row = rowFromItemJson(await res.json());
  } else {
    const q = new URLSearchParams(common);
    q.set("filters[slug][$eq]", slug);
    const res = await fetch(`${base}/api/blogs?${q.toString()}`, { cache: "no-store" });
    if (!res.ok) notFound();
    const items = rowsFromListJson(await res.json());
    row = items[0] ?? null;
  }

  if (!row) notFound();

  const title = (getAttr<string>(row, "title") ?? "Untitled") as string;
  const type = (getAttr<string>(row, "type") ?? "") as string;
  const date = (getAttr<string>(row, "date") ?? "") as string;
  const contentRaw = getAttr<unknown>(row, "content");

  const cover = pickCover(row);
  const gallery = pickGallery(row, cover?.url ?? null);

  // Render seguro de `content`
  let contentNode: ReactNode = null; 
  if (typeof contentRaw === "string") {
    contentNode = (
      <div
        className="prose prose-lg md:prose-xl mt-10 mx-auto text-justify max-w-4xl text-hs-bluenavy font-medium leading-relaxed prose-headings:text-hs-bluenavy prose-headings:font-bold prose-a:text-hs-bluenavy prose-a:font-bold prose-strong:text-hs-bluenavy prose-strong:font-extrabold"
        dangerouslySetInnerHTML={{ __html: contentRaw }}
      />
    );
  } else {
    const text = toPlainText(contentRaw);
    if (text.trim()) {
      contentNode = (
        <div className="prose prose-lg md:prose-xl mt-10 mx-auto text-justify max-w-4xl text-hs-bluenavy font-medium leading-relaxed prose-headings:text-hs-bluenavy prose-headings:font-bold prose-a:text-hs-bluenavy prose-a:font-bold prose-strong:text-hs-bluenavy prose-strong:font-extrabold">
          <p>{text}</p>
        </div>
      );
    }
  }

  return (
    <main className="min-h-screen bg-hs-yellow py-12 md:py-20">
      <section className="mx-auto max-w-5xl px-6">
        
        {/* Back Button */}
        <div className="mb-10 text-left">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-base font-bold text-hs-bluenavy opacity-80 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Events
          </Link>
        </div>

        <div className="mb-4 text-sm font-bold tracking-widest uppercase text-hs-bluenavy opacity-80">
          {type} {date ? `• ${new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}` : ""}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy leading-tight mb-12">
          {title}
        </h1>

        {cover && (
          <div className="relative w-full overflow-hidden rounded-[40px] shadow-2xl border-4 border-hs-bluenavy">
            <div className="relative aspect-[16/10] lg:aspect-[21/9] w-full">
              <Image
                src={cover.url}
                alt={cover.alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Contenido (Rich Text) */}
        {contentNode}

        {/* ───────── Galería ───────── */}
        {gallery.length > 0 && (
          <div className="mt-20 border-t-2 border-hs-bluenavy/20 pt-16">
            <h2 className="text-3xl font-extrabold text-hs-bluenavy mb-8">Event Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div key={img.url} className="relative overflow-hidden rounded-3xl shadow-lg border-2 border-hs-bluenavy hover:scale-[1.02] transition-transform duration-300">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
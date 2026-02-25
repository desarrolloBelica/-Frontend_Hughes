import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsGallery from "@/components/NewsGallerySection";
import { ArrowLeft } from "lucide-react"; // Añadido para el botón de regreso

/* ─────────── Tipos locales para Next 15 ─────────── */
type RouteParams = Promise<{ slug: string }>;
type RouteSearch = Promise<Record<string, string | string[] | undefined>>;
type PageInput = {
  params: RouteParams;
  searchParams?: RouteSearch;
};

/* Opcional: ISR (revalidate cada 1 min) */
export const revalidate = 60;

/* ───────────── Tipos Strapi v4/v5 ───────────── */
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

type RowV5 = {
  id: number | string;
  title?: string;
  slug?: string;
  content?: string;
  date?: string;
  featured_image?: Media | null;
  gallery?: Media[] | Media | null;
};

type RowV4 = {
  id: number | string;
  attributes?: {
    title?: string;
    slug?: string;
    content?: string;
    date?: string;
    featured_image?: { data?: Media | null } | Media | null;
    gallery?: { data?: Media[] | Media | null } | Media[] | Media | null;
  };
};

type Article = RowV4 | RowV5;
type KnownKey = "title" | "slug" | "content" | "date" | "featured_image" | "gallery";

/** Respuesta típica de Strapi (lista) */
type StrapiList<T> = { data?: T[] };

/* ───────────── Helpers v4/v5 ───────────── */
function getAttr<T = unknown>(row: Article | null, key: KnownKey): T | undefined {
  if (!row) return undefined;
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
    if ("url" in obj) return [obj as Media];
    const d = (obj as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Media[];
    if (d && typeof d === "object") return [d as Media];
  }
  return [];
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
  const best =
    fmts?.large?.url ??
    fmts?.medium?.url ??
    fmts?.small?.url ??
    m.url ??
    m.attributes?.url ??
    null;
  return abs(best);
}

function mediaAlt(m?: Media | null): string | undefined {
  return m?.alternativeText ?? m?.attributes?.alternativeText ?? undefined;
}

function pickCover(article: Article): { url: string; alt: string } | null {
  const title = (getAttr<string>(article, "title") ?? "") as string;

  const fiRaw = getAttr(article, "featured_image");
  const fiArr = getMediaArray(fiRaw);
  const fi = fiArr[0];
  const fiUrl = mediaUrl(fi);
  if (fiUrl) return { url: fiUrl, alt: mediaAlt(fi) ?? title };

  const galRaw = getAttr(article, "gallery");
  const galArr = getMediaArray(galRaw);
  const first = galArr[0];
  const gUrl = mediaUrl(first);
  if (gUrl) return { url: gUrl, alt: mediaAlt(first) ?? title };

  return null;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ───────────── Util para parsear respuesta sin any ───────────── */
function parseStrapiList<T>(json: unknown): T[] {
  if (Array.isArray(json)) {
    return json as T[];
  }
  if (json && typeof json === "object" && "data" in json) {
    const data = (json as StrapiList<T>).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
}

/* ───────────── Data fetching ───────────── */
async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  const qs = new URLSearchParams();
  qs.set("populate[featured_image]", "true");
  qs.set("populate[gallery]", "true");
  qs.set("pagination[pageSize]", "1");
  qs.set("filters[slug][$eq]", slug);

  const url = `${base}/api/newspapers?${qs.toString()}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) return null;

  const json = (await res.json()) as unknown;
  const items = parseStrapiList<Article>(json);
  if (items.length > 0) return items[0];

  // Fallback: si pasaron un id en lugar de slug
  const asId = Number.isNaN(Number(slug)) ? null : Number(slug);
  if (asId !== null) {
    const qs2 = new URLSearchParams();
    qs2.set("populate[featured_image]", "true");
    qs2.set("populate[gallery]", "true");
    qs2.set("filters[id][$eq]", String(asId));
    const res2 = await fetch(`${base}/api/newspapers?${qs2.toString()}`, {
      next: { revalidate },
    });
    if (!res2.ok) return null;
    const json2 = (await res2.json()) as unknown;
    const items2 = parseStrapiList<Article>(json2);
    return items2[0] ?? null;
  }

  return null;
}

/* ───────────── SEO dinámico (Next 15) ───────────── */
export async function generateMetadata({ params }: Pick<PageInput, "params">) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  const title = (getAttr<string>(article ?? ({} as Article), "title") ?? "News") as string;
  const content = (getAttr<string>(article ?? ({} as Article), "content") ?? "") as string;
  const desc = content.replace(/<[^>]+>/g, "").slice(0, 160);
  const cover = article ? pickCover(article) : null;

  return {
    title: `${title} — Hughes Newspaper`,
    description: desc || "News article",
    openGraph: {
      title,
      description: desc,
      images: cover?.url ? [{ url: cover.url }] : [],
    },
  };
}

/* ───────────── Página (Next 15) ───────────── */
export default async function NewsDetailPage({ params }: PageInput) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return notFound();

  const title = (getAttr<string>(article, "title") ?? "Untitled") as string;
  const date = (getAttr<string>(article, "date") ?? "") as string;
  const content = (getAttr<string>(article, "content") ?? "") as string;

  const cover = pickCover(article);

  const galRaw = getAttr(article, "gallery");
  const gallery = getMediaArray(galRaw)
    .map((m) => ({ url: mediaUrl(m), alt: mediaAlt(m) ?? title }))
    .filter((g) => !!g.url) as { url: string; alt: string }[];

  return (
    // CAMBIO: Fondo principal amarillo
    <main className="min-h-screen bg-hs-yellow py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Back Button */}
        <div className="mb-10 text-left">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-base font-bold text-hs-bluenavy opacity-80 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" /> Back to News
          </Link>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy leading-tight mb-4">
          {title}
        </h1>

        {/* Fecha */}
        {date && (
          <div className="text-lg font-bold text-hs-bluenavy opacity-70 mb-10 tracking-widest uppercase">
            {formatDate(date)}
          </div>
        )}

        {/* Portada */}
        {cover?.url && (
          <div className="mb-12 relative aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-hs-bluenavy">
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Contenido (Forzando la herencia de color) */}
        <article className="prose prose-lg md:prose-xl max-w-none text-hs-bluenavy font-medium leading-relaxed text-justify prose-headings:text-hs-bluenavy prose-headings:font-bold prose-a:text-hs-bluenavy prose-a:font-bold prose-strong:text-hs-bluenavy prose-strong:font-extrabold">
          {typeof content === "string" && /<\/?[a-z][\s\S]*>/i.test(content) ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p>{content}</p>
          )}
        </article>

        {/* Galería (El componente NewsGallery maneja sus estilos, asegúrate que se vea bien en amarillo) */}
        {gallery.length > 0 && (
          <div className="mt-20 border-t-2 border-hs-bluenavy/20 pt-16">
            <h2 className="text-3xl font-extrabold text-hs-bluenavy mb-8">Image Gallery</h2>
            <NewsGallery images={gallery} />
          </div>
        )}
        
      </div>
    </main>
  );
}
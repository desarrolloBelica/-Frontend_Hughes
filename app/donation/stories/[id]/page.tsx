import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Media = {
  url?: string;
  alternativeText?: string | null;
  name?: string;
  attributes?: { url?: string; alternativeText?: string | null; name?: string };
};

type StoryV5 = {
  id: number | string;
  documentId?: string;
  title?: string;
  description?: string;
  testimonialDate?: string;
  student?: any;
  representativeImages?: Media[] | Media | { data?: Media[] | Media | null } | null;
};

type StoryV4 = {
  id: number | string;
  attributes?: Omit<StoryV5, "id">;
};

type Story = StoryV4 | StoryV5;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function sAttr<T = unknown>(row: Story, key: keyof StoryV5): T | undefined {
  const root = row as Record<string, unknown>;
  if (root[key as string] !== undefined) return root[key as string] as T;
  const attrs = (row as StoryV4).attributes as Record<string, unknown> | undefined;
  if (attrs && attrs[key as string] !== undefined) return attrs[key as string] as T;
  return undefined;
}

function abs(u?: string | null): string | null {
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
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

function extractMedias(row: Story): Array<{ url: string; alt?: string }> {
  const raw = sAttr<unknown>(row, "representativeImages");
  const arr = mediaArray(raw);
  const seen = new Set<string>();
  const out: Array<{ url: string; alt?: string }> = [];
  for (const m of arr) {
    const url = mediaUrl(m);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({ url, alt: mediaAlt(m) });
  }
  return out;
}

function rowsFromListJson(json: unknown): Story[] {
  if (Array.isArray(json)) return json as Story[];
  if (isRecord(json) && Array.isArray((json as { data?: unknown }).data))
    return (json as { data?: Story[] }).data ?? [];
  return [];
}

async function fetchStoryByDocumentId(documentId: string): Promise<Story | null> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  
  const attempts = [
    `${base}/api/donation-stories?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate[representativeImages]=*&populate[student]=*&pagination[pageSize]=1`,
    `${base}/api/donation-stories?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*&pagination[pageSize]=1`,
    `${base}/api/donation-stories?filters[id][$eq]=${encodeURIComponent(documentId)}&populate=*&pagination[pageSize]=1`,
    `${base}/api/donation-stories?populate=*&pagination[pageSize]=100`,
  ];

  for (const url of attempts) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const rows = rowsFromListJson(await res.json());
      const match = rows.find((r) => {
        const docId = sAttr<string>(r, "documentId");
        const rid = String((r as { id?: unknown }).id ?? "");
        return docId === documentId || rid === documentId;
      }) ?? rows[0];
      if (match) return match;
    } catch {
      continue;
    }
  }

  return null;
}

function getStudentName(story: Story): string {
  const student = sAttr<any>(story, "student");
  const studentData = student?.data ?? student;
  if (!studentData) return "Anonymous";
  const firstName = studentData.firstName ?? studentData.attributes?.firstName ?? "";
  const lastName = studentData.lastName ?? studentData.attributes?.lastName ?? "";
  return `${firstName} ${lastName}`.trim() || "Anonymous";
}

export default async function DonationStoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await fetchStoryByDocumentId(id);

  if (!story) {
    return (
      <main className="min-h-screen bg-hs-bluenavy flex items-center justify-center">
        <section className="mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-hs-yellow bg-hs-yellow/10 px-5 py-2 text-sm font-bold uppercase text-hs-yellow tracking-widest mb-6">
            Not Found
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Story Not Found
          </h1>
          <p className="text-lg text-white/70 mb-10">
            We couldn&apos;t find the story you&apos;re looking for.
          </p>
          <Link
            href="/donation/stories"
            className="inline-flex items-center gap-2 rounded-full border-2 border-hs-yellow px-8 py-3 font-bold text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Stories
          </Link>
        </section>
      </main>
    );
  }

  const title = sAttr<string>(story, "title") ?? "Untitled Story";
  const description = sAttr<string>(story, "description") ?? "";
  const testimonialDate = sAttr<string>(story, "testimonialDate");
  const studentName = getStudentName(story);
  const medias = extractMedias(story);
  const date = testimonialDate ? new Date(testimonialDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'}) : "";

  return (
    <main className="min-h-screen bg-hs-bluenavy pb-24">
      {/* Header */}
      <section className="relative pt-16 md:pt-24 pb-12 border-b-2 border-white/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--hs-yellow)_0%,_transparent_50%)] blur-[80px]" />
        <div className="relative mx-auto max-w-4xl px-6">
          <Link
            href="/donation/stories"
            className="inline-flex items-center gap-2 text-sm font-bold text-hs-yellow hover:opacity-80 transition-opacity mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Stories
          </Link>

          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-hs-yellow font-bold text-lg uppercase tracking-widest">
              <span>{studentName}</span>
              {date && <span className="opacity-50">•</span>}
              {date && <span>{date}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          
          {/* Images Gallery */}
          {medias.length > 0 && (
            <div className="mb-16">
              {medias.length === 1 ? (
                <div className="relative w-full aspect-video rounded-[32px] overflow-hidden shadow-2xl border-4 border-hs-yellow/50">
                  <Image
                    src={medias[0].url}
                    alt={medias[0].alt || studentName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {medias.map((media, i) => (
                    <div
                      key={i}
                      className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-white/10"
                    >
                      <Image
                        src={media.url}
                        alt={media.alt || `${studentName} - Image ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Story Content */}
          <div className="prose prose-lg md:prose-xl max-w-none mb-20">
            <p className="text-white/90 font-medium leading-relaxed whitespace-pre-line text-justify">
              {description}
            </p>
          </div>

          {/* CTA Section - Bloque Amarillo de Contraste Extremo */}
          <div className="rounded-[40px] bg-hs-yellow p-10 md:p-14 text-hs-bluenavy shadow-2xl text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-xl">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Help More Students Like {studentName.split(" ")[0]}
              </h3>
              <p className="text-lg font-bold opacity-80 leading-relaxed">
                Your donation can transform lives and open doors to world-class education. Every gift makes a difference.
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0">
              <Link
                href="/donation#donate-section"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-extrabold text-xl transition-all duration-300 hover:scale-105 shadow-xl bg-hs-bluenavy text-hs-yellow hover:bg-white hover:text-hs-bluenavy"
              >
                Donate Now
              </Link>
              <Link
                href="/donation/stories"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg border-4 border-hs-bluenavy text-hs-bluenavy transition-all hover:bg-hs-bluenavy/10"
              >
                <ArrowLeft className="w-5 h-5" />
                More Stories
              </Link>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
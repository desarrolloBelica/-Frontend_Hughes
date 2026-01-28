import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

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
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.blue }}>
            Story Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the story you&apos;re looking for.
          </p>
          <Link
            href="/donation/stories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
            style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Stories
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
  const date = testimonialDate ? new Date(testimonialDate).toLocaleDateString() : "";

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/donation/stories"
            className="inline-flex items-center gap-2 text-[var(--hs-blue)] font-semibold mb-6 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Stories
          </Link>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND.blue }}>
              {title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="font-semibold" style={{ color: BRAND.blue }}>
                {studentName}
              </span>
              {date && <span className="text-sm">•</span>}
              {date && <span className="text-sm">{date}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          {/* Images Gallery */}
          {medias.length > 0 && (
            <div className="mb-10">
              {medias.length === 1 ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                  <Image
                    src={medias[0].url}
                    alt={medias[0].alt || studentName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {medias.map((media, i) => (
                    <div
                      key={i}
                      className="relative w-full aspect-video rounded-2xl overflow-hidden"
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
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              style={{ fontSize: "1.125rem", lineHeight: "1.75" }}
            >
              {description}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[var(--hs-blue)]">
            <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND.blue }}>
              Help More Students Like {studentName.split(" ")[0]}
            </h3>
            <p className="text-gray-700 mb-6">
              Your donation can transform lives and open doors to world-class education. Every gift
              makes a difference.
            </p>
            <div className="flex gap-4">
              <Link
                href="/donation#donate-section"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
                style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
              >
                Donate Now
              </Link>
              <Link
                href="/donation/stories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: BRAND.blue, color: BRAND.blue }}
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

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

async function fetchSpotlight(documentId: string): Promise<Spotlight | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    // Use Strapi v5 findOne by documentId
    const res = await fetch(`${base}/api/spothights/${encodeURIComponent(documentId)}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const data = (json as { data?: Spotlight }).data ?? (json as Spotlight);
    const approved = data ? (sAttr<boolean>(data, "approved") ?? false) : false;
    if (!approved) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function SpotlightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // The folder is [id] but the value contains documentId for Strapi findOne
  const { id } = await params;
  const item = await fetchSpotlight(id);
  if (!item) {
    return (
      <main className="min-h-screen" style={{ background: "#f9f9fb" }}>
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-2xl font-bold" style={{ color: HS_BLUE }}>Spotlight not found</h1>
          <p className="mt-2 text-hughes-blue/80">This item may be unpublished or does not exist.</p>
          <div className="mt-6">
            <Link href="/alumni/spotlights" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
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
  const accomplishments = sAttr<string>(item, "accomplishments") ?? "";
  const impact = sAttr<string>(item, "hughesImpact") ?? "";
  const message = sAttr<string>(item, "messageForStudents") ?? "";

  return (
    <main className="min-h-screen" style={{ background: "#f9f9fb" }}>
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: HS_BLUE }}>Alumni Spotlight</h1>
            <p className="text-hughes-blue/80 mt-2">{fullName}{gy ? ` · ${gy}` : ""}</p>
          </div>
          <Link href="/alumni/spotlights" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
            ← Back to Spotlights
          </Link>
        </div>

        <article className="mt-8 rounded-2xl border bg-white p-6 md:p-8 shadow-sm" style={{ borderColor: "#e8ebf3" }}>
          <div className="text-sm text-hughes-blue/80">{[city, university, profession].filter(Boolean).join(" · ")}</div>

          <div className="mt-6 grid gap-4">
            {artisticPath && (
              <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Career or Artistic Path</div>
                <div className="mt-1 text-hughes-blue whitespace-pre-line">{artisticPath}</div>
              </div>
            )}
            {accomplishments && (
              <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Proud Accomplishments</div>
                <div className="mt-1 text-hughes-blue whitespace-pre-line">{accomplishments}</div>
              </div>
            )}
            {impact && (
              <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">How Hughes Schools Impacted Me</div>
                <div className="mt-1 text-hughes-blue whitespace-pre-line">{impact}</div>
              </div>
            )}
            {message && (
              <div className="rounded-xl bg-[#f9fafc] border p-4" style={{ borderColor: "#eef1f6" }}>
                <div className="text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Message for Current Students</div>
                <div className="mt-1 text-hughes-blue whitespace-pre-line">{message}</div>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

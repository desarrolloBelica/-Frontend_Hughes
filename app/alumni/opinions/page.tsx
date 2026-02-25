import Link from "next/link";

interface Opinion {
  id: number | string;
  rateStars?: number;
  comment?: string;
  approved?: boolean;
  createdAt?: string;
  attributes?: Opinion; // for Strapi v4
}

const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

async function fetchOpinions(): Promise<Opinion[]> {
  try {
    const qs = new URLSearchParams();
    qs.set("filters[approved][$eq]", "true");
    qs.set("pagination[page]", "1");
    qs.set("pagination[pageSize]", "200");
    qs.set("sort[0]", "createdAt:desc");
    const res = await fetch(`${backendBase}/api/opinions?${qs.toString()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json: any = await res.json();
    if (Array.isArray(json)) return json;
    return json?.data ?? [];
  } catch {
    return [];
  }
}

function val<T>(row: Opinion, key: keyof Opinion): T | undefined {
  if (row[key] !== undefined) return row[key] as T;
  if (row.attributes && row.attributes[key] !== undefined) return row.attributes[key] as T;
  return undefined;
}

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function StarRow({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1 text-hs-yellow text-lg md:text-xl">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= score ? "" : "text-white/20"}>★</span>
      ))}
    </div>
  );
}

function StarMeter({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(5, value));
  const width = (safe / 5) * 100;
  return (
    <div className="relative inline-flex text-4xl leading-none" aria-label={`Average ${safe.toFixed(1)} out of 5 stars`}>
      <div className="text-white/20">★★★★★</div>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${width}%` }}>
        <div className="text-hs-yellow">★★★★★</div>
      </div>
    </div>
  );
}

export default async function OpinionsPage() {
  const opinions = await fetchOpinions();
  const approved = opinions.filter((row) => Boolean(val<boolean>(row, "approved")));
  const count = approved.length;
  const sum = approved.reduce((acc, row) => acc + Number(val<number>(row, "rateStars") ?? 0), 0);
  const average = count ? Number((sum / count).toFixed(1)) : 0;

  return (
    <main className="min-h-screen bg-hs-bluenavy text-white pb-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b-2 border-white/10 pt-16 pb-20 md:py-24">
        {/* Luces/Blobs de fondo */}
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(100% 80% at 15% 10%, var(--hs-yellow), transparent 55%), radial-gradient(80% 60% at 85% 20%, rgba(255,255,255,0.4), transparent 60%)" }} />
        
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-hs-yellow bg-hs-yellow/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-hs-yellow shadow-lg">
              Community Voices
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Community <span className="text-hs-yellow">opinions</span>
            </h1>
            <p className="text-lg md:text-xl font-medium opacity-90 leading-relaxed text-white">
              This space is moderated to gather respectful and constructive opinions about the school experience.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                href="/alumni?opinion=1#opinions" 
                className="rounded-full bg-hs-yellow px-8 py-4 font-bold text-hs-bluenavy text-lg hover:bg-white transition-colors shadow-xl"
              >
                Leave an opinion
              </Link>
              <Link 
                href="/alumni" 
                className="rounded-full border-2 border-hs-yellow px-8 py-4 font-bold text-hs-yellow text-lg hover:bg-hs-yellow hover:text-hs-bluenavy transition-colors shadow-lg"
              >
                Back to alumni
              </Link>
            </div>
          </div>
          
          {/* STATS BOX */}
          <div className="grid grid-cols-2 gap-8 rounded-[40px] border-4 border-hs-yellow/50 bg-hs-bluenavy/40 p-8 md:p-10 text-center shadow-2xl backdrop-blur-md lg:w-[400px]">
            <div className="flex flex-col items-center justify-center gap-2">
              <StarMeter value={average} />
              <div className="text-2xl font-extrabold mt-2 text-white">{average.toFixed(1)} <span className="text-lg opacity-60">/ 5</span></div>
              <div className="text-xs font-bold uppercase tracking-widest text-hs-yellow mt-1">Average</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-l-2 border-white/10 pl-8">
              <div className="text-5xl font-extrabold text-white">{count}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-hs-yellow mt-3">Opinions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        
        {/* Moderation Criteria */}
        <div className="rounded-3xl border-2 border-hs-yellow/30 bg-hs-yellow/5 p-8 md:p-10 shadow-lg">
          <p className="font-extrabold text-hs-yellow text-lg uppercase tracking-widest mb-6">
            Moderation and publishing criteria
          </p>
          <ul className="grid md:grid-cols-2 gap-4 text-base font-medium text-white/80">
            <li className="flex gap-3"><span className="text-hs-yellow mt-1">✓</span> Opinions are reviewed before publishing.</li>
            <li className="flex gap-3"><span className="text-hs-yellow mt-1">✓</span> Respectful and constructive feedback is welcome.</li>
            <li className="flex gap-3"><span className="text-hs-yellow mt-1">✓</span> No insults, offensive language, or personal attacks.</li>
            <li className="flex gap-3"><span className="text-hs-yellow mt-1">✓</span> No personal data (phones, addresses, or third-party names).</li>
            <li className="flex gap-3"><span className="text-hs-yellow mt-1">✓</span> No false, defamatory, or legally risky content.</li>
            <li className="flex gap-3"><span className="text-hs-yellow mt-1">✓</span> The school may reject submissions that create legal risk.</li>
          </ul>
        </div>

        {/* Opinions List */}
        <div className="space-y-8 pt-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white border-l-4 border-hs-yellow pl-4">
            All approved opinions
          </h2>
          
          {!approved.length && (
            <div className="rounded-3xl border-2 border-white/10 bg-white/5 p-12 text-center">
              <p className="text-xl font-bold text-white/70">No opinions have been published yet.</p>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2">
            {approved.map((row) => {
              const stars = Number(val<number>(row, "rateStars") ?? 0);
              const comment = val<string>(row, "comment") ?? "";
              const created = formatDate(val<string>(row, "createdAt"));
              
              return (
                <article 
                  key={row.id} 
                  className="flex flex-col justify-between rounded-3xl border-2 border-white/10 bg-white/5 p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-hs-yellow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-white/10">
                      <StarRow score={stars} />
                      {created && <span className="text-sm font-bold uppercase tracking-widest text-white/50">{created}</span>}
                    </div>
                    <p className="text-lg font-medium text-white/90 whitespace-pre-line leading-relaxed italic">
                      "{comment}"
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

      </section>
    </main>
  );
}
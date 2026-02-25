import Link from "next/link";
import { cache, Suspense } from "react";
import OpinionsSection from "../../components/opinions/OpinionsSection";
import { GraduationCap, ArrowRight, Quote } from "lucide-react";

const missionPoints = [
  "Celebrate the accomplishments of our graduates",
  "Strengthen the bond between alumni and current students",
  "Foster a network of mutual support, mentorship, and professional growth",
  "Promote the values and traditions of Hughes Schools",
  "Encourage alumni participation in academic, artistic, cultural, and community initiatives",
  "Support opportunities for higher education and international experiences",
];

const successFields = [
  {
    title: "Performing Arts",
    desc: "Professional dancers, musicians, choreographers, theater artists, and cultural ambassadors."
  },
  {
    title: "Science & Medicine",
    desc: "Biologists, physicians, medical technologists, and innovative researchers."
  },
  {
    title: "Education",
    desc: "Teachers, coordinators, and visionary school administrators."
  },
  {
    title: "Business & Tech",
    desc: "Leaders in finance, management, marketing, entrepreneurship, and software."
  },
  {
    title: "International Studies",
    desc: "Graduates studying or working in Germany, Brazil, the US, Spain, Argentina, and beyond."
  }
];

/* ───────────── Tipos (Strapi v4/v5 mínimos) ───────────── */
type SpotlightV5 = {
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
};

type SpotlightV4 = {
  id: number | string;
  attributes?: Omit<SpotlightV5, "id">;
};

type Spotlight = SpotlightV4 | SpotlightV5;

function sAttr<T = unknown>(row: Spotlight, key: keyof SpotlightV5): T | undefined {
  const root = row as Record<string, unknown>;
  if (root[key as string] !== undefined) return root[key as string] as T; // v5
  const attrs = (row as SpotlightV4).attributes as Record<string, unknown> | undefined; // v4
  if (attrs && attrs[key as string] !== undefined) return attrs[key as string] as T;
  return undefined;
}

const fetchLatestSpotlight = cache(async (): Promise<Spotlight | null> => {
  try {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    const qs = new URLSearchParams();
    qs.set("filters[approved][$eq]", "true");
    qs.set("pagination[page]", "1");
    qs.set("pagination[pageSize]", "1");
    qs.set("sort[0]", "createdAt:desc");
    const res = await fetch(`${base}/api/spothights?${qs.toString()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const data = Array.isArray(json)
      ? (json as Spotlight[])
      : ((json as { data?: Spotlight[] }).data ?? []);
    return data[0] ?? null;
  } catch {
    return null;
  }
});

type Opinion = {
  id: number | string;
  rateStars?: number;
  comment?: string;
  approved?: boolean;
  createdAt?: string;
};

type OpinionV4 = {
  id: number | string;
  attributes?: Opinion;
};

function oAttr<T = unknown>(row: Opinion | OpinionV4, key: keyof Opinion): T | undefined {
  const root = row as Record<string, unknown>;
  if (root[key as string] !== undefined) return root[key as string] as T; // v5
  const attrs = (row as OpinionV4).attributes as Record<string, unknown> | undefined; // v4
  if (attrs && attrs[key as string] !== undefined) return attrs[key as string] as T;
  return undefined;
}

const fetchOpinionsSummary = cache(async (): Promise<{ average: number; count: number }> => {
  try {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    const qs = new URLSearchParams();
    qs.set("filters[approved][$eq]", "true");
    qs.set("pagination[page]", "1");
    qs.set("pagination[pageSize]", "200");
    qs.set("sort[0]", "createdAt:desc");
    const res = await fetch(`${base}/api/opinions?${qs.toString()}`, { cache: "no-store" });
    if (!res.ok) return { average: 0, count: 0 };
    const json: unknown = await res.json();
    const rows = Array.isArray(json)
      ? (json as Opinion[])
      : ((json as { data?: Opinion[] }).data ?? []);
    const approved = rows.filter((row) => Boolean(oAttr<boolean>(row, "approved")));
    const count = approved.length;
    if (!count) return { average: 0, count: 0 };
    const sum = approved.reduce((acc, row) => acc + Number(oAttr<number>(row, "rateStars") ?? 0), 0);
    return { average: Number((sum / count).toFixed(1)), count };
  } catch {
    return { average: 0, count: 0 };
  }
});

export default async function AlumniPage() {
  const opinionSummary = await fetchOpinionsSummary();
  const latest = await fetchLatestSpotlight();
  return (
    <main className="min-h-screen bg-hs-bluenavy pb-24 text-white">
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 space-y-24">
        <MissionAndCommunity />
        <SpotlightHero spotlight={latest} />
        <SuccessStories />
        <DirectorsMessage />
        <EngageGrid />
        
        {/* OPINIONES - Container Amarillo para romper el flujo oscuro al final */}
        <div className="bg-hs-yellow rounded-[40px] p-8 md:p-16 shadow-2xl mt-12 text-hs-bluenavy">
          <ClosingStatement />
          <div className="mt-12 pt-12 border-t-2 border-hs-bluenavy/10">
            <Suspense fallback={<div className="animate-pulse bg-hs-bluenavy/10 rounded-2xl h-32" />}>
              <OpinionsSection
                initialAverage={opinionSummary.average}
                initialCount={opinionSummary.count}
                backendBase={process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Fondo sutil tipo ruido/textura para elegancia editorial */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--hs-yellow)_0%,_transparent_60%)] blur-[80px]" />
      
      <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
        
        {/* Textos Principales */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-hs-yellow" />
            <span className="text-sm font-extrabold tracking-[0.2em] uppercase text-hs-yellow">
              Hughes Schools Alumni
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-lg">
            Once a Hughes student, <br className="hidden md:block"/> 
            <span className="text-hs-yellow italic font-serif font-light">always family.</span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-white/80 font-medium leading-relaxed">
            Creators, innovators, scholars, performers, and global citizens who carry forward our values of excellence, discipline, creativity, and community across Bolivia and the world.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href="/alumni/spotlights" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg bg-hs-yellow text-hs-bluenavy shadow-xl hover:bg-white transition-all">
              See Spotlights <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/alumni/spotlights/submit" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg border-2 border-hs-yellow text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy transition-all">
              Share Your Story
            </Link>
          </div>
        </div>

        {/* Estadísticas / Valores (Diseño Editorial, líneas en lugar de cajas) */}
        <div className="lg:w-1/3 flex flex-col gap-8 border-l-2 border-white/10 pl-6 md:pl-10">
          <div className="border-l-4 border-hs-yellow pl-4">
            <h3 className="text-lg font-bold text-hs-yellow uppercase tracking-wider mb-1">Global Impact</h3>
            <p className="text-white/70 text-sm leading-relaxed">Thriving across Latin America, North America, and Europe.</p>
          </div>
          <div className="border-l-4 border-hs-yellow pl-4">
            <h3 className="text-lg font-bold text-hs-yellow uppercase tracking-wider mb-1">Mentorship</h3>
            <p className="text-white/70 text-sm leading-relaxed">Graduates guiding students through careers and university access.</p>
          </div>
          <div className="border-l-4 border-hs-yellow pl-4">
            <h3 className="text-lg font-bold text-hs-yellow uppercase tracking-wider mb-1">Enduring Legacy</h3>
            <p className="text-white/70 text-sm leading-relaxed">Traditions of respect, rigor, and creativity passed down for generations.</p>
          </div>
        </div>

      </div>
    </section>
  );
}

function MissionAndCommunity() {
  return (
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
      {/* Columna Izquierda: Título Grande */}
      <div className="lg:col-span-5 space-y-6 sticky top-24">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Alumni Network <br/>
          <span className="text-hs-yellow">& Community</span>
        </h2>
        <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed">
          The Alumni Association is committed to cultivating a lifelong relationship between Hughes Schools and its graduates. Connect to mentor, collaborate, and create new opportunities.
        </p>
      </div>

      {/* Columna Derecha: Lista Editorial de la Misión */}
      <div className="lg:col-span-7 space-y-12">
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.2em] text-hs-yellow mb-6">Our Core Mission</h4>
          <ul className="space-y-6 text-lg md:text-xl font-medium text-white/90">
            {missionPoints.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span className="text-hs-yellow font-extrabold opacity-50">0{idx + 1}</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SuccessStories() {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Shaping the <span className="text-hs-yellow">World</span>
        </h3>
        <p className="text-xl font-medium text-white/80">
          Our alumni continue to shine in diverse fields. Their success is a reflection of the strong foundation built at Hughes Schools.
        </p>
      </div>
      
      {/* Grid de tarjetas sin bordes blancos, puramente basadas en color y sombra */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {successFields.map((item, idx) => (
          <div key={idx} className="bg-black/20 p-8 rounded-[32px] hover:bg-black/40 transition-colors duration-300 flex flex-col justify-center">
            <h4 className="text-2xl font-extrabold text-hs-yellow mb-3">{item.title}</h4>
            <p className="text-base text-white/70 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpotlightHero({ spotlight }: { spotlight: Spotlight | null }) {
  const fullName = spotlight ? (sAttr<string>(spotlight, "fullname") ?? "Anonymous").trim() : "";
  const city = spotlight ? (sAttr<string>(spotlight, "city") ?? "") : "";
  const university = spotlight ? (sAttr<string>(spotlight, "university") ?? "") : "";
  const profession = spotlight ? (sAttr<string>(spotlight, "profession") ?? "") : "";
  const grad = spotlight ? (sAttr<string>(spotlight, "graduationYear") ?? "") : "";
  const year = grad ? new Date(grad).getFullYear() : undefined;
  const docId = spotlight ? (sAttr<string>(spotlight, "documentId") ?? String((spotlight as { id?: unknown }).id ?? "")) : "";

  return (
    <section className="rounded-[40px] bg-hs-yellow p-10 md:p-16 text-hs-bluenavy shadow-2xl relative overflow-hidden">
      {/* Textura sutil en el amarillo */}
      <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')]" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-hs-bluenavy px-5 py-2 text-sm font-bold text-hs-yellow uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-hs-yellow animate-pulse" />
            Alumni Spotlights
          </div>
          <h3 className="text-4xl md:text-6xl font-extrabold leading-none">
            Celebrate the <br/> journeys of <br/> our graduates.
          </h3>
          <p className="text-lg md:text-xl font-bold opacity-80 max-w-md">
            Share your story to inspire current students and fellow alumni. We rise higher together.
          </p>
        </div>

        {spotlight ? (
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col h-full justify-center">
            <div className="text-sm font-extrabold tracking-widest uppercase opacity-50 mb-4">Latest Story</div>
            <h4 className="text-3xl md:text-4xl font-extrabold mb-2">{fullName}{year ? ` · ${year}` : ""}</h4>
            <p className="text-lg font-bold opacity-70 mb-8">{[city, university, profession].filter(Boolean).join(" · ")}</p>
            <div className="mt-auto">
              <Link href={`/alumni/spotlights/${encodeURIComponent(docId)}`} className="inline-flex items-center gap-2 font-extrabold text-lg text-hs-bluenavy hover:underline">
                Read full spotlight <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Link href="/alumni/spotlights/submit" className="rounded-full bg-hs-bluenavy px-8 py-4 text-xl font-bold text-hs-yellow hover:scale-105 transition-transform shadow-xl">
              Submit your spotlight
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function EngageGrid() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          Get <span className="text-hs-yellow">Involved</span>
        </h3>
        <p className="text-lg font-medium text-white/80">Give back to the community that helped shape your path.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <EngageCard
          title="Mentor a Student"
          description="Offer guidance on careers, auditions, portfolios, or university access."
          action="Become a mentor"
          href="/contact"
        />
        <EngageCard
          title="Host a Talk"
          description="Share your journey in arts, science, business, tech, or public service."
          action="Schedule a session"
          href="/events"
        />
        <EngageCard
          title="Support Initiatives"
          description="Back scholarships, cultural exchanges, and community projects."
          action="Explore ways to help"
          href="/donation"
        />
      </div>
    </div>
  );
}

function EngageCard({ title, description, action, href }: { title: string; description: string; action: string; href: string }) {
  return (
    <div className="group rounded-[32px] bg-white/5 border-2 border-transparent hover:border-hs-yellow p-8 md:p-10 transition-all duration-300 flex flex-col h-full text-center">
      <h4 className="text-2xl font-extrabold text-hs-yellow mb-4">
        {title}
      </h4>
      <p className="text-base font-medium text-white/70 leading-relaxed mb-8 flex-grow">{description}</p>
      <Link 
        href={href} 
        className="inline-flex items-center justify-center w-full rounded-full border-2 border-white/20 py-3 text-sm font-bold uppercase tracking-widest text-white group-hover:bg-hs-yellow group-hover:text-hs-bluenavy group-hover:border-hs-yellow transition-all"
      >
        {action}
      </Link>
    </div>
  );
}

function DirectorsMessage() {
  return (
    <div className="py-12 md:py-20 flex flex-col items-center text-center">
      <Quote className="w-16 h-16 text-hs-yellow mb-8 opacity-80" />
      <blockquote className="text-2xl md:text-4xl lg:text-5xl italic text-white font-medium leading-tight max-w-5xl mx-auto mb-10 font-serif">
        "To all our beloved alumni: Your achievements inspire us every day. No matter where life takes you, <span className="text-hs-yellow">Hughes Schools will always be your home.</span>"
      </blockquote>
      <div className="h-1 w-24 bg-hs-yellow rounded-full mb-6" />
      <p className="text-lg md:text-xl font-extrabold text-white uppercase tracking-widest">
        Richard and Dalcy Hughes <br/> 
        <span className="text-sm font-medium opacity-60 normal-case tracking-normal">Co-Directors</span>
      </p>
    </div>
  );
}

function ClosingStatement() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h3 className="text-4xl md:text-6xl font-extrabold text-hs-bluenavy mb-6 leading-tight">
        Our Legacy <br className="md:hidden"/> Lives in You.
      </h3>
      <p className="text-lg md:text-xl font-bold opacity-80 leading-relaxed">
        The Alumni of Hughes Schools are more than graduates—they are leaders, artists, thinkers, and visionaries. We are proud of each of you, and we look forward to celebrating your continued success.
      </p>
    </div>
  );
}
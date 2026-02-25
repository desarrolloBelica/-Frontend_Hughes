// app/our-learning-environment/page.tsx
"use client";

import { useRef, type ReactNode } from "react";

/* ───────────────────────── Reusable Carousel ─────────────────────────
   - Usa scroll horizontal con snap y botones Prev/Next.
   - Reemplaza los arrays de imágenes en cada sección con tus rutas.
   - Si un array está vacío, se muestran placeholders suaves.
------------------------------------------------------------------------ */

type CarouselProps = { images?: string[] };

function Carousel({ images = [] }: CarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const list = images.length > 0 ? images : Array.from({ length: 6 }, () => "");

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {list.map((src, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-[280px] h-[180px] sm:w-[340px] sm:h-[210px] md:w-[420px] md:h-[260px] rounded-2xl overflow-hidden shadow-md"
            style={{
              background: src
                ? `url(${src}) center/cover no-repeat`
                : "linear-gradient(135deg,#eef1f8,#f7f8fc)",
            }}
            aria-label={src ? `Image ${i + 1}` : "Placeholder"}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
        <button
          type="button"
          onClick={() => scrollBy(-420)}
          className="pointer-events-auto hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 text-hs-bluenavy shadow hover:bg-white transition"
          style={{ borderColor: "var(--hs-yellow)" }}
          aria-label="Previous"
        >
          ‹
        </button>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
        <button
          type="button"
          onClick={() => scrollBy(420)}
          className="pointer-events-auto hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 text-hs-bluenavy shadow hover:bg-white transition"
          style={{ borderColor: "var(--hs-yellow)" }}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── Content blocks ───────────────────────── */

type Block = {
  id: string;
  kicker?: string;
  title: string;
  body: ReactNode;      // ReactNode abarca string y nodos
  bullets?: string[];
  images?: string[];    // imágenes
  flipped?: boolean;    // invierte orden (imagen/texto) en desktop
};

const blocks: Block[] = [
  {
    id: "stem",
    kicker: "STEM philosophy",
    title: "Active, hands‑on STEM learning",
    body: (
      <p>
        Our school embraces a <strong>STEM‑based approach</strong> through active, hands‑on
        experiences. Students participate in engaging Math and Science Fairs where they apply
        classroom knowledge to real‑world problems. These events help develop{" "}
        <strong>critical thinking, creativity, and collaboration</strong> — all essential for success
        in STEM fields.
      </p>
    ),
    bullets: ["Math Fair", "Science Fair", "STEM + Competition", "Robotics"],
    images: ["/12.JPG", "/13.JPG", "/14.JPG"],
  },
  {
    id: "space-school",
    kicker: "Hughes Space School",
    title: "A flagship program by FISE",
    body: (
      <p>
        Hughes Space School inspires students to explore{" "}
        <strong>space science, astrophysics, and STEM</strong> from an early age.
        Through hands‑on projects and academic training, students are guided toward earning{" "}
        <strong>scholarships</strong> to attend advanced programs at Space Center in Houston, Texas.
      </p>
    ),
    bullets: [
      "Elementary",
      "Middle & High School",
      "Space Week",
      "Space Center Scholarship Students",
      "Contacts",
    ],
    images: ["/15.png", "/16.JPG", "/17.JPG"],
    flipped: true,
  },
  {
    id: "hsmun",
    kicker: "HSMun – MiniMun",
    title: "Model United Nations at Hughes Schools",
    body: (
      <p>
        Our students participate in the <strong>Model United Nations</strong>, where they gain knowledge
        on global issues and develop key skills in <strong>diplomacy, public speaking, and negotiation</strong>.
      </p>
    ),
    bullets: ["HS Mun", "Mini Mun"],
    images: ["/18.JPG", "/19.JPG", "/20.JPG", "/21.JPG"],
  },
  {
    id: "dual-language",
    kicker: "Dual Language by Immersion",
    title: "Language acquisition through authentic experiences",
    body: (
      <p>
        Our immersion model supports language acquisition through a dynamic and engaging approach.
        Beyond classroom instruction, students join contests and activities such as{" "}
        <strong>Spelling Bees</strong>, storytelling competitions, and themed cultural events.
      </p>
    ),
    bullets: ["Spelling Bee", "Storytelling Competition"],
    images: ["/22.jpg", "/23.jpg", "/24.jpg"],
    flipped: true,
  },
  {
    id: "clubs",
    kicker: "After School Academic Clubs",
    title: "Student‑led spaces for leadership & creativity",
    body: (
      <p>
        Our student‑led clubs provide a welcoming space for everyone to get involved in our community.
        These clubs encourage <strong>collaboration, creativity, and leadership</strong> beyond the classroom.
        (e.g., Math Club, Robotics, Origami).
      </p>
    ),
    images: ["/25.JPG", "/26.JPG", "/27.JPG"],
  },
  {
    id: "counseling",
    kicker: "College Counseling & Prep",
    title: "One‑on‑one guidance for university planning",
    body: (
      <p>
        Students receive <strong>personalized support</strong> for college planning, including SAT/TOEFL
        preparation and application coaching, to help them take confident next steps after graduation.
      </p>
    ),
    images: ["/29.JPG", "/30.jpg"],
    flipped: true,
  },
];

export default function OurLearningEnvironmentPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="section-gradient-soft">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span
              className="inline-block h-6 w-6 rounded-full"
              style={{ background: "var(--hs-yellow)" }}
              aria-hidden
            />
            <span
              className="inline-block h-6 w-6 rounded-br-[14px]"
              style={{ background: "var(--hs-bluenavy)" }}
              aria-hidden
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy leading-tight">
            Our Learning Environment
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-hs-bluenavy opacity-90">
            Beyond the classroom, our learning culture blends STEM, language immersion,
            international affairs, space exploration, and student leadership — all supported by
            meaningful, real-world experiences.
          </p>
        </div>
      </section>

      {/* BLOQUES */}
      <section className="bg-blueprint">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 pb-24 md:pb-36 space-y-20 md:space-y-32">
          {blocks.map((b) => (
            <article
              key={b.id}
              id={b.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center scroll-mt-24"
            >
              {/* Texto */}
              <div className={b.flipped ? "md:col-span-6 md:order-2" : "md:col-span-6 md:order-1"}>
                {b.kicker && (
                  <div className="mb-4 inline-flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: "var(--hs-yellow)" }}
                    />
                    <span className="text-[12px] tracking-[0.18em] font-bold text-hs-bluenavy uppercase">
                      {b.kicker}
                    </span>
                  </div>
                )}
                
                <h2 className="text-3xl md:text-4xl font-bold text-hs-bluenavy mb-6">
                  {b.title}
                </h2>

                <div className="text-base md:text-lg opacity-90 leading-relaxed text-justify space-y-4 text-hs-bluenavy">
                  {typeof b.body === "string" ? <p>{b.body}</p> : b.body}
                </div>

                {b.bullets && b.bullets.length > 0 && (
                  <ul className="mt-8 space-y-3 text-base md:text-lg opacity-90 font-medium text-hs-bluenavy">
                    {b.bullets.map((t, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="mt-2.5 shrink-0 inline-block h-2 w-2 rounded-full"
                          style={{ background: "var(--hs-yellow)" }}
                        />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Carousel */}
              <div className={b.flipped ? "md:col-span-6 md:order-1" : "md:col-span-6 md:order-2"}>
                <Carousel images={b.images} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
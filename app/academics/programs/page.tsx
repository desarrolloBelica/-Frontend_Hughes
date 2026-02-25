// app/academic-programs/page.tsx
"use client";

import { type ReactNode } from "react";

type Tier = {
  id: string;
  title: string;
  subtitle?: string;
  body: ReactNode;   // ReactNode abarca string y nodos
  image: string;     // una sola imagen por sección
  flipped?: boolean;
};

const heroImage = "/images/curriculum-hero.jpg"; // ← reemplaza por tu imagen

const tiers: Tier[] = [
  {
    id: "early-childhood",
    title: "Early Childhood / Preschool Education (Ages 3–5)",
    subtitle: "Creative Curriculum® | Teaching Strategies",
    body: (
      <p>
        Our preschool program is grounded in the <em>Creative Curriculum®</em>, developed by
        Teaching Strategies, LLC in 1980. This research‑based approach supports the cognitive,
        social‑emotional, physical, and language development of each child. Teachers serve as
        facilitators, creating meaningful connections between children and their environment.
        Learning is personalized, with activities and projects guided by each child’s interests —
        encouraging autonomy, curiosity, and a lifelong love of learning.
      </p>
    ),
    image: "/images/program-early.jpg",
  },
  {
    id: "elementary",
    title: "Elementary School (Grades 1–5)",
    body: (
      <p>
        Our elementary program is built on key pillars that support each child’s academic and
        personal growth. We emphasize strong routines, team‑building experiences, and a balance
        between structure and independence. Our curriculum fosters curiosity — especially in English,
        math, and science — while promoting core values that encourage students to become
        compassionate, community‑minded individuals. Each child is guided to learn at their own pace,
        developing confidence and a genuine love for learning.
      </p>
    ),
    image: "/images/program-elementary.jpg",
    flipped: true,
  },
  {
    id: "middle",
    title: "Middle School (Grades 6–8)",
    body: (
      <p>
        Our Middle School program fosters well‑rounded growth through dynamic and engaging
        experiences. We encourage teamwork with science and math fairs, while developing public
        speaking, research, and negotiation skills through our Model United Nations (HSMun / MiniMun)
        program. Integration with our arts curriculum nurtures discipline and creativity. Students
        build independence and find their own voice through problem‑solving and negotiation
        activities. Technology plays a key role, featuring robotics labs and lessons on AI ethics.
      </p>
    ),
    image: "/images/program-middle.jpg",
  },
  {
    id: "high",
    title: "High School (Grades 9–12)",
    body: (
      <p>
        Our High School program prepares students for academic success and meaningful community
        impact. We emphasize strong reading and writing skills through essay writing and capstone
        projects that empower graduates to become valuable contributors to their communities.
        Volunteering and learning driven by curiosity and individual interests are key components.
        Students receive personalized one‑on‑one support for college and university planning. We also
        celebrate the journey of our arts program, recognizing its vital role in shaping well‑rounded
        individuals.
      </p>
    ),
    image: "/images/program-high.jpg",
    flipped: true,
  },
];

export default function AcademicProgramsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO estilo BASIS (texto izq + imagen der) */}
      <section className="section-gradient-soft relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Texto */}
          <div className="md:col-span-6">
            {/* acentos gráficos opcionales */}
            <div className="mb-6 flex items-center gap-3">
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
              Academic Programs
            </h1>

            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-hs-bluenavy opacity-90">
              Hughes Schools offers a continuum of academic programs designed to support growth
              from early childhood through graduation.
            </p>

            <a
              href="/admissions"
              className="mt-8 inline-flex items-center rounded-full bg-[var(--hs-yellow)] px-8 py-4 text-lg font-bold text-hs-bluenavy hover:opacity-90 transition shadow-lg"
            >
              Apply Now
            </a>
          </div>

          {/* Imagen */}
          <div className="md:col-span-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="Students learning at Hughes Schools"
              className="w-full rounded-[24px] object-cover shadow-xl"
            />
          </div>
        </div>
        {/* Bottom fade to white to blend with next section */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-10 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Intro académico */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <div
            className="rounded-3xl border bg-hs-yellow p-8 md:p-10 text-hs-bluenavy relative -top-6 shadow-xl"
            style={{ borderColor: "var(--hs-yellow)" }}
          >
            <div className="space-y-4 text-lg md:text-xl leading-relaxed text-justify font-medium">
              <p>
                At Hughes Schools, the academic program is rigorous and consistent across all grade
                levels. Students attend <strong>six 45‑minute classes per day</strong>.
              </p>
              <p>
                From high school onward, all students take core courses in{" "}
                <strong>Chemistry, Physics, Biology, English, and Mathematics</strong>. Exceptional
                students may opt for up to <strong>16 honors‑level courses</strong> in these subjects
                during high school. <strong>Science courses include a lab</strong> every year.
              </p>
              <p>
                <strong>80%</strong> of instruction from Pre‑K to 12th grade is in English. Students
                must demonstrate mastery of the curriculum to advance to the next level. Graduation
                requires <strong>48 academic credits</strong>; each year‑long course counts as{" "}
                <strong>1 credit</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones por programa (alternando fondos full-width) */}
      {tiers.map((tier, index) => {
        // Intercalamos colores
        const isYellowBg = index % 2 === 0;
        
        return (
          <section
            key={tier.id}
            className={`relative overflow-hidden transition-all duration-300 ${
              isYellowBg ? "bg-hs-yellow text-hs-bluenavy" : "bg-hs-bluenavy text-hs-yellow"
            }`}
          >
            <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
              <article
                id={tier.id}
                className="grid grid-cols-1 md:grid-cols-12 items-center gap-10 md:gap-16 scroll-mt-24"
              >
                {/* Imagen */}
                <div className={tier.flipped ? "md:col-span-6 md:order-2" : "md:col-span-6 md:order-1"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tier.image}
                    alt={tier.title}
                    className="w-full rounded-[24px] object-cover shadow-xl"
                  />
                </div>

                {/* Texto */}
                <div className={tier.flipped ? "md:col-span-6 md:order-1" : "md:col-span-6 md:order-2"}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {tier.title}
                  </h2>
                  
                  {tier.subtitle && (
                    <p className="text-lg md:text-xl font-semibold opacity-80 mb-6">
                      {tier.subtitle}
                    </p>
                  )}

                  <div className="text-base md:text-lg opacity-90 leading-relaxed text-justify space-y-4">
                    {typeof tier.body === "string" ? <p>{tier.body}</p> : tier.body}
                  </div>
                </div>
              </article>
            </div>
          </section>
        );
      })}
    </main>
  );
}
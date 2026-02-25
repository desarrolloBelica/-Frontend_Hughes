// app/why-choose-hughes-schools/page.tsx
"use client";

import { type ReactNode, type ReactElement } from "react";
import { GraduationCap, Rocket, ShieldCheck, Sparkles } from "lucide-react";

/**
 * Diseño inspirado en https://enrollbasis.com/enrollment-guide/
 * - Hero centrado con acentos gráficos
 * - Grid de 4 tarjetas con iconos (sin fotos)
 * - CTA final único: Apply Now
 * - Colores del proyecto (var(--hs-yellow), text-hs-bluenavy)
 */

type Pillar = {
  id: string;
  title: string;
  description: ReactNode;   // ✅ en vez de string | JSX.Element
  icon: ReactElement;       // ✅ en vez de JSX.Element
};

const pillars: Pillar[] = [
  {
    id: "faculty",
    title: "Expert Faculty",
    description:
      "Educators stay up to date with the latest educational practices through ongoing training and professional development, ensuring high‑quality learning experiences for our students.",
    icon: <GraduationCap className="h-12 w-12 text-hs-yellow" strokeWidth={1.75} />,
  },
  {
    id: "curriculum",
    title: "Innovative Curriculum",
    description:
      "A rigorous, modern program that blends inquiry, technology, and global awareness to build strong thinking and problem‑solving skills.",
    icon: <Rocket className="h-12 w-12 text-hs-yellow" strokeWidth={1.75} />,
  },
  {
    id: "environment",
    title: "Safe, Nurturing Environment",
    description:
      "A supportive space where students feel valued, respected, and empowered to grow — academically, socially, and emotionally.",
    icon: <ShieldCheck className="h-12 w-12 text-hs-yellow" strokeWidth={1.75} />,
  },
  {
    id: "integral",
    title: "Integral Education",
    description:
      "Technology, science, and performance arts come together to foster creativity, critical thinking, and well‑rounded development.",
    icon: <Sparkles className="h-12 w-12 text-hs-yellow" strokeWidth={1.75} />,
  },
];

export default function WhyChooseHughesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO - Estandarizado con section-gradient-soft */}
      <section className="section-gradient-soft relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-center">
          <div className="mb-8 flex items-center justify-center gap-3">
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
            Why choose Hughes Schools?
          </h1>

          <p className="mt-6 mx-auto max-w-3xl text-lg md:text-xl font-medium text-hs-bluenavy opacity-90 leading-relaxed">
            A community built on expert teaching, innovation, safety, and whole‑child
            development — so every student can learn with confidence and purpose.
          </p>
        </div>
        
        {/* Bottom fade to white to blend with next section */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-10 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* GRID DE PILARES (estilo tarjetas) - Estandarizado */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 pb-24 md:pb-36">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((p, index) => {
              // Intercalamos solo por si en el futuro quieres añadir más, 
              // pero la estructura de 4 queda muy bien en amarillo con detalles navy.
              return (
                <article
                  key={p.id}
                  className="group relative rounded-3xl bg-hs-yellow p-8 shadow-xl border-2 border-hs-yellow hover:border-hs-bluenavy transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-hs-bluenavy shadow-md group-hover:scale-110 transition-transform duration-300">
                      {p.icon}
                    </div>
                  </div>

                  <h2 className="mt-8 text-center text-2xl font-bold text-hs-bluenavy leading-snug">
                    {p.title}
                  </h2>

                  <p className="mt-4 text-center text-base md:text-lg font-medium opacity-90 leading-relaxed text-hs-bluenavy">
                    {p.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
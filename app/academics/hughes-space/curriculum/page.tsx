"use client";

import Link from "next/link";
import Image from "next/image";
import { Rocket, Sparkles, Brain, FlaskConical, Stars, ArrowLeft, Zap, Award } from "lucide-react";
import { CountingNumber } from "@/components/CountingNumber";

const BRAND = {
  blue: "var(--hs-bluenavy)",
  yellow: "var(--hs-yellow)",
};

const HSC_URL = process.env.NEXT_PUBLIC_SPACE_CURRICULUM_FORM || "https://docs.google.com/forms/d/e/1FAIpQLScbqbZUv5HpSEtqUunv5V-tm7ioIxVOi_fG379RndG2zjY5-w/viewform";

function EnrollButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={HSC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl border-2 border-hs-yellow bg-hs-yellow text-hs-bluenavy ${className}`}
    >
      <Rocket className="w-6 h-6" />
      Registrations HERE
    </a>
  );
}

// Componente para la línea divisoria
const Divider = () => (
  <div className="flex justify-center my-12">
    <div 
      className="w-24 h-[2px] rounded-full opacity-70 bg-hs-yellow" 
    />
  </div>
);

export default function SpaceCurriculumPage() {
  return (
    /* Contenedor principal con el fondo aplicado a TODA la página */
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      
      {/* Fondo de estrellas global */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-slate-900/50 to-slate-950" />
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iODAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iMTQwIiByPSIwLjgiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTcwIiByPSIxLjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxNjAiIHI9IjAuOSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz48L3N2Zz4=')] opacity-80" />
      
      <div className="relative z-10">
        
        {/* Back Link Top */}
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <Link
            href="/academics/hughes-space"
            className="inline-flex items-center gap-2 text-hs-yellow opacity-80 hover:opacity-100 transition-opacity font-bold text-lg"
          >
            <ArrowLeft className="w-5 h-5" /> Back to HSS
          </Link>
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-yellow leading-tight">
              Space Curriculum
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto font-light text-hs-yellow opacity-90">
              How can I represent Bolivia on the international stage?
            </p>
            <div className="flex justify-center gap-4 pt-8">
              <a
                href={process.env.NEXT_PUBLIC_HUGHES_SPACE_WEBSITE || "https://www.hughesspace.org"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] border-2 border-white/30 text-white bg-white/10 backdrop-blur-md"
              >
                <Rocket className="w-6 h-6" />
                Go Up Into Space!
                <Sparkles className="w-5 h-5 text-hs-yellow" />
              </a>
            </div>
          </div>
        </section>

        <Divider />

        {/* Intro */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
          <div className="text-center mb-16">
            <EnrollButton />
          </div>
          
          {/* Text with Image Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
            <div className="space-y-6 text-lg md:text-xl text-white opacity-90 leading-relaxed font-medium text-justify">
              <p className="text-2xl md:text-3xl font-bold text-hs-yellow text-left">
                Hughes Space School is the first space education organization in Bolivia.
              </p>
              <p>
                We develop a space science culture in all our students — we are completely focused on the future!
              </p>
              <p>
                Since 2019, we have prepared, selected, and sent students from all over Bolivia to FISE (International Space Education Foundation) camps, where they work alongside engineers and specialists.
              </p>
            </div>
            
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500 border-2 border-white/10">
              <Image
                src="/space1.jpg"
                alt="Hughes Space School"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mx-auto max-w-5xl space-y-8 text-lg md:text-xl text-white opacity-90 leading-relaxed font-medium">
            <p className="text-center">
              Thanks to our partnership with FISE, we annually select Bolivian students to represent the country at the prestigious <strong className="text-hs-yellow">United Space School (USS)</strong> camp.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              {/* Stat 1 */}
              <div className="rounded-3xl p-8 border-2 border-hs-yellow/30 bg-hs-bluenavy/40 backdrop-blur-md shadow-xl hover:border-hs-yellow transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <Stars className="w-8 h-8 text-hs-yellow animate-pulse" />
                  <p className="text-xl md:text-2xl font-bold text-hs-yellow">
                    <CountingNumber target={87.5} duration={1500} suffix="%" className="text-4xl" /> <br/>of our students
                  </p>
                </div>
                <p className="text-lg text-white opacity-90">received a full scholarship.</p>
              </div>
              
              {/* Stat 2 */}
              <div className="rounded-3xl p-8 border-2 border-hs-yellow/30 bg-hs-bluenavy/40 backdrop-blur-md shadow-xl hover:border-hs-yellow transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <Stars className="w-8 h-8 text-hs-yellow animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <p className="text-xl md:text-2xl font-bold text-hs-yellow">
                    <CountingNumber target={100} duration={1500} suffix="%" className="text-4xl" /> <br/>of our students
                  </p>
                </div>
                <p className="text-lg text-white opacity-90">received a full educational scholarship.</p>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Camino al éxito */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            {/* Caja Amarilla intercalada */}
            <div className="rounded-3xl p-10 sm:p-14 text-center bg-hs-yellow text-hs-bluenavy shadow-2xl">
              <p className="text-2xl md:text-3xl font-bold mb-6">
                At Hughes Space School, we focus on putting every one of our students on an exceptional path to success.
              </p>
              <p className="text-lg md:text-xl font-bold opacity-90 mb-4">
                In addition to representing Bolivia at international camps:
              </p>
              <ul className="text-lg md:text-xl font-medium opacity-90 space-y-4 text-left max-w-3xl mx-auto">
                <li className="flex items-start gap-3">
                  <Rocket className="w-6 h-6 shrink-0 mt-1" />
                  We build, together with each student, a curriculum suitable for the world’s best universities.
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-6 h-6 shrink-0 mt-1" />
                  With the goal of winning scholarships, our students consistently improve their performance.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <Divider />

        {/* Metodología Educativa */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-hs-yellow">Educational Methodology</h2>
            <p className="text-xl text-white opacity-80 mt-4 font-medium">How we teach to achieve excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Ambiente */}
            <div className="bg-hs-bluenavy/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-hs-yellow/30 hover:border-hs-yellow transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-hs-yellow text-hs-bluenavy">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-hs-yellow">Environment</h3>
              <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                We create an environment where students are excited to learn. Emotion is key when absorbing new information — when a student loves the subject, that’s when real learning happens.
              </p>
            </div>
            
            {/* Autodidacta */}
            <div className="bg-hs-bluenavy/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-hs-yellow/30 hover:border-hs-yellow transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-hs-yellow text-hs-bluenavy">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-hs-yellow">Self-directed</h3>
              <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                Every student thinks, interacts, and tackles problems differently. We encourage each student to learn in the way that best connects with their thinking style.
              </p>
            </div>
            
            {/* Dinámico */}
            <div className="bg-hs-bluenavy/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-hs-yellow/30 hover:border-hs-yellow transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-hs-yellow text-hs-bluenavy">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-hs-yellow">Dynamic</h3>
              <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                Through experiments, activities, and projects, our students enter a dynamic and passionate environment where learning is fun and simple.
              </p>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/FuturoSpace.png"
                alt="Future of Space Education"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-6 py-16 pb-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-hs-yellow mb-8">Ready to start your journey?</h2>
          <EnrollButton />
        </section>

      </div>
    </main>
  );
}
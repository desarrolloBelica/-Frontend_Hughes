"use client";

import Link from "next/link";
import { Rocket, Sparkles, Brain, FlaskConical, Stars, ArrowLeft } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

const HSC_URL = "https://docs.google.com/forms/d/e/1FAIpQLScbqbZUv5HpSEtqUunv5V-tm7ioIxVOi_fG379RndG2zjY5-w/viewform";

function EnrollButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={HSC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base shadow-lg transition-all hover:scale-105 hover:shadow-xl ${className}`}
      style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
    >
      <Rocket className="w-5 h-5" />
      Registrations HERE
    </a>
  );
}

export default function SpaceCurriculumPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white min-h-[520px] sm:min-h-[600px]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-slate-900/50 to-slate-950" />
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iODAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iMTQwIiByPSIwLjgiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTcwIiByPSIxLjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxNjAiIHI9IjAuOSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz48L3N2Zz4=')] opacity-40" />
        {/* Back to HSS inside hero */}
        <Link
          href="/academics/hughes-space"
          className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
          style={{ backgroundColor: "white", color: BRAND.blue, border: `2px solid ${BRAND.blue}` }}
          aria-label="Back to HSS"
        >
          <ArrowLeft className="w-4 h-4" />
          HSS
        </Link>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Space Curriculum
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-white/90">
              How can I represent Bolivia on the international stage?
            </p>
            {/* CTA moved below hero to test clickability */}
          </div>
        </div>
        {/* wave */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-8">
            <EnrollButton />
          </div>
          <div className="mx-auto max-w-4xl space-y-6 text-lg text-gray-700 leading-relaxed">
            <p className="text-xl font-semibold" style={{ color: BRAND.blue }}>
              Hughes Space School is the first space education organization in Bolivia.
            </p>
            <p>
              We develop a space science culture in all our students — we are completely focused on the future!
            </p>
            <p>
              Since 2019, we have prepared, selected, and sent students from all over Bolivia to FISE (International Space Education Foundation) camps, where they work alongside engineers and specialists.
            </p>
            <p>
              Thanks to our partnership with FISE, we annually select Bolivian students to represent the country at the prestigious <strong>United Space School (USS)</strong> camp.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="rounded-2xl p-6 border" style={{ borderColor: BRAND.blue }}>
                <div className="flex items-center gap-3">
                  <Stars className="w-6 h-6" style={{ color: BRAND.yellow }} />
                  <p className="text-lg font-bold" style={{ color: BRAND.blue }}>87.5% of our students</p>
                </div>
                <p className="mt-2 text-gray-700">received a full scholarship.</p>
              </div>
              <div className="rounded-2xl p-6 border" style={{ borderColor: BRAND.blue }}>
                <div className="flex items-center gap-3">
                  <Stars className="w-6 h-6" style={{ color: BRAND.yellow }} />
                  <p className="text-lg font-bold" style={{ color: BRAND.blue }}>100% of our students</p>
                </div>
                <p className="mt-2 text-gray-700">received a full educational scholarship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Camino al éxito */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl p-8 sm:p-10 text-center border-2" style={{ borderColor: BRAND.blue, backgroundColor: "rgba(var(--hs-blue-rgb), 0.05)" }}>
              <p className="text-2xl font-bold" style={{ color: BRAND.blue }}>
                At Hughes Space School, we focus on putting every one of our students on an exceptional path to success.
              </p>
              <p className="mt-4 text-gray-700">
                In addition to representing Bolivia at international camps:
              </p>
              <ul className="mt-4 text-gray-700 space-y-2 text-left max-w-3xl mx-auto">
                <li>• We build, together with each student, a curriculum suitable for the world’s best universities.</li>
                <li>• With the goal of winning scholarships, our students consistently improve their performance.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Metodología Educativa */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: BRAND.blue }}>Educational Methodology</h2>
            <p className="text-lg text-gray-600 mt-3">How we teach to achieve excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Ambiente */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-[var(--hs-blue)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(var(--hs-blue-rgb), 0.1)" }}>
                <Sparkles className="w-8 h-8" style={{ color: BRAND.blue }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.blue }}>Environment</h3>
              <p className="text-gray-700 leading-relaxed">
                We create an environment where students are excited to learn. Emotion is key when absorbing new information — when a student loves the subject, that’s when real learning happens.
              </p>
            </div>
            {/* Autodidacta */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-[var(--hs-blue)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(var(--hs-blue-rgb), 0.1)" }}>
                <Brain className="w-8 h-8" style={{ color: BRAND.blue }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.blue }}>Self-directed</h3>
              <p className="text-gray-700 leading-relaxed">
                Every student thinks, interacts, and tackles problems differently. We encourage each student to learn in the way that best connects with their thinking style.
              </p>
            </div>
            {/* Dinámico */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-[var(--hs-blue)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(var(--hs-blue-rgb), 0.1)" }}>
                <FlaskConical className="w-8 h-8" style={{ color: BRAND.yellow }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.blue }}>Dynamic</h3>
              <p className="text-gray-700 leading-relaxed">
                Through experiments, activities, and projects, our students enter a dynamic and passionate environment where learning is fun and simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <EnrollButton />
        </div>
      </section>
    </main>
  );
}

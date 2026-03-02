"use client";

import Link from "next/link";
import { Rocket, Globe, Users, BookCheck, FileText, ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import { CountingNumber } from "@/components/CountingNumber";

const APPLICATION_URL = process.env.NEXT_PUBLIC_UNITED_SPACE_SCHOOL_FORM || "https://docs.google.com/forms/d/e/1FAIpQLSebFiZI9bn8C74mE4N7KIZVxtFgOJ55oTM1S1Oi28rm7g7zhw/viewform";

// Componente de Botón Reutilizable
function ApplyButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={APPLICATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-2xl border-2 border-hs-yellow bg-hs-yellow text-hs-bluenavy ${className}`}
    >
      <Rocket className="w-6 h-6" />
      Apply Now
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

export default function UnitedSpaceSchoolPage() {
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
              United Space School Selection
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto font-light text-hs-yellow opacity-90">
              How to represent Bolivia at United Space School?
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
            <ApplyButton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="space-y-6 text-lg md:text-xl text-white opacity-90 leading-relaxed font-medium text-justify">
              <p className="text-2xl md:text-3xl font-bold text-hs-yellow text-left">
                Hughes Space School is the largest space education organization in Bolivia.
              </p>
              <p>
                We develop and promote space science culture through our rigorous and dedicated preparation in the field.
              </p>
              <p>
                We prepare, select, and send students from all over Latin America to international camps thanks to our association with the International Foundation for Space Education (FISE).
              </p>
              <p>
                This is accomplished through our selection program: <strong className="text-hs-yellow">Space Week</strong>.
              </p>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500 border-2 border-white/10">
              <Image
                src="/17.jpg"
                alt="Hughes Space School Program"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </div>
        </section>

        <Divider />

        {/* What is FISE */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
          <div className="flex items-center justify-center gap-3 mb-12 text-hs-yellow">
            <Globe className="w-10 h-10" />
            <h2 className="text-4xl sm:text-5xl font-bold">What is FISE?</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
            <div className="relative h-[400px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500 border-2 border-white/10">
              <Image
                src="/space2.jpeg"
                alt="FISE Foundation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            
            {/* Caja Amarilla intercalada */}
            <div className="rounded-3xl p-8 md:p-12 shadow-2xl bg-hs-yellow text-hs-bluenavy">
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-justify">
                The Foundation for International Space Education (FISE) is a private, non-profit foundation whose mission is to provide space-based academic instruction to international pre-university students, as well as offer an introduction and orientation to the aerospace industry.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Space Week */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-24">
          <div className="flex items-center justify-center gap-3 mb-12 text-hs-yellow">
            <Users className="w-10 h-10" />
            <h2 className="text-4xl sm:text-5xl font-bold">Space Week</h2>
          </div>
          
          {/* Featured Image */}
          <div className="mb-16 max-w-5xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500 border-2 border-white/10">
              <Image
                src="/15.png"
                alt="Space Week Program"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </div>
          
          <div className="mx-auto max-w-6xl">
            <div className="space-y-8 text-lg md:text-xl text-white opacity-90 leading-relaxed font-medium text-justify">
              <p>
                <strong className="text-hs-yellow text-2xl">Space Week</strong> is a highly selective one-week program. Participants are selected from a pool of students who apply nationwide, and undergo a rigorous week of hard work developing a project in the space sector. The event is a simulation of the United Space School camp.
              </p>
              <p>
                At the end of the program, two of the most outstanding candidates are chosen to represent Bolivia at the camp.
              </p>
              
              {/* Highlight Panel */}
              <div className="mt-12 rounded-3xl p-8 md:p-12 shadow-xl border-2 border-hs-yellow/30 bg-hs-bluenavy/40 backdrop-blur-md hover:border-hs-yellow transition-all duration-300">
                <h3 className="text-3xl font-bold mb-6 text-hs-yellow">United Space School</h3>
                <p className="mb-6">
                  United Space School is an interdisciplinary program that annually brings together up to <span className="text-3xl font-bold text-hs-yellow"><CountingNumber target={50} duration={2000} /></span> students from <span className="text-3xl font-bold text-hs-yellow"><CountingNumber target={25} duration={2000} /></span> different nations to study at the University of Clear Lake. Under the mentorship of engineers, scientists, and leaders from the aerospace industry, students collaborate to design their own mission to Mars.
                </p>
                <p className="mb-6">
                  United Space School organizes its curriculum to train students in designing a crewed mission to Mars. Qualified instructors, including civilian aerospace professionals and contractors, provide training in key disciplines. In addition, students have access to research resources in libraries and online platforms at the University of Houston Clear Lake.
                </p>
                <p className="mb-6">
                  To complement and strengthen this training, students participate in a variety of space-related activities at the Johnson Space Center (J.S.C.), the University of Houston Clear Lake, Rice University, Space Center Houston, George Observatory at Brazos Bend State Park, and the Houston Museum of Natural Science.
                </p>
                <p>
                  These activities include a tour of J.S.C. facilities, a full team mission, a special project at George Observatory, an ARISS link with the International Space Station (ISS), and an international videoconference on life sciences, bioastronautics, and aerospace medicine at a university.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* How to Apply */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-hs-yellow">
              <BookCheck className="w-10 h-10" />
              <h2 className="text-4xl sm:text-5xl font-bold text-center">How to Apply to Space Week?</h2>
            </div>
            
            <div className="text-center mb-16">
              <Link
                href="/academics/hughes-space/united-space-school/requirements"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl bg-white/10 text-white border-2 border-white/30 backdrop-blur-sm hover:border-hs-yellow hover:text-hs-yellow"
              >
                <FileText className="w-5 h-5" />
                View Requirements
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Box 1 */}
              <div className="rounded-3xl p-8 md:p-10 shadow-xl border-2 border-hs-yellow/30 bg-hs-bluenavy/40 backdrop-blur-md">
                <h3 className="text-2xl font-bold mb-4 text-hs-yellow">Keep in mind...</h3>
                <div className="text-lg text-white opacity-90 leading-relaxed font-medium space-y-4">
                  <p>
                    Participation in the selection process for the United Space School camp is completely free.
                  </p>
                  <p>
                    First, you must be a high school student between 3rd and 6th grade (or between 14 and 19 years old), and have proficiency in understanding and expressing yourself in English.
                  </p>
                </div>
              </div>
              
              {/* Box 2 */}
              <div className="rounded-3xl p-8 md:p-10 shadow-xl border-2 border-hs-yellow/30 bg-hs-bluenavy/40 backdrop-blur-md">
                <h3 className="text-2xl font-bold mb-4 text-hs-yellow">Additionally...</h3>
                <p className="text-lg text-white opacity-90 leading-relaxed font-medium">
                  The 18 students selected nationwide will have to demonstrate their skills and knowledge at Space Week, which will take place at Hughes Schools in the city of Cochabamba, Bolivia, from <strong className="text-hs-yellow">January 26 to 30, 2026</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-6 py-16 pb-24">
          <div className="text-center text-white space-y-8">
            <Rocket className="w-16 h-16 mx-auto text-hs-yellow animate-bounce" />
            <h2 className="text-4xl sm:text-5xl font-bold text-hs-yellow">
              Ready to Apply?
            </h2>
            <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mx-auto">
              Take the first step toward representing Bolivia at the United Space School
            </p>
            <ApplyButton />
          </div>
        </section>

      </div>
    </main>
  );
}
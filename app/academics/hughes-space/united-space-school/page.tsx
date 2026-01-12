"use client";

import Link from "next/link";
import { Rocket, Globe, Users, BookCheck, FileText, Calendar, ArrowLeft } from "lucide-react";
import Image from "next/image";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

const APPLICATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSebFiZI9bn8C74mE4N7KIZVxtFgOJ55oTM1S1Oi28rm7g7zhw/viewform";

export default function UnitedSpaceSchoolPage() {
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
              United Space School Selection
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-white/90">
              How to represent Bolivia at United Space School?
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
            <a
              href={APPLICATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
            >
              <Rocket className="w-5 h-5" />
              Apply Now
            </a>
          </div>
          <div className="mx-auto max-w-4xl space-y-6 text-lg text-gray-700 leading-relaxed">
            <p className="text-xl font-semibold" style={{ color: BRAND.blue }}>
              Hughes Space School is the largest space education organization in Bolivia.
            </p>
            <p>
              We develop and promote space science culture through our rigorous and dedicated preparation in the field.
            </p>
            <p>
              We prepare, select, and send students from all over Latin America to international camps thanks to our association with the International Foundation for Space Education (FISE).
            </p>
            <p>
              This is accomplished through our selection program: <strong>Space Week</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* What is FISE */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Globe className="w-10 h-10" style={{ color: BRAND.blue }} />
              <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: BRAND.blue }}>What is FISE?</h2>
            </div>
            <div className="rounded-3xl p-8 sm:p-10 border-2" style={{ borderColor: BRAND.blue, backgroundColor: "rgba(var(--hs-blue-rgb), 0.05)" }}>
              <p className="text-lg text-gray-700 leading-relaxed">
                The Foundation for International Space Education (FISE) is a private, non-profit foundation whose mission is to provide space-based academic instruction to international pre-university students, as well as offer an introduction and orientation to the aerospace industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Space Week */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Users className="w-10 h-10" style={{ color: BRAND.blue }} />
              <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: BRAND.blue }}>Space Week</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                <strong>Space Week</strong> is a highly selective one-week program. Participants are selected from a pool of students who apply nationwide, and undergo a rigorous week of hard work developing a project in the space sector. The event is a simulation of the United Space School camp.
              </p>
              <p>
                At the end of the program, two of the most outstanding candidates are chosen to represent Bolivia at the camp.
              </p>
              <div className="mt-8 rounded-2xl border-2 p-6" style={{ borderColor: BRAND.yellow, backgroundColor: "rgba(var(--hs-yellow-rgb), 0.05)" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND.blue }}>United Space School</h3>
                <p className="mb-4">
                  United Space School is an interdisciplinary program that annually brings together up to 50 students from 25 different nations to study at the University of Clear Lake. Under the mentorship of engineers, scientists, and leaders from the aerospace industry, students collaborate to design their own mission to Mars.
                </p>
                <p className="mb-4">
                  United Space School organizes its curriculum to train students in designing a crewed mission to Mars. Qualified instructors, including civilian aerospace professionals and contractors, provide training in key disciplines. In addition, students have access to research resources in libraries and online platforms at the University of Houston Clear Lake.
                </p>
                <p>
                  To complement and strengthen this training, students participate in a variety of space-related activities at the Johnson Space Center (J.S.C.), the University of Houston Clear Lake, Rice University, Space Center Houston, George Observatory at Brazos Bend State Park, and the Houston Museum of Natural Science.
                </p>
                <p className="mt-4 text-base">
                  These activities include a tour of J.S.C. facilities, a full team mission, a special project at George Observatory, an ARISS link with the International Space Station (ISS), and an international videoconference on life sciences, bioastronautics, and aerospace medicine at a university.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <BookCheck className="w-10 h-10" style={{ color: BRAND.blue }} />
              <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: BRAND.blue }}>How to Apply to Space Week?</h2>
            </div>
            <div className="text-center mb-8">
              <Link
                href="/academics/hughes-space/united-space-school/requirements"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: BRAND.blue, color: "white" }}
              >
                <FileText className="w-5 h-5" />
                View Requirements
              </Link>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl p-6 border-2" style={{ borderColor: BRAND.blue }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.blue }}>Keep in mind...</h3>
                <p className="text-gray-700 mb-3">
                  Participation in the selection process for the United Space School camp is completely free.
                </p>
                <p className="text-gray-700">
                  First, you must be a high school student between 3rd and 6th grade (or between 14 and 19 years old), and have proficiency in understanding and expressing yourself in English.
                </p>
              </div>
              <div className="rounded-2xl p-6 border-2" style={{ borderColor: BRAND.blue }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.blue }}>Additionally...</h3>
                <p className="text-gray-700">
                  The 18 students selected nationwide will have to demonstrate their skills and knowledge at Space Week, which will take place at Hughes Schools in the city of Cochabamba, Bolivia, from <strong>January 26 to 30, 2026</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center text-white space-y-6">
            <Rocket className="w-16 h-16 mx-auto" style={{ color: BRAND.yellow }} />
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Apply?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Take the first step toward representing Bolivia at the United Space School
            </p>
            <a
              href={APPLICATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
            >
              <Rocket className="w-5 h-5" />
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

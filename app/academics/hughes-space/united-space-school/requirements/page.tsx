"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, Pencil, FlaskConical } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

const APPLICATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSebFiZI9bn8C74mE4N7KIZVxtFgOJ55oTM1S1Oi28rm7g7zhw/viewform";

export default function RequirementsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with back button */}
      <section className="py-8 bg-white border-b">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/academics/hughes-space/united-space-school"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: BRAND.blue }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to United Space School
          </Link>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: BRAND.blue }}>
                Space Week Requirements
              </h1>
              <p className="text-xl text-gray-600">
                What you need to apply
              </p>
            </div>

            <div className="space-y-8">
              {/* Required Documents */}
              <div className="rounded-2xl p-8 bg-white shadow-lg border-2" style={{ borderColor: BRAND.blue }}>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-8 h-8" style={{ color: BRAND.blue }} />
                  <h2 className="text-2xl font-bold" style={{ color: BRAND.blue }}>Required Documents</h2>
                </div>
                <ul className="space-y-4 text-lg text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl" style={{ color: BRAND.yellow }}>•</span>
                    <span>
                      <strong>Curriculum Vitae (CV)</strong> highlighting academic achievements, extracurricular activities, and/or any previous experience in STEM.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl" style={{ color: BRAND.yellow }}>•</span>
                    <span>
                      <strong>Two 500-word essays</strong> (mandatory).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl" style={{ color: BRAND.yellow }}>•</span>
                    <span>
                      <strong>Scientific project</strong> (optional) - Upload a Word file mentioning your most important projects (academic or personal), including images.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Essays */}
              <div className="rounded-2xl p-8 bg-white shadow-lg border-2" style={{ borderColor: BRAND.yellow }}>
                <div className="flex items-center gap-3 mb-6">
                  <Pencil className="w-8 h-8" style={{ color: BRAND.blue }} />
                  <h2 className="text-2xl font-bold" style={{ color: BRAND.blue }}>Essays (500 words each)</h2>
                </div>
                <div className="space-y-6">
                  <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(var(--hs-blue-rgb), 0.05)" }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: BRAND.blue }}>
                      1. Scientific Essay (500 words)
                    </h3>
                    <p className="text-gray-700 italic">
                      "How can space technologies be used to monitor deforestation and crops from space in Bolivia?"
                    </p>
                  </div>
                  <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(var(--hs-blue-rgb), 0.05)" }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: BRAND.blue }}>
                      2. Personal Essay (500 words)
                    </h3>
                    <p className="text-gray-700 italic">
                      "Why should you be selected for USS 2026?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Scientific Project */}
              <div className="rounded-2xl p-8 bg-white shadow-lg border-2 border-gray-300">
                <div className="flex items-center gap-3 mb-6">
                  <FlaskConical className="w-8 h-8" style={{ color: BRAND.yellow }} />
                  <h2 className="text-2xl font-bold" style={{ color: BRAND.blue }}>Scientific Project (Optional)</h2>
                </div>
                <p className="text-lg text-gray-700">
                  Upload a Word document describing your most important project(s), whether academic or personal. Include images to showcase your work.
                </p>
              </div>

              {/* CTA */}
              <div className="text-center pt-8">
                <Link
                  href={APPLICATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
                >
                  <FileText className="w-5 h-5" />
                  Submit Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

const APPLICATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSebFiZI9bn8C74mE4N7KIZVxtFgOJ55oTM1S1Oi28rm7g7zhw/viewform";

interface Requirement {
  id: number;
  requirementName: string;
  description: string;
  isOptional: boolean;
}

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/united-space-school-requirements`);
        const data = await response.json();
        setRequirements(data.data || []);
      } catch (error) {
        console.error("Error fetching requirements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

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

            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Loading requirements...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Requirements Cards */}
                {requirements.map((requirement, index) => (
                  <div 
                    key={requirement.id}
                    className="rounded-2xl p-8 bg-white shadow-lg border-2" 
                    style={{ borderColor: requirement.isOptional ? "#d1d5db" : (index % 2 === 0 ? BRAND.blue : BRAND.yellow) }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 className="w-8 h-8" style={{ color: requirement.isOptional ? BRAND.yellow : BRAND.blue }} />
                      <h2 className="text-2xl font-bold" style={{ color: BRAND.blue }}>
                        {requirement.requirementName}
                        {requirement.isOptional && (
                          <span className="text-lg font-normal text-gray-600 ml-2">(Optional)</span>
                        )}
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 whitespace-pre-line">
                      {requirement.description}
                    </p>
                  </div>
                ))}

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
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

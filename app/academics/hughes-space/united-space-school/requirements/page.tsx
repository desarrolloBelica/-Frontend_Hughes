"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, Rocket } from "lucide-react";

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
    /* Contenedor principal con el fondo aplicado a TODA la página */
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      
      {/* Fondo de estrellas global */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-slate-900/50 to-slate-950" />
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iODAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iMTQwIiByPSIwLjgiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTcwIiByPSIxLjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxNjAiIHI9IjAuOSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz48L3N2Zz4=')] opacity-80" />
      
      <div className="relative z-10">
        
        {/* Back Link Top */}
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <Link
            href="/academics/hughes-space/united-space-school"
            className="inline-flex items-center gap-2 text-hs-yellow opacity-80 hover:opacity-100 transition-opacity font-bold text-lg drop-shadow-md"
          >
            <ArrowLeft className="w-5 h-5" /> Back to United Space School
          </Link>
        </div>

        {/* Hero & Title */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-yellow leading-tight drop-shadow-lg">
              Space Week Requirements
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto font-light text-hs-yellow opacity-90">
              What you need to apply
            </p>
          </div>
        </section>

        {/* Requirements List */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="mx-auto max-w-5xl">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-xl font-bold text-hs-yellow animate-pulse">Loading requirements...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {requirements.map((requirement) => (
                  <div 
                    key={requirement.id}
                    className={`rounded-3xl p-8 md:p-10 shadow-xl border-2 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] bg-hs-bluenavy/40 ${
                      requirement.isOptional 
                        ? "border-white/20 hover:border-white/50" 
                        : "border-hs-yellow/30 hover:border-hs-yellow"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <CheckCircle2 
                        className={`w-8 h-8 ${requirement.isOptional ? "text-white opacity-80" : "text-hs-yellow"}`} 
                      />
                      <h2 className={`text-2xl md:text-3xl font-bold ${requirement.isOptional ? "text-white" : "text-hs-yellow"}`}>
                        {requirement.requirementName}
                        {requirement.isOptional && (
                          <span className="text-lg font-medium text-white opacity-70 ml-3">(Optional)</span>
                        )}
                      </h2>
                    </div>
                    <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium whitespace-pre-line pl-12">
                      {requirement.description}
                    </p>
                  </div>
                ))}

                {/* Final CTA */}
                <div className="text-center pt-16 pb-24">
                  <Link
                    href={APPLICATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-xl shadow-lg transition-all hover:scale-105 hover:shadow-2xl border-2 border-hs-yellow bg-hs-yellow text-hs-bluenavy"
                  >
                    <Rocket className="w-6 h-6" />
                    Submit Application
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Story = {
  id: string | number;
  documentId?: string;
  title?: string;
  description?: string;
  testimonialDate?: string;
  student?: any;
  representativeImages?: any;
};

export default function DonationStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        
        const attempts = [
          `${base}/api/donation-stories?populate[representativeImages]=*&populate[student]=*&pagination[pageSize]=100&sort[0]=testimonialDate:desc`,
          `${base}/api/donation-stories?populate[representativeImages]=true&populate[student]=true&pagination[pageSize]=100`,
          `${base}/api/donation-stories?populate=*&pagination[pageSize]=100`,
          `${base}/api/donation-stories?pagination[pageSize]=100`,
        ];

        let data = null;
        for (const url of attempts) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const json = await res.json();
            data = Array.isArray(json) ? json : (json.data ?? []);
            if (data) break;
          } catch {
            continue;
          }
        }

        if (!data) throw new Error("Unable to load stories (all attempts failed)");
        setStories(data);
      } catch (err) {
        console.error("Failed to load donation stories:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getImageUrl(story: Story): string {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    const images = story.representativeImages?.data ?? story.representativeImages ?? [];
    const first = Array.isArray(images) ? images[0] : images;
    if (!first) return "/38.JPG";
    const url = first.url ?? first.attributes?.url;
    if (!url) return "/38.JPG";
    return url.startsWith("http") ? url : `${base}${url}`;
  }

  function getStudentName(story: Story): string {
    const student = story.student?.data ?? story.student;
    if (!student) return "Anonymous";
    const firstName = student.firstName ?? student.attributes?.firstName ?? "";
    const lastName = student.lastName ?? student.attributes?.lastName ?? "";
    return `${firstName} ${lastName}`.trim() || "Anonymous";
  }

  return (
    <main className="min-h-screen bg-hs-bluenavy pb-24">
      {/* Header */}
      <section className="relative pt-16 md:pt-24 pb-16 border-b-2 border-white/10 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--hs-yellow)_0%,_transparent_50%)] blur-[80px]" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <Link
            href="/donation"
            className="inline-flex items-center gap-2 text-sm font-bold text-hs-yellow hover:opacity-80 transition-opacity mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Donations
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-hs-yellow/10 border-2 border-hs-yellow/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-hs-yellow mb-4">
              Real Impact
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Donation Impact <span className="text-hs-yellow">Stories</span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed">
              Real stories from students whose lives have been transformed by your generosity. See how your gifts open doors to the world.
            </p>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 border-2 border-white/10 rounded-[32px] overflow-hidden shadow-xl animate-pulse">
                  <div className="h-64 bg-white/10" />
                  <div className="p-8">
                    <div className="h-8 bg-white/10 rounded mb-4 w-3/4" />
                    <div className="h-4 bg-white/10 rounded mb-3 w-full" />
                    <div className="h-4 bg-white/10 rounded mb-6 w-5/6" />
                    <div className="h-6 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-red-500/20 border-2 border-red-500 rounded-[40px]">
              <p className="text-white font-bold text-xl mb-4">Failed to load stories: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex rounded-full bg-red-500 px-8 py-3 font-bold text-white hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20 border-2 border-white/10 rounded-[40px] bg-white/5">
              <p className="text-white/60 text-xl font-bold">No donation stories available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              {stories.map((story) => {
                const docId = story.documentId ?? story.id;
                const title = story.title ?? "Untitled Story";
                const description = story.description ?? "";
                const studentName = getStudentName(story);
                const imageUrl = getImageUrl(story);
                const date = story.testimonialDate
                  ? new Date(story.testimonialDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                  : "";

                return (
                  <Link
                    key={docId}
                    href={`/donation/stories/${docId}`}
                    className="group bg-white/5 border-2 border-white/10 rounded-[32px] overflow-hidden shadow-2xl hover:border-hs-yellow transition-all duration-300 hover:-translate-y-2 flex flex-col"
                  >
                    <div className="relative h-64 md:h-72 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={studentName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-hs-bluenavy via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="font-extrabold text-2xl text-hs-yellow mb-4 leading-tight group-hover:text-white transition-colors">
                        {title}
                      </h3>
                      <blockquote className="text-base font-medium text-white/80 italic mb-8 line-clamp-4 flex-grow">
                        "{description}"
                      </blockquote>
                      <div className="mt-auto border-t-2 border-white/10 pt-5">
                        <div className="font-bold text-lg text-white uppercase tracking-widest mb-1">
                          {studentName}
                        </div>
                        <div className="flex items-center justify-between">
                          {date ? <span className="text-sm font-bold text-hs-yellow/70">{date}</span> : <span />}
                          <div className="text-hs-yellow font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
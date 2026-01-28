"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/donation"
            className="inline-flex items-center gap-2 text-[var(--hs-blue)] font-semibold mb-8 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Donations
          </Link>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: BRAND.blue }}>
              Donation Impact Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from students whose lives have been transformed by your generosity
            </p>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3" />
                    <div className="h-20 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load stories: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[var(--hs-blue)] font-semibold hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl">No donation stories available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {stories.map((story) => {
                const docId = story.documentId ?? story.id;
                const title = story.title ?? "Untitled Story";
                const description = story.description ?? "";
                const studentName = getStudentName(story);
                const imageUrl = getImageUrl(story);
                const date = story.testimonialDate
                  ? new Date(story.testimonialDate).toLocaleDateString()
                  : "";

                return (
                  <Link
                    key={docId}
                    href={`/donation/stories/${docId}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative h-64">
                      <Image
                        src={imageUrl}
                        alt={studentName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2" style={{ color: BRAND.blue }}>
                        {title}
                      </h3>
                      <blockquote className="text-gray-700 mb-4 line-clamp-3">
                        {description}
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold" style={{ color: BRAND.blue }}>
                            {studentName}
                          </div>
                          {date && <div className="text-sm text-gray-500">{date}</div>}
                        </div>
                        <span className="text-[var(--hs-blue)] font-semibold text-sm">
                          Read More →
                        </span>
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

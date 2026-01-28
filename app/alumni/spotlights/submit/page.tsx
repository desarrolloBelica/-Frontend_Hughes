"use client";

import { useState } from "react";
import Link from "next/link";

const HS_BLUE = "var(--hs-blue)";
const HS_YELLOW = "var(--hs-yellow)";
const HS_NAVY = "var(--hs-bluenavy)";

type FormState = {
  fullname: string;
  city: string;
  university: string;
  profession: string;
  graduationYear: string; // YYYY-MM-DD
  artisticPath: string;
  biography: string;
  hughesImpact: string;
  messageForStudents: string;
};

const initial: FormState = {
  fullname: "",
  city: "",
  university: "",
  profession: "",
  graduationYear: "",
  artisticPath: "",
  biography: "",
  hughesImpact: "",
  messageForStudents: "",
};

export default function SubmitSpotlightPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [inputVersion, setInputVersion] = useState(0);

  function onChange<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
      const formData = new FormData();
      formData.append("data", JSON.stringify({ ...form, approved: false }));
      files.forEach((file) => {
        formData.append("files.medias", file);
      });

      const res = await fetch(`${base}/api/spothights`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        let detail = "";
        try {
          const j = await res.json();
          detail = j?.error?.message || JSON.stringify(j).slice(0, 200);
        } catch {
          detail = await res.text();
        }
        throw new Error(`Failed to submit (HTTP ${res.status}) ${detail}`);
      }
      setSuccess("Spotlight submitted! Once approved, it will appear in the list.");
      setForm(initial);
      setFiles([]);
      setInputVersion((v) => v + 1);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#f5f6fb" }}>
      <section className="relative overflow-hidden pb-16">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(115deg, ${HS_NAVY} 0%, ${HS_BLUE} 60%, ${HS_YELLOW} 120%)` }}
        />
        <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(80rem 40rem at 20% 10%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(50rem 30rem at 90% 0%, rgba(255,255,255,0.2), transparent 55%)" }} />

        <div className="relative mx-auto max-w-4xl px-6 pt-14">
          <div className="flex items-center justify-between gap-4 flex-wrap text-white">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] border border-white/20">
                Share your story
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Submit your Hughes spotlight.</h1>
              <p className="text-white/80 max-w-2xl">We celebrate professional, artistic, and service achievements. Your voice inspires the next generation of Hughes.</p>
            </div>
            <Link
              href="/alumni/spotlights"
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              ← Back to Spotlights
            </Link>
          </div>

          <form onSubmit={onSubmit} className="mt-10 grid gap-4 bg-white border border-[#e6e8f2] rounded-2xl p-6 shadow-lg">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="hs-label hs-label-required">Full name</label>
                <input
                  value={form.fullname}
                  onChange={(e) => onChange("fullname", e.target.value)}
                  className="hs-input"
                  placeholder="E.g. Maria Lopez"
                  required
                />
              </div>
              <div>
                <label className="hs-label hs-label-required">Graduation year</label>
                <input
                  type="date"
                  value={form.graduationYear}
                  onChange={(e) => onChange("graduationYear", e.target.value)}
                  className="hs-input"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="hs-label">City</label>
                <input value={form.city} onChange={(e) => onChange("city", e.target.value)} className="hs-input" />
              </div>
              <div>
                <label className="hs-label">University</label>
                <input value={form.university} onChange={(e) => onChange("university", e.target.value)} className="hs-input" />
              </div>
              <div>
                <label className="hs-label">Profession</label>
                <input value={form.profession} onChange={(e) => onChange("profession", e.target.value)} className="hs-input" />
              </div>
            </div>

            <div>
              <label className="hs-label">Professional or artistic path</label>
              <input value={form.artisticPath} onChange={(e) => onChange("artisticPath", e.target.value)} className="hs-input" />
            </div>

            <div>
              <label className="hs-label">Media (photos, images, videos)</label>
              <input
                key={inputVersion}
                type="file"
                accept="image/*,video/*,application/pdf"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                className="mt-2 block w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: "#e2e6f0" }}
              />
              <p className="mt-1 text-xs text-hughes-blue/70">You can add multiple images or media files to appear in your spotlight.</p>
            </div>

            <div>
              <label className="hs-label">Biography</label>
              <textarea
                value={form.biography}
                onChange={(e) => onChange("biography", e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border px-3 py-3 text-sm"
                style={{ borderColor: "#e2e6f0" }}
              />
            </div>

            <div>
              <label className="hs-label">How did Hughes impact your life?</label>
              <textarea
                value={form.hughesImpact}
                onChange={(e) => onChange("hughesImpact", e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border px-3 py-3 text-sm"
                style={{ borderColor: "#e2e6f0" }}
              />
            </div>

            <div>
              <label className="hs-label">Message for current students</label>
              <textarea
                value={form.messageForStudents}
                onChange={(e) => onChange("messageForStudents", e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border px-3 py-3 text-sm"
                style={{ borderColor: "#e2e6f0" }}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-700 text-sm">{success}</div>}

            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <button
                type="submit"
                disabled={submitting}
                className="btn-hs-primary disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Spotlight"}
              </button>
              <Link
                href="/alumni/spotlights"
                className="btn-hs-secondary"
              >
                ← Back to Spotlights
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

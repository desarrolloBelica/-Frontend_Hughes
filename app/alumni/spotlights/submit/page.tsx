"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";

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
      setSuccess("Spotlight submitted successfully! Once approved, it will appear in the list.");
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
    <main className="min-h-screen bg-hs-bluenavy">
      <section className="relative overflow-hidden pb-24 pt-16 md:pt-24">
        
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--hs-yellow)_0%,_transparent_60%)] blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-6">
          
          <div className="mb-12">
            <Link
              href="/alumni/spotlights"
              className="inline-flex items-center gap-2 text-sm font-bold text-hs-yellow hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Spotlights
            </Link>
          </div>

          <div className="text-white mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-hs-yellow/10 border-2 border-hs-yellow/30 px-5 py-2 text-sm font-bold uppercase tracking-widest text-hs-yellow mb-4">
              Share your story
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
              Submit your Hughes spotlight.
            </h1>
            <p className="text-lg font-medium text-white/80 max-w-2xl leading-relaxed">
              We celebrate professional, artistic, and service achievements. Your voice inspires the next generation of Hughes.
            </p>
          </div>

          <form onSubmit={onSubmit} className="bg-white/5 border-2 border-white/10 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl">
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.fullname}
                  onChange={(e) => onChange("fullname", e.target.value)}
                  className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors"
                  placeholder="E.g. Maria Lopez"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">
                  Graduation year <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.graduationYear}
                  onChange={(e) => onChange("graduationYear", e.target.value)}
                  className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">City</label>
                <input 
                  value={form.city} 
                  onChange={(e) => onChange("city", e.target.value)} 
                  className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">University</label>
                <input 
                  value={form.university} 
                  onChange={(e) => onChange("university", e.target.value)} 
                  className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Profession</label>
                <input 
                  value={form.profession} 
                  onChange={(e) => onChange("profession", e.target.value)} 
                  className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Professional or artistic path</label>
              <input 
                value={form.artisticPath} 
                onChange={(e) => onChange("artisticPath", e.target.value)} 
                className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors" 
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Media (Photos, Videos)</label>
              <div className="relative w-full rounded-xl border-2 border-dashed border-white/30 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center cursor-pointer">
                <UploadCloud className="w-8 h-8 text-hs-yellow mx-auto mb-2" />
                <p className="text-sm text-white/70 font-medium">Click to upload or drag and drop files here</p>
                <input
                  key={inputVersion}
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <span key={i} className="px-3 py-1 bg-hs-yellow/20 text-hs-yellow rounded-full text-xs font-bold border border-hs-yellow/30">
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Biography</label>
              <textarea
                value={form.biography}
                onChange={(e) => onChange("biography", e.target.value)}
                rows={4}
                className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">How did Hughes impact your life?</label>
              <textarea
                value={form.hughesImpact}
                onChange={(e) => onChange("hughesImpact", e.target.value)}
                rows={4}
                className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Message for current students</label>
              <textarea
                value={form.messageForStudents}
                onChange={(e) => onChange("messageForStudents", e.target.value)}
                rows={4}
                className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-500/20 border-2 border-red-500 p-4 text-white font-bold">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 rounded-xl bg-green-500/20 border-2 border-green-500 p-4 text-white font-bold">
                {success}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-white/10">
              <Link
                href="/alumni/spotlights"
                className="w-full sm:w-auto text-center rounded-full border-2 border-white/30 px-8 py-4 font-bold text-white hover:bg-white hover:text-hs-bluenavy transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto rounded-full bg-hs-yellow px-10 py-4 font-bold text-hs-bluenavy text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {submitting ? "Submitting…" : "Submit Spotlight"}
              </button>
            </div>
          </form>
          
        </div>
      </section>
    </main>
  );
}
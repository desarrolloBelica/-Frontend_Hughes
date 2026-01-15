"use client";

import { useState } from "react";
import Link from "next/link";

const HS_BLUE = "var(--hs-blue)";

type FormState = {
  fullname: string;
  city: string;
  university: string;
  profession: string;
  graduationYear: string; // YYYY-MM-DD
  artisticPath: string;
  accomplishments: string;
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
  accomplishments: "",
  hughesImpact: "",
  messageForStudents: "",
};

export default function SubmitSpotlightPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const body = {
        data: {
          ...form,
          approved: false,
        },
      };
      const res = await fetch(`${base}/api/spothights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#f9f9fb" }}>
      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: HS_BLUE }}>Submit a Spotlight</h1>
          <Link href="/alumni/spotlights" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
            ← Back to Spotlights
          </Link>
        </div>
        <p className="mt-2 text-hughes-blue/80">Fill out your story below. Once approved by our team, it will be listed publicly.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Full Name</label>
              <input value={form.fullname} onChange={(e) => onChange("fullname", e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Graduation Year</label>
              <input type="date" value={form.graduationYear} onChange={(e) => onChange("graduationYear", e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">City</label>
              <input value={form.city} onChange={(e) => onChange("city", e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">University</label>
              <input value={form.university} onChange={(e) => onChange("university", e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Profession</label>
              <input value={form.profession} onChange={(e) => onChange("profession", e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Career or Artistic Path</label>
            <input value={form.artisticPath} onChange={(e) => onChange("artisticPath", e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Proud Accomplishments</label>
            <textarea value={form.accomplishments} onChange={(e) => onChange("accomplishments", e.target.value)} rows={4} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">How Hughes Schools Impacted Me</label>
            <textarea value={form.hughesImpact} onChange={(e) => onChange("hughesImpact", e.target.value)} rows={4} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-hughes-blue/70">Message for Current Students</label>
            <textarea value={form.messageForStudents} onChange={(e) => onChange("messageForStudents", e.target.value)} rows={4} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e2e6f0" }} />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-700 text-sm">{success}</div>}

          <div className="mt-2 flex items-center gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center rounded-full bg-[var(--hs-blue)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit Spotlight"}
            </button>
            <Link href="/alumni/spotlights" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "#e3e6f2", color: HS_BLUE }}>
              ← Back to Spotlights
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

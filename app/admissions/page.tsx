// app/admissions/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileDown, ChevronDown, ChevronUp } from "lucide-react";

/* ───────────── Helpers: obtener ID de YouTube ───────────── */
function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1); // youtu.be/<id>
    if (u.searchParams.get("v")) return u.searchParams.get("v")!;   // watch?v=<id>
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
  } catch {}
  return null;
}

/* ───────────── YouTube sin hover (miniatura + play) ───────────── */
function YouTubeEmbedNoHover({ url, title }: { url: string; title: string }) {
  const [play, setPlay] = useState(false);
  const id = getYouTubeId(url);
  if (!id) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-[#f2f4fa] aspect-video flex items-center justify-center text-hughes-blue/60">
        Invalid YouTube URL
      </div>
    );
  }

  const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="relative overflow-hidden rounded-3xl aspect-video">
      {!play ? (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="relative w-full h-full"
          aria-label="Play video"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#0B1220]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedSrc}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}

/* ───────────── Tipos del formulario ───────────── */
type ArtImportance = "" | "no" | "poco" | "importante" | "muy";
type YesNo = "yes" | "no" | "";

type FormState = {
  studentName: string;
  studentIdNumber: string;      // Nº C.I. del estudiante
  incomingCourse: string;       // select
  birthDate: string;
  currentSchool: string;

  parentsFullNames: string;
  fatherPhone: string;
  motherPhone: string;
  parentsEmail: string;

  hasSiblingsHS: YesNo;
  siblingNames: string;

  references: string;           // ¿Qué referencias tiene de Hughes?
  artImportance: ArtImportance; // pregunta Google #1
  changeReason: string;         // pregunta Google #2 (condicional por curso)

  preferredInterview?: string;
};

/* Lista enumerada de grados (sin paralelos) */
const GRADE_OPTIONS = [
  "Kinder",
  "1st", "2nd", "3rd", "4th", "5th",
  "6th", "7th", "8th", "9th", "10th", "11th", "12th",
] as const;

// cursos desde 2º en adelante para mostrar "motivo del cambio"
const UPPER_GRADES = new Set<string>([
  "2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th",
]);

const INITIAL: FormState = {
  studentName: "",
  studentIdNumber: "",
  incomingCourse: "",
  birthDate: "",
  currentSchool: "",

  parentsFullNames: "",
  fatherPhone: "",
  motherPhone: "",
  parentsEmail: "",

  hasSiblingsHS: "",
  siblingNames: "",

  references: "",
  artImportance: "",
  changeReason: "",

  preferredInterview: "",
};

/* ───────────── Helper para recursos ───────────── */
type MediaAttrs = { url?: string; name?: string; mime?: string };
type MediaEntry = { id?: number | string; attributes?: MediaAttrs } & MediaAttrs;
type RelationData<T> = { data?: T | T[] | null } | T | T[] | null;
type ResourceV4 = { id: number | string; attributes?: { name?: string; file?: RelationData<MediaEntry> } };
type ResourceV5 = { id: number | string; name?: string; file?: RelationData<MediaEntry> };
type ResourceRow = ResourceV4 | ResourceV5;
type MediaNormalized = { url: string; name: string; mime?: string };

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function hasData(x: unknown): x is { data?: unknown } {
  return isObject(x) && "data" in x;
}
function abs(u?: string | null): string {
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}
function toMedia(m: unknown): MediaNormalized {
  if (!isObject(m)) return { url: "", name: "" };
  const me = m as MediaEntry;
  return {
    url: me.url ?? me.attributes?.url ?? "",
    name: me.name ?? me.attributes?.name ?? "",
    mime: me.mime ?? me.attributes?.mime ?? undefined,
  };
}
function normalizeMedia(rel: RelationData<MediaEntry>): MediaNormalized[] {
  if (!rel) return [];
  if (Array.isArray(rel)) return rel.map(toMedia);
  if (hasData(rel)) {
    const d = (rel as { data?: unknown }).data;
    if (!d) return [];
    return Array.isArray(d) ? d.map(toMedia) : [toMedia(d)];
  }
  return [toMedia(rel)];
}
function isV4(r: ResourceRow): r is ResourceV4 {
  return (r as ResourceV4).attributes !== undefined;
}
function getName(r: ResourceRow): string {
  return isV4(r) ? r.attributes?.name ?? "" : (r as ResourceV5).name ?? "";
}
function getFiles(r: ResourceRow): MediaNormalized[] {
  const rel = isV4(r) ? r.attributes?.file : (r as ResourceV5).file;
  return normalizeMedia(rel ?? null);
}
function asResourceArray(input: unknown): ResourceRow[] {
  if (Array.isArray(input)) return input as ResourceRow[];
  if (isObject(input) && "data" in input) {
    const d = (input as { data?: unknown }).data;
    if (Array.isArray(d)) return d as ResourceRow[];
  }
  return [];
}
function fileBadgeName(mime?: string, url?: string) {
  const u = (url ?? "").toLowerCase();
  if (mime?.includes("pdf") || u.endsWith(".pdf")) return "PDF";
  if (mime?.includes("word") || u.endsWith(".docx") || u.endsWith(".doc")) return "DOCX";
  return "FILE";
}

export default function AdmissionsPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const showChangeReason = UPPER_GRADES.has(form.incomingCourse);

  // Resources state
  const [resources, setResources] = useState<Array<{ id: string; title: string; url: string; mime?: string }>>([]);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoadingResources(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("populate[file]", "true");
        qs.set("pagination[pageSize]", "10");
        const res = await fetch(`${base}/api/resources?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json();
        const rows = asResourceArray(json);

        const flat: Array<{ id: string; title: string; url: string; mime?: string }> = [];
        rows.forEach((r) => {
          const baseName = getName(r) || "Untitled";
          getFiles(r).forEach((m, i) => {
            const url = abs(m.url);
            if (!url) return;
            flat.push({ id: `${String(r.id)}-${i}`, title: m.name || baseName, url, mime: m.mime });
          });
        });

        if (!cancel) setResources(flat);
      } catch {
        // silently fail
      } finally {
        if (!cancel) setLoadingResources(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // Validation helper
  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    // Required fields
    if (!form.studentName?.trim()) errors.studentName = "Student name is required";
    if (!form.incomingCourse) errors.incomingCourse = "Grade/course is required";
    if (!form.parentsEmail?.trim()) {
      errors.parentsEmail = "Parents' email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentsEmail)) {
      errors.parentsEmail = "Please enter a valid email address";
    }

    // Phone validation (optional but should be valid if provided)
    if (form.fatherPhone && !/^\+?[0-9\s-()]+$/.test(form.fatherPhone)) {
      errors.fatherPhone = "Please enter a valid phone number";
    }
    if (form.motherPhone && !/^\+?[0-9\s-()]+$/.test(form.motherPhone)) {
      errors.motherPhone = "Please enter a valid phone number";
    }

    // Sibling validation
    if (form.hasSiblingsHS === "yes" && !form.siblingNames?.trim()) {
      errors.siblingNames = "Please provide sibling names";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setError(null);
    setFieldErrors({});

    try {
      // Run validation
      if (!validateForm()) {
        setError("Please fix the errors above before submitting.");
        setSubmitting(false);
        return;
      }

      // Enviar todo el payload (incluye los nuevos campos)
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: form }),
      });
      const json: unknown = await res.json();

      const okFlag = typeof json === "object" && json !== null && "ok" in (json as Record<string, unknown>)
        ? Boolean((json as { ok?: unknown }).ok)
        : false;

      if (!res.ok || !okFlag) {
        setOk(false);
        // Extract detailed error message
        let errorMsg = "There was a problem submitting your application.";
        if (typeof json === "object" && json !== null) {
          const jsonObj = json as Record<string, unknown>;
          if (jsonObj.error && typeof jsonObj.error === "object") {
            const errObj = jsonObj.error as Record<string, unknown>;
            if (errObj.message) errorMsg += ` ${String(errObj.message)}`;
            if (errObj.details) errorMsg += ` Details: ${JSON.stringify(errObj.details)}`;
          } else if (jsonObj.error) {
            errorMsg += ` ${String(jsonObj.error)}`;
          }
        }
        if (res.status === 401) {
          errorMsg = "Authentication error. Please contact support or try again later.";
        }
        setError(errorMsg);
      } else {
        setOk(true);
        setForm(INITIAL);
      }
    } catch {
      setOk(false);
      setError("Unexpected error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero / franja superior con azul Hugues */}
      <section className="w-full text-white" style={{ background: "var(--hs-blue)" }}>
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Admissions</h1>
          <p className="mt-3 text-white/95 max-w-2xl text-lg md:text-xl">
            Limited seats. Submit your interview request today and start your path to Hughes Schools.
          </p>
        </div>
      </section>

      {/* Intro + video */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Texto */}
          <div>
            <p className="text-[12px] font-semibold tracking-[0.2em] text-hughes-blue">
              LIMITED SEATS AVAILABLE
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-hughes-blue">
              Apply NOW for 2025–26!
            </h2>
            <p className="mt-3 text-lg text-hughes-blue/80">
              Be part of a community focused on academic excellence and integral development.
            </p>

            {/* HOW TO APPLY */}
            <h3 className="mt-6 text-xl font-semibold text-hughes-blue">How to apply</h3>
            <ol className="mt-3 space-y-3 text-hughes-blue">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--hs-yellow)" }} />
                <span>
                  <strong>Fill out the Interview Request Form.</strong> Tell us about the student and how to contact you.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--hs-yellow)" }} />
                <span>
                  <strong>We contact you</strong> to schedule your campus visit and interview.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--hs-yellow)" }} />
                <span>
                  <strong>Bring required documents</strong> (ID, birth certificate, transcripts).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--hs-yellow)" }} />
                <span>
                  <strong>Receive next steps</strong> and finalize your enrollment if admitted.
                </span>
              </li>
            </ol>

            <a
              href="#apply"
              className="group mt-6 inline-flex items-center rounded-full border-2 px-6 py-2 font-semibold text-hughes-blue border-hughes-blue hover:bg-hughes-blue hover:text-white transition"
            >
              Start My Application
            </a>
          </div>

          {/* Video */}
          <div>
            <YouTubeEmbedNoHover
              url="https://www.youtube.com/watch?v=Q85YLX65Oa8&list=TLGG5EgtexIIU6gxNDA4MjAyNQ"
              title="Hughes Schools Tour"
            />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-white border-t" style={{ borderColor: "#ececf4" }}>
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-hughes-blue">Admissions Resources</h3>
              <p className="mt-2 text-hughes-blue/80">Download important documents and school regulations</p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-2 font-semibold text-hughes-blue border-hughes-blue hover:bg-hughes-blue hover:text-white transition"
            >
              See All Resources
            </Link>
          </div>

          {/* Collapsible Resources */}
          <div className="rounded-2xl border bg-white" style={{ borderColor: "#ececf4" }}>
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="w-full flex items-center justify-between p-6 text-left"
              aria-expanded={resourcesOpen}
            >
              <div className="flex items-center gap-3">
                <FileDown className="w-6 h-6" style={{ color: "var(--hs-blue)" }} />
                <span className="font-semibold text-hughes-blue">
                  {loadingResources ? "Loading resources..." : `Available Documents (${resources.length})`}
                </span>
              </div>
              {resourcesOpen ? (
                <ChevronUp className="w-5 h-5 text-hughes-blue" />
              ) : (
                <ChevronDown className="w-5 h-5 text-hughes-blue" />
              )}
            </button>

            {resourcesOpen && (
              <div className="border-t px-6 pb-6" style={{ borderColor: "#ececf4" }}>
                {resources.length === 0 ? (
                  <p className="py-4 text-sm text-hughes-blue/60">No resources available at this time.</p>
                ) : (
                  <ul className="space-y-3 mt-4">
                    {resources.map((f) => (
                      <li key={f.id}>
                        <a
                          href={f.url}
                          download
                          target={f.url.startsWith("http") ? "_blank" : undefined}
                          rel="noopener"
                          className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4 transition hover:bg-gray-50"
                          style={{ borderColor: "#ececf4" }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold"
                              style={{ borderColor: "#e6e6f0", color: "var(--hs-blue)" }}
                            >
                              {fileBadgeName(f.mime, f.url)}
                            </span>
                            <span className="truncate font-medium text-hughes-blue text-sm">{f.title}</span>
                          </div>
                          <span
                            className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: "var(--hs-yellow)", color: "var(--hs-blue)" }}
                          >
                            Download
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Formulario + beneficios */}
      <section id="apply" className="bg-[#f5f6fb]">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Lado izquierdo: por qué aplicar */}
          <div className="lg:col-span-6">
            <h3 className="text-2xl md:text-3xl font-bold text-hughes-blue">Why apply to Hughes Schools?</h3>
            <p className="mt-3 text-hughes-blue/80">
              Our admissions process is designed to get to know your child and guide your family through a smooth transition.
            </p>
            <div
              className="mt-6 p-5 rounded-2xl border bg-white text-sm md:text-base text-hughes-blue/90 leading-relaxed"
              style={{ borderColor: "var(--hs-yellow)" }}
            >
              <p className="font-semibold mb-2">Benefits of joining Hughes Schools:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong>Rigorous academics</strong> with modern methodologies and high expectations.</li>
                <li><strong>Holistic development</strong>: character, arts, sports and leadership.</li>
                <li><strong>Safe, caring community</strong> and a culture of respect.</li>
                <li><strong>Modern facilities</strong> designed for learning and innovation.</li>
                <li><strong>Bilingual/global focus</strong> to open opportunities beyond the classroom.</li>
                <li><strong>Limited seats</strong>: applying early improves your chances of securing a place.</li>
              </ul>
            </div>
          </div>

          {/* Tarjeta del formulario */}
          <div className="lg:col-span-6">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border"
              style={{ borderColor: "#ececf4" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Datos del estudiante */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-hughes-blue">
                    Student name *
                  </label>
                  <input
                    required
                    value={form.studentName}
                    onChange={(e) => {
                      setForm({ ...form, studentName: e.target.value });
                      if (fieldErrors.studentName) {
                        setFieldErrors({ ...fieldErrors, studentName: "" });
                      }
                    }}
                    className={`mt-2 w-full rounded-xl border px-3 py-2 ${
                      fieldErrors.studentName ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.studentName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.studentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-hughes-blue">
                    ID number (N.º C.I.)
                  </label>
                  <input
                    value={form.studentIdNumber}
                    onChange={(e) => setForm({ ...form, studentIdNumber: e.target.value })}
                    className="mt-2 w-full rounded-xl border px-3 py-2"
                    placeholder="e.g., 12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-hughes-blue">
                    Incoming grade/course *
                  </label>
                  <select
                    required
                    value={form.incomingCourse}
                    onChange={(e) => {
                      setForm({ ...form, incomingCourse: e.target.value });
                      if (fieldErrors.incomingCourse) {
                        setFieldErrors({ ...fieldErrors, incomingCourse: "" });
                      }
                    }}
                    className={`mt-2 w-full rounded-xl border px-3 py-2 ${
                      fieldErrors.incomingCourse ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select a grade</option>
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.incomingCourse && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.incomingCourse}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-hughes-blue">Birth date</label>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className="mt-2 w-full rounded-xl border px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-hughes-blue">Current school</label>
                  <input
                    value={form.currentSchool}
                    onChange={(e) => setForm({ ...form, currentSchool: e.target.value })}
                    className="mt-2 w-full rounded-xl border px-3 py-2"
                  />
                </div>

                {/* Contacto de padres */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-hughes-blue">Parents’ full names</label>
                  <input
                    value={form.parentsFullNames}
                    onChange={(e) => setForm({ ...form, parentsFullNames: e.target.value })}
                    className="mt-2 w-full rounded-xl border px-3 py-2"
                    placeholder="e.g., Jane Doe & John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-hughes-blue">Father’s phone</label>
                  <input
                    value={form.fatherPhone}
                    onChange={(e) => {
                      setForm({ ...form, fatherPhone: e.target.value });
                      if (fieldErrors.fatherPhone) {
                        setFieldErrors({ ...fieldErrors, fatherPhone: "" });
                      }
                    }}
                    className={`mt-2 w-full rounded-xl border px-3 py-2 ${
                      fieldErrors.fatherPhone ? "border-red-500" : ""
                    }`}
                    placeholder="+591 70000000"
                  />
                  {fieldErrors.fatherPhone && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.fatherPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-hughes-blue">Mother’s phone</label>
                  <input
                    value={form.motherPhone}
                    onChange={(e) => {
                      setForm({ ...form, motherPhone: e.target.value });
                      if (fieldErrors.motherPhone) {
                        setFieldErrors({ ...fieldErrors, motherPhone: "" });
                      }
                    }}
                    className={`mt-2 w-full rounded-xl border px-3 py-2 ${
                      fieldErrors.motherPhone ? "border-red-500" : ""
                    }`}
                    placeholder="+591 70000000"
                  />
                  {fieldErrors.motherPhone && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.motherPhone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-hughes-blue">Parents’ email *</label>
                  <input
                    required
                    type="email"
                    value={form.parentsEmail}
                    onChange={(e) => {
                      setForm({ ...form, parentsEmail: e.target.value });
                      if (fieldErrors.parentsEmail) {
                        setFieldErrors({ ...fieldErrors, parentsEmail: "" });
                      }
                    }}
                    className={`mt-2 w-full rounded-xl border px-3 py-2 ${
                      fieldErrors.parentsEmail ? "border-red-500" : ""
                    }`}
                    placeholder="family@email.com"
                  />
                  {fieldErrors.parentsEmail && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.parentsEmail}</p>
                  )}
                </div>

                {/* Hermanos en Hughes */}
                <div>
                  <label className="block text-sm font-semibold text-hughes-blue">
                    ¿Tiene hermanos en Hughes Schools?
                  </label>
                  <div className="mt-2 flex gap-4 text-sm text-hughes-blue">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="hasSiblingsHS"
                        checked={form.hasSiblingsHS === "yes"}
                        onChange={() => setForm({ ...form, hasSiblingsHS: "yes" })}
                      />
                      Sí
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="hasSiblingsHS"
                        checked={form.hasSiblingsHS === "no"}
                        onChange={() => setForm({ ...form, hasSiblingsHS: "no", siblingNames: "" })}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-hughes-blue">
                    Nombre(s) del/los hermano(s)
                  </label>
                  <input
                    value={form.siblingNames}
                    onChange={(e) => {
                      setForm({ ...form, siblingNames: e.target.value });
                      if (fieldErrors.siblingNames) {
                        setFieldErrors({ ...fieldErrors, siblingNames: "" });
                      }
                    }}
                    className={`mt-2 w-full rounded-xl border px-3 py-2 ${
                      fieldErrors.siblingNames ? "border-red-500" : ""
                    }`}
                    placeholder="Si aplica"
                    disabled={form.hasSiblingsHS !== "yes"}
                  />
                  {fieldErrors.siblingNames && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.siblingNames}</p>
                  )}
                </div>

                {/* Referencias */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-hughes-blue">
                    ¿Qué referencias tiene de Hughes Schools?
                  </label>
                  <textarea
                    value={form.references}
                    onChange={(e) => setForm({ ...form, references: e.target.value })}
                    className="mt-2 w-full rounded-xl border px-3 py-2 min-h-[90px]"
                    placeholder="Por ejemplo: amigos/familiares, redes sociales, visita al campus, etc."
                  />
                </div>

                {/* Pregunta Google #1: Importancia artística */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-hughes-blue">
                    ¿Qué tan importante considera que es la formación artística (música y/o danza) para su hijo(a)?
                  </label>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-hughes-blue">
                    {[
                      { v: "no", t: "No es importante" },
                      { v: "poco", t: "Poco importante" },
                      { v: "importante", t: "Importante" },
                      { v: "muy", t: "Muy importante" },
                    ].map(opt => (
                      <label key={opt.v} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="artImportance"
                          checked={form.artImportance === (opt.v as ArtImportance)}
                          onChange={() => setForm({ ...form, artImportance: opt.v as ArtImportance })}
                        />
                        {opt.t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pregunta Google #2: Motivo del cambio (condicional) */}
                {showChangeReason && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-hughes-blue">
                      En caso de que ingrese a 2.º de primaria o cursos superiores, ¿cuál es el motivo del cambio de colegio?
                    </label>
                    <textarea
                      value={form.changeReason}
                      onChange={(e) => setForm({ ...form, changeReason: e.target.value })}
                      className="mt-2 w-full rounded-xl border px-3 py-2 min-h-[90px]"
                    />
                  </div>
                )}

                {/* Fecha de entrevista */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-hughes-blue">
                    Preferred interview date (optional)
                  </label>
                  <input
                    type="date"
                    value={form.preferredInterview}
                    onChange={(e) => setForm({ ...form, preferredInterview: e.target.value })}
                    className="mt-2 w-full rounded-xl border px-3 py-2"
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              {ok && (
                <p className="mt-4 text-sm text-green-600">
                  Thank you! Your application has been received.
                </p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  disabled={submitting}
                  className="group inline-flex items-center rounded-full bg-[var(--hs-yellow)] px-6 py-3 font-semibold text-hughes-blue transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

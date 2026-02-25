"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileDown, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

/* ───────────── Helpers: obtener ID de YouTube ───────────── */
function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v")!;
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
      <div className="relative overflow-hidden rounded-3xl bg-white/5 border-2 border-white/10 aspect-video flex items-center justify-center text-white/50 font-bold">
        Invalid YouTube URL
      </div>
    );
  }

  const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="relative overflow-hidden rounded-[32px] aspect-video shadow-2xl border-4 border-hs-yellow/50 bg-hs-bluenavy">
      {!play ? (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="relative w-full h-full group"
          aria-label="Play video"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-hs-bluenavy/40 group-hover:bg-hs-bluenavy/20 transition-colors">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-hs-yellow shadow-[0_0_30px_rgba(255,187,0,0.6)] group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-hs-bluenavy ml-1"
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
  studentIdNumber: string;
  incomingCourse: string;
  birthDate: string;
  currentSchool: string;
  parentsFullNames: string;
  fatherPhone: string;
  motherPhone: string;
  parentsEmail: string;
  hasSiblingsHS: YesNo;
  siblingNames: string;
  references: string;
  artImportance: ArtImportance;
  changeReason: string;
  preferredInterview?: string;
};

const GRADE_OPTIONS = [
  "Kinder",
  "1st", "2nd", "3rd", "4th", "5th",
  "6th", "7th", "8th", "9th", "10th", "11th", "12th",
] as const;

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
      } finally {
        if (!cancel) setLoadingResources(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!form.studentName?.trim()) errors.studentName = "El nombre del estudiante es obligatorio";
    if (!form.incomingCourse) errors.incomingCourse = "El curso es obligatorio";
    if (!form.parentsEmail?.trim()) {
      errors.parentsEmail = "El correo de los padres es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentsEmail)) {
      errors.parentsEmail = "Ingresa un correo electrónico válido";
    }
    if (form.fatherPhone && !/^\+?[0-9\s-()]+$/.test(form.fatherPhone)) {
      errors.fatherPhone = "Ingresa un número de teléfono válido";
    }
    if (form.motherPhone && !/^\+?[0-9\s-()]+$/.test(form.motherPhone)) {
      errors.motherPhone = "Ingresa un número de teléfono válido";
    }
    if (form.hasSiblingsHS === "yes" && !form.siblingNames?.trim()) {
      errors.siblingNames = "Ingresa los nombres de los hermanos";
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
      if (!validateForm()) {
        setError("Corrige los errores antes de enviar.");
        setSubmitting(false);
        return;
      }

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
        let errorMsg = "Hubo un problema al enviar tu solicitud.";
        if (typeof json === "object" && json !== null) {
          const jsonObj = json as Record<string, unknown>;
          if (jsonObj.error && typeof jsonObj.error === "object") {
            const errObj = jsonObj.error as Record<string, unknown>;
            if (errObj.message) errorMsg += ` ${String(errObj.message)}`;
          } else if (jsonObj.error) {
            errorMsg += ` ${String(jsonObj.error)}`;
          }
        }
        if (res.status === 401) {
          errorMsg = "Error de autenticación. Contacta soporte o inténtalo más tarde.";
        }
        setError(errorMsg);
      } else {
        setOk(true);
        setForm(INITIAL);
      }
    } catch {
      setOk(false);
      setError("Error inesperado. Inténtalo de nuevo más tarde.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-hs-bluenavy">
      
      {/* ───────────── HERO AMARILLO (Rediseñado para contraste con el Navbar) ───────────── */}
      <section className="relative overflow-hidden bg-hs-yellow rounded-b-[40px] shadow-2xl z-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--hs-bluenavy)_0%,_transparent_50%)] blur-[80px]" />
        
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-32 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-hs-bluenavy bg-hs-bluenavy/10 px-5 py-2 text-sm font-bold tracking-widest uppercase text-hs-bluenavy shadow-md mb-6">
            Join our community
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-hs-bluenavy mb-6">
            Admissions <span className="text-white drop-shadow-md">2025–26</span>
          </h1>
          
          <p className="text-lg md:text-xl font-bold text-hs-bluenavy/80 max-w-3xl leading-relaxed">
            Limited seats. Submit your interview request today and start your path to Hughes Schools. Be part of a community focused on academic excellence and integral development.
          </p>
          
          <a
            href="#apply"
            className="mt-10 inline-flex items-center rounded-full bg-hs-bluenavy px-10 py-4 font-bold text-lg text-hs-yellow shadow-xl hover:scale-105 hover:bg-white hover:text-hs-bluenavy transition-all"
          >
            Start your application
          </a>
        </div>
      </section>

      {/* Intro + video */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-hs-yellow leading-tight mb-8">
            How to apply?
          </h2>
          <ol className="space-y-6 text-white text-lg font-medium">
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-hs-yellow text-hs-bluenavy font-bold">1</span>
              <span>
                <strong className="text-hs-yellow">Complete the form.</strong> Tell us about the student and your contact information.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-hs-yellow text-hs-bluenavy font-bold">2</span>
              <span>
                <strong className="text-hs-yellow">We will contact you</strong> to schedule a campus visit and interview.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-hs-yellow text-hs-bluenavy font-bold">3</span>
              <span>
                <strong className="text-hs-yellow">Bring required documents</strong> (ID, birth certificate, report cards).
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-hs-yellow text-hs-bluenavy font-bold">4</span>
              <span>
                <strong className="text-hs-yellow">Receive next steps</strong> and complete enrollment if admitted.
              </span>
            </li>
          </ol>
        </div>

        <div>
          <YouTubeEmbedNoHover
            url="https://www.youtube.com/watch?v=Q85YLX65Oa8&list=TLGG5EgtexIIU6gxNDA4MjAyNQ"
            title="Hughes Schools Tour"
          />
        </div>
      </section>

      {/* Resources Section inside Admissions */}
      <section className="bg-hs-bluenavy border-t-2 border-white/10 pb-20">
        <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-hs-yellow">Admissions Resources</h3>
              <p className="mt-2 text-lg font-medium text-white/80">Download important documents and school regulations</p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full border-2 border-hs-yellow px-8 py-3 font-bold text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy transition-colors"
            >
              See All Resources
            </Link>
          </div>

          <div className="rounded-3xl border-2 border-white/10 bg-white/5 overflow-hidden shadow-2xl">
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-white/5 transition-colors focus:outline-none"
              aria-expanded={resourcesOpen}
            >
              <div className="flex items-center gap-4">
                <FileDown className="w-8 h-8 text-hs-yellow" />
                <span className="text-xl font-bold text-white">
                  {loadingResources ? "Loading resources..." : `Available Documents (${resources.length})`}
                </span>
              </div>
              {resourcesOpen ? (
                <ChevronUp className="w-6 h-6 text-hs-yellow" />
              ) : (
                <ChevronDown className="w-6 h-6 text-hs-yellow" />
              )}
            </button>

            {resourcesOpen && (
              <div className="border-t-2 border-white/10 px-6 md:px-8 pb-8 pt-4">
                {resources.length === 0 ? (
                  <p className="py-4 text-white/60 font-bold">No resources available at this time.</p>
                ) : (
                  <ul className="space-y-4">
                    {resources.map((f) => (
                      <li key={f.id}>
                        <a
                          href={f.url}
                          download
                          target={f.url.startsWith("http") ? "_blank" : undefined}
                          rel="noopener"
                          className="group flex items-center justify-between gap-4 rounded-2xl border-2 border-white/10 bg-hs-bluenavy p-4 md:p-6 transition-all hover:border-hs-yellow hover:-translate-y-1 shadow-lg"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <span className="inline-flex items-center justify-center rounded-full border-2 border-hs-yellow bg-hs-yellow/10 px-3 py-1 text-xs font-bold text-hs-yellow tracking-widest">
                              {fileBadgeName(f.mime, f.url)}
                            </span>
                            <span className="truncate font-bold text-white text-base md:text-lg group-hover:text-hs-yellow transition-colors">{f.title}</span>
                          </div>
                          <span className="shrink-0 text-sm font-bold px-4 py-2 rounded-full bg-hs-yellow text-hs-bluenavy">
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
      <section id="apply" className="bg-hs-yellow text-hs-bluenavy relative">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Why choose Hughes Schools?
            </h3>
            <p className="text-xl font-bold opacity-90">
              Our admission process is designed to get to know your child and guide your family through a seamless transition.
            </p>
            <div className="p-8 rounded-[32px] border-4 border-hs-bluenavy bg-hs-bluenavy/5 shadow-xl">
              <p className="text-2xl font-extrabold mb-6">Benefits of joining us:</p>
              <ul className="space-y-4 text-lg font-bold">
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 text-hs-bluenavy shrink-0"/> <span><strong>Rigorous academics</strong> with modern methodologies.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 text-hs-bluenavy shrink-0"/> <span><strong>Integral development:</strong> character, arts, sports, leadership.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 text-hs-bluenavy shrink-0"/> <span><strong>Safe community</strong> with a strong culture of respect.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 text-hs-bluenavy shrink-0"/> <span><strong>Global bilingual approach</strong> opening worldwide doors.</span></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="rounded-[40px] bg-hs-bluenavy p-8 md:p-12 shadow-2xl border-4 border-hs-bluenavy text-white"
            >
              <h3 className="text-3xl font-extrabold text-hs-yellow mb-8 border-b-2 border-white/10 pb-6">
                Application Form
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Nombre del estudiante *</label>
                  <input
                    value={form.studentName}
                    onChange={(e) => {
                      setForm({ ...form, studentName: e.target.value });
                      if (fieldErrors.studentName) setFieldErrors({ ...fieldErrors, studentName: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors ${fieldErrors.studentName ? "border-red-500" : "border-white/20"}`}
                    placeholder="Ej.: Juan Pérez"
                  />
                  {fieldErrors.studentName && <p className="mt-1 text-xs font-bold text-red-400">{fieldErrors.studentName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Número de CI</label>
                  <input
                    value={form.studentIdNumber}
                    onChange={(e) => setForm({ ...form, studentIdNumber: e.target.value })}
                    className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors"
                    placeholder="Ej.: 12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Curso al que postula *</label>
                  <select
                    value={form.incomingCourse}
                    onChange={(e) => {
                      setForm({ ...form, incomingCourse: e.target.value });
                      if (fieldErrors.incomingCourse) setFieldErrors({ ...fieldErrors, incomingCourse: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-hs-bluenavy px-4 py-3 text-white focus:border-hs-yellow focus:outline-none transition-colors appearance-none cursor-pointer ${fieldErrors.incomingCourse ? "border-red-500" : "border-white/20"}`}
                  >
                    <option value="">Selecciona un curso</option>
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  {fieldErrors.incomingCourse && <p className="mt-1 text-xs font-bold text-red-400">{fieldErrors.incomingCourse}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white focus:border-hs-yellow focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Colegio actual</label>
                  <input
                    value={form.currentSchool}
                    onChange={(e) => setForm({ ...form, currentSchool: e.target.value })}
                    className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Nombres completos de los padres</label>
                  <input
                    value={form.parentsFullNames}
                    onChange={(e) => setForm({ ...form, parentsFullNames: e.target.value })}
                    className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors"
                    placeholder="Ej.: Ana Pérez & Carlos Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Teléfono del padre</label>
                  <input
                    value={form.fatherPhone}
                    onChange={(e) => {
                      setForm({ ...form, fatherPhone: e.target.value });
                      if (fieldErrors.fatherPhone) setFieldErrors({ ...fieldErrors, fatherPhone: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors ${fieldErrors.fatherPhone ? "border-red-500" : "border-white/20"}`}
                    placeholder="+591 70000000"
                  />
                  {fieldErrors.fatherPhone && <p className="mt-1 text-xs font-bold text-red-400">{fieldErrors.fatherPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Teléfono de la madre</label>
                  <input
                    value={form.motherPhone}
                    onChange={(e) => {
                      setForm({ ...form, motherPhone: e.target.value });
                      if (fieldErrors.motherPhone) setFieldErrors({ ...fieldErrors, motherPhone: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors ${fieldErrors.motherPhone ? "border-red-500" : "border-white/20"}`}
                    placeholder="+591 70000000"
                  />
                  {fieldErrors.motherPhone && <p className="mt-1 text-xs font-bold text-red-400">{fieldErrors.motherPhone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Correo de los padres *</label>
                  <input
                    value={form.parentsEmail}
                    onChange={(e) => {
                      setForm({ ...form, parentsEmail: e.target.value });
                      if (fieldErrors.parentsEmail) setFieldErrors({ ...fieldErrors, parentsEmail: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors ${fieldErrors.parentsEmail ? "border-red-500" : "border-white/20"}`}
                    placeholder="familia@email.com"
                  />
                  {fieldErrors.parentsEmail && <p className="mt-1 text-xs font-bold text-red-400">{fieldErrors.parentsEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-3">¿Tiene hermanos en Hughes?</label>
                  <div className="flex gap-6 text-base font-bold text-white">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasSiblingsHS"
                        checked={form.hasSiblingsHS === "yes"}
                        onChange={() => setForm({ ...form, hasSiblingsHS: "yes" })}
                        className="accent-hs-yellow w-5 h-5"
                      />
                      Sí
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasSiblingsHS"
                        checked={form.hasSiblingsHS === "no"}
                        onChange={() => setForm({ ...form, hasSiblingsHS: "no", siblingNames: "" })}
                        className="accent-hs-yellow w-5 h-5"
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Nombre(s) del hermano(s)</label>
                  <input
                    value={form.siblingNames}
                    onChange={(e) => {
                      setForm({ ...form, siblingNames: e.target.value });
                      if (fieldErrors.siblingNames) setFieldErrors({ ...fieldErrors, siblingNames: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors disabled:opacity-50 ${fieldErrors.siblingNames ? "border-red-500" : "border-white/20"}`}
                    placeholder="Si aplica"
                    disabled={form.hasSiblingsHS !== "yes"}
                  />
                  {fieldErrors.siblingNames && <p className="mt-1 text-xs font-bold text-red-400">{fieldErrors.siblingNames}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">¿Qué referencias tiene de Hughes?</label>
                  <textarea
                    value={form.references}
                    onChange={(e) => setForm({ ...form, references: e.target.value })}
                    className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors min-h-[100px] resize-none"
                    placeholder="Amigos, familiares, redes sociales..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-4">
                    ¿Qué tan importante considera la formación artística para su hijo(a)?
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-base font-bold text-white">
                    {[
                      { v: "no", t: "Nada importante" },
                      { v: "poco", t: "Poco importante" },
                      { v: "importante", t: "Importante" },
                      { v: "muy", t: "Muy importante" },
                    ].map(opt => (
                      <label key={opt.v} className="inline-flex items-center gap-2 cursor-pointer bg-white/5 border-2 border-white/10 p-3 rounded-xl hover:border-hs-yellow transition-colors">
                        <input
                          type="radio"
                          name="artImportance"
                          checked={form.artImportance === (opt.v as ArtImportance)}
                          onChange={() => setForm({ ...form, artImportance: opt.v as ArtImportance })}
                          className="accent-hs-yellow w-5 h-5"
                        />
                        {opt.t}
                      </label>
                    ))}
                  </div>
                </div>

                {showChangeReason && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Motivo del cambio de colegio</label>
                    <textarea
                      value={form.changeReason}
                      onChange={(e) => setForm({ ...form, changeReason: e.target.value })}
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-hs-yellow focus:outline-none transition-colors min-h-[100px] resize-none"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-hs-yellow mb-2">Fecha de entrevista preferida (Opcional)</label>
                  <input
                    type="date"
                    value={form.preferredInterview}
                    onChange={(e) => setForm({ ...form, preferredInterview: e.target.value })}
                    className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white focus:border-hs-yellow focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              {error && <div className="mt-8 rounded-xl bg-red-500/20 border-2 border-red-500 p-4 text-white font-bold">{error}</div>}
              {ok && <div className="mt-8 rounded-xl bg-green-500/20 border-2 border-green-500 p-4 text-white font-bold">¡Gracias! Hemos recibido tu solicitud de manera exitosa. Nos pondremos en contacto pronto.</div>}

              <div className="mt-10 flex justify-end">
                <button
                  disabled={submitting}
                  className="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-hs-yellow px-10 py-4 text-lg font-bold text-hs-bluenavy transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
                >
                  {submitting ? "Enviando..." : "Enviar solicitud"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
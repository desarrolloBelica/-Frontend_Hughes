// app/help-center/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParentAuth } from "@/hooks/useParentAuth";

import ParentsNavbar from "@/components/parents/ParentsNavbar"; // ← navbar superior original
// Si ya tienes un componente para este subnav, puedes reemplazar PortalSubnav por el tuyo.
import {
  Headphones,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ExternalLink,
  Search,
  Building2,
  UsersRound,
} from "lucide-react";

/* ───────────────────── Brand helpers ───────────────────── */
const BRAND = { blue: "var(--hs-blue)", yellow: "var(--hs-yellow)" };
const EVENT_ROOM_URL = "http://hughesschools.org/eventos";

/* ───────────────────── Sub‑navbar del portal ───────────────────── */
function PortalSubnav() {
  const pathname = usePathname();
  const items = [
    { href: "/help-center", label: "Inicio" },
    { href: "/help-center/timetables", label: "Horarios" },
    { href: "/help-center/forms", label: "Formularios" },
  ];

  return (
    <div className="w-full border-b bg-white" style={{ borderColor: "#ececf4" }}>
      <nav className="mx-auto max-w-7xl px-6">
        <ul className="flex flex-wrap gap-2 py-3">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                  style={{
                    background: active ? BRAND.yellow : "#fff",
                    border: `1px solid ${active ? BRAND.yellow : "#e6e6f0"}`,
                    color: BRAND.blue,
                  }}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ───────────────────── Types & Data (cards de ayuda) ───────────────────── */
type ContactCard = {
  id: string;
  area: string; // filtro
  title: string; // encabezado dentro de la card
  bullets: string[];
  person: string;
  email?: string;
  whatsapp?: string; // solo número (o texto si te sirve)
  office?: string; // tel oficina
  roomUrl?: string;
  hours?: string;
};

const CARDS: ContactCard[] = [
  {
    id: "adm-coord",
    area: "Administración",
    title: "Coordinación Administrativa",
    bullets: [
      "Horarios de clases académicos y artísticos",
      "Consultas sobre el programa artístico",
      "Registro de estudiantes",
      "Encargado de festivales de música",
    ],
    person: "Mr. Álvaro Lanza",
    email: "alvaro.lanza@hughesschools.org",
    whatsapp: "77640675",
    office: "4716262 – 4717354",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 08:00–12:00 • Lun/Mié/Vie 14:00–17:00",
  },
  {
    id: "wellbeing-1",
    area: "Bienestar",
    title: "Coordinación de Bienestar Estudiantil",
    bullets: [
      "Conflictos de interacción social",
      "Conflictos personales del estudiante o padres",
      "Solicitud de entrevista con Docentes",
      "Solicitud de entrevista con Coordinación Académica o Artística",
      "Admisión de Estudiantes nuevos",
    ],
    person: "Mrs. Pilar Doering",
    email: "client.service@hughesschools.org",
    whatsapp: "70272837",
    office: "4716262 – 4717354",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 08:00–17:00",
  },
  {
    id: "wellbeing-folk",
    area: "Bienestar",
    title:
      "Coordinación de Bienestar Estudiantil – Dirección Musical Folclórica",
    bullets: [
      "Conflictos sociales y personales",
      "Solicitud de entrevista (académica / artística / docentes / dirección)",
      "Admisión de estudiantes nuevos",
      "Coordinación Música Folclórica y Grupo Musical Kusi Rima",
      "Viajes Grupo Musical y Elenco Folclórico",
      "Problemas del área artística o académica",
    ],
    person: "Mr. Bernabé Guzmán",
    email: "bernabe.guzman@hughesschools.org",
    whatsapp: "75939884",
    office: "4716262 – 4717354",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 08:00–17:00",
  },
  {
    id: "assistant",
    area: "Administración",
    title: "Asistente administrativo",
    bullets: [
      "Asistencia a clases (consultas)",
      "Recepción de licencias",
      "Información general",
      "Recepción de documentos",
      "Uniformes, transporte",
      "Bloqueos y clases virtuales",
      "Manejo plataforma Zoom",
    ],
    person: "Mr. André Bolaños",
    office: "4716262 – 4717354",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 08:00–17:00",
  },
  {
    id: "dde",
    area: "Educación",
    title: "Coordinación Departamento de Educación",
    bullets: [
      "Documentación DDE",
      "Documentación Bachilleres",
      "Emisión de libretas y certificados de notas",
      "Revisión de documentación de registro",
      "Comunicación con Defensoría de la Niñez",
    ],
    person: "Mr. Ricardo Salvatierra",
    email: "systems@hughesschools.org",
    whatsapp: "60343135",
    roomUrl: EVENT_ROOM_URL,
    hours: "Mar 08:00–13:00 y 14:00–17:00",
  },
  {
    id: "acad-hugo",
    area: "Académico",
    title: "Coordinación Académica",
    bullets: [
      "Programas académicos",
      "Programas analíticos",
      "Ferias de Matemáticas, Ciencias y Tecnología",
      "Horarios Académicos",
      "Rendimiento académico",
    ],
    person: "Mr. Hugo Pozo",
    email: "hugo.pozo@hughesschools.org",
    whatsapp: "77954495",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 14:00–16:30",
  },
  {
    id: "acad-carolina",
    area: "Académico",
    title: "Coordinación Académica",
    bullets: [
      "Programas académicos",
      "Programas analíticos",
      "ESL (Inglés como segunda lengua)",
      "Rendimiento académico del idioma Inglés",
      "Horarios Académicos",
      "Rendimiento Académico",
    ],
    person: "Mrs. Carolina Cortés",
    email: "carolina.cortes@hughesschools.org",
    whatsapp: "65383231",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 14:00–16:30",
  },
  {
    id: "dance-primary",
    area: "Artes",
    title: "Coordinación de danza (nivel primaria)",
    bullets: [
      "Festivales de danza de primaria",
      "Vestuario de danza (general)",
      "Ensayos para festivales",
    ],
    person: "Mrs. Celia Luna",
    email: "celia.luna@hughesschools.org",
    whatsapp: "79767611",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 08:00–13:00 y 14:00–17:00",
  },
  {
    id: "accounting",
    area: "Finanzas",
    title: "Contabilidad",
    bullets: [
      "Consultas del área económica de Hughes Schools",
      "Pagos Banco Mercantil Santa Cruz",
      "Contratos de escolaridad",
      "Contratos personal Hughes Schools",
    ],
    person: "Mr. Luis Sejas",
    email: "luis.sejas@hughesschools.org",
    whatsapp: "75474744",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun 08:00–12:00 y 15:30–17:00 • Mar–Vie 15:30–17:00",
  },
  {
    id: "cashier",
    area: "Finanzas",
    title: "Caja",
    bullets: [
      "Pagos área económica",
      "Pagos Banco Mercantil Santa Cruz",
      "Consultas sobre otros pagos",
    ],
    person: "Mr. Gary García",
    email: "cashier@hughesschools.org",
    whatsapp: "64866129",
    roomUrl: EVENT_ROOM_URL,
    hours: "Lun a Vie 08:00–12:00 y 13:00–17:00",
  },
];

/* ───────────────────── Small UI bits ───────────────────── */
function YellowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
      style={{ color: BRAND.blue, background: "rgba(255,187,0,0.2)" }}
    >
      {children}
    </span>
  );
}
function IconAvatar() {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm"
      style={{ borderColor: "#ececf4", color: BRAND.blue }}
      aria-hidden
    >
      <Headphones size={20} />
    </div>
  );
}

/* ───────────────────── Page ───────────────────── */
export default function HelpCenterPage() {
  // 🔐 Proteger la ruta - redirige al login si no está autenticado
  const { user, loading: authLoading } = useParentAuth();

  // Filtros/buscador
  const [query, setQuery] = React.useState("");
  const [area, setArea] = React.useState<string>("All");
  const [showAll, setShowAll] = React.useState(false);

  const areas = React.useMemo(
    () => ["All", ...Array.from(new Set(CARDS.map((c) => c.area)))],
    []
  );

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = CARDS.filter((c) => (area === "All" ? true : c.area === area));
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.person.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.bullets.some((b) => b.toLowerCase().includes(q))
      );
    }
    return list;
  }, [area, query]);

  const toRender = showAll ? filtered : filtered.slice(0, 6);

  // Mostrar loader mientras se verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f9f9fb" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: BRAND.blue }} />
          <p className="text-hughes-blue">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, el hook ya redirigió al login
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "#f9f9fb" }}>
      {/* ✅ Navbar superior original del portal de padres */}
      <ParentsNavbar />

      {/* ✅ Segundo navbar (Inicio / Horarios / Formularios) */}
      <PortalSubnav />

      {/* HERO */}
      <section className="relative w-full py-12 md:py-16 text-center overflow-hidden bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <UsersRound size={36} style={{ color: BRAND.blue }} />
            <Building2 size={36} style={{ color: BRAND.yellow }} />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-hughes-blue">
            ¿Cómo podemos ayudarle?
          </h1>
          <p className="mt-3 text-sm md:text-base text-hughes-blue/80">
            Encuentre a la persona correcta según el tema, o ingrese a la sala de
            eventos para ser atendido.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={EVENT_ROOM_URL}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm hover:shadow transition"
              style={{
                background: BRAND.yellow,
                borderColor: BRAND.yellow,
                color: BRAND.blue,
              }}
            >
              Ingresar a sala de eventos
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTROLES */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {areas.map((a) => {
                const active = a === area;
                return (
                  <button
                    key={a}
                    onClick={() => {
                      setArea(a);
                      setShowAll(false);
                    }}
                    className="rounded-full border px-3 py-1.5 text-sm"
                    style={{
                      background: active ? BRAND.yellow : "#fff",
                      borderColor: active ? BRAND.yellow : "#e6e6f0",
                      color: BRAND.blue,
                    }}
                  >
                    {a}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9aa1b2" }}
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowAll(false);
                }}
                placeholder="Buscar por área, nombre, correo o tema…"
                className="w-full rounded-full border px-9 py-2 text-sm bg-white"
                style={{ borderColor: "#e6e6f0", color: BRAND.blue }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6">
          {toRender.length === 0 ? (
            <div
              className="rounded-xl border p-6 text-center text-hughes-blue"
              style={{ borderColor: "#ececf4", background: "#fff" }}
            >
              No se encontraron resultados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {toRender.map((c) => (
                <article
                  key={c.id}
                  className="rounded-2xl border bg-white p-5 shadow-[0_20px_70px_-35px_rgba(17,6,49,0.35)] flex flex-col gap-4"
                  style={{ borderColor: "#ececf4" }}
                >
                  <div className="flex items-start gap-3">
                    <IconAvatar />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-hughes-blue truncate">
                          {c.title}
                        </h3>
                        <YellowBadge>{c.area}</YellowBadge>
                      </div>
                      <p className="text-sm text-hughes-blue/70">{c.person}</p>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-[14px] text-hughes-blue/90">
                    {c.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span
                          className="mt-2 inline-block h-1.5 w-1.5 rounded-full"
                          style={{ background: BRAND.yellow }}
                        />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-1 grid grid-cols-1 gap-1.5 text-[13px]">
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="inline-flex items-center gap-2 text-hughes-blue hover:underline"
                      >
                        <Mail size={14} />
                        {c.email}
                      </a>
                    )}
                    {c.whatsapp && (
                      <a
                        href={`https://wa.me/591${c.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-hughes-blue hover:underline"
                      >
                        <MessageSquare size={14} />
                        Whatsapp: {c.whatsapp}
                      </a>
                    )}
                    {c.office && (
                      <div className="inline-flex items-center gap-2 text-hughes-blue/80">
                        <Phone size={14} />
                        Oficina: {c.office}
                      </div>
                    )}
                    {c.hours && (
                      <div className="inline-flex items-center gap-2 text-hughes-blue/80">
                        <Clock size={14} />
                        {c.hours}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      href={c.roomUrl || EVENT_ROOM_URL}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold hover:shadow transition"
                      style={{
                        background: BRAND.yellow,
                        borderColor: BRAND.yellow,
                        color: BRAND.blue,
                      }}
                    >
                      Ingresar a sala
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {filtered.length > 6 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAll((s) => !s)}
                className="rounded-full border px-4 py-2 text-sm font-semibold"
                style={{
                  background: showAll ? "#fff" : BRAND.yellow,
                  borderColor: showAll ? "#e6e6f0" : BRAND.yellow,
                  color: BRAND.blue,
                }}
              >
                {showAll ? "Ver menos" : "Ver todos"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// app/contact/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
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
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/* ───────────────────── Types ───────────────────── */
type ContactCard = {
  id: string;
  area: string;
  title: string;
  bullets: string[];
  person: string;
  email?: string;
  whatsapp?: string;
  office?: string;
  roomUrl?: string;
  hours?: string;
};

/* ───────────────────── API Response Types ───────────────────── */
interface StrapiHelpCenterCard {
  id: number;
  documentId: string;
  area: string;
  tittle: string; // Note: typo in backend schema
  bullets: string[];
  personName: string;
  email?: string;
  whatsapp?: string;
  officePhone?: string;
  roomUrl?: string;
  hours?: string;
  order?: number;
}

interface StrapiResponse {
  data: StrapiHelpCenterCard[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/* ───────────────────── Data Fetching ───────────────────── */
async function fetchHelpCenterCards(): Promise<ContactCard[]> {
  const res = await fetch(
    `${API_URL}/api/help-center-cards?sort=order:asc&pagination[pageSize]=100&filters[publishedAt][$notNull]=true`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Error al obtener los datos del centro de ayuda");
  }

  const json: StrapiResponse = await res.json();

  return json.data.map((item) => ({
    id: item.documentId || String(item.id),
    area: item.area || "General",
    title: item.tittle || "", // Map from backend typo
    bullets: Array.isArray(item.bullets) ? item.bullets : [],
    person: item.personName || "",
    email: item.email || undefined,
    whatsapp: item.whatsapp || undefined,
    office: item.officePhone || undefined,
    roomUrl: item.roomUrl || EVENT_ROOM_URL,
    hours: item.hours || undefined,
  }));
}

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

export default function ContactPage() {
  const [cards, setCards] = React.useState<ContactCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [area, setArea] = React.useState<string>("All");
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    fetchHelpCenterCards()
      .then((data) => {
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching help center cards:", err);
        setError("Error al cargar los datos. Por favor, intente de nuevo.");
        setLoading(false);
      });
  }, []);

  const areas = React.useMemo(
    () => ["All", ...Array.from(new Set(cards.map((c) => c.area)))],
    [cards]
  );

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = cards.filter((c) => (area === "All" ? true : c.area === area));
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
  }, [area, query, cards]);

  const toRender = showAll ? filtered : filtered.slice(0, 6);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f9f9fb" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: BRAND.blue }} />
          <p className="text-hughes-blue">Cargando información...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f9f9fb" }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border px-4 py-2 text-sm font-semibold"
            style={{ background: BRAND.yellow, borderColor: BRAND.yellow, color: BRAND.blue }}
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#f9f9fb" }}>
      {/* HERO */}
      <section className="relative w-full py-12 md:py-16 text-center overflow-hidden bg-white">
        <div className="mx-auto max-w-5xl px-6">
          {/* Icono grande alineado a la línea del proyecto */}
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
            {/* Botón sala de eventos */}
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
            {/* Filtros por área */}
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

            {/* Buscador */}
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
                  {/* Header */}
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

                  {/* Bullets */}
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

                  {/* Contacto */}
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

                  {/* Actions */}
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

          {/* Ver todos */}
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
    </main>
  );
}

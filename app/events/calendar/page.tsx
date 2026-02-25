"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  format,
  parseISO,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────── Tipos & helpers ─────────── */

type EventV5 = {
  id: number | string;
  title?: string;
  start?: string;
  end?: string | null;
  location?: string | null;
  ticketLink?: string | null;
  description?: string | null;
  tipo?: string | null;
};

type EventV4 = {
  id: number | string;
  attributes?: {
    title?: string;
    start?: string;
    end?: string | null;
    location?: string | null;
    ticketLink?: string | null;
    description?: string | null;
    tipo?: string | null;
  };
};

type EventRow = EventV4 | EventV5;

export type EventItem = {
  id: number | string;
  title: string;
  start: string;
  end: string | null;
  location: string | null;
  ticketLink: string | null;
  description: string | null;
  tipo: string | null;
};

function getAttr<T>(
  row: EventRow,
  key: keyof NonNullable<EventV4["attributes"]>
): T | undefined {
  if ((row as Record<string, unknown>)[key] !== undefined) {
    return (row as Record<string, unknown>)[key] as T; // v5
  }
  const attrs = (row as EventV4).attributes as
    | Record<string, unknown>
    | undefined; // v4
  if (attrs && attrs[key] !== undefined) {
    return attrs[key] as T;
  }
  return undefined;
}

// SE MANTIENEN LOS COLORES ORIGINALES POR CATEGORÍA
const TIPO_COLORS: Record<
  string,
  { bg: string; text: string; border: string; soft: string }
> = {
  Academic: { bg: "#223a5e", text: "#ffffff", border: "#1a2d47", soft: "rgba(34,58,94,0.12)" },
  Administrative: { bg: "#ffd966", text: "#0b1229", border: "#f2c84f", soft: "rgba(255,217,102,0.12)" },
  Holiday: { bg: "#ff4b4b", text: "#ffffff", border: "#e14444", soft: "rgba(255,75,75,0.10)" },
  Dance: { bg: "#22c1f1", text: "#0b1229", border: "#16a7d3", soft: "rgba(34,193,241,0.12)" },
  Music: { bg: "#f2f542", text: "#0b1229", border: "#dbde34", soft: "rgba(242,245,66,0.12)" },
  Theater: { bg: "#ff8c00", text: "#0b1229", border: "#e67e00", soft: "rgba(255,140,0,0.12)" },
  Trimester: { bg: "#5dd39e", text: "#0b1229", border: "#49bb8a", soft: "rgba(93,211,158,0.12)" },
  Other: { bg: "#cfcfd9", text: "#0b1229", border: "#bdbdc9", soft: "rgba(207,207,217,0.12)" },
};

function colorFor(tipo?: string | null) {
  if (!tipo) return TIPO_COLORS.Other;
  return TIPO_COLORS[tipo] || TIPO_COLORS.Other;
}

function formatISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toPlainDescription(val: unknown): string | null {
  if (val == null) return null;
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    const flat = val.map((v) => toPlainDescription(v)).filter(Boolean).join(" ");
    return flat || null;
  }
  if (typeof val === "object") {
    const maybeText = (val as { text?: unknown }).text;
    if (typeof maybeText === "string") return maybeText;
    const children = (val as { children?: unknown }).children;
    if (Array.isArray(children)) {
      const flat = children.map((v) => toPlainDescription(v)).filter(Boolean).join(" ");
      return flat || null;
    }
  }
  return String(val);
}

function includesDay(ev: EventItem, day: Date) {
  const s = parseISO(ev.start);
  const e = parseISO(ev.end ?? ev.start);
  const d0 = new Date(day);
  d0.setHours(0, 0, 0, 0);
  const s0 = new Date(s);
  s0.setHours(0, 0, 0, 0);
  const e0 = new Date(e);
  e0.setHours(23, 59, 59, 999);
  return !(d0 < s0 || d0 > e0);
}

/* ─────────── Fetch a Strapi ─────────── */

async function fetchEventsByRange(
  startDate: Date,
  endDate: Date
): Promise<EventItem[]> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

  const startISO = formatISO(startDate);
  const endISO = formatISO(endDate);

  const params = new URLSearchParams({
    "filters[$and][0][start][$lte]": endISO,
    "filters[$and][1][$or][0][end][$gte]": startISO,
    "filters[$and][1][$or][1][end][$null]": "true",
    sort: "start:asc",
    "pagination[pageSize]": "200",
    "fields[0]": "title",
    "fields[1]": "start",
    "fields[2]": "end",
    "fields[3]": "location",
    "fields[4]": "tipo",
    "fields[5]": "ticketLink",
    "fields[6]": "description",
  });

  const res = await fetch(`${base}/api/events?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = (await res.json()) as { data?: EventRow[] } | EventRow[];
  const rows: EventRow[] = Array.isArray(json) ? json : json?.data ?? [];

  const items: EventItem[] = rows.map((row) => {
    const title =
      (getAttr<string>(row, "title") ?? (row as EventV5).title ?? "").toString();
    const start = getAttr<string>(row, "start") ?? (row as EventV5).start ?? "";
    let end =
      getAttr<string | null>(row, "end") ?? (row as EventV5).end ?? null;
    end = end ?? start;

    const location =
      getAttr<string | null>(row, "location") ??
      (row as EventV5).location ??
      null;
    const ticketLink =
      getAttr<string | null>(row, "ticketLink") ??
      (row as EventV5).ticketLink ??
      null;
    const descriptionRaw =
      getAttr<unknown>(row, "description") ??
      (row as EventV5).description ??
      null;
    const description = toPlainDescription(descriptionRaw);
    const tipo =
      getAttr<string | null>(row, "tipo") ?? (row as EventV5).tipo ?? null;

    return { id: row.id, title, start, end, location, ticketLink, description, tipo };

  });

  return items;
}

/* ─────────── UI helpers ─────────── */

function HSBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs md:text-sm font-bold bg-hs-yellow text-hs-bluenavy shadow-sm">
      {children}
    </div>
  );
}

function HSNavButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border-2 border-hs-bluenavy px-4 py-2 text-sm font-bold text-hs-bluenavy hover:bg-hs-bluenavy hover:text-hs-yellow transition-colors"
    >
      {children}
    </button>
  );
}

function FilterChip({
  label,
  active,
  onToggle,
  color,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  color: ReturnType<typeof colorFor>;
}) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-full border-2 px-4 py-1.5 text-xs md:text-sm font-bold transition-all ${
        active ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        borderColor: active ? color.border : "var(--hs-bluenavy)",
        background: active ? color.bg : "transparent",
        color: active ? color.text : "var(--hs-bluenavy)",
      }}
    >
      {label}
    </button>
  );
}

/* ─────────── List View ─────────── */

function ListView({ events }: { events: EventItem[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-hs-bluenavy/20 bg-white p-12 text-center text-lg font-bold text-hs-bluenavy shadow-xl">
        No events for this month matching your filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((ev) => {
        const c = colorFor(ev.tipo);
        const oneDay = ev.start === (ev.end ?? ev.start);
        const dayLabel = oneDay
          ? format(parseISO(ev.start), "MMM d, yyyy", { locale: enUS })
          : `${format(parseISO(ev.start), "MMM d", { locale: enUS })}–${format(
              parseISO(ev.end ?? ev.start),
              "MMM d, yyyy",
              { locale: enUS }
            )}`;

        const isLocationLink = ev.location?.startsWith("http://") || ev.location?.startsWith("https://");
        const hasTicketLink = !!ev.ticketLink;

        return (
          <button
            key={ev.id}
            onClick={() => window.dispatchEvent(new CustomEvent("hs-calendar-open", { detail: ev }))}
            className="group relative w-full text-left rounded-3xl border-2 border-hs-bluenavy/10 bg-white p-5 md:p-6 text-hs-bluenavy shadow-md hover:shadow-xl hover:border-hs-bluenavy transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hs-yellow"
          >
            <span
              className="absolute left-0 top-0 h-full w-2.5 rounded-l-3xl"
              style={{ background: c.bg }}
            />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pl-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-3 md:items-center">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {ev.title}
                  </h3>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold shadow-sm"
                    style={{
                      background: c.bg,
                      color: c.text,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {ev.tipo ?? "Other"}
                  </span>
                </div>
                <div className="mt-2 text-base font-semibold opacity-80">
                  {dayLabel}
                </div>
                <div className="mt-2 text-sm font-medium opacity-80 flex flex-wrap gap-4 items-center">
                  {ev.location && (
                    isLocationLink ? (
                      <a
                        href={ev.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-hs-yellow transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Location
                      </a>
                    ) : (
                      <span>📍 {ev.location}</span>
                    )
                  )}
                  {hasTicketLink && (
                    <a
                      href={ev.ticketLink ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-hs-yellow transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Tickets
                    </a>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────── Month View ─────────── */

function MonthView({
  monthDate,
  events,
  onSelect,
}: {
  monthDate: Date;
  events: EventItem[];
  onSelect: (ev: EventItem) => void;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const MAX_VISIBLE = 3;

  const toggleDay = (key: string) =>
    setExpandedDays((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="rounded-3xl border-2 border-hs-bluenavy/20 bg-white p-3 md:p-6 shadow-xl">
      <div className="grid grid-cols-7 gap-1 px-1 pb-4 text-sm font-bold text-hs-bluenavy uppercase tracking-wider">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthStart);
          const dayKey = format(day, "yyyy-MM-dd");
          const allEvents = events.filter((ev) => includesDay(ev, day));
          const expanded = !!expandedDays[dayKey];
          const visibleEvents = expanded
            ? allEvents
            : allEvents.slice(0, MAX_VISIBLE);
          const remaining = Math.max(0, allEvents.length - visibleEvents.length);

          const cellSoft =
            allEvents.length > 0
              ? colorFor(allEvents[0].tipo).soft
              : inMonth
              ? "white"
              : "#f8f9fc"; 

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] md:min-h-[140px] rounded-2xl border-2 p-2 overflow-visible transition-colors ${
                inMonth ? "border-hs-bluenavy/10 hover:border-hs-bluenavy/30" : "border-transparent opacity-60"
              }`}
              style={{
                background: cellSoft,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-bold ${inMonth ? 'text-hs-bluenavy' : 'text-hs-bluenavy/50'}`}>
                  {format(day, "d")}
                </div>
              </div>

              <div className="space-y-2">
                {visibleEvents.map((ev) => {
                  const c = colorFor(ev.tipo);
                  const oneDay = ev.start === (ev.end ?? ev.start);
                  const dateText = oneDay
                    ? format(parseISO(ev.start), "MMM d", { locale: enUS })
                    : `${format(parseISO(ev.start), "MMM d", { locale: enUS })}–${format(
                        parseISO(ev.end ?? ev.start),
                        "MMM d",
                        { locale: enUS }
                      )}`;

                  return (
                    <div key={`${ev.id}-${ev.start}`} className="relative group">
                      <div
                        className="w-full rounded-lg px-2 py-1.5 text-xs md:text-sm font-bold leading-tight break-words whitespace-normal cursor-pointer shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-hs-yellow"
                        style={{
                          background: c.bg,
                          color: c.text,
                          border: `1px solid ${c.border}`,
                        }}
                        onClick={() => onSelect(ev)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelect(ev);
                          }
                        }}
                      >
                        <div className="line-clamp-2">{ev.title}</div>
                      </div>
                    </div>
                  );
                })}

                {remaining > 0 && !expanded && (
                  <button
                    onClick={() => toggleDay(dayKey)}
                    className="w-full rounded-lg border-2 border-hs-bluenavy/20 bg-white/60 px-2 py-1 text-xs font-bold text-hs-bluenavy hover:bg-hs-yellow hover:border-hs-yellow hover:text-hs-bluenavy transition-colors"
                  >
                    +{remaining} more
                  </button>
                )}
                {expanded && allEvents.length > MAX_VISIBLE && (
                  <button
                    onClick={() => toggleDay(dayKey)}
                    className="w-full rounded-lg border-2 border-hs-bluenavy/20 bg-white/60 px-2 py-1 text-xs font-bold text-hs-bluenavy hover:bg-hs-yellow hover:border-hs-yellow hover:text-hs-bluenavy transition-colors"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Página ─────────── */

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "list">("month");
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const allTypeKeys = useMemo(() => Object.keys(TIPO_COLORS), []);
  const [activeTypes, setActiveTypes] = useState<string[]>(allTypeKeys);
  const toggleType = (t: string) =>
    setActiveTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setErr(null);
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const list = await fetchEventsByRange(start, end);
        if (!cancelled) setEvents(list);
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [currentMonth]);

  const monthEvents = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const filtered = events
      .filter((ev) => activeTypes.includes(ev.tipo ?? "Other"))
      .filter((ev) => {
        const s = parseISO(ev.start);
        const e = parseISO(ev.end ?? ev.start);
        return !(e < start || s > end);
      });
    return filtered.sort(
      (a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime()
    );
  }, [events, currentMonth, activeTypes]);

  const title = format(currentMonth, "MMMM yyyy", { locale: enUS });

  const openEvent = (ev: EventItem) => setSelectedEvent(ev);
  const closeModal = () => setSelectedEvent(null);
  
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<EventItem>).detail;
      if (detail) setSelectedEvent(detail);
    };
    window.addEventListener("hs-calendar-open", handler as EventListener);
    return () => window.removeEventListener("hs-calendar-open", handler as EventListener);
  }, []);

  return (
    <main className="min-h-screen bg-hs-yellow text-hs-bluenavy">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          
          <HSBadge>Calendar · Schedule</HSBadge>

          {/* Encabezado sin los controles de mes */}
          <div className="mt-6 max-w-2xl mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Hughes Schools Yearly Calendar
            </h1>
            <p className="mt-4 text-lg font-medium opacity-90 leading-relaxed">
              Browse month by month. Filter by view and quickly scan the activities of our community.
            </p>
          </div>

          {/* Filtros por tipo */}
          <div className="mb-10 bg-white/20 p-6 rounded-3xl border-2 border-hs-bluenavy/20">
            <div className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">Filter by category:</div>
            <div className="flex flex-wrap gap-3">
              {allTypeKeys.map((t) => {
                const c = colorFor(t);
                const active = activeTypes.includes(t);
                return (
                  <FilterChip
                    key={t}
                    label={t}
                    active={active}
                    onToggle={() => toggleType(t)}
                    color={c}
                  />
                );
              })}
            </div>
          </div>

          {/* CONTROLES UNIFICADOS (TABS + MES + CONTADOR) */}
          <div className="mt-6">
            <Tabs
              value={view === "month" ? "Month" : "List"}
              onValueChange={(v) => setView(v === "Month" ? "month" : "list")}
              className="w-full"
            >
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                {/* TABS LIST/MONTH */}
                <TabsList className="flex w-full lg:max-w-xs rounded-full bg-hs-bluenavy/10 p-1 border-2 border-hs-bluenavy h-14">
                  <TabsTrigger
                    value="List"
                    className="flex-1 rounded-full text-base font-bold data-[state=active]:bg-hs-bluenavy data-[state=active]:text-hs-yellow transition-all"
                  >
                    List
                  </TabsTrigger>
                  <TabsTrigger
                    value="Month"
                    className="flex-1 rounded-full text-base font-bold data-[state=active]:bg-hs-bluenavy data-[state=active]:text-hs-yellow transition-all"
                  >
                    Month
                  </TabsTrigger>
                </TabsList>

                {/* CONTROLES DE MES Y CONTADOR (Movidos aquí abajo) */}
                <div className="flex items-center justify-center gap-4 bg-white/20 p-2.5 rounded-full border-2 border-hs-bluenavy shadow-sm">
                  <HSNavButton onClick={() => setCurrentMonth((m) => subMonths(m, 1))}>
                    <ChevronLeft className="h-5 w-5" />
                  </HSNavButton>
                  
                  <div className="w-48 flex flex-col items-center justify-center">
                    <span className="text-xl md:text-2xl font-extrabold uppercase tracking-wide leading-tight">
                      {title}
                    </span>
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest mt-0.5">
                      {monthEvents.length} {monthEvents.length === 1 ? "Event" : "Events"}
                    </span>
                  </div>

                  <HSNavButton onClick={() => setCurrentMonth((m) => addMonths(m, 1))}>
                    <ChevronRight className="h-5 w-5" />
                  </HSNavButton>
                </div>
              </div>

              {/* CONTENIDO DEL CALENDARIO */}
              <div>
                {loading ? (
                  <div className="rounded-3xl border-2 border-hs-bluenavy/20 bg-white p-16 text-center text-xl font-bold text-hs-bluenavy shadow-xl animate-pulse">
                    Loading events…
                  </div>
                ) : err ? (
                  <div className="rounded-3xl border-2 border-red-500 bg-red-500/10 p-12 text-center text-xl font-bold text-red-900 shadow-xl">
                    Error loading events: {err}
                  </div>
                ) : (
                  <>
                    <TabsContent value="List" className="mt-0 focus:outline-none">
                      <ListView events={monthEvents} />
                    </TabsContent>
                    <TabsContent value="Month" className="mt-0 focus:outline-none">
                      <MonthView monthDate={currentMonth} events={monthEvents} onSelect={openEvent} />
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </div>
        </div>

        {/* MODAL */}
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={closeModal} />
        )}
      </section>
    </main>
  );
}

/* ─────────── Modal ─────────── */

function EventModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const c = colorFor(event.tipo);
  const oneDay = event.start === (event.end ?? event.start);
  const dateText = oneDay
    ? format(parseISO(event.start), "PPP", { locale: enUS })
    : `${format(parseISO(event.start), "PPP", { locale: enUS })} – ${format(
        parseISO(event.end ?? event.start),
        "PPP",
        { locale: enUS }
      )}`;

  const isLocationLink = event.location?.startsWith("http://") || event.location?.startsWith("https://");
  const hasTicketLink = !!event.ticketLink;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hs-bluenavy/80 backdrop-blur-sm px-4 p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 md:p-10 shadow-2xl relative border-4 border-hs-yellow animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-hs-bluenavy hover:bg-hs-yellow transition-colors font-bold text-xl"
          aria-label="Close"
        >
          ✕
        </button>
        
        <div 
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-6 shadow-sm" 
          style={{ background: c.bg, color: c.text, border: `2px solid ${c.border}` }}
        >
          {event.tipo ?? "Other"}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-hs-bluenavy leading-tight mb-4">{event.title}</h2>
        <p className="text-lg font-bold text-hs-bluenavy/70 mb-8 border-b-2 border-gray-100 pb-6">{dateText}</p>

        <div className="space-y-6 text-base md:text-lg font-medium text-hs-bluenavy">
          {event.description && (
            <div>
              <span className="font-extrabold block mb-2 text-xl">Description:</span>
              <p className="opacity-90 leading-relaxed text-justify whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {event.location && (
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100">
              <span className="font-extrabold block mb-1">Location:</span>
              {isLocationLink ? (
                <a
                  href={event.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline hover:text-hs-yellow transition-colors break-all"
                >
                  {event.location}
                </a>
              ) : (
                <span className="opacity-90">{event.location}</span>
              )}
            </div>
          )}

          {hasTicketLink && (
            <div className="bg-hs-yellow/20 p-4 rounded-xl border-2 border-hs-yellow/50">
              <span className="font-extrabold block mb-1">Tickets:</span>
              <a
                href={event.ticketLink ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:text-hs-yellow transition-colors break-all"
              >
                Buy tickets here
              </a>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full px-8 py-3 font-bold text-lg text-white bg-hs-bluenavy hover:bg-hs-yellow hover:text-hs-bluenavy transition-colors shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Tag, Download } from 'lucide-react';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { StudentLogoutButton } from '@/components/parents/LogoutButton';

/* =========================
   Config & Helpers
   ========================= */
const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';

type UnknownRecord = Record<string, unknown>;
type AnyObj = Record<string, any>;

/* List response v4/v5 */
function parseList<T = UnknownRecord>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === 'object' && 'data' in json) {
    const data = (json as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

/* attributes (v4) vs plano (v5) */
function body<T = UnknownRecord>(row: UnknownRecord): T {
  const a = row as { attributes?: unknown };
  return (a?.attributes && typeof a.attributes === 'object'
    ? (a.attributes as T)
    : (row as T)) as T;
}

/* 1-1/1-many (v4/v5) → array */
function relArray(rel: unknown): UnknownRecord[] {
  if (!rel) return [];
  if (Array.isArray(rel)) return rel as UnknownRecord[];
  if (rel && typeof rel === 'object' && 'data' in rel) {
    const d = (rel as { data?: unknown }).data;
    if (Array.isArray(d)) return d as UnknownRecord[];
    if (d && typeof d === 'object') return [d as UnknownRecord];
  }
  return [];
}

/* 1-1 (v4/v5) → objeto | null */
function relOne(rel: unknown): UnknownRecord | null {
  if (!rel) return null;
  if (Array.isArray(rel)) return (rel[0] as UnknownRecord) ?? null;
  if (rel && typeof rel === 'object' && 'data' in rel) {
    const d = (rel as { data?: unknown }).data;
    if (Array.isArray(d)) return (d[0] as UnknownRecord) ?? null;
    if (d && typeof d === 'object') return d as UnknownRecord;
    return null;
  }
  return rel as UnknownRecord;
}

function hhmm(s?: string | null) {
  if (!s) return '';
  const [H, M] = s.split(':');
  return `${H}:${M}`;
}
function toMinutes(t?: string | null) {
  if (!t) return 0;
  const [H, M] = t.split(':').map(Number);
  return H * 60 + M;
}
function formatDate(iso = new Date().toISOString()) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/* =========================
   Días
   ========================= */
type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS: Record<Day, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
};

/* =========================
   Sesión de Estudiante
   ========================= */
function getStudentFromStorage():
  | { email?: string; id?: number | string; tokenU?: string }
  | null {
  try {
    const raw = localStorage.getItem('hs_student_session'); // <- guarda esto al loguear
    if (!raw) return null;
    const obj = JSON.parse(raw) as { email?: string; id?: number | string; tokenU?: string };
    return obj ?? null;
  } catch {
    return null;
  }
}

/* =========================
   Fetch JSON (con token)
   ========================= */
async function fetchJSON(url: string, token?: string) {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { cache: 'no-store', headers });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(`HTTP ${res.status}. ${JSON.stringify(j)}`);
  }
  return res.json();
}

/* =========================
   Consultas
   ========================= */
async function fetchStudentMe(): Promise<UnknownRecord | null> {
  // Use API route which handles auth via cookies
  const res = await fetch('/api/student-auth/profile?populate=section,art_group', {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    console.error('fetchStudentMe error:', res.status);
    return null;
  }
  
  const json = await res.json();
  // The backend returns { student: {...} }
  return json?.student ?? null;
}

async function fetchTimetableBySectionId(sectionId: number) {
  const qs =
    `filters[sections][id][$in]=${encodeURIComponent(String(sectionId))}` +
    `&populate[subject][fields][0]=name` +
    `&populate[subject][fields][1]=shortName` +
    `&populate[subject][fields][2]=color` +
    `&populate[teacher][fields][0]=firstName` +
    `&populate[teacher][fields][1]=lastName` +
    `&pagination[pageSize]=200` +
    `&sort[0]=day:asc` +
    `&sort[1]=startTime:asc`;
  const url = `${API}/api/timetable-entries?${qs}`;
  const json = await fetchJSON(url);
  return parseList(json);
}
async function fetchArtTimetableByGroupId(groupId: number) {
  const qs =
    `filters[art_groups][id][$in]=${encodeURIComponent(String(groupId))}` +
    `&populate[subject][fields][0]=name` +
    `&populate[subject][fields][1]=shortName` +
    `&populate[subject][fields][2]=color` +
    `&populate[teacher][fields][0]=firstName` +
    `&populate[teacher][fields][1]=lastName` +
    `&pagination[pageSize]=200` +
    `&sort[0]=day:asc` +
    `&sort[1]=startTime:asc`;
  const url = `${API}/api/art-timetable-entries?${qs}`;
  const json = await fetchJSON(url);
  return parseList(json);
}

/* =========================
   Grid helpers
   ========================= */
type GridCell = { subject?: string; color?: string | null; teacher?: string; extra?: string };
type GridRow = Record<string, GridCell | null>;
type GridByDay = Record<Day, GridRow>;

function buildSlotsAndGrid(entries: UnknownRecord[]) {
  const slotMap = new Map<string, { period: number | null; start: string | null; end: string | null }>();

  for (const it of entries) {
    const a = body(it);
    const per = (a as AnyObj).period ?? null;
    const start = (a as AnyObj).startTime ?? null;
    const end = (a as AnyObj).endTime ?? null;

    const key =
      start && end ? `time:${start}-${end}` : `period:${per ?? 'NA'}:${start ?? 'NA'}-${end ?? 'NA'}`;

    if (!slotMap.has(key)) slotMap.set(key, { period: per, start, end });
  }

  const slotsArr = Array.from(slotMap.values()).sort((x, y) => {
    const xs = x.start ?? '99:99:99';
    const ys = y.start ?? '99:99:99';
    const cmp = xs.localeCompare(ys);
    if (cmp !== 0) return cmp;
    return (x.period ?? 9999) - (y.period ?? 9999);
  });

  const slots = slotsArr.map(s => ({
    period: s.period ?? null,
    startTime: s.start,
    endTime: s.end,
    minutes: Math.max(0, toMinutes(s.end) - toMinutes(s.start)),
  }));

  const grid: GridByDay = { monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} };
  return { slots, grid };
}

function SubjectCell({ cell, height }: { cell: GridCell | null; height: number }) {
  // CASO VACÍO: Ajuste de contraste para que la caja sea visible
  if (!cell) {
    return (
      <div
        className="w-full rounded-lg px-3 py-3 flex flex-col justify-center items-center border subject-cell"
        style={{ 
          height, 
          background: '#f9fafb',   // Un gris un poco más visible (Slate-50)
          borderColor: '#e2e8f0',  // Borde gris visible (Slate-200)
          borderStyle: 'dashed',   // Estilo discontinuo para denotar "vacío"
          color: '#94a3b8',        // Color del guion (Slate-400)
          boxSizing: 'border-box' 
        }} 
      >
        <span className="font-semibold text-sm leading-snug text-center">—</span>
      </div>
    );
  }

  // CASO LLENO (CON MATERIA) - Sin cambios, ya funciona bien
  return (
    <div
      className="w-full rounded-lg px-3 py-3 flex flex-col justify-center border subject-cell overflow-hidden"
      style={{ 
          height, 
          background: cell.color || '#ffeb99', 
          color: '#0b1b2b', 
          borderColor: 'rgba(0,0,0,0.05)',
          boxSizing: 'border-box'
      }}
    >
      <span className="font-semibold text-sm leading-snug truncate">{cell.subject || '—'}</span>
      
      {(cell.teacher || cell.extra) && (
        <span className="text-[11px] opacity-85 mt-1 leading-tight truncate">
          {[cell.teacher, cell.extra].filter(Boolean).join(' • ')}
        </span>
      )}
    </div>
  );
}

/* =========================
   Página Student Home (estética Parents)
   ========================= */
export default function StudentHomePage() {
  // 🔐 Proteger la ruta - redirige al login si no está autenticado
  const { user, loading: authLoading } = useStudentAuth();

  const [activeTab, setActiveTab] = React.useState<'academic' | 'artistic'>('academic');

  const handleExportPDF = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    window.print();
  }, []);

  // Mostrar loader mientras se verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f9fb' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--hs-blue)' }} />
          <p className="text-hughes-blue">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, el hook ya redirigió al login
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen print:bg-white" style={{ background: '#f9f9fb' }}>
      {/* ====== Estilos de impresión (idéntico a Parents) ====== */}
      <style jsx global>{`
        @media print {
          @page { size: A4 landscape; margin: 8mm; }
          html, body { background: #fff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          nav, header, footer, .print-hide, .tabs-toolbar, .tab-pill, [data-hide-on-print="true"] { display: none !important; }
          .print-only { display: block !important; }
          .print-page { zoom: 0.83; transform-origin: top left; }
          .print-table { font-size: 11px !important; width: 100% !important; box-shadow: none !important; background: #fff !important; border: 1px solid #ddd !important; }
          .print-table thead { display: table-header-group; }
          .print-table tfoot { display: table-footer-group; }
          .print-table tr, .print-table td, .print-table th { page-break-inside: avoid !important; break-inside: avoid !important; }
          .cell { height: 68px !important; }
          .subject-cell { padding: 8px 10px !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        @media screen { .print-only { display: none !important; } }
      `}</style>

      <section className="w-full py-10">
        <div className="mx-auto max-w-7xl px-6 print-page">
          {/* ===== Toolbar (igual que Parents) ===== */}
          <div className="flex items-center justify-between gap-3 print-hide">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-hughes-blue">Student Portal</h1>
              <p className="mt-1 text-hughes-blue/70 text-sm md:text-base">
                View your academic and artistic schedules.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold shadow-sm border bg-white hover:bg-slate-50"
                style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)' }}
                aria-label="Export timetable to PDF"
              >
                <Download size={16} />
                Export PDF
              </button>

              <Link
                href="/student/library"
                className="inline-flex items-center rounded-xl border px-3 py-2 text-sm font-semibold bg-white hover:bg-slate-50"
                style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)' }}
              >
                Library
              </Link>

              <Link
                href="/events/calendar"
                className="inline-flex items-center rounded-xl border px-3 py-2 text-sm font-semibold bg-white hover:bg-slate-50"
                style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)' }}
              >
                See Events
              </Link>
              
              {/* Separador */}
              <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />
              
              {/* Logout */}
              <StudentLogoutButton />
            </div>
          </div>

          {/* Tabs estilo Parents */}
          <div className="mt-6 tabs-toolbar print-hide">
            <div className="bg-[#ebeaf3] rounded-full p-1 inline-flex gap-1">
              <button
                onClick={() => setActiveTab('academic')}
                className={`tab-pill rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  activeTab === 'academic'
                    ? 'bg-white text-hughes-blue shadow'
                    : 'text-hughes-blue/80 hover:text-hughes-blue'
                }`}
              >
                Academic
              </button>
              <button
                onClick={() => setActiveTab('artistic')}
                className={`tab-pill rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  activeTab === 'artistic'
                    ? 'bg-white text-hughes-blue shadow'
                    : 'text-hughes-blue/80 hover:text-hughes-blue'
                }`}
              >
                Artistic
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="mt-6">
            {activeTab === 'academic' ? <AcademicGrid /> : <ArtisticGrid />}
          </div>

          {/* Impresión */}
          <div className="hidden print:block">
            {activeTab === 'academic' ? <AcademicGrid printMode /> : <ArtisticGrid printMode />}
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   Grilla Académica
   ========================= */
function AcademicGrid({ printMode = false }: { printMode?: boolean }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [studentName, setStudentName] = React.useState('');
  const [sectionName, setSectionName] = React.useState('');

  const [slots, setSlots] = React.useState<
    Array<{ period: number | null; startTime: string | null; endTime: string | null; minutes: number }>
  >([]);
  const [grid, setGrid] = React.useState<GridByDay>({ monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} });

  const CELL_HEIGHT = 84;

  React.useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const studentRow = await fetchStudentMe();
        if (!studentRow) { setError('No student session found.'); setLoading(false); return; }
        const sb = body(studentRow);
        setStudentName([sb.firstName, sb.lastName].filter(Boolean).join(' '));

        const secRel = relOne((sb as AnyObj).section);
        const secBody = secRel ? body(secRel) : null;
        const sectionId = (secRel as AnyObj)?.id ?? (secRel as AnyObj)?.documentId ?? null;
        setSectionName((secBody as AnyObj)?.name || '');
        if (!sectionId) { setError('The student has no assigned section.'); setLoading(false); return; }

        const entries = await fetchTimetableBySectionId(Number(sectionId));
        const { slots: s, grid: g } = buildSlotsAndGrid(entries);

        for (const it of entries) {
          const a = body(it);
          const day: Day = (a as AnyObj).day;

          const subj = relOne((a as AnyObj).subject);
          const tch = relOne((a as AnyObj).teacher);
          const subjB = subj ? body(subj) : null;
          const tchB = tch ? body(tch) : null;

          const subjectFull = (subjB as AnyObj)?.name || (subjB as AnyObj)?.shortName || '';
          const teacherFull = [tchB?.firstName, tchB?.lastName].filter(Boolean).join(' ');

          const key =
            (a as AnyObj).startTime && (a as AnyObj).endTime
              ? `time:${(a as AnyObj).startTime}-${(a as AnyObj).endTime}`
              : `period:${(a as AnyObj).period ?? 'NA'}:${(a as AnyObj).startTime ?? 'NA'}-${(a as AnyObj).endTime ?? 'NA'}`;

          g[day][key] = { subject: subjectFull, color: (subjB as AnyObj)?.color || null, teacher: teacherFull };
        }

        setSlots(s); setGrid(g);
      } catch (e: unknown) {
        setError(`Could not load timetable. ${(e as Error)?.message || e}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* Encabezado tarjeta (idéntico Parents) */}
      {!printMode && (
        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: '#ececf4' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-hughes-blue">{studentName || 'Student'}</span>
            {sectionName && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold"
                style={{ background: 'rgba(255,187,0,0.22)', color: 'var(--hs-blue)' }}
              >
                <Tag size={12} />
                {sectionName}
              </span>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-xl border p-6 text-center text-hughes-blue bg-white" style={{ borderColor: '#ececf4' }}>
          Loading…
        </div>
      )}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[920px] border-collapse text-sm print-table">
          <thead>
  <tr className="bg-slate-100 text-hughes-blue">
    <th className="border-b border-slate-200 p-2 text-left w-[160px]">Time</th>
    <th className="border-b border-slate-200 p-2 text-center w-[64px]">Min</th>
    <th className="border-b border-slate-200 p-2 text-center w-[76px]">Period</th>
    
    {/* AQUÍ ESTÁ EL CAMBIO: Agregamos w-[14%] para forzar igualdad */}
    {DAYS.map(d => (
      <th 
        key={d} 
        className="border-b border-slate-200 p-2 text-left w-[14%]" 
      >
        {DAY_LABELS[d]}
      </th>
    ))}
  </tr>
</thead>
            <tbody>
              {slots.map((slot, idx) => {
                const start = hhmm(slot.startTime);
                const end = hhmm(slot.endTime);
                const rowKey =
                  slot.startTime && slot.endTime
                    ? `time:${slot.startTime}-${slot.endTime}`
                    : `period:${slot.period ?? 'NA'}:${slot.startTime ?? 'NA'}-${slot.endTime ?? 'NA'}`;
                return (
                  <tr key={`${rowKey}-${idx}`} className="odd:bg-white even:bg-slate-50/40">
                    <td className="p-2 font-medium text-hughes-blue cell" style={{ height: CELL_HEIGHT }}>
                      {start && end ? `${start} - ${end}` : '—'}
                    </td>
                    <td className="p-2 text-center cell" style={{ height: CELL_HEIGHT }}>
                      {slot.minutes || '—'}
                    </td>
                    <td className="p-2 text-center cell" style={{ height: CELL_HEIGHT }}>
                      {slot.period ?? '—'}
                    </td>
                    {DAYS.map(d => (
                      <td key={d} className="p-1 cell" style={{ height: CELL_HEIGHT }}>
                        <SubjectCell cell={grid[d][rowKey]} height={CELL_HEIGHT - 8} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* =========================
   Grilla Artística
   ========================= */
function ArtisticGrid({ printMode = false }: { printMode?: boolean }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [studentName, setStudentName] = React.useState('');
  const [groupName, setGroupName] = React.useState('');

  const [slots, setSlots] = React.useState<
    Array<{ period: number | null; startTime: string | null; endTime: string | null; minutes: number }>
  >([]);
  const [grid, setGrid] = React.useState<GridByDay>({ monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} });

  const CELL_HEIGHT = 84;

  React.useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const studentRow = await fetchStudentMe();
        if (!studentRow) { setError('No student session found.'); setLoading(false); return; }
        const sb = body(studentRow);
        setStudentName([sb.firstName, sb.lastName].filter(Boolean).join(' '));

        const agRel = relOne((sb as AnyObj).art_group ?? (sb as AnyObj).artGroup);
        const agBody = agRel ? body(agRel) : null;
        const groupId = (agRel as AnyObj)?.id ?? (agRel as AnyObj)?.documentId ?? null;
        setGroupName((agBody as AnyObj)?.name || '');
        if (!groupId) { setError('The student has no assigned art group.'); setLoading(false); return; }

        const entries = await fetchArtTimetableByGroupId(Number(groupId));
        const { slots: s, grid: g } = buildSlotsAndGrid(entries);

        for (const it of entries) {
          const a = body(it);
          const day: Day = (a as AnyObj).day;

          const subj = relOne((a as AnyObj).subject);
          const tch = relOne((a as AnyObj).teacher);
          const subjB = subj ? body(subj) : null;
          const tchB = tch ? body(tch) : null;

          const subjectFull = (subjB as AnyObj)?.name || (subjB as AnyObj)?.shortName || '';
          const teacherFull = [tchB?.firstName, tchB?.lastName].filter(Boolean).join(' ');

          const key =
            (a as AnyObj).startTime && (a as AnyObj).endTime
              ? `time:${(a as AnyObj).startTime}-${(a as AnyObj).endTime}`
              : `period:${(a as AnyObj).period ?? 'NA'}:${(a as AnyObj).startTime ?? 'NA'}-${(a as AnyObj).endTime ?? 'NA'}`;

          g[day][key] = { subject: subjectFull, color: (subjB as AnyObj)?.color || null, teacher: teacherFull };
        }

        setSlots(s); setGrid(g);
      } catch (e: unknown) {
        setError(`Could not load art timetable. ${(e as Error)?.message || e}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* Encabezado tarjeta (idéntico Parents) */}
      {!printMode && (
        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: '#ececf4' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-hughes-blue">{studentName || 'Student'}</span>
            {groupName && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold"
                style={{ background: 'rgba(255,187,0,0.22)', color: 'var(--hs-blue)' }}
              >
                <Tag size={12} />
                {groupName}
              </span>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-xl border p-6 text-center text-hughes-blue bg-white" style={{ borderColor: '#ececf4' }}>
          Loading…
        </div>
      )}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[920px] border-collapse text-sm print-table">
            <thead>
  <tr className="bg-slate-100 text-hughes-blue">
                <th className="border-b border-slate-200 p-2 text-left w-[160px]">Time</th>
    <th className="border-b border-slate-200 p-2 text-center w-[64px]">Min</th>
                <th className="border-b border-slate-200 p-2 text-center w-[76px]">Period</th>
    
    {/* AQUÍ ESTÁ EL CAMBIO: Agregamos w-[14%] para forzar igualdad */}
    {DAYS.map(d => (
      <th 
        key={d} 
        className="border-b border-slate-200 p-2 text-left w-[14%]" 
      >
                    {DAY_LABELS[d]}
      </th>
    ))}
  </tr>
</thead>
            <tbody>
              {slots.map((slot, idx) => {
                const start = hhmm(slot.startTime);
                const end = hhmm(slot.endTime);
                const rowKey =
                  slot.startTime && slot.endTime
                    ? `time:${slot.startTime}-${slot.endTime}`
                    : `period:${slot.period ?? 'NA'}:${slot.startTime ?? 'NA'}-${slot.endTime ?? 'NA'}`;
                return (
                  <tr key={`${rowKey}-${idx}`} className="odd:bg-white even:bg-slate-50/40">
                    <td className="p-2 font-medium text-hughes-blue cell" style={{ height: CELL_HEIGHT }}>
                      {start && end ? `${start} - ${end}` : '—'}
                    </td>
                    <td className="p-2 text-center cell" style={{ height: CELL_HEIGHT }}>
                      {slot.minutes || '—'}
                    </td>
                    <td className="p-2 text-center cell" style={{ height: CELL_HEIGHT }}>
                      {slot.period ?? '—'}
                    </td>
                    {DAYS.map(d => (
                      <td key={d} className="p-1 cell" style={{ height: CELL_HEIGHT }}>
                        <SubjectCell cell={grid[d][rowKey]} height={CELL_HEIGHT - 8} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Download, ExternalLink, Search, Tag as TagIcon, BookOpen } from 'lucide-react';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { StudentLogoutButton } from '@/components/parents/LogoutButton';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';

/* ───────── Sesión de estudiante ───────── */
function getStudentFromStorage(): { email?: string; tokenU?: string } | null {
  try {
    const raw = localStorage.getItem('hs_student_session');
    if (!raw) return null;
    return JSON.parse(raw) as { email?: string; tokenU?: string };
  } catch {
    return null;
  }
}

/* ───────── Helpers v4/v5 ───────── */
type URec = Record<string, unknown>;
type AnyObj = Record<string, any>;

function parseList<T = URec>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === 'object' && 'data' in json) {
    const data = (json as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}
function body<T = URec>(row: URec): T {
  const a = row as { attributes?: unknown };
  return (a?.attributes && typeof a.attributes === 'object'
    ? (a.attributes as T)
    : (row as T)) as T;
}
function relOne(rel: unknown): URec | null {
  if (!rel) return null;
  if (Array.isArray(rel)) return (rel[0] as URec) ?? null;
  if (rel && typeof rel === 'object' && 'data' in rel) {
    const d = (rel as { data?: unknown }).data;
    if (Array.isArray(d)) return (d[0] as URec) ?? null;
    if (d && typeof d === 'object') return d as URec;
    return null;
  }
  return rel as URec;
}
function relMany(rel: unknown): URec[] {
  if (!rel) return [];
  if (Array.isArray(rel)) return rel as URec[];
  if (rel && typeof rel === 'object' && 'data' in rel) {
    const d = (rel as { data?: unknown }).data;
    if (Array.isArray(d)) return d as URec[];
  }
  return [];
}
function abs(u?: string | null) {
  if (!u) return null;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `${API}${u}`;
}
function mediaUrl(m?: URec | null): string | null {
  if (!m) return null;
  const b = body<any>(m);
  const fmts = b.formats;
  const best = fmts?.medium?.url || fmts?.small?.url || b.url || null;
  return abs(best);
}
function mediaAlt(m?: URec | null) {
  if (!m) return undefined;
  const b = body<any>(m);
  return b.alternativeText || b.name || undefined;
}
async function fetchJSON(url: string, token?: string) {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { cache: 'no-store', headers });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(`HTTP ${res.status} ${JSON.stringify(j)}`);
  }
  return res.json();
}

/* ───────── Página Library ───────── */
export default function LibraryPage() {
  // 🔐 Proteger la ruta - redirige al login si no está autenticado
  const { user, loading: authLoading } = useStudentAuth();

  // filtros
  const [q, setQ] = React.useState('');
  const [subjectId, setSubjectId] = React.useState<string>('');
  // const [sectionId, setSectionId] = React.useState<string>(''); // si luego quieres filtrar por sección

  // datos
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [studentGrade, setStudentGrade] = React.useState<{ id: string; name: string } | null>(null);
  const [items, setItems] = React.useState<URec[]>([]);
  const [subjects, setSubjects] = React.useState<Array<{ id: string; name: string }>>([]);
  // const [sections, setSections] = React.useState<Array<{ id: string; name: string }>>([]);

  // paginación simple en cliente
  const [page, setPage] = React.useState(1);
  const pageSize = 20;

  React.useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        // 1) Obtener grado del estudiante autenticado usando API route
        const stuRes = await fetch('/api/student-auth/profile?populate=grade', {
          cache: 'no-store',
        });
        
        if (!stuRes.ok) {
          setError('Student session not found.');
          setItems([]);
          return;
        }
        
        const stuData = await stuRes.json();
        const stuRow = stuData?.student;
        const gradeRel = stuRow ? relOne(body<any>(stuRow).grade ?? stuRow.grade) : null;
        const gradeId = gradeRel ? String((gradeRel as any).id ?? (gradeRel as any).documentId) : '';
        const gradeName = gradeRel ? (body<any>(gradeRel).name || (gradeRel as any).name || '') : '';
        if (!gradeId) {
          setError('The student has no assigned grade.');
          setItems([]);
          return;
        }
        setStudentGrade({ id: gradeId, name: gradeName || 'Grade' });

        // 2) Fetch textbooks only for that grade (public endpoint)
        const p = new URLSearchParams();
        p.set('populate[file]', 'true');
        p.set('populate[grade]', 'true');
        p.set('populate[section]', 'true');
        p.set('populate[subject]', 'true');
        p.set('filters[grade][id][$eq]', gradeId);
        p.set('pagination[pageSize]', '200');
        const url = `${API}/api/textbooks?${p.toString()}`;
        const json = await fetchJSON(url);
        const list = parseList(json);
        setItems(list);

        // build subject catalog from textbooks
        const sMap = new Map<string, string>();
        for (const it of list) {
          const b = body<any>(it);
          const s = relOne(b.subject);
          if (s) sMap.set(String((s as any).id ?? (s as any).documentId), body<any>(s).name ?? '—');
        }
        setSubjects(Array.from(sMap.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (e: unknown) {
        setError((e as Error)?.message || 'Could not load the catalog.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filtrado
  const filtered = React.useMemo(() => {
    let out = items.slice();

    if (studentGrade?.id) {
      out = out.filter(it => {
        const b = body<any>(it);
        const g = relOne(b.grade);
        const id = g ? String((g as any).id ?? (g as any).documentId) : '';
        return id === studentGrade.id;
      });
    } else {
      // If no grade, show nothing
      return [];
    }

    if (subjectId) {
      out = out.filter(it => {
        const b = body<any>(it);
        const s = relOne(b.subject);
        const id = s ? String((s as any).id ?? (s as any).documentId) : '';
        return id === subjectId;
      });
    }

    // if (sectionId) { ... }

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      out = out.filter(it => {
        const b = body<any>(it);
        const gradeName = relOne(b.grade) ? (body<any>(relOne(b.grade)!).name || '') : '';
        const subjectName = relOne(b.subject) ? (body<any>(relOne(b.subject)!).name || '') : '';
        const sectionName = relOne(b.section) ? (body<any>(relOne(b.section)!).name || '') : '';
        return (
          (b.title || '').toLowerCase().includes(qq) ||
          (b.author || '').toLowerCase().includes(qq) ||
          gradeName.toLowerCase().includes(qq) ||
          subjectName.toLowerCase().includes(qq) ||
          sectionName.toLowerCase().includes(qq)
        );
      });
    }
    return out;
  }, [items, studentGrade, subjectId, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [q, subjectId]);

  const onExport = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    window.print();
  }, []);

  // Show loader while auth is being verified
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

  // helpers de portada/descarga a partir de "file" (Multiple Media)
  function pickCoverAndDownload(filesRel: unknown) {
    const files = relMany(filesRel);
    let cover: URec | null = null;
    let download: URec | null = null;

    for (const f of files) {
      const b = body<any>(f);
      const mime = String(b.mime || '');
      if (!cover && mime.startsWith('image/')) cover = f;
      if (!download && !mime.startsWith('image/')) download = f;
    }
    // si no hay imagen, intenta usar el primero como “portada”
    if (!cover && files[0]) cover = files[0];
    return { cover, download };
  }

  return (
    <div className="min-h-screen print:bg-white" style={{ background: '#f9f9fb' }}>
      <style jsx global>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .print-hide { display: none !important; }
          html, body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <section className="w-full py-10">
        <div className="mx-auto max-w-7xl px-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 print-hide">
            <div className="flex items-center gap-2">
              <BookOpen className="text-hughes-blue" size={20} />
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-hughes-blue">Library</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/student/help-center"
                className="inline-flex items-center rounded-xl border px-3 py-2 text-sm font-semibold bg-white hover:bg-slate-50"
                style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)' }}
              >
                Back to portal
              </Link>
              
              {/* Separador */}
              <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />
              
              {/* Logout */}
              <StudentLogoutButton />
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 print-hide">
            <div className="sm:col-span-1">
              <label className="block text-sm font-semibold text-hughes-blue">Search</label>
              <div className="mt-2 flex items-center rounded-xl border bg-white px-3 ring-1 ring-slate-200">
                <Search size={16} className="text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Title, author, subject…"
                  className="ml-2 w-full py-2 outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-semibold text-hughes-blue">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 ring-1 ring-slate-200"
              >
                <option value="">All</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {/* Si luego quieres por sección: ... */}
          </div>

          {/* Estados */}
          {loading && (
            <div className="mt-6 rounded-2xl border bg-white p-6 text-center text-hughes-blue shadow-sm" style={{ borderColor: '#ececf4' }}>
              Loading catalog…
            </div>
          )}
          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          )}

          {/* Resultados */}
          {!loading && !error && (
            <>
              <div className="mt-4 text-sm text-hughes-blue/70">
                {filtered.length} book{filtered.length === 1 ? '' : 's'} found
                {studentGrade && <> • Grade: <span className="font-semibold">{studentGrade.name}</span></>}
                {subjectId && <> • Subject: <span className="font-semibold">{subjects.find(s => s.id === subjectId)?.name}</span></>}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {pageItems.map((it) => {
                  const b = body<any>(it);

                  const gradeRel = relOne(b.grade);
                  const gradeName = gradeRel ? (body<any>(gradeRel).name || '') : '';

                  const subjectRel = relOne(b.subject);
                  const subjectName = subjectRel ? (body<any>(subjectRel).name || '') : '';

                  const sectionRel = relOne(b.section);
                  const sectionName = sectionRel ? (body<any>(sectionRel).name || '') : '';

                  const { cover, download } = pickCoverAndDownload(b.file);
                  const coverUrl = mediaUrl(cover);
                  const fileUrl = download ? mediaUrl(download) : null;

                  const link = b.link ? String(b.link) : '';

                  return (
                    <article key={String((it as any).id ?? (it as any).documentId)} className="rounded-2xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: '#ececf4' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverUrl || '/placeholder-cover.png'}
                        alt={mediaAlt(cover) || b.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="line-clamp-2 font-semibold text-hughes-blue">{b.title}</h3>
                        {b.author && <p className="mt-0.5 text-sm text-hughes-blue/70">{b.author}</p>}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {gradeName && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-hughes-blue">
                              {gradeName}
                            </span>
                          )}
                          {subjectName && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                              style={{ background: 'rgba(255,187,0,0.22)', color: 'var(--hs-blue)' }}
                            >
                              <TagIcon size={12} /> {subjectName}
                            </span>
                          )}
                          {sectionName && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-hughes-blue">
                              {sectionName}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {link && (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                              style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)' }}
                            >
                              <ExternalLink size={14} /> View resource
                            </a>
                          )}
                          {fileUrl && (
                            <a
                              href={fileUrl}
                              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                              style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)' }}
                              download
                            >
                              <Download size={14} /> Download
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2 print-hide">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)', background: 'white' }}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-hughes-blue/80">Page {page} of {totalPages}</span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    style={{ borderColor: '#e2e8f0', color: 'var(--hs-blue)', background: 'white' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

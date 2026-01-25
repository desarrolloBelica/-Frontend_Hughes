// app/where-our-graduates-go/page.tsx
"use client";

import { FaGlobeAmericas } from "react-icons/fa"; // Ícono de mundo
import ReactCountryFlag from "react-country-flag";
import { useEffect, useMemo, useState } from "react";

// Backend rows (Strapi v4/v5 minimal)
type RowV5 = { id: number | string; name?: string; country?: string; page?: string };
type RowV4 = {
  id: number | string;
  attributes?: { name?: string; country?: string; page?: string };
};
type UniRow = RowV4 | RowV5;

type University = { name: string; country: string; page?: string };

function getAttr<T = unknown>(row: UniRow, key: "name" | "country" | "page"): T | undefined {
  const root = row as Record<string, unknown>; // v5
  if (root[key] !== undefined) return root[key] as T;
  const attrs = (row as RowV4).attributes as Record<string, unknown> | undefined; // v4
  if (attrs && attrs[key] !== undefined) return attrs[key] as T;
  return undefined;
}

const COUNTRY_CODES: Record<string, string> = {
  Bolivia: "BO",
  "United States": "US",
  Argentina: "AR",
  Italy: "IT",
};

// Orden: país, luego nombre
function sortRows(rows: University[]) {
  return [...rows].sort((a, b) => {
    const ca = (a.country ?? "").toLowerCase();
    const cb = (b.country ?? "").toLowerCase();
    if (ca === cb) return (a.name ?? "").localeCompare(b.name ?? "");
    return ca.localeCompare(cb);
  });
}

export default function WhereOurGraduatesGoPage() {
  const [rows, setRows] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("pagination[pageSize]", "500");
        const res = await fetch(`${base}/api/universities?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json();
        const raw: UniRow[] = Array.isArray(json)
          ? (json as UniRow[])
          : ((json as { data?: UniRow[] }).data ?? []);
        const mapped: University[] = raw.map((r) => ({
          name: (getAttr<string>(r, "name") ?? "").trim(),
          country: (getAttr<string>(r, "country") ?? "").trim(),
          page: (getAttr<string>(r, "page") ?? "").trim() || undefined,
        })).filter((u) => u.name && u.country);
        if (!cancelled) setRows(sortRows(mapped));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="section-gradient-soft-yellow">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="flex items-center gap-3">
            <FaGlobeAmericas className="text-[var(--hs-yellow)] text-4xl md:text-5xl" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-hughes-blue">
              Our Graduates Around the World
            </h1>
          </div>

          <p className="mt-4 max-w-3xl text-lg text-hughes-blue/80">
            Hughes Schools alumni are accepted to top universities worldwide and in
            Bolivia — a testament to the strength of our academic program.{" "}
            <strong>100% matriculated to 4-year colleges and/or universities.</strong>
          </p>
        </div>
      </section>

      {/* LISTA COMPACTA EN TABLA */}
      <section className="bg-[#f5f6fb]">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 pb-24 md:pb-36">
          <div
            className="overflow-hidden rounded-2xl border bg-white"
            style={{ borderColor: "#ececf4" }}
          >
            <div
              className="px-4 py-4 md:px-6 border-b"
              style={{ borderColor: "#ececf4" }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-hughes-blue">
                Universities by Country
              </h2>
              <p className="text-sm text-hughes-blue/70 mt-1">
                Compact list of institutions attended by our graduates.
              </p>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-hughes-blue/70">Loading universities…</div>
              ) : error ? (
                <div className="p-6 text-hughes-blue">Error: {error}</div>
              ) : rows.length === 0 ? (
                <div className="p-6 text-hughes-blue/70">No data available.</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-[#fafbff] text-hughes-blue/80">
                    <tr>
                      <th className="text-left font-semibold px-4 py-3 md:px-6">Country</th>
                      <th className="text-left font-semibold px-4 py-3 md:px-6">University</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u, idx) => (
                      <tr
                        key={`${u.country}-${u.name}-${idx}`}
                        className="border-t hover:bg-[#fafbff]"
                        style={{ borderColor: "#ececf4" }}
                      >
                        <td className="px-4 py-3 md:px-6 text-hughes-blue/90 flex items-center gap-2">
                          {COUNTRY_CODES[u.country] && (
                            <ReactCountryFlag
                              countryCode={COUNTRY_CODES[u.country]}
                              svg
                              style={{ width: "1.5em", height: "1.5em", borderRadius: "3px" }}
                            />
                          )}
                          {u.country}
                        </td>
                        <td className="px-4 py-3 md:px-6">
                          {u.page ? (
                            <a
                              href={u.page}
                              target="_blank"
                              rel="noreferrer"
                              className="text-hughes-blue hover:underline"
                            >
                              {u.name}
                            </a>
                          ) : (
                            <span className="text-hughes-blue/90">{u.name}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

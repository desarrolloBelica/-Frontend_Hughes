// app/where-our-graduates-go/page.tsx
"use client";

import { FaGlobeAmericas } from "react-icons/fa"; // Ícono de mundo
import ReactCountryFlag from "react-country-flag";
import { useEffect, useState } from "react";

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
  Argentina: "AR",
  Brazil: "BR",
  Chile: "CL",
  Colombia: "CO",
  "Costa Rica": "CR",
  Cuba: "CU",
  "Dominican Republic": "DO",
  Ecuador: "EC",
  "El Salvador": "SV",
  Guatemala: "GT",
  Honduras: "HN",
  Mexico: "MX",
  Nicaragua: "NI",
  Panama: "PA",
  Paraguay: "PY",
  Peru: "PE",
  Uruguay: "UY",
  Venezuela: "VE",
  "United States": "US",
  Canada: "CA",
  "United Kingdom": "GB",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Switzerland: "CH",
  Netherlands: "NL",
  Sweden: "SE",
  Norway: "NO",
  Denmark: "DK",
  Finland: "FI",
  Australia: "AU",
  "New Zealand": "NZ",
  Japan: "JP",
  "South Korea": "KR",
  China: "CN",
  Singapore: "SG",
  India: "IN",
  Israel: "IL",
  Russia: "RU",
  "South Africa": "ZA",
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
    <main className="min-h-screen bg-white">
      {/* HERO - Actualizado a fondo Azul Institucional */}
      <section className="bg-hs-bluenavy relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <FaGlobeAmericas className="text-hs-yellow text-4xl md:text-5xl lg:text-6xl" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-yellow leading-tight">
              Our Graduates Around the World
            </h1>
          </div>

          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-white opacity-90">
            Hughes Schools alumni are accepted to top universities worldwide and in
            Bolivia — a testament to the strength of our academic program.{" "}
            <strong className="text-hs-yellow font-bold">100% matriculated to 4-year colleges and/or universities.</strong>
          </p>
        </div>
      </section>

      {/* LISTA DE UNIVERSIDADES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 pb-24 md:pb-36">
          <div
            className="overflow-hidden rounded-3xl border-2 shadow-xl"
            style={{ borderColor: "var(--hs-bluenavy)" }}
          >
            {/* Header de la Tabla - Fondo Amarillo */}
            <div
              className="px-6 py-8 md:px-10 border-b-2 bg-hs-yellow"
              style={{ borderColor: "var(--hs-bluenavy)" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-hs-bluenavy mb-2">
                Universities by Country
              </h2>
              <p className="text-lg md:text-xl font-medium text-hs-bluenavy opacity-90">
                Compact list of institutions attended by our graduates.
              </p>
            </div>

            {/* Contenedor de la Tabla */}
            <div className="overflow-x-auto bg-white">
              {loading ? (
                <div className="p-10 text-lg text-hs-bluenavy/70 font-semibold animate-pulse">
                  Loading universities…
                </div>
              ) : error ? (
                <div className="p-10 text-lg text-red-600 font-semibold">
                  Error: {error}
                </div>
              ) : rows.length === 0 ? (
                <div className="p-10 text-lg text-hs-bluenavy/70 font-semibold">
                  No data available.
                </div>
              ) : (
                <table className="min-w-full text-base md:text-lg text-hs-bluenavy">
                  <thead className="bg-hs-bluenavy text-hs-yellow">
                    <tr>
                      <th className="text-left font-bold px-6 py-5 md:px-10">Country</th>
                      <th className="text-left font-bold px-6 py-5 md:px-10">University</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u, idx) => (
                      <tr
                        key={`${u.country}-${u.name}-${idx}`}
                        className="border-t-2 hover:bg-black/5 transition-colors"
                        style={{ borderColor: "var(--hs-bluenavy)" }}
                      >
                        <td className="px-6 py-4 md:px-10 font-bold flex items-center gap-4">
                          {COUNTRY_CODES[u.country] && (
                            <ReactCountryFlag
                              countryCode={COUNTRY_CODES[u.country]}
                              svg
                              style={{ width: "2em", height: "2em", borderRadius: "4px" }}
                            />
                          )}
                          {u.country}
                        </td>
                        <td className="px-6 py-4 md:px-10 font-medium">
                          {u.page ? (
                            <a
                              href={u.page}
                              target="_blank"
                              rel="noreferrer"
                              className="text-hs-bluenavy hover:text-[var(--hs-blue)] hover:underline decoration-2 underline-offset-4"
                            >
                              {u.name}
                            </a>
                          ) : (
                            <span className="opacity-90">{u.name}</span>
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
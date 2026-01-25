"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

// Strapi v4/v5 row types (minimal)
type Media = {
  url?: string;
  formats?: Record<string, { url: string }>;
  attributes?: { url?: string; formats?: Record<string, { url: string }> };
};

type RowV5 = {
  id: number | string;
  name?: string;
  logo?: Media[] | Media | null;
};

type RowV4 = {
  id: number | string;
  attributes?: {
    name?: string;
    logo?: { data?: Media[] | Media | null } | Media[] | Media | null;
  };
};

type UniRow = RowV4 | RowV5;

type CarouselItem = { name: string; logoUrl: string | null };

function abs(u?: string | null) {
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}

function getAttr<T = unknown>(row: UniRow, key: "name" | "logo"): T | undefined {
  const root = row as Record<string, unknown>; // v5
  if (root[key] !== undefined) return root[key] as T;
  const attrs = (row as RowV4).attributes as Record<string, unknown> | undefined; // v4
  if (attrs && attrs[key] !== undefined) return attrs[key] as T;
  return undefined;
}

function getMediaArray(val: unknown): Media[] {
  if (Array.isArray(val)) return val as Media[];
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if ("url" in obj || (obj as { url?: string }).url !== undefined) return [obj as Media];
    const d = (obj as { data?: unknown }).data;
    if (Array.isArray(d)) return d as Media[];
    if (d && typeof d === "object") return [d as Media];
  }
  return [];
}

function mediaUrl(m?: Media | null): string | null {
  if (!m) return null;
  const fmts = m.formats ?? m.attributes?.formats;
  const best = fmts?.medium?.url ?? fmts?.small?.url ?? m.url ?? m.attributes?.url ?? null;
  return abs(best);
}

export default function UniversityCarousel() {
  const router = useRouter();
  const [items, setItems] = React.useState<CarouselItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const qs = new URLSearchParams();
        qs.set("populate[logo]", "true");
        qs.set("pagination[pageSize]", "200");
        const res = await fetch(`${base}/api/universities?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json();
        const rows: UniRow[] = Array.isArray(json)
          ? (json as UniRow[])
          : ((json as { data?: UniRow[] }).data ?? []);
        const mapped: CarouselItem[] = rows.map((r) => {
          const name = (getAttr<string>(r, "name") ?? "").trim() || "University";
          const logos = getMediaArray(getAttr(r, "logo"));
          const url = mediaUrl(logos[0] ?? null);
          return { name, logoUrl: url };
        });
        if (!cancelled) setItems(mapped.filter((m) => m.logoUrl));
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

  const logos = React.useMemo(() => [...items, ...items], [items]);

  return (
    <section className="py-16 bg-white overflow-hidden">

      <h2 className="text-center text-3xl md:text-3xl font-bold mb-2 text-hughes-blue">
        Prestigious Universities & Conservatories 
        Accepting Hughes Schools Graduates
      </h2>

      {/* Carrusel */}
      <div className="relative w-full">
        {loading ? (
          <div className="flex gap-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 basis-[320px] flex items-center justify-center">
                <div className="h-[120px] w-[280px] bg-[#f1f2f7] rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-hughes-blue">Error loading universities: {error}</div>
        ) : logos.length === 0 ? (
          <div className="text-center text-hughes-blue">No universities available.</div>
        ) : (
          <motion.div
            className="flex gap-20"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {logos.map((uni, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center basis-[320px]">
                {uni.logoUrl ? (
                  <Image
                    src={uni.logoUrl}
                    alt={uni.name}
                    width={230}
                    height={100}
                    className="object-contain"
                  />
                ) : (
                  <div className="h-[120px] w-[280px] bg-[#f1f2f7] rounded" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Texto y botón */}
      <div className="mt-12 text-center max-w-3xl mx-auto px-6">
        <p className="text-base md:text-lg text-[#110631]">
          Our graduates have been accepted to over <strong>{items.length} universities</strong> around the world, 
          showcasing the academic excellence and global reach of Hughes Schools.
        </p>

<motion.button
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => router.push("/academics/graduates")}
  aria-label="See all universities"
  className="group relative mt-6 inline-flex h-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#FFBB00] px-9 text-[15px] font-semibold shadow-2xl transition-transform"
>
  {/* Fondo amarillo al hacer hover */}
  <span className="absolute inset-0 rounded-full bg-[#110631] transition-colors duration-200 group-hover:bg-[#FFBB00]" />
  
  {/* Texto: blanco por defecto, azul al hover */}
  <span className="relative z-10 transition-colors duration-200 text-white group-hover:!text-[#110631]">
    See All
  </span>
</motion.button>

      </div>
    </section>
  );
}

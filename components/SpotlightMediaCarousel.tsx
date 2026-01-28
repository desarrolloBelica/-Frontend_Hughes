"use client";

import { useMemo, useState } from "react";

export type SpotlightMedia = {
  url: string;
  alt?: string;
};

const HS_BLUE = "var(--hs-blue)";
const HS_YELLOW_LIGHT = "var(--hs-yellow-light)";

function clampIndex(next: number, total: number) {
  if (total <= 0) return 0;
  if (next < 0) return total - 1;
  if (next >= total) return 0;
  return next;
}

export default function SpotlightMediaCarousel({ items }: { items: SpotlightMedia[] }) {
  const media = useMemo(() => items.filter((m) => !!m.url), [items]);
  const [index, setIndex] = useState(0);

  if (media.length === 0) return null;

  const current = media[clampIndex(index, media.length)];
  const showControls = media.length > 1;

  return (
    <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: "#e6e8f2", background: "#0f172a" }}>
      <div className="aspect-video w-full bg-black/40">
        <img
          src={current.url}
          alt={current.alt || "Spotlight media"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {showControls && (
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => setIndex((i) => clampIndex(i - 1, media.length))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 text-sm font-semibold shadow-sm transition hover:bg-white"
            style={{ borderColor: "#e6e8f2", color: HS_BLUE }}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => clampIndex(i + 1, media.length))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 text-sm font-semibold shadow-sm transition hover:bg-white"
            style={{ borderColor: "#e6e8f2", color: HS_BLUE }}
          >
            →
          </button>
        </div>
      )}

      {showControls && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow" style={{ border: "1px solid #e6e8f2" }}>
          {media.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: i === index ? HS_BLUE : HS_YELLOW_LIGHT, opacity: i === index ? 1 : 0.6 }}
              aria-label={`Mostrar imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

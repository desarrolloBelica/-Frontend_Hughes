import Link from "next/link";

const HS_BLUE = "var(--hs-blue)";
interface Opinion {
	id: number | string;
	rateStars?: number;
	comment?: string;
	approved?: boolean;
	createdAt?: string;
	attributes?: Opinion; // for Strapi v4
}

const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

async function fetchOpinions(): Promise<Opinion[]> {
	try {
		const qs = new URLSearchParams();
		qs.set("filters[approved][$eq]", "true");
		qs.set("pagination[page]", "1");
		qs.set("pagination[pageSize]", "200");
		qs.set("sort[0]", "createdAt:desc");
		const res = await fetch(`${backendBase}/api/opinions?${qs.toString()}`, { cache: "no-store" });
		if (!res.ok) return [];
		const json: any = await res.json();
		if (Array.isArray(json)) return json;
		return json?.data ?? [];
	} catch {
		return [];
	}
}

function val<T>(row: Opinion, key: keyof Opinion): T | undefined {
	if (row[key] !== undefined) return row[key] as T;
	if (row.attributes && row.attributes[key] !== undefined) return row.attributes[key] as T;
	return undefined;
}

function formatDate(value?: string) {
	if (!value) return "";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function StarRow({ score }: { score: number }) {
	return (
		<div className="flex items-center gap-1 text-yellow-500">
			{[1, 2, 3, 4, 5].map((n) => (
				<span key={n} className={n <= score ? "" : "text-gray-300"}>★</span>
			))}
		</div>
	);
}

function StarMeter({ value }: { value: number }) {
	const safe = Math.max(0, Math.min(5, value));
	const width = (safe / 5) * 100;
	return (
		<div className="relative inline-flex text-2xl leading-none" aria-label={`Average ${safe.toFixed(1)} out of 5 stars`}>
			<div className="text-gray-300">★★★★★</div>
			<div className="absolute inset-0 overflow-hidden" style={{ width: `${width}%` }}>
				<div className="text-yellow-500">★★★★★</div>
			</div>
		</div>
	);
}

export default async function OpinionsPage() {
	const opinions = await fetchOpinions();
	const approved = opinions.filter((row) => Boolean(val<boolean>(row, "approved")));
	const count = approved.length;
	const sum = approved.reduce((acc, row) => acc + Number(val<number>(row, "rateStars") ?? 0), 0);
	const average = count ? Number((sum / count).toFixed(1)) : 0;

	return (
		<main className="min-h-screen bg-white text-hughes-blue">
			<section
				className="relative overflow-hidden border-b border-[#e6e8f2] bg-gradient-to-br from-[var(--hs-blue)] via-[var(--hs-blue-medium)] to-[#0b1220]"
			>
				<div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "radial-gradient(100% 80% at 15% 10%, rgba(255,187,0,0.32), transparent 55%), radial-gradient(80% 60% at 85% 20%, rgba(255,255,255,0.18), transparent 60%)" }} />
				<div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-6 py-12 text-white md:flex-row md:items-center md:justify-between">
					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Opinions</p>
						<h1 className="text-3xl font-bold">Community opinions</h1>
						<p className="max-w-2xl text-white/85">
							This space is moderated to gather respectful and constructive opinions about the school experience.
						</p>
						<div className="flex flex-wrap items-center gap-3">
							<Link href="/alumni?opinion=1#opinions" className="btn-hs-primary">
								Leave an opinion
							</Link>
							<Link href="/alumni" className="btn-hs-secondary">
								Back to alumni
							</Link>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-4 text-center shadow-lg backdrop-blur">
						<div className="flex flex-col items-center gap-1">
							<StarMeter value={average} />
							<div className="text-sm font-semibold">{average.toFixed(1)} / 5</div>
							<div className="text-xs uppercase tracking-wide text-white/70">Average</div>
						</div>
						<div className="flex flex-col items-center gap-1">
							<div className="text-3xl font-bold">{count}</div>
							<div className="text-xs uppercase tracking-wide text-white/70">Opinions</div>
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
				<div className="rounded-2xl border border-[#e6e8f2] bg-[#f9fafc] p-5 text-sm text-hughes-blue/80 shadow-sm">
					<p className="font-semibold text-hughes-blue">Moderation and publishing criteria</p>
					<ul className="mt-2 space-y-1">
						<li>Opinions are reviewed before publishing.</li>
						<li>Respectful and constructive feedback is welcome, even if critical.</li>
						<li>No insults, offensive language, or personal attacks.</li>
						<li>No personal data (phone numbers, addresses, or names of third parties).</li>
						<li>No false, defamatory, or legally risky content.</li>
						<li>Do not share full names of students, families, or staff without consent.</li>
						<li>The school may reject submissions that create legal or institutional risk.</li>
					</ul>
				</div>

				<div className="space-y-4">
					<h2 className="text-xl font-semibold" style={{ color: HS_BLUE }}>
						All approved opinions
					</h2>
					{!approved.length && (
						<p className="text-sm text-hughes-blue/70">No opinions have been published yet.</p>
					)}
					<div className="grid gap-3 md:grid-cols-2">
						{approved.map((row) => {
							const stars = Number(val<number>(row, "rateStars") ?? 0);
							const comment = val<string>(row, "comment") ?? "";
							const created = formatDate(val<string>(row, "createdAt"));
							return (
								<article key={row.id} className="rounded-2xl border border-[#e0e6f5] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
									<div className="flex items-center justify-between gap-3">
										<StarRow score={stars} />
										{created && <span className="text-xs text-hughes-blue/60">{created}</span>}
									</div>
									<p className="mt-2 text-sm text-hughes-blue/80 whitespace-pre-line">{comment}</p>
								</article>
							);
						})}
					</div>
				</div>
			</div>
		</main>
	);
}

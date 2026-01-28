import Link from "next/link";
import { cache } from "react";
import OpinionsSection from "../../components/opinions/OpinionsSection";

const HS_YELLOW = "var(--hs-yellow)";
const HS_BLUE = "var(--hs-blue)";
const HS_NAVY = "var(--hs-bluenavy)";
const HS_BLUE_MEDIUM = "var(--hs-blue-medium)";

const missionPoints = [
	"Celebrate the accomplishments of our graduates",
	"Strengthen the bond between alumni and current students",
	"Foster a network of mutual support, mentorship, and professional growth",
	"Promote the values and traditions of Hughes Schools",
	"Encourage alumni participation in academic, artistic, cultural, and community initiatives",
	"Support opportunities for higher education and international experiences",
];

const successFields = [
	"Performing Arts: Professional dancers, musicians, choreographers, theater artists, and cultural ambassadors",
	"Science & Medicine: Biologists, physicians, medical technologists, and researchers",
	"Education: Teachers, coordinators, and school administrators",
	"Business & Entrepreneurship: Leaders in finance, management, marketing, and innovation",
	"International Studies: Graduates studying or working in Germany, Brazil, the United States, Spain, Argentina, and beyond",
];

/* ───────────── Tipos (Strapi v4/v5 mínimos) ───────────── */
type SpotlightV5 = {
	id: number | string;
	documentId?: string;
	fullname?: string;
	city?: string;
	university?: string;
	profession?: string;
	graduationYear?: string; // date string
	artisticPath?: string;
	biography?: string;
	hughesImpact?: string;
	messageForStudents?: string;
	approved?: boolean;
	createdAt?: string;
};

type SpotlightV4 = {
	id: number | string;
	attributes?: Omit<SpotlightV5, "id">;
};

type Spotlight = SpotlightV4 | SpotlightV5;

function sAttr<T = unknown>(row: Spotlight, key: keyof SpotlightV5): T | undefined {
	const root = row as Record<string, unknown>;
	if (root[key as string] !== undefined) return root[key as string] as T; // v5
	const attrs = (row as SpotlightV4).attributes as Record<string, unknown> | undefined; // v4
	if (attrs && attrs[key as string] !== undefined) return attrs[key as string] as T;
	return undefined;
}

const fetchLatestSpotlight = cache(async (): Promise<Spotlight | null> => {
	try {
		const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
		const qs = new URLSearchParams();
		qs.set("filters[approved][$eq]", "true");
		qs.set("pagination[page]", "1");
		qs.set("pagination[pageSize]", "1");
		qs.set("sort[0]", "createdAt:desc");
		const res = await fetch(`${base}/api/spothights?${qs.toString()}`, { cache: "no-store" });
		if (!res.ok) return null;
		const json: unknown = await res.json();
		const data = Array.isArray(json)
			? (json as Spotlight[])
			: ((json as { data?: Spotlight[] }).data ?? []);
		return data[0] ?? null;
	} catch {
		return null;
	}
});

type Opinion = {
	id: number | string;
	rateStars?: number;
	comment?: string;
	approved?: boolean;
	createdAt?: string;
};

type OpinionV4 = {
	id: number | string;
	attributes?: Opinion;
};

function oAttr<T = unknown>(row: Opinion | OpinionV4, key: keyof Opinion): T | undefined {
	const root = row as Record<string, unknown>;
	if (root[key as string] !== undefined) return root[key as string] as T; // v5
	const attrs = (row as OpinionV4).attributes as Record<string, unknown> | undefined; // v4
	if (attrs && attrs[key as string] !== undefined) return attrs[key as string] as T;
	return undefined;
}

const fetchOpinionsSummary = cache(async (): Promise<{ average: number; count: number }> => {
	try {
		const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
		const qs = new URLSearchParams();
		qs.set("filters[approved][$eq]", "true");
		qs.set("pagination[page]", "1");
		qs.set("pagination[pageSize]", "200");
		qs.set("sort[0]", "createdAt:desc");
		const res = await fetch(`${base}/api/opinions?${qs.toString()}`, { cache: "no-store" });
		if (!res.ok) return { average: 0, count: 0 };
		const json: unknown = await res.json();
		const rows = Array.isArray(json)
			? (json as Opinion[])
			: ((json as { data?: Opinion[] }).data ?? []);
		const approved = rows.filter((row) => Boolean(oAttr<boolean>(row, "approved")));
		const count = approved.length;
		if (!count) return { average: 0, count: 0 };
		const sum = approved.reduce((acc, row) => acc + Number(oAttr<number>(row, "rateStars") ?? 0), 0);
		return { average: Number((sum / count).toFixed(1)), count };
	} catch {
		return { average: 0, count: 0 };
	}
});

export default async function AlumniPage() {
	const opinionSummary = await fetchOpinionsSummary();
	const latest = await fetchLatestSpotlight();
	return (
		<main className="min-h-screen bg-white text-hughes-blue">
			<Hero />

			<section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14 md:py-18">
				<Pillars />
				<NetworkBlock />
				<SpotlightHero spotlight={latest} />
				<SuccessStories />
				<EngageGrid />
				<DirectorsMessage />
				<ClosingStatement />
				<OpinionsSection
					initialAverage={opinionSummary.average}
					initialCount={opinionSummary.count}
					backendBase={process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"}
				/>
			</section>
		</main>
	);
}

function Hero() {
	return (
		<section className="relative overflow-hidden" style={{ background: `linear-gradient(120deg, ${HS_NAVY} 0%, ${HS_BLUE} 55%, ${HS_BLUE_MEDIUM} 100%)` }}>
			<div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(80rem 40rem at 15% 10%, rgba(255,187,0,0.18), transparent 50%), radial-gradient(60rem 30rem at 90% 20%, rgba(255,187,0,0.12), transparent 55%)" }} />
			<div className="mx-auto flex max-w-6xl flex-col gap-7 px-6 py-16 md:py-20 relative text-white">
				<div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase">
					Hughes Schools Alumni
				</div>
				<h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
					Once a Hughes student, always family.
				</h1>
				<p className="max-w-3xl text-base text-white/85 md:text-lg">
					Creators, innovators, scholars, performers, and global citizens who carry forward our values of excellence, discipline, creativity, and community across Bolivia and the world.
				</p>
				<div className="flex flex-wrap items-center gap-3">
					<Link href="/alumni/spotlights" className="btn-hs-primary" aria-label="See all alumni spotlights">
						See Alumni Spotlights
					</Link>
					<Link href="/alumni/spotlights/submit" className="btn-hs-secondary" aria-label="Submit your alumni spotlight">
						Share Your Story
					</Link>
				</div>
				<div className="grid gap-4 text-base md:grid-cols-2 lg:grid-cols-4">
					<StatCard title="Global Impact" body="Alumni thriving across Bolivia, Latin America, North America, and Europe." />
					<StatCard title="Disciplines" body="Arts, science, education, business, technology, and public service." />
					<StatCard title="Mentorship" body="Graduates guiding students through careers, university access, and arts programs." />
					<StatCard title="Legacy" body="Traditions of respect, rigor, creativity, and community since Hughes Schools began." />
				</div>
			</div>
		</section>
	);
}

function StatCard({ title, body }: { title: string; body: string }) {
	return (
		<div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
			<h3 className="text-white font-semibold">{title}</h3>
			<p className="mt-1 text-white/85 text-sm leading-relaxed">{body}</p>
		</div>
	);
}

function Pillars() {
	return (
		<div className="grid gap-6 rounded-3xl border border-[#e6e8f2] bg-[#f9fafc] p-6 shadow-sm md:grid-cols-3">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold md:text-3xl" style={{ color: HS_BLUE }}>
					Alumni Network & Community
				</h2>
				<p className="text-hughes-blue/80 leading-relaxed">
					Connect with fellow graduates, current students, and faculty to mentor, collaborate, and create new opportunities.
				</p>
			</div>
			<div className="space-y-3">
				<h4 className="text-sm font-semibold uppercase tracking-wide text-hughes-blue/70">What moves us</h4>
				<ul className="space-y-2 text-hughes-blue/85">
					<li className="flex gap-2"><Dot /> Global citizenship with local roots</li>
					<li className="flex gap-2"><Dot /> Excellence in arts, sciences, and leadership</li>
					<li className="flex gap-2"><Dot /> Service, mentorship, and community impact</li>
				</ul>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
				<CtaCard
					title="Share your spotlight"
					description="Tell your story to inspire students and fellow alumni."
					href="/alumni/spotlights/submit"
					label="Submit now"
				/>
				<CtaCard
					title="Explore stories"
					description="See how Hughes alumni are shaping their fields."
					href="/alumni/spotlights"
					label="View spotlights"
				/>
			</div>
		</div>
	);
}

function Dot() {
	return <span className="mt-2 inline-block h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} />;
}

function NetworkBlock() {
	return (
		<div className="rounded-2xl border border-[#e6e8f2] bg-[#f9fafc] p-6 shadow-sm">
			<h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>
				Mission of the Alumni Association
			</h3>
			<ul className="mt-4 space-y-2 text-hughes-blue/85">
				{missionPoints.map((item) => (
					<li key={item} className="flex gap-2">
						<span className="mt-1 inline-block h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} />
						<span>{item}</span>
					</li>
				))}
			</ul>
			<p className="mt-4 text-sm text-hughes-blue/70">
				The Alumni Association is committed to cultivating a lifelong relationship between Hughes Schools and its graduates.
			</p>
		</div>
	);
}


function CtaCard({ title, description, href, label }: { title: string; description: string; href: string; label: string }) {
	return (
		<div className="rounded-2xl border border-[#e6e8f2] bg-white p-5 shadow-sm">
			<h4 className="text-lg font-semibold" style={{ color: HS_BLUE }}>
				{title}
			</h4>
			<p className="mt-2 text-sm text-hughes-blue/80">{description}</p>
			<Link
				href={href}
				className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
				style={{ color: HS_BLUE }}
			>
				{label}
				<span aria-hidden className="text-[#9aa4b5]">→</span>
			</Link>
		</div>
	);
}

function SpotlightHero({ spotlight }: { spotlight: Spotlight | null }) {
	const title = "Alumni Spotlights";
	const paragraph = "Celebrate the journeys of our graduates. Share your story to inspire current students and fellow alumni.";

	const fullName = spotlight ? (sAttr<string>(spotlight, "fullname") ?? "Anonymous").trim() : "";
	const city = spotlight ? (sAttr<string>(spotlight, "city") ?? "") : "";
	const university = spotlight ? (sAttr<string>(spotlight, "university") ?? "") : "";
	const profession = spotlight ? (sAttr<string>(spotlight, "profession") ?? "") : "";
	const grad = spotlight ? (sAttr<string>(spotlight, "graduationYear") ?? "") : "";
	const year = grad ? new Date(grad).getFullYear() : undefined;
	const artisticPath = spotlight ? (sAttr<string>(spotlight, "artisticPath") ?? "") : "";
	const biography = spotlight ? (sAttr<string>(spotlight, "biography") ?? "") : "";
	const impact = spotlight ? (sAttr<string>(spotlight, "hughesImpact") ?? "") : "";
	const message = spotlight ? (sAttr<string>(spotlight, "messageForStudents") ?? "") : "";
	const docId = spotlight ? (sAttr<string>(spotlight, "documentId") ?? String((spotlight as { id?: unknown }).id ?? "")) : "";

	return (
		<section className="rounded-3xl border border-[#e6e8f2] bg-gradient-to-br from-[#0b1220] via-[#13203a] to-[#0b1220] px-6 py-10 text-white shadow-sm">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h3 className="text-2xl font-bold">{title}</h3>
					<p className="mt-2 text-white/80 max-w-2xl">{paragraph}</p>
				</div>
				<div className="flex items-center gap-3">
					<Link href="/alumni/spotlights/submit" className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">Submit spotlight →</Link>
					<Link href="/alumni/spotlights" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "#e6e8f2", color: "white" }}>View all →</Link>
				</div>
			</div>
			<div className="mt-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
				<span className="h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} />
				We rise higher together.
			</div>

			{spotlight && (
				<div className="mt-8 space-y-4">
					<div className="rounded-2xl bg-white/05 border border-white/15 text-white p-6">
						<div className="flex items-center justify-between gap-4 flex-wrap">
							<div>
								<div className="text-sm font-semibold tracking-widest uppercase text-white/75">Latest Spotlight</div>
								<h4 className="mt-2 text-2xl font-bold">{fullName}{year ? ` · ${year}` : ""}</h4>
								<p className="mt-2 text-white/80 text-sm">{[city, university, profession].filter(Boolean).join(" · ")}</p>
							</div>
							<Link href={`/alumni/spotlights/${encodeURIComponent(docId)}`} className="text-sm font-semibold underline hover:text-hughes-yellow">
								Read spotlight
							</Link>
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						{artisticPath && (
							<InfoCard label="Career or Artistic Path" value={artisticPath} />
						)}
						{biography && (
							<InfoCard label="Biography" value={biography} />
						)}
						{impact && (
							<InfoCard label="How Hughes Impacted Me" value={impact} />
						)}
						{message && (
							<InfoCard label="Message for Students" value={message} />
						)}
					</div>
				</div>
			)}
		</section>
	);
}

function InfoCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl bg-white/05 border border-white/15 p-4 text-white">
			<div className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</div>
			<div className="mt-2 text-white/90 whitespace-pre-line leading-relaxed">{value}</div>
		</div>
	);
}


function SuccessStories() {
	return (
		<div className="space-y-3">
			<h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>
				Success Stories
			</h3>
			<p className="text-hughes-blue/80">
				Our alumni continue to shine in diverse fields, including:
			</p>
			<ul className="space-y-2 text-hughes-blue/85">
				{successFields.map((item) => (
					<li key={item} className="flex gap-2">
						<span className="mt-1 inline-block h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} />
						<span>{item}</span>
					</li>
				))}
			</ul>
			<p className="text-sm text-hughes-blue/70">
				Their success is a reflection of the strong foundation built at Hughes Schools.
			</p>
		</div>
	);
}

function EngageGrid() {
	return (
		<div className="grid gap-4 md:grid-cols-3">
			<EngageCard
				title="Mentor a student"
				description="Offer guidance on careers, auditions, portfolios, or university access."
				action="Become a mentor"
				href="/contact"
			/>
			<EngageCard
				title="Host a talk"
				description="Share your journey in arts, science, business, tech, or public service."
				action="Schedule a session"
				href="/events"
			/>
			<EngageCard
				title="Support initiatives"
				description="Back scholarships, cultural exchanges, and community projects."
				action="Explore ways to help"
				href="/donation"
			/>
		</div>
	);
}

function EngageCard({ title, description, action, href }: { title: string; description: string; action: string; href: string }) {
	return (
		<div className="rounded-2xl border border-[#e6e8f2] bg-white p-5 shadow-sm">
			<h4 className="text-lg font-semibold" style={{ color: HS_BLUE }}>
				{title}
			</h4>
			<p className="mt-2 text-sm text-hughes-blue/80 leading-relaxed">{description}</p>
			<Link href={href} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: HS_BLUE }}>
				{action}
				<span aria-hidden className="text-[#9aa4b5]">→</span>
			</Link>
		</div>
	);
}

function DirectorsMessage() {
	return (
		<div className="rounded-2xl border border-[#e6e8f2] bg-[#f9fafc] p-6 shadow-sm">
			<h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>
				Message from the Directors
			</h3>
			<p className="mt-3 italic text-hughes-blue/85">
				"To all our beloved alumni: Your achievements inspire us every day. You are the reason Hughes Schools continues to grow with purpose and passion. We are honored to have been part of your educational journey and even more proud to witness the paths you are creating for yourselves and your communities.
				No matter where life takes you, Hughes Schools will always be your home."
			</p>
			<p className="mt-3 font-semibold" style={{ color: HS_BLUE }}>
				— Richard and Dalcy Hughes, Co-Directors
			</p>
		</div>
	);
}

function ClosingStatement() {
	return (
		<div className="space-y-3">
			<h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>
				Closing Statement
			</h3>
			<p className="text-hughes-blue/85">
				The Alumni of Hughes Schools are more than graduates—they are leaders, artists, thinkers, and visionaries who embody the value of education rooted in excellence and culture. We are proud of each of you, and we look forward to celebrating your continued success.
			</p>
		</div>
	);
}

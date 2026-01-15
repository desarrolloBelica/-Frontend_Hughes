import Link from "next/link";
import { cache } from "react";

const HS_YELLOW = "var(--hs-yellow)";
const HS_BLUE = "var(--hs-blue)";

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
	accomplishments?: string;
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

export default async function AlumniPage() {
	const latest = await fetchLatestSpotlight();
	return (
		<main className="min-h-screen bg-white text-hughes-blue">
			<Hero />

			<section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:py-16">
				<IntroBlock />
				<NetworkBlock />
				<SpotlightHero spotlight={latest} />
				<SuccessStories />
				<DirectorsMessage />
				<ClosingStatement />
			</section>
		</main>
	);
}

function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#0b1220] text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,187,0,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,187,0,0.08),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0))]" />
			<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:py-20 relative">
				<div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase">
					Hughes Schools Alumni
				</div>
				<h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
					Welcome, Hughes Schools Alumni
				</h1>
				<p className="max-w-3xl text-base text-white/85 md:text-lg">
					Our alumni are the living legacy of Hughes Schools. They are creators, innovators, scholars, performers, and global citizens who carry forward the values of excellence, discipline, creativity, and community. Whether they pursued the arts, sciences, education, technology, business, or public service, our alumni continue to make an impact in Bolivia and around the world.
				</p>
				<p className="max-w-3xl text-base text-white/80 md:text-lg">
					At Hughes Schools, we are proud to see our graduates thrive in universities, artistic programs, and professional fields—representing the spirit and commitment that define our institution. Once a Hughes student, always a member of the Hughes family.
				</p>
				<div className="h-px w-full bg-white/15" />
				<div className="grid gap-4 text-base md:grid-cols-2 md:text-base lg:grid-cols-4">
					<StatCard title="Global Impact" body="Alumni thriving across Bolivia, Latin America, North America, and Europe." />
					<StatCard title="Disciplines" body="Arts, science, education, business, technology, and public service." />
				</div>
			</div>
		</section>
	);
}

function StatCard({ title, body }: { title: string; body: string }) {
	return (
		<div className="rounded-2xl border border-white/15 bg-white/05 p-4 backdrop-blur">
			<h3 className="text-white font-semibold">{title}</h3>
			<p className="mt-1 text-white/80 text-sm">{body}</p>
		</div>
	);
}

function Separator() {
	return <div className="h-px w-full bg-[#e8ebf3]" />;
}

function IntroBlock() {
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold md:text-3xl" style={{ color: HS_BLUE }}>
				Alumni Network & Community
			</h2>
			<p className="text-hughes-blue/80 leading-relaxed">
				The Hughes Schools Alumni Network connects former students with one another and with current generations of Hughes students. Through this community, alumni receive updates, invitations, and opportunities to participate in school events, mentorships, collaborations, and outreach projects.
			</p>
			<p className="text-hughes-blue/80 leading-relaxed">
				Our alumni continue to contribute to the growth of our school community, sharing their experiences, supporting student aspirations, and modeling leadership rooted in respect and integrity.
			</p>
		</div>
	);
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
	const accomplishments = spotlight ? (sAttr<string>(spotlight, "accomplishments") ?? "") : "";
	const impact = spotlight ? (sAttr<string>(spotlight, "hughesImpact") ?? "") : "";
	const message = spotlight ? (sAttr<string>(spotlight, "messageForStudents") ?? "") : "";
	const docId = spotlight ? (sAttr<string>(spotlight, "documentId") ?? String((spotlight as { id?: unknown }).id ?? "")) : "";

	return (
		<section className="rounded-3xl border border-[#e6e8f2] bg-[#0b1220] px-6 py-10 text-white shadow-sm">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<h3 className="text-2xl font-bold">{title}</h3>
				<div className="flex items-center gap-3">
					<Link href="/alumni/spotlights/submit" className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">Submit your spotlight →</Link>
					<Link href="/alumni/spotlights" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: "#e6e8f2", color: "white" }}>See all spotlights →</Link>
				</div>
			</div>
			<p className="mt-3 text-white/85 max-w-3xl">{paragraph}</p>
			<div className="mt-5 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
				<span className="h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} />
				Once a Hughes student, always family.
			</div>

			{spotlight && (
				<div className="mt-8 space-y-4">
					<div className="rounded-2xl bg-white/05 border border-white/15 text-white p-6">
						<div className="flex items-center justify-between gap-4 flex-wrap">
							<div>
								<div className="text-sm font-semibold tracking-widest uppercase text-white/80">Latest Spotlight</div>
								<h4 className="mt-2 text-2xl font-bold">{fullName}{year ? ` · ${year}` : ""}</h4>
								<p className="mt-2 text-white/80 text-sm">{[city, university, profession].filter(Boolean).join(" · ")}</p>
							</div>
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						{artisticPath && (
							<div className="rounded-xl bg-white/05 border border-white/15 p-4 text-white">
								<div className="text-xs font-semibold uppercase tracking-wider text-white/70">Career or Artistic Path</div>
								<div className="mt-2 text-white/90 whitespace-pre-line">{artisticPath}</div>
							</div>
						)}
						{accomplishments && (
							<div className="rounded-xl bg-white/05 border border-white/15 p-4 text-white">
								<div className="text-xs font-semibold uppercase tracking-wider text-white/70">Proud Accomplishments</div>
								<div className="mt-2 text-white/90 whitespace-pre-line">{accomplishments}</div>
							</div>
						)}
						{impact && (
							<div className="rounded-xl bg-white/05 border border-white/15 p-4 text-white">
								<div className="text-xs font-semibold uppercase tracking-wider text-white/70">How Hughes Schools Impacted Me</div>
								<div className="mt-2 text-white/90 whitespace-pre-line">{impact}</div>
							</div>
						)}
						{message && (
							<div className="rounded-xl bg-white/05 border border-white/15 p-4 text-white">
								<div className="text-xs font-semibold uppercase tracking-wider text-white/70">Message for Current Students</div>
								<div className="mt-2 text-white/90 whitespace-pre-line">{message}</div>
							</div>
						)}
					</div>
				</div>
			)}
		</section>
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

import Link from "next/link";

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

export default function AlumniPage() {
	return (
		<main className="min-h-screen bg-white text-hughes-blue">
			<Hero />

			<section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:py-16">
				<IntroBlock />
				<Separator />
				<NetworkBlock />
				<Separator />
				<MissionBlock />
				<Separator />
				<CallToAction />
				<Separator />
				<SpotlightTemplate />
				<Separator />
				<SuccessStories />
				<Separator />
				<DirectorsMessage />
				<Separator />
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
				<div className="grid gap-4 text-sm md:grid-cols-2 md:text-base">
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

function MissionBlock() {
	return (
		<div className="space-y-3">
			<h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>
				Stay Connected
			</h3>
			<p className="text-hughes-blue/85">
				We invite all alumni to stay in touch and share their updates with us.
			</p>
			<div className="grid gap-4 md:grid-cols-3">
				<CtaCard title="Update Your Information" description="Help us keep you informed about events and opportunities." href="#" label="Update" />
				<CtaCard title="Join the Alumni Directory" description="Connect with classmates and expand your professional network." href="#" label="Join" />
				<CtaCard title="Share Your Story" description="Send achievements, photos, career highlights, or artistic work." href="mailto:alumni@hughesschools.org" label="Email us" />
			</div>
			<p className="text-sm text-hughes-blue/70">
				Your story may be featured on our website or social media.
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

function CallToAction() {
	return (
		<div className="rounded-2xl border border-[#e6e8f2] bg-[#0b1220] px-6 py-8 text-white shadow-sm">
			<h3 className="text-xl font-bold">Alumni Spotlights</h3>
			<p className="mt-2 text-white/80">
				Celebrate the journeys of our graduates. Share your story to inspire current students and fellow alumni.
			</p>
			<div className="mt-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
				<span className="h-2 w-2 rounded-full" style={{ background: HS_YELLOW }} />
				Once a Hughes student, always family.
			</div>
		</div>
	);
}

function SpotlightTemplate() {
	const fields = [
		"Name",
		"Graduation Year",
		"Current City/University/Profession",
		"Career or Artistic Path",
		"Proud Accomplishments",
		"How Hughes Schools Impacted Me",
		"Message for Current Students",
	];

	return (
		<div className="rounded-2xl border border-[#e6e8f2] bg-white p-6 shadow-sm">
			<h3 className="text-xl font-bold" style={{ color: HS_BLUE }}>
				Alumni Spotlight Template
			</h3>
			<p className="mt-2 text-sm text-hughes-blue/75">
				Use this template to share future spotlight stories.
			</p>
			<div className="mt-4 grid gap-3 md:grid-cols-2">
				{fields.map((f) => (
					<div key={f} className="rounded-xl border border-[#eef1f6] bg-[#f9fafc] px-4 py-3 text-sm font-semibold text-hughes-blue">
						{f}
					</div>
				))}
			</div>
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

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const STAR_SCALE = [1, 2, 3, 4, 5];

function StarMeter({ value, sizeClass = "text-2xl" }: { value: number; sizeClass?: string }) {
	const safe = Math.max(0, Math.min(5, value));
	const width = (safe / 5) * 100;
	return (
		<div className={`relative inline-flex leading-none ${sizeClass}`} aria-label={`Average ${safe.toFixed(1)} out of 5 stars`}>
			<div className="text-gray-300">★★★★★</div>
			<div className="absolute inset-0 overflow-hidden" style={{ width: `${width}%` }}>
				<div className="text-yellow-500">★★★★★</div>
			</div>
		</div>
	);
}

export default function OpinionsSection({
	initialAverage,
	initialCount,
	backendBase,
}: {
	initialAverage: number;
	initialCount: number;
	backendBase: string;
}) {
	const [open, setOpen] = useState(false);
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [summary, setSummary] = useState({ average: initialAverage ?? 0, count: initialCount ?? 0 });
	const searchParams = useSearchParams();

	useEffect(() => {
		setSummary({ average: initialAverage ?? 0, count: initialCount ?? 0 });
	}, [initialAverage, initialCount]);

	useEffect(() => {
		if (searchParams?.get("opinion") === "1") {
			setOpen(true);
		}
	}, [searchParams]);

	const clampedRating = useMemo(() => Math.max(0, Math.min(5, rating)), [rating]);

	const refreshSummary = async () => {
		try {
			const qs = new URLSearchParams();
			qs.set("filters[approved][$eq]", "true");
			qs.set("pagination[page]", "1");
			qs.set("pagination[pageSize]", "200");
			qs.set("sort[0]", "createdAt:desc");
			const res = await fetch(`${backendBase}/api/opinions?${qs.toString()}`, { cache: "no-store" });
			if (!res.ok) return;
			const json = await res.json();
			const rows = Array.isArray(json) ? json : json?.data ?? [];
			const approved = rows.filter((row: any) => Boolean(row?.approved ?? row?.attributes?.approved));
			const count = approved.length;
			if (!count) {
				setSummary({ average: 0, count: 0 });
				return;
			}
			const sum = approved.reduce(
				(acc: number, row: any) => acc + Number(row?.rateStars ?? row?.attributes?.rateStars ?? 0),
				0,
			);
			setSummary({ average: Number((sum / count).toFixed(1)), count });
		} catch {
			// silent
		}
	};

	const handleSubmit = async () => {
		setError(null);
		setMessage(null);
		if (!clampedRating) {
			setError("Select a star rating.");
			return;
		}
		if (!comment.trim()) {
			setError("Add a short comment.");
			return;
		}
		setSubmitting(true);
		try {
			const res = await fetch(`${backendBase}/api/opinions`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ data: { rateStars: clampedRating, comment: comment.trim(), approved: false } }),
			});
			if (!res.ok) {
				throw new Error("We could not submit your opinion.");
			}
			setMessage("Thanks. We will review your opinion before publishing.");
			setRating(0);
			setHover(0);
			setComment("");
			setOpen(false);
			await refreshSummary();
		} catch (err) {
			setError((err as Error).message ?? "Something went wrong.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section
			id="opinions"
			className="relative mt-10 overflow-hidden rounded-3xl border border-[#d8deed] p-6 shadow-lg"
			style={{
				background: "linear-gradient(135deg, var(--hs-bluenavy) 0%, var(--hs-blue-darker) 55%, #0b1220 100%)",
				color: "white",
			}}
		>
			<div className="pointer-events-none absolute inset-0 opacity-25" style={{ background: "radial-gradient(120% 80% at 15% 10%, rgba(255,187,0,0.35), transparent 50%), radial-gradient(80% 60% at 85% 20%, rgba(255,255,255,0.18), transparent 55%)" }} />
			<div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
						Opinions
					</div>
					<h3 className="text-2xl font-bold text-white">What the community thinks</h3>
					<p className="max-w-2xl text-sm text-white/85">Average rating based on constructive opinions shared by families and alumni.</p>
				</div>
				<div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 text-center shadow-sm backdrop-blur">
					<div className="flex flex-col items-center gap-1">
						<StarMeter value={summary.average} sizeClass="text-3xl" />
						<div className="text-sm font-semibold text-white">{summary.average.toFixed(1)} / 5</div>
						<div className="text-xs uppercase tracking-wide text-white/70">Average rating</div>
					</div>
					<div className="flex flex-col items-center gap-1">
						<div className="text-3xl font-bold text-white">{summary.count}</div>
						<div className="text-xs uppercase tracking-wide text-white/70">Opinions</div>
					</div>
				</div>
			</div>

			<div className="relative mt-5 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="btn-hs-primary"
				>
					Leave an opinion
				</button>
				<Link
					href="/alumni/opinions"
					className="btn-hs-secondary"
				>
					View all opinions
				</Link>
			</div>

			<div className="relative mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/90 shadow-sm backdrop-blur">
				<p className="font-semibold text-white">Moderation and publishing criteria</p>
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

			{message && (
				<div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
					{message}
				</div>
			)}
			{error && (
				<div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
					{error}
				</div>
			)}

			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
					<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
						<div className="flex items-start justify-between gap-3">
							<div>
								<h4 className="text-lg font-semibold text-hughes-blue">Leave your opinion</h4>
								<p className="text-sm text-hughes-blue/70">Opinions are reviewed before publishing.</p>
							</div>
							<button
								type="button"
								onClick={() => {
									setOpen(false);
									setError(null);
									setMessage(null);
								}}
								className="text-hughes-blue/60 hover:text-hughes-blue"
								aria-label="Close"
							>
								x
							</button>
						</div>

							<div className="mt-4 space-y-3">
							<div>
									<p className="text-sm font-semibold text-hughes-blue">Rating</p>
								<div className="mt-2 flex items-center gap-2">
									{STAR_SCALE.map((value) => {
										const filled = value <= (hover || clampedRating);
										return (
											<button
												key={value}
												type="button"
												onMouseEnter={() => setHover(value)}
												onMouseLeave={() => setHover(0)}
												onClick={() => setRating(value)}
												className="text-2xl"
												aria-label={`${value} stars`}
											>
												<span className={filled ? "text-yellow-500" : "text-gray-300"}>★</span>
											</button>
										);
									})}
								</div>
							</div>

								<div>
									<p className="text-sm font-semibold text-hughes-blue">Comment</p>
								<textarea
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									rows={4}
									className="mt-2 w-full rounded-lg border border-[#e0e4ef] bg-white px-3 py-2 text-sm text-hughes-blue focus:border-hughes-blue focus:outline-none"
									placeholder="Share your experience in a respectful and constructive way."
								/>
								<p className="mt-2 text-xs text-hughes-blue/60">
									Avoid personal data or full names of others. Constructive opinions help the most.
								</p>
							</div>

							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={handleSubmit}
									disabled={submitting}
									className="btn-hs-primary disabled:opacity-70"
								>
									{submitting ? "Sending..." : "Submit opinion"}
								</button>
								<button
									type="button"
									onClick={() => setOpen(false)}
									className="btn-hs-secondary"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

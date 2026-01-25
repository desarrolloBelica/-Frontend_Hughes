"use client";

import Link from "next/link";

export default function TheaterPage() {
	return (
		<main className="min-h-screen flex items-center justify-center section-gradient-soft py-20">
			<div className="mx-auto max-w-2xl px-6 text-center space-y-6">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/Logo%20Transparente.png"
					alt="Hughes Schools logo"
					className="mx-auto w-56 md:w-72 object-contain drop-shadow-sm"
				/>
				<h1 className="text-3xl md:text-4xl font-extrabold text-hughes-blue">
					We are working on it
				</h1>
				<p className="text-hughes-blue/80">
					This page is under construction. Please check back soon.
				</p>
				<div className="pt-2">
					<Link
						href="/arts/artprograms"
						className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:bg-hughes-blue hover:text-white"
						style={{
							background: "var(--hs-yellow)",
							borderColor: "var(--hs-yellow)",
							color: "var(--hs-blue)",
							borderWidth: 1,
							borderStyle: "solid",
						}}
						aria-label="Back to Art Programs"
					>
						Back to Art Programs
					</Link>
				</div>
			</div>
		</main>
	);
}


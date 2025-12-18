"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Mail, Home } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Confirmar el pago en el backend
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/confirm?session_id=${sessionId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Donation confirmed:", data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error confirming donation:", error);
          setLoading(false);
        });
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div
            className="inline-flex p-6 rounded-full mb-6"
            style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND.blue }}>
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your generous gift has been received successfully
          </p>

          {/* Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="font-bold mb-4" style={{ color: BRAND.blue }}>
              What Happens Next:
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.yellow }} />
                <span>You&apos;ll receive a confirmation email with your donation receipt</span>
              </li>
              <li className="flex items-start gap-3">
                <Download className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.yellow }} />
                <span>Your tax-deductible receipt will be sent within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.yellow }} />
                <span>Your gift is already making a difference in students&apos; lives</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: BRAND.blue,
                color: "white",
              }}
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
            <Link
              href="/donation"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-105"
              style={{
                borderColor: BRAND.blue,
                color: BRAND.blue,
              }}
            >
              Make Another Gift
            </Link>
          </div>

          {/* Session ID for reference */}
          {sessionId && (
            <p className="text-xs text-gray-400 mt-8">
              Reference: {sessionId}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}

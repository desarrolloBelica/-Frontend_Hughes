"use client";

import { useState } from "react";
import Image from "next/image";
import {
  GraduationCap,
  Plane,
  Users,
  BookOpen,
  Award,
  Heart,
  CheckCircle2,
  Building2,
  Receipt,
  TrendingUp,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

const HERO_IMAGE = "/38.JPG";
const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

type DonationDesignation = 
  | "Student Application Fund"
  | "Teacher Development & Training"
  | "Travel & Cultural Exchange Fund";

type TributeType = "honor" | "memory" | "none";

interface DonorInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export default function DonationPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <WhyWeGive />
      <DonationWidget />
      <ImpactStories />
      <MatchingChallenge />
      <Stewardship />
    </main>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="relative isolate overflow-hidden h-[70vh] min-h-[500px]">
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMAGE}
          alt="Students and teachers preparing for travel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="max-w-3xl text-white">
            <div className="mb-4 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: BRAND.yellow }}
              />
              <span className="text-xs tracking-[0.2em] font-semibold">
                HUGHES SCHOOLS FOUNDATION (501c3)
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Your Gift Opens Doors to the World
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-white/90 leading-relaxed">
              Support students and teachers as they chase their dreams of higher 
              education abroad.
            </p>

            <button
              onClick={() => {
                const el = document.getElementById("donate-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
              style={{
                backgroundColor: BRAND.yellow,
                color: BRAND.blue,
              }}
            >
              Donate Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Why We Give Section
function WhyWeGive() {
  const stats = [
    { icon: <GraduationCap className="w-8 h-8" />, label: "Application Fees", value: "85%" },
    { icon: <Plane className="w-8 h-8" />, label: "Travel Costs", value: "70%" },
    { icon: <Users className="w-8 h-8" />, label: "Teacher Development", value: "60%" },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.blue }}>
              Why We Give
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At <strong>Hughes Schools Foundation (501c3)</strong>, over <strong>70%</strong> of 
              our students and teachers rely on financial support to apply for universities, pay visa 
              fees, and travel abroad.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your gift ensures these dreams can become reality, opening doors to world-class education 
              and transformative experiences that shape the next generation of global leaders.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-white shadow-lg border border-gray-100"
              >
                <div
                  className="inline-flex p-4 rounded-full mb-4"
                  style={{ backgroundColor: "rgba(var(--hs-blue-rgb), 0.1)" }}
                >
                  <div style={{ color: BRAND.blue }}>{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: BRAND.blue }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Donation Widget - Complete Form
function DonationWidget() {
  const [designation, setDesignation] = useState<DonationDesignation>("Student Application Fund");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<string>("150");
  const [tributeType, setTributeType] = useState<TributeType>("none");
  const [tributeName, setTributeName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const presets = ["50", "150", "500", "1000"];

  const designationDescriptions = {
    "Student Application Fund": "Help cover application fees and documentation costs",
    "Teacher Development & Training": "Support professional development and training abroad",
    "Travel & Cultural Exchange Fund": "Fund airfare and travel for transformative experiences",
  };

  function formatAmount(v: string) {
    const digits = v.replace(/[^\d]/g, "");
    return digits.replace(/^0+/, "") || "0";
  }

  async function handleDonation() {
    // Validación
    if (!donorInfo.firstName || !donorInfo.lastName || !donorInfo.email) {
      alert("Please fill in all required fields");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    setIsProcessing(true);

    try {
      // 🔄 TEMPORAL: Usando controller de Strapi
      // TODO: En producción, cambiar a webhook (ver /api/donations/webhook/route.ts)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          frecuency: frequency, // Nota: el backend usa "frecuency"
          donationDestiny: designation,
          donator: {
            firstName: donorInfo.firstName,
            lastName: donorInfo.lastName,
            email: donorInfo.email,
            phone: donorInfo.phone,
            address: donorInfo.address,
            city: donorInfo.city,
          },
          comments: tributeType !== "none" 
            ? `${tributeType === "honor" ? "In Honor Of" : "In Memory Of"}: ${tributeName}`
            : "",
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setIsProcessing(false);
        return;
      }

      // Redirigir a Stripe Checkout usando la URL que retorna Stripe
      if (data.stripeSession?.url) {
        window.location.href = data.stripeSession.url as string;
        return;
      }

      // Fallback: construir URL si solo viene el sessionId (Stripe removió redirectToCheckout)
      if (data.stripeSession?.id) {
        window.location.href = `https://checkout.stripe.com/c/pay/${data.stripeSession.id}`;
        return;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  }

  return (
    <section id="donate-section" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND.blue }}>
            Make Your Gift Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose how you&apos;d like to support our students and teachers
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12">
          {/* Gift Designation */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4" style={{ color: BRAND.blue }}>
              Choose Your Gift Designation
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {(["Student Application Fund", "Teacher Development & Training", "Travel & Cultural Exchange Fund"] as DonationDesignation[]).map((des) => (
                <button
                  key={des}
                  onClick={() => setDesignation(des)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    designation === des
                      ? "border-[var(--hs-blue)] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold mb-1" style={{ color: BRAND.blue }}>
                    {des}
                  </div>
                  <div className="text-sm text-gray-600">
                    {designationDescriptions[des]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4" style={{ color: BRAND.blue }}>
              Gift Frequency
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setFrequency("once")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  frequency === "once"
                    ? "bg-[var(--hs-yellow)] text-[var(--hs-blue)]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setFrequency("monthly")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  frequency === "monthly"
                    ? "bg-[var(--hs-yellow)] text-[var(--hs-blue)]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4" style={{ color: BRAND.blue }}>
              Donation Amount
            </label>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                    amount === preset
                      ? "bg-[var(--hs-blue)] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ${preset}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                <span className="text-gray-600 font-semibold">$</span>
                <input
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(formatAmount(e.target.value))}
                  className="w-full bg-transparent outline-none font-semibold"
                  style={{ color: BRAND.blue }}
                  placeholder="Other"
                />
              </div>
            </div>
          </div>

          {/* Donor Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND.blue }}>
              Your Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                value={donorInfo.firstName}
                onChange={(e) => setDonorInfo({ ...donorInfo, firstName: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--hs-blue)] outline-none"
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={donorInfo.lastName}
                onChange={(e) => setDonorInfo({ ...donorInfo, lastName: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--hs-blue)] outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={donorInfo.email}
                onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--hs-blue)] outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={donorInfo.phone}
                onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--hs-blue)] outline-none"
              />
              <input
                type="text"
                placeholder="Address *"
                value={donorInfo.address}
                onChange={(e) => setDonorInfo({ ...donorInfo, address: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--hs-blue)] outline-none"
                required
              />
              <input
                type="text"
                placeholder="City *"
                value={donorInfo.city}
                onChange={(e) => setDonorInfo({ ...donorInfo, city: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--hs-blue)] outline-none"
                required
              />
            </div>
          </div>

          {/* Tribute Gift */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND.blue }}>
              Tribute Gift (Optional)
            </h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setTributeType("none")}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  tributeType === "none"
                    ? "bg-[var(--hs-blue)] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                No Tribute
              </button>
              <button
                onClick={() => setTributeType("honor")}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  tributeType === "honor"
                    ? "bg-[var(--hs-blue)] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                In Honor Of
              </button>
              <button
                onClick={() => setTributeType("memory")}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  tributeType === "memory"
                    ? "bg-[var(--hs-blue)] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                In Memory Of
              </button>
            </div>
            {tributeType !== "none" && (
              <input
                type="text"
                placeholder="Name"
                value={tributeName}
                onChange={(e) => setTributeName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--hs-blue)] outline-none"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleDonation}
            disabled={isProcessing}
            className="w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              backgroundColor: BRAND.yellow,
              color: BRAND.blue,
            }}
          >
            {isProcessing ? "Processing..." : `Complete Donation - $${Number(amount || 0).toLocaleString()}`}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Secure payment processed by Stripe. Tax-deductible under 501(c)(3).
          </p>
        </div>
      </div>
    </section>
  );
}

// Impact Stories
function ImpactStories() {
  const stories = [
    {
      name: "María González",
      role: "Class of 2024",
      quote: "Thanks to Hughes help, I'll apply to university in the U.S. and pursue my dream of studying engineering.",
      image: "/38.JPG",
    },
    {
      name: "Prof. Carlos Mendoza",
      role: "Science Teacher",
      quote: "Your gift helped me attend a training workshop abroad, bringing cutting-edge techniques back to our students.",
      image: "/38.JPG",
    },
    {
      name: "Ana Rodríguez",
      role: "Class of 2023",
      quote: "The travel fund made it possible for me to visit universities and find the perfect fit for my future.",
      image: "/38.JPG",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND.blue }}>
            Meet Our Scholars
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from students and teachers whose lives have been transformed
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <blockquote className="text-gray-700 italic mb-4">
                  &quot;{story.quote}&quot;
                </blockquote>
                <div>
                  <div className="font-bold" style={{ color: BRAND.blue }}>
                    {story.name}
                  </div>
                  <div className="text-sm text-gray-600">{story.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="text-[var(--hs-blue)] font-semibold hover:underline">
            Read More Stories →
          </button>
        </div>
      </div>
    </section>
  );
}

// Matching Challenge
function MatchingChallenge() {
  const currentAmount = 45000;
  const goalAmount = 100000;
  const percentage = (currentAmount / goalAmount) * 100;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-blue-900 font-bold mb-4">
            <TrendingUp className="w-5 h-5" />
            MATCHING CHALLENGE
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Double Your Impact!
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            A generous sponsor will match your donation 1:1 to help us reach our goal 
            of $100,000 for travel scholarships
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold">${currentAmount.toLocaleString()}</span>
            <span className="text-2xl font-bold">${goalAmount.toLocaleString()}</span>
          </div>
          <div className="h-6 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-center mt-4 text-white/90">
            {percentage.toFixed(0)}% to our goal
          </p>
        </div>
      </div>
    </section>
  );
}


// Stewardship & Transparency
function Stewardship() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND.blue }}>
            Stewardship & Transparency
          </h2>
          <p className="text-xl text-gray-600">
            Your trust matters. See how we steward every gift.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.yellow }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.blue }}>
              Annual Impact Report
            </h3>
            <p className="text-gray-600 mb-4">
              Detailed breakdown of how every dollar makes a difference
            </p>
            <button className="text-[var(--hs-blue)] font-semibold hover:underline">
              Download Report →
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.yellow }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.blue }}>
              Board of Directors
            </h3>
            <p className="text-gray-600 mb-4">
              Meet the dedicated leaders guiding our mission
            </p>
            <button className="text-[var(--hs-blue)] font-semibold hover:underline">
              Learn More →
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.yellow }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.blue }}>
              Contact Us
            </h3>
            <p className="text-gray-600 mb-4">
              Development Office / Foundation Team
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                donations@hughesschools.edu
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                +591 4 123 4567
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border-2 border-[var(--hs-yellow)]">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 flex-shrink-0" style={{ color: BRAND.yellow }} />
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.blue }}>
                Legal & Nonprofit Information
              </h3>
              <p className="text-gray-600">
                <strong>EIN:</strong> 12-3456789<br />
                <strong>Status:</strong> 501(c)(3) Tax-Exempt Organization<br />
                <strong>Disclaimer:</strong> Hughes Schools Foundation is a registered nonprofit. 
                All donations are tax-deductible to the fullest extent allowed by law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

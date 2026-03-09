"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  Plane,
  Users,
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
  HeartHandshake,
  Link,
  CreditCard,
  QrCode,
  X,
  Download,
  AlertCircle
} from "lucide-react";

const HERO_IMAGE = "/38.JPG";

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
    <main className="min-h-screen bg-hs-bluenavy">
      <Hero />
      <WhyWeGive />
      <DonationWidget />
      <ImpactStories />
      <Stewardship />
    </main>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-[85vh] flex items-center bg-hs-yellow rounded-b-[40px] shadow-2xl z-20">
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMAGE}
          alt="Students and teachers preparing for travel"
          fill
          className="object-cover"
          priority
        />
        {/* Superposición fuerte Navy para que resalte el texto amarillo */}
        <div className="absolute inset-0 bg-hs-bluenavy/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-hs-bluenavy via-hs-bluenavy/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 w-full py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-hs-yellow bg-hs-yellow/10 px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase text-hs-yellow shadow-lg mb-6">
            <HeartHandshake className="w-4 h-4" />
            HUGHES SCHOOLS FOUNDATION (501c3)
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-white mb-6 drop-shadow-xl">
            Your Gift Opens <br/>
            <span className="text-hs-yellow">Doors to the World</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white font-medium opacity-90 leading-relaxed mb-10 max-w-2xl">
            Support our students and teachers as they chase their dreams of higher education abroad and transformative cultural exchanges.
          </p>

          <button
            onClick={() => {
              const el = document.getElementById("donate-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-extrabold text-xl transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(255,187,0,0.3)] bg-hs-yellow text-hs-bluenavy hover:bg-white"
          >
            Donate Now
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

// Why We Give Section
function WhyWeGive() {
  const stats = [
    { icon: <GraduationCap className="w-10 h-10" />, label: "Application Fees", value: "85%" },
    { icon: <Plane className="w-10 h-10" />, label: "Travel Costs", value: "70%" },
    { icon: <Users className="w-10 h-10" />, label: "Teacher Development", value: "60%" },
  ];

  return (
    <section className="py-20 md:py-32 bg-hs-bluenavy relative z-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-hs-yellow leading-tight">
              Why We Give
            </h2>
            <p className="text-lg md:text-xl text-white opacity-90 font-medium leading-relaxed">
              At <strong>Hughes Schools Foundation (501c3)</strong>, over <strong>70%</strong> of 
              our students and teachers rely on financial support to apply for universities, pay visa 
              fees, and travel abroad.
            </p>
            <p className="text-lg md:text-xl text-white opacity-90 font-medium leading-relaxed">
              Your gift ensures these dreams can become reality, opening doors to world-class education 
              and transformative experiences that shape the next generation of global leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-3xl bg-white/5 border-2 border-white/10 shadow-xl backdrop-blur-md hover:border-hs-yellow transition-all hover:-translate-y-2 group"
              >
                <div className="inline-flex p-4 rounded-2xl bg-hs-yellow/10 border border-hs-yellow/30 text-hs-yellow mb-6 group-hover:bg-hs-yellow group-hover:text-hs-bluenavy transition-colors">
                  {stat.icon}
                </div>
                <div className="text-4xl font-extrabold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-hs-yellow opacity-90">
                  {stat.label}
                </div>
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
  const router = useRouter();
  const [designation, setDesignation] = useState<DonationDesignation>("Student Application Fund");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<string>("150");
  const [tributeType, setTributeType] = useState<TributeType>("none");
  const [tributeName, setTributeName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCardUnavailable, setShowCardUnavailable] = useState(false);
  
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          frecuency: frequency,
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

      if (data.stripeSession?.url) {
        window.location.href = data.stripeSession.url as string;
        return;
      }

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

  function handleCardPayment() {
    setShowCardUnavailable(true);
    setTimeout(() => setShowCardUnavailable(false), 3000);
  }

  function handleQRDownload() {
    const link = document.createElement('a');
    link.href = '/QR.jpeg';
    link.download = 'Hughes-Schools-Donation-QR.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleDonationCompleted() {
    router.push('/donation/success');
  }

  return (
    <section id="donate-section" className="py-20 md:py-32 bg-hs-yellow text-hs-bluenavy">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Make Your Gift Today
          </h2>
          <p className="text-xl md:text-2xl font-bold opacity-80 max-w-3xl mx-auto">
            Choose how you&apos;d like to support our students and teachers
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl border-4 border-hs-bluenavy p-8 md:p-14">
          
          {/* Gift Designation */}
          <div className="mb-10">
            <label className="block text-xl font-extrabold mb-6 uppercase tracking-widest">
              Choose Your Gift Designation
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {(["Student Application Fund", "Teacher Development & Training", "Travel & Cultural Exchange Fund"] as DonationDesignation[]).map((des) => (
                <button
                  key={des}
                  onClick={() => setDesignation(des)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col justify-between ${
                    designation === des
                      ? "border-hs-bluenavy bg-hs-bluenavy text-white shadow-lg scale-105"
                      : "border-gray-200 bg-gray-50 hover:border-hs-bluenavy/50 text-hs-bluenavy"
                  }`}
                >
                  <div className="font-extrabold text-lg mb-3 leading-snug">
                    {des}
                  </div>
                  <div className={`text-sm font-medium ${designation === des ? 'text-white/80' : 'text-gray-500'}`}>
                    {designationDescriptions[des]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* Frequency */}
            <div>
              <label className="block text-xl font-extrabold mb-6 uppercase tracking-widest">
                Gift Frequency
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFrequency("once")}
                  className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-lg transition-all border-2 ${
                    frequency === "once"
                      ? "bg-hs-yellow border-hs-yellow text-hs-bluenavy shadow-md"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  One-Time
                </button>
                <button
                  onClick={() => setFrequency("monthly")}
                  className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-lg transition-all border-2 ${
                    frequency === "monthly"
                      ? "bg-hs-yellow border-hs-yellow text-hs-bluenavy shadow-md"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xl font-extrabold mb-6 uppercase tracking-widest">
                Donation Amount
              </label>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`py-3 px-2 rounded-xl font-extrabold text-lg transition-all border-2 ${
                      amount === preset
                        ? "bg-hs-bluenavy border-hs-bluenavy text-white shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 focus-within:border-hs-bluenavy transition-colors">
                <span className="text-gray-500 font-extrabold text-xl">$</span>
                <input
                  inputMode="numeric"
                  value={presets.includes(amount) ? "" : amount}
                  onChange={(e) => setAmount(formatAmount(e.target.value))}
                  className="w-full bg-transparent outline-none font-extrabold text-2xl text-hs-bluenavy"
                  placeholder="Other Amount"
                />
              </div>
            </div>
          </div>

          {/* Total Display */}
          <div className="p-8 rounded-3xl bg-hs-bluenavy/5 border-4 border-hs-bluenavy/10 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xl font-extrabold uppercase tracking-widest opacity-80">
                Your {frequency === "monthly" ? "Monthly" : "One-Time"} Donation:
              </span>
              <span className="text-5xl font-extrabold text-hs-bluenavy">
                ${Number(amount || 0).toLocaleString()}
              </span>
            </div>
            {frequency === "monthly" && (
              <p className="text-base font-bold text-hs-bluenavy/60 mt-2 sm:text-right">
                Annual impact: ${(Number(amount || 0) * 12).toLocaleString()}
              </p>
            )}
          </div>

          {/* Donor Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-extrabold mb-6 border-b-2 border-gray-100 pb-4">
              Your Information
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="First Name *"
                value={donorInfo.firstName}
                onChange={(e) => setDonorInfo({ ...donorInfo, firstName: e.target.value })}
                className="px-5 py-4 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-hs-yellow focus:bg-white outline-none font-medium transition-all"
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={donorInfo.lastName}
                onChange={(e) => setDonorInfo({ ...donorInfo, lastName: e.target.value })}
                className="px-5 py-4 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-hs-yellow focus:bg-white outline-none font-medium transition-all"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={donorInfo.email}
                onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                className="px-5 py-4 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-hs-yellow focus:bg-white outline-none font-medium transition-all"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={donorInfo.phone}
                onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                className="px-5 py-4 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-hs-yellow focus:bg-white outline-none font-medium transition-all"
              />
              <input
                type="text"
                placeholder="Address *"
                value={donorInfo.address}
                onChange={(e) => setDonorInfo({ ...donorInfo, address: e.target.value })}
                className="px-5 py-4 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-hs-yellow focus:bg-white outline-none font-medium transition-all md:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="City *"
                value={donorInfo.city}
                onChange={(e) => setDonorInfo({ ...donorInfo, city: e.target.value })}
                className="px-5 py-4 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-hs-yellow focus:bg-white outline-none font-medium transition-all"
                required
              />
            </div>
          </div>

          {/* Tribute Gift */}
          <div className="mb-10">
            <h3 className="text-2xl font-extrabold mb-6 border-b-2 border-gray-100 pb-4">
              Tribute Gift (Optional)
            </h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setTributeType("none")}
                className={`py-3 px-6 rounded-xl font-bold transition-all border-2 ${
                  tributeType === "none"
                    ? "bg-hs-bluenavy border-hs-bluenavy text-white shadow-md"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                No Tribute
              </button>
              <button
                onClick={() => setTributeType("honor")}
                className={`py-3 px-6 rounded-xl font-bold transition-all border-2 ${
                  tributeType === "honor"
                    ? "bg-hs-bluenavy border-hs-bluenavy text-white shadow-md"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                In Honor Of
              </button>
              <button
                onClick={() => setTributeType("memory")}
                className={`py-3 px-6 rounded-xl font-bold transition-all border-2 ${
                  tributeType === "memory"
                    ? "bg-hs-bluenavy border-hs-bluenavy text-white shadow-md"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                In Memory Of
              </button>
            </div>
            {tributeType !== "none" && (
              <input
                type="text"
                placeholder="Name of the person"
                value={tributeName}
                onChange={(e) => setTributeName(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-hs-yellow focus:bg-white outline-none font-medium transition-all"
              />
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-8 border-t-2 border-gray-100">
            {/* Card Unavailable Message */}
            {showCardUnavailable && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-red-600 font-bold">Card payment method is currently unavailable. Please use QR donation.</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Card Payment Button - Disabled */}
              <button
                onClick={handleCardPayment}
                className="w-full py-5 px-8 rounded-full font-extrabold text-xl transition-all duration-300 opacity-50 cursor-not-allowed bg-gray-300 text-gray-600 border-4 border-gray-300 flex items-center justify-center gap-3"
              >
                <CreditCard className="w-6 h-6" />
                Donate with Card
              </button>
              
              {/* QR Payment Button */}
              <button
                onClick={() => setShowQRModal(true)}
                className="w-full py-5 px-8 rounded-full font-extrabold text-xl transition-all duration-300 hover:scale-105 shadow-[0_10px_40px_rgba(255,187,0,0.4)] bg-hs-yellow text-hs-bluenavy hover:bg-hs-bluenavy hover:text-hs-yellow border-4 border-hs-yellow flex items-center justify-center gap-3"
              >
                <QrCode className="w-6 h-6" />
                Donate with QR
              </button>
            </div>
            
            <p className="text-sm font-bold text-gray-400 text-center mt-6 uppercase tracking-widest">
              Secure payment. <br className="sm:hidden"/> Tax-deductible under 501(c)(3).
            </p>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-extrabold text-hs-bluenavy mb-2">
                Scan to Donate
              </h3>
              <p className="text-gray-600 font-medium mb-6">
                Use your phone camera or banking app to scan this QR code
              </p>
              
              {/* QR Image */}
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden border-4 border-hs-bluenavy shadow-lg">
                <Image
                  src="/QR.jpeg"
                  alt="Donation QR Code"
                  fill
                  className="object-contain p-2"
                />
              </div>
              
              {/* Amount Reminder */}
              <div className="p-4 rounded-xl bg-hs-yellow/20 border-2 border-hs-yellow mb-6">
                <p className="text-hs-bluenavy font-bold">
                  Your donation amount: <span className="text-2xl">${Number(amount || 0).toLocaleString()}</span>
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleQRDownload}
                  className="flex-1 py-4 px-6 rounded-full font-bold text-lg transition-all hover:scale-105 bg-gray-100 text-hs-bluenavy hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download QR
                </button>
                <button
                  onClick={handleDonationCompleted}
                  className="flex-1 py-4 px-6 rounded-full font-bold text-lg transition-all hover:scale-105 bg-hs-bluenavy text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy border-2 border-hs-bluenavy flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Donation Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Impact Stories
function ImpactStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        
        const attempts = [
          `${base}/api/donation-stories?populate[representativeImages]=*&populate[student]=*&pagination[pageSize]=3&sort[0]=testimonialDate:desc`,
          `${base}/api/donation-stories?populate[representativeImages]=true&populate[student]=true&pagination[pageSize]=3`,
          `${base}/api/donation-stories?populate=*&pagination[pageSize]=3`,
          `${base}/api/donation-stories?pagination[pageSize]=3`,
        ];

        let data = null;
        for (const url of attempts) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const json = await res.json();
            data = Array.isArray(json) ? json : (json.data ?? []);
            if (data) break;
          } catch {
            continue;
          }
        }

        if (data) {
          setStories(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load donation stories:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getImageUrl(story: any): string {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    const images = story.representativeImages?.data ?? story.representativeImages ?? [];
    const first = Array.isArray(images) ? images[0] : images;
    if (!first) return "/38.JPG";
    const url = first.url ?? first.attributes?.url;
    if (!url) return "/38.JPG";
    return url.startsWith("http") ? url : `${base}${url}`;
  }

  function getStudentName(story: any): string {
    const student = story.student?.data ?? story.student;
    if (!student) return "Anonymous";
    const firstName = student.firstName ?? student.attributes?.firstName ?? "";
    const lastName = student.lastName ?? student.attributes?.lastName ?? "";
    return `${firstName} ${lastName}`.trim() || "Anonymous";
  }

  return (
    <section className="py-20 md:py-32 bg-hs-bluenavy">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Meet Our <span className="text-hs-yellow">Scholars</span>
          </h2>
          <p className="text-xl md:text-2xl font-medium text-white/80 max-w-2xl mx-auto">
            Real stories from students and teachers whose lives have been transformed by your generosity.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border-2 border-white/10 rounded-3xl overflow-hidden shadow-xl animate-pulse">
                <div className="h-64 bg-white/10" />
                <div className="p-8">
                  <div className="h-8 bg-white/10 rounded mb-4 w-3/4" />
                  <div className="h-4 bg-white/10 rounded mb-3 w-full" />
                  <div className="h-4 bg-white/10 rounded mb-6 w-5/6" />
                  <div className="h-6 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <p className="text-center text-xl font-bold text-white/60">No stories available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {stories.map((story) => {
              const docId = story.documentId ?? story.id;
              const title = story.title ?? "Untitled";
              const description = story.description ?? "";
              const studentName = getStudentName(story);
              const imageUrl = getImageUrl(story);

              return (
                <div key={docId} className="group bg-white/5 border-2 border-white/10 rounded-[32px] overflow-hidden shadow-2xl hover:border-hs-yellow transition-all duration-300 hover:-translate-y-2 flex flex-col">
                  <div className="relative h-64 md:h-72 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={studentName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-hs-bluenavy via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-2xl text-hs-yellow mb-4 leading-tight">
                      {title}
                    </h3>
                    <blockquote className="text-base font-medium text-white/80 italic mb-8 line-clamp-4 flex-grow">
                      &quot;{description}&quot;
                    </blockquote>
                    <div className="mt-auto border-t-2 border-white/10 pt-4">
                      <div className="font-bold text-lg text-white uppercase tracking-widest">
                        {studentName}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BOTÓN BLINDADO DEFINITIVO 🚀 */}
        <div className="text-center mt-16 flex justify-center relative z-50">
          <a 
            href="/donation/stories" 
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg border-2 transition-transform hover:scale-105 shadow-xl"
            style={{ 
              borderColor: "var(--hs-yellow)", 
              color: "var(--hs-yellow)",
              backgroundColor: "transparent",
              cursor: "pointer",
              pointerEvents: "auto" // Fuerza a que reciba clics sin importar qué haya encima
            }}
          >
            See All Stories <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Stewardship & Transparency
function Stewardship() {
  return (
    <section className="py-20 md:py-32 bg-hs-yellow text-hs-bluenavy border-t-4 border-hs-bluenavy/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Stewardship & Transparency
          </h2>
          <p className="text-xl md:text-2xl font-bold opacity-80 max-w-2xl mx-auto">
            Your trust matters. See how we steward every gift to maximize its impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-white hover:border-hs-bluenavy transition-colors duration-300">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-hs-bluenavy" />
            <h3 className="text-2xl font-extrabold mb-4">Annual Impact Report</h3>
            <p className="text-base font-medium opacity-80 mb-8 leading-relaxed">
              Detailed breakdown of how every dollar makes a difference.
            </p>
            <button className="inline-flex items-center gap-2 font-bold text-lg text-hs-yellow bg-hs-bluenavy px-6 py-3 rounded-full hover:scale-105 transition-transform w-full justify-center">
              Download Report
            </button>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-white hover:border-hs-bluenavy transition-colors duration-300">
            <Users className="w-16 h-16 mx-auto mb-6 text-hs-bluenavy" />
            <h3 className="text-2xl font-extrabold mb-4">Board of Directors</h3>
            <p className="text-base font-medium opacity-80 mb-8 leading-relaxed">
              Meet the dedicated leaders guiding our 501(c)(3) mission.
            </p>
            <button className="inline-flex items-center gap-2 font-bold text-lg text-hs-yellow bg-hs-bluenavy px-6 py-3 rounded-full hover:scale-105 transition-transform w-full justify-center">
              Learn More
            </button>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-white hover:border-hs-bluenavy transition-colors duration-300">
            <Mail className="w-16 h-16 mx-auto mb-6 text-hs-bluenavy" />
            <h3 className="text-2xl font-extrabold mb-4">Contact Us</h3>
            <p className="text-base font-medium opacity-80 mb-6 leading-relaxed">
              Development Office & Foundation Team
            </p>
            <div className="space-y-3 text-base font-bold">
              <a href="mailto:donations@hughesschools.edu" className="flex items-center justify-center gap-3 hover:text-hs-yellow bg-gray-50 py-3 rounded-xl transition-colors">
                <Mail className="w-5 h-5" /> donations@hughes...
              </a>
              <a href="tel:+59141234567" className="flex items-center justify-center gap-3 hover:text-hs-yellow bg-gray-50 py-3 rounded-xl transition-colors">
                <Phone className="w-5 h-5" /> +591 4 123 4567
              </a>
            </div>
          </div>
        </div>

        <div className="bg-hs-bluenavy text-white p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-8 border-4 border-hs-bluenavy">
          <CheckCircle2 className="w-16 h-16 text-hs-yellow shrink-0" />
          <div>
            <h3 className="text-2xl font-extrabold text-hs-yellow mb-3">
              Legal & Nonprofit Information
            </h3>
            <p className="text-lg font-medium opacity-90 leading-relaxed">
              <strong className="text-white">EIN:</strong> 12-3456789<br />
              <strong className="text-white">Status:</strong> 501(c)(3) Tax-Exempt Organization<br />
              <strong className="text-hs-yellow">Disclaimer:</strong> Hughes Schools Foundation is a registered nonprofit. 
              All donations are tax-deductible to the fullest extent allowed by law.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
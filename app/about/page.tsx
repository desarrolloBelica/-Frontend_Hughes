"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Globe2,
  Users,
  Landmark,
  Trophy,
  Sparkles,
  Music,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { CountingNumber } from "@/components/CountingNumber";

const META = {
  ceeb: "905040",
  address: "Km. 6 a Sacaba, Avenida Octava, Cochabamba, Bolivia",
  phone: "(591) 4-471-6262",
  founded: 1998,
  enrollment: 715,
  englishPct: 80,
  performances6y: 230,
  honorsMax: 16,
  scholarships5y: "$3.1M+",
};

const VISION = `Hughes Schools is a national leader in education, recognized for the quality and excellence of its academic and artistic services. Our graduates pair high achievement with strong values and social commitment, serving their communities and society at large.`;

const MISSION = `We form and empower people of integrity and success through academic and artistic excellence in an environment of safety and well-being. Our specialized team continuously updates teaching methods to meet the needs of students, society, and the state—maintaining excellent communication with families and the global community based on respect and mutual understanding.`;

const GRADUATE_PROFILE = `An ordinary person who does extraordinary things. Hughes graduates are thoughtful, active, and productive leaders who apply positive values and knowledge to grow personally and improve the world. With strong logical, critical, and creative thinking, they set ambitious goals and achieve them—benefitting family, friends, community, and country.`;

const CORE_CREDITS = [
  { area: "English", list: ["English I", "English II", "English III", "English IV"] },
  { area: "Mathematics", list: ["Algebra II", "Geometry", "Pre-calculus", "Calculus"] },
  { area: "Science", list: ["Biology I–IV", "Chemistry I–IV", "Physics I–IV (with labs)"] },
  { area: "Social Science", list: ["American History", "U.S. Government", "World History", "Economics"] },
  { area: "Foreign Language", list: ["Spanish I–IV"] },
  { area: "Moral Education", list: ["I–IV"] },
  { area: "Art", list: ["I–IV"] },
  { area: "Music Appreciation", list: ["I–IV"] },
  { area: "Foundations", list: ["Philosophy I", "Psychology I", "Computer Science I", "Geography I"] },
  { area: "Physical Education", list: ["I–IV"] },
];

const HONORS = `High-achieving students may take Honors in English, Physics, Chemistry, and Mathematics across all four years (up to 16 honors courses available).`;

const ARTS = {
  level1: {
    grades: "Grades 1–4",
    hours: 10,
    courses: ["Classical Ballet", "Jazz Dance", "Bolivian Folk Dance", "Choir", "Music Theory"],
    note: "Instrument classes encouraged (optional)",
  },
  level2: {
    grades: "Grades 5–12",
    tracks: [
      { name: "Dance", hours: 12, courses: ["Classical Ballet", "Jazz", "Contemporary", "Bolivian Folk"] },
      {
        name: "Music",
        hours: 7,
        courses: ["Choir", "Music Theory", "Bolivian Folk Music"],
        instruments:
          "Principal instrument: piano, voice, strings, brass, woodwinds (voice students also study piano)",
      },
    ],
    double: "Double-specialty program (by invitation): Dance + Music, 19 hrs/week",
  },
  footprint: "230+ performances in the last 6 years, including Chile, Italy, and the U.S.",
};

const RESULTS = {
  placement: "100% matriculated to 4-year colleges and/or universities",
  scholarships: "$3,100,000+ in academic and artistic scholarships from U.S. universities in the last 5 years",
};

type Outcome = {
  quantity: number;
  event: string;
  recognition: string;
};

const normalizeOutcomes = (payload: unknown): Outcome[] => {
  const raw = Array.isArray(payload) ? payload : (payload as { data?: unknown })?.data;

  if (!Array.isArray(raw)) return [];

  return raw
    .map((item: any) => {
      const source = item?.attributes ?? item;
      const quantity = Number(source?.quantity);
      const event = String(source?.event ?? "");
      const recognition = String(source?.recognition ?? "");

      return { quantity, event, recognition };
    })
    .filter((item): item is Outcome => !Number.isNaN(item.quantity) && Boolean(item.recognition || item.event));
};

// Small UI pill (Ajustado para fondos oscuros)
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-hs-yellow px-4 py-1.5 text-sm font-bold text-hs-bluenavy shadow-md">
    {children}
  </span>
);

// Componente Stat ajustado
function Stat({ value, label, isNavyBg = false }: { value: React.ReactNode; label: string; isNavyBg?: boolean }) {
  return (
    <div className={`rounded-3xl p-6 md:p-8 shadow-xl border-2 transition-transform duration-300 hover:scale-105 ${isNavyBg ? 'bg-hs-bluenavy border-hs-yellow' : 'bg-hs-yellow border-hs-bluenavy'}`}>
      <div className={`text-4xl md:text-5xl font-extrabold mb-2 ${isNavyBg ? 'text-hs-yellow' : 'text-hs-bluenavy'}`}>{value}</div>
      <div className={`text-base md:text-lg font-bold opacity-90 ${isNavyBg ? 'text-white' : 'text-hs-bluenavy'}`}>{label}</div>
    </div>
  );
}

export default function AboutPage() {
  const [outcomes, setOutcomes] = React.useState<Outcome[]>([]);
  const [loadingOutcomes, setLoadingOutcomes] = React.useState(true);
  const [outcomesError, setOutcomesError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        setLoadingOutcomes(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const res = await fetch(`${base}/api/outcomes/`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const body = await res.json();
        const parsed = normalizeOutcomes(body);
        setOutcomes(parsed);
      } catch (error) {
        console.error("Failed to load outcomes", error);
        setOutcomesError("No pudimos cargar los reconocimientos en este momento.");
      } finally {
        setLoadingOutcomes(false);
      }
    };

    fetchOutcomes();
  }, []);

  return (
    <main className="min-h-screen bg-hs-bluenavy text-lg md:text-xl leading-relaxed">
      
      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <Image src="/35.JPG" alt="Hughes students" fill priority className="object-cover" />
          {/* Superposición fuerte Navy para que resalte el texto amarillo */}
          <div className="absolute inset-0 bg-hs-bluenavy/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-hs-bluenavy via-transparent to-transparent" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-32 w-full">
          <motion.h1 
            initial={{opacity:0,y:20}} 
            animate={{opacity:1,y:0}} 
            transition={{duration:0.6}} 
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-hs-yellow drop-shadow-xl leading-tight"
          >
            About <br className="hidden md:block"/> Hughes Schools
          </motion.h1>
          <motion.div 
            initial={{opacity:0,y:20}} 
            animate={{opacity:1,y:0}} 
            transition={{duration:0.6, delay:0.2}} 
            className="mt-8 max-w-3xl bg-hs-bluenavy/85 backdrop-blur-md p-6 md:p-8 rounded-3xl border-l-4 border-hs-yellow shadow-2xl"
          >
            <p className="text-xl md:text-2xl text-white font-medium opacity-90 leading-relaxed drop-shadow-sm">
              A bilingual, independent PK–12 institution delivering rigorous academics, a robust Performing Arts program, and a culture of character, leadership, and community.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Chip><Users className="h-4 w-4"/> {META.enrollment} Students</Chip>
              <Chip><Globe2 className="h-4 w-4"/> ~{META.englishPct}% Instruction in English</Chip>
              <Chip><Landmark className="h-4 w-4"/> Founded {META.founded}</Chip>
              <Chip><Trophy className="h-4 w-4"/> 100% College Matriculation</Chip>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* 2. VISION */}
      <section className="bg-hs-bluenavy text-hs-yellow border-t-2 border-hs-yellow/20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-16 px-6 py-20 md:py-28 items-center">
          <div className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-hs-yellow/30">
            <Image src="/37.JPG" alt="Vision" fill className="object-cover" />
          </div>
          <div>
            <div className="inline-flex px-4 py-2 rounded-full bg-hs-yellow/10 border border-hs-yellow/30 font-bold tracking-widest uppercase text-sm mb-6">
              Our Vision
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Excellence with Purpose
            </h2>
            <p className="text-lg md:text-xl text-white opacity-90 font-medium leading-relaxed text-justify mb-8">
              {VISION}
            </p>
            <div className="flex gap-3 flex-wrap">
              <span className="px-5 py-2 rounded-full bg-hs-yellow text-hs-bluenavy font-bold">Quality</span>
              <span className="px-5 py-2 rounded-full bg-hs-yellow text-hs-bluenavy font-bold">Values</span>
              <span className="px-5 py-2 rounded-full bg-hs-yellow text-hs-bluenavy font-bold">Social Commitment</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION */}
      <section className="bg-hs-yellow text-hs-bluenavy">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-16 px-6 py-20 md:py-28 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex px-4 py-2 rounded-full bg-hs-bluenavy/10 border border-hs-bluenavy/30 font-bold tracking-widest uppercase text-sm mb-6">
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Integrity, Safety, Well-being
            </h2>
            <p className="text-lg md:text-xl font-medium opacity-90 leading-relaxed text-justify mb-8">
              {MISSION}
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 text-base md:text-lg font-bold">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-hs-bluenavy"/> Bilingual PK–12
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-hs-bluenavy"/> Mastery-based advancement
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-hs-bluenavy"/> Continuous teacher development
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-hs-bluenavy"/> Family & community partnership
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2 relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-hs-bluenavy/20">
            <Image src="/36 (2).JPG" alt="Mission" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* 4. WHO WE ARE */}
      <section className="bg-hs-bluenavy text-hs-yellow relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex px-4 py-2 rounded-full bg-hs-yellow/10 border border-hs-yellow/30 font-bold tracking-widest uppercase text-sm mb-6">
                Who We Are
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                Cochabamba • PK–12 • Accredited
              </h3>
              <p className="text-lg md:text-xl text-white opacity-90 font-medium leading-relaxed text-justify">
                Hughes Schools is accredited by the Bolivian Ministry of Education and the Cochabamba District Department of Education.
                The school year runs February–November, with summer break in December–January and winter break the first two weeks of July.
                ~{META.englishPct}% of instruction is in English.
              </p>
            </div>
            
            <div className="rounded-3xl border-2 border-hs-yellow/50 bg-hs-yellow/5 p-8 md:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Globe2 className="h-8 w-8 text-hs-yellow" />
                <h4 className="text-2xl font-bold">Community</h4>
              </div>
              <p className="text-lg text-white opacity-90 font-medium leading-relaxed text-justify">
                Located in Cochabamba, Bolivia (population ~1.9M). Student body: 95% Bolivian, 5% international (North America & Europe).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BY THE NUMBERS */}
      <section className="bg-hs-yellow text-hs-bluenavy">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">By the Numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Stat isNavyBg={true} value={<CountingNumber target={META.enrollment} />} label="Students (PK–12)" />
            <Stat isNavyBg={false} value={<CountingNumber target={META.englishPct} suffix="%" />} label="Instruction in English" />
            <Stat isNavyBg={true} value={<CountingNumber target={100} suffix="%" />} label="4-year college matriculation" />
            <Stat
              isNavyBg={false}
              value={
                <span className="inline-flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$</span>
                  <CountingNumber target={3.1} decimals={1} suffix="M+" />
                </span>
              }
              label="Scholarships (last 5 yrs)"
            />
          </div>
        </div>
      </section>

      {/* 6. ACADEMICS */}
      <section className="bg-hs-bluenavy text-hs-yellow">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex px-4 py-2 rounded-full bg-hs-yellow/10 border border-hs-yellow/30 font-bold tracking-widest uppercase text-sm">
              Academics (PK–12)
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Rigorous. Structured. Mastery-Based.
            </h2>
            <p className="text-lg text-white opacity-90 font-medium leading-relaxed text-justify">
              Daily schedule of six 45-minute classes. Science includes labs each year. Advanced Placement(Pre-University courses) is not currently offered. Advancement requires mastery.
            </p>
            
            <div className="mt-8 rounded-3xl bg-hs-yellow text-hs-bluenavy p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6" />
                <h4 className="text-xl font-bold uppercase tracking-wider">Honors Pathway</h4>
              </div>
              <p className="text-base md:text-lg font-medium leading-relaxed">{HONORS}</p>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl border-2 border-hs-yellow/30 shadow-2xl bg-white/5 backdrop-blur-sm">
              <table className="w-full text-left">
                <thead className="bg-hs-yellow text-hs-bluenavy border-b-2 border-hs-yellow">
                  <tr>
                    <th className="font-extrabold px-6 py-5 text-lg w-[30%]">Area</th>
                    <th className="font-extrabold px-6 py-5 text-lg">Courses</th>
                  </tr>
                </thead>
                <tbody className="text-white opacity-90 text-base md:text-lg font-medium divide-y divide-hs-yellow/20">
                  {CORE_CREDITS.map((row) => (
                    <tr key={row.area} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-hs-yellow font-bold">{row.area}</td>
                      <td className="px-6 py-4">{row.list.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PERFORMING ARTS */}
      <section className="bg-hs-yellow text-hs-bluenavy">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-hs-bluenavy text-hs-yellow mb-6 shadow-xl">
              <Music className="h-10 w-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Performing Arts</h2>
            <p className="text-lg md:text-xl font-bold opacity-90 leading-relaxed">
              All students (1–12) participate across two levels. <br/> {ARTS.footprint}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-3xl border-2 border-hs-bluenavy bg-white/40 p-8 shadow-lg">
              <h3 className="text-2xl font-extrabold mb-4 border-b-2 border-hs-bluenavy/20 pb-4">Level One (Grades 1–4)</h3>
              <div className="text-lg font-bold mb-2">
                <span className="opacity-80">Load:</span> {ARTS.level1.hours} hrs/week
              </div>
              <div className="text-lg font-bold mb-4">
                <span className="opacity-80">Courses:</span> {ARTS.level1.courses.join(", ")}
              </div>
              <div className="inline-block px-4 py-2 bg-hs-bluenavy text-hs-yellow rounded-full text-sm font-bold">
                {ARTS.level1.note}
              </div>
            </div>
            
            <div className="rounded-3xl border-2 border-hs-bluenavy bg-white/40 p-8 shadow-lg">
              <h3 className="text-2xl font-extrabold mb-4 border-b-2 border-hs-bluenavy/20 pb-4">Level Two (Grades 5–12)</h3>
              <div className="space-y-4">
                {ARTS.level2.tracks.map((t) => (
                  <div key={t.name} className="text-lg">
                    <span className="font-extrabold">{t.name} Track:</span> <span className="font-bold opacity-90">{t.hours} hrs/week · {t.courses.join(", ")}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 inline-block px-4 py-2 bg-hs-bluenavy text-hs-yellow rounded-xl text-sm font-bold leading-relaxed">
                {ARTS.level2.double}
              </div>
            </div>
          </div>

          {/* Galería de imágenes pequeña */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["/38.JPG","/39.JPG","/40.JPG","/42.jpg"].map((src) => (
              <div key={src} className="relative h-40 md:h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-hs-bluenavy/10 hover:scale-105 transition-transform">
                <Image src={src} alt="Performing arts" fill className="object-cover" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. RESULTS & AWARDS */}
      <section className="bg-hs-bluenavy text-hs-yellow">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            <div className="lg:col-span-1 space-y-6">
              <div className="inline-flex px-4 py-2 rounded-full bg-hs-yellow/10 border border-hs-yellow/30 font-bold tracking-widest uppercase text-sm">
                Outcomes
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Results & Placement
              </h2>
              <div className="space-y-6 mt-8">
                <div className="bg-hs-yellow/10 p-6 rounded-2xl border border-hs-yellow/20">
                  <p className="text-sm uppercase tracking-wider font-bold opacity-80 mb-2">Placement</p>
                  <p className="text-xl font-bold text-white">{RESULTS.placement}</p>
                </div>
                <div className="bg-hs-yellow/10 p-6 rounded-2xl border border-hs-yellow/20">
                  <p className="text-sm uppercase tracking-wider font-bold opacity-80 mb-2">Scholarships</p>
                  <p className="text-xl font-bold text-white">{RESULTS.scholarships}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="bg-hs-yellow text-hs-bluenavy rounded-3xl p-6 md:p-8 shadow-2xl">
                <AccordionItem value="awards" className="border-none">
                  <AccordionTrigger className="text-2xl md:text-3xl font-extrabold hover:no-underline hover:opacity-80 transition-opacity">
                    Major Awards & Distinctions (2006–2024)
                  </AccordionTrigger>
                  <AccordionContent className="pt-6">
                    {loadingOutcomes && (
                      <p className="text-lg font-bold animate-pulse">Loading achievements...</p>
                    )}

                    {outcomesError && !loadingOutcomes && (
                      <p className="text-lg font-bold text-red-700">{outcomesError}</p>
                    )}

                    {!loadingOutcomes && !outcomesError && outcomes.length === 0 && (
                      <p className="text-lg font-bold opacity-80">No awards to display at this time.</p>
                    )}

                    {!loadingOutcomes && !outcomesError && outcomes.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-4 text-base md:text-lg font-bold">
                        {outcomes.map((outcome, i) => (
                          <li key={`${outcome.event ?? "outcome"}-${i}`} className="flex items-start gap-3 bg-white/30 p-3 rounded-xl">
                            <Trophy className="h-5 w-5 shrink-0 text-hs-bluenavy mt-0.5" />
                            <span>
                              <span className="font-extrabold text-xl">{outcome.quantity}</span>{" "}
                              {outcome.recognition}
                              {outcome.event ? ` · ${outcome.event}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </div>
      </section>

      {/* 9. GRADUATE PROFILE + STUDENT LIFE */}
      <section className="bg-hs-yellow text-hs-bluenavy">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* Graduate Profile */}
            <div className="rounded-[40px] bg-hs-bluenavy text-hs-yellow p-8 md:p-12 shadow-2xl border-4 border-hs-bluenavy">
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="h-8 w-8" /> 
                <span className="font-bold uppercase tracking-widest text-sm">Graduate Profile</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
                An ordinary person who does extraordinary things.
              </h2>
              <p className="text-lg text-white opacity-90 font-medium leading-relaxed text-justify mb-8">
                {GRADUATE_PROFILE}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-hs-yellow text-hs-bluenavy font-bold text-sm">Leadership</span>
                <span className="px-4 py-2 rounded-full bg-hs-yellow text-hs-bluenavy font-bold text-sm">Critical Thinking</span>
                <span className="px-4 py-2 rounded-full bg-hs-yellow text-hs-bluenavy font-bold text-sm">Creativity</span>
                <span className="px-4 py-2 rounded-full bg-hs-yellow text-hs-bluenavy font-bold text-sm">Service</span>
              </div>
            </div>

            {/* Student Life / Extracurriculars */}
            <div className="rounded-[40px] bg-white/40 border-2 border-hs-bluenavy p-8 md:p-12 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-8 w-8 text-hs-bluenavy" /> 
                <span className="font-bold uppercase tracking-widest text-sm">Student Life & Extracurriculars</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
                Beyond the classroom
              </h3>
              <p className="text-lg font-medium leading-relaxed text-justify mb-8">
                Rich academic & service-oriented activities: math, acting, science, volunteering; science & math fairs;
                academic olympiads; extensive performance opportunities in dance and music; and independent academic
                and artistic projects with faculty mentorship.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4 text-base font-bold">
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /> Science & Math Fairs</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /> Academic Olympiads</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /> Dance & Music Performances</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /> Clubs: Math, Acting, Science, Volunteering</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /> Independent Projects (Mentored)</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /> Local, National & International Showcases</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
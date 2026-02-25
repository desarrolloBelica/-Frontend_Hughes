"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Music, Music2 } from "lucide-react";

type Tier = {
  id: string;
  title: string;
  subtitle?: string;
  body: ReactNode;
  image: string;
  flipped?: boolean;
};

type Value = {
  title: string;
  description: string;
};

type TableRow = {
  subject: string;
  freq: string;
  dur: string;
};

const heroImage = "/31.JPG";

const musicValues: Value[] = [
  {
    title: "Excellence",
    description: "Constant musical practice drives us to improve, achieve high standards, and give our best.",
  },
  {
    title: "Sensitivity and Emotional Expression",
    description: "Music allows us to recognize, channel, and communicate emotions authentically.",
  },
  {
    title: "Collaboration and Sense of Community",
    description: "When singing or playing in a group, we learn to listen to others and work in harmony.",
  },
  {
    title: "Creativity",
    description: "Composing, improvising, and interpreting develop original thinking and artistic imagination.",
  },
  {
    title: "Discipline",
    description: "Musical progress requires consistency, effort, and organization in daily practice.",
  },
  {
    title: "Responsibility",
    description: "Each musician is aware of their role, fulfills commitments, and prepares seriously.",
  },
  {
    title: "Freedom of Expression",
    description: "Music opens spaces to express oneself authentically, without judgments or limits.",
  },
  {
    title: "Active Listening",
    description: "We cultivate deep attention and auditory comprehension, essential in musical interpretation.",
  },
  {
    title: "Persistence",
    description: "Overcoming technical or interpretative difficulties teaches us not to give up easily.",
  },
  {
    title: "Frustration Tolerance",
    description: "We learn to accept mistakes as part of the process and move forward with resilience.",
  },
  {
    title: "Autonomy and Decision Making",
    description: "Musicians develop their own criteria to interpret, practice, and solve musical problems.",
  },
  {
    title: "Adaptability",
    description: "Requires flexibility in facing changing repertoires, partners, and contexts.",
  },
  {
    title: "Empathy",
    description: "By interpreting others' emotions through music, we foster deep understanding of each other.",
  },
  {
    title: "Self-esteem and Personal Confidence",
    description: "Overcoming artistic challenges and performing in public strengthens confidence and self-worth.",
  },
];

const musicTiers: Tier[] = [
  {
    id: "initiation-level",
    title: "Initiation Level (Grades 1–4)",
    subtitle: "Musical exploration and choir practice",
    body: (
      <>
        <p className="mb-4">
          Students are introduced to the <strong>musical language</strong> and choir practice,
          developing auditory and vocal skills.
        </p>
        <h4 className="font-semibold text-xl mb-2 mt-6">Required Subjects:</h4>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Choir</li>
          <li>
            Musical Training (instrument exploration): recorder (1st–2nd grade), violin and guitar
            (3rd–4th grade)
          </li>
        </ul>
        <h4 className="font-semibold text-xl mb-2">Optional Individual Classes:</h4>
        <p>Piano, violin, guitar, or voice, adapted to each student's learning pace.</p>
      </>
    ),
    image: "/32.JPG",
  },
  {
    id: "specialization-level",
    title: "Specialization Level (Grade 5 – Grade 12)",
    subtitle: "Musical formation and specialization",
    body: (
      <>
        <p className="mb-4">
          Students deepen their knowledge of theory, solfège, audio perception, and harmony.
        </p>
        <h4 className="font-semibold text-xl mb-2 mt-6">Specialty Instrument:</h4>
        <p>
          Individual classes in piano, voice, classical guitar, electric guitar, or violin.
        </p>
      </>
    ),
    image: "/33.JPG",
    flipped: true,
  },
  {
    id: "bolivian-folkloric-music",
    title: "Bolivian Folkloric Music",
    subtitle: "Identity, tradition, and performance",
    body: (
      <>
        <p className="mb-4">
          Group lessons in <strong>charango</strong>, <strong>guitar</strong>, native wind
          instruments, and voice. Students form the music group <strong>"Kusirima"</strong>, which
          participates in festivals and contests and provides live music for the school's Dance
          Ensemble.
        </p>
        <p>
          The department's philosophy is to transmit to children and youth the love and pride of
          possessing cultural richness and upholding Bolivian folkloric music. Our mission is to
          preserve and perpetuate our traditions through teaching. We promote cultural identity
          appropriation through teaching-learning.
        </p>
      </>
    ),
    image: "/34.JPG",
  },
  {
    id: "folkloric-workshops",
    title: "Practice-Learning Levels (Bolivian Folkloric Music Workshops)",
    body: (
      <>
        <ul className="space-y-6 mt-4">
          <li>
            <strong className="text-xl block mb-1">Workshop 1:</strong>
            <p>Takes into account each student's musical conditions when learning an instrument within folkloric music specialty. Develops aptitudes regarding instrument preference. Includes singing as part of the program. Covers brief history of Bolivian folk music, geographical references of instruments, their characteristics (string, wind, or percussion), classification of music by regions, and importance as cultural and social identity.</p>
          </li>
          <li>
            <strong className="text-xl block mb-1">Workshop 2:</strong>
            <p>Retrospective of Workshop 1 with emphasis on instrument practice. Deepens execution, enriches repertoire, and works in groups, highlighting the importance of community work as foundation of our customs.</p>
          </li>
          <li>
            <strong className="text-xl block mb-1">Workshop A:</strong>
            <p>Evaluates the entire learning process and progress in previous levels, including instrument execution, repertoire knowledge, and theoretical content. This group is the gateway to the Kusirima folkloric group, where students must demonstrate mastery of everything learned.</p>
          </li>
        </ul>
      </>
    ),
    image: "/34.JPG",
    flipped: true,
  },
];

const danceFirstCycle: { label: string; rows: TableRow[] }[] = [
  {
    label: "1st Grade",
    rows: [
      { subject: "Creative Dance", freq: "2x/week", dur: "1 hour" },
      { subject: "Body Expression", freq: "2x/week", dur: "1 hour" },
      { subject: "Musical Training", freq: "2x/week", dur: "1 hour" },
      { subject: "Choir", freq: "2x/week", dur: "1 hour" },
    ],
  },
  {
    label: "2nd Grade",
    rows: [
      { subject: "Creative Dance", freq: "2x/week", dur: "1 hour" },
      { subject: "Body Expression", freq: "2x/week", dur: "1 hour" },
      { subject: "Musical Training", freq: "2x/week", dur: "1 hour" },
      { subject: "Choir", freq: "2x/week", dur: "1 hour" },
    ],
  },
  {
    label: "3rd Grade",
    rows: [
      { subject: "Intro to Bolivian Dance", freq: "2x/week", dur: "1 hour" },
      { subject: "Intro to Ballet", freq: "2x/week", dur: "1 hour" },
      { subject: "Musical Training (guitar, violin)", freq: "2x/week", dur: "1 hour" },
      { subject: "Choir", freq: "2x/week", dur: "1 hour" },
    ],
  },
  {
    label: "4th Grade",
    rows: [
      { subject: "Intro to Bolivian Dance", freq: "2x/week", dur: "1 hour" },
      { subject: "Intro to Ballet", freq: "2x/week", dur: "1 hour" },
      { subject: "Musical Training (guitar, violin)", freq: "2x/week", dur: "1 hour" },
      { subject: "Choir", freq: "2x/week", dur: "1 hour" },
    ],
  },
];

const danceSecondCycle: { label: string; rows: TableRow[] }[] = [
  {
    label: "Workshop Group – Initial Preparatory",
    rows: [
      { subject: "Jazz", freq: "3x/week", dur: "1 hour" },
      { subject: "Bolivian Dance", freq: "3x/week", dur: "1 hour" },
      { subject: "Ballet", freq: "3x/week", dur: "1 hour" },
    ],
  },
  {
    label: "Groups C1 and C2 – Basic Difficulty",
    rows: [
      { subject: "Jazz", freq: "3x/week", dur: "1 hour" },
      { subject: "Bolivian Dance", freq: "3x/week", dur: "1 hour" },
      { subject: "Ballet", freq: "3x/week", dur: "1 hour" },
    ],
  },
  {
    label: "Groups C3 and D1 – Intermediate Difficulty",
    rows: [
      { subject: "Jazz", freq: "3x/week", dur: "1 hour" },
      { subject: "Bolivian Dance", freq: "3x/week", dur: "1 hour" },
      { subject: "Ballet", freq: "3x/week", dur: "1 hour" },
      { subject: "Contemporary Dance", freq: "3x/week", dur: "1 hour" },
    ],
  },
  {
    label: "Group D2 – Intermediate Advanced",
    rows: [
      { subject: "Jazz", freq: "3x/week", dur: "1 hour" },
      { subject: "Bolivian Dance", freq: "3x/week", dur: "1 hour" },
      { subject: "Ballet", freq: "3x/week", dur: "1 hour" },
      { subject: "Contemporary Dance", freq: "3x/week", dur: "1 hour" },
    ],
  },
  {
    label: "Group E – Advanced Difficulty",
    rows: [
      { subject: "Jazz", freq: "3x/week", dur: "1 hour" },
      { subject: "Bolivian Dance", freq: "3x/week", dur: "1 hour" },
      { subject: "Ballet", freq: "3x/week", dur: "1 hour" },
      { subject: "Contemporary Dance", freq: "3x/week", dur: "1 hour" },
    ],
  },
];

function FlippableValueCard({ value }: { value: Value }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-24 w-full cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((prev) => !prev)}
      style={{ perspective: "1000px" }}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center gap-2 rounded-2xl border-3 p-4 text-center bg-hs-bluenavy"
          style={{
            borderColor: "var(--hs-yellow)",
            backfaceVisibility: "hidden",
            borderWidth: "2px",
          }}
        >
          <h4 className="text-sm md:text-base font-bold leading-tight text-hs-yellow">{value.title}</h4>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center gap-2 rounded-2xl border-3 p-4 text-center bg-hs-yellow"
          style={{
            borderColor: "var(--hs-bluenavy)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderWidth: "2px",
          }}
        >
          <p className="text-xs font-semibold leading-snug text-hs-bluenavy">{value.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ArtProgramsPage() {
  return (
    <main className="min-h-screen">
      {/* HERO estilo BASIS (texto izq + imagen der) */}
      <section className="section-gradient-soft relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Texto */}
          <div className="md:col-span-6">
            <div className="mb-6 flex items-center gap-3">
              <span
                className="inline-block h-6 w-6 rounded-full"
                style={{ background: "var(--hs-yellow)" }}
                aria-hidden
              />
              <span
                className="inline-block h-6 w-6 rounded-br-[14px]"
                style={{ background: "var(--hs-bluenavy)" }}
                aria-hidden
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-bluenavy leading-tight">
              Performing Arts Programs <br />
              Dance & Music
            </h1>

            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-hs-bluenavy opacity-90">
              A complete journey from early musical exploration to specialization, with choir training, individual lessons, and a strong program in Bolivian Folk Music that celebrates identity and tradition.
            </p>

            <a
              href="/admissions"
              className="mt-8 inline-flex items-center rounded-full bg-[var(--hs-yellow)] px-8 py-4 text-lg font-bold text-hs-bluenavy hover:opacity-90 transition shadow-lg"
            >
              Apply Now
            </a>
          </div>

          {/* Imagen */}
          <div className="md:col-span-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="Performing arts students"
              className="w-full rounded-[24px] object-cover shadow-xl"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-10 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Intro */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-2">
          <div
            className="rounded-3xl border bg-hs-yellow p-8 md:p-10 text-hs-bluenavy relative -top-6 shadow-xl"
            style={{ borderColor: "var(--hs-yellow)" }}
          >
            <p className="text-lg md:text-xl leading-relaxed text-justify font-medium">
              Hughes Schools’ Art Programs accompany students from their first steps in music to
              advanced artistic goals. The program integrates choir, theory, and individual
              instrumental practice, alongside a strong component of{" "}
              <strong>Bolivian Folk Music</strong> that fosters cultural identity and belonging.
            </p>
          </div>
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="section-gradient">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 pb-24 md:pb-36">
          <div id="programs" className="space-y-8">
            <Tabs defaultValue="dance" className="w-full">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <TabsList className="bg-hs-bluenavy shadow-sm h-12 p-1 rounded-xl">
                  <TabsTrigger 
                    value="dance"
                    className="text-base px-6 data-[state=active]:bg-[var(--hs-yellow)] data-[state=active]:text-[var(--hs-bluenavy)] data-[state=active]:font-bold rounded-lg"
                  >
                    Dance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="music"
                    className="text-base px-6 data-[state=active]:bg-[var(--hs-yellow)] data-[state=active]:text-[var(--hs-bluenavy)] data-[state=active]:font-bold rounded-lg"
                  >
                    Music
                  </TabsTrigger>
                </TabsList>
                <Link
                  href="/arts/theater"
                  className="btn-motion-dark"
                >
                  <span className="btn-bg" />
                  <span className="btn-text">Go to Hughes&apos; Theater</span>
                </Link>
              </div>

              {/* DANCE TAB */}
              <TabsContent value="dance" className="pt-10">
                <div className="space-y-16 md:space-y-24">
                  
                  {/* VISIÓN Y MISIÓN */}
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-3xl p-8 md:p-10 bg-hs-bluenavy text-hs-yellow shadow-xl">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6">Vision</h3>
                      <p className="text-base md:text-lg opacity-90 leading-relaxed text-justify">
                        To be a dance program of artistic and academic excellence, recognized for the integral
                        formation of sensitive, creative, and technically prepared students, capable of expressing
                        themselves through movement, valuing cultural diversity—especially Bolivian dance—and
                        projecting confidently toward higher studies and the professional field of performing arts.
                      </p>
                    </div>
                    
                    <div className="rounded-3xl p-8 md:p-10 bg-hs-yellow text-hs-bluenavy shadow-xl">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6">Mission</h3>
                      <p className="text-base md:text-lg opacity-90 leading-relaxed text-justify">
                        To train students in dance from childhood to adolescence through a progressive, inclusive, and
                        systematic educational process that develops bodily, technical, musical, and expressive
                        skills. The program promotes discipline, creativity, cultural identity, and collaborative work,
                        integrating different dance techniques and musical training as the basis for comprehensive
                        artistic education.
                      </p>
                    </div>
                  </div>

                  {/* PROGRAMS OFFERED - DANCE */}
                  <div className="space-y-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-center text-hs-bluenavy mb-12">
                      Programs Offered
                    </h3>

                    <article className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 bg-hs-bluenavy text-hs-yellow p-8 md:p-12 rounded-3xl shadow-xl">
                      <div className="md:col-span-6 md:order-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/32.JPG"
                          alt="First Study Cycle"
                          className="w-full rounded-[24px] object-cover shadow-md"
                        />
                      </div>
                      <div className="md:col-span-6 md:order-2">
                        <h4 className="text-2xl md:text-3xl font-bold mb-6">
                          First Study Cycle (1st to 4th Grade)
                        </h4>
                        <p className="text-base md:text-lg opacity-90 leading-relaxed text-justify">
                          This cycle builds psychomotor, expressive, and musical foundations during a key stage of
                          development. Movement is core for learning, communication, and exploration. Creative dance and
                          body expression foster body awareness, coordination, spatial awareness, rhythm, and
                          creativity. Musical training and choir strengthen auditory perception, rhythm, and artistic
                          sensitivity. From 3rd and 4th grade, introduction to Bolivian dance and ballet sets basic
                          technique and cultural identity, prioritizing enjoyment of movement, integral development, and
                          artistic habits at an age-appropriate pace.
                        </p>
                      </div>
                    </article>

                    <article className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 bg-hs-yellow text-hs-bluenavy p-8 md:p-12 rounded-3xl shadow-xl">
                      <div className="md:col-span-6 md:order-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/33.JPG"
                          alt="Second Specialty Cycle"
                          className="w-full rounded-[24px] object-cover shadow-md"
                        />
                      </div>
                      <div className="md:col-span-6 md:order-2">
                        <h4 className="text-2xl md:text-3xl font-bold mb-6">
                          Second Specialty Cycle (5th Grade to 12th Grade)
                        </h4>
                        <p className="text-base md:text-lg opacity-90 leading-relaxed text-justify">
                          This cycle focuses on technical, artistic, and disciplinary formation, progressing from basic
                          to advanced. Level groupings (C1, C2, C3, D1, D2, E, and Workshop) support diverse abilities
                          and learning paces. Ballet, jazz, Bolivian dance, and contemporary dance provide an integral,
                          versatile formation, strengthening classical technique, contemporary expression, and cultural
                          identity. It nurtures discipline, consistency, teamwork, and artistic responsibility,
                          preparing students for stage work, creative processes, and future higher education in dance or
                          performing arts.
                        </p>
                      </div>
                    </article>
                  </div>

                  {/* SCHEMAS - DANCE */}
                  <div className="space-y-12">
                    <div className="bg-hs-bluenavy text-hs-yellow p-8 md:p-12 rounded-3xl shadow-xl">
                      <h4 className="text-2xl md:text-3xl font-bold mb-8 text-center">First Cycle Schema (1st–4th Grade)</h4>
                      <Accordion
                        type="single"
                        collapsible
                        className="rounded-3xl border-2"
                        style={{ borderColor: "var(--hs-yellow)" }}
                      >
                        {danceFirstCycle.map((grade, idx) => (
                          <AccordionItem value={`grade-${idx}`} key={grade.label}>
                            <AccordionTrigger className="px-6 py-5 font-bold text-lg md:text-xl hover:bg-white/5">
                              {grade.label}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div
                                className="divide-y-2 rounded-2xl border-2 shadow-sm"
                                style={{ borderColor: "var(--hs-yellow)", backgroundColor: "var(--hs-blue-darker)" }}
                              >
                                {grade.rows.map((row, i) => (
                                  <div key={i} className="grid grid-cols-3 gap-4 px-6 py-5 hover:bg-white/5 items-center">
                                    <span className="font-bold text-base md:text-lg">{row.subject}</span>
                                    <span className="font-semibold text-sm md:text-base opacity-90">{row.freq}</span>
                                    <span className="font-semibold text-sm md:text-base opacity-80">{row.dur}</span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    <div className="bg-hs-yellow text-hs-bluenavy p-8 md:p-12 rounded-3xl shadow-xl">
                      <h4 className="text-2xl md:text-3xl font-bold mb-8 text-center">Second Cycle Schema (5th Grade–12th Grade)</h4>
                      <Accordion
                        type="single"
                        collapsible
                        className="rounded-3xl border-2"
                        style={{ borderColor: "var(--hs-bluenavy)" }}
                      >
                        {danceSecondCycle.map((group, idx) => (
                          <AccordionItem value={`group-${idx}`} key={group.label}>
                            <AccordionTrigger className="px-6 py-5 font-bold text-lg md:text-xl hover:bg-black/5">
                              {group.label}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div
                                className="divide-y-2 rounded-2xl border-2 shadow-sm"
                                style={{ borderColor: "var(--hs-bluenavy)", backgroundColor: "var(--hs-yellow-light)" }}
                              >
                                {group.rows.map((row, i) => (
                                  <div key={i} className="grid grid-cols-3 gap-4 px-6 py-5 hover:bg-black/5 items-center">
                                    <span className="font-bold text-base md:text-lg">{row.subject}</span>
                                    <span className="font-semibold text-sm md:text-base opacity-90">{row.freq}</span>
                                    <span className="font-semibold text-sm md:text-base opacity-80">{row.dur}</span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* MUSIC TAB */}
              <TabsContent value="music" className="pt-10">
                <div className="space-y-16 md:space-y-24">
                  
                  {/* VISIÓN Y MISIÓN */}
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-3xl p-8 md:p-10 bg-hs-bluenavy text-hs-yellow shadow-xl">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6">Mission</h3>
                      <p className="text-base md:text-lg opacity-90 leading-relaxed text-justify">
                        We are a national benchmark, leaders in the educational field, recognized for the high quality of
                        our services, forming an educational community of people with high values and social sensitivity,
                        committed to a culture of excellence and success in life.
                      </p>
                    </div>

                    <div className="rounded-3xl p-8 md:p-10 bg-hs-yellow text-hs-bluenavy shadow-xl">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6">Vision</h3>
                      <p className="text-base md:text-lg opacity-90 leading-relaxed text-justify">
                        Hughes Educational Unit is a bilingual education institution whose mission is to teach and form
                        integral, successful people through tools of academic and artistic excellence in a safe and
                        wellness environment. We have a committed team of specialized professionals in permanent updating
                        and research of teaching methodologies suited to constant changes, responding to the needs of
                        students, society, and the State.
                      </p>
                    </div>
                  </div>

                  {/* VALORES */}
                  <div className="bg-hs-bluenavy text-hs-yellow p-8 md:p-12 rounded-3xl shadow-xl">
                    <h3 className="text-3xl md:text-4xl font-bold mb-10 text-center">
                      Our Values
                    </h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {musicValues.map((value, idx) => (
                        <FlippableValueCard key={idx} value={value} />
                      ))}
                    </div>
                  </div>

                  {/* PROGRAMS OFFERED - MUSIC */}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-center text-hs-bluenavy mb-12">
                      Programs Offered
                    </h3>
                    <div className="space-y-12">
                      {musicTiers.map((tier, idx) => {
                        const isNavy = idx % 2 === 0;
                        
                        return (
                          <article
                            id={tier.id}
                            key={`music-${tier.id}`}
                            className={`grid grid-cols-1 items-center gap-10 scroll-mt-24 md:grid-cols-12 p-8 md:p-12 rounded-3xl shadow-xl transition-all duration-300 ${
                              isNavy ? "bg-hs-bluenavy text-hs-yellow" : "bg-hs-yellow text-hs-bluenavy"
                            }`}
                          >
                            <div
                              className={
                                tier.flipped ? "md:col-span-6 md:order-2" : "md:col-span-6 md:order-1"
                              }
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={tier.image} alt={tier.title} className="w-full rounded-[24px] object-cover shadow-md" />
                            </div>
                            <div
                              className={
                                tier.flipped ? "md:col-span-6 md:order-1" : "md:col-span-6 md:order-2"
                              }
                            >
                              <h4 className="text-2xl md:text-3xl font-bold mb-2">{tier.title}</h4>
                              {tier.subtitle && <p className="text-lg md:text-xl opacity-80 font-semibold mb-6">{tier.subtitle}</p>}
                              
                              {/* Removimos el "prose prose-slate" para estandarizar las fuentes con el resto de la página */}
                              <div className="text-base md:text-lg opacity-90 leading-relaxed text-justify">
                                {tier.body}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  );
}
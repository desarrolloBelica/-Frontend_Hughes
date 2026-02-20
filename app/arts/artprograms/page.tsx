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
        <p className="mb-3">
          Students are introduced to the <strong>musical language</strong> and choir practice,
          developing auditory and vocal skills.
        </p>
        <h4 className="font-semibold text-hughes-blue mb-2">Required Subjects:</h4>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Choir</li>
          <li>
            Musical Training (instrument exploration): recorder (1st–2nd grade), violin and guitar
            (3rd–4th grade)
          </li>
        </ul>
        <h4 className="font-semibold text-hughes-blue mb-2">Optional Individual Classes:</h4>
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
        <p className="mb-3">
          Students deepen their knowledge of theory, solfège, audio perception, and harmony.
        </p>
        <h4 className="font-semibold text-hughes-blue mb-2">Specialty Instrument:</h4>
        <p className="mb-3">
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
        <p className="mb-3">
          Group lessons in <strong>charango</strong>, <strong>guitar</strong>, native wind
          instruments, and voice. Students form the music group <strong>"Kusirima"</strong>, which
          participates in festivals and contests and provides live music for the school's Dance
          Ensemble.
        </p>
        <p className="mb-3">
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
        <ul className="space-y-4">
          <li>
            <strong className="text-hughes-blue text-lg">Workshop 1:</strong>
            <p className="mt-1">Takes into account each student's musical conditions when learning an instrument within folkloric music specialty. Develops aptitudes regarding instrument preference. Includes singing as part of the program. Covers brief history of Bolivian folk music, geographical references of instruments, their characteristics (string, wind, or percussion), classification of music by regions, and importance as cultural and social identity.</p>
          </li>
          <li>
            <strong className="text-hughes-blue text-lg">Workshop 2:</strong>
            <p className="mt-1">Retrospective of Workshop 1 with emphasis on instrument practice. Deepens execution, enriches repertoire, and works in groups, highlighting the importance of community work as foundation of our customs.</p>
          </li>
          <li>
            <strong className="text-hughes-blue text-lg">Workshop A:</strong>
            <p className="mt-1">Evaluates the entire learning process and progress in previous levels, including instrument execution, repertoire knowledge, and theoretical content. This group is the gateway to the Kusirima folkloric group, where students must demonstrate mastery of everything learned.</p>
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
      className="relative h-20 w-full cursor-pointer"
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
          className="absolute inset-0 flex flex-col justify-center items-center gap-2 rounded-2xl border-3 p-4 text-center bg-blue-navy"
          style={{
            borderColor: "var(--hs-yellow)",
            backfaceVisibility: "hidden",
            backgroundColor: "var(--hs-white)",
            borderWidth: "3px",
          }}
        >
          <h4 className="text-base font-bold leading-tight text-hs-blue">{value.title}</h4>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center gap-2 rounded-2xl border-3 p-4 text-center bg-hs-yellow/10"
          style={{
            borderColor: "var(--hs-yellow)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderWidth: "3px",
          }}
        >
          <p className="text-xs font-bold leading-tighttext-hughes-blue">{value.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ArtProgramsPage() {
  return (
    <main className="min-h-screen">
      {/* HERO estilo BASIS (texto izq + imagen der) */}
      
      <section className="section-gradient-soft-yellow">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Texto */}
          <div className="md:col-span-6">
            {/* acentos gráficos opcionales */}
            <div className="mb-6 flex items-end gap-2 leading-none">
              <Music className="h-8 w-8 text-[var(--hs-blue)]" strokeWidth={2.6} />
              <Music2 className="h-9 w-9 text-hughes-blue -mb-0.5" strokeWidth={2.6} />
              <Music className="h-6 w-6 text-[var(--hs-blue)] translate-y-0.5" strokeWidth={2.6} />
            </div>

            <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-hughes-blue">
              Performing Arts Programs 
            </h1>
            <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-hughes-blue">
              Dance & Music 
            </h1>

            <p className="mt-5 max-w-2xl text-lg md:text-xl text-hughes-blue/80">
              A complete journey from early musical exploration to specialization, with choir training, individual lessons, and a strong program in Bolivian Folk Music that celebrates identity and tradition.
            </p>

          
          </div>

          {/* Imagen */}
          <div className="md:col-span-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="Performing arts students"
              className="w-full rounded-[24px] object-cover"
            />
          </div>
        </div>
        
        
      </section>

           {/* Intro */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-2">
          <div
            className="rounded-3xl border bg-[#f9fafc] p-6 md:p-8 text-hughes-blue leading-relaxed relative -top-4"
            style={{ borderColor: "var(--hs-yellow)" }}
          >
            <div className="prose prose-slate max-w-none text-justify">
              <p>
                Hughes Schools’ Art Programs accompany students from their first steps in music to
                advanced artistic goals. The program integrates choir, theory, and individual
                instrumental practice, alongside a strong component of{" "}
                <strong>Bolivian Folk Music</strong> that fosters cultural identity and belonging.
              </p>
            </div>
          </div>
        </div>
        
        
      </section>
      <section className="section-gradient">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 pb-24 md:pb-36">
        <div id="programs" className="space-y-8">
          <Tabs defaultValue="dance" className="w-full">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <TabsList className="bg-white/80 shadow-sm h-10">
                  <TabsTrigger 
                    value="dance"
                    className="data-[state=active]:bg-[var(--hs-yellow)] data-[state=active]:text-[var(--hs-blue)] data-[state=active]:font-bold"
                  >
                    Dance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="music"
                    className="data-[state=active]:bg-[var(--hs-yellow)] data-[state=active]:text-[var(--hs-blue)] data-[state=active]:font-bold"
                  >
                    Music
                  </TabsTrigger>
                </TabsList>
                <Link
                  href="/arts/theater"
                  className="btn-motion-dark"
                 
                 >
            <span className="btn-bg" />
            <span className="btn-text">Go to Hughes' Theater</span>
                </Link>
              </div>

              <TabsContent value="dance" className="pt-6">
                <div className="space-y-16 md:space-y-20">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div
                      className="bg-card-premium rounded-3xl border p-6 md:p-8"
                      style={{ borderColor: "var(--hs-yellow)" }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-hughes-blue mb-4">Vision</h3>
                      <p className="text-hughes-blue/90 leading-relaxed text-justify">
                        To be a dance program of artistic and academic excellence, recognized for the integral
                        formation of sensitive, creative, and technically prepared students, capable of expressing
                        themselves through movement, valuing cultural diversity—especially Bolivian dance—and
                        projecting confidently toward higher studies and the professional field of performing arts.
                      </p>
                    </div>
                    <div
                      className="bg-card-premium rounded-3xl border p-6 md:p-8"
                      style={{ borderColor: "var(--hs-yellow)" }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-hughes-blue mb-4">Mission</h3>
                      <p className="text-hughes-blue/90 leading-relaxed text-justify">
                        To train students in dance from childhood to adolescence through a progressive, inclusive, and
                        systematic educational process that develops bodily, technical, musical, and expressive
                        skills. The program promotes discipline, creativity, cultural identity, and collaborative work,
                        integrating different dance techniques and musical training as the basis for comprehensive
                        artistic education.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-16">
                    <h3 className="text-2xl md:text-3xl font-bold text-hughes-blue">Programs Offered</h3>

                    <article className="grid grid-cols-1 items-center gap-10 scroll-mt-24 md:grid-cols-12">
                      <div className="md:col-span-6 md:order-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/32.JPG"
                          alt="First Study Cycle"
                          className="w-full rounded-[24px] object-cover"
                        />
                      </div>
                      <div className="md:col-span-6 md:order-2">
                        <h4 className="text-xl md:text-2xl font-bold text-hughes-blue mb-3">
                          First Study Cycle (1st to 4th Grade)
                        </h4>
                        <p className="text-hughes-blue/90 leading-relaxed text-justify">
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

                    <article className="grid grid-cols-1 items-center gap-10 scroll-mt-24 md:grid-cols-12">
                      <div className="md:col-span-6 md:order-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/33.JPG"
                          alt="Second Specialty Cycle"
                          className="w-full rounded-[24px] object-cover"
                        />
                      </div>
                      <div className="md:col-span-6 md:order-2">
                        <h4 className="text-xl md:text-2xl font-bold text-hughes-blue mb-3">
                          Second Specialty Cycle (5th Grade to 12th Grade)
                        </h4>
                        <p className="text-hughes-blue/90 leading-relaxed text-justify">
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

                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-hughes-blue mb-4">First Cycle Schema (1st–4th Grade)</h4>
                      <Accordion
                        type="single"
                        collapsible
                        className="rounded-3xl border-2"
                        style={{ borderColor: "var(--hs-yellow)" }}
                      >
                        {danceFirstCycle.map((grade, idx) => (
                          <AccordionItem value={`grade-${idx}`} key={grade.label}>
                            <AccordionTrigger className="px-6 py-4 text-hughes-blue font-bold text-lg hover:bg-hs-yellow/10">
                              {grade.label}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div
                                className="divide-y-2 rounded-2xl border-2 bg-white shadow-sm"
                                style={{ borderColor: "var(--hs-yellow)"}}
                              >
                                {grade.rows.map((row, i) => (
                                  <div key={i} className="grid grid-cols-3 gap-4 px-6 py-4 text-hughes-blue hover:bg-hs-yellow/5">
                                    <span className="font-bold text-base">{row.subject}</span>
                                    <span className="font-semibold text-hs-blue">{row.freq}</span>
                                    <span className="font-semibold text-hughes-blue/80">{row.dur}</span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-hughes-blue mb-4">Second Cycle Schema (5th Grade–12th Grade)</h4>
                      <Accordion
                        type="single"
                        collapsible
                        className="rounded-3xl border-2"
                        style={{ borderColor: "var(--hs-yellow)" }}
                      >
                        {danceSecondCycle.map((group, idx) => (
                          <AccordionItem value={`group-${idx}`} key={group.label}>
                            <AccordionTrigger className="px-6 py-4 text-hughes-blue font-bold text-lg hover:bg-hs-yellow/10">
                              {group.label}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div
                                className="divide-y-2 rounded-2xl border-2 bg-white shadow-sm"
                                style={{ borderColor: "var(--hs-yellow)" }}
                              >
                                {group.rows.map((row, i) => (
                                  <div key={i} className="grid grid-cols-3 gap-4 px-6 py-4 text-hughes-blue hover:bg-hs-yellow/5">
                                    <span className="font-bold text-base">{row.subject}</span>
                                    <span className="font-semibold text-hs-blue">{row.freq}</span>
                                    <span className="font-semibold text-hughes-blue/80">{row.dur}</span>
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

              <TabsContent value="music" className="pt-6">
                <div className="space-y-16 md:space-y-20">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div
                      className="bg-card-premium rounded-3xl border p-6 md:p-8"
                      style={{ borderColor: "var(--hs-yellow)" }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-hughes-blue mb-4">Mission</h3>
                      <p className="text-hughes-blue/90 leading-relaxed text-justify">
                        We are a national benchmark, leaders in the educational field, recognized for the high quality of
                        our services, forming an educational community of people with high values and social sensitivity,
                        committed to a culture of excellence and success in life.
                      </p>
                    </div>

                    <div
                      className="bg-card-premium rounded-3xl border p-6 md:p-8"
                      style={{ borderColor: "var(--hs-yellow)" }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-hughes-blue mb-4">Vision</h3>
                      <p className="text-hughes-blue/90 leading-relaxed text-justify">
                        Hughes Educational Unit is a bilingual education institution whose mission is to teach and form
                        integral, successful people through tools of academic and artistic excellence in a safe and
                        wellness environment. We have a committed team of specialized professionals in permanent updating
                        and research of teaching methodologies suited to constant changes, responding to the needs of
                        students, society, and the State.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-hughes-blue mb-6">
                      Our Values
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {musicValues.map((value, idx) => (
                        <FlippableValueCard key={idx} value={value} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-hughes-blue mb-8">
                      Programs Offered
                    </h3>
                    <div className="space-y-16 md:space-y-24">
                      {musicTiers.map((tier) => (
                        <article
                          id={tier.id}
                          key={`music-${tier.id}`}
                          className="grid grid-cols-1 items-center gap-10 scroll-mt-24 md:grid-cols-12"
                        >
                          <div
                            className={
                              tier.flipped ? "md:col-span-6 md:order-2" : "md:col-span-6 md:order-1"
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={tier.image} alt={tier.title} className="w-full rounded-[24px] object-cover" />
                          </div>
                          <div
                            className={
                              tier.flipped ? "md:col-span-6 md:order-1" : "md:col-span-6 md:order-2"
                            }
                          >
                            <h2 className="text-2xl md:text-3xl font-bold text-hughes-blue">{tier.title}</h2>
                            {tier.subtitle && <p className="mt-1 text-hughes-blue/70">{tier.subtitle}</p>}
                            <div className="prose prose-slate mt-4 max-w-none text-hughes-blue text-justify">{tier.body}</div>
                          </div>
                        </article>
                      ))}
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

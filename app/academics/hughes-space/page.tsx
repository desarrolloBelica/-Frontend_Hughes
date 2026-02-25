"use client";

import Image from "next/image";
import { Rocket, BookOpen, Users, Target, Award, Star, Sparkles, Zap } from "lucide-react";
// import { CountingNumber } from "@/components/CountingNumber"; // Asegúrate de usarlo si lo necesitas

type Program = {
  id: string;
  title: string;
  audience: string;
  description: string;
  highlight?: boolean;
};

const programs: Program[] = [
  {
    id: "space-curriculum",
    title: "Space Curriculum",
    audience: "1st Grade - 12th Grade",
    description: "Our program for the youngest students. The goal is to set our students on a path that provides them with a future full of academic opportunities.",
    highlight: false,
  },
  {
    id: "united-space-school",
    title: "United Space School Selection",
    audience: "High School Students",
    description: "Our main program, with over 400 applicants from all over Latin America. Only 21 of the best students nationwide are accepted. This is where we choose and present our candidates for the United Space School camp held in the United States of America.",
    highlight: true,
  },
];

// Componente para la línea divisoria
const Divider = () => (
  <div className="flex justify-center my-8">
    <div 
      className="w-24 h-[2px] rounded-full opacity-70 bg-hs-yellow" 
    />
  </div>
);

export default function HughesSpacePage() {
  return (
    /* Contenedor principal con el fondo aplicado a TODA la página */
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-slate-900/50 to-slate-950" />
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iODAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iMTQwIiByPSIwLjgiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTcwIiByPSIxLjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxNjAiIHI9IjAuOSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz48L3N2Zz4=')] opacity-80" />
      
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center space-y-10">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80 sm:w-82 sm:h-82">
                <Image
                  src="/HS Space School.png"
                  alt="Hughes Space School"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-hs-yellow leading-tight">
              Hughes Space School
            </h1>
            {/* Slogan */}
            <div className="space-y-2">
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-hs-yellow opacity-90">
                The place to find your passion.
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-black italic text-hs-yellow">
                FOR SPACE!!
              </p>
            </div>
            {/* Icon decoration */}
            <div className="flex justify-center gap-6 pt-6 text-hs-yellow">
              <Rocket className="w-8 h-8 opacity-70 animate-bounce" />
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              <Star className="w-8 h-8" />
              <Zap className="w-8 h-8 animate-pulse" />
              <Rocket className="w-8 h-8 opacity-70 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </section>

        <Divider />

        {/* What is HSS Section */}
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl">
            {/* Section Title */}
            <div className="flex items-center justify-center gap-3 mb-8 text-hs-yellow">
              <BookOpen className="w-10 h-10" />
              <h2 className="text-4xl sm:text-5xl font-bold">
                What is HSS?
              </h2>
            </div>
            {/* Content */}
            <div className="space-y-6 text-lg md:text-xl text-white opacity-90 leading-relaxed font-medium text-justify">
              <p className="text-xl md:text-2xl font-bold text-hs-yellow text-center">
                Hughes Space School is the largest space education organization in Bolivia.
              </p>
              <p>
                At the heart of our teaching method is <strong className="text-hs-yellow">enthusiasm</strong>. Through 
                enthusiasm and passion for space, we teach from the most basic algebra to 
                space science.
              </p>
              <p>
                In addition to this, we are responsible for recruiting and selecting Bolivian 
                and Latin American students for the <strong className="text-hs-yellow">United Space School</strong> camp 
                in the USA.
              </p>
              <div className="mt-8 p-8 md:p-10 rounded-3xl text-center border-2 border-hs-yellow bg-white/5 backdrop-blur-sm shadow-xl">
                <p className="text-2xl font-bold text-hs-yellow">
                  A strong curriculum, incredible university prospects, and a bright future 
                  await Hughes Space School students.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Our Learning Section */}
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            {/* Section Title */}
            <div className="flex items-center justify-center gap-3 mb-12 text-hs-yellow">
              <Target className="w-10 h-10" />
              <h2 className="text-4xl sm:text-5xl font-bold">
                Our Learning
              </h2>
            </div>
            {/* Learning Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-hs-bluenavy/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-hs-yellow/30 hover:border-hs-yellow transition-all duration-300">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-hs-yellow text-hs-bluenavy">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-hs-yellow">
                  Exact Sciences Focus
                </h3>
                <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                  We have a focus on exact sciences (mathematics, physics, and chemistry), and 
                  we inspire our students to apply themselves in these fields. The best way to 
                  learn exact sciences is to see them in action. <strong className="text-hs-yellow">There&apos;s no more 
                  fun way to learn!</strong>
                </p>
              </div>
              {/* Card 2 */}
              <div className="bg-hs-bluenavy/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-hs-yellow/30 hover:border-hs-yellow transition-all duration-300">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-hs-yellow text-hs-bluenavy">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-hs-yellow">
                  Leadership & Cooperation
                </h3>
                <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                  In addition to inspiring our students to use their intelligence in exact sciences, 
                  we create in them a capacity for leadership and cooperation. Because to solve the 
                  greatest problems, we need the most capable leaders.
                </p>
              </div>
              {/* Card 3 */}
              <div className="bg-hs-bluenavy/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-hs-yellow/30 hover:border-hs-yellow transition-all duration-300">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-hs-yellow text-hs-bluenavy">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-hs-yellow">
                  Passion for Excellence
                </h3>
                <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                  Finally, the most important thing... Every person who achieved something great 
                  did so because they had a passion for the subject. We seek to create that passion 
                  in our students.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Programs Section */}
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4 text-hs-yellow">
              <Award className="w-10 h-10" />
              <h2 className="text-4xl sm:text-5xl font-bold">
                Our Programs
              </h2>
            </div>
            <p className="text-xl text-white opacity-80 max-w-2xl mx-auto mt-4 font-medium">
              Click to learn more and enroll
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {programs.map((program) => (
              <div
                key={program.id}
                className={`relative group bg-hs-bluenavy/60 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-300 border-2 hover:scale-[1.02] hover:-translate-y-2 ${
                  program.highlight 
                    ? 'border-hs-yellow shadow-[0_0_30px_rgba(234,179,8,0.2)]' 
                    : 'border-white/20 hover:border-hs-yellow'
                }`}
              >
                {/* Highlight badge */}
                {program.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-sm shadow-lg bg-hs-yellow text-hs-bluenavy">
                    ⭐ Featured Program
                  </div>
                )}
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg ${program.highlight ? 'bg-hs-yellow text-hs-bluenavy' : 'bg-white/10 text-hs-yellow'}`}>
                  <Rocket className="w-8 h-8" />
                </div>
                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-hs-yellow">
                  {program.title}
                </h3>
                <p className="text-lg font-bold mb-6 text-white opacity-90">
                  {program.audience}
                </p>
                <p className="text-base md:text-lg text-white opacity-80 leading-relaxed mb-8 font-medium">
                  {program.description}
                </p>
                {/* CTA Button */}
                <a
                  href={
                    program.id === 'space-curriculum' 
                      ? '/academics/hughes-space/curriculum' 
                      : program.id === 'united-space-school'
                      ? '/academics/hughes-space/united-space-school'
                      : '#'
                  }
                  className={`block w-full py-4 px-6 rounded-full font-bold text-lg text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                    program.highlight 
                      ? 'bg-hs-yellow text-hs-bluenavy' 
                      : 'bg-transparent border-2 border-hs-yellow text-hs-yellow hover:bg-hs-yellow hover:text-hs-bluenavy'
                  }`}
                >
                  Learn More & Enroll
                </a>
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </main>
  );
}
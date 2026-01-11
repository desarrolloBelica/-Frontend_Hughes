"use client";

import Image from "next/image";
import { Rocket, BookOpen, Users, Target, Award, Star } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

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

export default function HughesSpacePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-slate-900/50 to-slate-950" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iODAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iMTQwIiByPSIwLjgiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTcwIiByPSIxLjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxNjAiIHI9IjAuOSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz48L3N2Zz4=')] opacity-40" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center space-y-10">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40 sm:w-52 sm:h-52">
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              Hughes Space School
            </h1>
            
            {/* Slogan */}
            <div className="space-y-2">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/90">
                The place to find your passion.
              </p>
              <p 
                className="text-3xl sm:text-4xl lg:text-5xl font-black italic"
                style={{ color: BRAND.yellow }}
              >
                FOR SPACE!!
              </p>
            </div>
            
            {/* Icon decoration */}
            <div className="flex justify-center gap-6 pt-6">
              <Rocket className="w-8 h-8 text-white/70 animate-bounce" />
              <Star className="w-8 h-8" style={{ color: BRAND.yellow }} />
              <Rocket className="w-8 h-8 text-white/70 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* What is HSS Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl">
            {/* Section Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <BookOpen className="w-10 h-10" style={{ color: BRAND.blue }} />
              <h2 
                className="text-4xl sm:text-5xl font-bold"
                style={{ color: BRAND.blue }}
              >
                What is HSS?
              </h2>
            </div>
            
            {/* Content */}
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-semibold" style={{ color: BRAND.blue }}>
                Hughes Space School is the largest space education organization in Bolivia.
              </p>
              
              <p>
                At the heart of our teaching method is <strong>enthusiasm</strong>. Through 
                enthusiasm and passion for space, we teach from the most basic algebra to 
                space science.
              </p>
              
              <p>
                In addition to this, we are responsible for recruiting and selecting Bolivian 
                and Latin American students for the <strong>United Space School</strong> camp 
                in the USA.
              </p>
              
              <div 
                className="mt-8 p-8 rounded-2xl text-center border-2"
                style={{ 
                  backgroundColor: 'rgba(var(--hs-blue-rgb), 0.05)',
                  borderColor: BRAND.blue 
                }}
              >
                <p className="text-2xl font-bold" style={{ color: BRAND.blue }}>
                  A strong curriculum, incredible university prospects, and a bright future 
                  await Hughes Space School students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Learning Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            {/* Section Title */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <Target className="w-10 h-10" style={{ color: BRAND.blue }} />
              <h2 
                className="text-4xl sm:text-5xl font-bold"
                style={{ color: BRAND.blue }}
              >
                Our Learning
              </h2>
            </div>
            
            {/* Learning Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Exact Sciences */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(var(--hs-blue-rgb), 0.1)' }}
                >
                  <BookOpen className="w-8 h-8" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.blue }}>
                  Exact Sciences Focus
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We have a focus on exact sciences (mathematics, physics, and chemistry), and 
                  we inspire our students to apply themselves in these fields. The best way to 
                  learn exact sciences is to see them in action. <strong>There&apos;s no more 
                  fun way to learn!</strong>
                </p>
              </div>

              {/* Card 2: Leadership */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(var(--hs-blue-rgb), 0.1)' }}
                >
                  <Users className="w-8 h-8" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.blue }}>
                  Leadership & Cooperation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  In addition to inspiring our students to use their intelligence in exact sciences, 
                  we create in them a capacity for leadership and cooperation. Because to solve the 
                  greatest problems, we need the most capable leaders.
                </p>
              </div>

              {/* Card 3: Passion */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(var(--hs-blue-rgb), 0.1)' }}
                >
                  <Star className="w-8 h-8" style={{ color: BRAND.yellow }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.blue }}>
                  Passion for Excellence
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Finally, the most important thing... Every person who achieved something great 
                  did so because they had a passion for the subject. We seek to create that passion 
                  in our students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-10 h-10" style={{ color: BRAND.blue }} />
              <h2 
                className="text-4xl sm:text-5xl font-bold"
                style={{ color: BRAND.blue }}
              >
                Our Programs
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
              Click to learn more and enroll
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className={`relative group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                  program.highlight 
                    ? 'border-[var(--hs-yellow)]' 
                    : 'border-gray-200 hover:border-[var(--hs-blue)]'
                }`}
              >
                {/* Highlight badge */}
                {program.highlight && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-sm shadow-lg"
                    style={{ 
                      backgroundColor: BRAND.yellow,
                      color: BRAND.blue 
                    }}
                  >
                    ⭐ Featured Program
                  </div>
                )}

                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ 
                    backgroundColor: program.highlight 
                      ? 'rgba(var(--hs-yellow-rgb), 0.2)' 
                      : 'rgba(var(--hs-blue-rgb), 0.1)' 
                  }}
                >
                  <Rocket 
                    className="w-8 h-8" 
                    style={{ color: program.highlight ? BRAND.yellow : BRAND.blue }} 
                  />
                </div>

                {/* Content */}
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: BRAND.blue }}
                >
                  {program.title}
                </h3>
                
                <p 
                  className="text-sm font-semibold mb-4"
                  style={{ color: program.highlight ? BRAND.yellow : BRAND.blue }}
                >
                  {program.audience}
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
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
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: program.highlight ? BRAND.yellow : BRAND.blue,
                    color: program.highlight ? BRAND.blue : 'white',
                  }}
                >
                  Learn More & Enroll
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center text-white space-y-6">
            <Rocket className="w-16 h-16 mx-auto" style={{ color: BRAND.yellow }} />
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Start Your Space Journey?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join Bolivia&apos;s premier space education program and reach for the stars
            </p>
            <button
              className="mt-6 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: BRAND.yellow,
                color: BRAND.blue,
              }}
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import { Globe, Scale, MessagesSquare, Award, BookOpen, ChevronDown } from "lucide-react";

export default function HSMUNPage() {
  return (
    <main className="min-h-screen bg-hs-bluenavy">
      
      {/* 1. HERO SECTION REDISEÑADO - Imponente, Global y Diplomático */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        
        {/* --- Capas de Fondo --- */}
        {/* 1. Imagen de fondo (Placeholder: red global/conexiones) */}
        <div className="absolute inset-0">
           {/* IMPORTANTE: Reemplaza '/images/mun-bg.jpg' con una foto real de alta calidad. 
               Sugerencias: Un globo terráqueo abstracto, una sala de asamblea general de la ONU, 
               o una red de luces interconectadas. */}
           <Image 
               src="/images/program-high.jpg" // Usando la que tenías de ejemplo temporalmente
               alt="Global Connections Background"
               fill
               className="object-cover scale-110 blur-sm" // Un ligero blur y escala para profundidad
               priority
           />
        </div>
        {/* 2. Superposición de color de marca (Crucial para el contraste) */}
        <div className="absolute inset-0 bg-hs-bluenavy/90 mix-blend-multiply" />
        {/* 3. Gradiente radial sutil para dar foco al centro */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--hs-bluenavy)_90%)]" />
        
        {/* --- Contenido Principal --- */}
        <div className="relative z-20 mx-auto max-w-5xl px-6 text-center flex flex-col items-center">
          
          {/* Icono superior decorativo */}
          <Globe className="w-16 h-16 text-hs-yellow mb-8 opacity-80" />

          {/* Título Principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-hs-yellow tracking-tight leading-none mb-6 drop-shadow-2xl">
            Hughes Schools <br />
            <span className="text-white">Model United Nations</span>
          </h1>
          
          {/* LA LÍNEA AMARILLA CORTA Y DELGADA SOLICITADA */}
          <div className="h-[3px] w-40 bg-hs-yellow rounded-full my-8 shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          
          {/* Subtítulo */}
          <p className="text-xl md:text-3xl text-white opacity-90 font-light max-w-4xl leading-relaxed drop-shadow-md">
            Fostering critical thinking, leadership, and global diplomacy through the highest-level simulation of the United Nations.
          </p>

        </div>
      </section>


      {/* 2. PILLARS OF DIPLOMACY (Desglose de la introducción) */}
      <section className="py-20 md:py-32 relative z-10 bg-hs-bluenavy">
        <div className="mx-auto max-w-7xl px-6">
          {/* Intro Text */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">More Than a Simulation</h2>
             <p className="text-lg text-white/80 leading-relaxed">
               HSMUN is an academic space that challenges students to step into the shoes of world leaders, debating current global issues with an international perspective.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-hs-bluenavy/80 backdrop-blur-xl border-2 border-hs-yellow/20 hover:border-hs-yellow transition-all duration-500 rounded-3xl p-10 shadow-2xl hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-2xl bg-hs-yellow/10 border border-hs-yellow/30 flex items-center justify-center mb-8 shadow-lg group-hover:bg-hs-yellow group-hover:text-hs-bluenavy transition-colors duration-500 text-hs-yellow">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-hs-yellow mb-4">Academic Rigor</h3>
              <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                Delegates represent official national stances, draft working papers, and negotiate resolutions, immersing themselves in formal UN parliamentary procedures.
              </p>
            </div>

            {/* Pillar 2 */}
            {/* Tarjeta central destacada en Amarillo */}
            <div className="bg-hs-yellow border-2 border-hs-yellow transition-all duration-500 rounded-3xl p-10 shadow-2xl hover:-translate-y-2 text-hs-bluenavy scale-105 z-10 relative">
              <div className="w-16 h-16 rounded-2xl bg-hs-bluenavy flex items-center justify-center mb-8 shadow-lg text-hs-yellow">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
              <p className="text-base md:text-lg opacity-90 leading-relaxed font-medium">
                As an open-invitation conference, we welcome distinguished delegations from other schools, cultivating a diverse and rigorous environment for international debate.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-hs-bluenavy/80 backdrop-blur-xl border-2 border-hs-yellow/20 hover:border-hs-yellow transition-all duration-500 rounded-3xl p-10 shadow-2xl hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-2xl bg-hs-yellow/10 border border-hs-yellow/30 flex items-center justify-center mb-8 shadow-lg group-hover:bg-hs-yellow group-hover:text-hs-bluenavy transition-colors duration-500 text-hs-yellow">
                <MessagesSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-hs-yellow mb-4">Essential Skills</h3>
              <p className="text-base md:text-lg text-white opacity-90 leading-relaxed font-medium">
                Beyond the debate, HSMUN strengthens vital interpersonal skills: public speaking, deep research, negotiation, and collaborative teamwork for future professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE SECRETARIAT (Layout Alternado) */}
      <section className="py-20 md:py-32 bg-hs-yellow text-hs-bluenavy relative overflow-hidden">
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_top_left,_var(--hs-bluenavy)_10%,_transparent_10.5%)] bg-[length:40px_40px]" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] lg:h-[600px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-hs-bluenavy/10 rotate-2 hover:rotate-0 transition-all duration-700">
              <Image 
                src="/images/program-high.jpg" 
                alt="HSMUN Secretariat" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-hs-bluenavy/10 mix-blend-multiply" />
            </div>
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-hs-bluenavy/10">
                <Award className="w-6 h-6" />
                <span className="text-base font-bold tracking-wider uppercase">Organizing Body</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
                A Secretariat of Excellence
              </h2>
              <div className="space-y-6 text-xl font-medium opacity-90 leading-relaxed text-justify">
                <p>
                  The HSMUN Secretariat is exclusively composed of outstanding senior students (12th grade), selected through a rigorous evaluation of their MUN expertise, leadership, and dedication.
                </p>
                <p>
                  From the beginning of the academic year, they take full responsibility for planning the conference—defining forums, writing academic background guides, and coordinating logistics to ensure the highest standards of academic and organizational quality. Their work reflects commitment, excellence, and a profound vocation for service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HSMINIMUN (Layout Alternado) */}
      <section className="py-20 md:py-32 bg-hs-bluenavy text-hs-yellow relative">
         {/* Decoración de fondo sutil */}
         <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--hs-yellow)_10%,_transparent_10.5%)] bg-[length:40px_40px]" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-hs-yellow/10 border border-hs-yellow/30 text-hs-yellow">
                <BookOpen className="w-6 h-6" />
                <span className="text-base font-bold tracking-wider uppercase">Foundation Program</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold leading-none text-white">
                HSminimun
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-hs-yellow mb-6">
                 Cultivating Early Leaders
              </h3>
              <div className="space-y-6 text-xl font-medium text-white opacity-90 leading-relaxed text-justify">
                <p>
                  As part of our continuous educational journey, we host <strong>HSminimun</strong>—an internal conference tailored for elementary and middle school students (4th grade to 9th grade). This space introduces younger minds to the dynamics of debate, research, and public speaking from an early age.
                </p>
                <p>
                  The HSminimun Secretariat is led by junior students (11th grade), providing them with the vital organizational leadership experience needed. By their senior year, these students will be fully prepared to seamlessly transition into leading the main HSMUN external conference, ensuring a strong generational relay.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative h-[500px] lg:h-[600px] rounded-[40px] overflow-hidden shadow-2xl border-2 border-hs-yellow/30 -rotate-2 hover:rotate-0 transition-all duration-700">
              <Image 
                src="/images/program-high.jpg" 
                alt="HSminimun delegates" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-hs-bluenavy/30 mix-blend-multiply" />
            </div>

          </div>
        </div>
      </section>

      {/* 5. CLOSING STATEMENT */}
      <section className="py-24 md:py-40 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-hs-yellow" />
        {/* Patrón de fondo para textura */}
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')]" /> 
        
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-hs-bluenavy">
          <Globe className="w-20 h-20 mx-auto mb-10 opacity-100 drop-shadow-xl animate-pulse" />
          <blockquote className="text-3xl md:text-5xl font-extrabold italic leading-snug mb-12 drop-shadow-sm font-serif">
            "HSMUN is more than just an academic simulation; it is a transformative experience that shapes the ethical, critical, and globally-minded leaders of tomorrow."
          </blockquote>
          <div className="h-2 w-32 bg-hs-bluenavy mx-auto rounded-full" />
        </div>
      </section>

    </main>
  );
}
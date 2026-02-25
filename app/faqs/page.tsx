// app/faqs/page.tsx
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Clock,
  UtensilsCrossed,
  Salad,
  Smartphone,
  GraduationCap,
  Bus,
  MessageCircleQuestion,
} from "lucide-react";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-hs-bluenavy">
      {/* HERO — Azul institucional con detalles divertidos */}
      <section className="relative overflow-hidden pt-16 pb-32">
        {/* blobs suaves amarillos para un toque amigable */}
        <div className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 rounded-full bg-hs-yellow/20 blur-[80px] animate-pulse" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-hs-yellow/10 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-6 relative z-10 flex flex-col items-center text-center">
          <MessageCircleQuestion className="w-20 h-20 text-hs-yellow mb-8 animate-bounce opacity-90" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Frequently Asked <span className="text-hs-yellow">Questions</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white opacity-90 font-medium max-w-2xl">
            Learn more about Hughes Schools, our policies, and student life. Find quick answers to the most common questions from families.
          </p>
        </div>
      </section>

      {/* CARD con FAQs */}
      <section className="-mt-16 pb-24 relative z-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-[40px] border-4 border-hs-bluenavy bg-hs-yellow p-6 md:p-10 shadow-2xl">
            
            <div className="border-b-2 border-hs-bluenavy/20 pb-6 mb-4 px-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-hs-bluenavy">
                General Information
              </h2>
            </div>

            <Accordion type="multiple" className="w-full">
              <FAQItem
                value="uniforms"
                icon={<ShieldCheck className="h-6 w-6 text-hs-bluenavy" />}
                question="What uniforms are used?"
              >
                Hughes Schools uses differentiated uniforms by level and
                activity. Students wear a formal daily uniform, a sports uniform
                for PE, and an artistic uniform for performances.
              </FAQItem>

              <Divider />

              <FAQItem
                value="schedule"
                icon={<Clock className="h-6 w-6 text-hs-bluenavy" />}
                question="What are the school hours?"
              >
                The school day runs from <strong>8:00 a.m. to 3:30 p.m.</strong>{" "}
                Monday to Friday. Extended hours are available for artistic
                workshops and extracurricular activities.
              </FAQItem>

              <Divider />

              <FAQItem
                value="cafeteria"
                icon={<UtensilsCrossed className="h-6 w-6 text-hs-bluenavy" />}
                question="Does the school have a cafeteria?"
              >
                Yes. Our cafeteria offers balanced, affordable meals and snacks.
              </FAQItem>

              <Divider />

              <FAQItem
                value="healthy"
                icon={<Salad className="h-6 w-6 text-hs-bluenavy" />}
                question="How is healthy eating promoted?"
              >
                Healthy habits are promoted with awareness campaigns, balanced
                menus, and limiting ultra-processed products on campus.
              </FAQItem>

              <Divider />

              <FAQItem
                value="devices"
                icon={<Smartphone className="h-6 w-6 text-hs-bluenavy" />}
                question="What is the policy on electronic devices?"
              >
                Personal devices are not permitted during class unless authorized
                for educational purposes.
              </FAQItem>

              <Divider />

              <FAQItem
                value="admissions-age"
                icon={<GraduationCap className="h-6 w-6 text-hs-bluenavy" />}
                question="From what age can students apply?"
              >
                Admission starts at <strong>Pre-Kindergarten</strong> (4 years old
                by June 30 of the entry year).
              </FAQItem>

              <Divider />

              <FAQItem
                value="transport"
                icon={<Bus className="h-6 w-6 text-hs-bluenavy" />}
                question="Does the school provide transportation?"
              >
                Yes. We offer safe, supervised bus service covering several areas
                of Cochabamba.
              </FAQItem>
            </Accordion>
            
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- helpers ---------- */

function FAQItem({
  value,
  icon,
  question,
  children,
}: {
  value: string;
  icon: React.ReactNode;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={value} className="group border-none">
      <AccordionTrigger className="text-left px-4 md:px-6 py-5 rounded-2xl hover:bg-white/30 data-[state=open]:bg-white/30 transition-all hover:no-underline focus:outline-none">
        <div className="flex items-center gap-4">
          <span className="shrink-0">{icon}</span>
          <span className="font-bold text-lg md:text-xl text-hs-bluenavy">{question}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 md:px-6 pb-6 pt-2">
        <p className="text-base md:text-lg font-medium text-hs-bluenavy opacity-90 leading-relaxed pl-10">
          {children}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

function Divider() {
  return <div className="mx-6 h-[2px] bg-hs-bluenavy/10 my-1" />;
}
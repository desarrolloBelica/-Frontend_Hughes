"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

// 🎨 Brand colors
const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

type SimpleItemProps = {
  href: string;
  label: string;
  newTab?: boolean;
};

function SimpleItem({ href, label, newTab = false }: SimpleItemProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          className="relative text-sm font-semibold tracking-wide px-1 py-1"
          style={{ color: BRAND.blue }}
        >
          {label}
          <motion.span
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.28 }}
            className="absolute left-0 bottom-0 h-[2px]"
            style={{ backgroundColor: BRAND.yellow }}
          />
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function ColLink({
  href,
  title,
  desc,
  newTab = false,
}: {
  href: string;
  title: string;
  desc?: string;
  newTab?: boolean;
}) {
  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className="block rounded-xl p-3 transition hover:bg-gray-50 focus:bg-gray-50"
    >
      <div className="text-sm font-semibold" style={{ color: BRAND.blue }}>
        {title}
      </div>
      {desc && <p className="mt-1 text-xs text-gray-600 leading-snug">{desc}</p>}
    </Link>
  );
}

/** 🔽 Item especial para hacer scroll animado al footer */
function ContactScrollItem({ label = "Contact" }: { label?: string }) {
  const onClick = React.useCallback(() => {
    const el = document.getElementById("footer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <NavigationMenuItem>
      {/* Usamos button para controlar el scroll con onClick */}
      <NavigationMenuLink asChild>
        <button
          type="button"
          onClick={onClick}
          className="relative text-sm font-semibold tracking-wide px-1 py-1"
          style={{ color: BRAND.blue }}
        >
          {label}
          <motion.span
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.28 }}
            className="absolute left-0 bottom-0 h-[2px]"
            style={{ backgroundColor: BRAND.yellow }}
          />
        </button>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export default function MenuList() {
  return (
    <>
      {/* Menú Izquierdo */}
      <NavigationMenu className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center">
        <NavigationMenuList className="flex items-center gap-6">
        {/* 🎓 Alumni - Con sub-navegación */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <motion.span
              initial="rest"
              animate="rest"
              whileHover="hover"
              className="relative inline-block text-sm font-semibold tracking-wide"
              style={{ color: BRAND.blue }}
            >
              Alumni
              <motion.span
                variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                transition={{ duration: 0.28 }}
                className="absolute left-0 bottom-0 h-[2px]"
                style={{ backgroundColor: BRAND.yellow }}
              />
            </motion.span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="min-w-[700px] max-w-[900px]">
              <div className="p-6 bg-white rounded-xl shadow-xl">
                <div className="space-y-4">
                  {/* Sección Principal Alumni */}
                  <div className="pb-3 border-b border-gray-200">
                    <ColLink href="/alumni" title="Alumni Network" desc="Connect with our global alumni community" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-x-8 gap-y-3">
                    {/* Academics */}
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Academics</h4>
                      <div className="space-y-1">
                        <ColLink href="/academics/programs" title="Academic Programs" />
                        <ColLink href="/academics/learning-env" title="Our Learning Environment" />
                        <ColLink href="/academics/graduates" title="Where Our Graduates Go" />
                      </div>
                    </div>
                    
                    {/* Performing Arts */}
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Performing Arts</h4>
                      <div className="space-y-1">
                        <ColLink href="/arts/artprograms" title="Art Programs" />
                      </div>
                    </div>
                    
                    {/* Events */}
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Events</h4>
                      <div className="space-y-1">
                        <ColLink href="/events" title="Events Recap" />
                        <ColLink href="/events/calendar" title="Events Calendar" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 📝 Admissions - Con Resources */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <motion.span
              initial="rest"
              animate="rest"
              whileHover="hover"
              className="relative inline-block text-sm font-semibold tracking-wide"
              style={{ color: BRAND.blue }}
            >
              Admissions
              <motion.span
                variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                transition={{ duration: 0.28 }}
                className="absolute left-0 bottom-0 h-[2px]"
                style={{ backgroundColor: BRAND.yellow }}
              />
            </motion.span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-max min-w-[350px] max-w-[90vw]">
              <div className="grid grid-cols-1 gap-3 p-6 bg-white rounded-xl shadow-xl">
                <ColLink href="/admissions" title="Apply Now" desc="Start your application process" />
                <ColLink href="/resources" title="Resources" desc="Additional information for applicants" />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* ℹ️ About Us - Con Staff y más */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <motion.span
              initial="rest"
              animate="rest"
              whileHover="hover"
              className="relative inline-block text-sm font-semibold tracking-wide"
              style={{ color: BRAND.blue }}
            >
              About Us
              <motion.span
                variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                transition={{ duration: 0.28 }}
                className="absolute left-0 bottom-0 h-[2px]"
                style={{ backgroundColor: BRAND.yellow }}
              />
            </motion.span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="min-w-[550px] max-w-[90vw]">
              <div className="p-6 bg-white rounded-xl shadow-xl">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div className="space-y-2">
                    <ColLink href="/about" title="Our Story" desc="Learn about Hughes Schools" />
                    <ColLink href="/academics/undergraduate" title="Why Choose Hughes Schools?" />
                    <ColLink href="/news" title="News & Updates" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Our Team</h4>
                    <ColLink href="/academics/academic-staff" title="Academic Staff" />
                    <ColLink href="/arts/art-staff" title="Art Staff" />
                    <div className="pt-2">
                      <ColLink href="/faqs" title="FAQs" desc="Common questions answered" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 🚪 Portal - Con Student y Parent */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <motion.span
              initial="rest"
              animate="rest"
              whileHover="hover"
              className="relative inline-block text-sm font-semibold tracking-wide"
              style={{ color: BRAND.blue }}
            >
              Portal
              <motion.span
                variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                transition={{ duration: 0.28 }}
                className="absolute left-0 bottom-0 h-[2px]"
                style={{ backgroundColor: BRAND.yellow }}
              />
            </motion.span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-max min-w-[450px] max-w-[90vw]">
              <div className="grid grid-cols-2 gap-4 p-6 bg-white rounded-xl shadow-xl">
                {/* Student Portal */}
                <Link
                  href="/academics/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-2xl border border-gray-200 hover:border-[var(--hs-blue)] transition-colors"
                >
                  <div className="p-4">
                    <div className="text-sm font-semibold" style={{ color: BRAND.blue }}>
                      Student Portal
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      View your schedule, courses, and library resources.
                    </p>
                  </div>
                </Link>

                {/* Parent Portal */}
                <Link
                  href="/parents/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-2xl border border-gray-200 hover:border-[var(--hs-blue)] transition-colors"
                >
                  <div className="p-4">
                    <div className="text-sm font-semibold" style={{ color: BRAND.blue }}>
                      Parent Portal
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Track your child&apos;s progress and communicate with staff.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

      {/* Menú Derecho */}
      <NavigationMenu className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center">
        <NavigationMenuList className="flex items-center gap-6">
        {/* 💝 Donation - Simple item importante */}
        <SimpleItem href="/donation" label="Donation" />

        {/* � Contact - con scroll animado al footer */}
        <ContactScrollItem label="Contact" />
      </NavigationMenuList>
    </NavigationMenu>
    </>
  );
}

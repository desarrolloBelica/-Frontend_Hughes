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

//  Brand colors
const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

type SimpleItemProps = {
  href: string;
  label: string;
  newTab?: boolean;
};

type MenuEntry = {
  href: string;
  title: string;
  newTab?: boolean;
};

const MAX_ITEMS_PER_COLUMN = 3;

function chunkItems(items: MenuEntry[], size = MAX_ITEMS_PER_COLUMN) {
  const columns: MenuEntry[][] = [];
  for (let i = 0; i < items.length; i += size) {
    columns.push(items.slice(i, i + size));
  }
  return columns;
}

function ColumnMenu({ items }: { items: MenuEntry[] }) {
  const columns = chunkItems(items);
  const gridCols = columns.length === 1 ? "grid-cols-1" : columns.length === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="space-y-1">
          {col.map((item) => (
            <ColLink key={item.href} href={item.href} title={item.title} newTab={item.newTab} />
          ))}
        </div>
      ))}
    </div>
  );
}

function TriggerLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="relative inline-block text-sm font-semibold tracking-wide px-3 py-2 uppercase rounded-lg"
      style={{ color: BRAND.blue }}
    >
      {children}
      <motion.span
        variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
        transition={{ duration: 0.28 }}
        className="absolute left-0 bottom-0 h-[2px]"
        style={{ backgroundColor: BRAND.blue }}
      />
    </motion.span>
  );
}

function SimpleItem({ href, label, newTab = false }: SimpleItemProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          className="relative text-sm font-semibold tracking-wide px-3 py-2 uppercase rounded-lg transition-all duration-300 bg-yellow-300 hover:bg-yellow-400 hover:shadow-md"
          style={{ color: BRAND.blue }}
        >
          {label}
          <motion.span
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.28 }}
            className="absolute left-0 bottom-0 h-[2px]"
            style={{ backgroundColor: BRAND.blue }}
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
      className="block rounded-xl p-3 transition-colors hover:bg-yellow-100 focus:bg-yellow-100"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold" style={{ color: BRAND.yellow }}>•</span>
        <div className="text-sm font-semibold" style={{ color: BRAND.blue }}>
          {title}
        </div>
      </div>
      {desc && <p className="mt-1 ml-6 text-xs text-gray-600 leading-snug">{desc}</p>}
    </Link>
  );
}

/**  Item especial para hacer scroll animado al footer */
function ContactScrollItem({ label = "📲" }: { label?: string }) {
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
          aria-label="Contact"
          className="relative text-sm font-semibold tracking-wide px-3 py-2 uppercase rounded-lg transition-all duration-300 bg-yellow-300 hover:bg-yellow-400 hover:shadow-md"
          style={{ color: BRAND.blue }}
        >
          {label}
          <motion.span
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.28 }}
            className="absolute left-0 bottom-0 h-[2px]"
            style={{ backgroundColor: BRAND.blue }}
          />
        </button>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export default function MenuList() {
  const academicsLinks: MenuEntry[] = [
    { href: "/academics/programs", title: "Academic Programs" },
    { href: "/academics/learning-env", title: "Our Learning Environment" },
    { href: "/academics/graduates", title: "Where Our Graduates Go" },
    { href: "/academics/hs-robot", title: "HS Robot" },
    { href: "/academics/hughes-space", title: "Hughes Space School" },
    { href: "/arts/artprograms", title: "Art Programs" },
  ];

  const aboutLinks: MenuEntry[] = [
    { href: "/about", title: "Our Story" },
    { href: "/academics/undergraduate", title: "Why Choose Hughes Schools?" },
    { href: "/news", title: "News & Updates" },
    { href: "/academics/academic-staff", title: "Academic Staff" },
    { href: "/arts/art-staff", title: "Art Staff" },
    { href: "/faqs", title: "FAQs" },
  ];

  const eventsLinks: MenuEntry[] = [
    { href: "/events", title: "Events Recap" },
    { href: "/events/calendar", title: "Events Calendar" },
    { href: "/alumni", title: "Alumni Network" },
  ];

  const portalLinks: MenuEntry[] = [
    { href: "/academics/login", title: "Student Portal", newTab: true },
    { href: "/parents/login", title: "Parent Portal", newTab: true },
  ];

  return (
    <>
      {/* Menú Izquierdo */}
      <NavigationMenu className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center">
        <NavigationMenuList className="flex items-center gap-6">
        {/* Academics */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <TriggerLabel>Academics</TriggerLabel>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="min-w-[520px] max-w-[820px]">
              <div className="p-6 bg-white rounded-xl shadow-xl">
                <ColumnMenu items={academicsLinks} />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* About Us */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <TriggerLabel>About Us</TriggerLabel>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="min-w-[520px] max-w-[820px]">
              <div className="p-6 bg-white rounded-xl shadow-xl">
                <ColumnMenu items={aboutLinks} />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Events */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <TriggerLabel>Events</TriggerLabel>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="min-w-[420px] max-w-[700px]">
              <div className="p-6 bg-white rounded-xl shadow-xl">
                <ColumnMenu items={eventsLinks} />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Portal */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:shadow-none">
            <TriggerLabel>Portal</TriggerLabel>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="min-w-[360px] max-w-[600px]">
              <div className="p-6 bg-white rounded-xl shadow-xl">
                <ColumnMenu items={portalLinks} />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

      {/* Menú Derecho */}
      <NavigationMenu className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center">
        <NavigationMenuList className="flex items-center gap-6">
        <SimpleItem href="/admissions" label="Admissions" />
        <SimpleItem href="/donation" label="Donations" />

        <ContactScrollItem label="Contact Us" />
      </NavigationMenuList>
    </NavigationMenu>
    </>
  );
}

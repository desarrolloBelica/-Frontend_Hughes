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
  BookOpen,
  Users,
  Calendar,
  Heart,
  Star,
  Info,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

/* ───────────────────── Constants ───────────────────── */
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/* ───────────────────── Icon Mapping ───────────────────── */
const ICON_MAP: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  "clock": Clock,
  "utensils-crossed": UtensilsCrossed,
  "salad": Salad,
  "smartphone": Smartphone,
  "graduation-cap": GraduationCap,
  "bus": Bus,
  "message-circle-question": MessageCircleQuestion,
  "book-open": BookOpen,
  "users": Users,
  "calendar": Calendar,
  "heart": Heart,
  "star": Star,
  "info": Info,
  "help-circle": HelpCircle,
};

/* ───────────────────── Types ───────────────────── */
interface BlockChild {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  children?: BlockChild[];
}

interface Block {
  type: string;
  children?: BlockChild[];
  level?: number;
}

interface StrapiFAQ {
  id: number;
  documentId: string;
  category: string;
  question: string;
  answer: Block[];
  icon: string;
  order?: number;
}

interface StrapiResponse {
  data: StrapiFAQ[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: Block[];
  icon: string;
}

/* ───────────────────── Data Fetching ───────────────────── */
async function fetchFAQs(): Promise<FAQItem[]> {
  const res = await fetch(
    `${API_URL}/api/faqs?sort=order:asc&pagination[pageSize]=100&filters[publishedAt][$notNull]=true`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Error al obtener las preguntas frecuentes");
  }

  const json: StrapiResponse = await res.json();

  return json.data.map((item) => ({
    id: item.documentId || String(item.id),
    category: item.category || "general",
    question: item.question || "",
    answer: item.answer || [],
    icon: item.icon || "help-circle",
  }));
}

/* ───────────────────── Blocks Renderer ───────────────────── */
function renderBlockChild(child: BlockChild, index: number): React.ReactNode {
  if (child.type === "text") {
    let content: React.ReactNode = child.text || "";
    if (child.bold) content = <strong key={index}>{content}</strong>;
    if (child.italic) content = <em key={index}>{content}</em>;
    if (child.underline) content = <u key={index}>{content}</u>;
    return content;
  }
  if (child.type === "link" && child.children) {
    return (
      <span key={index}>
        {child.children.map((c, i) => renderBlockChild(c, i))}
      </span>
    );
  }
  return child.text || "";
}

function renderBlock(block: Block, index: number): React.ReactNode {
  const children = block.children?.map((child, i) => renderBlockChild(child, i)) || [];
  
  switch (block.type) {
    case "paragraph":
      return <p key={index} className="mb-2 last:mb-0">{children}</p>;
    case "heading":
      const level = block.level || 3;
      if (level === 1) return <h1 key={index} className="font-bold mb-2 text-xl">{children}</h1>;
      if (level === 2) return <h2 key={index} className="font-bold mb-2 text-lg">{children}</h2>;
      if (level === 3) return <h3 key={index} className="font-bold mb-2 text-base">{children}</h3>;
      if (level === 4) return <h4 key={index} className="font-bold mb-2">{children}</h4>;
      return <h5 key={index} className="font-bold mb-2">{children}</h5>;
    case "list":
      return <ul key={index} className="list-disc pl-5 mb-2">{children}</ul>;
    case "list-item":
      return <li key={index}>{children}</li>;
    default:
      return <span key={index}>{children}</span>;
  }
}

function BlocksContent({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null;
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>;
}

/* ───────────────────── Icon Component ───────────────────── */
function FAQIcon({ iconName }: { iconName: string }) {
  const IconComponent = ICON_MAP[iconName] || HelpCircle;
  return <IconComponent className="h-6 w-6 text-hs-bluenavy" />;
}

export default function FAQPage() {
  const [faqs, setFaqs] = React.useState<FAQItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchFAQs()
      .then((data) => {
        setFaqs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching FAQs:", err);
        setError("Error al cargar las preguntas frecuentes.");
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-hs-bluenavy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hs-yellow mx-auto mb-4" />
          <p className="text-white">Cargando preguntas frecuentes...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-hs-bluenavy flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-hs-yellow px-4 py-2 text-sm font-semibold text-hs-bluenavy"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

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

            {faqs.length === 0 ? (
              <div className="text-center py-8 text-hs-bluenavy">
                No hay preguntas frecuentes disponibles.
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {faqs.map((faq, index) => (
                  <React.Fragment key={faq.id}>
                    {index > 0 && <Divider />}
                    <AccordionItem value={faq.id} className="group border-none">
                      <AccordionTrigger className="text-left px-4 md:px-6 py-5 rounded-2xl hover:bg-white/30 data-[state=open]:bg-white/30 transition-all hover:no-underline focus:outline-none">
                        <div className="flex items-center gap-4">
                          <span className="shrink-0">
                            <FAQIcon iconName={faq.icon} />
                          </span>
                          <span className="font-bold text-lg md:text-xl text-hs-bluenavy">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 md:px-6 pb-6 pt-2">
                        <div className="text-base md:text-lg font-medium text-hs-bluenavy opacity-90 leading-relaxed pl-10">
                          <BlocksContent blocks={faq.answer} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </React.Fragment>
                ))}
              </Accordion>
            )}
            
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- helpers ---------- */

function Divider() {
  return <div className="mx-6 h-[2px] bg-hs-bluenavy/10 my-1" />;
}
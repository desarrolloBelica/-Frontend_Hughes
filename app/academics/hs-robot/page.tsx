"use client";

import { useEffect, useState } from "react";
import { Bot, Lightbulb, Trophy, Zap, Target, Car, Sparkles } from "lucide-react";
import Link from "next/link";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

type Category = {
  id: string | number;
  name: string;
  icon: React.ReactNode;
  description: string;
};

// Tipo basado en TU esquema proporcionado
type StrapiCategory = {
  id: number;
  documentId: string;
  attributes: {
    title: string;
    description: string;
    // Estos campos existen en tu DB, los ignoramos por ahora para la tarjeta simple
    categoryPhoto?: any;
    evaluationParameters?: string;
    teamsDescription?: string;
    characteristics?: string;
    rules?: string;
  };
};

export default function HSRobotPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función auxiliar para elegir el icono según el texto del título
  const getIconByTitle = (title: string = "") => {
    const t = title.toLowerCase();
    
    if (t.includes("design") || t.includes("diseño")) return <Lightbulb className="w-8 h-8" />;
    if (t.includes("innovation") || t.includes("innovación")) return <Zap className="w-8 h-8" />;
    if (t.includes("fut") || t.includes("soccer") || t.includes("fútbol")) return <Trophy className="w-8 h-8" />;
    if (t.includes("sumo") || t.includes("bot")) return <Bot className="w-8 h-8" />;
    if (t.includes("obstacle") || t.includes("evasion") || t.includes("obstáculos")) return <Target className="w-8 h-8" />;
    
    // Default si no encuentra coincidencia
    return <Sparkles className="w-8 h-8" />;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        
        // No necesitamos 'populate' para title y description, pero si quisieras la foto usarías ?populate=*
        const res = await fetch(`${base}/api/hs-robot-categories`);
        
        if (!res.ok) throw new Error("Error al cargar categorías");
        
        const json = await res.json();
        
        // Manejo de estructura Strapi (data -> attributes)
        const rawData = Array.isArray(json) 
          ? json 
          : (json.data && Array.isArray(json.data) ? json.data : []);

        const mappedCategories: Category[] = rawData.map((item: StrapiCategory) => {
          const attr = item.attributes || item; // Fallback por si la estructura varía
          const title = attr.title || "Categoría";

          return {
            id: item.documentId, // Usar documentId para el findOne
            name: title, // Usamos 'title' de tu esquema
            description: attr.description || "Sin descripción disponible.", // Usamos 'description' (text) de tu esquema
            icon: getIconByTitle(title), // Deducción automática del icono
          };
        });

        setCategories(mappedCategories);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ... (Todo el bloque Hero Section se mantiene igual) ... */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-white/10 p-5 backdrop-blur-sm">
                <Bot className="w-12 h-12" style={{ color: BRAND.yellow }} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              HS Robot Rumble
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light italic max-w-4xl mx-auto" style={{ color: BRAND.yellow }}>
              "Creativity without limits, technology without borders"
            </p>
            <div className="flex justify-center pt-4">
              <div className="h-1 w-24 rounded-full" style={{ backgroundColor: BRAND.yellow }} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12" style={{ color: BRAND.blue }}>
              About Us
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                At <strong>HS Robot Rumble</strong>, we firmly believe in the power of education 
                and competition to inspire the next generation of engineers and technologists. 
                Behind every connected cable, every drafted rule, and every carefully planned event, 
                there is a dedicated and passionate organizing team, committed to providing an 
                unforgettable and enriching experience.
              </p>
              <p>
                We are excited to be the hosts of this incredible journey of innovation and look 
                forward to seeing the amazing creations that teams will present.
              </p>
              <div className="mt-8 p-6 rounded-2xl border-l-4" style={{ backgroundColor: 'rgba(var(--hs-blue-rgb), 0.05)', borderColor: BRAND.blue }}>
                <p className="text-xl font-semibold" style={{ color: BRAND.blue }}>
                  Join us in celebrating innovation, teamwork, and the limitless potential of young minds!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: BRAND.blue }}>
              Competition Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the exciting challenges where teams can showcase their skills and innovation
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center text-red-500 p-8 bg-red-50 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Categories Grid - Data */}
{!loading && !error && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {categories.map((category, index) => (
      // 2. Cambia el div exterior por un Link
      <Link
        href={`/academics/hs-robot/${category.id}`} // Esto redirige a la nueva página usando documentId
        key={category.id}
        className="group relative block h-full" // block y h-full importantes
      >
        <div
          className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[var(--hs-blue)]"
          style={{ animationDelay: `${index * 100}ms` }}
        >
           {/* ... (Todo el contenido de la tarjeta se queda igual: Icono, Título, Descripción) ... */}
           {/* Icon */}
           <div className="mb-6 inline-flex p-4 rounded-xl" style={{ backgroundColor: 'rgba(var(--hs-blue-rgb), 0.1)', color: BRAND.blue }}>
              {category.icon}
           </div>
           {/* Title */}
           <h3 className="text-2xl font-bold mb-3" style={{ color: BRAND.blue }}>
              {category.name}
           </h3>
           {/* etc... */}
           
           {/* Decorative element */}
           <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl" style={{ backgroundColor: BRAND.yellow }} />
        </div>
      </Link>
    ))}
  </div>
)}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl p-12 sm:p-16 text-center text-white relative overflow-hidden" style={{ backgroundColor: BRAND.blue }}>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Join the Competition?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Be part of the next generation of innovators and showcase your robotic creations
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfEQgzP6Dp5AN9GFeD0iGZt4aOU4wnB3opAqo3tf6uk1PCMgA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
              >
                <Car className="w-5 h-5" />
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
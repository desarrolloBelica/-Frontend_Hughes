"use client";

import { useEffect, useState } from "react";
import { Bot, Lightbulb, Trophy, Zap, Target, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

type Award = {
  id: number;
  documentId: string;
  name: string;
  award?: {
    url: string;
    alternativeText?: string;
  };
};

type Winner = {
  id: number;
  documentId: string;
  groupName: string;
  winDate?: string;
  winningPhoto?: Array<{
    url: string;
    alternativeText?: string;
  }>;
  category?: {
    title: string;
  };
};

export default function HSRobotPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Awards state
  const [awards, setAwards] = useState<Award[]>([]);
  const [awardsLoading, setAwardsLoading] = useState(true);
  const [currentAwardIndex, setCurrentAwardIndex] = useState(0);
  
  // Winners state
  const [winners, setWinners] = useState<Winner[]>([]);
  const [winnersLoading, setWinnersLoading] = useState(true);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);

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
        

  // Fetch Awards
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setAwardsLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const res = await fetch(`${base}/api/hs-awards?populate=*`);
        
        if (!res.ok) throw new Error("Error loading awards");
        
        const json = await res.json();
        const rawData = Array.isArray(json) ? json : (json.data && Array.isArray(json.data) ? json.data : []);
        
        const mappedAwards: Award[] = rawData.map((item: any) => {
          const attr = item.attributes || item;
          return {
            id: item.id,
            documentId: item.documentId || item.id,
            name: attr.name || "Prize",
            award: attr.award?.data?.attributes || attr.award
          };
        });
        
        setAwards(mappedAwards);
      } catch (err) {
        console.error("Error fetching awards:", err);
      } finally {
        setAwardsLoading(false);
      }
    };
    
    fetchAwards();
  }, []);

  // Fetch Winners
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setWinnersLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        const res = await fetch(`${base}/api/hs-rumble-winners?populate=*&sort[0]=winDate:desc`);
        
        if (!res.ok) throw new Error("Error loading winners");
        
        const json = await res.json();
        const rawData = Array.isArray(json) ? json : (json.data && Array.isArray(json.data) ? json.data : []);
        
        const mappedWinners: Winner[] = rawData.map((item: any) => {
          const attr = item.attributes || item;
          const photos = attr.winningPhoto?.data || attr.winningPhoto || [];
          
          return {
            id: item.id,
            documentId: item.documentId || item.id,
            groupName: attr.groupName || "Team",
            winDate: attr.winDate,
            winningPhoto: Array.isArray(photos) 
              ? photos.map((p: any) => ({
                  url: p.attributes?.url || p.url,
                  alternativeText: p.attributes?.alternativeText || p.alternativeText
                }))
              : [],
            category: attr.hs_robot_category?.data?.attributes || attr.hs_robot_category
          };
        });
        
        setWinners(mappedWinners);
      } catch (err) {
        console.error("Error fetching winners:", err);
      } finally {
        setWinnersLoading(false);
      }
    };
    
    fetchWinners();
  }, []);

  // Auto-rotate awards
  useEffect(() => {
    if (awards.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAwardIndex((prev) => (prev + 1) % awards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [awards.length]);

  // Auto-rotate winners
  useEffect(() => {
    if (winners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentWinnerIndex((prev) => (prev + 1) % winners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [winners.length]);// No necesitamos 'populate' para title y description, pero si quisieras la foto usarías ?populate=*
        

return (
  <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
   {/* Hero Section with Technical Background */}
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
 {/* Animated circuit board pattern */}
     <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        {/* Binary code effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext x='0' y='20' font-family='monospace' font-size='14' fill='white' opacity='0.3'%3E01001010%3C/text%3E%3Ctext x='0' y='40' font-family='monospace' font-size='14' fill='white' opacity='0.3'%3E10110100%3C/text%3E%3Ctext x='0' y='60' font-family='monospace' font-size='14' fill='white' opacity='0.3'%3E11010010%3C/text%3E%3Ctext x='0' y='80' font-family='monospace' font-size='14' fill='white' opacity='0.3'%3E01101011%3C/text%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Image 
                src="/HughesSchoolsRobotics.png" 
                alt="HS Robot Rumble Logo" 
                width={240}
                height={240}
                className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-2xl"
              />
            </div> 
            <div className="flex justify-center items-center">
              <h1 className="w-full text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center flex items-center justify-center">
                    HS Robot Rumble
              </h1>
            </div>
<div className="flex justify-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light italic max-w-4xl mx-auto" style={{ color: BRAND.yellow }}>
              "Creativity without limits, technology without borders"
            </p>
</div>
            <div className="flex justify-center pt-4">
              <div className="h-1 w-24 rounded-full" style={{ backgroundColor: BRAND.yellow }} />
            </div>
          </div>
        </div>
        
      </section>

      {/* About Us Section */}
      <section className="py-16 sm:py-20 section-gradient-soft-yellow">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12" style={{ color: BRAND.blue }}>
              About Us
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                At <strong>HS Robot Rumble</strong>, we firmly believe in the power of education and competition to inspire the next generation of engineers and technologists. Behind every connected cable, every drafted rule, and every carefully planned event, there is a dedicated and passionate organizing team, committed to providing an unforgettable and enriching experience.
              </p>
              <p>
                We are excited to be the hosts of this incredible journey of innovation and look forward to seeing the amazing creations that teams will present.
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
      <section className="py-16 sm:py-24 bg-soft-dots">
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
                <Link
                  href={`/academics/hs-robot/${category.id}`}
                  key={category.id}
                  className="group relative block h-full"
                >
                  <div
                    className="h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-700 hover:border-[var(--hs-yellow)] relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Circuit pattern overlay */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm10 10a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                      }} />
                    </div>
                    
                    {/* Icon */}
                    <div className="relative mb-6 inline-flex p-4 rounded-xl bg-white/10 backdrop-blur-sm" style={{ color: BRAND.yellow }}>
                      {category.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="relative text-2xl font-bold mb-3 text-white">
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="relative text-gray-300 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Decorative element */}
                    <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl" style={{ backgroundColor: BRAND.yellow }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Support Robotics Club Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 relative overflow-hidden">
        {/* Technical background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <Heart className="w-5 h-5" style={{ color: BRAND.yellow }} />
              <span className="text-white font-semibold">Support Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Support Hughes Schools Robotics Club
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-center">
            {/* Left: Support Info */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Help Us Build the Future!
                </h3>
                <div className="space-y-2.5 text-gray-200 text-sm sm:text-base leading-relaxed">
                  <p>
                    With your support, we can cover materials, transportation, and registration fees to participate in robotics competitions.
                  </p>
                  <p>
                    Every contribution drives us to keep innovating and representing our school with pride as <strong className="text-white">HS Team</strong>.
                  </p>
                </div>
                
                <a
                  href="https://wa.link/u0l996"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-green-500 text-white hover:bg-green-600"
                >
                  <MessageCircle className="w-5 h-5" />
                  Get Your Raffle Ticket
                </a>
              </div>
            </div>

            {/* Right: Awards Carousel */}
            <div className="relative">
              <h3 className="text-lg sm:text-xl font-bold text-center mb-3" style={{ color: BRAND.yellow }}>
                Robotics Raffle Prizes
              </h3>
              
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 shadow-lg max-w-sm mx-auto">
                {awardsLoading ? (
                  <div className="aspect-[4/3] w-full animate-pulse bg-white/5" />
                ) : awards.length > 0 ? (
                  <>
                    <div className="aspect-[4/3] w-full relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"}${awards[currentAwardIndex]?.award?.url || ""}`}
                        alt={awards[currentAwardIndex]?.award?.alternativeText || awards[currentAwardIndex]?.name || "Prize"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h4 className="text-lg font-bold text-white">
                          {awards[currentAwardIndex]?.name}
                        </h4>
                      </div>
                    </div>

                    {awards.length > 1 && (
                      <>
                        <button
                          aria-label="Previous prize"
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-blue-900 shadow hover:bg-white transition-all"
                          onClick={() => setCurrentAwardIndex((prev) => (prev - 1 + awards.length) % awards.length)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Next prize"
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-blue-900 shadow hover:bg-white transition-all"
                          onClick={() => setCurrentAwardIndex((prev) => (prev + 1) % awards.length)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4">
                          {awards.map((_, i) => (
                            <button
                              key={i}
                              aria-label={`Go to prize ${i + 1}`}
                              className="h-2.5 rounded-full transition-all"
                              style={{
                                width: i === currentAwardIndex ? "24px" : "8px",
                                backgroundColor: i === currentAwardIndex ? BRAND.yellow : "rgba(255,255,255,0.5)",
                              }}
                              onClick={() => setCurrentAwardIndex(i)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="aspect-[4/3] w-full grid place-content-center text-white">
                    No prizes available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners Showcase Section */}
      <section className="py-10 sm:py-14 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(var(--hs-blue-rgb), 0.1)' }}>
              <Trophy className="w-5 h-5" style={{ color: BRAND.blue }} />
              <span className="font-semibold" style={{ color: BRAND.blue }}>Hall of Fame</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: BRAND.blue }}>
              Previous Winners
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrating the champions who have excelled in past competitions
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border bg-white shadow-xl max-w-3xl mx-auto" style={{ borderColor: BRAND.blue }}>
            {winnersLoading ? (
              <div className="aspect-[4/3] w-full animate-pulse bg-gray-100" />
            ) : winners.length > 0 ? (
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0">
                  {winners[currentWinnerIndex]?.winningPhoto?.[0] ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"}${winners[currentWinnerIndex].winningPhoto[0].url}`}
                      alt={winners[currentWinnerIndex].winningPhoto[0].alternativeText || winners[currentWinnerIndex].groupName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 text-white">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span 
                      className="rounded-full px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-wide"
                      style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
                    >
                      <Trophy className="w-4 h-4 inline mr-1" />
                      Winner
                    </span>
                    {winners[currentWinnerIndex]?.category?.title && (
                      <span className="text-xs sm:text-sm font-semibold text-white/90">
                        {winners[currentWinnerIndex].category.title}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold mb-1.5">
                    {winners[currentWinnerIndex]?.groupName}
                  </h3>
                  
                  {winners[currentWinnerIndex]?.winDate && (
                    <p className="text-base text-white/90">
                      {new Date(winners[currentWinnerIndex].winDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                {winners.length > 1 && (
                  <>
                    <button
                      aria-label="Previous winner"
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white transition-all"
                      style={{ color: BRAND.blue }}
                      onClick={() => setCurrentWinnerIndex((prev) => (prev - 1 + winners.length) % winners.length)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Next winner"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white transition-all"
                      style={{ color: BRAND.blue }}
                      onClick={() => setCurrentWinnerIndex((prev) => (prev + 1) % winners.length)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4">
                      {winners.map((_, i) => (
                        <button
                          key={i}
                          aria-label={`Go to winner ${i + 1}`}
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: i === currentWinnerIndex ? "24px" : "8px",
                            backgroundColor: i === currentWinnerIndex ? BRAND.yellow : "rgba(255,255,255,0.7)",
                          }}
                          onClick={() => setCurrentWinnerIndex(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] w-full grid place-content-center text-center p-8" style={{ color: BRAND.blue }}>
                No winners to display yet. Stay tuned for upcoming competitions!
              </div>
            )}
          </div>
        </div>
      </section>

     {/* Call to Action Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl p-12 sm:p-16 text-center text-white relative overflow-hidden" style={{ backgroundColor: BRAND.blue }}>
            {/* Technical background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ">
                Ready to Join the Competition?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Be part of the next generation of innovators and showcase your robotic creations
              </p>
              
              {/* Three Action Buttons */}
             {/* Three Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Learn More Button */}
              <a
                href="https://ideasycodigo.com/hs-robot-rumble"
                target="_blank"
                rel="noopener noreferrer"
                /* CAMBIOS: px-6, py-3, text-base */
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white text-blue-900"
              >
                {/* CAMBIO: Icono w-4 h-4 */}
                <Bot className="w-4 h-4" />
                Learn More
              </a>
              
              {/* Register Now Button */}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfEQgzP6Dp5AN9GFeD0iGZt4aOU4wnB3opAqo3tf6uk1PCMgA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                /* CAMBIOS: px-6, py-3, text-base */
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: BRAND.yellow, color: BRAND.blue }}
              >
                {/* CAMBIO: Icono w-4 h-4 */}
                <Trophy className="w-4 h-4" />
                Register Now
              </a>
              
              {/* Join WhatsApp Group Button */}
              <a
                href="https://chat.whatsapp.com/HVCd6oJkxKf71ALTeRrnbL?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                /* CAMBIOS: px-6, py-3, text-base */
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-green-500 text-white hover:bg-green-600"
              >
                {/* CAMBIO: Icono w-4 h-4 */}
                <MessageCircle className="w-4 h-4" />
                Join WhatsApp Group
              </a>
            </div>
            </div>
          </div>
    </div>
      </section>
    </main>
  );
}

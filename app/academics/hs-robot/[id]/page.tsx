import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Info, Users, CheckCircle, FileText, ImageIcon } from "lucide-react";

/* ─────────── 1. Tipos y Configuración ─────────── */

// Next.js 15: params es una Promesa
type RouteParams = Promise<{ id: string }>;
type PageInput = { params: RouteParams };

export const revalidate = 60; // ISR: Revalidar cada 60 segundos

// Tipos Strapi (Adaptados a tu esquema de Robot)
type Media = {
  id?: number | string;
  url?: string;
  alternativeText?: string | null;
  attributes?: { url?: string; alternativeText?: string | null };
};

type CategoryV5 = {
  id: number | string;
  documentId: string;
  title?: string;
  description?: string;
  categoryPhoto?: Media | null;
  evaluationParameters?: string;
  teamsDescription?: string;
  characteristics?: string;
  rules?: string;
  heperPictures?: Media[] | Media | null; // Nota: mantuve tu typo 'heper'
};

type CategoryV4 = {
  id: number | string;
  attributes?: {
    title?: string;
    description?: string;
    categoryPhoto?: { data?: Media | null } | Media | null;
    evaluationParameters?: string;
    teamsDescription?: string;
    characteristics?: string;
    rules?: string;
    heperPictures?: { data?: Media[] | Media | null } | Media[] | Media | null;
  };
};

type RobotCategory = CategoryV4 | CategoryV5;

/* ───────────── 2. Helpers (Igual que en News) ───────────── */

function getAttr<T = unknown>(row: RobotCategory, key: string): T | undefined {
  if (!row) return undefined;
  // Intento v5 (propiedad directa)
  if ((row as any)[key] !== undefined) return (row as any)[key] as T;
  // Intento v4 (dentro de attributes)
  const attrs = (row as CategoryV4).attributes as any;
  if (attrs && attrs[key] !== undefined) return attrs[key] as T;
  return undefined;
}

function getMediaArray(val: unknown): Media[] {
  if (Array.isArray(val)) return val as Media[];
  if (val && typeof val === "object") {
    const obj = val as any;
    if (obj.url || obj.attributes?.url) return [obj as Media]; // Es un objeto media
    if (obj.data) { // Es un wrapper v4 { data: ... }
       return Array.isArray(obj.data) ? obj.data : [obj.data].filter(Boolean);
    }
  }
  return [];
}

function abs(u?: string | null) {
  if (!u) return null;
  if (u.startsWith("http")) return u;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  return `${base}${u}`;
}

function mediaUrl(m?: Media | null): string | null {
  if (!m) return null;
  if (typeof m.url === "string") return abs(m.url);
  if (m.attributes?.url) return abs(m.attributes.url);
  return null;
}

/* ───────────── 3. Fetching (Server Side) ───────────── */

async function fetchCategory(id: string): Promise<RobotCategory | null> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
  
  // Endpoint: Intentamos obtener por ID. 
  const url = `${base}/api/hs-robot-categories/${id}?populate=*`;
  
  console.log("Fetching Category:", url);

  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;

    const json = await res.json();
    
    // Normalizar respuesta (v4 devuelve { data: object }, v5 devuelve { data: object } o object directo)
    if (json.data) return json.data; 
    return json; // v5 a veces devuelve el objeto directo si no hay wrapper
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

/* ───────────── 4. Componente UI para Texto Rico Actualizado ───────────── */
const RichTextRenderer = ({ content, className = "" }: { content?: string, className?: string }) => {
  if (!content) return <p className={`italic opacity-80 ${className}`}>No information available.</p>;
  
  return (
    // CAMBIO: Aseguramos que 'prose' herede el color del padre para no arruinar los fondos Navy/Yellow
    <div className={`prose max-w-none whitespace-pre-wrap leading-relaxed prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-li:text-inherit prose-a:text-inherit ${className}`}>
      {content}
    </div>
  );
};

/* ───────────── 5. Metadatos SEO ───────────── */

export async function generateMetadata({ params }: PageInput) {
  const { id } = await params;
  const category = await fetchCategory(id);
  const title = (getAttr<string>(category!, "title") ?? "Category") as string;
  const desc = (getAttr<string>(category!, "description") ?? "").slice(0, 160);

  return {
    title: `${title} — HS Robot Rumble`,
    description: desc,
  };
}

/* ───────────── 6. Página Principal (Server Component) ───────────── */

export default async function CategoryDetailPage({ params }: PageInput) {
  const { id } = await params;
  const data = await fetchCategory(id);

  if (!data) return notFound();

  // Extracción de datos usando helpers seguros
  const title = getAttr<string>(data, "title") ?? "Untitled Category";
  const description = getAttr<string>(data, "description") ?? "";
  
  // Imagen Principal
  const photoRaw = getAttr(data, "categoryPhoto");
  const photoArr = getMediaArray(photoRaw);
  const mainImageUrl = mediaUrl(photoArr[0]);

  // Textos Ricos
  const characteristics = getAttr<string>(data, "characteristics");
  const rules = getAttr<string>(data, "rules");
  const teamsDescription = getAttr<string>(data, "teamsDescription");
  const evaluationParameters = getAttr<string>(data, "evaluationParameters");

  // Galería de Ayuda
  const helpersRaw = getAttr(data, "heperPictures");
  const helperImages = getMediaArray(helpersRaw);

  return (
    // CAMBIO: Fondo general oscuro
    <main className="min-h-screen bg-hs-bluenavy pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-hs-bluenavy overflow-hidden">
        {mainImageUrl && (
          <Image
            src={mainImageUrl}
            alt={title}
            fill
            className="object-cover opacity-40"
            priority // Importante para LCP
          />
        )}
        {/* CAMBIO: Gradiente adaptado al bluenavy */}
        {/* Gradiente adaptado al bluenavy */}
        <div className="absolute inset-0 bg-gradient-to-t from-hs-bluenavy via-hs-bluenavy/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 max-w-7xl mx-auto z-10">
          {/* CORRECCIÓN: Separamos el color (text-hs-yellow) de la opacidad (opacity-80) */}
          <Link 
            href="/academics/hs-robot" 
            className="mb-6 inline-flex items-center gap-2 text-hs-yellow opacity-80 hover:opacity-100 transition-opacity font-medium drop-shadow-md"
          >
            <ChevronLeft size={20} /> Back to Categories
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-hs-yellow drop-shadow-lg leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        
        {/* --- GRID DE CONTENIDO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda (Info Principal) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            {/* CAMBIO: bg-yellow text-bluenavy */}
            <section className="bg-hs-yellow text-hs-bluenavy rounded-3xl p-8 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Overview</h2>
              </div>
              <p className="text-base md:text-lg font-medium opacity-90 leading-relaxed text-justify">
                {description}
              </p>
            </section>

             {/* Reglas */}
             <section className="bg-hs-yellow text-hs-bluenavy rounded-3xl p-8 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Competition Rules</h2>
              </div>
              <RichTextRenderer content={rules} className="text-base md:text-lg font-medium opacity-90 text-justify" />
            </section>

             {/* Características */}
            <section className="bg-hs-yellow text-hs-bluenavy rounded-3xl p-8 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Robot Characteristics</h2>
              </div>
              {/* CAMBIO: Caja interna con leve transparencia de navy */}
              <div className="bg-hs-bluenavy/5 p-6 md:p-8 rounded-2xl border-2 border-hs-bluenavy/10">
                <RichTextRenderer content={characteristics} className="text-base md:text-lg font-medium opacity-90 text-justify" />
              </div>
            </section>

          </div>

          {/* Columna Derecha (Sidebar) */}
          <div className="space-y-8">
            
            {/* Teams */}
            {/* CAMBIO: Invertimos los colores para contraste. bg-bluenavy text-yellow */}
            <div className="bg-hs-bluenavy text-hs-yellow rounded-3xl p-8 md:p-10 shadow-xl border-2 border-hs-yellow">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8" />
                <h3 className="text-2xl md:text-3xl font-bold">Teams Info</h3>
              </div>
              <div className="opacity-90">
                 <RichTextRenderer 
                    content={teamsDescription} 
                    className="text-base md:text-lg font-medium text-justify" 
                 />
              </div>
            </div>

            {/* Evaluation */}
            <div className="bg-hs-yellow text-hs-bluenavy rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-hs-bluenavy/10 rounded-bl-full -mr-4 -mt-4" />
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Evaluation</h3>
              <div className="opacity-90">
                <RichTextRenderer content={evaluationParameters} className="text-base md:text-lg font-medium text-justify" />
              </div>
            </div>

          </div>
        </div>

        {/* --- GALERÍA --- */}
        {helperImages.length > 0 && (
          <section className="mt-16 mb-16">
            <div className="flex items-center gap-3 mb-8 text-hs-yellow">
              <ImageIcon className="w-8 h-8" />
              <h2 className="text-3xl md:text-4xl font-bold">Reference Gallery</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {helperImages.map((img, idx) => {
                const url = mediaUrl(img);
                const alt = img.attributes?.alternativeText || `Gallery image ${idx}`;
                if(!url) return null;
                
                return (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border-2 border-transparent hover:border-hs-yellow transition-all">
                    <Image 
                      src={url} 
                      alt={alt} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="flex justify-center mt-12 mb-8">
          <a
            href={"https://docs.google.com/forms/d/e/1FAIpQLSfEQgzP6Dp5AN9GFeD0iGZt4aOU4wnB3opAqo3tf6uk1PCMgA/viewform"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-bold text-lg md:text-xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl bg-hs-yellow text-hs-bluenavy border-2 border-hs-yellow hover:bg-hs-bluenavy hover:text-hs-yellow"
          >
            Join Now
          </a>
        </div>

      </div>
    </main>
  );
}
"use client";

import { Bot, Lightbulb, Trophy, Zap, Target, Car } from "lucide-react";

const BRAND = {
  blue: "var(--hs-blue)",
  yellow: "var(--hs-yellow)",
};

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

const categories: Category[] = [
  {
    id: "design",
    name: "Design",
    icon: <Lightbulb className="w-8 h-8" />,
    description: "Showcase your creative engineering and innovative robot designs.",
  },
  {
    id: "innovation",
    name: "Innovation",
    icon: <Zap className="w-8 h-8" />,
    description: "Push the boundaries of technology with groundbreaking solutions.",
  },
  {
    id: "robofut",
    name: "RoboFut",
    icon: <Trophy className="w-8 h-8" />,
    description: "Compete in exciting robotic soccer matches with your team.",
  },
  {
    id: "minisumo",
    name: "Minisumo RC",
    icon: <Bot className="w-8 h-8" />,
    description: "Battle it out in intense remote-controlled mini sumo competitions.",
  },
  {
    id: "obstacle",
    name: "Obstacle Evasion",
    icon: <Target className="w-8 h-8" />,
    description: "Navigate complex courses with precision and speed.",
  },
];

export default function HSRobotPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center space-y-8">
            {/* Logo/Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-white/10 p-5 backdrop-blur-sm">
                <Bot className="w-12 h-12" style={{ color: BRAND.yellow }} />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              HS Robot Rumble
            </h1>
            
            {/* Slogan */}
            <p 
              className="text-2xl sm:text-3xl lg:text-4xl font-light italic max-w-4xl mx-auto"
              style={{ color: BRAND.yellow }}
            >
              "Creativity without limits, technology without borders"
            </p>
            
            {/* Decorative line */}
            <div className="flex justify-center pt-4">
              <div className="h-1 w-24 rounded-full" style={{ backgroundColor: BRAND.yellow }} />
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

      {/* About Us Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl">
            {/* Section Title */}
            <h2 
              className="text-4xl sm:text-5xl font-bold text-center mb-12"
              style={{ color: BRAND.blue }}
            >
              About Us
            </h2>
            
            {/* Content */}
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
              
              {/* Highlight box */}
              <div 
                className="mt-8 p-6 rounded-2xl border-l-4"
                style={{ 
                  backgroundColor: 'rgba(var(--hs-blue-rgb), 0.05)',
                  borderColor: BRAND.blue 
                }}
              >
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
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl font-bold mb-4"
              style={{ color: BRAND.blue }}
            >
              Competition Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the exciting challenges where teams can showcase their skills and innovation
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[var(--hs-blue)]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon */}
                <div 
                  className="mb-6 inline-flex p-4 rounded-xl"
                  style={{ 
                    backgroundColor: 'rgba(var(--hs-blue-rgb), 0.1)',
                    color: BRAND.blue 
                  }}
                >
                  {category.icon}
                </div>
                
                {/* Title */}
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{ color: BRAND.blue }}
                >
                  {category.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
                
                {/* Decorative element */}
                <div 
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl"
                  style={{ backgroundColor: BRAND.yellow }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div 
            className="rounded-3xl p-12 sm:p-16 text-center text-white relative overflow-hidden"
            style={{ backgroundColor: BRAND.blue }}
          >
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
                style={{ 
                  backgroundColor: BRAND.yellow,
                  color: BRAND.blue 
                }}
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

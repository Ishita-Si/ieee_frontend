"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PillNav from "@/components/ui/PillNav";
import Footer from "@/components/ui/Footer";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  Cpu, 
  Globe, 
  Code2, 
  ExternalLink, 
  Database, 
  Layout, 
  Smartphone, 
  Server,
  Command,
  CheckCircle2
} from "lucide-react";

// --- Custom CSS for Developer Theme ---
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap');

  .font-code {
    font-family: 'Fira Code', monospace;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes binary-rain {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  .animate-cursor {
    animation: blink 1s step-end infinite;
  }

  .animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
  }

  .code-window {
    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
  }
  
  .scrollbar-hide::-webkit-scrollbar {
      display: none;
  }
`;

// --- Local Components ---

const BinaryBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    {[...Array(10)].map((_, i) => (
      <div 
        key={i}
        className="absolute text-emerald-500/20 text-xs font-code whitespace-nowrap"
        style={{
          left: `${i * 10}%`,
          top: -100,
          animation: `binary-rain ${10 + Math.random() * 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
          writingMode: 'vertical-rl'
        }}
      >
        {Array(50).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
      </div>
    ))}
  </div>
);

const CodeWindow = ({ name, role, handle, image, type, skills, socialLinks, delay }) => {
  const isFrontend = type === 'frontend';
  const accentColor = isFrontend ? 'text-cyan-400' : 'text-emerald-400';
  const borderColor = isFrontend ? 'border-cyan-500/30' : 'border-emerald-500/30';
  const glowColor = isFrontend ? 'group-hover:shadow-cyan-500/20' : 'group-hover:shadow-emerald-500/20';
  const Icon = isFrontend ? Layout : Database;

  return (
    <div 
      className={`group relative bg-[#0d1117] border ${borderColor} rounded-xl overflow-hidden code-window transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${glowColor} opacity-0 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs text-white/40 font-code flex items-center gap-2">
          <Icon className="w-3 h-3" />
          {handle}
        </div>
        <div className="w-8" /> {/* Spacer */}
      </div>

      <div className="p-6 grid md:grid-cols-[1.5fr_2fr] gap-8">
        {/* Avatar & Quick Stats */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${isFrontend ? 'border-cyan-500/50' : 'border-emerald-500/50'} animate-[spin_10s_linear_infinite]`} />
            <div className="absolute inset-2 rounded-full overflow-hidden bg-zinc-800">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-[#0d1117] ${isFrontend ? 'bg-cyan-400' : 'bg-emerald-400'} animate-pulse`} />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white">{name}</h3>
            <p className={`${accentColor} text-sm font-code mt-1`}>&lt;{role} /&gt;</p>
          </div>

          <div className="flex gap-3">
            {socialLinks.github && (
              <a href={socialLinks.github} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            <a href={`mailto:${socialLinks.email}`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Code Block Info */}
        <div className="font-code text-sm overflow-hidden">
          <div className="text-gray-500 mb-2">// Developer Profile Configuration</div>
          <div className="space-y-1">
            <div className="flex">
              <span className="text-purple-400 mr-2">const</span>
              <span className="text-yellow-200 mr-2">developer</span>
              <span className="text-white mr-2">=</span>
              <span className="text-white">{'{'}</span>
            </div>
            
            <div className="pl-4 flex">
              <span className="text-blue-300 mr-2">status:</span>
              <span className="text-green-300">"Online"</span>,
            </div>
            
            <div className="pl-4 flex">
              <span className="text-blue-300 mr-2">level:</span>
              <span className="text-orange-300">99</span>,
            </div>

            <div className="pl-4">
              <span className="text-blue-300 mr-2">skills:</span>
              <span className="text-white">['</span>
            </div>
            
            {/* Skills Array */}
            <div className="pl-8 flex flex-wrap gap-2 my-1">
              {skills.map((skill, i) => (
                <span key={i} className={`${accentColor}`}>
                  "{skill}"<span className="text-white">{i < skills.length - 1 ? ',' : ''}</span>
                </span>
              ))}
            </div>

            <div className="pl-4 text-white">],</div>
            
            <div className="pl-4 flex">
              <span className="text-blue-300 mr-2">drink:</span>
              <span className="text-green-300">"Coffee.intravenously()"</span>
            </div>

            <div className="text-white">{'};'}</div>
          </div>

          {/* Terminal Prompt */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
            <Terminal className="w-4 h-4" />
            <span>{isFrontend ? 'compiling assets...' : 'connecting to server...'}</span>
            <span className="w-2 h-4 bg-white/50 animate-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
};

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function CreatorPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      <style>{styleTag}</style>
      <BinaryBackground />
      
      <div className="relative z-10">
        <PillNav items={navItems} />

        {/* Header */}
        <section className="pt-32 pb-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 font-code text-xs text-purple-300 animate-slide-up">
            <Command className="w-3 h-3" />
            <span>git commit -m "Creator"</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            MEET THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">ARCHITECT</span>
          </h1>
          
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed font-code animate-slide-up" style={{ animationDelay: '200ms' }}>
            // The mind behind the interface. <br/>
            // Crafting digital experiences with code and creativity.
          </p>
        </section>

        {/* Developers Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-32">
          <div className="max-w-4xl mx-auto flex justify-center">
            
            {/* Full Stack Developer - Shashank */}
            <CodeWindow 
              name="Shashank"
              role="Full Stack Developer"
              handle="shashank_fullstack.js"
              image="/images/shashank.png"
              type="backend"
              delay={300}
              skills={["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind", "Three.js", "JWT", "SendGrid"]}
              socialLinks={{
                github: "https://github.com/shashank7109",
                linkedin: "https://linkedin.com/in/shashankbindal07",
                email: "bindalshashank.89@gmail.com"
              }}
            />

          </div>
        </section>

        {/* Tech Stack Marquee */}
        <section className="border-y border-white/5 bg-white/[0.02] py-8 overflow-hidden mb-20">
          <div className="flex gap-12 justify-center items-center text-white/20 font-black text-4xl uppercase tracking-widest select-none whitespace-nowrap">
            <span>React</span>
            <span>•</span>
            <span>Next.JS</span>
            <span>•</span>
            <span>Tailwind</span>
            <span>•</span>
            <span>Framer</span>
            <span>•</span>
            <span>Node</span>
            <span>•</span>
            <span>GraphQL</span>
          </div>
        </section>

        <div className="text-center pb-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors font-code text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            cd /home
          </a>
        </div>

        <Footer />
      </div>
    </div>
  );
}
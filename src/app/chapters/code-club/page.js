"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PillNav from "@/components/ui/PillNav";
import { 
  Code, 
  Cpu, 
  Zap, 
  Target, 
  Users, 
  Award, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Terminal, 
  Database, 
  Github, 
  Monitor, 
  Globe, 
  Layers, 
  Command, 
  Hash 
} from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

// --- Custom CSS for Terminal/Cyber Effects ---
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

  .font-mono-theme {
    font-family: 'JetBrains Mono', monospace;
  }

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  .animate-scanline {
    animation: scanline 8s linear infinite;
  }

  .animate-blink {
    animation: blink 1s step-end infinite;
  }

  .cyber-grid {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
  }

  .cyber-card-hover:hover {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
  }
  
  .text-glow {
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  }
`;

// --- Components ---

const CodeBlock = () => {
  const [text, setText] = useState("");
  const fullText = `const society = {
  name: "IEEE Computer Society",
  mission: "Empower Innovators",
  status: "ONLINE",
  members: 300+,
  skills: ["React", "AI/ML", "Cloud"]
};

function init() {
  return "Future Loaded";
}`;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono-theme text-xs sm:text-sm leading-relaxed p-4 md:p-6 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-50" />
      <div className="flex gap-1.5 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
      </div>
      <pre className="text-emerald-500/80 whitespace-pre-wrap">
        <span dangerouslySetInnerHTML={{ 
          __html: text.replace(/const|function|return/g, '<span class="text-purple-400">$&</span>')
                      .replace(/"[^"]*"/g, '<span class="text-cyan-400">$&</span>')
                      .replace(/[0-9]+/g, '<span class="text-orange-400">$&</span>')
        }} />
        <span className="animate-blink inline-block w-2 h-4 bg-emerald-500 ml-1 align-middle"></span>
      </pre>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, idx }) => {
  return (
    <div 
      className="group relative p-6 bg-[#0a0a0a] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 cyber-card-hover overflow-hidden"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-emerald-500/0 group-hover:border-r-emerald-500 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />

      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
        <Icon className="w-10 h-10 text-emerald-500/50 group-hover:text-emerald-400 transition-colors relative z-10" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 font-mono-theme group-hover:text-emerald-300 transition-colors">
        {title}
      </h3>
      
      <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
        {description}
      </p>
    </div>
  );
};

const ActivityCard = ({ title, description, icon: Icon, tags }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-8 h-8 text-cyan-400" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-white mb-2 font-mono-theme flex items-center gap-2">
          {title}
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-2 transition-all" />
        </h4>
        <p className="text-white/60 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/5 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CSSocietyPage() {
  const features = [
    {
      icon: Terminal,
      title: "Programming Excellence",
      description: "Master syntax and logic. From C++ to Rust, we compile success."
    },
    {
      icon: Layers,
      title: "Full-Stack Dev",
      description: "Architect scalable systems using MERN, Next.js, and cloud native tools."
    },
    {
      icon: Zap,
      title: "Competitive Coding",
      description: "Algorithm optimization labs. Dominate HackerRank, CodeForces & ICPC."
    },
    {
      icon: Github,
      title: "Open Source",
      description: "Commit to the future. Contribute to global repositories and build legacy."
    },
    {
      icon: Users,
      title: "Tech Community",
      description: "A distributed network of developers, debuggers, and dreamers."
    },
    {
      icon: Monitor,
      title: "Cyber Workshops",
      description: "Hands-on bootcamps. From ethical hacking to blockchain deployment."
    }
  ];

  const activities = [
    {
      title: "Web Development Projects",
      description: "Build modern, responsive web applications. Learn state management, API integration, and deployment pipelines.",
      icon: Globe,
      tags: ["React", "Next.js", "Tailwind"]
    },
    {
      title: "App Development",
      description: "Create cross-platform mobile experiences. Dive into Flutter and React Native for iOS and Android.",
      icon: Hash,
      tags: ["Flutter", "Dart", "Mobile"]
    },
    {
      title: "Data Structures & Algorithms",
      description: "The backbone of computer science. Weekly contests to sharpen logic and optimize runtime complexity.",
      icon: Database,
      tags: ["DSA", "C++", "Optimization"]
    },
    {
      title: "Machine Learning Labs",
      description: "Train models that matter. Hands-on projects involving neural networks, NLP, and computer vision.",
      icon: Cpu,
      tags: ["Python", "TensorFlow", "AI"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-200 font-sans overflow-x-hidden">
      <style>{styleTag}</style>
      
      {/* Fixed Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-[4px] w-full animate-scanline opacity-20" />
        {/* Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <PillNav items={navItems} />

      <main className="relative z-10 pt-24 pb-20">
        
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 mb-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono-theme">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM_STATUS: ONLINE
              </div>
              
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                COMPUTER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient bg-[length:200%_auto]">
                  SOCIETY
                </span>
              </h1>
              
              <p className="text-white/60 text-lg max-w-xl leading-relaxed font-mono-theme">
                {`> Empowering the next generation of developers.`} <br/>
                {`> Compiling knowledge into action.`} <br/>
                {`> Executing innovation.`}
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="/events" className="px-8 py-4 bg-emerald-500 text-black font-bold font-mono-theme uppercase tracking-wider hover:bg-emerald-400 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  Initialize_Events
                </a>
                <a href="/contact" className="px-8 py-4 border border-white/20 text-white font-bold font-mono-theme uppercase tracking-wider hover:bg-white/5 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                  Join_Network
                </a>
              </div>
            </div>

            {/* Hero Visual - Terminal */}
            <div className="lg:col-span-5 perspective-1000">
              <div className="transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
                <CodeBlock />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 sm:px-6 lg:px-8 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono-theme">
                  <span className="text-emerald-500">01.</span> Core_Modules
                </h2>
                <p className="text-white/50 text-sm">Loading society capabilities...</p>
              </div>
              <div className="hidden md:block font-mono-theme text-xs text-emerald-500/50">
                [ MODULES_LOADED: 6/6 ]
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} {...feature} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Activities List */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Sticky Header */}
              <div className="lg:col-span-4">
                <div className="sticky top-32">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-mono-theme">
                    <span className="text-cyan-500">02.</span> <br />
                    Active <br /> Threads
                  </h2>
                  <p className="text-white/60 text-lg mb-8 leading-relaxed">
                    Execute your potential through our rigorous activity streams. From web to AI, we have a process for every passion.
                  </p>
                  <div className="w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent mb-8" />
                  <div className="flex gap-4 text-xs font-mono-theme text-white/30">
                    <span>CPU: 45%</span>
                    <span>RAM: 12GB</span>
                    <span>NET: 1GBPS</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-8 space-y-4">
                {activities.map((activity, idx) => (
                  <ActivityCard key={idx} {...activity} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer-like CTA */}
        <section className="px-4 sm:px-6 lg:px-8 text-center py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-emerald-900/10">
          <div className="max-w-3xl mx-auto">
            <Terminal className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              READY TO <span className="text-emerald-500">DEPLOY?</span>
            </h2>
            <p className="text-white/60 mb-10 text-lg">
              The repository is open. Commit your skills and push for innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-8 py-4 bg-white text-black font-bold font-mono-theme hover:bg-gray-200 transition-colors">
                sudo join_us
              </a>
              <a href="/events" className="px-8 py-4 border border-white/20 text-white font-bold font-mono-theme hover:bg-white/5 hover:border-white/40 transition-colors">
                ./view_schedule
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
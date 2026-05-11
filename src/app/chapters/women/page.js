"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PillNav from "@/components/ui/PillNav";
import { 
  Users, 
  Globe, 
  BookOpen, 
  Target, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  Award, 
  Zap,
  Cpu,
  Network,
  Share2,
  Atom
} from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

// --- Custom CSS for Professional Animations ---
const styleTag = `
  @keyframes orbit {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  @keyframes float-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-orbit {
    animation: orbit 20s linear infinite;
  }
  .animate-orbit-slow {
    animation: orbit 40s linear infinite;
  }
  .animate-orbit-reverse {
    animation: orbit 30s linear infinite reverse;
  }
  .animate-float {
    animation: float-subtle 6s ease-in-out infinite;
  }
  
  .bg-tech-grid {
    background-size: 50px 50px;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  }
`;

// --- Components ---

const FeatureCard = ({ icon: Icon, title, description, idx }) => {
  return (
    <div 
      className="group relative p-8 bg-[#0a0a0a] border border-white/10 hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 flex items-center justify-center mb-6 border border-white/10 bg-white/5 group-hover:bg-pink-500/10 group-hover:border-pink-500/20 transition-colors rounded-none">
          <Icon className="w-6 h-6 text-white/70 group-hover:text-pink-400 transition-colors" />
        </div>
        
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-pink-100 transition-colors">
          {title}
        </h3>
        
        <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
          {description}
        </p>
      </div>
      
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-white/5 group-hover:border-r-pink-500/30 transition-all" />
    </div>
  );
};

const ActivityRow = ({ title, description, idx }) => {
  return (
    <div className="group relative pl-8 border-l border-white/10 hover:border-pink-500/50 transition-colors duration-300 pb-12 last:pb-0">
      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-black border border-white/30 group-hover:border-pink-500 group-hover:bg-pink-500 transition-all duration-300" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.04] transition-all">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-200">{title}</h3>
          <p className="text-white/50 text-sm max-w-2xl">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <button className="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-white hover:text-black text-white transition-all">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WIEPage() {
  const features = [
    {
      icon: Network,
      title: "Global Synergy",
      description: "Connect with a worldwide ecosystem of engineers, scientists, and industry leaders driving innovation."
    },
    {
      icon: Sparkles,
      title: "Strategic Initiatives",
      description: "Spearheading impactful programs that bridge the gender gap in STEM fields through actionable frameworks."
    },
    {
      icon: Share2,
      title: "Mentorship",
      description: "Structured guidance programs connecting aspiring students with established industry veterans."
    },
    {
      icon: BookOpen,
      title: "STAR Program",
      description: "Student-Teacher and Research Engineer/Scientist program designed to inspire the next generation."
    },
    {
      icon: Globe,
      title: "Collabratec™ Network",
      description: "Leverage IEEE's exclusive digital platform to collaborate on research and technical projects."
    },
    {
      icon: Target,
      title: "Professional Growth",
      description: "Curated resources, workshops, and conferences to accelerate career trajectory and leadership skills."
    }
  ];

  const activities = [
    {
      title: "Technical Summits",
      description: "High-level panels and keynote sessions featuring pioneering women in technology and engineering."
    },
    {
      title: "STEM Outreach",
      description: "Grassroots initiatives bringing robotics, coding, and science workshops to local schools."
    },
    {
      title: "Leadership Bootcamps",
      description: "Intensive workshops designed to cultivate management, negotiation, and strategic thinking skills."
    },
    {
      title: "Research Symposiums",
      description: "Forums for presenting groundbreaking research and fostering academic collaboration globally."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-pink-500/30 selection:text-white">
      <style>{styleTag}</style>
      <PillNav items={navItems} />
      
      {/* Professional Tech Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-tech-grid opacity-20" />
        
        {/* Orbital System Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
          <div className="absolute inset-0 border border-white/10 rounded-full animate-orbit" />
          <div className="absolute inset-[100px] border border-white/5 rounded-full animate-orbit-reverse" />
          <div className="absolute inset-[200px] border border-white/10 rounded-full animate-orbit-slow" />
          
          {/* Planet Nodes */}
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-pink-600 rounded-full blur-[2px] animate-orbit origin-[0_400px]" />
          <div className="absolute bottom-0 right-1/2 w-3 h-3 bg-purple-600 rounded-full blur-[2px] animate-orbit-reverse origin-[0_-300px]" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <main className="relative z-10 pt-20">
        
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-5xl mx-auto space-y-8 relative">
            {/* Floating Elements */}
            <div className="absolute -top-20 -left-20 w-24 h-24 border border-pink-500/20 rounded-full animate-float opacity-50 hidden md:block" />
            <div className="absolute -bottom-20 -right-20 w-32 h-32 border border-purple-500/20 rounded-full animate-float animation-delay-2000 opacity-50 hidden md:block" />

            <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-white/80 uppercase">Advancing Technology for Humanity</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
              WOMEN IN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600">
                ENGINEERING
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
              A global network dedicated to promoting women engineers and scientists, and inspiring girls around the world to follow their academic interests to a career in engineering.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <a href="/events" className="group relative px-8 py-4 bg-white text-black font-bold overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                <span className="relative flex items-center gap-2 z-10">
                  Explore Events <ArrowRight className="w-4 h-4" />
                </span>
              </a>
              <a href="/contact" className="px-8 py-4 border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                Become a Member
              </a>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5">
              <div className="w-full aspect-square relative">
                <div className="absolute inset-0 border border-white/10 rotate-45" />
                <div className="absolute inset-4 border border-pink-500/20 -rotate-12" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Atom className="w-32 h-32 text-white/10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-sm" />
              </div>
            </div>
            <div className="md:col-span-7">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Empowering <span className="text-pink-500">Visionaries</span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8 font-light">
                IEEE Women in Engineering (WIE) is one of the largest international professional organizations dedicated to promoting women engineers and scientists. Our mission is to facilitate the recruitment and retention of women in technical disciplines globally.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">30K+</div>
                  <div className="text-xs text-pink-400 uppercase tracking-widest">Global Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">100+</div>
                  <div className="text-xs text-purple-400 uppercase tracking-widest">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="impact" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Strategic Pillars</h2>
                <p className="text-white/50">Our framework for fostering growth and innovation.</p>
              </div>
              <div className="h-px flex-1 bg-white/10 ml-8 mb-4 hidden md:block" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} {...feature} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">
              Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Engagements</span>
            </h2>
            
            <div className="space-y-0">
              {activities.map((activity, idx) => (
                <ActivityRow key={idx} {...activity} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 text-center relative overflow-hidden border-t border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-pink-900/20 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 border border-white/20 flex items-center justify-center rotate-45">
                <Zap className="w-10 h-10 text-pink-500 -rotate-45" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Define the <span className="text-pink-500">Future</span>
            </h2>
            <p className="text-white/60 mb-10 text-lg max-w-xl mx-auto">
              Your perspective is unique. Your potential is limitless. Join us in building a more inclusive technological landscape.
            </p>
            
            <div className="flex justify-center gap-6">
              <a href="/contact" className="px-10 py-4 bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                Get Involved
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
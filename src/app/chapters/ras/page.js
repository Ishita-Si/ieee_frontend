"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import PillNav from "@/components/ui/PillNav";
import { 
  Bot, 
  Cpu, 
  Zap, 
  Target, 
  Users, 
  Award, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Code, 
  Microchip, 
  Cog, 
  Settings, 
  CircuitBoard, 
  Terminal, 
  Share2, 
  Power, 
  Scan, 
  Aperture, 
  ChevronDown,
  Activity
} from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

// --- Custom CSS ---
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&family=Inter:wght@300;400;600&display=swap');

  :root {
    --neon-cyan: #06b6d4;
    --bg-black: #000000;
  }

  .font-mono-theme {
    font-family: 'JetBrains Mono', monospace;
  }

  /* Animations */
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-scan {
    background: linear-gradient(to bottom, transparent 50%, rgba(6, 182, 212, 0.1) 50%);
    background-size: 100% 4px;
    animation: scanline 4s linear infinite;
  }
  
  .animate-blink { animation: blink 1s step-end infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }

  /* Circuit Pattern */
  .bg-circuit-pattern {
    background-image: 
      radial-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
      linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* HUD Card */
  .hud-card {
    background: rgba(10, 10, 10, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  /* Corner Brackets */
  .hud-card::before {
    content: ''; position: absolute; top: 0; left: 0; width: 10px; height: 10px;
    border-top: 1px solid var(--neon-cyan); border-left: 1px solid var(--neon-cyan);
    opacity: 0.5; transition: all 0.3s ease;
  }
  .hud-card::after {
    content: ''; position: absolute; bottom: 0; right: 0; width: 10px; height: 10px;
    border-bottom: 1px solid var(--neon-cyan); border-right: 1px solid var(--neon-cyan);
    opacity: 0.5; transition: all 0.3s ease;
  }
  
  .hud-card:hover {
    border-color: rgba(6, 182, 212, 0.3);
    background: rgba(6, 182, 212, 0.02);
  }
  .hud-card:hover::before, .hud-card:hover::after {
    width: 20px; height: 20px; opacity: 1;
  }

  /* Ensure Spline canvas stays behind text overlay */
  .spline-container canvas,
  .spline-container iframe {
    z-index: 1 !important;
    position: relative !important;
  }

  .text-overlay {
    z-index: 9999 !important;
    position: relative !important;
  }

  /* Mobile responsiveness for Spline - Shifted downward */
  @media (max-width: 640px) {
    .spline-container {
      top: 150px !important;
      bottom: -150px !important;
      height: calc(100% + 150px) !important;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .spline-container {
      top: 200px !important;
      bottom: -200px !important;
      height: calc(100% + 200px) !important;
    }
  }

  @media (min-width: 1025px) {
    .spline-container {
      top: 250px !important;
      bottom: -250px !important;
      height: calc(100% + 250px) !important;
    }
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .hud-card {
      padding: 1rem !important;
    }
    
    .cyber-card {
      padding: 1rem !important;
    }

    /* Prevent text overflow on mobile */
    h1, h2, h3, h4 {
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
  }

  /* Tablet optimizations */
  @media (min-width: 641px) and (max-width: 1024px) {
    .hud-card {
      padding: 1.25rem !important;
    }
  }

  /* Individual Element Padding Classes - Modify these to adjust padding for each element */
  
  /* Hero Section Elements */
  .ras-hero-content-wrapper {
    padding: 0;
  }
  .ras-hero-badge-wrapper {
    padding: 0.5rem;
  }
  .ras-hero-heading-wrapper {
    padding: 0.5rem;
  }
  .ras-hero-description-wrapper {
    padding: 0.5rem;
  }

  /* Stats Section Elements */
  .ras-stats-section {
    padding: 0;
  }
  .ras-stats-container {
    padding: 1rem 1rem;
  }
  .ras-stats-grid {
    padding: 0;
  }
  .ras-stats-item {
    padding: 0;
  }

  /* About Section Elements */
  .ras-about-section {
    padding: 3rem 1rem;
  }
  .ras-about-container {
    padding: 0;
  }
  .ras-about-grid {
    padding: 0;
  }
  .ras-about-left {
    padding: 0;
  }
  .ras-about-heading-wrapper {
    padding: 0;
  }
  .ras-about-description-wrapper {
    padding: 0;
  }
  .ras-about-badges-wrapper {
    padding: 0;
  }
  .ras-about-features {
    padding: 0;
  }

  /* Projects Section Elements */
  .ras-projects-section {
    padding: 3rem 1rem;
  }
  .ras-projects-container {
    padding: 0;
  }
  .ras-projects-header {
    padding: 0 0 2rem 0;
  }
  .ras-projects-title-wrapper {
    padding: 0;
  }
  .ras-projects-icon-wrapper {
    padding: 0;
  }
  .ras-projects-list {
    padding: 0;
  }
  .ras-project-item {
    padding: 1rem;
  }
  .ras-project-content {
    padding: 0;
  }
  .ras-project-meta {
    padding: 0;
  }

  /* CTA Section Elements */
  .ras-cta-section {
    padding: 3rem 1rem;
  }
  .ras-cta-container {
    padding: 0;
  }
  .ras-cta-icon-wrapper {
    padding: 0;
  }
  .ras-cta-heading-wrapper {
    padding: 0;
  }
  .ras-cta-description-wrapper {
    padding: 0;
  }
  .ras-cta-button-wrapper {
    padding: 0;
  }

  /* Responsive padding adjustments */
  @media (min-width: 640px) {
    .ras-stats-container {
      padding: 1.25rem 1.5rem;
    }
    .ras-about-section {
      padding: 4rem 1.5rem;
    }
    .ras-projects-section {
      padding: 4rem 1.5rem;
    }
    .ras-cta-section {
      padding: 4rem 1.5rem;
    }
    .ras-project-item {
      padding: 1.25rem;
    }
  }

  @media (min-width: 768px) {
    .ras-stats-container {
      padding: 1.5rem 2rem;
    }
    .ras-about-section {
      padding: 5rem 2rem;
    }
    .ras-projects-section {
      padding: 5rem 2rem;
    }
    .ras-cta-section {
      padding: 5rem 2rem;
    }
    .ras-project-item {
      padding: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .ras-about-section {
      padding: 6rem 3rem;
    }
    .ras-projects-section {
      padding: 6rem 3rem;
    }
    .ras-cta-section {
      padding: 6rem 3rem;
    }
  }

  @media (min-width: 1280px) {
    .ras-about-section {
      padding: 8rem 3rem;
    }
    .ras-projects-section {
      padding: 8rem 3rem;
    }
    .ras-cta-section {
      padding: 8rem 3rem;
    }
  }
`;

// --- Components ---

// Dynamically import Spline to avoid async client component issues
const Spline = dynamic(
  () => import('@splinetool/react-spline'),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-black">
        <div className="text-cyan-500/50 text-sm font-mono-theme">Loading 3D Scene...</div>
      </div>
    )
  }
);

// Full Screen Spline Component
// Add ?v=timestamp or version number to bust cache when scene is updated
const FullScreenSpline = () => {
  const containerRef = React.useRef(null);
  
  // Cache-busting: Update this version number when you update the scene in Spline
  const sceneVersion = 'v2'; // Change this when you update the scene
  const sceneUrl = `https://prod.spline.design/w12PaRYS19rGu5vn/scene.splinecode?v=${sceneVersion}`;
  
  // Force Spline canvas/iframe to stay behind text
  React.useEffect(() => {
    const setSplineZIndex = () => {
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        const iframe = containerRef.current.querySelector('iframe');
        
        if (canvas) {
          canvas.style.zIndex = '1';
          canvas.style.position = 'relative';
        }
        if (iframe) {
          iframe.style.zIndex = '1';
          iframe.style.position = 'relative';
        }
      }
    };
    
    // Set immediately and also after a delay to catch late-rendered elements
    setSplineZIndex();
    const timer = setTimeout(setSplineZIndex, 100);
    const timer2 = setTimeout(setSplineZIndex, 500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [sceneVersion]);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full spline-container" 
      style={{ 
        zIndex: 1,
        position: 'absolute',
        top: '250px',
        left: 0,
        right: 0,
        bottom: '-250px',
        height: 'calc(100% + 250px)'
      }}
    >
      <Spline
        scene={sceneUrl}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          objectFit: 'cover'
        }}
        key={sceneVersion}
      />
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="hud-card p-4 sm:p-5 md:p-6 lg:p-8 group h-full">
    <div className="mb-3 sm:mb-4 flex items-center justify-between">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-cyan-500 group-hover:text-white transition-colors flex-shrink-0" />
      <span className="text-[8px] sm:text-[10px] font-mono-theme text-white/20 group-hover:text-cyan-500 transition-colors">0x01</span>
    </div>
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 font-mono-theme uppercase tracking-tight break-words">
      {title}
    </h3>
    <p className="text-white/40 text-xs sm:text-sm md:text-base leading-relaxed group-hover:text-white/60 transition-colors font-light">
      {description}
    </p>
  </div>
);

const ActivityNode = ({ title, description, idx }) => (
  <div className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 border-l border-white/10 last:pb-0 group">
    {/* Timeline Dot */}
    <div className="absolute left-[-4px] sm:left-[-5px] top-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black border border-white/30 group-hover:border-cyan-400 group-hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_0_4px_black]" />
    
    <div className="cyber-card p-4 sm:p-6 rounded-lg border-white/5 hover:border-cyan-500/30 transition-all group-hover:translate-x-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{title}</h4>
        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/20 group-hover:text-cyan-500 group-hover:rotate-90 transition-all duration-500" />
      </div>
      <p className="text-white/50 text-xs sm:text-sm font-mono-theme">{description}</p>
    </div>
  </div>
);

export default function RASPage() {
  const features = [
    { icon: Bot, title: "Autonomous Systems", description: "Self-governing agents navigating complex environments." },
    { icon: CircuitBoard, title: "Embedded Logic", description: "Micro-controller interfacing for real-world IO." },
    { icon: Activity, title: "Control Theory", description: "PID algorithms for stabilized robotic movement." },
    { icon: Zap, title: "Power Systems", description: "Optimized distribution for long-endurance missions." },
    { icon: Code, title: "Computer Vision", description: "SLAM and perception algorithms for machine sight." },
    { icon: Users, title: "HRI Research", description: "Seamless collaboration between humans and machines." }
  ];

  const activities = [
    { title: "Line Follower V3", status: "Optimized", desc: "PID-based autonomous navigation unit." },
    { title: "Obstacle Avoidance", status: "Active", desc: "LiDAR integration for mapping." },
    { title: "Arm Manipulator", status: "Dev", desc: "6-DOF robotic arm for precision tasks." },
    { title: "Swarm Drones", status: "Planning", desc: "Coordinated aerial surveillance grid." }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <style>{styleTag}</style>
        <PillNav items={navItems} />

      {/* --- FULL SCREEN HERO --- */}
      <section className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-screen overflow-hidden bg-black">
        
        {/* 3D Scene Container - Behind text */}
        <FullScreenSpline />
        
        {/* Hero Content Wrapper - Individual padding control */}
        <div className="ras-hero-content-wrapper absolute inset-0 pointer-events-none">
          {/* Overlay Elements (Top-Center Focus, Minimized) - On top of Spline */}
          <div 
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center sm:justify-start text-overlay" 
            style={{ 
              zIndex: 9999,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              paddingTop: '4rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingBottom: '1rem'
            }}
          >
              
              {/* Main Text Content */}
              <div 
                className="text-center w-full max-w-4xl pointer-events-auto bg-black/20 sm:bg-black/10 backdrop-blur-[2px] rounded-xl sm:rounded-2xl border border-white/0 hover:border-white/5 transition-colors"
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 10000,
                  padding: '1rem'
                }}
              >
                  {/* Badge Wrapper - Individual padding */}
                  <div className="ras-hero-badge-wrapper flex justify-center mb-3 sm:mb-4" style={{ padding: '0.5rem' }}>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 border border-cyan-500/30 bg-black/40 backdrop-blur-md rounded-full" style={{ padding: '0.5rem 0.75rem' }}>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 animate-blink" />
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-mono-theme text-cyan-400 tracking-widest uppercase">Active Node</span>
            </div>
          </div>
                  
                  {/* Heading Wrapper - Individual padding */}
                  <div className="ras-hero-heading-wrapper mb-3 sm:mb-4" style={{ padding: '0.5rem' }}>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tighter leading-[1.1] sm:leading-tight break-words">
                        ROBOTICS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">AUTOMATION</span> SOCIETY
                    </h1>
            </div>

                  {/* Description Wrapper - Individual padding */}
                  <div className="ras-hero-description-wrapper" style={{ padding: '0.5rem' }}>
                    <p className="text-white/50 text-xs sm:text-sm md:text-base font-mono-theme max-w-lg mx-auto leading-relaxed">
                        // EMPOWERING THE NEXT GENERATION OF ENGINEERS //
                  </p>
                </div>
              </div>

              {/* Decorative Side Lines (Subtle) - Hidden on mobile */}
              <div className="absolute top-16 sm:top-20 md:top-24 left-4 sm:left-8 w-px h-12 sm:h-16 md:h-24 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden md:block" />
              <div className="absolute top-16 sm:top-20 md:top-24 right-4 sm:right-8 w-px h-12 sm:h-16 md:h-24 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden md:block" />
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="ras-stats-section border-y border-white/10 bg-black relative z-20">
         {/* Stats Container - Individual padding */}
         <div className="ras-stats-container max-w-7xl mx-auto">
           {/* Stats Grid - Individual padding */}
           <div className="ras-stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                  { label: "Projects", val: "25+" },
                  { label: "Members", val: "120" },
                  { label: "Workshops", val: "15" },
                  { label: "Patents", val: "03" }
              ].map((s, i) => (
                  <div key={i} className="ras-stats-item flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 md:gap-4">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono-theme">{s.val}</span>
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/40 sm:border-l sm:border-white/20 sm:pl-3">{s.label}</span>
                </div>
              ))}
              </div>
            </div>
          </div>

      {/* --- ABOUT / MISSION --- */}
      <section id="about" className="ras-about-section bg-circuit-pattern relative z-20">
        {/* About Container - Individual padding */}
        <div className="ras-about-container max-w-7xl mx-auto">
          {/* About Grid - Individual padding */}
          <div className="ras-about-grid grid md:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
              {/* About Left Column - Individual padding */}
              <div className="ras-about-left md:col-span-5">
                  <div className="md:sticky md:top-32">
                      {/* About Heading - Individual padding */}
                      <div className="ras-about-heading-wrapper mb-4 sm:mb-5 md:mb-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3">
                            <Aperture className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-cyan-500 flex-shrink-0" />
                            <span>Core Directive</span>
              </h2>
            </div>
                      {/* About Description - Individual padding */}
                      <div className="ras-about-description-wrapper mb-6 sm:mb-8">
                        <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed font-light">
                            We are the architects of the autonomous future. Bridging the gap between theoretical mechanics and real-world application through rigorous experimentation and prototyping.
                        </p>
                      </div>
                      {/* About Badges - Individual padding */}
                      <div className="ras-about-badges-wrapper flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                          <div className="px-3 sm:px-4 py-1.5 sm:py-2 border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-[10px] sm:text-xs font-mono-theme whitespace-nowrap">RESEARCH</div>
                          <div className="px-3 sm:px-4 py-1.5 sm:py-2 border border-white/10 text-white/60 text-[10px] sm:text-xs font-mono-theme whitespace-nowrap">DEVELOPMENT</div>
                    </div>
                  </div>
              </div>

              {/* About Features Grid - Individual padding */}
              <div className="ras-about-features md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  {features.map((feature, idx) => (
                      <FeatureCard key={idx} {...feature} idx={idx} />
                  ))}
              </div>
            </div>
          </div>
        </section>

      {/* --- PROJECTS LIST --- */}
      <section id="projects" className="ras-projects-section border-t border-white/10 relative z-20 bg-black">
          {/* Projects Container - Individual padding */}
          <div className="ras-projects-container max-w-7xl mx-auto">
            {/* Projects Header - Individual padding */}
            <div className="ras-projects-header flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                {/* Projects Title Wrapper - Individual padding */}
                <div className="ras-projects-title-wrapper">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Active Protocols</h2>
                    <p className="text-white/40 text-xs sm:text-sm md:text-base font-mono-theme">/root/projects/current</p>
                </div>
                {/* Projects Icon - Individual padding */}
                <div className="ras-projects-icon-wrapper">
                  <Scan className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-cyan-500 animate-pulse hidden sm:block" />
                </div>
            </div>

            {/* Projects List - Individual padding */}
            <div className="ras-projects-list space-y-1 sm:space-y-2">
                {activities.map((act, i) => (
                    <div key={i} className="ras-project-item group flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer gap-3 sm:gap-4 md:gap-6">
                        <div className="ras-project-content flex items-start sm:items-center gap-3 sm:gap-4 md:gap-6 flex-1">
                            <span className="text-xs sm:text-sm font-mono-theme text-cyan-500 opacity-50 group-hover:opacity-100 flex-shrink-0 mt-1 sm:mt-0">0{i+1}</span>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white group-hover:translate-x-2 transition-transform break-words">{act.title}</h3>
                              <span className="sm:hidden text-xs sm:text-sm text-white/40 mt-1 block">{act.desc}</span>
                            </div>
                        </div>
                        <div className="ras-project-meta flex items-center justify-between sm:justify-end gap-3 sm:gap-4 md:gap-6 sm:flex-shrink-0">
                            <span className="hidden sm:block md:hidden text-xs sm:text-sm text-white/40 max-w-xs">{act.desc}</span>
                            <span className="hidden md:block text-sm md:text-base text-white/40 max-w-md">{act.desc}</span>
                            <span className={`text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 border whitespace-nowrap flex-shrink-0 ${
                                act.status === 'Active' ? 'border-green-500/50 text-green-400' : 
                                act.status === 'Dev' ? 'border-yellow-500/50 text-yellow-400' : 
                                'border-white/20 text-white/40'
                            }`}>
                                {act.status}
                            </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* --- CTA FOOTER --- */}
      <section className="ras-cta-section text-center relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-black to-cyan-950/20 z-20">
          {/* CTA Container - Individual padding */}
          <div className="ras-cta-container max-w-3xl mx-auto">
              {/* CTA Icon Wrapper - Individual padding */}
              <div className="ras-cta-icon-wrapper w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-6 sm:mb-8 md:mb-10 border border-cyan-500/50 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-ping" />
                  <Power className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-cyan-400" />
              </div>
              {/* CTA Heading Wrapper - Individual padding */}
              <div className="ras-cta-heading-wrapper mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white break-words">Initialize Sequence</h2>
              </div>
              {/* CTA Description Wrapper - Individual padding */}
              <div className="ras-cta-description-wrapper mb-6 sm:mb-8 md:mb-10">
                <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">Join the unit. Access hardware labs, mentorship, and funding.</p>
              </div>
              {/* CTA Button Wrapper - Individual padding */}
              <div className="ras-cta-button-wrapper flex justify-center gap-4">
                  <a href="/contact" className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 bg-white text-black font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest hover:bg-cyan-400 transition-colors rounded whitespace-nowrap">
                      Execute Join
                  </a>
            </div>
          </div>
        </section>

    </div>
  );
}
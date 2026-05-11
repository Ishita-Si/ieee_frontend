"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Using <a> for standalone compatibility
import { Target, Users, Award, Lightbulb, TrendingUp, Code, BookOpen, Trophy, Calendar, Briefcase, Network, GraduationCap, ArrowRight, Sparkles, Zap, Heart, Rocket, Camera } from 'lucide-react';

// --- Shared Components ---

const StatCard = ({ value, label, icon: Icon, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            const numericValue = parseInt(value.toString().replace(/\D/g, ''));
            const duration = 2000;
            const startTime = Date.now();
            const startValue = 0;

            const animate = () => {
              const now = Date.now();
              const elapsed = (now - startTime) / 1000;
              const progress = Math.min(elapsed / (duration / 1000), 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const current = Math.floor(startValue + (numericValue - startValue) * easeOutQuart);
              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(numericValue);
              }
            };
            animate();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
        if (cardRef.current) observer.unobserve(cardRef.current);
    }
  }, [isVisible, value]);

  const suffix = value.toString().includes('+') ? '+' : value.toString().includes('%') ? '%' : '';

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
      }}
    >
      {/* Main Card */}
      <div className="relative bg-zinc-900/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm transition-all duration-500 group-hover:bg-zinc-900/80 group-hover:border-purple-500/30 group-hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]">
        
        <div className="flex items-end justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <Icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">
                {count}{suffix}
            </div>
        </div>

        {/* Label */}
        <div className="relative z-10">
          <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors">
            {label}
          </p>
        </div>

        {/* Hover Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
      </div>
    </div>
  );
};

const ValueCard = ({ title, description, icon: Icon, delay = 0, colorClass = "text-purple-400", bgClass = "bg-purple-500/10", borderHover = "group-hover:border-purple-500/50" }) => {
  return (
    <div
      className={`group relative bg-black border border-white/10 p-8 hover:border-white/20 transition-all duration-500 overflow-hidden rounded-2xl ${borderHover}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
         <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 ${bgClass.replace('/10', '/40')}`} />
      </div>

      <div className="relative z-10">
        <div className={`w-12 h-12 mb-6 flex items-center justify-center rounded-xl ${bgClass} border border-white/5 group-hover:scale-110 transition-all duration-500`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:translate-x-2 transition-transform duration-500">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors group-hover:translate-x-2 duration-500 delay-75">
          {description}
        </p>
      </div>
    </div>
  );
};

const OfferCard = ({ title, description, icon: Icon, idx }) => {
  return (
    <div className="group relative border-b border-white/10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 border-dashed p-8 hover:bg-white/[0.02] transition-colors">
        <div className="mb-6 inline-block p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all duration-500">
            <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-500 group-hover:scale-110" />
        </div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 group-hover:text-blue-300 transition-colors">
            {title}
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400" />
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
            {description}
        </p>
    </div>
  );
};

const AchievementTimeline = ({ year, title, description, delay = 0 }) => {
  return (
    <div className="relative pl-8 pb-12 border-l border-white/10 last:pb-0 group">
      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-black border-2 border-zinc-700 group-hover:border-pink-500 group-hover:bg-pink-500 transition-all duration-300 group-hover:scale-125 shadow-[0_0_0_4px_black]" />
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
        <span className="text-pink-400 font-mono text-xs border border-pink-500/20 px-2 py-0.5 rounded bg-pink-500/5 group-hover:bg-pink-500 group-hover:text-white transition-colors">
            {year}
        </span>
        <h3 className="text-lg font-bold text-white group-hover:text-pink-200 transition-colors">
            {title}
        </h3>
      </div>
      <p className="text-zinc-500 text-sm max-w-md group-hover:text-zinc-300 transition-colors">{description}</p>
    </div>
  );
};

const ImageGallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop", // Coding/Meeting
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop", // Team High Five
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", // Workshop
    "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1000&auto=format&fit=crop"  // Hackathon
  ];

  return (
    <div className="mb-32">
        <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm uppercase tracking-widest">
                <Camera className="w-4 h-4" />
                <span>Life at IEEE</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((src, idx) => (
            <div 
                key={idx} 
                className={`relative group overflow-hidden rounded-xl h-64 border border-white/10 hover:border-cyan-500/50 transition-colors duration-500 ${
                    idx % 2 === 1 ? 'md:translate-y-8' : ''
                }`}
            >
                <div className="absolute inset-0 bg-zinc-950/60 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80" />
                
                <img
                    src={src}
                    alt="IEEE Event"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                />
                
                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 w-full p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Gallery</div>
                    <div className="text-white text-sm font-medium">Moment {idx + 1}</div>
                </div>
            </div>
        ))}
        </div>
    </div>
  )
}

const AboutPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const values = [
    { 
        title: 'Innovation', 
        description: 'Pushing boundaries with cutting-edge solutions.', 
        icon: Lightbulb,
        colorClass: "text-amber-400",
        bgClass: "bg-amber-500/10",
        borderHover: "group-hover:border-amber-500/50"
    },
    { 
        title: 'Collaboration', 
        description: 'Building a community of shared knowledge.', 
        icon: Network,
        colorClass: "text-blue-400",
        bgClass: "bg-blue-500/10",
        borderHover: "group-hover:border-blue-500/50"
    },
    { 
        title: 'Excellence', 
        description: 'Striving for the highest technical standards.', 
        icon: Award,
        colorClass: "text-purple-400",
        bgClass: "bg-purple-500/10",
        borderHover: "group-hover:border-purple-500/50"
    },
    { 
        title: 'Leadership', 
        description: 'Forging the next generation of tech leaders.', 
        icon: TrendingUp,
        colorClass: "text-rose-400",
        bgClass: "bg-rose-500/10",
        borderHover: "group-hover:border-rose-500/50"
    }
  ];

  const offers = [
    { title: 'Technical Workshops', description: 'Master modern stacks and tools.', icon: Code },
    { title: 'Guest Lectures', description: 'Insights from industry veterans.', icon: BookOpen },
    { title: 'Hackathons', description: 'Solve real problems, win big.', icon: Trophy },
    { title: 'Research', description: 'Contribute to global innovation.', icon: Rocket },
    { title: 'Networking', description: 'Connect with peers and pros.', icon: Users },
    { title: 'Certifications', description: 'Validate your skills globally.', icon: GraduationCap }
  ];

  const stats = [
    { value: '300+', label: 'Members', icon: Users },
    { value: '75+', label: 'Events', icon: Calendar },
    { value: '20+', label: 'Awards', icon: Trophy },
    { value: '100%', label: 'Growth', icon: TrendingUp },
  ];

  const achievements = [
    { year: '2025', title: 'National Hackathon Winner', description: 'First place in the All-India Code Fest among 500+ teams.' },
    { year: '2024', title: 'Best Student Branch', description: 'Awarded for outstanding activity and member engagement.' },
    { year: '2022', title: 'Research Excellence', description: 'Published 15+ papers in IEEE international conferences.' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Grainy Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        
        {/* Header */}
        <div className={`mb-24 md:mb-32 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-8 bg-purple-500" />
                    <span className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em]">Who We Are</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6 text-white">
                    Engineering <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-purple-400 to-pink-500">The Future.</span>
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                    IEEE RGIPT is where ambition meets opportunity. We are a collective of innovators, builders, and leaders dedicated to advancing technology for humanity.
                </p>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                {stats.slice(0,2).map((stat, idx) => (
                    <div key={idx} className="p-4 border-l border-white/10">
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-purple-400 uppercase tracking-wider font-bold">{stat.label}</div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <ImageGallery />

        {/* Mission Statement */}
        <div className="grid md:grid-cols-12 gap-12 mb-32 items-center">
            <div className="md:col-span-4">
                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-6" />
                <p className="text-zinc-400 leading-relaxed">
                    To foster a culture of <span className="text-white font-medium">technical excellence</span> and <span className="text-white font-medium">professional growth</span>. We provide the resources, mentorship, and platform for students to transform theoretical knowledge into impactful reality.
                </p>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-4">
                {values.map((value, idx) => (
                    <ValueCard key={idx} {...value} delay={idx * 100} />
                ))}
            </div>
        </div>

        {/* Offerings - Grid Lines Layout */}
        <div className="mb-32">
            <div className="flex items-end justify-between mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white">What We Offer</h2>
                <a href="/events" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors group">
                    View Calendar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
            <div className="bg-zinc-900/20 border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-white/10">
                    {offers.map((offer, idx) => (
                        <OfferCard key={idx} {...offer} idx={idx} />
                    ))}
                </div>
            </div>
        </div>

        {/* Achievements Timeline */}
        <div className="grid md:grid-cols-2 gap-16">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Legacy of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Success</span></h2>
                <p className="text-zinc-400 text-lg mb-8 max-w-sm">
                    Our journey is marked by continuous growth and recognition on national and international platforms.
                </p>
                <div className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-xl">
                    <div className="text-4xl font-black text-white mb-2">15+</div>
                    <div className="text-sm text-purple-400 font-bold uppercase tracking-wider">Years of Excellence</div>
                </div>
            </div>
            <div className="pt-8">
                {achievements.map((achievement, idx) => (
                    <AchievementTimeline key={idx} {...achievement} delay={idx * 100} />
                ))}
            </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 pt-20 border-t border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Ready to shape the future?
            </h2>
            <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-lg">
                Join a community that values innovation and impact. Your journey starts here.
            </p>
            <div className="flex justify-center gap-4">
                <a href="/contact" className="px-8 py-4 bg-white text-black font-bold hover:bg-purple-50 transition-colors rounded-xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                    Join IEEE RGIPT
                </a>
                <a href="/team" className="px-8 py-4 border border-white/20 text-white hover:bg-white/5 transition-colors rounded-xl">
                    Meet the Team
                </a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
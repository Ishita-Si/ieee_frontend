"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import { authService } from "@/lib/auth";
import { 
  Calendar, 
  Users, 
  Trophy, 
  Target, 
  Clock, 
  Award, 
  Code, 
  ArrowRight,
  CheckCircle2,
  FileText,
  Video,
  Globe,
  Sparkles,
  MapPin,
  ChevronRight,
  Terminal,
  Cpu,
  Zap,
  Mail,
  Phone,
  User,
  School,
  GraduationCap,
  Layers,
  BookOpen,
  MessageCircle,
  Send,
  Loader2,
  Building,
  X,
  ArrowLeft,
  Share2,
  Camera
} from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

// --- Custom CSS for Animations ---
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

  .font-mono-theme {
    font-family: 'JetBrains Mono', monospace;
  }

  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes grid-scroll {
    0% { background-position: 0 0; }
    100% { background-position: 30px 30px; }
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-blob {
    animation: blob 20s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }
  .animate-grid {
    animation: grid-scroll 20s linear infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .text-shimmer {
    background: linear-gradient(to right, #ec4899 20%, #a855f7 40%, #ec4899 60%, #a855f7 80%);
    background-size: 200% auto;
    color: #000;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 8s linear infinite;
  }

  .glass-panel {
    background: rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  }

  .bg-grid-pattern {
    background-size: 30px 30px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #050505; 
  }
  ::-webkit-scrollbar-thumb {
    background: #333; 
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
`;

// --- Shared Components ---

const GlassCard = ({ children, className = "", hoverEffect = true, ...props }) => (
  <div 
    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md ${hoverEffect ? 'transition-all duration-500 hover:border-pink-500/50 hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)] hover:-translate-y-1' : ''} ${className}`}
    {...props}
  >
    {/* Inner Glow */}
    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
    {children}
  </div>
);

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <style>{styleTag}</style>
    <div className="absolute inset-0 bg-[#050505]" />
    
    {/* Moving Grid */}
    <div className="absolute inset-0 opacity-20 animate-grid bg-grid-pattern [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]" />

    {/* Animated Blobs */}
    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob" />
    <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000" />
    
    {/* Noise Overlay */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150" />
  </div>
);


// --- Registration Components ---

const InputField = ({ label, name, type = "text", placeholder, icon: Icon, value, onChange, required = true }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 flex items-center gap-1.5 group-focus-within:text-pink-400 transition-colors">
      {Icon && <Icon className="w-3 h-3" />}
      {label} {required && <span className="text-pink-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all duration-300"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, options, value, onChange, icon: Icon, required = true }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 flex items-center gap-1.5 group-focus-within:text-purple-400 transition-colors">
      {Icon && <Icon className="w-3 h-3" />}
      {label} {required && <span className="text-pink-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
      >
        <option value="" className="bg-zinc-900 text-white/50">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-zinc-900 text-white">{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
        <ArrowRight className="w-4 h-4 rotate-90" />
      </div>
    </div>
  </div>
);

const MemberFormSection = ({ index, data, onChange }) => {
  const isLeader = index === 0;
  
  return (
    <div className="glass-panel rounded-2xl p-6 mb-6 animate-fade-in-up border border-white/10" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isLeader ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20' : 'bg-white/10 text-white/70'}`}>
          {index + 1}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isLeader ? 'text-white' : 'text-white/80'}`}>
            {isLeader ? 'Team Leader' : `Team Member ${index + 1}`}
          </h3>
          {isLeader && <p className="text-xs text-pink-400 font-medium uppercase tracking-wider">Primary Contact</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField 
          label="Full Name" 
          name="name" 
          placeholder={isLeader ? "Team Leader Name" : "Member Name"} 
          icon={User}
          value={data.name} 
          onChange={(e) => onChange(index, 'name', e.target.value)} 
        />
        <InputField 
          label="Email Address" 
          name="email" 
          type="email" 
          placeholder="email@example.com" 
          icon={Mail}
          value={data.email} 
          onChange={(e) => onChange(index, 'email', e.target.value)} 
        />
        <InputField 
          label="Mobile Number" 
          name="mobile" 
          type="tel" 
          placeholder="+91 98765 43210" 
          icon={Phone}
          value={data.mobile} 
          onChange={(e) => onChange(index, 'mobile', e.target.value)} 
        />
        <InputField 
          label="College Name" 
          name="college" 
          placeholder="Institute Name" 
          icon={School}
          value={data.college} 
          onChange={(e) => onChange(index, 'college', e.target.value)} 
        />
        <SelectField 
          label="Course" 
          name="course" 
          icon={GraduationCap}
          options={['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'Diploma', 'BVSc', 'BCA', 'MCA', 'PhD', 'Other']}
          value={data.course} 
          onChange={(e) => onChange(index, 'course', e.target.value)} 
        />
        <SelectField 
          label="Branch/Stream" 
          name="branch" 
          icon={Layers}
          options={['CSE', 'CSD', 'ECE', 'EV', 'MnC', 'IT', 'Mechanical', 'Chemical', 'Petroleum', 'Civil', 'Biotech', 'Other']}
          value={data.branch} 
          onChange={(e) => onChange(index, 'branch', e.target.value)} 
        />
        <SelectField 
          label="Year" 
          name="year" 
          icon={BookOpen}
          options={['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']}
          value={data.year} 
          onChange={(e) => onChange(index, 'year', e.target.value)} 
        />
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function CodeForHerPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [view, setView] = useState("landing"); // 'landing' | 'registration' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/signin?redirect=/events/codeforher');
        return;
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }
  
  // Form State
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [members, setMembers] = useState(
    Array(4).fill(null).map(() => ({
      name: "", email: "", mobile: "", college: "", course: "", branch: "", year: ""
    }))
  );

  // Event Data for Landing Page
const eventData = {
  event: {
    year: "2025",
    subtitle: "Code the future. Break the bias.",
    organizer: "IEEE Student Branch, RGIPT",
    badge: "National Hackathon",
  },
  objectives: [
    { title: "Innovate", desc: "Solve real-world problems with creative tech solutions.", icon: Sparkles },
    { title: "Empower", desc: "Bridge the gender gap in technology leadership.", icon: Zap },
    { title: "Build", desc: "Deploy full-stack prototypes in 48 hours.", icon: Cpu },
    { title: "Network", desc: "Connect with industry mentors and peers.", icon: Users },
  ],
  timeline: [
    { date: "15 Dec", title: "Problem Release", desc: "Theme announcement" },
    { date: "22 Dec", title: "Round 1 Deadline", desc: "PPT Submission" },
    { date: "26 Dec", title: "Presentations", desc: "Top 20 Teams" },
    { date: "03 Jan", title: "Final Build", desc: "Prototype Submission" },
    { date: "04 Jan", title: "Grand Finale", desc: "Winners Announced" },
  ]
};

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log({ teamName, track, previousExperience, members });
    setIsSubmitting(false);
    setView("success");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RENDER LOGIC ---

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30 selection:text-white">
      <AnimatedBackground />
      <PillNav items={navItems} />

      <main className="relative z-10">
        
        {/* === LANDING PAGE VIEW === */}
        {view === "landing" && (
          <>
            {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-8 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                    <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">{eventData.event.badge}</span>
              </div>

              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9]">
                CODE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-pink-500">
                  FOR HER
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mt-2">
                  {eventData.event.year}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join the <span className="text-white font-semibold">Premier National Hackathon</span> designed to elevate women in technology. 
                Build, innovate, and lead the future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button 
                      onClick={() => { setView("registration"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none group"
                    >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition group-hover:bg-slate-900">
                    Register Your Team <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                    </button>
                <a href="#structure" className="inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-bold text-white/70 border border-white/10 hover:bg-white/5 transition-colors">
                  View Guidelines
                </a>
              </div>

              {/* Stats */}
              <div className="pt-8 border-t border-white/10 flex gap-8 sm:gap-12 justify-center lg:justify-start">
                 {[
                   { label: "Prize Pool", value: "₹50K+" },
                   { label: "Participants", value: "300+" },
                   { label: "Duration", value: "48 Hrs" }
                 ].map((stat, i) => (
                   <div key={i}>
                     <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                     <div className="text-xs uppercase tracking-wider text-white/40">{stat.label}</div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Hero Visual - 3D Floating Element */}
            <div className="lg:col-span-5 relative hidden lg:block h-[600px]">
              <div className="absolute inset-0 flex items-center justify-center animate-float">
                <div className="relative w-full aspect-square">
                   <div className="absolute inset-4 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-full blur-[100px] opacity-40 animate-pulse" />
                   <GlassCard className="h-full w-full p-8 flex flex-col justify-between border-white/20 bg-black/60 !rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                      <div className="flex justify-between items-start">
                         <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                            <Terminal className="w-8 h-8 text-pink-400" />
                         </div>
                         <div className="flex gap-1.5">
                            {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/20" />)}
                         </div>
                      </div>
                      
                          <div className="font-mono text-sm space-y-2 text-white/50 font-mono-theme">
                            <div className="flex gap-2"><span className="text-purple-400">const</span> <span className="text-white">mission</span> = <span className="text-green-400">"Empower"</span>;</div>
                            <div className="flex gap-2"><span className="text-purple-400">await</span> <span className="text-blue-400">women</span>.<span className="text-yellow-400">lead()</span>;</div>
                            <div className="flex gap-2"><span className="text-pink-400">return</span> <span className="text-white">future;</span></div>
                      </div>

                      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
                            <div className="text-xs font-bold uppercase text-white/40 mb-1">Status</div>
                        <div className="text-lg font-bold text-white flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              Accepting Teams
                        </div>
                      </div>
                   </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </section>

            {/* Objectives Grid */}
        <section className="py-24 relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Participate?</h2>
                 <p className="text-white/60 max-w-2xl mx-auto">More than just a competition. It's a launchpad for your career in technology.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {eventData.objectives.map((obj, idx) => (
                   <GlassCard key={idx} className="p-6 group hover:bg-white/5">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                         <obj.icon className="w-6 h-6 text-pink-400" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{obj.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{obj.desc}</p>
                   </GlassCard>
                 ))}
              </div>
           </div>
        </section>

        {/* --- STRUCTURE / ROUNDS --- */}
        <section id="structure" className="py-24 px-4">
           <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-3xl p-8 md:p-16 border border-white/10 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                 
                 <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                       <h2 className="text-3xl md:text-5xl font-bold mb-6">Event Structure</h2>
                       <p className="text-lg text-white/70 mb-8">
                          A hybrid hackathon designed to test your ideation and implementation skills.
                       </p>
                       
                       <div className="space-y-6">
                          <div className="flex gap-4">
                             <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-bold text-black">1</div>
                                <div className="w-0.5 h-full bg-white/10" />
                             </div>
                             <div className="pb-8">
                                <h3 className="text-xl font-bold text-white mb-2">Round 1: Ideation</h3>
                                <p className="text-white/60">Submit your solution approach via PPT. Focus on novelty, feasibility, and impact.</p>
                                <div className="mt-3 inline-block px-3 py-1 rounded bg-pink-500/20 text-pink-300 text-xs font-bold">Online Submission</div>
                             </div>
                          </div>
                          
                          <div className="flex gap-4">
                             <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">2</div>
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-white mb-2">Round 2: Prototyping</h3>
                                <p className="text-white/60">Build the MVP. 48 hours of coding, mentoring, and deployment.</p>
                                <div className="mt-3 inline-block px-3 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-bold">Hybrid Mode</div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Decorative Code Block */}
                    <div className="relative">
                       <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-600 opacity-30 blur-3xl" />
                       <GlassCard className="p-0 bg-[#0d1117] border-white/10 font-mono text-sm">
                          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                             <div className="w-3 h-3 rounded-full bg-red-500/50" />
                             <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                             <div className="w-3 h-3 rounded-full bg-green-500/50" />
                             <span className="ml-2 text-xs text-white/30">hackathon_config.json</span>
                          </div>
                          <div className="p-6 overflow-x-auto">
<pre className="text-blue-300">
{`{
  "event": "CodeForHer",
  "tracks": [
    "FinTech",
    "HealthTech",
    "Open Innovation"
  ],
  "team_size": {
    "min": 3,
    "max": 4
  },
  "perks": [
    "Mentorship",
    "Internships",
    "Swags"
  ]
}`}
</pre>
                          </div>
                       </GlassCard>
                    </div>
                 </div>
              </div>
           </div>
        </section>

            {/* Timeline */}
            <section id="timeline" className="py-24 relative border-t border-white/5 bg-black/20">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/3 sticky top-32 h-fit">
                        <h2 className="text-4xl font-bold mb-4 text-shimmer">The Roadmap</h2>
                        <p className="text-white/60 mb-8">Follow the journey from registration to the grand finale. Mark these dates!</p>
                    </div>
                    <div className="md:w-2/3 space-y-8 relative">
                        <div className="absolute left-[21px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-pink-500 via-purple-900 to-transparent opacity-30" />
                        {eventData.timeline.map((item, idx) => (
                          <div key={idx} className="relative pl-16 group">
                            <div className="absolute left-3 top-3 w-4 h-4 rounded-full border-2 border-pink-500/50 bg-black group-hover:border-pink-500 group-hover:scale-125 transition-all duration-300 z-10" />
                            <GlassCard className="p-6 flex items-center justify-between gap-4">
                                <div>
                                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                  <p className="text-white/50 text-sm">{item.desc}</p>
                                </div>
                                <div className="text-right">
                                  <span className="block text-2xl font-bold text-white/10 group-hover:text-pink-500/50 transition-colors">{item.date.split(" ")[0]}</span>
                                  <span className="text-xs font-bold uppercase text-white/30">{item.date.split(" ")[1]}</span>
                                </div>
                            </GlassCard>
                          </div>
                        ))}
                    </div>
                  </div>
              </div>
            </section>

            {/* CTA Footer */}
        <section className="py-32 px-4 text-center relative overflow-hidden">
           <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
                 READY TO <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">MAKE HISTORY?</span>
              </h2>
                  <button 
                    onClick={() => { setView("registration"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-block group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden hover:scale-105 transition-transform"
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors">REGISTER TEAM NOW</span>
                    <div className="absolute inset-0 bg-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
              </div>
              <div className="absolute bottom-8 left-0 right-0 text-center text-white/20 text-sm">
                  © 2025 IEEE RGIPT. Built for Builders.
              </div>
            </section>
          </>
        )}

        {/* === REGISTRATION VIEW === */}
        {view === "registration" && (
          <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in-up">
            {/* Registration Header */}
            <div className="text-center mb-12 space-y-4">
              <button 
                onClick={() => setView("landing")}
                className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Register Your Team
              </h1>
              <p className="text-white/60 max-w-xl mx-auto">
                Fill in the details below to register for Code for Her 2025. Make sure you have details of all 4 members ready.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
              {/* Team Info */}
              <GlassCard className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                  <Building className="w-5 h-5 text-pink-400" />
                  Team Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField 
                    label="Team Name" 
                    name="teamName" 
                    placeholder="e.g. The Byte Busters" 
                    icon={Users}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                  <SelectField 
                    label="Preferred Track" 
                    name="track" 
                    icon={Layers}
                    options={['FinTech', 'HealthTech', 'Open Innovation', 'EdTech', 'Sustainability']}
                    value={track} 
                    onChange={(e) => setTrack(e.target.value)} 
                  />
                </div>
              </GlassCard>

              {/* Members Loop */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-semibold text-white/80 uppercase tracking-wider">Member Details</h3>
                  <span className="text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">4 Members Required</span>
                </div>
                {members.map((memberData, index) => (
                  <MemberFormSection 
                    key={index} 
                    index={index} 
                    data={memberData} 
                    onChange={handleMemberChange} 
                  />
                ))}
              </div>

              {/* Additional Info */}
              <GlassCard className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Additional Information
                </h3>
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 flex items-center gap-1.5 group-focus-within:text-blue-400 transition-colors">
                    Previous Hackathon Experience <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all duration-300 resize-none"
                    placeholder="Describe previous experiences or type 'Nil' if you haven't participated yet..."
                  />
                </div>
              </GlassCard>

              {/* Submit Button */}
              <div className="sticky bottom-4 z-50">
                <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl border-t border-white/20 bg-[#0a0a0a]/90">
                  <div className="text-xs text-white/50 text-center md:text-left">
                    By submitting, you agree to the Hackathon Code of Conduct.
           </div>
           
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-2
                      ${isSubmitting ? 'bg-zinc-800 cursor-not-allowed' : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-105'}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Complete Registration <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
            <div className="h-20" />
          </div>
        )}

        {/* === SUCCESS VIEW === */}
        {view === "success" && (
          <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in-up">
            <div className="relative z-10 w-full max-w-lg glass-panel p-8 md:p-12 rounded-3xl text-center border-t-4 border-t-green-500">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-white/60 mb-8">
                Team <span className="text-white font-bold">"{teamName}"</span> has been registered for Code For Her 2025.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30">
                  <p className="text-white font-medium mb-4 text-sm uppercase tracking-wide">
                    Final Step: Join the Community
                  </p>
                  <p className="text-white/70 text-sm mb-6">
                    Join the official WhatsApp group to receive problem statements, updates, and mentor allocations.
                  </p>
                  
                  <a 
                    href="https://chat.whatsapp.com/your-group-link" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 group"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Join WhatsApp Group
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </div>
              </div>

              <button 
                onClick={() => { setView("landing"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-block mt-8 text-sm text-white/40 hover:text-white transition-colors"
              >
                Return to Home
              </button>
            </div>
           </div>
        )}

      </main>
    </div>
  );
}
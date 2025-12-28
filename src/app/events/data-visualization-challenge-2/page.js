"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import { authService } from "@/lib/auth";
import { eventService } from "@/lib/events";
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
  Camera,
  BarChart3,
  Database,
  TrendingUp,
  AlertCircle,
  Shield,
  FileCheck,
  Presentation,
  Eye,
  MessageSquare,
  Plus,
  Minus
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
    background: linear-gradient(to right, #06b6d4 20%, #3b82f6 40%, #06b6d4 60%, #3b82f6 80%);
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

const GlassCard = ({ children, className = "", hoverEffect = true, ...props }) => (
  <div 
    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md ${hoverEffect ? 'transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1' : ''} ${className}`}
    {...props}
  >
    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
    {children}
  </div>
);

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <style>{styleTag}</style>
    <div className="absolute inset-0 bg-[#050505]" />
    <div className="absolute inset-0 opacity-20 animate-grid bg-grid-pattern [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]" />
    <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob" />
    <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150" />
  </div>
);

// --- Registration Components ---
const InputField = ({ label, name, type = "text", placeholder, icon: Icon, value, onChange, required = true }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 flex items-center gap-1.5 group-focus-within:text-cyan-400 transition-colors">
      {Icon && <Icon className="w-3 h-3" />}
      {label} {required && <span className="text-cyan-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const TextAreaField = ({ label, name, placeholder, icon: Icon, value, onChange, rows = 4, required = false }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 flex items-center gap-1.5 group-focus-within:text-cyan-400 transition-colors">
      {Icon && <Icon className="w-3 h-3" />}
      {label} {required && <span className="text-cyan-500">*</span>}
    </label>
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 resize-none"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const MemberFormSection = ({ index, data, onChange, isLeader = false }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-6 animate-fade-in-up border border-white/10" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isLeader ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/10 text-white/70'}`}>
          {index + 1}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isLeader ? 'text-white' : 'text-white/80'}`}>
            {isLeader ? 'Team Leader' : `Team Member ${index}`}
          </h3>
          {isLeader && <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Primary Contact</p>}
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
      </div>
    </div>
  );
};

export default function DataVisualizationChallengePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState("landing"); // 'landing' | 'registration' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Form State - MUST be declared before any early returns
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [members, setMembers] = useState([
    { name: "", email: "", mobile: "" }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        router.push('/signin?redirect=/events/data-visualization-challenge-2');
        return;
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router]);

  // Load user data on mount - MUST be before early return
  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;
    
    const loadUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          // Pre-fill team leader data if user is logged in
          setMembers([{
            name: userData.full_name || "",
            email: userData.email || "",
            mobile: userData.phone_number || ""
          }]);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, [authChecked, isAuthenticated]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // Handle team size change
  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize);
    setTeamSize(size);
    
    // Adjust members array
    if (size > members.length) {
      // Add new members
      const newMembers = Array(size - members.length).fill(null).map(() => ({
        name: "", email: "", mobile: ""
      }));
      setMembers([...members, ...newMembers]);
    } else if (size < members.length) {
      // Remove excess members
      setMembers(members.slice(0, size));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = {
        event_name: "Data Visualisation Challenge 2.0",
        event_slug: "data-visualization-challenge-2",
        team_name: teamName,
        team_size: teamSize,
        members: members.slice(0, teamSize).map(m => ({
          name: m.name,
          email: m.email,
          mobile: m.mobile
        })),
        feedback: feedback || ''
      };

      const result = await eventService.register(formData);
      
      if (result.success) {
        setView("success");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventData = {
    event: {
      year: "2.0",
      subtitle: "Transform data into decisions. Visualize the future.",
      organizer: "IEEE Student Branch, RGIPT",
      badge: "Data Challenge",
    },
    importantDates: [
      { date: "31st December", title: "Registrations Open", desc: "Registration begins" },
      { date: "1st - 6th January", title: "Phase 1: Submission Round", desc: "Analysis, Visualization & Impact" },
      { date: "5th January", title: "Registration Closes", desc: "Last day to register" },
      { date: "7th January", title: "Phase 1 Results", desc: "Top 5 teams announced" },
      { date: "8th January", title: "Phase 2: Live Presentation", desc: "Final round with judges" },
      { date: "9th January", title: "Final Results & Valedictory", desc: "Winners announced" },
    ],
    themes: [
      { name: "Healthcare", icon: Target, color: "from-red-500 to-pink-600" },
      { name: "Agriculture", icon: Globe, color: "from-green-500 to-emerald-600" },
      { name: "Urban Infrastructure", icon: Building, color: "from-blue-500 to-cyan-600" },
    ],
    datasetSources: [
      { name: "Kaggle", desc: "Healthcare, agriculture, climate datasets" },
      { name: "NITI Aayog", desc: "Health Index, SDG data, district indicators" },
      { name: "data.gov.in", desc: "Government of India Open Data Portal" },
      { name: "GitHub Repositories", desc: "Open source datasets" },
      { name: "WHO, World Bank, FAO, IMD", desc: "Global theme-relevant datasets" },
      { name: "State/District Portals", desc: "Local government data sources" },
    ],
    allowedTools: [
      { name: "Power BI", icon: BarChart3 },
      { name: "Tableau", icon: Database },
      { name: "Excel / Google Sheets", icon: FileText },
      { name: "Python", icon: Code },
      { name: "R", icon: Terminal },
      { name: "Streamlit / Dash", icon: TrendingUp },
    ],
    judgingCriteria: [
      { title: "Problem Understanding & Framing", points: 25, desc: "Clarity of problem statement and context" },
      { title: "Data Analysis & Insights", points: 25, desc: "Depth of analysis and quality of insights" },
      { title: "Data Visualization & Storytelling", points: 30, desc: "Visual clarity and narrative effectiveness" },
      { title: "Dataset Extension & Justification", points: 20, desc: "Relevance and justification of additional data" },
      { title: "Impact & Feasibility", points: 20, desc: "Real-world applicability and impact assessment" },
      { title: "Communication & Explanation", points: 30, desc: "Presentation quality and defense of conclusions" },
    ],
    submissionRequirements: [
      { 
        title: "Final Visualizations / Dashboard", 
        icon: BarChart3,
        items: [
          "Interactive dashboard or static visualizations",
          "Must be directly generated from dataset(s) used",
          "Tools: Power BI, Tableau, Excel, Python, R, Streamlit, etc."
        ]
      },
      { 
        title: "Dataset Folder", 
        icon: Database,
        items: [
          "Base dataset",
          "Any additional dataset(s) used",
          "Dataset source, time period, and key variables clearly mentioned"
        ]
      },
      { 
        title: "Project Files", 
        icon: FileCheck,
        items: [
          "Power BI (.pbix), Tableau workbook, notebooks, or source files",
          "Scripts/code for data cleaning, analysis, and visualization",
          "Clear and reproducible folder structure"
        ]
      },
      { 
        title: "Explanation Document", 
        icon: FileText,
        items: [
          "Problem understanding",
          "Key insights derived",
          "Justification of visualization choices",
          "Impact, feasibility, and limitations",
          "Dataset extension explanation (if applicable)"
        ]
      },
      { 
        title: "Short Video / Visual Infographic", 
        icon: Video,
        items: [
          "3–5 minute walkthrough",
          "What the data shows",
          "Why it matters in real life",
          "Key takeaways from visualizations"
        ]
      },
    ],
    strictRules: [
      { rule: "No LLM usage", desc: "ChatGPT, Gemini, Claude, Copilot, etc. are prohibited" },
      { rule: "No AI-assisted analysis", desc: "No AI summarization or insight generation" },
      { rule: "No AI-generated content", desc: "No AI-generated images, icons, charts, or backgrounds" },
      { rule: "No synthetic data", desc: "No simulated or fabricated data allowed" },
      { rule: "No assumed values", desc: "No estimated values added for storytelling" },
      { rule: "Data integrity", desc: "Every visualization must be traceable to its dataset" },
    ],
  };

  // === REGISTRATION VIEW ===
  if (view === "registration") {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 selection:text-white">
        <AnimatedBackground />
        <PillNav items={navItems} />

        <main className="relative z-10">
          <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in-up">
            {/* Registration Header */}
            <div className="text-center mb-12 space-y-4">
              <button 
                onClick={() => setView("landing")}
                className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Event Details
              </button>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Register Your Team
              </h1>
              <p className="text-white/60 max-w-xl mx-auto">
                Fill in the details below to register for Data Visualisation Challenge 2.0. Teams can have 1-4 members.
              </p>
            </div>

            {!isAuthenticated && (
              <div className="max-w-4xl mx-auto mb-8">
                <div className="glass-panel rounded-2xl p-6 border border-yellow-500/30 bg-yellow-500/10">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-yellow-300 mb-2">Login Required</h3>
                      <p className="text-yellow-200/80 text-sm mb-4">
                        You need to be logged in to register for this event. Please login or create an account first.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => router.push('/signin?redirect=/events/data-visualization-challenge-2')}
                          className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => router.push('/signup')}
                          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                {/* Team Info */}
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                    <Building className="w-5 h-5 text-cyan-400" />
                    Team Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField 
                      label="Team Name" 
                      name="teamName" 
                      placeholder="e.g. Data Wizards" 
                      icon={Users}
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                    <div className="space-y-1.5 group">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 flex items-center gap-1.5 group-focus-within:text-cyan-400 transition-colors">
                        <Users className="w-3 h-3" />
                        Team Size <span className="text-cyan-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="teamSize"
                          value={teamSize}
                          onChange={(e) => handleTeamSizeChange(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                        >
                          <option value="1" className="bg-zinc-900 text-white">1 Member (Individual)</option>
                          <option value="2" className="bg-zinc-900 text-white">2 Members</option>
                          <option value="3" className="bg-zinc-900 text-white">3 Members</option>
                          <option value="4" className="bg-zinc-900 text-white">4 Members</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                          <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Members Loop */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-semibold text-white/80 uppercase tracking-wider">Member Details</h3>
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                      {teamSize} {teamSize === 1 ? 'Member' : 'Members'} Required
                    </span>
                  </div>
                  {members.slice(0, teamSize).map((memberData, index) => (
                    <MemberFormSection 
                      key={index} 
                      index={index} 
                      data={memberData} 
                      isLeader={index === 0}
                      onChange={handleMemberChange} 
                    />
                  ))}
                </div>

                {/* Feedback Section */}
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    Feedback & Suggestions (Optional)
                  </h3>
                  <TextAreaField
                    label="Share your feedback or suggestions for improving the challenge"
                    name="feedback"
                    placeholder="We'd love to hear your thoughts on how we can make this challenge better. Any suggestions for themes, datasets, evaluation criteria, or overall experience?"
                    icon={MessageSquare}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    required={false}
                  />
                </GlassCard>

                {/* Submit Button */}
                <div className="sticky bottom-4 z-50">
                  <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl border-t border-white/20 bg-[#0a0a0a]/90">
                    <div className="text-xs text-white/50 text-center md:text-left">
                      By submitting, you agree to the Challenge Code of Conduct and Rules.
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                        w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-2
                        ${isSubmitting ? 'bg-zinc-800 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105'}
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
            )}
            <div className="h-20" />
          </div>
        </main>
      </div>
    );
  }

  // === SUCCESS VIEW ===
  if (view === "success") {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 selection:text-white">
        <AnimatedBackground />
        <PillNav items={navItems} />

        <main className="relative z-10">
          <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in-up">
            <div className="relative z-10 w-full max-w-lg glass-panel p-8 md:p-12 rounded-3xl text-center border-t-4 border-t-green-500">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-white/60 mb-8">
                Team <span className="text-white font-bold">"{teamName}"</span> has been registered for Data Visualisation Challenge 2.0.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30">
                  <p className="text-white font-medium mb-4 text-sm uppercase tracking-wide">
                    Next Steps
                  </p>
                  <p className="text-white/70 text-sm mb-6">
                    You will receive a confirmation email with further instructions. Keep an eye on your inbox for updates about Phase 1 problem statements and submission guidelines.
                  </p>
                  
                  <div className="space-y-2 text-left">
                    <div className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Problem statements will be released on <strong>1st January 2025</strong></span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Phase 1 submissions due by <strong>6th January 2025</strong></span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Top 5 teams will be announced on <strong>7th January 2025</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setView("landing"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-block mt-8 text-sm text-white/40 hover:text-white transition-colors"
              >
                Return to Event Details
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // === LANDING VIEW (default) ===
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 selection:text-white">
      <AnimatedBackground />
      <PillNav items={navItems} />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">{eventData.event.badge}</span>
              </div>

              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9]">
                DATA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-500">
                  VISUALIZATION
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 mt-2">
                  CHALLENGE {eventData.event.year}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A theme-anchored, case-driven data visualization challenge where participants navigate real-world datasets across <span className="text-white font-semibold">healthcare, agriculture, and urban infrastructure</span> to derive meaningful, high-impact insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => { 
                    if (!isAuthenticated) {
                      // Redirect to signin if not logged in
                      router.push('/signin?redirect=/events/data-visualization-challenge-2');
                    } else {
                      setView("registration"); 
                      window.scrollTo({ top: 0, behavior: 'smooth' }); 
                    }
                  }}
                  className="relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none group"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#67E8F9_0%,#3B82F6_50%,#67E8F9_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition group-hover:bg-slate-900">
                    {isAuthenticated ? 'Register Now' : 'Login to Register'} <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </button>
                <a href="#structure" className="inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-bold text-white/70 border border-white/10 hover:bg-white/5 transition-colors">
                  View Guidelines
                </a>
              </div>

              <div className="pt-8 border-t border-white/10 flex gap-8 sm:gap-12 justify-center lg:justify-start">
                {[
                  { label: "Total Points", value: "150" },
                  { label: "Participants", value: "100+" },
                  { label: "Phases", value: "2" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs uppercase tracking-wider text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block h-[600px]">
              <div className="absolute inset-0 flex items-center justify-center animate-float">
                <div className="relative w-full aspect-square">
                  <div className="absolute inset-4 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full blur-[100px] opacity-40 animate-pulse" />
                  <GlassCard className="h-full w-full p-8 flex flex-col justify-between border-white/20 bg-black/60 !rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                        <BarChart3 className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="flex gap-1.5">
                        {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/20" />)}
                      </div>
                    </div>
                    
                    <div className="font-mono text-sm space-y-2 text-white/50 font-mono-theme">
                      <div className="flex gap-2"><span className="text-cyan-400">const</span> <span className="text-white">insights</span> = <span className="text-green-400">analyze()</span>;</div>
                      <div className="flex gap-2"><span className="text-cyan-400">await</span> <span className="text-blue-400">data</span>.<span className="text-yellow-400">visualize()</span>;</div>
                      <div className="flex gap-2"><span className="text-cyan-400">return</span> <span className="text-white">impact;</span></div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
                      <div className="text-xs font-bold uppercase text-white/40 mb-1">Status</div>
                      <div className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Registrations Open
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Concept */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">The Core Concept</h2>
              <p className="text-white/60 max-w-3xl mx-auto leading-relaxed">
                Navigate the complexities of real-world datasets to derive meaningful, high-impact insights through professional-grade statistical and analytical techniques. Move beyond sterile simulations to tackle challenges at the forefront of climate resilience, public health, education, and industrial policy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {eventData.themes.map((theme, idx) => (
                <GlassCard key={idx} className="p-6 group hover:bg-white/5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <theme.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{theme.name}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Real-world datasets and challenges in {theme.name.toLowerCase()} domain
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Important Dates Timeline */}
        <section id="timeline" className="py-24 relative border-t border-white/5 bg-black/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3 sticky top-32 h-fit">
                <h2 className="text-4xl font-bold mb-4 text-shimmer">Important Dates</h2>
                <p className="text-white/60 mb-8">Mark your calendar and stay ahead of deadlines!</p>
              </div>
              <div className="md:w-2/3 space-y-8 relative">
                <div className="absolute left-[21px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500 via-blue-900 to-transparent opacity-30" />
                {eventData.importantDates.map((item, idx) => (
                  <div key={idx} className="relative pl-16 group">
                    <div className="absolute left-3 top-3 w-4 h-4 rounded-full border-2 border-cyan-500/50 bg-black group-hover:border-cyan-500 group-hover:scale-125 transition-all duration-300 z-10" />
                    <GlassCard className="p-6 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{item.title}</h4>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold text-white/10 group-hover:text-cyan-500/50 transition-colors">{item.date.split(" ")[0]}</span>
                        <span className="text-xs font-bold uppercase text-white/30">{item.date.split(" ").slice(1).join(" ")}</span>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1 Details */}
        <section id="structure" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-3xl p-8 md:p-16 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Phase 1: Analysis, Visualization & Impact</h2>
                <p className="text-lg text-white/70 mb-8">
                  Submission Round combining problem understanding, dataset exploration, analysis, visualization, dataset extension, and impact evaluation.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400">
                      <Target className="w-5 h-5" />
                      Provided by Organizers
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Theme (Healthcare, Agriculture, or Urban Infrastructure)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Realistic problem context</span>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-white/60 italic">Example: "India faces uneven access to primary healthcare across districts."</p>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                      <Users className="w-5 h-5" />
                      What Participants Must Do
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Explore multiple valid and credible dataset sources</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Identify patterns, trends, anomalies, and gaps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Visualize what the data objectively represents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Propose insights, solutions, and real-world implications</span>
                      </li>
                    </ul>
                  </GlassCard>
                </div>

                <GlassCard className="p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400">
                    <Database className="w-5 h-5" />
                    Dataset Sources
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {eventData.datasetSources.map((source, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-bold text-white mb-1">{source.name}</h4>
                        <p className="text-sm text-white/60">{source.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-sm text-yellow-300 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span><strong>All datasets must be:</strong> Real (no synthetic data), properly cited, and relevant to the chosen theme and problem context.</span>
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-5 h-5" />
                    Impact & Feasibility Analysis
                  </h3>
                  <p className="text-white/80 mb-4">Each team must address:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "What actions does the data suggest?",
                      "Is the proposed solution realistic and feasible?",
                      "Who benefits and who might be affected?",
                      "Short-term vs long-term impact",
                      "Key assumptions, constraints, and risks"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/70">{item}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 2 Details */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GlassCard className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Presentation className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">Phase 2: Live Presentation Round</h2>
                  <p className="text-white/60">Top 5 teams shortlisted from Phase 1</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">Format</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Live presentation followed by Q&A with judges</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-400">Evaluation Focus</h3>
                  <ul className="space-y-2">
                    {[
                      "Insight clarity",
                      "Visualization choices",
                      "Data integrity",
                      "Real-world relevance",
                      "Defense of assumptions and conclusions"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Submission Requirements */}
        <section className="py-24 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Submission Requirements</h2>
              <p className="text-white/60 max-w-2xl mx-auto">All submissions must include the following components</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventData.submissionRequirements.map((req, idx) => (
                <GlassCard key={idx} className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    <req.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{req.title}</h3>
                  <ul className="space-y-2">
                    {req.items.map((item, i) => (
                      <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Judging Criteria */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Judging Criteria</h2>
              <p className="text-white/60 mb-2">Total: <span className="text-cyan-400 font-bold text-2xl">150 Points</span></p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventData.judgingCriteria.map((criteria, idx) => (
                <GlassCard key={idx} className="p-6 group hover:bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white">
                      {criteria.points}
                    </div>
                    <span className="text-xs text-white/40">pts</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{criteria.title}</h3>
                  <p className="text-sm text-white/60">{criteria.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Allowed Tools */}
        <section className="py-24 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Allowed Tools & Platforms</h2>
              <p className="text-white/60">Tool choice does not affect scoring</p>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {eventData.allowedTools.map((tool, idx) => (
                <GlassCard key={idx} className="p-6 text-center group hover:bg-white/5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-bold">{tool.name}</h3>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Strict Rules */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-3xl p-8 md:p-12 border border-red-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <Shield className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold">Strict Rules & Ethical Constraints</h2>
                    <p className="text-red-300/80">These are non-negotiable</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {eventData.strictRules.map((rule, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-black/40 border border-red-500/20">
                      <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        {rule.rule}
                      </h3>
                      <p className="text-sm text-white/70">{rule.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm text-yellow-300 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span><strong>Data Integrity Requirement:</strong> Every visualization must be traceable to its dataset. Judges may ask teams to explain how a chart was derived. Any mismatch between visuals and data will result in disqualification.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section id="registration" className="py-32 px-4 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
              READY TO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">VISUALIZE THE FUTURE?</span>
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Transform data into decisions. Register now and showcase your analytical skills!
            </p>
            <button 
              onClick={() => { 
                if (!isAuthenticated) {
                  router.push('/signin?redirect=/events/data-visualization-challenge-2');
                } else {
                  setView("registration"); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }
              }}
              className="inline-block group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden hover:scale-105 transition-transform"
            >
              <span className="relative z-10 group-hover:text-white transition-colors">
                {isAuthenticated ? 'REGISTER NOW' : 'LOGIN TO REGISTER'}
              </span>
              <div className="absolute inset-0 bg-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center text-white/20 text-sm">
            © 2025 IEEE RGIPT. Built for Data Analysts.
          </div>
        </section>
      </main>
    </div>
  );
}
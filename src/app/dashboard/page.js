"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PillNav from "@/components/ui/PillNav";
import Loader from "@/components/ui/Loader";
import { authService } from '@/lib/auth';
import { EVENTS_DATA, isEventUpcoming } from '@/components/ui/events-page';

// --- Icons ---
import { 
  User, Calendar, BookOpen, Users, Award, Bell, 
  ArrowRight, Loader2, FileText, Code, Briefcase, 
  TrendingUp, ExternalLink, LogOut, Edit, Save, X,
  Linkedin, Github, Instagram, Image as ImageIcon, MapPin,
  CreditCard, Download, ShieldCheck, Zap, Activity, Sparkles
} from 'lucide-react';

// --- Custom CSS ---
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600;700&display=swap');

  :root {
    --neon-purple: #a855f7;
    --neon-blue: #3b82f6;
    --bg-black: #050505;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-black);
    color: white;
  }

  .font-mono-theme { font-family: 'JetBrains Mono', monospace; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.2); }
    50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
  }

  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-glow { animation: glow-pulse 3s infinite; }

  /* Glass Panel */
  .glass-panel {
    background: rgba(20, 20, 20, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .glass-panel:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(25, 25, 25, 0.7);
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #555; }
`;

// Helper function to check if event is currently happening
const isEventCurrent = (dateString) => {
  if (!dateString) return false;
  
  const parts = dateString.split(',');
  if (parts.length < 2) {
    const monthYearParts = dateString.trim().split(' ');
    if (monthYearParts.length === 2) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames.indexOf(monthYearParts[0]);
      const year = parseInt(monthYearParts[1]);
      if (month === -1 || isNaN(year)) return false;
      
      const now = new Date();
      return month === now.getMonth() && year === now.getFullYear();
    }
    return false;
  }
  
  const year = parseInt(parts[1].trim());
  const monthDay = parts[0].trim();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let month = -1;
  for (let i = 0; i < monthNames.length; i++) {
    if (monthDay.includes(monthNames[i])) {
      month = i;
      break;
    }
  }
  
  if (month === -1 || isNaN(year)) return false;
  
  let startDay = 1;
  let endDay = 1;
  
  if (monthDay.includes('-')) {
    const dayParts = monthDay.split('-');
    const firstDayPart = dayParts[0].trim();
    const lastDayPart = dayParts[dayParts.length - 1].trim();
    const firstDayMatch = firstDayPart.match(/\d+/);
    const lastDayMatch = lastDayPart.match(/\d+/);
    if (firstDayMatch) startDay = parseInt(firstDayMatch[0]);
    if (lastDayMatch) endDay = parseInt(lastDayMatch[0]);
  } else {
    const dayMatch = monthDay.match(/\d+/);
    if (dayMatch) {
      startDay = parseInt(dayMatch[0]);
      endDay = startDay;
    }
  }
  
  const now = new Date();
  const eventStartDate = new Date(year, month, startDay, 0, 0, 0);
  const eventEndDate = new Date(year, month, endDay, 23, 59, 59);
  
  return now >= eventStartDate && now <= eventEndDate;
};

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

// --- Sub-Components ---

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#050505]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-float" />
    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-float" style={{animationDelay: '2s'}} />
  </div>
);

const StatCard = ({ icon: Icon, label, value, color = "purple" }) => {
  const gradients = {
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    green: "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-white font-mono-theme">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${gradients[color].split(' ').pop()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        <Icon className="w-5 h-5 text-purple-400" />
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    {action}
  </div>
);

const ProfileUpdateModal = ({ formData, setFormData, profilePictureFile, setProfilePictureFile, profilePicturePreview, setProfilePicturePreview, onSubmit, onClose, loading, success, error }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-purple-400" /> Edit Profile
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        {success && <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-sm">{success}</div>}
        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase ml-1 mb-2">Profile Photo</label>
            {profilePicturePreview && (
              <div className="mb-3 flex justify-center">
                <img src={profilePicturePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-white/20" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 1024 * 1024) {
                    alert('File size must be less than 1MB');
                    return;
                  }
                  setProfilePictureFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setProfilePicturePreview(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 bg-white/5 rounded-xl border border-white/10"
            />
          </div>

          <div>
             <label className="text-xs font-bold text-white/60 uppercase ml-1">Position (POR)</label>
             <input 
               type="text" 
               value={formData.designation || ''} 
               onChange={(e) => setFormData({...formData, designation: e.target.value})}
               className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
               placeholder="e.g. Technical Lead"
               required
             />
          </div>
          <div>
             <label className="text-xs font-bold text-white/60 uppercase ml-1">Branch</label>
             <input 
               type="text" 
               value={formData.branch || ''} 
               onChange={(e) => setFormData({...formData, branch: e.target.value})}
               className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
               placeholder="e.g. CSE"
             />
          </div>
          <div>
             <label className="text-xs font-bold text-white/60 uppercase ml-1">Bio</label>
             <textarea 
               value={formData.bio || ''} 
               onChange={(e) => setFormData({...formData, bio: e.target.value})}
               rows={3} 
               className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
               placeholder="Short bio..."
             />
          </div>
           <div>
             <label className="text-xs font-bold text-white/60 uppercase ml-1">Achievements</label>
             <textarea 
               value={formData.achievements || ''} 
               onChange={(e) => setFormData({...formData, achievements: e.target.value})}
               rows={2} 
               className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
               placeholder="Awards, hackathons..."
             />
          </div>
          
          <div>
             <label className="text-xs font-bold text-white/60 uppercase ml-1 mb-2">Email (Contact)</label>
             <input 
               type="email" 
               value={formData.email || ''} 
               onChange={(e) => setFormData({...formData, email: e.target.value})}
               className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
               placeholder="your.email@example.com"
               readOnly
               title="Email cannot be changed for security reasons"
             />
             <p className="text-xs text-white/40 mt-1">Email is used for authentication and cannot be changed</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             <input type="url" placeholder="LinkedIn URL" value={formData.linkedin_url || ''} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50" />
             <input type="url" placeholder="GitHub URL" value={formData.github_url || ''} onChange={(e) => setFormData({...formData, github_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50" />
             <input type="url" placeholder="Instagram URL" value={formData.instagram_url || ''} onChange={(e) => setFormData({...formData, instagram_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex justify-end pt-4">
             <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-white/60 hover:text-white mr-4 transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const IdCardModal = ({ idCardImage, loading, error, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="glass-panel border border-white/10 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" /> IEEE ID Card
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">{error}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size="large" className="mb-4" />
            <p className="text-white/60 text-sm">Generating secure ID...</p>
          </div>
        ) : idCardImage ? (
          <div className="space-y-4">
            <div className="flex justify-center bg-black rounded-lg border border-white/10 overflow-hidden">
               <img src={idCardImage} alt="ID Card" className="max-w-full h-auto" />
            </div>
            <button onClick={onDownload} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
               <Download className="w-4 h-4" /> Download ID
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  const [showIdCard, setShowIdCard] = useState(false);
  const [idCardLoading, setIdCardLoading] = useState(false);
  const [idCardImage, setIdCardImage] = useState(null);

  const [myRegistrations, setMyRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  // --- Data Fetching ---
  const fetchMyRegistrations = async () => {
    setRegistrationsLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/events/my-registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMyRegistrations(data.registrations || []);
        }
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = authService.isAuthenticated();
      if (!authenticated) {
        router.push('/');
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/');
          return;
        }

        if (currentUser.role === 'admin') {
          router.push('/admin');
          return;
        }

        setUser(currentUser);

        const token = authService.getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          setError('Failed to load dashboard data');
        }

        await fetchMyRegistrations();
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An error occurred while loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- Handlers ---
  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  const handleOpenProfileForm = () => {
    setProfileFormData({
      designation: user.designation || '',
      bio: user.bio || '',
      branch: user.branch || '',
      achievements: user.achievements || '',
      email: user.email || '',
      linkedin_url: user.linkedin_url || '',
      github_url: user.github_url || '',
      instagram_url: user.instagram_url || '',
    });
    setProfilePictureFile(null);
    setProfilePicturePreview(user.profile_image_url || null);
    setShowProfileForm(true);
    setProfileSuccess('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setError('');

    try {
      const token = authService.getToken();
      const formData = new FormData();
      
      if (profilePictureFile) {
        formData.append('profile_picture', profilePictureFile);
      }
      
      Object.keys(profileFormData).forEach(key => {
        if (profileFormData[key] !== undefined && profileFormData[key] !== null) {
          formData.append(key, profileFormData[key]);
        }
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setShowProfileForm(false), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('An error occurred while updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleShowIdCard = async () => {
    setShowIdCard(true);
    setIdCardLoading(true);
    setIdCardImage(null);
    setError('');

    try {
      const token = authService.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/id-card`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setIdCardImage(imageUrl);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate ID card');
      }
    } catch (err) {
      console.error('ID card error:', err);
      setError('An error occurred while generating ID card');
    } finally {
      setIdCardLoading(false);
    }
  };

  const handleDownloadIdCard = () => {
    if (idCardImage) {
      const link = document.createElement('a');
      link.href = idCardImage;
      link.download = `ieee_member_id_card_${user.full_name?.replace(/\s+/g, '_') || 'member'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Helper
  const isRegisteredForEvent = (eventSlug) => {
    return myRegistrations.some(reg => reg.event_slug === eventSlug && reg.status !== 'cancelled');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#050505] flex items-center justify-center">
        <style>{styleTag}</style>
        <div className="flex flex-col items-center gap-4">
          <Loader size="large" />
          <p className="text-white/50 text-sm font-mono-theme animate-pulse">INITIALIZING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
         <p className="text-white">Failed to load dashboard. Please login again.</p>
      </div>
    );
  }

  const isIEEEMember = user.role === 'ieee_member';
  const stats = dashboardData.stats || {};

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      <style>{styleTag}</style>
      <AnimatedBackground />
        <PillNav items={navItems} />
        
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
        
        {/* --- CodeForHer Announcement Banner --- */}
        <div className="mb-8 glass-panel rounded-2xl p-6 border-2 border-pink-500/30 bg-gradient-to-r from-pink-900/20 to-purple-900/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  CodeForHer Problem Statements Are Out!
                </h3>
                <p className="text-white/70 text-sm md:text-base mb-3">
                  Check out the three exciting problem statements for CodeForHer Hackathon 2026. Register your team now and start building innovative solutions!
                </p>
                <Link 
                  href="/events/codeforher#problem-statements"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                >
                  View Problem Statements
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- Header Area --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs font-mono-theme text-green-400 uppercase tracking-widest">System Online</span>
            </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user.full_name?.split(' ')[0]}</span>
              </h1>
            <p className="text-white/50 flex items-center gap-2">
              {isIEEEMember ? <ShieldCheck className="w-4 h-4 text-purple-400" /> : <User className="w-4 h-4" />}
              {isIEEEMember ? 'IEEE Core Member' : 'Guest Account'}
              </p>
            </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-white/10 transition-all text-sm font-medium"
            >
               <LogOut className="w-4 h-4" /> Disconnect
            </button>
          </div>
        </header>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Calendar} label="Total Events" value={stats.total_events || 0} color="purple" />
          <StatCard icon={Award} label="Registrations" value={myRegistrations.length || 0} color="green" />
          <StatCard icon={Bell} label="Announcements" value={stats.announcements || 0} color="amber" />
          <StatCard icon={Activity} label="Activity Level" value="Active" color="blue" />
          </div>

        {/* --- Dashboard Content Layout --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Main Feed) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Events Section */}
            <div className="glass-panel rounded-3xl p-6 md:p-8">
               <SectionHeader 
                 title="Upcoming Events" 
                 icon={Zap} 
                 action={<Link href="/events" className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider">View All</Link>}
               />
               
                  <div className="space-y-4">
                  {EVENTS_DATA.filter(e => e.registrationOpen).slice(0, 3).map((event) => {
                    const isRegistered = isRegisteredForEvent(event.id);
                    return (
                        <div key={event.id} className="group flex items-center gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-purple-500/30 transition-all">
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-purple-400">
                            {/* Simple date parsing assuming format "MMM DD, YYYY" or similar */}
                            <span className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</span>
                            <span className="text-lg font-bold">{event.date.split(' ')[1]?.replace(',','') || 'TBA'}</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{event.title}</h4>
                            <div className="flex gap-2 mt-1">
                                <span className="inline-block text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">{event.category}</span>
                                {isRegistered && <span className="inline-block text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">Registered</span>}
                  </div>
                      </div>
                        <Link href={event.route || '#'} className="px-4 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-purple-400 transition-colors">
                            Details
                        </Link>
                  </div>
                    );
                  })}
                  {EVENTS_DATA.filter(e => e.registrationOpen).length === 0 && (
                      <p className="text-white/40 text-center py-4">No upcoming events open for registration.</p>
                  )}
               </div>
            </div>

            {/* Announcements Section */}
            <div className="glass-panel rounded-3xl p-6 md:p-8">
               <SectionHeader title="System Notices" icon={Bell} />
               <div className="grid gap-4">
                  {dashboardData.announcements && dashboardData.announcements.length > 0 ? (
                      dashboardData.announcements.map((note) => (
                        <div key={note.id} className="p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border-l-2 border-amber-500/50">
                        <h4 className="text-white font-medium mb-1">{note.title}</h4>
                        <p className="text-white/40 text-xs font-mono-theme">{note.date}</p>
                  </div>
                      ))
                  ) : (
                      <p className="text-white/40 text-center">No new announcements.</p>
                  )}
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="space-y-8">
            
            {/* Profile Dossier */}
            <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[50px] rounded-full pointer-events-none" />
               
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-purple-500 to-blue-500 mb-4 shadow-lg shadow-purple-500/20 group">
                     <img 
                       src={user.profile_image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                       alt="Profile" 
                       className="w-full h-full rounded-full object-cover border-4 border-black"
                       onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" }}
                     />
                     <button
                       onClick={handleOpenProfileForm}
                       className="absolute inset-0 w-full h-full rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                       title="Edit Profile Picture"
                     >
                       <ImageIcon className="w-6 h-6 text-white" />
                     </button>
                        </div>
                  <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
                  <p className="text-purple-400 text-sm mb-6">{user.designation || (isIEEEMember ? "Core Member" : "Guest")}</p>
                  
                  <div className="w-full space-y-3">
                     <div className="flex justify-between text-sm py-2 border-b border-white/5">
                        <span className="text-white/40">ID</span>
                        <span className="font-mono-theme text-white/80">{user.ieee_membership_id || "N/A"}</span>
                          </div>
                     <div className="flex justify-between text-sm py-2 border-b border-white/5">
                        <span className="text-white/40">Branch</span>
                        <span className="text-white/80">{user.branch || "N/A"}</span>
                          </div>
                          </div>

                  <div className="grid grid-cols-2 gap-3 w-full mt-6">
                     <button 
                       onClick={handleShowIdCard}
                       className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold"
                     >
                       <CreditCard className="w-4 h-4" /> ID Card
                     </button>
                      <button
                        onClick={handleOpenProfileForm}
                       className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-xs font-bold"
                      >
                       <Edit className="w-4 h-4" /> Edit
                      </button>
                    </div>
               </div>
            </div>

            {/* Social Links for IEEE Members */}
            {isIEEEMember && (
              <div className="glass-panel rounded-3xl p-6">
                 <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Social Links</h3>
                      <div className="space-y-3">
                    {user.linkedin_url ? (
                       <a 
                         href={user.linkedin_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-white/5"
                       >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                             <Linkedin className="w-4 h-4" />
                            </div>
                          <span className="text-sm text-white/80 font-medium flex-1 truncate">LinkedIn</span>
                          <ExternalLink className="w-4 h-4 text-white/40" />
                       </a>
                    ) : (
                       <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 opacity-50">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                             <Linkedin className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-white/60 font-medium">No LinkedIn</span>
                      </div>
                    )}
                    
                    {user.github_url ? (
                       <a 
                         href={user.github_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-white/5"
                       >
                          <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                             <Github className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-white/80 font-medium flex-1 truncate">GitHub</span>
                          <ExternalLink className="w-4 h-4 text-white/40" />
                       </a>
                    ) : (
                       <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 opacity-50">
                          <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center text-gray-300">
                             <Github className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-white/60 font-medium">No GitHub</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                       <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                          <User className="w-4 h-4" />
                       </div>
                       <span className="text-sm text-white/80 font-medium flex-1 truncate">{user.email}</span>
                    </div>

                    <button 
                       onClick={handleOpenProfileForm}
                       className="w-full mt-4 py-2 px-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-300 transition-all text-xs font-bold flex items-center justify-center gap-2"
                    >
                       <Edit className="w-3 h-3" /> Update Social Links
                    </button>
                          </div>
                      </div>
            )}

            {/* Quick Links / Resources */}
            {isIEEEMember && (
              <div className="glass-panel rounded-3xl p-6">
                 <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Resources</h3>
                 <div className="space-y-2">
                    {dashboardData.learning_resources && dashboardData.learning_resources.length > 0 ? (
                         dashboardData.learning_resources.slice(0, 3).map((res) => (
                            <a key={res.id} href={res.url} target="_blank" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-white/80 font-medium truncate">{res.title}</span>
                            </a>
                         ))
                    ) : (
                        <p className="text-white/40 text-xs">No resources available yet.</p>
                    )}
                    
                    <Link href="/projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                       <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                          <Briefcase className="w-4 h-4" />
                       </div>
                       <span className="text-sm text-white/80 font-medium">Project Portal</span>
                    </Link>
            </div>
          </div>
            )}

            {!isIEEEMember && (
               <div className="glass-panel rounded-3xl p-6 border-l-4 border-l-purple-500">
                  <h3 className="text-lg font-bold text-white mb-2">Join IEEE</h3>
                  <p className="text-sm text-white/60 mb-4">Unlock full access to events, resources, and ID cards.</p>
                  <Link href="/contact" className="block w-full py-2 bg-white text-black font-bold text-center rounded-lg hover:bg-purple-400 transition-colors">
                     Contact to Join
                  </Link>
               </div>
            )}

        </div>
      </div>
      </main>

      {/* --- MODALS --- */}
      {showIdCard && (
        <IdCardModal 
            idCardImage={idCardImage} 
            loading={idCardLoading} 
            error={error} 
            onClose={() => setShowIdCard(false)} 
            onDownload={handleDownloadIdCard}
        />
      )}

      {showProfileForm && isIEEEMember && (
        <ProfileUpdateModal
          formData={profileFormData}
          setFormData={setProfileFormData}
            profilePictureFile={profilePictureFile}
            setProfilePictureFile={setProfilePictureFile}
            profilePicturePreview={profilePicturePreview}
            setProfilePicturePreview={setProfilePicturePreview}
          onSubmit={handleProfileUpdate}
            onClose={() => setShowProfileForm(false)}
          loading={profileLoading}
          success={profileSuccess}
          error={error}
        />
      )}

    </div>
  );
};

export default Dashboard;
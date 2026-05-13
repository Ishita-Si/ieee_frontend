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
  :root { --bg: #0a0a0a; }
  body { background: var(--bg); color: #fff; }
  .card { background: #111; border: 1px solid #222; border-radius: 12px; }
  .card:hover { border-color: #333; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
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

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs text-white/40 uppercase tracking-widest">{label}</p>
      <Icon className="w-4 h-4 text-white/30" />
    </div>
    <p className="text-3xl font-semibold text-white">{value}</p>
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">{title}</h2>
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
  const [bootcampEvents, setBootcampEvents] = useState([]);
  const [bootcampSlugs, setBootcampSlugs] = useState(() => new Set());

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
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        const [dashRes, regsRes, bootListRes, bootMineRes] = await Promise.all([
          fetch(`${API}/dashboard/`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          }),
          fetch(`${API}/events/my-registrations`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          }),
          fetch(`${API}/bootcamp/events`),
          fetch(`${API}/bootcamp/my-registrations`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          }),
        ]);

        if (dashRes.ok) {
          const data = await dashRes.json();
          setDashboardData(data);
        } else {
          setError('Failed to load dashboard data');
        }

        if (regsRes.ok) {
          const regsData = await regsRes.json();
          if (regsData.success) setMyRegistrations(regsData.registrations || []);
        }

        if (bootListRes.ok) {
          const b = await bootListRes.json();
          if (b.success) setBootcampEvents(b.events || []);
        }
        if (bootMineRes.ok) {
          const bm = await bootMineRes.json();
          const slugs = new Set(
            (bm.registrations || [])
              .map((r) => r.event?.slug)
              .filter(Boolean)
          );
          setBootcampSlugs(slugs);
        }
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
      <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader size="large" />
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{styleTag}</style>
      <PillNav items={navItems} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Member Dashboard</p>
            <h1 className="text-2xl font-semibold text-white">Welcome back, {user.full_name?.split(' ')[0]}</h1>
            <p className="text-sm text-white/40 mt-0.5">
              {user.membership_type === 'ieee_member' ? 'IEEE Core Member' : 'Guest Account'}
              {user.ieee_membership_id ? ` · ${user.ieee_membership_id}` : ''}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-red-500/30 hover:text-red-400 text-white/50 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard icon={Calendar} label="Total Events" value={stats.total_events || 0} />
          <StatCard icon={Award} label="Registrations" value={myRegistrations.length || 0} />
          <StatCard icon={Bell} label="Announcements" value={stats.announcements || 0} />
          <StatCard icon={Activity} label="Status" value="Active" />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bootcamp Events */}
            {bootcampEvents.length > 0 && (
              <div className="card p-6">
                <SectionHeader
                  title="Current Programs"
                  action={<Link href="/events" className="text-xs text-white/40 hover:text-white">Browse all →</Link>}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {bootcampEvents.map((ev) => {
                    const reg = bootcampSlugs.has(ev.slug);
                    return (
                      <div key={ev.slug} className="border border-white/10 rounded-lg overflow-hidden">
                        <div className="h-28 bg-white/5">
                          <img
                            src={(() => {
                              const slugPosters = { 'devwave-2026': '/images/posters/devwave.png', 'codenex-3': '/images/posters/codenex.png' };
                              if (ev.banner_url && !ev.banner_url.match(/\/images\/posters\/(?:4|6)\.png$/)) return ev.banner_url;
                              return slugPosters[ev.slug] || '/images/posters/devwave.png';
                            })()}
                            alt=""
                            className="w-full h-full object-cover opacity-80"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-white">{ev.title}</h4>
                          <p className="text-xs text-white/40 mt-1 line-clamp-2">{ev.tagline || ev.short_description}</p>
                          <div className="mt-3 flex items-center justify-between">
                            {reg && <span className="text-xs text-green-400">✓ Registered</span>}
                            <Link
                              href={`/events/${ev.slug}`}
                              className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-white/80 transition-colors"
                            >View</Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            <div className="card p-6">
              <SectionHeader
                title="Upcoming Events"
                action={<Link href="/events" className="text-xs text-white/40 hover:text-white">See all →</Link>}
              />
              {EVENTS_DATA.filter(e => e.registrationOpen).length === 0 ? (
                <p className="text-sm text-white/30 py-4">No upcoming events open for registration.</p>
              ) : (
                <div className="space-y-2">
                  {EVENTS_DATA.filter(e => e.registrationOpen).slice(0, 3).map((event) => {
                    const isRegistered = isRegisteredForEvent(event.id);
                    return (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{event.title}</p>
                          <p className="text-xs text-white/30 mt-0.5">{event.date} · {event.category}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          {isRegistered && <span className="text-xs text-green-400">✓</span>}
                          <Link href={event.route || '#'} className="text-xs px-3 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-white/80 transition-colors">View</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Announcements */}
            <div className="card p-6">
              <SectionHeader title="Announcements" />
              {dashboardData.announcements && dashboardData.announcements.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.announcements.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg border-l-2 border-white/20 bg-white/[0.02]">
                      <p className="text-sm text-white">{note.title}</p>
                      <p className="text-xs text-white/30 mt-0.5">{note.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/30">No announcements.</p>
              )}
            </div>
          </div>

          {/* Right: profile sidebar */}
          <div className="space-y-4">

            {/* Profile Card */}
            <div className="card p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/10 mb-4 group">
                  <img
                    src={user.profile_image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" }}
                  />
                  <button
                    onClick={handleOpenProfileForm}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <ImageIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="font-semibold text-white">{user.full_name}</p>
                <p className="text-xs text-white/40 mt-0.5">{user.designation || (isIEEEMember ? 'Core Member' : 'Guest')}</p>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">IEEE ID</span>
                  <span className="text-white/70 font-mono text-xs">{user.ieee_membership_id || '—'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Branch</span>
                  <span className="text-white/70">{user.branch || '—'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Year</span>
                  <span className="text-white/70">{user.year || '—'}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={handleShowIdCard}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" /> ID Card
                </button>
                <button
                  onClick={handleOpenProfileForm}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>

            {/* Social Links */}
            {isIEEEMember && (
              <div className="card p-5">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Social</p>
                <div className="space-y-2">
                  {user.linkedin_url ? (
                    <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 py-2 text-sm text-white/60 hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  ) : <p className="text-xs text-white/20">No LinkedIn added</p>}
                  {user.github_url && (
                    <a href={user.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 py-2 text-sm text-white/60 hover:text-white transition-colors">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  <button
                    onClick={handleOpenProfileForm}
                    className="w-full mt-2 py-2 rounded-lg border border-white/10 text-xs text-white/40 hover:text-white hover:border-white/20 transition-colors"
                  >
                    Update links
                  </button>
                </div>
              </div>
            )}

            {/* Resources */}
            {isIEEEMember && dashboardData.learning_resources?.length > 0 && (
              <div className="card p-5">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Resources</p>
                <div className="space-y-1">
                  {dashboardData.learning_resources.slice(0, 4).map((res) => (
                    <a key={res.id} href={res.url} target="_blank"
                      className="flex items-center gap-2 py-2 text-sm text-white/60 hover:text-white transition-colors">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{res.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Join CTA */}
            {!isIEEEMember && (
              <div className="card p-5 border-l-2 border-white/20">
                <p className="text-sm font-semibold text-white mb-1">Become an IEEE Member</p>
                <p className="text-xs text-white/40 mb-4">Unlock events, resources, and your IEEE ID card.</p>
                <Link href="/contact" className="block text-center py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/80 transition-colors">
                  Contact us to join
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
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

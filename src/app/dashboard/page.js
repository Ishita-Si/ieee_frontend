"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PillNav from "@/components/ui/PillNav";
import { authService } from '@/lib/auth';
import { EVENTS_DATA } from '@/components/ui/events-page';

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

import { 
  User, Calendar, BookOpen, Users, Award, Bell, 
  ArrowRight, Loader2, FileText, Code, Briefcase, 
  TrendingUp, ExternalLink, LogOut, Edit, Save, X,
  Linkedin, Github, Instagram, Image as ImageIcon, MapPin
} from 'lucide-react';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/');
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/');
          return;
        }

        // Redirect admin to admin dashboard
        if (currentUser.role === 'admin') {
          router.push('/admin');
          return;
        }

        setUser(currentUser);

        // Fetch dashboard data
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
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An error occurred while loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  const handleOpenProfileForm = () => {
    setProfileFormData({
      profile_image_url: user.profile_image_url || '',
      designation: user.designation || '',
      bio: user.bio || '',
      branch: user.branch || '',
      achievements: user.achievements || '',
      linkedin_url: user.linkedin_url || '',
      github_url: user.github_url || '',
      instagram_url: user.instagram_url || '',
    });
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileFormData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => {
          setShowProfileForm(false);
          setProfileSuccess('');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('An error occurred while updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isIEEEMember = user.role === 'ieee_member';
  const stats = dashboardData.stats || {};

  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="relative z-10 w-full bg-black">
        <PillNav items={navItems} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Welcome back, {user.full_name}!
              </h1>
              <p className="text-white/70">
                {isIEEEMember ? 'IEEE Member Dashboard' : 'Non-Member Dashboard'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Calendar}
              label="Total Events"
              value={stats.total_events || 0}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Upcoming Events"
              value={stats.upcoming_events || 0}
              color="blue"
            />
            <StatCard
              icon={Award}
              label="Registered Events"
              value={stats.registered_events || 0}
              color="green"
            />
            <StatCard
              icon={Bell}
              label="Announcements"
              value={stats.announcements || 0}
              color="yellow"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Events */}
              <SectionCard title="Upcoming Events" icon={Calendar}>
                {EVENTS_DATA && EVENTS_DATA.length > 0 ? (
                  <div className="space-y-4">
                    {EVENTS_DATA.map((event) => (
                      <Link
                        key={event.id}
                        href={event.route || `/events#${event.id}`}
                        className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                                {event.title}
                              </h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 flex-shrink-0">
                                {event.category}
                              </span>
                            </div>
                            <p className="text-white/70 text-sm mb-2 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {event.date}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                            {event.seatsLimited && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                                  <span>Seats Available</span>
                                  <span>{event.totalSeats - event.registeredSeats} / {event.totalSeats}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                  <div
                                    className="bg-purple-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${(event.registeredSeats / event.totalSeats) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-center py-8">No upcoming events</p>
                )}
              </SectionCard>

              {/* Announcements */}
              <SectionCard title="Announcements" icon={Bell}>
                {dashboardData.announcements && dashboardData.announcements.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <h3 className="text-white font-semibold mb-1">{announcement.title}</h3>
                        <p className="text-white/60 text-sm">{announcement.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-center py-8">No announcements</p>
                )}
              </SectionCard>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <SectionCard title="My Profile" icon={User}>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  {user.membership_type && (
                    <div>
                      <p className="text-white/60 text-sm">Membership Type</p>
                      <p className="text-white capitalize">{user.membership_type.replace('_', ' ')}</p>
                    </div>
                  )}
                  {user.ieee_membership_id && (
                    <div>
                      <p className="text-white/60 text-sm">IEEE ID</p>
                      <p className="text-white">{user.ieee_membership_id}</p>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* IEEE Member Exclusive Sections */}
              {isIEEEMember && (
                <>
                  {/* Profile Update Form Section */}
                  <SectionCard title="Team Profile" icon={User}>
                    <div className="space-y-4">
                      {user.profile_image_url && (
                        <div className="flex justify-center mb-4">
                          <img
                            src={user.profile_image_url}
                            alt={user.full_name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        {user.designation && (
                          <div>
                            <p className="text-white/60 text-sm">Position (POR)</p>
                            <p className="text-white">{user.designation}</p>
                          </div>
                        )}
                        {user.branch && (
                          <div>
                            <p className="text-white/60 text-sm">Branch</p>
                            <p className="text-white">{user.branch}</p>
                          </div>
                        )}
                        {user.bio && (
                          <div>
                            <p className="text-white/60 text-sm">About</p>
                            <p className="text-white text-sm">{user.bio}</p>
                          </div>
                        )}
                        {(user.linkedin_url || user.github_url || user.instagram_url) && (
                          <div className="flex gap-3 pt-2">
                            {user.linkedin_url && (
                              <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                <Linkedin className="w-5 h-5" />
                              </a>
                            )}
                            {user.github_url && (
                              <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                                <Github className="w-5 h-5" />
                              </a>
                            )}
                            {user.instagram_url && (
                              <a href={user.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                                <Instagram className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleOpenProfileForm}
                        className="w-full mt-4 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Update Profile</span>
                      </button>
                    </div>
                  </SectionCard>

                  {/* Learning Resources */}
                  {dashboardData.learning_resources && dashboardData.learning_resources.length > 0 && (
                    <SectionCard title="Learning Resources" icon={BookOpen}>
                      <div className="space-y-3">
                        {dashboardData.learning_resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                          >
                            <div>
                              <p className="text-white font-medium">{resource.title}</p>
                              <p className="text-white/60 text-sm">{resource.type}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white" />
                          </a>
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {/* Projects */}
                  {dashboardData.projects && dashboardData.projects.length > 0 && (
                    <SectionCard title="Projects & Opportunities" icon={Briefcase}>
                      <div className="space-y-3">
                        {dashboardData.projects.map((project) => (
                          <div
                            key={project.id}
                            className="p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <p className="text-white font-medium">{project.title}</p>
                            <p className="text-white/60 text-sm">{project.status} • {project.members} members</p>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {/* Team Directory */}
                  {dashboardData.team_members && dashboardData.team_members.length > 0 && (
                    <SectionCard title="Team Directory" icon={Users}>
                      <div className="space-y-3">
                        {dashboardData.team_members.map((member) => (
                          <div
                            key={member.id}
                            className="p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <p className="text-white font-medium">{member.name}</p>
                            {member.designation && (
                              <p className="text-white/60 text-sm">{member.designation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  )}
                </>
              )}

              {/* Non-Member Join CTA */}
              {!isIEEEMember && (
                <SectionCard title="Join IEEE" icon={Award}>
                  <p className="text-white/80 mb-4">
                    Become an IEEE member to access exclusive events, learning resources, and more!
                  </p>
                  <button
                    onClick={() => router.push('/contact')}
                    className="w-full px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </SectionCard>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Update Modal */}
      {showProfileForm && isIEEEMember && (
        <ProfileUpdateModal
          formData={profileFormData}
          setFormData={setProfileFormData}
          onSubmit={handleProfileUpdate}
          onClose={() => {
            setShowProfileForm(false);
            setProfileSuccess('');
            setError('');
          }}
          loading={profileLoading}
          success={profileSuccess}
          error={error}
        />
      )}
    </div>
  );
};

const ProfileUpdateModal = ({ formData, setFormData, onSubmit, onClose, loading, success, error }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black/95 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Edit className="w-6 h-6" />
            Update Team Profile
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Profile Image URL */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Profile Photo URL
            </label>
            <input
              type="url"
              value={formData.profile_image_url}
              onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
              placeholder="https://example.com/photo.jpg"
            />
            <p className="mt-1 text-xs text-white/50">This photo will be displayed on the team page</p>
          </div>

          {/* Designation (POR) */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Position of Responsibility (POR) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
              placeholder="e.g., Secretary, Treasurer, Technical Lead"
              required
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Branch
            </label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
              placeholder="e.g., Computer Science, Electrical Engineering"
            />
          </div>

          {/* Bio (About) - Optional */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              About (Optional)
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
              placeholder="Tell us about yourself, your interests, and your journey..."
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Achievements (Optional)
            </label>
            <textarea
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
              placeholder="List your achievements, awards, or notable projects..."
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color = 'purple' }) => {
  const colorClasses = {
    purple: 'border-purple-400/30 bg-purple-500/10',
    blue: 'border-blue-400/30 bg-blue-500/10',
    green: 'border-green-400/30 bg-green-500/10',
    yellow: 'border-yellow-400/30 bg-yellow-500/10',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/60 text-sm">{label}</p>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="p-6 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <Icon className="w-5 h-5 text-purple-300" />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
};

const EventCard = ({ event }) => {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{event.title}</h3>
          <p className="text-white/70 text-sm mb-2 line-clamp-2">{event.description}</p>
          <div className="flex items-center gap-4 text-xs text-white/60">
            {event.event_date && (
              <span>{new Date(event.event_date).toLocaleDateString()}</span>
            )}
            {event.location && <span>{event.location}</span>}
          </div>
        </div>
        {event.is_registered && (
          <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-300 border border-green-500/30">
            Registered
          </span>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


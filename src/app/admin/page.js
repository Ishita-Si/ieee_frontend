"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PillNav from "@/components/ui/PillNav";
import { authService } from '@/lib/auth';

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

import { 
  Users, Calendar, FileText, 
  Search, Download, 
  Loader2, Check, BarChart3,
  UserCheck, Clock, X
} from 'lucide-react';

// StatCard component
const StatCard = ({ icon: Icon, label, value, color = 'purple' }) => {
  const colorClasses = {
    purple: 'border-purple-400/30 bg-purple-500/10',
    blue: 'border-blue-400/30 bg-blue-500/10',
    green: 'border-green-400/30 bg-green-500/10',
    yellow: 'border-yellow-400/30 bg-yellow-500/10',
    cyan: 'border-cyan-400/30 bg-cyan-500/10',
    red: 'border-red-400/30 bg-red-500/10',
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

// StatRow component
const StatRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-white/60">{label}</span>
    <span className="text-white font-semibold">{value}</span>
  </div>
);

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registrations');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [registrationStats, setRegistrationStats] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/');
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/dashboard');
          return;
        }

        // Check if user email is in admin whitelist
        const token = authService.getToken();
        const checkResponse = await fetch(`${API_URL}/admin/registrations/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!checkResponse.ok) {
          if (checkResponse.status === 403) {
            alert('Access denied. Admin access is restricted to authorized personnel only.');
            router.push('/dashboard');
            return;
          }
          router.push('/dashboard');
          return;
        }

        setUser(currentUser);
        await fetchStats();
        await fetchRegistrations();
        await fetchVisitorStats();
      } catch (err) {
        console.error('Auth error:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/admin/registrations/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRegistrationStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching registration stats:', err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const token = authService.getToken();
      const queryParams = new URLSearchParams();
      if (selectedEventFilter !== 'all') {
        queryParams.append('event_slug', selectedEventFilter);
      }
      queryParams.append('limit', '1000'); // Get all registrations
      
      const response = await fetch(`${API_URL}/admin/registrations?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [selectedEventFilter, user]);

  const fetchVisitorStats = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/admin/visitors/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVisitorStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching visitor stats:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = authService.getToken();
      const queryParams = new URLSearchParams();
      if (selectedEventFilter !== 'all') {
        queryParams.append('event_slug', selectedEventFilter);
      }
      
      const response = await fetch(`${API_URL}/admin/registrations/export?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('Failed to export CSV');
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export CSV');
    }
  };


  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reg.event_name?.toLowerCase().includes(searchLower) ||
      reg.team_name?.toLowerCase().includes(searchLower) ||
      reg.user_id?.full_name?.toLowerCase().includes(searchLower) ||
      reg.user_id?.email?.toLowerCase().includes(searchLower) ||
      reg.members?.some(m => 
        m.name?.toLowerCase().includes(searchLower) ||
        m.email?.toLowerCase().includes(searchLower)
      )
    );
  });

  // Get unique event slugs for filter
  const eventSlugs = [...new Set(registrations.map(r => r.event_slug).filter(Boolean))];

  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="relative z-10 w-full bg-black">
        <PillNav items={navItems} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Manage users, events, and registrations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {registrationStats && (
              <>
                <StatCard icon={FileText} label="Total Registrations" value={registrationStats.total} color="purple" />
                <StatCard icon={Check} label="Confirmed" value={registrationStats.confirmed} color="green" />
                <StatCard icon={Clock} label="Pending" value={registrationStats.pending} color="yellow" />
                <StatCard icon={X} label="Cancelled" value={registrationStats.cancelled} color="red" />
              </>
            )}
            {visitorStats && (
              <>
                <StatCard icon={Users} label="Total Visitors" value={visitorStats.total} color="blue" />
                <StatCard icon={UserCheck} label="Unique Visitors" value={visitorStats.unique} color="cyan" />
                <StatCard icon={Calendar} label="Today" value={visitorStats.today} color="green" />
                <StatCard icon={BarChart3} label="This Week" value={visitorStats.thisWeek} color="purple" />
              </>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10">
            {[
              { id: 'registrations', label: 'Registrations', icon: FileText },
              { id: 'visitors', label: 'Visitors', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          {activeTab === 'registrations' && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search registrations by event, team, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
                />
              </div>
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
              >
                <option value="all">All Events</option>
                {eventSlugs.map(slug => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          )}

          {/* Content */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-md">
            {activeTab === 'registrations' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Registrations ({filteredRegistrations.length})
                  </h2>
                  {registrationStats && (
                    <div className="flex gap-4 text-sm">
                      <div className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30">
                        <span className="text-purple-300">Total: {registrationStats.total}</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                        <span className="text-green-300">Confirmed: {registrationStats.confirmed}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {registrationStats?.byEvent && registrationStats.byEvent.length > 0 && (
                  <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Registrations by Event</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {registrationStats.byEvent.map((event, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-white font-medium text-sm">{event.eventName || event._id}</p>
                          <p className="text-white/60 text-xs mt-1">{event.count} registrations</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Event</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Team Name</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Team Leader</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Team Size</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-white/60">
                            No registrations found
                          </td>
                        </tr>
                      ) : (
                        filteredRegistrations.map(reg => (
                          <tr key={reg._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 text-white text-sm">{reg.event_name}</td>
                            <td className="py-3 px-4 text-white/90 text-sm font-medium">{reg.team_name}</td>
                            <td className="py-3 px-4 text-white/80 text-sm">
                              {reg.members?.[0]?.name || reg.user_id?.full_name || '-'}
                            </td>
                            <td className="py-3 px-4 text-white/80 text-sm">
                              {reg.members?.[0]?.email || reg.user_id?.email || '-'}
                            </td>
                            <td className="py-3 px-4 text-white/80 text-sm">{reg.team_size}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                reg.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                                reg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white/60 text-xs">
                              {new Date(reg.registration_date || reg.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'visitors' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Website Visitors</h2>
                
                {visitorStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Visitor Statistics</h3>
                      <div className="space-y-3">
                        <StatRow label="Total Visitors" value={visitorStats.total} />
                        <StatRow label="Unique Visitors" value={visitorStats.unique} />
                        <StatRow label="Visitors Today" value={visitorStats.today} />
                        <StatRow label="Visitors This Week" value={visitorStats.thisWeek} />
                        <StatRow label="Visitors (Last 30 Days)" value={visitorStats.last30Days} />
                      </div>
                    </div>

                    {visitorStats.topPages && visitorStats.topPages.length > 0 && (
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Most Visited Pages</h3>
                        <div className="space-y-2">
                          {visitorStats.topPages.map((page, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 rounded bg-white/5">
                              <span className="text-white/80 text-sm truncate">{page._id || '/'}</span>
                              <span className="text-white font-semibold">{page.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
                    <p>Loading visitor statistics...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


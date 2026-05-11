"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PillNav from "@/components/ui/PillNav";
import Loader from "@/components/ui/Loader";
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
  UserCheck, Clock, X, Database,
  Plus, Trash2, Upload, FileUp, Mail, Bell, Image as ImageIcon
} from 'lucide-react';

// StatCard component
const StatCard = ({ icon: Icon, label, value }) => (
  <div style={{ background: '#111', border: '1px solid #222', borderRadius: '10px', padding: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <p style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      <Icon style={{ width: '14px', height: '14px', color: '#444' }} />
    </div>
    <p style={{ fontSize: '28px', fontWeight: '600', color: '#fff' }}>{value}</p>
  </div>
);

// StatRow component
const StatRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-white/60">{label}</span>
    <span className="text-white font-semibold">{value}</span>
  </div>
);

// Database Management Tab Component
const DatabaseManagementTab = ({ API_URL, authService, registrations, setRegistrations, fetchRegistrations }) => {
  const [dbUsers, setDbUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('user');
  const [createFormData, setCreateFormData] = useState({});
  const [bulkCreateData, setBulkCreateData] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState('');
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    if (activeSubTab === 'users') {
      fetchUsers(searchTerm);
    }
  }, [activeSubTab]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => fetchUsers(value), 400);
  };

  const fetchUsers = async (search = '') => {
    try {
      setLoading(true);
      setFetchError('');
      const token = authService.getToken();
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`${API_URL}/admin/users${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDbUsers(data.users || []);
      } else {
        const err = await response.json().catch(() => ({}));
        setFetchError(err.error || `Error ${response.status}: Failed to load users`);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setFetchError('Network error – could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSingle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createFormData)
      });
      
      if (response.ok) {
        alert('User created successfully!');
        setShowCreateModal(false);
        setCreateFormData({});
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create user');
      }
    } catch (err) {
      alert('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      setLoading(true);
      const token = authService.getToken();
      const endpoint = type === 'user' ? `/admin/users/${id}` : `/admin/registrations/${id}`;
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert(`${type === 'user' ? 'User' : 'Registration'} deleted successfully!`);
        if (type === 'user') {
          fetchUsers();
        } else {
          fetchRegistrations();
        }
      } else {
        const error = await response.json();
        alert(error.error || `Failed to delete ${type}`);
      }
    } catch (err) {
      alert(`Failed to delete ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (type) => {
    const selected = type === 'user' ? selectedUsers : selectedRegistrations;
    if (selected.length === 0) {
      alert('Please select items to delete');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selected.length} ${type}(s)?`)) return;
    
    try {
      setLoading(true);
      const token = authService.getToken();
      const field = type === 'user' ? 'user_ids' : 'registration_ids';
      const response = await fetch(`${API_URL}/admin/${type}s/bulk-delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: selected })
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(data.message || `Successfully deleted ${selected.length} ${type}(s)`);
        if (type === 'user') {
          setSelectedUsers([]);
          fetchUsers();
        } else {
          setSelectedRegistrations([]);
          fetchRegistrations();
        }
      } else {
        const error = await response.json();
        alert(error.error || `Failed to delete ${type}s`);
      }
    } catch (err) {
      alert(`Failed to delete ${type}s`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!bulkCreateData.trim()) {
      alert('Please provide JSON data');
      return;
    }
    
    try {
      const users = JSON.parse(bulkCreateData);
      if (!Array.isArray(users)) {
        alert('Data must be an array of user objects');
        return;
      }
      
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/admin/users/bulk-create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users })
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Successfully created ${data.created} user(s). ${data.failed} failed.`);
        setBulkCreateData('');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create users');
      }
    } catch (err) {
      alert('Invalid JSON format or failed to create users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = dbUsers.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(search) ||
      user.full_name?.toLowerCase().includes(search) ||
      user.username?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Database Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setCreateType('user'); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 transition-all"
          >
            <Plus className="w-4 h-4" /> Create User
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: 'users', label: 'Users' },
          { id: 'registrations', label: 'Registrations' },
          { id: 'bulk', label: 'Bulk Operations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? 'border-purple-400 text-white'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
              />
            </div>
            {selectedUsers.length > 0 && (
              <button
                onClick={() => handleBulkDelete('user')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected ({selectedUsers.length})
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u._id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Username</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Designation</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-400" />
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center">
                      <p className="text-red-400 mb-2">{fetchError}</p>
                      <button type="button" onClick={() => fetchUsers(searchTerm)} className="text-purple-400 underline text-sm">Retry</button>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-white/60">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 text-white text-sm">{user.full_name}</td>
                      <td className="py-3 px-4 text-white/90 text-sm">{user.email}</td>
                      <td className="py-3 px-4 text-white/80 text-sm">{user.username}</td>
                      <td className="py-3 px-4 text-white/80 text-sm">{user.membership_type}</td>
                      <td className="py-3 px-4 text-white/80 text-sm">{user.designation || '-'}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteSingle(user._id, 'user')}
                          className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Registrations Tab */}
      {activeSubTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            {selectedRegistrations.length > 0 && (
              <button
                onClick={() => handleBulkDelete('registration')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected ({selectedRegistrations.length})
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={registrations.length > 0 && selectedRegistrations.length === registrations.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRegistrations(registrations.map(r => r._id));
                        } else {
                          setSelectedRegistrations([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Event</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Team</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Leader</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map(reg => (
                  <tr key={reg._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRegistrations.includes(reg._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRegistrations([...selectedRegistrations, reg._id]);
                          } else {
                            setSelectedRegistrations(selectedRegistrations.filter(id => id !== reg._id));
                          }
                        }}
                      />
                    </td>
                    <td className="py-3 px-4 text-white text-sm">{reg.event_name}</td>
                    <td className="py-3 px-4 text-white/90 text-sm">{reg.team_name}</td>
                    <td className="py-3 px-4 text-white/80 text-sm">{reg.members?.[0]?.name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        reg.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                        reg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteSingle(reg._id, 'registration')}
                        className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk Operations Tab */}
      {activeSubTab === 'bulk' && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Bulk Create Users</h3>
            <p className="text-white/60 text-sm mb-4">
              Paste JSON array of user objects. Each user should have: username, full_name, email, phone_number, college, branch, year, roll_no, password, membership_type, designation (optional)
            </p>
            <textarea
              value={bulkCreateData}
              onChange={(e) => setBulkCreateData(e.target.value)}
              placeholder='[{"username":"user1","full_name":"User One","email":"user1@example.com","phone_number":"1234567890","college":"RGIPT","branch":"CSE","year":"3rd Year","roll_no":"24cs1001","password":"password123","membership_type":"ieee_member","designation":"CS"}]'
              className="w-full h-64 p-4 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-400/50"
            />
            <button
              onClick={handleBulkCreate}
              disabled={loading}
              className="mt-4 flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 transition-all disabled:opacity-50"
            >
              <Upload className="w-4 h-4" /> {loading ? 'Creating...' : 'Bulk Create Users'}
            </button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateSingle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.username || ''}
                    onChange={(e) => setCreateFormData({...createFormData, username: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.full_name || ''}
                    onChange={(e) => setCreateFormData({...createFormData, full_name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={createFormData.email || ''}
                    onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.phone_number || ''}
                    onChange={(e) => setCreateFormData({...createFormData, phone_number: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">College *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.college || ''}
                    onChange={(e) => setCreateFormData({...createFormData, college: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Branch *</label>
                  <select
                    required
                    value={createFormData.branch || ''}
                    onChange={(e) => setCreateFormData({...createFormData, branch: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="CSD">CSD</option>
                    <option value="IDD CSE">IDD CSE</option>
                    <option value="Electronics">Electronics</option>
                    <option value="EV">EV</option>
                    <option value="MnC">MnC</option>
                    <option value="IT">IT</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Petroleum">Petroleum</option>
                    <option value="Civil">Civil</option>
                    <option value="Biotech">Biotech</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Year *</label>
                  <select
                    required
                    value={createFormData.year || ''}
                    onChange={(e) => setCreateFormData({...createFormData, year: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Roll No *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.roll_no || ''}
                    onChange={(e) => setCreateFormData({...createFormData, roll_no: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={createFormData.password || ''}
                    onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Membership Type *</label>
                  <select
                    required
                    value={createFormData.membership_type || ''}
                    onChange={(e) => setCreateFormData({...createFormData, membership_type: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="">Select Type</option>
                    <option value="ieee_member">IEEE Member</option>
                    <option value="non_member">Non Member</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-white/60 mb-1">Designation</label>
                  <input
                    type="text"
                    value={createFormData.designation || ''}
                    onChange={(e) => setCreateFormData({...createFormData, designation: e.target.value})}
                    placeholder="e.g., CS, Design, Joint_Sec"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [contacts, setContacts] = useState([]);
  const [contactStats, setContactStats] = useState(null);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ heading: '', body: '', image: null });
  const [announcementImagePreview, setAnnouncementImagePreview] = useState(null);

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
          // Check if it's a network error by trying to fetch from API
          const token = authService.getToken();
          if (!token) {
            router.push('/');
            return;
          }
          
          // Try to verify if backend is accessible
          try {
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
            
            // Backend is accessible but user fetch failed - use cached data if available
            const cachedUser = localStorage.getItem('userData');
            if (cachedUser) {
              try {
                const user = JSON.parse(cachedUser);
                setUser(user);
                await Promise.all([fetchStats(), fetchRegistrations(), fetchVisitorStats()]);
                setLoading(false);
                return;
              } catch (e) {
                // Invalid cached data
              }
            }
            
            router.push('/dashboard');
            return;
          } catch (fetchError) {
            // Backend is not accessible
            console.error('Backend server is not accessible:', fetchError);
            alert('Unable to connect to server. Please check if the backend is running.');
            router.push('/');
            return;
          }
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
        await Promise.all([fetchStats(), fetchRegistrations(), fetchVisitorStats(), fetchContacts()]);
      } catch (err) {
        console.error('Auth error:', err);
        // Check if it's a network error
        if (err.message && err.message.includes('fetch')) {
          alert('Unable to connect to server. Please check if the backend is running.');
        }
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [contactStatusFilter, contactSearchTerm]);

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

  useEffect(() => {
    if (activeTab === 'contacts' && user) {
      fetchContacts();
    }
  }, [activeTab, contactStatusFilter, contactSearchTerm, user]);

  useEffect(() => {
    if (activeTab === 'announcements' && user) {
      fetchAnnouncements();
    }
  }, [activeTab, user]);

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

  const fetchContacts = async () => {
    try {
      const token = authService.getToken();
      const queryParams = new URLSearchParams();
      if (contactStatusFilter !== 'all') {
        queryParams.append('status', contactStatusFilter);
      }
      if (contactSearchTerm) {
        queryParams.append('search', contactSearchTerm);
      }
      
      const response = await fetch(`${API_URL}/contact?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
        
        // Calculate stats
        const stats = {
          total: data.total || 0,
          new: data.contacts?.filter(c => c.status === 'new').length || 0,
          read: data.contacts?.filter(c => c.status === 'read').length || 0,
          replied: data.contacts?.filter(c => c.status === 'replied').length || 0,
          archived: data.contacts?.filter(c => c.status === 'archived').length || 0,
        };
        setContactStats(stats);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/contact/${contactId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await fetchContacts();
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
      alert('Failed to update contact status');
    }
  };

  const deleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/contact/${contactId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchContacts();
      } else {
        alert('Failed to delete contact');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact');
    }
  };

  const bulkDeleteContacts = async () => {
    if (selectedContacts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`)) return;
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/contact/bulk-delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedContacts })
      });
      if (response.ok) {
        setSelectedContacts([]);
        await fetchContacts();
      } else {
        alert('Failed to delete contacts');
      }
    } catch (err) {
      console.error('Error bulk deleting contacts:', err);
      alert('Failed to delete contacts');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_URL}/announcements`);
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.heading || !announcementForm.body) {
      alert('Please fill in heading and body');
      return;
    }

    try {
      const token = authService.getToken();
      const formData = new FormData();
      formData.append('heading', announcementForm.heading);
      formData.append('body', announcementForm.body);
      if (announcementForm.image) {
        formData.append('image', announcementForm.image);
      }

      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        alert('Announcement created successfully!');
        setShowAnnouncementModal(false);
        setAnnouncementForm({ heading: '', body: '', image: null });
        setAnnouncementImagePreview(null);
        await fetchAnnouncements();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create announcement');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      alert('Failed to create announcement');
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchAnnouncements();
      } else {
        alert('Failed to delete announcement');
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('Failed to delete announcement');
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
        <Loader size="default" />
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
    <>
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <PillNav items={navItems} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 24px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #1a1a1a' }}>
          <p style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Admin Panel</p>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#fff' }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>Manage users, events, and registrations</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {registrationStats && (
            <>
              <StatCard icon={FileText} label="Total Registrations" value={registrationStats.total} />
              <StatCard icon={Check} label="Confirmed" value={registrationStats.confirmed} />
              <StatCard icon={Clock} label="Pending" value={registrationStats.pending} />
              <StatCard icon={X} label="Cancelled" value={registrationStats.cancelled} />
            </>
          )}
          {visitorStats && (
            <>
              <StatCard icon={Users} label="Total Visitors" value={visitorStats.total} />
              <StatCard icon={UserCheck} label="Unique" value={visitorStats.unique} />
              <StatCard icon={Calendar} label="Today" value={visitorStats.today} />
              <StatCard icon={BarChart3} label="This Week" value={visitorStats.thisWeek} />
            </>
          )}
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderBottom: '1px solid #1a1a1a', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { id: 'registrations', label: 'Registrations', icon: FileText },
              { id: 'visitors', label: 'Visitors', icon: Users },
              { id: 'contacts', label: 'Contacts', icon: Mail },
              { id: 'announcements', label: 'Announcements', icon: Bell },
              { id: 'database', label: 'Database', icon: Database },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', fontSize: '13px', fontWeight: '500',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #fff' : '2px solid transparent',
                  color: activeTab === tab.id ? '#fff' : '#555',
                  transition: 'color 0.15s',
                  marginBottom: '-1px',
                }}
              >
                <tab.icon style={{ width: '14px', height: '14px' }} />
                {tab.label}
              </button>
            ))}
          </div>
          <Link
            href="/admin/events"
            style={{ fontSize: '12px', color: '#666', padding: '6px 12px', border: '1px solid #2a2a2a', borderRadius: '6px', textDecoration: 'none' }}
          >
            Bootcamp programs →
          </Link>
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
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '24px' }}>
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

            {activeTab === 'contacts' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Contact Form Submissions ({contacts.length})
                  </h2>
                  {contactStats && (
                    <div className="flex gap-2 text-sm flex-wrap">
                      <div className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30">
                        <span className="text-purple-300">Total: {contactStats.total}</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                        <span className="text-yellow-300">New: {contactStats.new}</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30">
                        <span className="text-blue-300">Read: {contactStats.read}</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                        <span className="text-green-300">Replied: {contactStats.replied}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or subject..."
                      value={contactSearchTerm}
                      onChange={(e) => setContactSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
                    />
                  </div>
                  <select
                    value={contactStatusFilter}
                    onChange={(e) => setContactStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  {selectedContacts.length > 0 && (
                    <button
                      onClick={bulkDeleteContacts}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Selected ({selectedContacts.length})
                    </button>
                  )}
                </div>

                {/* Contacts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={contacts.length > 0 && selectedContacts.length === contacts.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContacts(contacts.map(c => c._id));
                              } else {
                                setSelectedContacts([]);
                              }
                            }}
                            className="rounded border-white/20 bg-white/5"
                          />
                        </th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Name</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Subject</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Message</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Date</th>
                        <th className="text-left py-3 px-4 text-white/80 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-white/60">
                            No contact submissions found
                          </td>
                        </tr>
                      ) : (
                        contacts.map(contact => (
                          <tr key={contact._id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedContacts([...selectedContacts, contact._id]);
                                  } else {
                                    setSelectedContacts(selectedContacts.filter(id => id !== contact._id));
                                  }
                                }}
                                className="rounded border-white/20 bg-white/5"
                              />
                            </td>
                            <td className="py-3 px-4 text-white">{contact.name}</td>
                            <td className="py-3 px-4">
                              <a href={`mailto:${contact.email}`} className="text-purple-300 hover:text-purple-200">
                                {contact.email}
                              </a>
                            </td>
                            <td className="py-3 px-4 text-white">{contact.subject}</td>
                            <td className="py-3 px-4 text-white/70 max-w-xs truncate" title={contact.message}>
                              {contact.message}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={contact.status}
                                onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  contact.status === 'new' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                  contact.status === 'read' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                  contact.status === 'replied' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                  'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                } focus:outline-none`}
                              >
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-white/60 text-sm">
                              {new Date(contact.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <a
                                  href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                  className="px-3 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs transition-all"
                                >
                                  Reply
                                </a>
                                <button
                                  onClick={() => deleteContact(contact._id)}
                                  className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs transition-all"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Announcements ({announcements.length})
                  </h2>
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create Announcement
                  </button>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                  {announcements.length === 0 ? (
                    <div className="text-center py-12 text-white/60">
                      No announcements yet. Create one to get started!
                    </div>
                  ) : (
                    announcements.map(announcement => (
                      <div key={announcement._id} className="p-6 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{announcement.heading}</h3>
                            <p className="text-white/70 whitespace-pre-wrap">{announcement.body}</p>
                            {announcement.image_url && (
                              <div className="mt-4">
                                <img 
                                  src={announcement.image_url} 
                                  alt={announcement.heading}
                                  className="max-w-full h-auto rounded-lg border border-white/10"
                                  style={{ maxHeight: '400px' }}
                                />
                              </div>
                            )}
                            <div className="mt-4 text-sm text-white/50">
                              Created: {new Date(announcement.created_at).toLocaleString()}
                              {announcement.created_by && (
                                <span> by {announcement.created_by.full_name || announcement.created_by.email}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteAnnouncement(announcement._id)}
                            className="ml-4 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all"
                            title="Delete announcement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <DatabaseManagementTab
                API_URL={API_URL}
                authService={authService}
                registrations={registrations}
                setRegistrations={setRegistrations}
                fetchRegistrations={fetchRegistrations}
              />
            )}
          </div>
        </div>
      </div>

      {/* Announcement Creation Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-black/90 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" /> Create Announcement
              </h3>
              <button 
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setAnnouncementForm({ heading: '', body: '', image: null });
                  setAnnouncementImagePreview(null);
                }}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Heading <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={announcementForm.heading}
                  onChange={(e) => setAnnouncementForm({...announcementForm, heading: e.target.value})}
                  placeholder="Enter announcement heading"
                  maxLength={200}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
                />
                <p className="text-xs text-white/40 mt-1">{announcementForm.heading.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Body <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={announcementForm.body}
                  onChange={(e) => setAnnouncementForm({...announcementForm, body: e.target.value})}
                  placeholder="Enter announcement body text"
                  rows={6}
                  maxLength={5000}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 resize-none"
                />
                <p className="text-xs text-white/40 mt-1">{announcementForm.body.length}/5000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Image (Optional, max 2MB)
                </label>
                {announcementImagePreview && (
                  <div className="mb-3">
                    <img 
                      src={announcementImagePreview} 
                      alt="Preview" 
                      className="max-w-full h-auto rounded-lg border border-white/10"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert('Image must be less than 2MB');
                        return;
                      }
                      setAnnouncementForm({...announcementForm, image: file});
                      const reader = new FileReader();
                      reader.onloadend = () => setAnnouncementImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 bg-white/5 rounded-xl border border-white/10"
                />
                <p className="text-xs text-white/40 mt-1">Supported formats: JPEG, PNG, GIF, WebP</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAnnouncementModal(false);
                    setAnnouncementForm({ heading: '', body: '', image: null });
                    setAnnouncementImagePreview(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Announcement
                </button>
              </div>
            </form>
          </div>
        </div>

      )}

    </>
  );
};

export default AdminDashboard;

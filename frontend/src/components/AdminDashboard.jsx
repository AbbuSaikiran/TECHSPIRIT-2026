import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  Sun, 
  ChevronRight, 
  ChevronDown, 
  Download, 
  Search, 
  Filter, 
  Layers, 
  UserCheck, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  FileSpreadsheet, 
  ExternalLink,
  Edit3
} from 'lucide-react';
import FormBuilder from './FormBuilder';
import { ADMIN_STATS } from '../mockData';

export default function AdminDashboard({ 
  registrations, 
  formFields, 
  setFormFields, 
  onAddNewHackathon 
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    tagline: '',
    city: '',
    venue: '',
    dates: '',
    prizePool: '',
    category: 'ai-ml',
    format: 'Hybrid'
  });

  // Export to CSV functionality
  const handleExportCSV = () => {
    const headers = ['Registration ID', 'Name', 'Email', 'Team', 'Role', 'Date', 'Status'];
    const rows = (registrations || ADMIN_STATS.recentUsers).map(u => [
      u.id,
      u.name,
      u.email,
      u.team || 'Solo',
      u.role,
      u.date,
      u.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hackathon_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    if (onAddNewHackathon) {
      onAddNewHackathon({
        id: `event-${Date.now()}`,
        title: newEvent.title,
        tagline: newEvent.tagline || 'Next-Generation Innovation Challenge',
        subtext: 'Join creators and engineers building cutting-edge prototypes.',
        city: newEvent.city || 'San Francisco & Online',
        venue: newEvent.venue || 'Tech Hub Stage',
        dates: newEvent.dates || 'Nov 14 - 16, 2026',
        format: newEvent.format,
        category: newEvent.category,
        categoryLabel: 'Hackathon',
        accentColor: '#00FFAA',
        badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
        prizePool: newEvent.prizePool || '$25,000 Cash Pool',
        teamSize: '1 - 4 Members',
        participantsCount: 1,
        status: 'JUST LAUNCHED',
        featured: true
      });
    }

    setShowCreateModal(false);
    setNewEvent({ title: '', tagline: '', city: '', venue: '', dates: '', prizePool: '', category: 'ai-ml', format: 'Hybrid' });
  };

  const allUsersList = (registrations && registrations.length > 0)
    ? [...registrations, ...ADMIN_STATS.recentUsers]
    : ADMIN_STATS.recentUsers;

  const filteredUsers = allUsersList.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.team?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 flex flex-col md:flex-row text-left">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR (Exact Match to Reference Image 4: MongoNext Console) */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-[#16191E] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              </div>
              <span className="text-base font-extrabold text-white font-heading tracking-tight">
                Mongo<span className="text-[#10B981]">Next</span>
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#1E232B] text-white border-l-4 border-[#10B981] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#10B981]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('form-builder')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'form-builder'
                  ? 'bg-[#1E232B] text-white border-l-4 border-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              <span>Form Builder</span>
              <span className="ml-auto text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">
                No-Code
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'users'
                  ? 'bg-[#1E232B] text-white border-l-4 border-purple-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Registrations & Teams</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Create Event</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-white/5 text-[11px] font-mono text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span>Database Mode</span>
            <span className="text-[#10B981] font-bold">Sheets Live</span>
          </div>
          <div className="text-[10px] text-slate-400">FastAPI Sync Active</div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN ADMIN CONSOLE CONTENT */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-[#16191E] border-b border-white/5 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Platform Operations / <span className="text-white font-semibold capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
              <Sun className="w-4 h-4" />
            </button>

            <div className="relative">
              <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
                <Bell className="w-4 h-4" />
              </button>
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute top-1.5 right-1.5" />
            </div>

            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500 text-emerald-300 font-bold flex items-center justify-center text-xs font-mono">
              J
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* TAB 1: DASHBOARD VIEW (Exact match to Reference Image 4) */}
          {activeTab === 'dashboard' && (
            <>
              {/* Header Title & Create Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-white font-heading">
                    Dashboard
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Welcome to the MongoNext admin dashboard. Here's an overview of your platform.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-xs font-mono text-slate-200 flex items-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold font-heading bg-[#10B981] hover:bg-[#059669] text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create New Event
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------- */}
              {/* 4 TOP KPI METRIC CARDS (Exact match to Image 4) */}
              {/* ------------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Events */}
                <div className="p-5 rounded-2xl bg-[#16191E] border border-white/5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>Events</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white font-heading">
                      {ADMIN_STATS.activeHackathons}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> {ADMIN_STATS.activeHackathonsGrowth}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-2">
                    Active hackathons
                  </div>
                </div>

                {/* 2. Teams */}
                <div className="p-5 rounded-2xl bg-[#16191E] border border-white/5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-medium">
                    <Users className="w-4 h-4" />
                    <span>Teams</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white font-heading">
                      {ADMIN_STATS.registeredTeams}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> {ADMIN_STATS.registeredTeamsGrowth}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-2">
                    Registered teams
                  </div>
                </div>

                {/* 3. Users */}
                <div className="p-5 rounded-2xl bg-[#16191E] border border-white/5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-medium">
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white font-heading">
                      {ADMIN_STATS.activeParticipants + (registrations ? registrations.length : 0)}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> {ADMIN_STATS.activeParticipantsGrowth}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-2">
                    Active participants
                  </div>
                </div>

                {/* 4. Completion */}
                <div className="p-5 rounded-2xl bg-[#16191E] border border-white/5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-medium">
                    <Settings className="w-4 h-4" />
                    <span>Completion</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white font-heading">
                      {ADMIN_STATS.submissionRate}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> {ADMIN_STATS.submissionRateTrend}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-2">
                    Project submission rate
                  </div>
                </div>

              </div>

              {/* ------------------------------------------------------- */}
              {/* PARTICIPANT GROWTH CHART & RECENT USERS (Exact match to Image 4) */}
              {/* ------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: Participant Growth Area Curve Chart */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-[#16191E] border border-white/5 shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      Participant Growth
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monthly participant registrations
                    </p>
                  </div>

                  {/* SVG Area Line Chart */}
                  <div className="my-6 relative h-64">
                    <svg className="w-full h-full" viewBox="0 0 600 240">
                      <defs>
                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Dotted horizontal grid lines */}
                      {[40, 90, 140, 190].map((y, idx) => (
                        <line
                          key={idx}
                          x1="40"
                          y1={y}
                          x2="580"
                          y2={y}
                          stroke="#2D3748"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Y-axis labels */}
                      <text x="15" y="45" fill="#718096" fontSize="10" fontFamily="JetBrains Mono">260</text>
                      <text x="15" y="95" fill="#718096" fontSize="10" fontFamily="JetBrains Mono">195</text>
                      <text x="15" y="145" fill="#718096" fontSize="10" fontFamily="JetBrains Mono">130</text>
                      <text x="15" y="195" fill="#718096" fontSize="10" fontFamily="JetBrains Mono">65</text>
                      <text x="25" y="235" fill="#718096" fontSize="10" fontFamily="JetBrains Mono">0</text>

                      {/* Area Path */}
                      <path
                        d="M 40 210 Q 90 200, 130 180 T 220 150 T 310 120 T 400 80 T 490 50 T 580 30 L 580 230 L 40 230 Z"
                        fill="url(#growthGrad)"
                      />

                      {/* Line Stroke */}
                      <path
                        d="M 40 210 Q 90 200, 130 180 T 220 150 T 310 120 T 400 80 T 490 50 T 580 30"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                      />

                      {/* Months labels along bottom */}
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                        <text
                          key={idx}
                          x={50 + idx * 46}
                          y="238"
                          fill="#718096"
                          fontSize="9"
                          fontFamily="JetBrains Mono"
                          textAnchor="middle"
                        >
                          {m}
                        </text>
                      ))}
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                      <span>Participants Trajectory</span>
                    </span>
                    <span className="text-emerald-400 font-bold">+44% QoQ</span>
                  </div>
                </div>

                {/* Right Card: Recent Users Roster */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-[#16191E] border border-white/5 shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white font-heading">
                        Recent Users
                      </h3>
                      <p className="text-xs text-slate-400">Newly registered users</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="text-xs font-mono text-emerald-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4 my-2">
                    {ADMIN_STATS.recentUsers.slice(0, 4).map((usr) => (
                      <div key={usr.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-mono text-white font-bold">
                          {usr.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{usr.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {usr.role} — {usr.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-slate-400 flex justify-between">
                    <span>Google Sheets Log</span>
                    <span className="text-[#10B981]">Synced Row 247</span>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: FORM BUILDER VIEW */}
          {activeTab === 'form-builder' && (
            <FormBuilder 
              formFields={formFields} 
              setFormFields={setFormFields} 
            />
          )}

          {/* TAB 3: REGISTRATIONS & USERS TABLE */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white font-heading">
                    Registrations & Team Ledger
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Live participant stream backed by Google Sheets registration table.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search registrations..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="bg-[#0A0E1A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-[#00FFAA] hover:bg-emerald-500/20 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#16191E] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#1E232B] text-slate-400 border-b border-white/5">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">User</th>
                        <th className="py-3.5 px-4 font-semibold">Email</th>
                        <th className="py-3.5 px-4 font-semibold">Team</th>
                        <th className="py-3.5 px-4 font-semibold">Role</th>
                        <th className="py-3.5 px-4 font-semibold">Date</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {filteredUsers.map((u, i) => (
                        <tr key={u.id || i} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">
                              {u.name.charAt(0)}
                            </span>
                            <span>{u.name}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{u.email}</td>
                          <td className="py-3 px-4 text-cyan-300">{u.team || 'Solo'}</td>
                          <td className="py-3 px-4">{u.role}</td>
                          <td className="py-3 px-4 text-slate-400">{u.date}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              u.status === 'Approved'
                                ? 'border-emerald-500/30 text-[#00FFAA] bg-emerald-500/10'
                                : u.status === 'Under Review'
                                ? 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                                : 'border-blue-500/30 text-blue-300 bg-blue-500/10'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE NEW EVENT */}
      {/* ------------------------------------------------------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#16191E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-bold text-white font-heading">
                Launch New Hackathon
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Genesis Hackathon 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Short Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Code autonomous agents for future space exploration"
                  value={newEvent.tagline}
                  onChange={(e) => setNewEvent({ ...newEvent, tagline: e.target.value })}
                  className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">Location / Mode</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco & Hybrid"
                    value={newEvent.city}
                    onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                    className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 14 - 16, 2026"
                    value={newEvent.dates}
                    onChange={(e) => setNewEvent({ ...newEvent, dates: e.target.value })}
                    className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    placeholder="e.g. $50,000 Cash Pool"
                    value={newEvent.prizePool}
                    onChange={(e) => setNewEvent({ ...newEvent, prizePool: e.target.value })}
                    className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Format</label>
                  <select
                    value={newEvent.format}
                    onChange={(e) => setNewEvent({ ...newEvent, format: e.target.value })}
                    className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#10B981] hover:bg-[#059669] text-white transition-colors"
                >
                  Publish Hackathon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

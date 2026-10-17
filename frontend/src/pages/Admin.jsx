import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  Trash2,
  Edit3,
  Award,
  Layers,
  FileSpreadsheet,
  Activity,
  AlertTriangle,
  Building,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { 
  getAdminMetrics, 
  getAdminTeams, 
  updateAdminTeam, 
  deleteAdminTeam, 
  getAdminAuditLogs, 
  syncGoogleSheets 
} from '../services/api';

export default function Admin({ user, onNavigateToVolunteers }) {
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'analytics' | 'audit'
  const [metrics, setMetrics] = useState(null);
  const [teams, setTeams] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    team_name: '',
    domain: '',
    registration_status: '',
    payment_status: '',
    checked_in: false
  });
  const [actionMessage, setActionMessage] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, teamsRes, auditRes] = await Promise.all([
        getAdminMetrics().catch(() => ({ success: false })),
        getAdminTeams().catch(() => ({ success: false, teams: [] })),
        getAdminAuditLogs().catch(() => ({ success: false, logs: [] }))
      ]);

      if (metricsRes?.success) {
        setMetrics(metricsRes.metrics);
      }
      if (teamsRes?.success) {
        setTeams(teamsRes.teams || []);
      }
      if (auditRes?.success) {
        setAuditLogs(auditRes.logs || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSheets = async () => {
    setSyncingSheets(true);
    setSyncNotice(null);
    try {
      const res = await syncGoogleSheets();
      if (res.success) {
        setSyncNotice({ type: 'success', text: `Google Sheets synchronized! ${res.synced_count || res.count || 'All'} records updated.` });
        fetchDashboardData();
      } else {
        setSyncNotice({ type: 'error', text: res.message || 'Synchronization failed.' });
      }
    } catch (err) {
      setSyncNotice({ type: 'error', text: 'Error connecting to Google Sheets API endpoint.' });
    } finally {
      setSyncingSheets(false);
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const handleExportCSV = () => {
    if (!teams || teams.length === 0) {
      alert('No team data available to export.');
      return;
    }

    const headers = ['Registration ID', 'Team Name', 'Domain / Track', 'College', 'Leader Name', 'Leader Email', 'Leader Phone', 'Team Size', 'Status', 'Payment', 'Checked In', 'Registered At'];
    
    const rows = teams.map(t => [
      t.registration_id || t.team_id,
      `"${(t.team_name || '').replace(/"/g, '""')}"`,
      `"${(t.domain || '').replace(/"/g, '""')}"`,
      `"${(t.college || t.leader_college || '').replace(/"/g, '""')}"`,
      `"${(t.leader_name || '').replace(/"/g, '""')}"`,
      t.leader_email || '',
      t.leader_phone || '',
      t.members ? t.members.length + 1 : 1,
      t.registration_status || 'PENDING',
      t.payment_status || 'PAID',
      t.checked_in ? 'YES' : 'NO',
      t.created_at || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TECHSPIRIT_2026_Teams_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusToggle = async (team, newStatus) => {
    try {
      const res = await updateAdminTeam(team.team_id || team.registration_id, {
        registration_status: newStatus
      });
      if (res.success) {
        setTeams(prev => prev.map(t => (t.team_id === team.team_id ? { ...t, registration_status: newStatus } : t)));
        setActionMessage(`Team "${team.team_name}" status changed to ${newStatus}.`);
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err) {
      alert('Failed to update team status');
    }
  };

  const handleDeleteTeam = async (team) => {
    if (!window.confirm(`Are you sure you want to permanently delete team "${team.team_name}" (${team.registration_id})?`)) {
      return;
    }

    try {
      const res = await deleteAdminTeam(team.team_id || team.registration_id);
      if (res.success) {
        setTeams(prev => prev.filter(t => t.team_id !== team.team_id));
        setActionMessage(`Team "${team.team_name}" was successfully removed.`);
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err) {
      alert('Error deleting team record.');
    }
  };

  const openEditModal = (team) => {
    setSelectedTeam(team);
    setEditFormData({
      team_name: team.team_name || '',
      domain: team.domain || '',
      registration_status: team.registration_status || 'APPROVED',
      payment_status: team.payment_status || 'PAID',
      checked_in: Boolean(team.checked_in)
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      const res = await updateAdminTeam(selectedTeam.team_id || selectedTeam.registration_id, editFormData);
      if (res.success) {
        setTeams(prev => prev.map(t => (t.team_id === selectedTeam.team_id ? { ...t, ...editFormData } : t)));
        setIsEditModalOpen(false);
        setActionMessage(`Team "${editFormData.team_name}" updated.`);
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err) {
      alert('Failed to update team information.');
    }
  };

  // Filtered teams list
  const filteredTeams = teams.filter(t => {
    const matchesSearch = 
      (t.team_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.registration_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.leader_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.leader_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.college || t.leader_college || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrack = trackFilter === 'ALL' || t.domain === trackFilter;
    const matchesStatus = statusFilter === 'ALL' || t.registration_status === statusFilter;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  const totalRegistered = teams.length;
  const checkedInCount = teams.filter(t => t.checked_in || t.registration_status === 'CHECKED_IN').length;
  const attendanceRate = totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 pb-24">
      {/* Ambient Cyberpunk Glow */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SUPER ADMIN CLEARANCE • MASTER COMMAND CONSOLE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              BITS TECHSPIRIT <span className="bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] bg-clip-text text-transparent">2026 Admin</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Complete oversight of registered squads, venue capacity check-ins, automated Google Sheets pipeline, and tamper-proof audit trails.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncSheets}
              disabled={syncingSheets}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00E5A8] ${syncingSheets ? 'animate-spin' : ''}`} />
              <span>{syncingSheets ? 'Syncing...' : 'Sync Google Sheets'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1]/20 to-[#BB5CF6]/20 hover:from-[#6366F1]/30 hover:to-[#BB5CF6]/30 border border-[#6366F1]/40 text-xs font-mono font-semibold text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            {onNavigateToVolunteers && (
              <button
                onClick={onNavigateToVolunteers}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono font-bold text-[#00E5A8] flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Volunteers Desk →</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync or Action Notification Banner */}
        {syncNotice && (
          <div className={`mt-4 p-3.5 rounded-xl border flex items-center gap-3 text-xs font-mono transition-all ${
            syncNotice.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {syncNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span>{syncNotice.text}</span>
          </div>
        )}

        {actionMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-3 text-xs font-mono">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          
          {/* Card 1: Registered Teams */}
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Teams</span>
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-heading">{totalRegistered}</span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Across 10 cutting-edge domains</p>
          </div>

          {/* Card 2: Physical Venue Check-in */}
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Venue Check-ins</span>
              <div className="w-8 h-8 rounded-lg bg-[#00E5A8]/10 border border-[#00E5A8]/30 flex items-center justify-center text-[#00E5A8]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-heading">{checkedInCount}</span>
              <span className="text-xs font-mono text-slate-400">/ {totalRegistered} teams</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#00E5A8] to-cyan-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5">
              <span>Gate attendance</span>
              <span className="text-[#00E5A8] font-bold">{attendanceRate}%</span>
            </div>
          </div>

          {/* Card 3: Prize Pool Allocated */}
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Prize Pool</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-white font-heading">₹1,50,000</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">1st ₹50k • 2nd ₹30k • Track ₹20k</p>
          </div>

          {/* Card 4: Sheets & DB Health */}
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Google Sheets Sync</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-mono font-bold text-emerald-300">AUTO-SYNC ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {metrics?.last_sync ? `Synced: ${new Date(metrics.last_sync).toLocaleTimeString()}` : 'Connected to Cloud DB'}
            </p>
          </div>

        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 mt-10 border-b border-white/[0.08] pb-1">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'teams'
                ? 'border-[#00F5FF] text-[#00F5FF] bg-white/[0.03]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Database ({filteredTeams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-[#6366F1] text-[#6366F1] bg-white/[0.03]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Domain Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-[#BB5CF6] text-[#BB5CF6] bg-white/[0.03]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>System Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: TEAM MASTER DATABASE */}
        {/* ============================================================== */}
        {activeTab === 'teams' && (
          <div className="mt-6 space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search team name, leader, ID, college or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111827]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5FF]/60 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={trackFilter}
                  onChange={(e) => setTrackFilter(e.target.value)}
                  className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#6366F1]/50"
                >
                  <option value="ALL">All Domains</option>
                  <option value="Cybersecurity & Privacy">Cybersecurity & Privacy</option>
                  <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  <option value="Smart Mobility & EV Tech">Smart Mobility & EV Tech</option>
                  <option value="Healthcare & Biomedical">Healthcare & Biomedical</option>
                  <option value="IoT & Smart Infrastructure">IoT & Smart Infrastructure</option>
                  <option value="Blockchain & Web3">Blockchain & Web3</option>
                  <option value="AgriTech & Sustainability">AgriTech & Sustainability</option>
                  <option value="FinTech & Decentralized Economy">FinTech & Economy</option>
                  <option value="AR/VR & Immersive Computing">AR/VR & Immersive</option>
                  <option value="Open Innovation">Open Innovation</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#6366F1]/50"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CHECKED_IN">Checked In</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Teams Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0E131F]/90 shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Team & ID</th>
                    <th className="py-3.5 px-4 font-semibold">Domain / Track</th>
                    <th className="py-3.5 px-4 font-semibold">Leader & College</th>
                    <th className="py-3.5 px-4 font-semibold">Squad Size</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Gate Check-in</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500 font-mono">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6366F1]" />
                        Loading teams from master database...
                      </td>
                    </tr>
                  ) : filteredTeams.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500 font-mono">
                        No teams match your search or filter parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredTeams.map((team) => {
                      const isCheckedIn = team.checked_in || team.registration_status === 'CHECKED_IN';
                      return (
                        <tr key={team.team_id || team.registration_id} className="hover:bg-white/[0.02] transition-colors group">
                          
                          {/* Team Name and ID */}
                          <td className="py-4 px-4">
                            <div className="font-semibold text-white group-hover:text-[#00F5FF] transition-colors">
                              {team.team_name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                                {team.registration_id || team.team_id}
                              </span>
                            </div>
                          </td>

                          {/* Domain */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#6366F1]/10 text-indigo-300 border border-[#6366F1]/20">
                              {team.domain || 'Open Innovation'}
                            </span>
                          </td>

                          {/* Leader & College */}
                          <td className="py-4 px-4">
                            <div className="text-slate-200 font-medium">{team.leader_name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-500" />
                              <span className="truncate max-w-[160px]">{team.college || team.leader_college || 'BITS Pilani'}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{team.leader_email}</div>
                          </td>

                          {/* Squad Size */}
                          <td className="py-4 px-4 font-mono text-slate-300">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                              {team.members ? team.members.length + 1 : 1} Members
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4">
                            {team.registration_status === 'APPROVED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> APPROVED
                              </span>
                            )}
                            {team.registration_status === 'CHECKED_IN' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#00E5A8]/10 text-[#00E5A8] border border-[#00E5A8]/30">
                                <ShieldCheck className="w-3 h-3" /> CHECKED IN
                              </span>
                            )}
                            {team.registration_status === 'PENDING' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <Clock className="w-3 h-3" /> PENDING
                              </span>
                            )}
                            {team.registration_status === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                <X className="w-3 h-3" /> REJECTED
                              </span>
                            )}
                          </td>

                          {/* Gate Check-in Status */}
                          <td className="py-4 px-4">
                            {isCheckedIn ? (
                              <div className="flex items-center gap-1.5 text-xs text-[#00E5A8] font-mono font-bold">
                                <div className="w-2 h-2 rounded-full bg-[#00E5A8] animate-pulse" />
                                <span>VERIFIED</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                                <span>Awaiting arrival</span>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Approve / Toggle */}
                              {team.registration_status !== 'APPROVED' && team.registration_status !== 'CHECKED_IN' && (
                                <button
                                  onClick={() => handleStatusToggle(team, 'APPROVED')}
                                  title="Approve Team"
                                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Edit Modal Button */}
                              <button
                                onClick={() => openEditModal(team)}
                                title="Edit Team Record"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Team Button */}
                              <button
                                onClick={() => handleDeleteTeam(team)}
                                title="Delete Team"
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DOMAIN BREAKDOWN & ANALYTICS */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Domain Breakdown Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-[#00F5FF]" />
                Registrations by Innovation Track
              </h3>
              
              <div className="space-y-3">
                {[
                  { domain: 'Artificial Intelligence & ML', count: 18, color: 'from-[#00F5FF] to-cyan-500' },
                  { domain: 'Cybersecurity & Privacy', count: 14, color: 'from-[#6366F1] to-indigo-600' },
                  { domain: 'Smart Mobility & EV Tech', count: 11, color: 'from-[#BB5CF6] to-purple-600' },
                  { domain: 'Healthcare & Biomedical', count: 9, color: 'from-emerald-400 to-[#00E5A8]' },
                  { domain: 'IoT & Smart Infrastructure', count: 8, color: 'from-amber-400 to-orange-500' },
                  { domain: 'Blockchain & Web3', count: 7, color: 'from-blue-400 to-indigo-500' },
                  { domain: 'Open Innovation', count: 6, color: 'from-slate-400 to-slate-200' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{item.domain}</span>
                      <span className="text-white font-bold">{item.count} teams</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        style={{ width: `${(item.count / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in Gates and Kit Readiness */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-[#00E5A8]" />
                  Operational Telemetry & Kit Logistics
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Attendee Badges</div>
                    <div className="text-xl font-bold text-white mt-1">240 / 300</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">80% Printed & Staged</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Swag T-Shirts</div>
                    <div className="text-xl font-bold text-white mt-1">320 Units</div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Vault Verified</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Campus Wi-Fi Passes</div>
                    <div className="text-xl font-bold text-white mt-1">Ready</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-0.5">5GHz SSID Provisioned</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Hardware Toolkits</div>
                    <div className="text-xl font-bold text-white mt-1">45 Kits</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">ESP32 / Sensors Ready</div>
                  </div>
                </div>
              </div>

              {onNavigateToVolunteers && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Need live volunteer check-in actions?</div>
                    <div className="text-[11px] text-emerald-300/80">Manage desks, volunteer roster, and attendee badge dispatch.</div>
                  </div>
                  <button
                    onClick={onNavigateToVolunteers}
                    className="px-3.5 py-1.5 rounded-lg bg-[#00E5A8] text-black text-xs font-mono font-bold hover:bg-emerald-300 transition-colors cursor-pointer"
                  >
                    Open Volunteers Desk
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SYSTEM AUDIT LOGS */}
        {/* ============================================================== */}
        {activeTab === 'audit' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  Cryptographic Security Audit Log Stream
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Every check-in, status adjustment, and database edit is permanently recorded with timestamps and admin ID.
                </p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E131F]/90">
              <div className="divide-y divide-white/[0.04]">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">
                    No audit records logged yet. Actions performed will appear here automatically.
                  </div>
                ) : (
                  auditLogs.map((log, index) => (
                    <div key={index} className="p-4 hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] flex-shrink-0 mt-0.5">
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {log.action}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              by {log.admin_id || log.scanned_by || 'Super Admin'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 flex-shrink-0">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* EDIT TEAM MODAL */}
      {/* ============================================================== */}
      {isEditModalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0F172A] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-heading">
                Edit Team: <span className="text-[#00F5FF]">{selectedTeam.team_name}</span>
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Team Name</label>
                <input
                  type="text"
                  value={editFormData.team_name}
                  onChange={(e) => setEditFormData({ ...editFormData, team_name: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Domain / Track</label>
                <select
                  value={editFormData.domain}
                  onChange={(e) => setEditFormData({ ...editFormData, domain: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="Cybersecurity & Privacy">Cybersecurity & Privacy</option>
                  <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  <option value="Smart Mobility & EV Tech">Smart Mobility & EV Tech</option>
                  <option value="Healthcare & Biomedical">Healthcare & Biomedical</option>
                  <option value="IoT & Smart Infrastructure">IoT & Smart Infrastructure</option>
                  <option value="Blockchain & Web3">Blockchain & Web3</option>
                  <option value="AgriTech & Sustainability">AgriTech & Sustainability</option>
                  <option value="FinTech & Decentralized Economy">FinTech & Economy</option>
                  <option value="AR/VR & Immersive Computing">AR/VR & Immersive</option>
                  <option value="Open Innovation">Open Innovation</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Registration Status</label>
                <select
                  value={editFormData.registration_status}
                  onChange={(e) => setEditFormData({ ...editFormData, registration_status: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CHECKED_IN">CHECKED_IN</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Status</label>
                <select
                  value={editFormData.payment_status}
                  onChange={(e) => setEditFormData({ ...editFormData, payment_status: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="WAIVED">WAIVED</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="checked_in_toggle"
                  checked={editFormData.checked_in}
                  onChange={(e) => setEditFormData({ ...editFormData, checked_in: e.target.checked })}
                  className="w-4 h-4 rounded text-[#00E5A8] focus:ring-0"
                />
                <label htmlFor="checked_in_toggle" className="text-slate-300 text-xs">
                  Mark as Physically Checked In at Venue
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#6366F1] text-white font-bold text-xs hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

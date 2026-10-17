import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  GitBranch, 
  Award, 
  User, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Calendar, 
  Clock, 
  QrCode, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Building, 
  Phone, 
  Mail, 
  Database, 
  Edit3, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { getUserTeam, saveUserTeam } from '../services/api';

const TECHSPIRIT_DOMAINS = [
  "Cybersecurity & Privacy",
  "Artificial Intelligence & ML",
  "Smart Mobility & EV Tech",
  "Healthcare & Biomedical",
  "IoT & Smart Infrastructure",
  "Blockchain & Web3",
  "AgriTech & Sustainability",
  "FinTech & Decentralized Economy",
  "AR/VR & Immersive Computing",
  "Open Innovation"
];

export default function ParticipantDashboard({ 
  user, 
  onOpenScanner, 
  onSelectEvent, 
  onLogout,
  onOpenRegisterModal 
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterTab, setFilterTab] = useState('all');
  
  // Real team data state from backend or local session
  const [teamData, setTeamData] = useState(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Team Form State
  const [teamName, setTeamName] = useState('');
  const [domain, setDomain] = useState(TECHSPIRIT_DOMAINS[1]);
  const [leaderPhone, setLeaderPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [projectSummary, setProjectSummary] = useState('');
  const [members, setMembers] = useState([]);

  // Fetch real team for logged-in user on mount or user change
  useEffect(() => {
    const userEmail = user?.email;
    if (!userEmail) return;

    setIsLoadingTeam(true);
    getUserTeam(userEmail)
      .then((res) => {
        if (res && res.team) {
          populateTeam(res.team);
        } else {
          // Initialize clean form with logged-in user as leader
          initDefaultForm();
        }
      })
      .catch((err) => {
        console.warn('Error fetching user team:', err);
        initDefaultForm();
      })
      .finally(() => {
        setIsLoadingTeam(false);
      });
  }, [user]);

  const populateTeam = (team) => {
    setTeamData(team);
    setTeamName(team.team_name || '');
    setDomain(team.domain || TECHSPIRIT_DOMAINS[1]);
    setLeaderPhone(team.leader_phone || '');
    setCollege(team.college || '');
    setProjectSummary(team.project_summary || '');

    if (Array.isArray(team.members) && team.members.length > 0) {
      setMembers(team.members);
      const leader = team.members.find(m => m.is_leader) || team.members[0];
      if (leader) {
        setDepartment(leader.department || 'Computer Science & Engineering');
        setYear(leader.year || '3rd Year');
      }
    } else {
      initDefaultForm();
    }
  };

  const initDefaultForm = () => {
    setTeamName(`${user?.name || 'Innovator'}'s Squad`);
    setCollege(user?.college || 'BITS Pilani / Partner Institute');
    setMembers([
      {
        name: user?.name || 'Leader',
        email: user?.email || 'innovator@techspirit.io',
        phone: '',
        college: user?.college || 'BITS Pilani / Partner Institute',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        is_leader: true
      }
    ]);
  };

  // Add a new member (up to 4 total)
  const handleAddMember = () => {
    if (members.length >= 4) {
      alert('A maximum of 4 members are allowed per team.');
      return;
    }
    const newIdx = members.length + 1;
    setMembers([
      ...members,
      {
        name: '',
        email: '',
        phone: '',
        college: college || 'BITS Pilani / Partner Institute',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        is_leader: false
      }
    ]);
  };

  const handleRemoveMember = (idx) => {
    if (members.length <= 1) {
      alert('A team must have at least one member (the Team Leader).');
      return;
    }
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx, field, value) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: value };
    setMembers(updated);
  };

  const handleSaveTeamDetails = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert('Please enter a Team Name.');
      return;
    }

    setSaveStatus({ type: 'info', text: 'Saving team details to server...' });

    const leaderName = user?.name || members[0]?.name || 'Leader';
    const leaderEmail = user?.email || members[0]?.email || 'innovator@techspirit.io';

    // Ensure member 0 is marked as leader
    const finalizedMembers = members.map((m, idx) => ({
      ...m,
      name: m.name || (idx === 0 ? leaderName : `Teammate ${idx + 1}`),
      email: m.email || (idx === 0 ? leaderEmail : `member${idx + 1}@techspirit.io`),
      is_leader: idx === 0
    }));

    const payload = {
      team_name: teamName.trim(),
      domain,
      leader_name: leaderName,
      leader_email: leaderEmail,
      leader_phone: leaderPhone,
      college,
      project_summary: projectSummary,
      members: finalizedMembers
    };

    try {
      const res = await saveUserTeam(payload);
      if (res && res.team) {
        setTeamData(res.team);
        populateTeam(res.team);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        setSaveStatus({
          type: 'success',
          text: `Team "${res.team.team_name}" saved successfully! Entry Ticket ID: ${res.team.registration_id}`
        });

        setTimeout(() => {
          setActiveTab('teams');
        }, 800);
      }
    } catch (err) {
      setSaveStatus({
        type: 'error',
        text: err.message || 'Failed to save team to backend database.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E0E0E0] flex flex-col md:flex-row text-left">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR WITH OFFICIAL TECHSPIRIT LOGO & NAVIGATION */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-[#111827] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-20 px-5 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] p-[2px] shadow-md shrink-0">
              <img 
                src="/logo.jpeg" 
                alt="TECHSPIRIT" 
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-white font-heading leading-tight">
                TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#BB5CF6]">SPIRIT</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                PARTICIPANT HUB
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-[#1E232B] text-white border-l-4 border-[#6366F1] font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#6366F1]' : ''}`} />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('teams')}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                activeTab === 'teams' 
                  ? 'bg-[#1E232B] text-white border-l-4 border-[#00E5A8] font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'teams' ? 'text-[#00E5A8]' : ''}`} />
              <span>My Teams</span>
              {teamData && (
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#00E5A8] font-mono">
                  Active
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('edit-team')}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                activeTab === 'edit-team' 
                  ? 'bg-[#1E232B] text-white border-l-4 border-cyan-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Edit3 className={`w-4 h-4 ${activeTab === 'edit-team' ? 'text-cyan-400' : ''}`} />
              <span>Enter Team Details</span>
            </button>

            <button 
              onClick={() => setActiveTab('pass')}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                activeTab === 'pass' 
                  ? 'bg-[#1E232B] text-white border-l-4 border-purple-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className={`w-4 h-4 ${activeTab === 'pass' ? 'text-purple-400' : ''}`} />
              <span>Event QR Entry Ticket</span>
            </button>

            <button 
              onClick={() => setActiveTab('hackathons')}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                activeTab === 'hackathons' 
                  ? 'bg-[#1E232B] text-white border-l-4 border-indigo-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Hackathons</span>
            </button>

            <button 
              onClick={() => setActiveTab('submissions')}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                activeTab === 'submissions' 
                  ? 'bg-[#1E232B] text-white border-l-4 border-amber-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Submissions</span>
            </button>

            <button 
              onClick={() => setActiveTab('certificates')}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                activeTab === 'certificates' 
                  ? 'bg-[#1E232B] text-white border-l-4 border-pink-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-mono text-rose-400 hover:text-rose-300 w-full px-3 py-2 rounded-xl hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 px-6 bg-[#111827]/70 border-b border-white/5 flex items-center justify-between">
          <div className="relative w-64 hidden sm:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search hackathons, teams..."
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#00E5A8] absolute top-1.5 right-1.5" />
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              {user?.avatar && typeof user.avatar === 'string' && user.avatar.startsWith('http') ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#6366F1]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#00E5A8] text-white font-bold flex items-center justify-center text-xs">
                  {user?.avatar || (user?.name ? user.name[0] : 'U')}
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white leading-none">{user?.name || 'Innovator'}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                  {teamData ? teamData.team_name : (user?.email || 'Participant')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">

          {/* Save Status Alert Banner */}
          {saveStatus && (
            <div className={`p-4 rounded-2xl text-xs font-mono border flex items-center justify-between ${
              saveStatus.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : saveStatus.type === 'error'
                ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                : 'bg-indigo-950/50 border-indigo-500/40 text-indigo-300'
            }`}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveStatus.text}</span>
              </div>
              <button onClick={() => setSaveStatus(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Welcome back, {user?.name || 'Innovator'}!
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    {teamData 
                      ? `Active Team: "${teamData.team_name}" • Track: ${teamData.domain}` 
                      : 'Keep building, keep innovating. TECHSPIRIT 2026 Season is Live.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('edit-team')}
                    className="px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-xs font-mono text-cyan-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{teamData ? 'Edit Team Details' : 'Enter Team Details'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pass')}
                    className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono text-[#00E5A8] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Pass</span>
                  </button>
                </div>
              </div>

              {/* LIVE TEAM STATUS HERO CARD */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111827] via-[#151c33] to-[#111827] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
                      <Sparkles className="w-3.5 h-3.5 text-[#00F5FF]" />
                      <span>OFFICIAL REGISTERED TEAM</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                      {teamData ? teamData.team_name : `${user?.name || 'Participant'}'s Team`}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Building className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{teamData?.college || user?.college || 'Partner Institute'}</span>
                      </span>

                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>{teamData?.members?.length || 1} Members</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                        {teamData?.domain || 'Artificial Intelligence & ML'}
                      </span>
                    </div>

                    {teamData?.project_summary && (
                      <p className="text-xs text-slate-400 max-w-2xl pt-1 italic">
                        "{teamData.project_summary}"
                      </p>
                    )}
                  </div>

                  {/* QR Ticket Widget Inside Card */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0A0A0F]/80 border border-white/10 shrink-0">
                    <div className="w-20 h-20 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                      {teamData?.qr_code_url ? (
                        <img src={teamData.qr_code_url} alt="QR" className="w-full h-full object-contain" />
                      ) : (
                        <QRCodeSVG 
                          value={teamData?.qr_token || `QR-${teamData?.registration_id || 'BTS26-0001'}`} 
                          size={72} 
                        />
                      )}
                    </div>

                    <div className="text-left font-mono text-xs space-y-1">
                      <div className="text-[10px] text-slate-400">REGISTRATION PASS</div>
                      <div className="text-sm font-bold text-white">{teamData?.registration_id || 'BTS26-PENDING'}</div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-[#00E5A8] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A8] animate-pulse" />
                        {teamData?.registration_status || 'CONFIRMED'}
                      </div>
                      <div>
                        <button
                          onClick={() => setActiveTab('pass')}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          Enlarge Pass <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 STAT METRICS CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
                  <div className="text-3xl font-black text-cyan-400 font-heading">
                    {teamData ? '1' : '0'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-2">
                    Registered Events
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
                  <div className="text-3xl font-black text-amber-400 font-heading">
                    {teamData?.team_size || (teamData?.members ? teamData.members.length : 1)}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-2">
                    Team Size
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
                  <div className="text-3xl font-black text-[#00E5A8] font-heading">
                    {teamData?.checked_in ? 'Checked In' : 'Active'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-2">
                    Desk Check-in Status
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
                  <div className="text-3xl font-black text-[#BB5CF6] font-heading">
                    ₹1,50,000
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-2">
                    Prize Pool Track
                  </div>
                </div>
              </div>

              {/* HACKATHONS LIST */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white font-heading">
                    Registered Hackathons
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-900 to-indigo-900 border border-white/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-[#00F5FF]" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                          BITS TECHSPIRIT 2026 (National Level)
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Oct 26 - Oct 27, 2026 • Team: <strong className="text-white">{teamData ? teamData.team_name : 'Your Team'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-[#00E5A8] border border-emerald-500/40 font-bold">
                        Confirmed & Verified
                      </span>
                      <button 
                        onClick={() => setActiveTab('teams')}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-colors cursor-pointer"
                      >
                        Team Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 2: MY TEAMS (LIVE ROSTER DISPLAY) */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    My Team Roster
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage and inspect verified team members for BITS TECHSPIRIT 2026
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('edit-team')}
                  className="px-5 py-2.5 rounded-xl font-bold font-heading text-xs uppercase bg-[#6366F1] hover:bg-[#818CF8] text-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer self-start sm:self-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Team Details</span>
                </button>
              </div>

              {/* Team Overview Card */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400">TEAM REGISTRATION ID</span>
                    <h3 className="text-xl font-black text-white font-heading mt-0.5">
                      {teamData ? teamData.team_name : `${user?.name || 'Participant'}'s Team`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                      ID: {teamData?.registration_id || 'BTS26-0001'}
                    </span>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-[#00FFAA] border border-emerald-500/40 font-bold">
                      {teamData?.registration_status || 'CONFIRMED'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
                  <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-white/5 space-y-1">
                    <div className="text-slate-500">Problem Domain:</div>
                    <div className="text-white font-bold">{teamData?.domain || domain}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-white/5 space-y-1">
                    <div className="text-slate-500">Institution / College:</div>
                    <div className="text-white font-bold">{teamData?.college || college || 'BITS Pilani'}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-white/5 space-y-1">
                    <div className="text-slate-500">Leader Contact:</div>
                    <div className="text-white font-bold truncate">{teamData?.leader_email || user?.email}</div>
                  </div>
                </div>

                {teamData?.project_summary && (
                  <div className="pt-2 text-xs font-mono">
                    <span className="text-slate-400 block mb-1">Project Concept / Summary:</span>
                    <div className="p-3 rounded-xl bg-[#0A0A0F] border border-white/5 text-slate-300">
                      {teamData.project_summary}
                    </div>
                  </div>
                )}
              </div>

              {/* Members Grid */}
              <div>
                <h3 className="text-lg font-bold text-white font-heading mb-4">
                  Registered Members ({members.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-[#111827] border border-white/10 hover:border-cyan-500/40 transition-colors space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#BB5CF6] text-white flex items-center justify-center font-bold text-sm">
                            {member.name ? member.name.charAt(0) : `M${idx + 1}`}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white font-heading flex items-center gap-2">
                              <span>{member.name || (idx === 0 ? user?.name : `Member ${idx + 1}`)}</span>
                              {idx === 0 && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/40 font-bold">
                                  TEAM LEADER
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              {member.email || (idx === 0 ? user?.email : '')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                        <div>
                          <span className="text-slate-500 text-[10px] block">College:</span>
                          <span className="truncate block">{member.college || college || 'Institute'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Department & Year:</span>
                          <span className="truncate block">{member.department || 'CSE'} • {member.year || '3rd Year'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 3: ENTER / EDIT TEAM DETAILS FORM */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'edit-team' && (
            <div className="max-w-4xl space-y-6">
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  Enter Team Details
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your team credentials to appear on the official leaderboard, desk scanner, and Google Sheets ledger.
                </p>
              </div>

              <form onSubmit={handleSaveTeamDetails} className="space-y-6">
                
                {/* Section 1: Team & Domain */}
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-4 text-xs font-mono">
                  <h3 className="text-sm font-bold text-white font-heading uppercase text-cyan-400 border-b border-white/10 pb-2">
                    1. Team Identity & Track
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1.5 font-medium">
                        Team Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. QuantumSentinels"
                        className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1.5 font-medium">
                        Problem Track / Domain <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#6366F1]"
                      >
                        {TECHSPIRIT_DOMAINS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1.5 font-medium">
                        College / University <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. BITS Pilani"
                        className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1.5 font-medium">
                        Leader Phone Number
                      </label>
                      <input
                        type="tel"
                        value={leaderPhone}
                        onChange={(e) => setLeaderPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1.5 font-medium">
                      Project Idea Summary (Brief Description)
                    </label>
                    <textarea
                      rows={3}
                      value={projectSummary}
                      onChange={(e) => setProjectSummary(e.target.value)}
                      placeholder="Explain what your team is building and the real-world impact..."
                      className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>

                {/* Section 2: Team Members */}
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-4 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-bold text-white font-heading uppercase text-cyan-400">
                      2. Team Members ({members.length} / 4)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      disabled={members.length >= 4}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-[#00E5A8] hover:bg-emerald-500/25 flex items-center gap-1.5 font-bold transition-all disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Member
                    </button>
                  </div>

                  <div className="space-y-4">
                    {members.map((member, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0A0A0F] border border-white/10 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">
                            {idx === 0 ? 'Member 1 (Team Leader)' : `Member ${idx + 1}`}
                          </span>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(idx)}
                              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-slate-400 block mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              value={member.name}
                              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                              placeholder={idx === 0 ? user?.name : 'Name'}
                              className="w-full bg-[#111827] border border-white/15 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
                            />
                          </div>

                          <div>
                            <label className="text-slate-400 block mb-1">Email</label>
                            <input
                              type="email"
                              required
                              value={member.email}
                              onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                              placeholder={idx === 0 ? user?.email : 'email@example.com'}
                              className="w-full bg-[#111827] border border-white/15 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
                            />
                          </div>

                          <div>
                            <label className="text-slate-400 block mb-1">Department</label>
                            <input
                              type="text"
                              value={member.department || 'CSE'}
                              onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                              placeholder="e.g. CSE / ECE"
                              className="w-full bg-[#111827] border border-white/15 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl font-bold font-heading uppercase text-xs tracking-wider bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
                  >
                    Save & Register Team Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6 py-3.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 4: EVENT QR ENTRY PASS */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'pass' && (
            <div className="max-w-md mx-auto text-center space-y-6">
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  Official Entry Pass
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Present this QR ticket at the TECHSPIRIT registration desk for automated RFID / laser check-in.
                </p>
              </div>

              {/* Physical Pass Card Replica */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0D1224] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">BITS TECHSPIRIT 2026</span>
                    <span className="text-sm font-bold text-white font-heading">{teamData?.team_name || 'Participant Pass'}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-[#00FFAA] border border-emerald-500/40 font-bold">
                    {teamData?.registration_status || 'VERIFIED'}
                  </span>
                </div>

                <div className="w-52 h-52 mx-auto p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  {teamData?.qr_code_url ? (
                    <img src={teamData.qr_code_url} alt="Official Pass QR" className="w-full h-full object-contain" />
                  ) : (
                    <QRCodeSVG 
                      value={teamData?.qr_token || `QR-${teamData?.registration_id || 'BTS26-0001'}`} 
                      size={184}
                      level="H"
                    />
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono space-y-2 text-left">
                  <div className="flex justify-between text-slate-400">
                    <span>Ticket ID:</span>
                    <span className="text-white font-bold">{teamData?.registration_id || 'BTS26-0001'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Team:</span>
                    <span className="text-[#00F5FF] font-semibold">{teamData?.team_name || 'Registered Squad'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Domain:</span>
                    <span className="text-emerald-400 truncate max-w-[200px]">{teamData?.domain || domain}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Leader:</span>
                    <span className="text-white">{user?.name || teamData?.leader_name}</span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Venue: BITS Auditorium</span>
                  <span>Entry Gate: 01</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono border border-white/15 hover:border-white/30 text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Print Ticket PDF
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold font-heading bg-[#6366F1] text-white hover:bg-[#818CF8] transition-colors"
                >
                  Back to Hub
                </button>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 5: HACKATHONS */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'hackathons' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">
                All My Registered Hackathons
              </h2>
              <div className="p-6 rounded-2xl bg-[#111827] border border-white/5 space-y-3">
                <h3 className="text-base font-bold text-white">BITS TECHSPIRIT 2026</h3>
                <p className="text-xs text-slate-400 font-mono">
                  National Level 48-Hour Hybrid Hackathon • Oct 26 - Oct 27, 2026
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs font-mono text-[#00E5A8] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    Status: Registered Team ({teamData?.team_name || 'Active'})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 6: SUBMISSIONS */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">
                Project Submissions
              </h2>
              <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 text-center space-y-4">
                <GitBranch className="w-12 h-12 text-[#6366F1] mx-auto opacity-60" />
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Submission Portal for BITS TECHSPIRIT 2026
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    The code submission gate will open on Day 2 of the hackathon. Ensure your GitHub repo and demo video are ready.
                  </p>
                </div>
                <div className="text-xs font-mono text-cyan-400">
                  Team: <strong>{teamData?.team_name || 'Active Team'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 7: CERTIFICATES */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-heading">
                Verified Certificates
              </h2>
              <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 text-center space-y-3">
                <Award className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
                <h3 className="text-base font-bold text-white font-heading">
                  Certificate of Participation
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
                  Certificates will be cryptographically issued to all verified attendees post completion of jury scoring.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

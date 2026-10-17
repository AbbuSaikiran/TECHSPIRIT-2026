import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Check,
  X,
  AlertTriangle,
  Building,
  ShieldCheck,
  Package,
  Layers,
  Phone,
  Mail,
  UserCheck,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Wifi,
  Coffee,
  IdCard,
  Shirt
} from 'lucide-react';
import { 
  verifyCheckin, 
  getVolunteers, 
  addVolunteer, 
  getCheckins, 
  updateKitDistribution,
  getAdminTeams
} from '../services/api';

export default function Volunteers({ user, onOpenScanner, onNavigateToAdmin }) {
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'roster' | 'stream'
  const [regInput, setRegInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [checkinResult, setCheckinResult] = useState(null);
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deskFilter, setDeskFilter] = useState('ALL');

  // Kit checklist state for the currently active verified team
  const [kitState, setKitState] = useState({
    badges_issued: false,
    swag_distributed: false,
    meal_passes_given: false,
    wifi_credentials_passed: false
  });
  const [kitSaving, setKitSaving] = useState(false);
  const [kitSuccess, setKitSuccess] = useState(false);

  // New Volunteer modal state
  const [isAddVolunteerOpen, setIsAddVolunteerOpen] = useState(false);
  const [newVolData, setNewVolData] = useState({
    name: '',
    email: '',
    phone: '',
    desk: 'Desk Alpha (Main Gate)',
    role: 'Registration & Check-in',
    shift: 'Morning (08:00 - 14:00)'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [volRes, chkRes, teamsRes] = await Promise.all([
        getVolunteers().catch(() => ({ success: false, volunteers: [] })),
        getCheckins().catch(() => ({ success: false, checkins: [] })),
        getAdminTeams().catch(() => ({ success: false, teams: [] }))
      ]);

      if (volRes?.success) setVolunteers(volRes.volunteers || []);
      if (chkRes?.success) setCheckinHistory(chkRes.checkins || []);
      if (teamsRes?.success) setAllTeams(teamsRes.teams || []);
    } catch (e) {
      console.error('Failed to load volunteers data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckin = async (e) => {
    if (e) e.preventDefault();
    if (!regInput.trim()) return;

    setVerifying(true);
    setCheckinResult(null);
    setKitSuccess(false);

    try {
      const staffName = user?.name || 'Volunteer Desk Alpha';
      const res = await verifyCheckin(regInput.trim(), staffName);
      
      setCheckinResult(res);
      if (res?.success && res?.team) {
        // Initialize kit state from existing team kit record or defaults
        const existingKit = res.team.kit_distribution || {};
        setKitState({
          badges_issued: Boolean(existingKit.badges_issued) || true,
          swag_distributed: Boolean(existingKit.swag_distributed),
          meal_passes_given: Boolean(existingKit.meal_passes_given) || true,
          wifi_credentials_passed: Boolean(existingKit.wifi_credentials_passed) || true
        });
        // Refresh live checkin stream
        loadData();
      }
    } catch (err) {
      setCheckinResult({
        success: false,
        message: 'Could not communicate with verification server.'
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveKitDistribution = async () => {
    if (!checkinResult?.team) return;
    setKitSaving(true);
    try {
      const teamId = checkinResult.team.team_id || checkinResult.team.registration_id;
      const res = await updateKitDistribution({
        team_id: teamId,
        ...kitState
      });
      if (res.success) {
        setKitSuccess(true);
        setTimeout(() => setKitSuccess(false), 4000);
      }
    } catch (e) {
      alert('Error updating kit distribution status');
    } finally {
      setKitSaving(false);
    }
  };

  const handleCreateVolunteer = async (e) => {
    e.preventDefault();
    try {
      const res = await addVolunteer(newVolData);
      if (res.success) {
        setVolunteers(prev => [...prev, res.volunteer]);
        setIsAddVolunteerOpen(false);
        setNewVolData({
          name: '',
          email: '',
          phone: '',
          desk: 'Desk Alpha (Main Gate)',
          role: 'Registration & Check-in',
          shift: 'Morning (08:00 - 14:00)'
        });
      }
    } catch (err) {
      alert('Failed to register volunteer assignment.');
    }
  };

  const filteredVolunteers = deskFilter === 'ALL'
    ? volunteers
    : volunteers.filter(v => v.desk && v.desk.includes(deskFilter));

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 pb-24">
      {/* Ambient Lighting */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00E5A8] text-xs font-mono font-bold tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VENUE GROUND OPERATIONS • VOLUNTEERS PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              Volunteers & <span className="bg-gradient-to-r from-[#00E5A8] via-[#00F5FF] to-[#6366F1] bg-clip-text text-transparent">Check-in Desk</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Rapid physical squad check-in, attendee kit & badge distribution, campus Wi-Fi pass allocation, and volunteer station shifts.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {onOpenScanner && (
              <button
                onClick={onOpenScanner}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5A8] to-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,168,0.4)] hover:shadow-[0_0_25px_rgba(0,229,168,0.6)] transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch Camera Scanner</span>
              </button>
            )}

            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Console →</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Operations Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#00E5A8] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Checked In</div>
              <div className="text-lg font-bold text-white font-heading">
                {checkinHistory.length} Teams
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Active Volunteers</div>
              <div className="text-lg font-bold text-white font-heading">
                {volunteers.length} On Duty
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Active Desks</div>
              <div className="text-lg font-bold text-white font-heading">
                4 Gate Hubs
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Swag Kits Staged</div>
              <div className="text-lg font-bold text-white font-heading">
                Ready at Desk
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-8 border-b border-white/[0.08] pb-1">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'checkin'
                ? 'border-[#00E5A8] text-[#00E5A8] bg-white/[0.03]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fast Check-in & Kit Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roster'
                ? 'border-[#00F5FF] text-[#00F5FF] bg-white/[0.03]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Volunteer Roster & Desks ({volunteers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'stream'
                ? 'border-[#6366F1] text-[#6366F1] bg-white/[0.03]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Gate Arrivals Stream ({checkinHistory.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: FAST CHECK-IN & KIT DISPATCH */}
        {/* ============================================================== */}
        {activeTab === 'checkin' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Input & Search Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
                <h3 className="text-base font-bold text-white font-heading flex items-center gap-2 mb-2">
                  <QrCode className="w-4 h-4 text-[#00E5A8]" />
                  Enter Registration ID / QR Payload
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Type the participant's Team ID (e.g. <span className="font-mono text-cyan-300 font-bold">TECH26-0001</span> or team UUID) or use barcode scanner.
                </p>

                <form onSubmit={handleManualCheckin} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. TECH26-0001, CyberGuardians, etc."
                      value={regInput}
                      onChange={(e) => setRegInput(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#00E5A8] transition-colors"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={verifying || !regInput.trim()}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00E5A8] to-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {verifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify & Check-In</span>
                        </>
                      )}
                    </button>

                    {onOpenScanner && (
                      <button
                        type="button"
                        onClick={onOpenScanner}
                        className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-colors"
                        title="Open Camera Scanner"
                      >
                        <QrCode className="w-4 h-4 text-[#00E5A8]" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Quick select list from registered teams */}
                <div className="mt-6 pt-5 border-t border-white/[0.08]">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Or select from registered teams:
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {allTeams.slice(0, 10).map((t) => (
                      <button
                        key={t.team_id || t.registration_id}
                        type="button"
                        onClick={() => {
                          setRegInput(t.registration_id || t.team_id);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-slate-200">{t.team_name}</span>
                          <span className="text-[10px] text-slate-500 ml-2 font-mono">{t.registration_id}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          t.checked_in 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-white/5 text-slate-400'
                        }`}>
                          {t.checked_in ? 'Checked-In' : 'Pending'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Verification & Kit Checklist Column (7 cols) */}
            <div className="lg:col-span-7">
              {checkinResult ? (
                <div className={`p-6 rounded-2xl border backdrop-blur-xl ${
                  checkinResult.success
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}>
                  
                  {/* Status Banner */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        checkinResult.success
                          ? 'bg-emerald-500/20 text-[#00E5A8] border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {checkinResult.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white font-heading">
                          {checkinResult.already_checked_in 
                            ? 'Team Already Checked In' 
                            : checkinResult.success 
                              ? 'Check-In Verification Successful!' 
                              : 'Verification Failed'}
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">{checkinResult.message}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setCheckinResult(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Team Details (If verified) */}
                  {checkinResult.team && (
                    <div className="mt-4 space-y-4">
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Team Name</div>
                          <div className="text-sm font-bold text-white mt-0.5">{checkinResult.team.team_name}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Registration ID</div>
                          <div className="text-sm font-mono font-bold text-[#00F5FF] mt-0.5">
                            {checkinResult.team.registration_id}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Track / Domain</div>
                          <div className="text-xs font-semibold text-purple-300 mt-0.5 truncate">
                            {checkinResult.team.domain || 'Open Innovation'}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Leader</div>
                          <div className="text-xs text-slate-200 mt-0.5 font-medium">{checkinResult.team.leader_name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{checkinResult.team.leader_phone}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">College / Org</div>
                          <div className="text-xs text-slate-200 mt-0.5 truncate">{checkinResult.team.college || 'BITS Pilani'}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Team Size</div>
                          <div className="text-xs text-slate-200 mt-0.5 font-mono">
                            {checkinResult.team.members ? checkinResult.team.members.length + 1 : 1} Members
                          </div>
                        </div>
                      </div>

                      {/* Swag & Kit Operations Checklist */}
                      <div className="mt-5 p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#00E5A8]" />
                            Physical Kit & Badge Handover Checklist
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">Desk Operations</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Item 1: Attendee ID Badges */}
                          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
                            <input
                              type="checkbox"
                              checked={kitState.badges_issued}
                              onChange={(e) => setKitState({ ...kitState, badges_issued: e.target.checked })}
                              className="w-4 h-4 rounded text-[#00E5A8] focus:ring-0"
                            />
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <IdCard className="w-3.5 h-3.5 text-cyan-400" />
                              <span>NFC / Physical ID Badges</span>
                            </div>
                          </label>

                          {/* Item 2: Swag & T-Shirts */}
                          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
                            <input
                              type="checkbox"
                              checked={kitState.swag_distributed}
                              onChange={(e) => setKitState({ ...kitState, swag_distributed: e.target.checked })}
                              className="w-4 h-4 rounded text-[#00E5A8] focus:ring-0"
                            />
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Shirt className="w-3.5 h-3.5 text-purple-400" />
                              <span>TECHSPIRIT 2026 T-Shirts</span>
                            </div>
                          </label>

                          {/* Item 3: Meal Passes */}
                          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
                            <input
                              type="checkbox"
                              checked={kitState.meal_passes_given}
                              onChange={(e) => setKitState({ ...kitState, meal_passes_given: e.target.checked })}
                              className="w-4 h-4 rounded text-[#00E5A8] focus:ring-0"
                            />
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Coffee className="w-3.5 h-3.5 text-amber-400" />
                              <span>Dining / Meal Band Passes</span>
                            </div>
                          </label>

                          {/* Item 4: Wi-Fi Credentials */}
                          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
                            <input
                              type="checkbox"
                              checked={kitState.wifi_credentials_passed}
                              onChange={(e) => setKitState({ ...kitState, wifi_credentials_passed: e.target.checked })}
                              className="w-4 h-4 rounded text-[#00E5A8] focus:ring-0"
                            />
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Campus Wi-Fi Credentials</span>
                            </div>
                          </label>
                        </div>

                        {/* Save Kit Button */}
                        <div className="flex items-center justify-between pt-2">
                          {kitSuccess && (
                            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Kit distribution recorded!
                            </span>
                          )}
                          <div className="ml-auto">
                            <button
                              type="button"
                              onClick={handleSaveKitDistribution}
                              disabled={kitSaving}
                              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold border border-white/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5A8]" />
                              <span>{kitSaving ? 'Saving...' : 'Confirm Kit Handover'}</span>
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
                    <ShieldCheck className="w-6 h-6 text-[#00E5A8]" />
                  </div>
                  <h4 className="text-base font-bold text-white font-heading">Ready for Attendee Check-In</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Scan participant QR ticket with mobile camera or enter Registration ID in the input box to authorize badge and swag handover.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: VOLUNTEER ROSTER & DESKS */}
        {/* ============================================================== */}
        {activeTab === 'roster' && (
          <div className="mt-6 space-y-6">
            
            {/* Roster Controls */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Filter Desk:</span>
                <select
                  value={deskFilter}
                  onChange={(e) => setDeskFilter(e.target.value)}
                  className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00E5A8]"
                >
                  <option value="ALL">All Stations (4 Desks)</option>
                  <option value="Alpha">Desk Alpha (Main Gate)</option>
                  <option value="Beta">Desk Beta (Auditorium)</option>
                  <option value="Gamma">Desk Gamma (Hardware Lab)</option>
                  <option value="Delta">Desk Delta (Dining & Cafe)</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddVolunteerOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5A8] to-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,168,0.3)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign New Volunteer</span>
              </button>
            </div>

            {/* Volunteer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredVolunteers.map((vol) => (
                <div 
                  key={vol.id} 
                  className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 hover:border-[#00E5A8]/40 transition-colors backdrop-blur-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Header with desk badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[#00E5A8] border border-emerald-500/30 text-[10px] font-mono font-bold">
                        {vol.desk}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active</span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mt-3">{vol.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{vol.role}</p>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px]">{vol.shift}</span>
                      </div>
                      {vol.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[11px] text-slate-300">{vol.phone}</span>
                        </div>
                      )}
                      {vol.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[11px] truncate max-w-[170px]">{vol.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scans counter */}
                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 text-[11px]">Scanned / Handled:</span>
                    <span className="text-white font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {vol.scansCount || 0} squads
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: LIVE GATE ARRIVALS STREAM */}
        {/* ============================================================== */}
        {activeTab === 'stream' && (
          <div className="mt-6 space-y-4">
            
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00E5A8]" />
                  Real-time Gate Check-In Stream
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Chronological telemetry of participants processed at physical entrance points.
                </p>
              </div>

              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Stream
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E131F]/90">
              <div className="divide-y divide-white/[0.04]">
                {checkinHistory.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">
                    No physical check-in arrivals recorded yet. Use the Fast Check-in terminal to check in squads.
                  </div>
                ) : (
                  checkinHistory.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00E5A8] flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{item.team_name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                              {item.registration_id}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            Verified by: <strong className="text-slate-300">{item.scanned_by || 'Volunteer Desk'}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="w-3 h-3" /> ADMITTED
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Recently'}
                        </div>
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
      {/* ADD VOLUNTEER MODAL */}
      {/* ============================================================== */}
      {isAddVolunteerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0F172A] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-heading">
                Assign Volunteer to Station
              </h3>
              <button 
                onClick={() => setIsAddVolunteerOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVolunteer} className="mt-4 space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newVolData.name}
                  onChange={(e) => setNewVolData({ ...newVolData, name: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5A8]"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assigned Desk / Station</label>
                <select
                  value={newVolData.desk}
                  onChange={(e) => setNewVolData({ ...newVolData, desk: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5A8]"
                >
                  <option value="Desk Alpha (Main Gate)">Desk Alpha (Main Gate)</option>
                  <option value="Desk Beta (Auditorium)">Desk Beta (Auditorium)</option>
                  <option value="Desk Gamma (Hardware Lab)">Desk Gamma (Hardware Lab)</option>
                  <option value="Desk Delta (Dining & Cafe)">Desk Delta (Dining & Cafe)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operational Role</label>
                <input
                  type="text"
                  placeholder="e.g. QR Verification & ID Badges"
                  value={newVolData.role}
                  onChange={(e) => setNewVolData({ ...newVolData, role: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5A8]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Shift Timing</label>
                <select
                  value={newVolData.shift}
                  onChange={(e) => setNewVolData({ ...newVolData, shift: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5A8]"
                >
                  <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                  <option value="Afternoon (12:00 - 18:00)">Afternoon (12:00 - 18:00)</option>
                  <option value="Evening (18:00 - 00:00)">Evening (18:00 - 00:00)</option>
                  <option value="All Day (09:00 - 18:00)">All Day (09:00 - 18:00)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Phone Number (Emergency)</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newVolData.phone}
                  onChange={(e) => setNewVolData({ ...newVolData, phone: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5A8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddVolunteerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5A8] to-cyan-400 text-black font-bold text-xs hover:shadow-[0_0_15px_rgba(0,229,168,0.4)] transition-all"
                >
                  Assign Volunteer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { 
  QrCode, 
  Users, 
  GitBranch, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  Sparkles,
  Trophy,
  Copy,
  Calendar,
  Layers
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ParticipantHub({ 
  registrations, 
  selectedHackathon, 
  onNavigateToExplore 
}) {
  const [submission, setSubmission] = useState({
    title: '',
    repoUrl: '',
    demoUrl: '',
    abstract: ''
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Active pass
  const activePass = (registrations && registrations.length > 0) 
    ? registrations[0] 
    : {
        id: 'BTS26-0089',
        name: 'Alex Johnson',
        email: 'alex@mit.edu',
        team: 'CyberPulse',
        hackathonTitle: 'JUNCTIONX TIRANA',
        status: 'Approved',
        date: 'May 29, 2026',
        qrData: JSON.stringify({ ticket: 'BTS26-0089', event: 'JUNCTIONX TIRANA', team: 'CyberPulse' })
      };

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('https://hackhub.io/team/invite?code=CP-2026-X89');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleSubmitProject = (e) => {
    e.preventDefault();
    if (!submission.title || !submission.repoUrl) return;
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#070B14] py-12 px-4 sm:px-6 lg:px-8 text-slate-100 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hub Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-[#00FFAA] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00FFAA] animate-ping" />
              <span>PARTICIPANT BADGE & TEAM COMMAND</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">
              Participant Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Your digital on-site access credentials, team sync, and project submission station.
            </p>
          </div>

          <button
            onClick={onNavigateToExplore}
            className="px-5 py-2.5 rounded-xl border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-500/10 transition-colors self-start sm:self-auto"
          >
            + Register for Another Hackathon
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Digital QR Pass & Check-In Credential */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0A0E1A] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    EVENT ACCESS TICKET
                  </div>
                  <div className="text-lg font-black text-white font-heading mt-0.5">
                    {activePass.hackathonTitle}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#00FFAA] border border-emerald-500/40 font-bold">
                  {activePass.status}
                </span>
              </div>

              {/* QR Code Container */}
              <div className="w-48 h-48 mx-auto p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <QRCodeSVG 
                  value={activePass.qrData || 'QR-ACCESS-HACKHUB-2026'} 
                  size={168}
                  level="H"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Participant ID:</span>
                  <span className="text-white font-bold">{activePass.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Full Name:</span>
                  <span className="text-white">{activePass.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Registered Team:</span>
                  <span className="text-[#00F5FF] font-semibold">{activePass.team}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Desk Check-in Status:</span>
                  <span className="text-emerald-400 font-bold">Ready for Fast-Track</span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 text-center">
                Scan this at the reception desk to print physical badge & collect lanyard.
              </div>
            </div>

            {/* Team Workspace Box */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00FFAA]" />
                  Team Roster: {activePass.team}
                </h3>
                <span className="text-[10px] font-mono text-slate-400">3 / 4 Members</span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                {[
                  { name: activePass.name, role: 'Team Leader • AI/ML', you: true },
                  { name: 'Sarah Chen', role: 'Fullstack & UI', you: false },
                  { name: 'Marcus Brody', role: 'Backend & Cloud DB', you: false },
                ].map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#0A0E1A] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold">{m.name}</span>
                      {m.you && <span className="ml-2 text-[10px] text-cyan-400">(You)</span>}
                      <div className="text-[10px] text-slate-400">{m.role}</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCopyInvite}
                  className="w-full py-2.5 rounded-xl border border-white/10 bg-[#0A0E1A] hover:bg-white/5 text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedInvite ? 'Invite Link Copied!' : 'Copy Team Teammate Invite Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Project Submission Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-purple-400" />
                    Final Project Submission
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Deadline: 48h from kickoff • Scoring automatically wired to Judge Rubric matrix
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Stage 4
                </span>
              </div>

              {submittedSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FFAA]" />
                  <span>Project successfully registered for Jury evaluation! Good luck!</span>
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NexusFlow AI Assistant"
                    value={submission.title}
                    onChange={(e) => setSubmission({ ...submission, title: e.target.value })}
                    className="w-full bg-[#0A0E1A] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1.5 font-medium">GitHub Repository URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/..."
                      value={submission.repoUrl}
                      onChange={(e) => setSubmission({ ...submission, repoUrl: e.target.value })}
                      className="w-full bg-[#0A0E1A] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1.5 font-medium">Live Demo / Video Pitch URL</label>
                    <input
                      type="url"
                      placeholder="https://youtu.be/... or https://myapp.dev"
                      value={submission.demoUrl}
                      onChange={(e) => setSubmission({ ...submission, demoUrl: e.target.value })}
                      className="w-full bg-[#0A0E1A] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium">Abstract & Architecture Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your solution architecture, AI models used, challenges solved, and real-world impact..."
                    value={submission.abstract}
                    onChange={(e) => setSubmission({ ...submission, abstract: e.target.value })}
                    className="w-full bg-[#0A0E1A] border border-white/15 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Will be synced to Google Sheets Submissions tab
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold font-heading uppercase text-xs bg-gradient-to-r from-[#5A00FF] to-[#0066FF] hover:shadow-[0_0_20px_rgba(90,0,255,0.5)] text-white transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit to Jury
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

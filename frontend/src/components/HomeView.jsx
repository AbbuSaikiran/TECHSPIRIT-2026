import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Activity, 
  Users, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Cpu, 
  Terminal, 
  Flame, 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  CATEGORIES, 
  INITIAL_HACKATHONS, 
  LIVE_REGISTRATIONS_STREAM, 
  TEAM_NODES, 
  TEAM_EDGES 
} from '../mockData';

export default function HomeView({ onSelectHackathon, onNavigateToExplore, onNavigateToAdmin }) {
  const [activeNode, setActiveNode] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Featured hackathons for quick cards
  const featuredHackathons = INITIAL_HACKATHONS.filter(h => h.featured);

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-slate-100">
      
      {/* Background Neon Glow Orbs & Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#0066FF]/20 via-[#5A00FF]/15 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] -right-40 w-[600px] h-[600px] bg-[#00FFAA]/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none -z-10" />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION (Matches Reference Image 1: "Your hackathon, orchestrated.") */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Pulsing Mission Control Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 backdrop-blur-md mb-8 animate-pulse-glow">
          <span className="w-2 h-2 rounded-full bg-[#00FFAA] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-[#00FFAA] -ml-4" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
            ● MISSION CONTROL — LIVE
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight font-heading leading-[1.08] max-w-5xl mx-auto">
          Your hackathon, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#38BDF8] to-[#0066FF] drop-shadow-[0_0_35px_rgba(0,102,255,0.45)]">
            orchestrated.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Registration, team matching, live leaderboards, and judging rubrics — wired into a single command center that runs at 2 AM when you finally sleep.
        </p>

        {/* Dual CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNavigateToAdmin}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide bg-[#38BDF8] text-slate-950 hover:bg-[#00F5FF] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2 font-heading"
          >
            Launch Your First Hackathon
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToExplore}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm tracking-wide bg-[#111827]/80 text-white border border-white/15 hover:border-[#0066FF]/60 hover:bg-[#111827] transition-all duration-300 flex items-center justify-center gap-2"
          >
            See How We Beat the Old Way
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE LIVE MISSION CONTROL PREVIEW CARDS (Exact match to Image 1) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Card 1: LIVE REGISTRATIONS */}
          <div className="bg-[#0B1329]/80 rounded-2xl p-5 border border-cyan-500/25 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FFAA] animate-pulse" />
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-cyan-300">
                  LIVE REGISTRATIONS
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                ● 1,254
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {LIVE_REGISTRATIONS_STREAM.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.affiliation} • {item.role}</div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider border ${
                    item.status === 'REGISTERED' 
                      ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' 
                      : 'border-emerald-500/40 text-[#00FFAA] bg-emerald-500/10'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Syncing with Google Sheets</span>
              <span className="text-[#00FFAA] flex items-center gap-1 font-semibold">
                <Database className="w-3 h-3" /> Live Hook
              </span>
            </div>
          </div>

          {/* Card 2: TEAM FORMATION NETWORK GRAPH */}
          <div className="bg-[#0B1329]/80 rounded-2xl p-5 border border-cyan-500/25 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-cyan-300">
                TEAM FORMATION
              </span>
              <span className="text-xs font-mono text-slate-300">
                24 teams formed
              </span>
            </div>

            {/* Interactive SVG Nodes Network */}
            <div className="relative h-44 my-2 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Edges */}
                {TEAM_EDGES.map((edge, idx) => {
                  const fromNode = TEAM_NODES.find(n => n.id === edge.from);
                  const toNode = TEAM_NODES.find(n => n.id === edge.to);
                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#0066FF"
                      strokeWidth="0.8"
                      strokeDasharray="2,2"
                      opacity="0.6"
                    />
                  );
                })}
                {/* Nodes */}
                {TEAM_NODES.map((node) => (
                  <g 
                    key={node.id} 
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setActiveNode(node)}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="4.5"
                      fill="#0B1329"
                      stroke={activeNode?.id === node.id ? "#00FFAA" : "#38BDF8"}
                      strokeWidth="1.5"
                      className="transition-all duration-300"
                    />
                    <text
                      x={node.x}
                      y={node.y + 1.2}
                      textAnchor="middle"
                      fontSize="2.5"
                      fill="#FFFFFF"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {node.id}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Dynamic node hover tooltip */}
              {activeNode && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#111827] border border-[#00FFAA]/50 px-3 py-1 rounded-lg text-center shadow-lg pointer-events-none">
                  <div className="text-[11px] font-bold text-white">Team {activeNode.name}</div>
                  <div className="text-[9px] text-[#00FFAA] font-mono">{activeNode.role} Match Active</div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Auto-balancing skills</span>
              <span className="text-cyan-400">Mesh AI Engine</span>
            </div>
          </div>

          {/* Card 3: JUDGING RUBRIC & SCOREBARS */}
          <div className="bg-[#0B1329]/80 rounded-2xl p-5 border border-cyan-500/25 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-cyan-300">
                JUDGING RUBRIC
              </span>
              <span className="text-xs font-mono font-bold text-white bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/40">
                Team Nexus
              </span>
            </div>

            <div className="space-y-4 my-2">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">Innovation</span>
                  <span className="font-mono text-cyan-300 font-bold">9.2 / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00F5FF] rounded-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">Execution</span>
                  <span className="font-mono text-cyan-300 font-bold">8.7 / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#38BDF8] rounded-full w-[87%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">Impact</span>
                  <span className="font-mono text-[#00FFAA] font-bold">9.5 / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00FFAA] rounded-full w-[95%]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Weighted consensus</span>
              <span className="text-[#00FFAA] font-semibold">9.13 Composite</span>
            </div>
          </div>

        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: BROWSE BY DOMAIN (Specification Section 3) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-12 border-y border-white/[0.06] bg-[#0E1322]/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00FFAA] font-bold">
                EXPLORE BY SPECIALIZATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                Browse By Domain
              </h2>
            </div>
            <button 
              onClick={onNavigateToExplore}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00F5FF] hover:underline"
            >
              Open Full EventRadar View <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  onNavigateToExplore();
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 flex items-center gap-2 ${
                  cat.border
                } bg-[#111827]/80 hover:bg-[#111827] hover:scale-105 hover:${cat.glow || 'shadow-lg'}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-white">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: FEATURED HACKATHONS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              FEATURED COMPETITIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1">
              Top Tier Hackathons
            </h2>
          </div>
          <button
            onClick={onNavigateToExplore}
            className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-white px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#0066FF]/60 hover:text-[#00F5FF] transition-all"
          >
            View all 24 events →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              onClick={() => onSelectHackathon(hackathon)}
              className="bg-glass-card rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${hackathon.badgeColor}`}>
                    {hackathon.categoryLabel}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {hackathon.status}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white font-heading group-hover:text-[#00F5FF] transition-colors">
                  {hackathon.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {hackathon.tagline}
                </p>

                <div className="mt-5 space-y-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>{hackathon.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00FFAA]" />
                    <span>{hackathon.venue || hackathon.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 font-semibold">{hackathon.prizePool}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Team: {hackathon.teamSize}
                </span>
                <span className="text-xs font-bold text-[#00F5FF] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-heading">
                  View Details ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: HOW IT WORKS (Specification Section 3: Discover → Register → Build → Submit → Win) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 border-t border-white/[0.06] bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono text-[#00FFAA] uppercase tracking-widest font-bold">
            THE HACKATHON PROTOCOL
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading mt-2">
            How HackHub Powers Creators
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            From discovering high-impact problems to pitching before world-class venture judges.
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
            {[
              { step: '01', title: 'Discover', desc: 'Scan AI-curated hackathons with domain filters, prize alerts and schedule sync.' },
              { step: '02', title: 'Register', desc: 'Submit custom team forms in under 60 seconds with instant digital entry pass.' },
              { step: '03', title: 'Build', desc: 'Collaborate in team hubs with mentor checkpoints and live developer announcements.' },
              { step: '04', title: 'Submit', desc: 'Push Git repositories, live demo links, and video pitch walkthroughs.' },
              { step: '05', title: 'Win', desc: 'Live scoring matrix, fair rubric consensus, and Golden Ticket awards.' },
            ].map((st, i) => (
              <div 
                key={i}
                className="p-5 rounded-2xl bg-[#111827]/70 border border-white/[0.08] hover:border-[#00FFAA]/40 transition-all duration-300"
              >
                <div className="text-2xl font-mono font-black text-slate-600 mb-2 font-heading">
                  {st.step}
                </div>
                <div className="text-lg font-bold text-white font-heading">
                  {st.title}
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: FOR ORGANISERS BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-[#0066FF]/30 bg-gradient-to-r from-[#0B132B] via-[#111827] to-[#12072B] shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold tracking-widest text-[#00FFAA] uppercase">
                ORGANISERS & UNIVERSITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-2">
                Launch your hackathon with a no-code form builder & live sheets sync.
              </h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Empower your student body or engineering organization. Create custom registration questions, approve applicants, assign judges with rubrics, and export participant data in 1 click.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onNavigateToAdmin}
                className="px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-[#00FFAA] text-black hover:bg-[#00F5FF] hover:shadow-[0_0_25px_rgba(0,255,170,0.5)] transition-all font-heading"
              >
                Launch In 3 Minutes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FFAA]" />
            <span>HackHub Production Engine • Connected to FastAPI & Sheets Database</span>
          </div>
          <div className="flex gap-6">
            <span className="text-slate-400">© 2026 HackHub Inc.</span>
            <button onClick={onNavigateToExplore} className="hover:text-white transition-colors">EventRadar</button>
            <button onClick={onNavigateToAdmin} className="hover:text-white transition-colors">Admin Dashboard</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

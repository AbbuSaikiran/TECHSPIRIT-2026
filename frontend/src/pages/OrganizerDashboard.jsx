import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  FileText, 
  GitBranch, 
  BarChart2, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Download, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PRIYA_ORGANIZER } from '../mockData';

export default function OrganizerDashboard({ onNavigateToFormBuilder, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E0E0E0] flex flex-col md:flex-row text-left">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR WITH OFFICIAL TECHSPIRIT LOGO */}
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
                ORGANIZER CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button className="w-full px-3 py-2.5 rounded-xl bg-[#1E232B] text-white border-l-4 border-[#6366F1] flex items-center gap-3 font-bold">
              <LayoutDashboard className="w-4 h-4 text-[#6366F1]" />
              <span>Dashboard</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              <span>My Events</span>
            </button>

            <button 
              onClick={onNavigateToFormBuilder}
              className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3"
            >
              <Plus className="w-4 h-4 text-[#00E5A8]" />
              <span>Create Event</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Registrations</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <GitBranch className="w-4 h-4" />
              <span>Submissions</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <BarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Team</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-mono text-rose-400 hover:text-rose-300"
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
              placeholder="Search hackathons, applicants..."
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#6366F1] absolute top-1.5 right-1.5" />
            </button>

            {/* Organizer Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#BB5CF6] to-[#6366F1] text-white font-bold flex items-center justify-center text-xs">
                {PRIYA_ORGANIZER.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-none">{PRIYA_ORGANIZER.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{PRIYA_ORGANIZER.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Event Overview
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time metrics across all your hosted hackathons
              </p>
            </div>

            <button
              onClick={onNavigateToFormBuilder}
              className="px-4 py-2.5 rounded-xl font-bold font-heading text-xs uppercase bg-[#6366F1] hover:bg-[#818CF8] text-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event & Form</span>
            </button>
          </div>

          {/* 4 STAT METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-cyan-400 font-heading">
                {PRIYA_ORGANIZER.stats.totalEvents}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Total Events
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-[#00E5A8] font-heading">
                {PRIYA_ORGANIZER.stats.registrations}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Registrations
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-[#BB5CF6] font-heading">
                {PRIYA_ORGANIZER.stats.submissions}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Submissions
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-amber-400 font-heading">
                {PRIYA_ORGANIZER.stats.awardsGiven}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Awards Given
              </div>
            </div>
          </div>

          {/* REGISTRATIONS TREND BAR CHART & RECENT REGISTRATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Card: Registrations Trend Bar Chart */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Registrations Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monthly participant application volume
                </p>
              </div>

              {/* Custom SVG Glowing Bar Chart */}
              <div className="my-6 relative h-60">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F5FF" />
                      <stop offset="60%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#312E81" />
                    </linearGradient>
                  </defs>

                  {[40, 80, 120, 160].map((y, i) => (
                    <line key={i} x1="30" y1={y} x2="480" y2={y} stroke="#1F2937" strokeDasharray="3 3" />
                  ))}

                  {PRIYA_ORGANIZER.registrationTrend.map((item, idx) => {
                    const barWidth = 36;
                    const x = 50 + idx * 72;
                    const height = (item.registrations / 600) * 140;
                    const y = 170 - height;
                    const isAug = item.month === 'Aug';

                    return (
                      <g key={idx}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          rx="6"
                          fill="url(#barGrad)"
                          className="hover:opacity-90 transition-opacity cursor-pointer"
                        />
                        <text
                          x={x + barWidth / 2}
                          y="190"
                          textAnchor="middle"
                          fill="#94A3B8"
                          fontSize="10"
                          fontFamily="JetBrains Mono"
                        >
                          {item.month}
                        </text>

                        {isAug && (
                          <g>
                            <rect
                              x={x - 24}
                              y={y - 28}
                              width="84"
                              height="22"
                              rx="6"
                              fill="#1E1B4B"
                              stroke="#6366F1"
                              strokeWidth="1"
                            />
                            <text
                              x={x + barWidth / 2}
                              y={y - 14}
                              textAnchor="middle"
                              fill="#00F5FF"
                              fontSize="8"
                              fontFamily="JetBrains Mono"
                              fontWeight="bold"
                            >
                              Aug: 320
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Google Sheets Sync: Active</span>
                <span className="text-[#00E5A8] font-bold">+28% this month</span>
              </div>
            </div>

            {/* Right Card: Recent Registrations Feed */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-heading">
                  Recent Registrations
                </h3>
                <span className="text-xs font-mono text-[#6366F1] cursor-pointer hover:underline">
                  View All
                </span>
              </div>

              <div className="space-y-4 my-2">
                {PRIYA_ORGANIZER.recentRegistrations.map(reg => (
                  <div key={reg.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {reg.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{reg.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{reg.event}</div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                      {reg.time}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between text-xs font-mono text-slate-400">
                <span>Total Live: 1,254</span>
                <span className="text-[#00E5A8]">Auto-Approved</span>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}

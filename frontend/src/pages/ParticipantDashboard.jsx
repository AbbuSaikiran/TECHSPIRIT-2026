import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { ROHAN_USER } from '../mockData';

export default function ParticipantDashboard({ onOpenScanner, onSelectEvent, onLogout }) {
  const [filterTab, setFilterTab] = useState('all');

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
                PARTICIPANT HUB
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
              <Layers className="w-4 h-4" />
              <span>My Hackathons</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>My Teams</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <GitBranch className="w-4 h-4" />
              <span>Submissions</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>

            <button className="w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Profile</span>
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#00E5A8] text-white font-bold flex items-center justify-center text-xs">
                {ROHAN_USER.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-none">{ROHAN_USER.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ROHAN_USER.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Welcome back, Rohan!
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Keep building, keep innovating. TECHSPIRIT 2026 Season is Live.
              </p>
            </div>

            <button
              onClick={onOpenScanner}
              className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono text-[#00E5A8] flex items-center gap-2 self-start sm:self-auto transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Event QR Entry Ticket</span>
            </button>
          </div>

          {/* 4 STAT METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-cyan-400 font-heading">
                {ROHAN_USER.stats.registered}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Registered
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-amber-400 font-heading">
                {ROHAN_USER.stats.ongoing}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Ongoing
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-[#00E5A8] font-heading">
                {ROHAN_USER.stats.completed}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Completed
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between">
              <div className="text-3xl font-black text-[#BB5CF6] font-heading">
                {ROHAN_USER.stats.certificates}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Certificates
              </div>
            </div>
          </div>

          {/* MY HACKATHONS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-heading">
                My Hackathons
              </h2>
              <span className="text-xs font-mono text-[#6366F1] cursor-pointer hover:underline">
                View All →
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 text-xs font-semibold">
              {['all', 'ongoing', 'upcoming', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    filterTab === tab
                      ? 'bg-[#6366F1] text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Hackathon Cards in Dashboard */}
            <div className="space-y-3 pt-2">
              
              {/* Event 1: AI Innovation Challenge */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-900 to-indigo-900 border border-white/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                      AI Innovation Challenge
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Oct 12 - Oct 14, 2024 • Team: Tech Titans
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-[#00E5A8] border border-emerald-500/40 font-bold">
                    Registered
                  </span>
                  <button 
                    onClick={() => onSelectEvent && onSelectEvent('ai-innovation-challenge')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Event 2: Web3 Builders */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-900 to-cyan-900 border border-white/10 flex items-center justify-center shrink-0">
                    <GitBranch className="w-6 h-6 text-[#00E5A8]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                      Web3 Builders
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Nov 15 - Nov 17, 2024 • Solo Developer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                    Ongoing
                  </span>
                  <button 
                    onClick={() => alert('Project submission gate opened!')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#BB5CF6] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] text-xs font-bold text-white transition-all font-heading"
                  >
                    Submit Project
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}

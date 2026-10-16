import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  QrCode, 
  LayoutDashboard, 
  User, 
  ShieldCheck, 
  ChevronDown,
  Layers,
  Compass,
  Flame,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, user, onOpenLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Official TECHSPIRIT Logo & Brand */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] p-[2px] shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform duration-300">
            <img 
              src="/logo.jpeg" 
              alt="TECHSPIRIT Logo" 
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6]">SPIRIT</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded border border-cyan-400/40 text-cyan-300 bg-cyan-950/40 hidden sm:inline-block">
                2026
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider hidden sm:block -mt-0.5">
              NATIONAL LEVEL HACKATHON
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => setCurrentView('explore')}
            className={`hover:text-white transition-colors ${currentView === 'explore' ? 'text-white font-bold' : ''}`}
          >
            Explore
          </button>
          <button 
            onClick={() => setCurrentView('explore')}
            className={`hover:text-white transition-colors ${currentView === 'explore' ? 'text-white font-bold' : ''}`}
          >
            Hackathons
          </button>
          <button 
            onClick={() => setCurrentView('organizer')}
            className={`hover:text-white transition-colors ${currentView === 'organizer' ? 'text-white font-bold' : ''}`}
          >
            For Organizers
          </button>
          <button 
            onClick={() => setCurrentView('details')}
            className={`hover:text-white transition-colors ${currentView === 'details' ? 'text-white font-bold' : ''}`}
          >
            Tracks & Rules
          </button>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Quick Search trigger */}
          <button 
            onClick={() => setCurrentView('explore')}
            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Search Hackathons"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dedicated QR Scanner Navigation Button */}
          <button
            onClick={() => setCurrentView('scanner')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              currentView === 'scanner'
                ? 'bg-[#00E5A8] text-black border-[#00E5A8] shadow-[0_0_15px_rgba(0,229,168,0.5)]'
                : 'border-emerald-500/30 text-[#00E5A8] bg-emerald-500/10 hover:bg-emerald-500/20'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Scanner</span>
          </button>

          {/* View / Persona dropdown switch */}
          <div className="relative group">
            <button className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2 hover:border-[#6366F1]/50 transition-colors">
              <span>View:</span>
              <span className="text-white font-bold capitalize">{currentView}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <div className="absolute right-0 mt-2 w-52 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-1.5 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase">
                Pages from HackVerse Design
              </div>
              <button 
                onClick={() => setCurrentView('home')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-slate-200"
              >
                <Flame className="w-3.5 h-3.5 text-[#6366F1]" /> Home Landing
              </button>
              <button 
                onClick={() => setCurrentView('explore')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-slate-200"
              >
                <Compass className="w-3.5 h-3.5 text-[#00E5A8]" /> Discover Hackathons
              </button>
              <button 
                onClick={() => setCurrentView('details')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-slate-200"
              >
                <Layers className="w-3.5 h-3.5 text-[#BB5CF6]" /> Event Details
              </button>
              <button 
                onClick={() => setCurrentView('participant')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-slate-200"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" /> Participant Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('organizer')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-slate-200"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" /> Organizer Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('form-builder')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Create Event / Form Builder
              </button>
              <button 
                onClick={() => setCurrentView('scanner')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-[#00E5A8] font-bold"
              >
                <QrCode className="w-3.5 h-3.5" /> Scan QR Code
              </button>
            </div>
          </div>

          {/* Auth Action Buttons */}
          <button 
            onClick={() => setCurrentView('login')}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => setCurrentView('login')}
            className="px-4 py-2 rounded-xl text-xs font-bold font-heading bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setCurrentView('scanner')}
            className="p-2 rounded-lg bg-emerald-500/10 text-[#00E5A8] border border-emerald-500/30"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F172A] border-b border-white/10 px-4 py-4 space-y-2">
          <button onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Home</button>
          <button onClick={() => { setCurrentView('explore'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Discover Hackathons</button>
          <button onClick={() => { setCurrentView('details'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Event Details</button>
          <button onClick={() => { setCurrentView('participant'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Participant Dashboard</button>
          <button onClick={() => { setCurrentView('organizer'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Organizer Dashboard</button>
          <button onClick={() => { setCurrentView('form-builder'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Form Builder</button>
          <button onClick={() => { setCurrentView('scanner'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-[#00E5A8] font-bold">QR Check-in Scanner</button>
          <button onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-[#6366F1] font-bold">Login / Sign Up</button>
        </div>
      )}
    </header>
  );
}

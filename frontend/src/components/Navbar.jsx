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
  X,
  LogOut,
  ShieldAlert,
  Users
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, user, onOpenLogin, onLogout }) {
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
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button 
            onClick={() => setCurrentView('explore')}
            className={`hover:text-white transition-colors ${currentView === 'explore' ? 'text-white font-bold' : ''}`}
          >
            Hackathons
          </button>
          <button 
            onClick={() => setCurrentView('details')}
            className={`hover:text-white transition-colors ${currentView === 'details' ? 'text-white font-bold' : ''}`}
          >
            Tracks & Rules
          </button>
          <button 
            onClick={() => setCurrentView('organizer')}
            className={`hover:text-white transition-colors ${currentView === 'organizer' ? 'text-white font-bold' : ''}`}
          >
            For Organizers
          </button>
          <button 
            onClick={() => setCurrentView('admin')}
            className={`hover:text-[#00F5FF] transition-colors flex items-center gap-1.5 ${
              currentView === 'admin' ? 'text-[#00F5FF] font-bold' : 'text-slate-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>
          <button 
            onClick={() => setCurrentView('volunteers')}
            className={`hover:text-[#00E5A8] transition-colors flex items-center gap-1.5 ${
              currentView === 'volunteers' ? 'text-[#00E5A8] font-bold' : 'text-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#00E5A8]" />
            <span>Volunteers</span>
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

          {/* View / Persona dropdown switch */}
          <div className="relative group">
            <button className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2 hover:border-[#6366F1]/50 transition-colors">
              <span>View:</span>
              <span className="text-white font-bold capitalize">{currentView}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-1.5 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase">
                Pages & Portals
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
                <Layers className="w-3.5 h-3.5 text-[#BB5CF6]" /> Event Details & Rules
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
                onClick={() => setCurrentView('admin')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-amber-300 font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Admin Command Center
              </button>
              <button 
                onClick={() => setCurrentView('volunteers')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-[#00E5A8] font-semibold"
              >
                <Users className="w-3.5 h-3.5 text-[#00E5A8]" /> Volunteers & Ops Desk
              </button>
              <button 
                onClick={() => setCurrentView('form-builder')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Custom Form Builder
              </button>
            </div>
          </div>

          {/* Auth Action / User Profile */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <button 
                onClick={() => setCurrentView((user.role === 'super_admin' || user.role === 'organizer' || user.role === 'event_admin') ? 'organizer' : 'participant')}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group cursor-pointer"
                title={`Logged in as ${user.name} (${user.role || 'User'})`}
              >
                {user.avatar && typeof user.avatar === 'string' && user.avatar.startsWith('http') ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-[#6366F1]" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#BB5CF6] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.avatar || (user.name ? user.name[0] : 'U')}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white max-w-[110px] truncate">
                  {user.name}
                </span>
                {(user.role === 'super_admin' || user.role === 'event_admin') && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ADMIN
                  </span>
                )}
              </button>

              {/* Dedicated Logout Button */}
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm hover:shadow-[0_0_12px_rgba(244,63,94,0.35)] cursor-pointer"
                title="Log out of account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('login')}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 rounded-xl text-xs font-bold font-heading bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
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
          <button onClick={() => { setCurrentView('details'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Event Details & Rules</button>
          <button onClick={() => { setCurrentView('participant'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Participant Dashboard</button>
          <button onClick={() => { setCurrentView('organizer'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Organizer Dashboard</button>
          <button onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-amber-300 font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Admin Command Center
          </button>
          <button onClick={() => { setCurrentView('volunteers'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-[#00E5A8] font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00E5A8]" /> Volunteers & Ops Desk
          </button>
          <button onClick={() => { setCurrentView('form-builder'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-slate-200">Form Builder</button>
          
          {user ? (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300 truncate max-w-[180px]">
                Signed in as <strong className="text-white">{user.name}</strong>
              </span>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-mono flex items-center gap-1.5 border border-rose-500/30"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" /> Logout
              </button>
            </div>
          ) : (
            <button onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm text-[#6366F1] font-bold">Login / Sign Up</button>
          )}
        </div>
      )}
    </header>
  );
}

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Calendar, 
  Users, 
  Globe, 
  Zap,
  Flame,
  Layers,
  Heart
} from 'lucide-react';
import { HACKVERSE_EVENTS } from '../mockData';

export default function Home({ onSelectHackathon, onNavigateToExplore, onNavigateToOrganizer }) {
  const featured = HACKVERSE_EVENTS.slice(0, 3);

  return (
    <div className="relative overflow-hidden bg-[#0A0A0F] text-[#E0E0E0]">
      
      {/* Background Ambient Glows & Grid */}
      <div className="absolute top-0 right-1/4 w-[750px] h-[550px] bg-gradient-to-b from-[#00F5FF]/20 via-[#6366F1]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[#BB5CF6]/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none -z-10" />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION WITH TECHSPIRIT LOGO & BRANDING */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Pill Badge with Logo Motto */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                IDEAS  /  CODE  /  IMPACT • NATIONAL LEVEL HACKATHON
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading leading-[1.08] text-white">
              Turn Your Ideas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] drop-shadow-[0_0_35px_rgba(0,245,255,0.45)]">
                Into Impact
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
              Discover hackathons, build with global innovators, and create solutions for a better tomorrow. Powered by TECHSPIRIT engineering engine.
            </p>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onNavigateToExplore}
                className="px-8 py-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-heading"
              >
                Explore Hackathons
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToOrganizer}
                className="px-8 py-4 rounded-xl font-semibold text-sm tracking-wide bg-[#111827]/80 text-white border border-white/15 hover:border-[#00F5FF]/60 hover:bg-[#111827] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Host a Hackathon <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-heading">500+</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Hackathons</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-heading">50K+</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Innovators</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-heading">200+</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Institutes</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#00E5A8] font-heading">₹2Cr+</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Total Prizes</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Holographic Globe Featuring Official TECHSPIRIT Logo */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-80 sm:w-96 aspect-square flex items-center justify-center">
              
              {/* Outer Orbit Ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-orbit" />
              
              {/* Slanted Planetary Ring with TECHSPIRIT motto: IDEAS / CODE / IMPACT */}
              <div className="absolute w-[120%] h-36 rounded-full border-2 border-dashed border-[#6366F1]/50 -rotate-[22deg] flex items-center justify-between px-6 pointer-events-none animate-pulse">
                <span className="text-[9px] font-mono tracking-widest text-[#00F5FF] font-bold uppercase bg-[#0A0A0F] px-1.5 border border-cyan-500/30 rounded">IDEAS</span>
                <span className="text-[9px] font-mono tracking-widest text-[#BB5CF6] font-bold uppercase bg-[#0A0A0F] px-1.5 border border-purple-500/30 rounded">CODE</span>
                <span className="text-[9px] font-mono tracking-widest text-[#00E5A8] font-bold uppercase bg-[#0A0A0F] px-1.5 border border-emerald-500/30 rounded">IMPACT</span>
              </div>

              {/* Glowing Core Sphere with Official Logo */}
              <div className="w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-[#0A0A0F] via-[#111827] to-[#1E1B4B] border-2 border-cyan-400/40 shadow-[0_0_80px_rgba(0,245,255,0.35)] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-radar-grid opacity-40" />
                
                {/* Official Logo Display */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-[2px] bg-gradient-to-tr from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] shadow-[0_0_35px_rgba(99,102,241,0.6)] mb-2">
                    <img
                      src="/logo.jpeg"
                      alt="TECHSPIRIT Official Emblem"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <div className="text-[10px] font-mono uppercase text-cyan-300 font-bold tracking-widest">
                    NATIONAL LEVEL
                  </div>
                  <div className="text-lg font-black text-white font-heading">
                    TECHSPIRIT
                  </div>
                </div>
              </div>

              {/* Orbiting Satellite Dots */}
              <div className="absolute top-4 left-10 w-3 h-3 rounded-full bg-[#00F5FF] shadow-[0_0_15px_#00F5FF] animate-ping" />
              <div className="absolute bottom-6 right-8 w-2.5 h-2.5 rounded-full bg-[#BB5CF6] shadow-[0_0_15px_#BB5CF6]" />
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURED HACKATHONS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Featured Hackathons
            </h2>
            <p className="text-xs text-slate-400 mt-1">Hand-picked premier events closing soon for registrations</p>
          </div>
          <button 
            onClick={onNavigateToExplore}
            className="text-xs font-mono font-bold text-[#6366F1] hover:text-[#00F5FF] flex items-center gap-1.5 transition-colors"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((evt, idx) => (
            <div
              key={evt.id}
              onClick={() => onSelectHackathon(evt)}
              className="bg-[#111827]/75 rounded-2xl p-5 border border-white/10 hover:border-[#6366F1]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xl backdrop-blur-md"
            >
              <div>
                {/* Banner Thumbnail representation with badge */}
                <div className="h-36 rounded-xl bg-gradient-to-tr from-purple-950 via-[#1E1B4B] to-slate-900 border border-white/10 p-3 flex items-start justify-between relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-tech-grid opacity-30" />
                  <span className="relative z-10 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Featured
                  </span>
                  <button className="relative z-10 p-1.5 rounded-full bg-black/40 text-slate-400 hover:text-rose-400">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                  {evt.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                  <Calendar className="w-3 h-3 text-[#6366F1]" />
                  <span>{evt.dates}</span>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    {evt.categoryBadge}
                  </span>
                  <span className="text-sm font-black text-[#00E5A8] font-heading">
                    {evt.prizePool}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">{evt.mode} Format</span>
                <span className="font-bold text-[#6366F1] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-heading">
                  Register Now ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="TECHSPIRIT" className="w-6 h-6 rounded-md object-cover" />
            <span>TECHSPIRIT 2026 • National Level Hackathon • IDEAS / CODE / IMPACT</span>
          </div>
          <div className="flex gap-6">
            <span>© 2026 TECHSPIRIT</span>
            <button onClick={onNavigateToExplore} className="hover:text-white">Discover</button>
            <button onClick={onNavigateToOrganizer} className="hover:text-white">Organizers</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

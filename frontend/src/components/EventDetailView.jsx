import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Flame,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function EventDetailView({ hackathon, onOpenRegisterModal }) {
  // Real-time ticking countdown calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 35,
    hours: 22,
    minutes: 30,
    seconds: 27
  });

  const [activeTab, setActiveTab] = useState('tracks');

  useEffect(() => {
    const target = hackathon?.countdownTarget ? new Date(hackathon.countdownTarget).getTime() : Date.now() + 35 * 86400000;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [hackathon]);

  if (!hackathon) return null;

  return (
    <div className="min-h-screen bg-[#07050E] text-slate-100 relative overflow-hidden">
      
      {/* Background Cyberpunk Ambient Glows */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-60 left-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION (Exact Match to Reference Image 3: JunctionX Tirana) */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        
        {/* Top Edition Meta Banner */}
        <div className="text-xs font-mono tracking-widest text-cyan-400 font-bold mb-4 flex items-center gap-2">
          <span>///</span>
          <span>{hackathon.dates.toUpperCase()} — {hackathon.city.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Glitch Title, Subtext, CTAs, and Countdown */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Chromatic Glitch Neon Display Title */}
            <div className="font-heading font-black tracking-tighter">
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white glitch-text drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                data-text={hackathon.title}
              >
                {hackathon.title.split(' ')[0]}
              </h1>
              {hackathon.title.split(' ').slice(1).length > 0 && (
                <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#FF007F] to-[#A855F7] drop-shadow-[0_0_30px_rgba(255,0,127,0.5)]">
                  {hackathon.title.split(' ').slice(1).join(' ')}
                </div>
              )}
            </div>

            {/* Description Lines */}
            <p className="text-lg sm:text-xl text-slate-200 font-semibold leading-relaxed">
              {hackathon.tagline}
            </p>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              {hackathon.subtext || '48 hours. 600+ hackers. Top prize, challenge prizes & a Golden Ticket to Helsinki.'}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenRegisterModal}
                className="px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-[#FF007F] via-[#A855F7] to-[#0066FF] text-white hover:shadow-[0_0_35px_rgba(255,0,127,0.6)] hover:scale-105 transition-all duration-300 font-heading"
              >
                APPLY NOW — OPEN
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('event-content-tabs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-transparent text-white border border-[#00F5FF]/50 hover:bg-[#00F5FF]/10 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all font-heading"
              >
                LEARN MORE
              </button>
            </div>

            <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
              APPLICATION LINK OPEN — FORM GENERATED VIA NO-CODE BUILDER
            </div>

            {/* --------------------------------------------------------- */}
            {/* LIVE NEON SEGMENTED COUNTDOWN TIMER (Exact UI from Image 3) */}
            {/* --------------------------------------------------------- */}
            <div className="mt-8 pt-4">
              <div className="inline-block p-4 sm:p-5 rounded-2xl bg-[#110A1E]/80 border border-[#FF007F]/40 shadow-[0_0_30px_rgba(255,0,127,0.25)] backdrop-blur-xl">
                <div className="flex items-center gap-3 sm:gap-6 font-mono text-center">
                  
                  {/* Days */}
                  <div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FF007F] drop-shadow-[0_0_12px_rgba(255,0,127,0.8)]">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest mt-1">
                      DAYS
                    </div>
                  </div>

                  <span className="text-2xl sm:text-3xl font-black text-[#FF007F]/60">:</span>

                  {/* Hours */}
                  <div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00F5FF] drop-shadow-[0_0_12px_rgba(0,245,255,0.8)]">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest mt-1">
                      HOURS
                    </div>
                  </div>

                  <span className="text-2xl sm:text-3xl font-black text-[#00F5FF]/60">:</span>

                  {/* Minutes */}
                  <div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FF007F] drop-shadow-[0_0_12px_rgba(255,0,127,0.8)]">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest mt-1">
                      MINUTES
                    </div>
                  </div>

                  <span className="text-2xl sm:text-3xl font-black text-[#FF007F]/60">:</span>

                  {/* Seconds */}
                  <div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00F5FF] drop-shadow-[0_0_12px_rgba(0,245,255,0.8)] animate-pulse">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest mt-1">
                      SECONDS
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Cybernetic 3D Geometric Low-Poly Illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl p-6 bg-gradient-to-tr from-[#12072B] via-[#0E071A] to-[#0A0512] border border-fuchsia-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col items-center justify-center text-center">
              
              {/* Decorative Cyber Grid & Polyhedral Motif */}
              <div className="absolute inset-0 bg-radar-grid opacity-30" />
              <div className="w-48 h-48 rounded-full border border-[#00F5FF]/40 animate-radar absolute opacity-40 pointer-events-none" />
              <div className="w-64 h-64 rounded-full border border-[#FF007F]/30 absolute opacity-30 pointer-events-none" />

              {/* Center Poly Cyborg Symbol */}
              <div className="relative z-10">
                <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-[#FF007F] via-[#5A00FF] to-[#00F5FF] p-[2px] shadow-[0_0_40px_rgba(255,0,127,0.5)]">
                  <div className="w-full h-full bg-[#07050E] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-14 h-14 text-white animate-pulse" />
                  </div>
                </div>

                <div className="mt-6 font-heading font-black text-2xl text-white tracking-wide">
                  CYBERNETIC MATRIX
                </div>
                <div className="text-xs font-mono text-cyan-300 mt-1">
                  600+ Verified Hackers • Global Jury
                </div>

                <div className="mt-6 flex justify-center gap-2 text-[10px] font-mono">
                  <span className="px-2.5 py-1 rounded bg-[#00FFAA]/10 border border-[#00FFAA]/30 text-[#00FFAA]">
                    ✓ Google Sheets Live Sync
                  </span>
                  <span className="px-2.5 py-1 rounded bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300">
                    ✓ Instant QR Pass
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Ticker Strip (From Image 3 footer) */}
        <div className="mt-14 py-4 px-6 rounded-2xl bg-[#110A1E]/60 border border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-4">
          <div className="flex items-center gap-2 text-cyan-300">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>{hackathon.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>4TH EDITION — 2026</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>TOP PRIZE + GOLDEN TICKET</span>
          </div>
          <div className="text-[11px] text-fuchsia-400 border border-fuchsia-500/30 px-3 py-1 rounded-full">
            tirana.hackjunction.com
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* EVENT CONTENT TABS & DEEP DIVE SECTIONS (Specification Section 5) */}
      {/* ------------------------------------------------------------- */}
      <div id="event-content-tabs" className="border-t border-white/10 bg-[#0B0616]/90 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 mb-8 overflow-x-auto gap-4">
            {[
              { id: 'tracks', label: 'Problem Statements & Tracks' },
              { id: 'prizes', label: 'Prizes & Rubrics' },
              { id: 'schedule', label: '48H Schedule & Timeline' },
              { id: 'rules', label: 'Rules & FAQs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 text-sm font-bold font-heading uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#00F5FF] border-b-2 border-[#00F5FF]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: TRACKS & PROBLEM STATEMENTS */}
          {activeTab === 'tracks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(hackathon.tracks || []).map((track, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#130B24] border border-white/10 hover:border-[#00F5FF]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#00FFAA] bg-[#00FFAA]/10 border border-[#00FFAA]/30 px-2 py-0.5 rounded">
                      TRACK 0{i + 1}
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      Bounty: {track.prize}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white font-heading">{track.name}</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">{track.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PRIZES & RUBRICS */}
          {activeTab === 'prizes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-[#130B24] border border-amber-500/40 text-center">
                <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <div className="text-xs font-mono uppercase tracking-wider text-amber-300">Grand Champion</div>
                <div className="text-3xl font-black text-white font-heading mt-1">$20,000</div>
                <p className="text-xs text-slate-300 mt-2">Plus Golden Ticket to Junction Main in Helsinki with flights & lodging.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-[#130B24] border border-cyan-500/40 text-center">
                <Award className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">Track Winners (4x)</div>
                <div className="text-3xl font-black text-white font-heading mt-1">$5,000 Each</div>
                <p className="text-xs text-slate-300 mt-2">Direct fast-track interview with tier-1 venture and accelerator sponsors.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 to-[#130B24] border border-purple-500/40 text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <div className="text-xs font-mono uppercase tracking-wider text-purple-300">Best Hardware / Edge</div>
                <div className="text-3xl font-black text-white font-heading mt-1">$5,000</div>
                <p className="text-xs text-slate-300 mt-2">GPU compute credits + custom hardware devkits provided by sponsors.</p>
              </div>
            </div>
          )}

          {/* TAB 3: 48H SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="max-w-3xl mx-auto space-y-4">
              {(hackathon.schedule || []).map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-[#130B24] border border-white/10">
                  <div className="w-36 text-xs font-mono text-[#00F5FF] font-bold">{item.time}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white font-heading">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: RULES & FAQS */}
          {activeTab === 'rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { q: 'Who is eligible to participate?', a: 'Students, developers, designers, and domain specialists worldwide. Teams can be formed beforehand or during opening day matching.' },
                { q: 'Who owns intellectual property (IP)?', a: 'You retain 100% of all intellectual property, source code, and assets created during the competition.' },
                { q: 'Can I start code before the hackathon begins?', a: 'No. All code must be authored during the official 48-hour hacking window. Public libraries, APIs, and frameworks are permitted.' },
                { q: 'How does judging evaluation work?', a: 'Submissions are scored on a weighted 10-point scale across Innovation, Technical Execution, Real-World Impact, and Presentation.' }
              ].map((faq, i) => (
                <div key={i} className="p-5 rounded-xl bg-[#130B24] border border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white font-heading">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    {faq.q}
                  </div>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

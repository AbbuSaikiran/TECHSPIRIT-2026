import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Globe, 
  Briefcase, 
  Award, 
  Heart, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function EventDetails({ hackathon, onOpenRegisterModal }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  // Countdown timer: 12 Days : 08 Hours : 24 Minutes : 36 Seconds
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 24,
    seconds: 36
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const evt = hackathon || {
    title: 'AI Innovation Challenge',
    tagline: 'Build innovative AI solutions for real-world problems',
    dates: 'Oct 12 - Oct 14, 2024',
    mode: 'Online',
    prizePool: '₹10,00,000',
    teamSize: '1-4',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-10 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] text-left">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ------------------------------------------------------------- */}
        {/* HERO BANNER SECTION (Exact Match to Event Details Screen in Image) */}
        {/* ------------------------------------------------------------- */}
        <div className="rounded-3xl bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#0F172A] border border-white/10 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-[#00E5A8] border border-emerald-500/40">
                Featured
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
                {evt.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                {evt.tagline}
              </p>

              {/* Metadata Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6366F1]" />
                  <span>{evt.dates}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>{evt.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#00E5A8]" />
                  <span className="text-white font-bold">{evt.prizePool} Prize Pool</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>{evt.teamSize} Team Size</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onOpenRegisterModal}
                  className="px-8 py-3.5 rounded-xl font-bold font-heading text-xs uppercase tracking-wider bg-gradient-to-r from-[#6366F1] to-[#BB5CF6] text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isFavorited 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right: Cyborg Robot Visual & Mini Countdown Box */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4">
              
              {/* Cyber Cyborg Orb Visual */}
              <div className="w-44 h-44 rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#BB5CF6] to-[#00F5FF] p-[2px] shadow-[0_0_35px_rgba(99,102,241,0.4)]">
                <div className="w-full h-full bg-[#0A0A0F] rounded-[14px] flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-radar-grid opacity-30" />
                  <Sparkles className="w-12 h-12 text-cyan-300 animate-pulse mb-2" />
                  <div className="text-[11px] font-mono text-slate-300 font-bold uppercase">CYBER JURY ACTIVE</div>
                  <div className="text-[9px] font-mono text-[#00E5A8] mt-1">48H Live Stream</div>
                </div>
              </div>

              {/* Countdown Box (Exact UI from Image) */}
              <div className="w-full p-4 rounded-2xl bg-[#0A0A0F]/90 border border-white/10 backdrop-blur-md text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Registration closes in
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-center">
                  <div>
                    <div className="text-xl font-black text-[#00E5A8]">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-[9px] text-slate-500">Days</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#6366F1]">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[9px] text-slate-500">Hours</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#BB5CF6]">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-[9px] text-slate-500">Minutes</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-cyan-300 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-[9px] text-slate-500">Seconds</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* TABS (Overview, Tracks, Timeline, Prizes, Rules, FAQs) */}
        {/* ------------------------------------------------------------- */}
        <div className="border-b border-white/10 flex gap-8 overflow-x-auto text-sm font-semibold font-heading">
          {['overview', 'tracks', 'timeline', 'prizes', 'rules', 'faqs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                activeTab === tab
                  ? 'text-white border-b-2 border-[#6366F1]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: OVERVIEW (Exact 4 Cards from Image) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-[#111827] border border-white/10">
              <h2 className="text-xl font-bold text-white font-heading mb-3">
                About the Hackathon
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                The AI Innovation Challenge brings together the brightest minds to solve real-world problems using artificial intelligence. Join us for 48 hours of innovation, learning, and collaboration.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white font-heading">Real-world Problems</div>
                <p className="text-xs text-slate-400 mt-1">High-impact challenges aligned with global needs</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00E5A8] mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white font-heading">Expert Mentorship</div>
                <p className="text-xs text-slate-400 mt-1">Direct feedback from leading AI researchers</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-[#BB5CF6] mb-3">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white font-heading">Amazing Prizes</div>
                <p className="text-xs text-slate-400 mt-1">₹10,00,000 cash pool and cloud grants</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white font-heading">Career Opportunities</div>
                <p className="text-xs text-slate-400 mt-1">Fast-track recruitment interviews with sponsors</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: TRACKS */}
        {activeTab === 'tracks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(evt.tracks || []).map((tr, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00E5A8] bg-[#00E5A8]/10 px-2 py-0.5 rounded">
                    TRACK 0{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{tr.prize}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">{tr.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tr.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB CONTENT: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {(evt.timeline || []).map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#111827] border border-white/10 flex items-start gap-4">
                <div className="w-36 text-xs font-mono font-bold text-[#6366F1]">{item.time}</div>
                <div>
                  <div className="text-sm font-bold text-white font-heading">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

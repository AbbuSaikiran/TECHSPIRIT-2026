import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Zap, 
  Calendar, 
  Globe, 
  Star, 
  MapPin, 
  Filter, 
  Trophy, 
  Users, 
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { CATEGORIES, INITIAL_HACKATHONS } from '../mockData';

export default function ExploreView({ onSelectHackathon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  // Filtered hackathons
  const filteredEvents = useMemo(() => {
    return INITIAL_HACKATHONS.filter((evt) => {
      const matchSearch = 
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' || evt.category === selectedCategory;
      const matchFormat = selectedFormat === 'all' || evt.format.toLowerCase() === selectedFormat.toLowerCase();

      return matchSearch && matchCategory && matchFormat;
    });
  }, [searchTerm, selectedCategory, selectedFormat]);

  // Specific 4 event icons matching Image 2
  const getEventIcon = (index) => {
    switch (index % 4) {
      case 0:
        return <Zap className="w-5 h-5 text-pink-400" />;
      case 1:
        return <Calendar className="w-5 h-5 text-emerald-400" />;
      case 2:
        return <Globe className="w-5 h-5 text-cyan-400" />;
      case 3:
      default:
        return <Star className="w-5 h-5 text-amber-400" />;
    }
  };

  const getIconContainerStyle = (index) => {
    switch (index % 4) {
      case 0:
        return 'bg-pink-500/10 border-pink-500/30';
      case 1:
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 2:
        return 'bg-cyan-500/10 border-cyan-500/30';
      case 3:
      default:
        return 'bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative">
      
      {/* Background radial lines and radar sweep glow */}
      <div className="absolute top-20 right-10 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-radar-grid opacity-50 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* ------------------------------------------------------------- */}
        {/* HERO / HEADER SECTION (Exact match to Reference Image 2) */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
          
          {/* Left Column: Huge EventRadar Branding & Discovery */}
          <div className="lg:col-span-5 text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                AI-POWERED DISCOVERY
              </span>
            </div>

            {/* Massive Display Title: "Event" & "Radar" */}
            <div className="font-heading font-black tracking-tight leading-[0.9]">
              <div className="text-6xl sm:text-7xl lg:text-8xl text-white">
                Event
              </div>
              <div className="text-6xl sm:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#38BDF8] to-[#A855F7] drop-shadow-[0_0_30px_rgba(0,245,255,0.4)]">
                Radar
              </div>
            </div>

            {/* Tagline with Color-Coded Keywords */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Find your next{' '}
              <span className="text-[#00FFAA] font-bold">hackathon</span>,{' '}
              <span className="text-cyan-400 font-bold">workshop</span> &{' '}
              <span className="text-purple-400 font-bold">conference</span> — instantly.
            </p>

            {/* Glowing Category Filter Chips */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 flex items-center gap-2 ${
                      cat.border
                    } ${
                      isSelected 
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)] font-bold scale-105' 
                        : 'bg-[#111827]/80 text-slate-300 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: isSelected ? '#000000' : cat.color }} 
                    />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Format filter pills */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Mode:</span>
              {['all', 'In-Person', 'Online', 'Hybrid'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                    selectedFormat === fmt
                      ? 'border-[#00FFAA] text-[#00FFAA] bg-[#00FFAA]/10 font-bold'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt === 'all' ? 'All Formats' : fmt}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Featured Stack Cards (Exact UI from Image 2) */}
          <div className="lg:col-span-7 space-y-3.5">
            
            {INITIAL_HACKATHONS.slice(0, 4).map((evt, idx) => (
              <div
                key={evt.id}
                onClick={() => onSelectHackathon(evt)}
                className="group p-4 sm:p-5 rounded-2xl bg-[#0F172A]/70 border border-white/10 hover:border-cyan-400/40 hover:bg-[#0F172A]/90 transition-all duration-300 flex items-center justify-between cursor-pointer shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getIconContainerStyle(idx)} group-hover:scale-105 transition-transform`}>
                    {getEventIcon(idx)}
                  </div>
                  
                  {/* Event Meta */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {evt.city} • {evt.dates.split('-')[0].trim()}
                    </p>
                  </div>
                </div>

                {/* Right Category Badge */}
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${evt.badgeColor}`}>
                    {evt.categoryLabel}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* COMPREHENSIVE SEARCH & FILTER BAR */}
        {/* ------------------------------------------------------------- */}
        <div className="mb-10 bg-[#111827]/80 rounded-2xl p-4 border border-white/10 backdrop-blur-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event name, city, or track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4 text-xs font-mono text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredEvents.length}</strong> matching events
            </span>
            {(searchTerm || selectedCategory !== 'all' || selectedFormat !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedFormat('all');
                }}
                className="text-[#00F5FF] hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* EVENT CARDS GRID */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectHackathon(evt)}
              className="bg-glass-card rounded-2xl p-6 border border-white/10 hover:border-[#00FFAA]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono uppercase font-bold px-3 py-1 rounded-full border ${evt.badgeColor}`}>
                    {evt.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {evt.format}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white font-heading group-hover:text-[#00F5FF] transition-colors">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {evt.tagline}
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>{evt.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00FFAA]" />
                    <span>{evt.venue || evt.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 font-semibold">{evt.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Team: {evt.teamSize}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {evt.status}
                </span>
                <button className="px-4 py-2 rounded-xl text-xs font-bold font-heading bg-gradient-to-r from-[#0066FF] to-[#00F5FF] text-white group-hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white font-heading">No matching events found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your keyword search or category filters.</p>
          </div>
        )}

      </div>
    </div>
  );
}

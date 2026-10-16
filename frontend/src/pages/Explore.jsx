import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Heart, 
  ChevronDown,
  ArrowRight,
  Globe
} from 'lucide-react';
import { HACKVERSE_CATEGORIES, HACKVERSE_EVENTS } from '../mockData';

export default function Explore({ onSelectHackathon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');

  const filteredEvents = useMemo(() => {
    return HACKVERSE_EVENTS.filter(evt => {
      const matchSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evt.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || evt.category === selectedCategory;
      const matchMode = selectedMode === 'all' || evt.mode.toLowerCase() === selectedMode.toLowerCase();

      return matchSearch && matchCategory && matchMode;
    });
  }, [searchTerm, selectedCategory, selectedMode]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header (Matches Explore Screen in Image) */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Discover Hackathons
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Find the perfect hackathon to showcase your skills and build amazing solutions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hackathons, skills, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1] shadow-xl transition-colors"
          />
        </div>

        {/* Category Filter Pills (Exact Pills from Image) */}
        <div className="flex flex-wrap gap-2.5">
          {HACKVERSE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#BB5CF6] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] font-bold'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dropdowns Row (Mode, Date, Prize Pool, Team Size) */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-[#111827] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300 focus:outline-none focus:border-[#6366F1]"
          >
            <option value="all">Mode: All</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <button className="bg-[#111827] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300 flex items-center gap-2 hover:border-white/20">
            <span>Date</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button className="bg-[#111827] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300 flex items-center gap-2 hover:border-white/20">
            <span>Prize Pool</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button className="bg-[#111827] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300 flex items-center gap-2 hover:border-white/20">
            <span>Team Size</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {(searchTerm || selectedCategory !== 'all' || selectedMode !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedMode('all');
              }}
              className="text-[#00E5A8] hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* 6-Grid Hackathon Cards (Exact Cards from Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredEvents.map(evt => (
            <div
              key={evt.id}
              onClick={() => onSelectHackathon(evt)}
              className="bg-[#111827] rounded-2xl p-5 border border-white/10 hover:border-[#6366F1]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="h-36 rounded-xl bg-gradient-to-tr from-purple-950 via-[#1E1B4B] to-slate-900 border border-white/5 p-3 flex items-start justify-between relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-tech-grid opacity-30" />
                  <span className="relative z-10 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {evt.categoryBadge}
                  </span>
                  <button className="relative z-10 p-1.5 rounded-full bg-black/40 text-slate-400 hover:text-rose-400">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {evt.tagline}
                </p>

                <div className="mt-4 flex items-baseline justify-between">
                  <div className="text-xl font-black text-white font-heading">
                    {evt.prizePool}
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {evt.mode}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>{evt.dates}</span>
                  </div>
                  <span>Team: {evt.teamSize}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  ● Registration Open
                </span>
                <span className="text-xs font-bold text-[#6366F1] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-heading">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

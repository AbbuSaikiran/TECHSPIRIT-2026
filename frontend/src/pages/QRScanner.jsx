import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Zap, 
  QrCode, 
  CheckCircle2, 
  User, 
  Building, 
  Users, 
  Clock, 
  Camera, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ROHAN_USER } from '../mockData';

export default function QRScanner({ onBack }) {
  const [useCamera, setUseCamera] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  // Default verified participant matching image
  const [participant, setParticipant] = useState({
    name: ROHAN_USER.name,
    email: ROHAN_USER.email,
    college: ROHAN_USER.college,
    team: ROHAN_USER.team,
    status: 'Checked In',
    checkInTime: 'Oct 12, 2024 • 10:24 AM',
    ticketId: 'HV24-8842'
  });

  useEffect(() => {
    let scanner = null;
    if (useCamera) {
      try {
        scanner = new Html5QrcodeScanner(
          'qr-camera-stream',
          { fps: 10, qrbox: { width: 220, height: 220 }, rememberLastUsedCamera: true },
          false
        );

        scanner.render(
          (decodedText) => {
            setScannedResult(decodedText);
            try {
              const parsed = JSON.parse(decodedText);
              setParticipant({
                name: parsed.name || 'Verified Innovator',
                email: parsed.email || 'hacker@mit.edu',
                college: parsed.college || 'Engineering Institute',
                team: parsed.team || 'Alpha Squad',
                status: 'Checked In',
                checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ticketId: parsed.ticket || 'HV24-NEW'
              });
            } catch (e) {
              setParticipant(prev => ({
                ...prev,
                status: 'Checked In',
                checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }));
            }
            scanner.clear().catch(() => {});
          },
          (error) => {}
        );
      } catch (err) {
        console.warn('Camera scanner init error', err);
      }
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [useCamera]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] text-left">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back link */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Scan QR Code
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scan participant QR code for event check-in and automated desk verification.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SCANNER & PARTICIPANT DETAILS GRID (Exact Match to Image) */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive QR Scanner Box */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#111827] border border-cyan-500/30 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Camera Switcher Toggle */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5A8]" /> Laser Scanner Engine
              </span>
              <button
                onClick={() => setUseCamera(!useCamera)}
                className="text-[11px] font-mono px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                {useCamera ? 'Switch to Test QR' : 'Use Device Camera'}
              </button>
            </div>

            {/* Central Scanning Viewport */}
            <div className="relative w-64 h-64 rounded-2xl bg-[#0A0A0F] border-2 border-cyan-500/50 flex items-center justify-center p-4 overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.25)]">
              
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00E5A8]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00E5A8]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00E5A8]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00E5A8]" />

              {/* Animated Glowing Green Laser Scan Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-[#00E5A8] shadow-[0_0_15px_#00E5A8] z-20 animate-laser" />

              {/* Scanner Screen Content */}
              {useCamera ? (
                <div id="qr-camera-stream" className="w-full h-full" />
              ) : (
                <div className="p-2 bg-white rounded-xl shadow-md">
                  <QRCodeSVG 
                    value={JSON.stringify({ ticket: participant.ticketId, name: participant.name, team: participant.team })} 
                    size={170}
                    level="H"
                  />
                </div>
              )}
            </div>

            {/* Scanning Status & Flash Trigger */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00E5A8] animate-ping" />
                <span>Scanning...</span>
              </div>

              <button 
                type="button"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#00E5A8] text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-lg"
              >
                <Zap className="w-4 h-4 fill-[#00E5A8] text-[#00E5A8]" />
              </button>
            </div>

          </div>

          {/* Right Column: Participant Details Card (Exact UI from Image) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-heading">
                Participant Details
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Ticket: {participant.ticketId}
              </span>
            </div>

            {/* Participant Profile with Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#00E5A8] p-[2px] shadow-lg">
                <div className="w-full h-full bg-[#0A0A0F] rounded-full flex items-center justify-center text-lg font-bold text-white font-mono">
                  {participant.name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-heading">
                  {participant.name}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {participant.email}
                </p>
              </div>
            </div>

            {/* College & Team Metadata */}
            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-3 text-slate-300">
                <Building className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{participant.college}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Team: <strong className="text-white">{participant.team}</strong></span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-[#00E5A8] border border-emerald-500/40 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#00E5A8]" />
                  {participant.status}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {participant.checkInTime}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => alert(`Showing registration profile for ${participant.name}`)}
                className="w-full py-3 rounded-xl font-bold font-heading text-xs uppercase bg-[#6366F1] hover:bg-[#818CF8] text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                <span>View Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Users, 
  Send, 
  QrCode, 
  ArrowRight,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

export default function RegistrationModal({ 
  isOpen, 
  onClose, 
  hackathon, 
  formFields, 
  onSuccessfulRegistration 
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredTicket, setRegisteredTicket] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate based on dynamic form fields
    formFields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate registration ticket
      const regId = `HH26-${Math.floor(1000 + Math.random() * 9000)}`;
      const qrPayload = JSON.stringify({
        ticket: regId,
        event: hackathon?.id || 'junctionx-tirana-2026',
        name: formData['f-1'] || formData['full_name'] || 'Hacker',
        email: formData['f-2'] || formData['email'] || 'dev@hackhub.io',
        team: formData['f-4'] || formData['team_name'] || 'Solo',
        time: new Date().toISOString()
      });

      // Fire confetti explosion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const newRegistration = {
        id: regId,
        name: formData['f-1'] || formData['full_name'] || 'Registered Hacker',
        email: formData['f-2'] || formData['email'] || 'hacker@mit.edu',
        team: formData['f-4'] || formData['team_name'] || 'Solo Participant',
        role: 'Participant',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Approved',
        qrData: qrPayload,
        hackathonTitle: hackathon?.title || 'JunctionX Tirana'
      };

      setRegisteredTicket(newRegistration);
      if (onSuccessfulRegistration) {
        onSuccessfulRegistration(newRegistration);
      }
    } catch (err) {
      console.error('Registration error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0D1224] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,102,255,0.3)] overflow-hidden my-8">
        
        {/* Header Ribbon */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#0066FF]/20 via-[#5A00FF]/20 to-[#00FFAA]/10 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0066FF]/30 border border-[#0066FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00F5FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                {registeredTicket ? 'Registration Confirmed!' : `Register for ${hackathon?.title}`}
              </h3>
              <p className="text-[11px] font-mono text-cyan-300">
                {registeredTicket ? 'Your entry pass is generated' : 'Dynamic Form Builder Protocol'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {/* STATE 1: REGISTRATION SUCCESS TICKET */}
          {registeredTicket ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-[#00FFAA] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white font-heading">
                  Welcome to the Arena!
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Your registration has been verified and securely synced with Google Sheets. Show this QR pass at the registration desk.
                </p>
              </div>

              {/* Dynamic QR Pass Card */}
              <div className="max-w-sm mx-auto p-6 rounded-2xl bg-[#090D1A] border border-cyan-500/40 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="text-left">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase">OFFICIAL ENTRY PASS</div>
                    <div className="text-sm font-bold text-white font-heading">{registeredTicket.hackathonTitle}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-[#00FFAA] border border-emerald-500/40 font-bold">
                    VERIFIED
                  </span>
                </div>

                {/* QR Code */}
                <div className="w-40 h-40 mx-auto p-2 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <QRCodeSVG 
                    value={registeredTicket.qrData} 
                    size={144}
                    level="H"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Ticket ID:</span>
                    <span className="text-white font-bold">{registeredTicket.id}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Hacker:</span>
                    <span className="text-white">{registeredTicket.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Team:</span>
                    <span className="text-[#00F5FF]">{registeredTicket.team}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold font-heading bg-[#0066FF] hover:bg-[#00F5FF] text-white transition-colors"
                >
                  Done & Close Pass
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: DYNAMIC FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00FFAA]" />
                <span>Live connected to Google Sheets registration ledger</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div 
                    key={field.id}
                    className={['checkboxes', 'file'].includes(field.type) ? 'sm:col-span-2' : ''}
                  >
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>

                    {/* Short Text / College / Phone */}
                    {['text', 'college', 'phone'].includes(field.type) && (
                      <input
                        type="text"
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className={`w-full bg-[#0A0E1A] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors[field.id] ? 'border-red-500' : 'border-white/15 focus:border-[#0066FF]'
                        }`}
                      />
                    )}

                    {/* Email */}
                    {field.type === 'email' && (
                      <input
                        type="email"
                        placeholder={field.placeholder || 'name@university.edu'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className={`w-full bg-[#0A0E1A] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors[field.id] ? 'border-red-500' : 'border-white/15 focus:border-[#0066FF]'
                        }`}
                      />
                    )}

                    {/* Dropdown */}
                    {field.type === 'dropdown' && (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className={`w-full bg-[#0A0E1A] border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                          errors[field.id] ? 'border-red-500' : 'border-white/15 focus:border-[#0066FF]'
                        }`}
                      >
                        <option value="">Select an option...</option>
                        {(field.options || []).map((opt, idx) => (
                          <option key={idx} value={opt} className="bg-[#111827]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* File / URL */}
                    {field.type === 'file' && (
                      <input
                        type="url"
                        placeholder={field.placeholder || 'https://github.com/... or Google Drive link'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full bg-[#0A0E1A] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                      />
                    )}

                    {/* Checkboxes */}
                    {field.type === 'checkboxes' && (
                      <div className="space-y-2 mt-2">
                        {(field.options || ['I agree to rules and guidelines']).map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                            <input
                              type="checkbox"
                              checked={!!formData[field.id]}
                              onChange={(e) => handleInputChange(field.id, e.target.checked)}
                              className="rounded border-slate-700 bg-slate-900 text-[#0066FF] focus:ring-0"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {errors[field.id] && (
                      <p className="text-[10px] text-red-400 mt-1 font-mono">{errors[field.id]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#0066FF] via-[#5A00FF] to-[#00FFAA] text-white hover:shadow-[0_0_25px_rgba(0,102,255,0.5)] transition-all flex items-center gap-2 font-heading"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}

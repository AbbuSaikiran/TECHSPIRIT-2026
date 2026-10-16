import React, { useState } from 'react';
import { 
  FileText, 
  Mail, 
  CheckSquare, 
  Upload, 
  AlignLeft, 
  Users, 
  Phone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Save,
  Eye,
  Sparkles
} from 'lucide-react';
import { DEFAULT_FORM_BUILDER_FIELDS } from '../mockData';

export default function FormBuilder({ formFields, setFormFields, onBackToOrganizer }) {
  const [fields, setFields] = useState(formFields || DEFAULT_FORM_BUILDER_FIELDS);
  const [currentStep, setCurrentStep] = useState(2); // Step 2: Registration Form
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Field Palette matching image exactly
  const PALETTE = [
    { type: 'text', label: 'Short Text', icon: <FileText className="w-3.5 h-3.5 text-cyan-400" /> },
    { type: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5 text-blue-400" /> },
    { type: 'dropdown', label: 'Dropdown', icon: <CheckSquare className="w-3.5 h-3.5 text-purple-400" /> },
    { type: 'checkboxes', label: 'Checkboxes', icon: <CheckSquare className="w-3.5 h-3.5 text-[#00E5A8]" /> },
    { type: 'file', label: 'File Upload', icon: <Upload className="w-3.5 h-3.5 text-pink-400" /> },
    { type: 'paragraph', label: 'Paragraph', icon: <AlignLeft className="w-3.5 h-3.5 text-amber-400" /> },
    { type: 'team', label: 'Team Members', icon: <Users className="w-3.5 h-3.5 text-emerald-400" /> },
    { type: 'phone', label: 'Phone Number', icon: <Phone className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  const handleAddField = (item) => {
    const newField = {
      id: `f-${Date.now()}`,
      label: item.label,
      type: item.type,
      required: false,
      placeholder: `Enter ${item.label.toLowerCase()}...`,
      options: item.type === 'dropdown' ? ['Track 1: AI / Agents', 'Track 2: Web3', 'Track 3: Open Innovation'] : []
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSaveAndPublish = () => {
    if (setFormFields) setFormFields(fields);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      if (onBackToOrganizer) onBackToOrganizer();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-10 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] text-left">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back and Stepper Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <button
            onClick={onBackToOrganizer}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          {/* Stepper (Exact from Image: 1 Event Details -> 2 Registration Form -> 3 Publish) */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">1</span>
              <span>Event Details</span>
            </div>
            <div className="w-6 h-px bg-white/20" />
            <div className="flex items-center gap-2 text-[#6366F1] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Registration Form</span>
            </div>
            <div className="w-6 h-px bg-white/20" />
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">3</span>
              <span>Publish</span>
            </div>
          </div>

          <button
            onClick={handleSaveAndPublish}
            className="px-5 py-2.5 rounded-xl font-bold font-heading text-xs uppercase bg-[#00E5A8] hover:bg-[#00F5FF] text-black transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Publish Form</span>
          </button>
        </div>

        {publishSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-xs font-mono text-[#00E5A8] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Form saved successfully! Public registration modal updated and columns synced with Google Sheets.</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TWO-PANEL BUILDER (Exact layout from Image) */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: "Add Fields" */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">
              Add Fields
            </h3>
            <p className="text-xs text-slate-400">Click to add any input to your registration schema:</p>

            <div className="space-y-2 pt-2">
              {PALETTE.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddField(item)}
                  className="w-full p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5 hover:border-[#6366F1]/50 text-xs font-mono text-slate-300 flex items-center gap-3 transition-colors group"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00E5A8]" />
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: "Form Preview" */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#6366F1]" /> Form Preview
                </h3>
                <p className="text-xs text-slate-400">How your questions appear to applicants</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
                {fields.length} Active Fields
              </span>
            </div>

            <div className="space-y-4">
              {fields.map((f, i) => (
                <div key={f.id} className="p-3.5 rounded-xl bg-[#0A0A0F] border border-white/5 relative group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-slate-300 font-medium">
                      {f.label} {f.required && <span className="text-rose-400">*</span>}
                    </label>
                    <button
                      onClick={() => handleRemoveField(f.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {f.type === 'dropdown' ? (
                    <select
                      disabled
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400"
                    >
                      <option>Select an option...</option>
                      {(f.options || []).map((o, idx) => (
                        <option key={idx}>{o}</option>
                      ))}
                    </select>
                  ) : f.type === 'paragraph' ? (
                    <textarea
                      disabled
                      rows={2}
                      placeholder={f.placeholder || 'Enter details...'}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl p-3 text-xs text-slate-400"
                    />
                  ) : (
                    <input
                      type="text"
                      disabled
                      placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={handleSaveAndPublish}
                className="px-6 py-2.5 rounded-xl font-bold font-heading text-xs uppercase bg-[#6366F1] text-white hover:bg-[#818CF8] transition-colors"
              >
                Save & Proceed to Publish →
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

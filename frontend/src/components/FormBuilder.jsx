import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  CheckSquare, 
  FileText, 
  Mail, 
  Phone, 
  Building, 
  Users, 
  Save, 
  Eye, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  CheckCircle2
} from 'lucide-react';

export default function FormBuilder({ formFields, setFormFields }) {
  const [fields, setFields] = useState(formFields);
  const [selectedFieldType, setSelectedFieldType] = useState('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available field palette
  const AVAILABLE_TYPES = [
    { type: 'text', label: 'Short Text', icon: <FileText className="w-4 h-4 text-cyan-400" /> },
    { type: 'email', label: 'Email Address', icon: <Mail className="w-4 h-4 text-blue-400" /> },
    { type: 'college', label: 'College / Org', icon: <Building className="w-4 h-4 text-emerald-400" /> },
    { type: 'phone', label: 'Phone Number', icon: <Phone className="w-4 h-4 text-amber-400" /> },
    { type: 'dropdown', label: 'Dropdown / Track', icon: <CheckSquare className="w-4 h-4 text-purple-400" /> },
    { type: 'file', label: 'File / Project Link', icon: <FileText className="w-4 h-4 text-pink-400" /> },
    { type: 'checkboxes', label: 'Checkboxes / Consent', icon: <CheckSquare className="w-4 h-4 text-red-400" /> },
  ];

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    const newField = {
      id: `f-${Date.now()}`,
      type: selectedFieldType,
      label: newFieldLabel.trim(),
      required: isRequired,
      placeholder: `Enter ${newFieldLabel.toLowerCase()}...`,
      options: selectedFieldType === 'dropdown' 
        ? ['Track 1: AI / ML', 'Track 2: Web3', 'Track 3: Cybersecurity', 'Track 4: Open Innovation'] 
        : selectedFieldType === 'checkboxes'
        ? ['I accept hackathon rules and guidelines']
        : []
    };

    const updated = [...fields, newField];
    setFields(updated);
    setNewFieldLabel('');
  };

  const handleDeleteField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleToggleRequired = (id) => {
    setFields(fields.map(f => f.id === id ? { ...f, required: !f.required } : f));
  };

  const handleMove = (index, direction) => {
    const newFields = [...fields];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newFields.length) return;
    const temp = newFields[index];
    newFields[index] = newFields[targetIdx];
    newFields[targetIdx] = temp;
    setFields(newFields);
  };

  const handlePublish = () => {
    setFormFields(fields);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-heading">
              No-Code Registration Form Builder
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-[#00FFAA] border border-emerald-500/30">
              Live Drag & Drop
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build bespoke questions for your hackathon. Automatically updates the public registration modal and syncs columns with Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-mono text-[#00FFAA] flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Form Published!
            </span>
          )}
          <button
            onClick={handlePublish}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#0066FF] to-[#00FFAA] text-slate-950 hover:shadow-[0_0_20px_rgba(0,255,170,0.5)] transition-all flex items-center gap-2 font-heading"
          >
            <Save className="w-4 h-4" />
            Publish Form
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Field Palette & Add Form */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10 shadow-xl">
            <h3 className="text-sm font-bold text-white font-heading mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00FFAA]" />
              Add Custom Question
            </h3>

            {/* Field Type Picker */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-400">Select Field Type</label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_TYPES.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSelectedFieldType(item.type)}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                      selectedFieldType === item.type
                        ? 'border-[#00FFAA] bg-[#00FFAA]/10 text-white font-bold'
                        : 'border-white/10 bg-[#0A0E1A] text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Field Label Input */}
              <div className="pt-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">Field Label</label>
                <input
                  type="text"
                  placeholder="e.g. GitHub Profile or Team Mascot"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full bg-[#0A0E1A] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              {/* Required Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-mono text-slate-300">Mandatory / Required field?</span>
                <button
                  type="button"
                  onClick={() => setIsRequired(!isRequired)}
                  className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all ${
                    isRequired 
                      ? 'border-[#00FFAA] bg-[#00FFAA]/20 text-[#00FFAA] font-bold' 
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  {isRequired ? 'Required' : 'Optional'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddField}
                className="w-full py-2.5 rounded-xl text-xs font-bold font-heading bg-[#0066FF] hover:bg-[#00F5FF] text-white transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Field to Form
              </button>
            </div>
          </div>

          {/* Active Field Sequence List */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10 shadow-xl">
            <h3 className="text-sm font-bold text-white font-heading mb-4">
              Current Form Schema ({fields.length} Fields)
            </h3>

            <div className="space-y-2">
              {fields.map((f, idx) => (
                <div 
                  key={f.id}
                  className="p-3 rounded-xl bg-[#0A0E1A] border border-white/10 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white">{f.label}</div>
                      <div className="text-[10px] text-slate-400">{f.type} • {f.required ? 'Required' : 'Optional'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button 
                      onClick={() => handleToggleRequired(f.id)}
                      className={`px-2 py-0.5 rounded text-[10px] border ${f.required ? 'border-[#00FFAA]/40 text-[#00FFAA]' : 'border-slate-700 text-slate-500'}`}
                    >
                      {f.required ? 'Req' : 'Opt'}
                    </button>
                    <button 
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 hover:text-white disabled:opacity-20"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === fields.length - 1}
                      className="p-1 hover:text-white disabled:opacity-20"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteField(f.id)}
                      className="p-1 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Form Preview */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-[#090D1A] border border-cyan-500/30 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                <Eye className="w-4 h-4 text-[#00FFAA]" />
                <span>Live Public Preview Mode</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Interactive Mock
              </span>
            </div>

            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">
                    {f.label} {f.required && <span className="text-red-400">*</span>}
                  </label>

                  {['text', 'college', 'phone'].includes(f.type) && (
                    <input
                      type="text"
                      disabled
                      placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}`}
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed opacity-80"
                    />
                  )}

                  {f.type === 'email' && (
                    <input
                      type="email"
                      disabled
                      placeholder="hacker@university.edu"
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed opacity-80"
                    />
                  )}

                  {f.type === 'dropdown' && (
                    <select
                      disabled
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed opacity-80"
                    >
                      <option>Select from options...</option>
                      {(f.options || []).map((o, idx) => (
                        <option key={idx}>{o}</option>
                      ))}
                    </select>
                  )}

                  {f.type === 'file' && (
                    <input
                      type="text"
                      disabled
                      placeholder="https://github.com/..."
                      className="w-full bg-[#111827] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed opacity-80"
                    />
                  )}

                  {f.type === 'checkboxes' && (
                    <div className="space-y-2 pt-1">
                      {(f.options || ['I agree to all rules']).map((o, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                          <input type="checkbox" disabled checked className="rounded" />
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button 
                disabled
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase bg-[#0066FF]/60 text-white cursor-not-allowed font-heading"
              >
                Submit Application Preview
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

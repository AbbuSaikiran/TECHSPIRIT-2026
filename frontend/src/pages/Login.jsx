import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';

export default function Login({ onBackToHome, onLoginSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess({
        name: isLoginTab ? 'Rohan Kumar' : 'New Innovator',
        email: email,
        role: 'Participant'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] flex flex-col items-center justify-center relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#6366F1]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Back to Home Link */}
      <button
        onClick={onBackToHome}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="w-full max-w-md space-y-6">
        
        {/* TECHSPIRIT Official Logo Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] p-[2px] shadow-[0_0_25px_rgba(99,102,241,0.5)] mb-3">
            <img 
              src="/logo.jpeg" 
              alt="TECHSPIRIT" 
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <span className="text-2xl font-black text-white font-heading">
            TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#BB5CF6]">SPIRIT</span>
          </span>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
            IDEAS  /  CODE  /  IMPACT
          </span>
        </div>

        {/* Card (Exact Layout from Image) */}
        <div className="p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl relative text-left">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white font-heading">
              {isLoginTab ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isLoginTab ? 'Login to continue your hackathon journey' : 'Join thousands of innovators and builders'}
            </p>
          </div>

          {/* Tab Switcher [Login | Sign Up] */}
          <div className="p-1 rounded-xl bg-[#0A0A0F] border border-white/5 flex mb-6 text-xs font-semibold">
            <button
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isLoginTab ? 'bg-[#6366F1] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isLoginTab ? 'bg-[#6366F1] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Social Logins */}
          <div className="space-y-2.5 mb-6">
            <button 
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200 flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button 
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200 flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#111827] px-3 text-[11px] font-mono text-slate-500 uppercase">or</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300">Password</label>
                <a href="#forgot" className="text-[10px] text-[#6366F1] hover:underline">Forgot Password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl font-bold font-heading uppercase tracking-wider text-xs bg-gradient-to-r from-[#00F5FF] via-[#6366F1] to-[#BB5CF6] text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all"
            >
              {isLoginTab ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isLoginTab ? (
              <span>Don't have an account? <button onClick={() => setIsLoginTab(false)} className="text-[#6366F1] font-bold hover:underline">Sign up</button></span>
            ) : (
              <span>Already registered? <button onClick={() => setIsLoginTab(true)} className="text-[#6366F1] font-bold hover:underline">Login</button></span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

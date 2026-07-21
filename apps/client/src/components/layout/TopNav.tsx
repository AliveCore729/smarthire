"use client";

import { Search, Bell, Menu } from "lucide-react";

export function TopNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="h-16 bg-[#0a0a0a]/50 backdrop-blur-md border-b border-white/10 flex items-center gap-4 px-4 md:px-6 shrink-0 z-10 relative">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuToggle}
        className="md:hidden text-slate-300 hover:text-white transition-colors p-1.5 bg-white/5 border border-white/10 rounded-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search insights, jobs, or resumes..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-500 font-medium"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-full transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(236,72,153,0.8)]"></span>
        </button>
      </div>
    </header>
  );
}
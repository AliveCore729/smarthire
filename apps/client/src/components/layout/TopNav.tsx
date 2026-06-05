"use client";

import { Search, Bell, Menu } from "lucide-react";

export function TopNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="h-16 bg-white border-b-2 border-slate-900 flex items-center gap-4 px-4 md:px-6 shrink-0 z-10 relative">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuToggle}
        className="md:hidden text-slate-900 hover:scale-110 transition-transform p-1.5 bg-lime-300 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0px_#0f172a]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900" />
          <input
            type="text"
            placeholder="Search insights, jobs, or resumes..."
            className="w-full pl-10 pr-4 py-2 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm text-slate-900 focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[2px_2px_0px_#0f172a] transition-all placeholder:text-slate-600 font-medium"
          />
        </div>
      </div>
    </header>
  );
}
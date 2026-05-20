"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Kanban, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileText },
  { name: "Job Match", href: "/job-match", icon: Briefcase },
  { name: "Application Tracker", href: "/application-tracker", icon: Kanban },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            S
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">SmartHire AI</h1>
            <p className="text-xs text-slate-400">Enterprise Portal</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* New Analysis Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-2.5 px-4 rounded-md mb-6 transition-colors font-medium">
          <span className="text-lg leading-none">+</span> New Analysis
        </button>

        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "hover:bg-slate-800/50 hover:text-white hover:translate-x-1" // Added slide effect
              }`}
            >
              <Icon 
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-blue-500" : "text-slate-400"
                }`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link 
          href="/help" 
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 hover:text-white transition-colors text-sm"
        >
          <HelpCircle className="w-5 h-5 text-slate-400" />
          Help Center
        </Link>
        <button 
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 text-red-400 hover:text-red-300 transition-colors text-sm"
          onClick={() => {
            // TODO: Wire up Zustand logout action here
            console.log("Logging out...");
          }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* User Profile Snippet */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm text-white font-medium">
            AJ
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-white truncate">Alex Jain</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
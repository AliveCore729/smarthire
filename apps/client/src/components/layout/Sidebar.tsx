"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Kanban,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Job Match",
    href: "/job-match",
    icon: Briefcase,
  },
  {
    name: "Application Tracker",
    href: "/application-tracker",
    icon: Kanban,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, avatarUrl } = useAuthStore();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className={`fixed md:relative top-0 left-0 w-64 bg-white text-slate-900 flex flex-col h-full shrink-0 border-r-2 border-slate-900 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-6 border-b-2 border-slate-900 bg-lime-300 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center font-bold text-lime-300 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
            S
          </div>

          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">
              SmartHire
            </h1>

            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
              Enterprise
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="md:hidden text-slate-900 hover:scale-110 transition-transform p-1 bg-white border-2 border-slate-900 rounded-sm shadow-[2px_2px_0px_#0f172a]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 text-sm font-bold border-2 ${
                isActive
                  ? "bg-lime-300 text-slate-900 border-slate-900 shadow-[2px_2px_0px_#0f172a] -translate-y-0.5"
                  : "bg-transparent border-transparent hover:border-slate-900 hover:bg-sky-200 hover:shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 group-hover:text-slate-900"
                }`}
              />

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-4 border-t-2 border-slate-900 space-y-2 bg-[#FDFBF7]">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-sm border-2 border-transparent hover:border-slate-900 hover:bg-sky-200 hover:shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <HelpCircle className="w-5 h-5" />

          Help Center
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-sm border-2 border-transparent hover:border-slate-900 hover:bg-pink-300 hover:shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <LogOut className="w-5 h-5" />

          Logout
        </button>

        {/* User Profile Snippet */}
        <div className="mt-4 pt-4 border-t-2 border-slate-900 flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-sm bg-slate-900 flex items-center justify-center text-sm text-lime-300 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] overflow-hidden shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
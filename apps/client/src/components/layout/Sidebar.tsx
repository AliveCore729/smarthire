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

export function Sidebar() {
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
    <aside className="w-64 bg-white text-slate-900 flex flex-col h-full shrink-0 border-r-2 border-slate-900 relative z-10">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b-2 border-slate-900 bg-lime-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center font-bold text-lime-300 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
            S
          </div>

          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">
              SmartHire AI
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise Portal
            </p>
          </div>
        </div>
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
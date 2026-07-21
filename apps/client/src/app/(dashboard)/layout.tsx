"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

import { Sidebar } from "@/components/layout/Sidebar";

import { TopNav } from "@/components/layout/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    isAuthenticated,
    isLoading,
    checkAuth,
  } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Run auth check ONCE when layout mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
  ]);

  // Show loader while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Prevent blank screen
  if (!isAuthenticated) {
    return null; 
    // (
    //   <div className="flex h-screen w-full items-center justify-center bg-slate-50">
    //     <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    //   </div>
    // );
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden text-slate-100 font-sans selection:bg-cyan-500/30 relative">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <TopNav onMenuToggle={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
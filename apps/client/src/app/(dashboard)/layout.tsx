"use client";

import { useEffect } from "react";

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

  // Run auth check ONCE when layout mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
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
    <div className="flex h-screen w-full bg-[#FDFBF7] overflow-hidden text-slate-900 font-sans selection:bg-lime-300">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
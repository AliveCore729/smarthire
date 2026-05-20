"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check for existing session cookie on app mount
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, AlertCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const router = useRouter();
  
  const { loginWithGoogle, isLoading, error } = useAuthStore();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        router.push("/dashboard");
      } catch (err) {
        // error handled by zustand
      }
    },
    onError: () => {
      console.error("Google Login Failed");
    }
  });



  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4 selection:bg-lime-300 selection:text-slate-900">
      <div className="max-w-md w-full bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-8 lg:p-10 my-8">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sky-300 border-2 border-slate-900 rounded-sm flex items-center justify-center font-black text-slate-900 text-3xl mx-auto mb-6 shadow-[4px_4px_0px_#0f172a] transform rotate-3">
            S
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Create Account</h1>
          <p className="text-slate-600 mt-2 font-bold uppercase text-sm tracking-wide">Join SmartHire AI today.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 text-slate-900 bg-red-400 px-4 py-3 border-2 border-slate-900 rounded-sm font-bold shadow-[4px_4px_0px_#0f172a]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}



        <button
          onClick={() => handleGoogleLogin()}
          type="button"
          disabled={isLoading}
          className="w-full py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-sm text-sm font-black transition-all shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:bg-slate-50 hover:shadow-[6px_6px_0px_#0f172a] flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-70"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center text-sm text-slate-900 font-bold uppercase tracking-wide">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 hover:text-blue-800 underline decoration-2 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
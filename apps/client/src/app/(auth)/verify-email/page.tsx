"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4 selection:bg-lime-300 selection:text-slate-900">
      <div className="max-w-md w-full bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-8 lg:p-10 my-8 text-center">
        
        <div className="w-20 h-20 bg-lime-300 border-2 border-slate-900 rounded-sm flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_#0f172a] transform -rotate-3">
          <MailCheck className="w-10 h-10 text-slate-900" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Check Your Inbox</h1>
        
        <p className="text-slate-600 font-bold text-base tracking-wide mb-8">
          We've sent a verification link to your email address. Please click the link to activate your account.
        </p>

        <div className="space-y-4">
          <Link 
            href="/login"
            className="w-full block py-3 bg-sky-300 text-slate-900 border-2 border-slate-900 rounded-sm text-sm font-black transition-all shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] uppercase tracking-widest"
          >
            Return to Login
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-slate-900 text-sm text-slate-600 font-bold">
          Didn't receive the email? Check your spam folder or make sure you used the correct address.
        </div>
      </div>
    </div>
  );
}

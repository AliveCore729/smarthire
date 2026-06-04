"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed or link expired.");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4 selection:bg-pink-300 selection:text-slate-900">
      <div className="max-w-md w-full bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-8 lg:p-10 my-8 text-center">
        
        {status === "loading" && (
          <div className="w-20 h-20 bg-amber-300 border-2 border-slate-900 rounded-sm flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_#0f172a] animate-pulse">
            <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
          </div>
        )}

        {status === "success" && (
          <div className="w-20 h-20 bg-lime-300 border-2 border-slate-900 rounded-sm flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_#0f172a] transform -rotate-3">
            <CheckCircle className="w-10 h-10 text-slate-900" />
          </div>
        )}

        {status === "error" && (
          <div className="w-20 h-20 bg-red-400 border-2 border-slate-900 rounded-sm flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_#0f172a] transform rotate-3">
            <XCircle className="w-10 h-10 text-slate-900" />
          </div>
        )}

        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">
          {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Verification Failed"}
        </h1>
        
        <p className="text-slate-600 font-bold text-base tracking-wide mb-8">
          {message}
        </p>

        {status === "success" && (
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-6">
            Redirecting to login...
          </p>
        )}

        {status === "error" && (
          <Link 
            href="/register"
            className="w-full block py-3 bg-pink-300 text-slate-900 border-2 border-slate-900 rounded-sm text-sm font-black transition-all shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] uppercase tracking-widest"
          >
            Try Registering Again
          </Link>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
        <div className="w-20 h-20 bg-amber-300 border-2 border-slate-900 rounded-sm flex items-center justify-center animate-pulse">
          <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

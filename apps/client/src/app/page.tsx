"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useGoogleLogin } from "@react-oauth/google";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

export default function LandingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { loginWithGoogle, isLoading, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
      }
    },
    onError: () => {
      console.error("Google Login Failed");
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center" style={{ background: '#1EE8B6' }}>
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className={`${styles.themeRoot} ${styles.pageContainer}`}>
      
      {/* Decorative SVG overlays (mimicking the reference) */}
      <svg className={styles.decoArrow} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50 Q 50 10, 90 50" stroke="#000" strokeWidth="4" fill="none"/>
        <path d="M75 35 L 90 50 L 75 65" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <svg className={styles.decoZigzag1} viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25 L 25 0 L 50 25 L 75 0 L 100 25" stroke="#FFE600" strokeWidth="12" fill="none" strokeLinecap="square"/>
      </svg>
      <svg className={styles.decoZigzag2} viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25 L 25 0 L 50 25 L 75 0 L 100 25" stroke="#FFE600" strokeWidth="12" fill="none" strokeLinecap="square"/>
      </svg>
      <svg className={styles.decoZigzag3} viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25 L 25 0 L 50 25 L 75 0 L 100 25" stroke="#FFE600" strokeWidth="12" fill="none" strokeLinecap="square"/>
      </svg>
      <div className={styles.decoStar}>
        <Sparkles size={40} fill="#FFE600" color="#000" strokeWidth={2} />
      </div>

      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={`${styles.logoName} ${spaceGrotesk.className}`}>SmartHire</div>
          </div>
          <nav className={styles.links}>
            <Link href="#" className={jetbrainsMono.className}>Product</Link>
            <Link href="#" className={jetbrainsMono.className}>Resource</Link>
            <Link href="#" className={jetbrainsMono.className}>Price</Link>
            <Link href="#" className={jetbrainsMono.className}>About Us</Link>
          </nav>
          <div className={styles.headerActions}>
            <button className={`${styles.loginBtn} ${spaceGrotesk.className}`} onClick={() => setIsModalOpen(true)}>
              Login
            </button>
            <button className={`${styles.startedBtn} ${spaceGrotesk.className}`} onClick={() => setIsModalOpen(true)}>
              Get Started
            </button>
          </div>
        </header>
      </div>

      <section className={styles.hero}>
        <div className={styles.eyebrow}><span className={styles.dot}></span> AI Resume Analyzer &amp; ATS Scoring</div>
        <h1 className={`${styles.title} ${spaceGrotesk.className}`}>
          Stop getting<br/>ghosted by the ATS.
        </h1>
        <p className={`${styles.sub} ${spaceGrotesk.className}`}>
          Upload your resume once. SmartHire scores it against real ATS logic, matches it to open roles, and tracks every application in one pipeline — no more guessing why the callback never came.
        </p>

        <div className={styles.ctaGroup}>
          <button className={`${styles.primaryCta} ${spaceGrotesk.className}`} onClick={() => setIsModalOpen(true)}>
            Get Started
          </button>
          <button className={`${styles.secondaryCta} ${spaceGrotesk.className}`}>
            See How it Works
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCol}>
            <b className={spaceGrotesk.className}>10K</b>
            <small className={jetbrainsMono.className}>Resumes Scanned</small>
          </div>
        </div>
      </section>

      <section className={styles.banner}>
        <h2 className={spaceGrotesk.className}>
          Track your applications and<br/>enjoy ATS optimization every day.
        </h2>
      </section>

      {/* login modal */}
      <div 
        className={`${styles.overlay} ${isModalOpen ? styles.open : ''}`} 
        onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
      >
        <div className={styles.modalCard}>
          <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>×</button>
          <div className={`${styles.modalBadge} ${spaceGrotesk.className}`}>S</div>
          <h2 className={spaceGrotesk.className}>Welcome back</h2>
          <p className={jetbrainsMono.className}>Sign in to your enterprise portal.</p>
          <button className={`${styles.googleBtn} ${spaceGrotesk.className}`} onClick={() => handleGoogleLogin()} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"/>
                <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"/>
              </svg>
            )}
            Continue with Google
          </button>
        </div>
      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { useGoogleLogin } from "@react-oauth/google";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Loader2, ArrowRight, TrendingUp, Cpu, BarChart2, Sparkles } from "lucide-react";
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
      
      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={`${styles.logoName} ${spaceGrotesk.className}`}>SmartHire</div>
          </div>
          <nav className={styles.links}>
            <Link href="#product" className={jetbrainsMono.className}>Product</Link>
            <Link href="#resource" className={jetbrainsMono.className}>Resource</Link>
            <Link href="#about-us" className={jetbrainsMono.className}>About Us</Link>
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

      <section className={styles.heroGrid}>
        <div className={styles.heroLeft}>
          <div className={`${styles.newBadge} ${spaceGrotesk.className}`}>
            🚀 NEW: AI Resume Parsing
          </div>
          <h1 className={`${styles.heroTitle} ${spaceGrotesk.className}`}>
            Beat the <span className={styles.highlightBox}>ATS.</span><br/>Land the Job.
          </h1>
          <div className={styles.heroSubBox}>
            <p className={`${styles.heroSub} ${spaceGrotesk.className}`}>
              Stop guessing what the applicant tracking systems want. Our AI-driven engine optimizes your resume, matches semantic intent, and visually tracks your applications in an industrial-grade Kanban board.
            </p>
          </div>
          <div className={styles.ctaGroup}>
            <button className={`${styles.primaryCta} ${spaceGrotesk.className}`} onClick={() => setIsModalOpen(true)}>
              Start For Free
              <ArrowRight size={20} strokeWidth={3} />
            </button>
            <button className={`${styles.secondaryCta} ${spaceGrotesk.className}`}>
              See How it Works
            </button>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroImageWrapper}>
            <div className={styles.yellowCircleBehind}></div>
            <Image 
              src="/hero-illustration.png" 
              alt="Robot scanning resume" 
              width={600} 
              height={600} 
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.sectionTitleContainer}>
        <div className={styles.sectionTitleBox}>
          <h2 className={`${styles.sectionTitle} ${spaceGrotesk.className}`}>Engineered for Execution</h2>
        </div>
      </section>

      <section id="product" className={styles.featureGrid}>
        <div className={`${styles.cardBase} ${styles.cardWhite} ${styles.card1}`}>
          <div className={styles.cardIcon}>
            <Cpu size={24} strokeWidth={2} />
          </div>
          <h3 className={spaceGrotesk.className}>Semantic Intent Matching</h3>
          <p className={spaceGrotesk.className}>
            Our NLP engine aligns your experience with the hidden keywords recruiters actually search for.
          </p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '85%' }}>
              85% Match
            </div>
          </div>
        </div>

        <div className={`${styles.cardBase} ${styles.cardYellow} ${styles.card2}`}>
          <div className={styles.cardIconSquare}>
            <TrendingUp size={24} strokeWidth={2} />
          </div>
          <h3 className={spaceGrotesk.className}>Tactical Tracker</h3>
          <p className={spaceGrotesk.className}>
            Visual pipelines for your applications.
          </p>
        </div>

        <div className={`${styles.cardBase} ${styles.cardWhite} ${styles.card3}`}>
          <div className={styles.cardIcon}>
            <BarChart2 size={24} strokeWidth={2} />
          </div>
          <h3 className={spaceGrotesk.className}>Real-time Metrics</h3>
          <p className={spaceGrotesk.className}>
            Know where you stand instantly.
          </p>
        </div>

        <div className={`${styles.cardBase} ${styles.cardTeal} ${styles.card4}`}>
          <div className={styles.circleDeco}></div>
          <div>
            <h3 className={spaceGrotesk.className}>Instant AI Polish</h3>
            <p className={spaceGrotesk.className}>
              Rewrite weak bullets into high-impact achievements with one click. No fluff, just results.
            </p>
          </div>
          <button className={`${styles.tryItBtn} ${spaceGrotesk.className}`} onClick={() => setIsModalOpen(true)}>
            <Sparkles size={16} strokeWidth={3} />
            Try it out
          </button>
        </div>
      </section>

      <footer id="about-us" className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerLeft}>
            <div className={`${styles.footerLogo} ${spaceGrotesk.className}`}>SmartHire</div>
            <p className={`${styles.footerDesc} ${spaceGrotesk.className}`}>
              Building the structural foundation for your career success. No BS, just data.
            </p>
          </div>
          <div className={styles.footerRight}>
            <Link href="#product" className={jetbrainsMono.className}>Product</Link>
            <Link href="#resource" className={jetbrainsMono.className}>Resources</Link>
            <Link href="#about-us" className={jetbrainsMono.className}>About Us</Link>
          </div>
        </div>
        <div className={`${styles.footerBottom} ${jetbrainsMono.className}`}>
          © 2024 SmartHire AI. All rights reserved.
        </div>
      </footer>

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
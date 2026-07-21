"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useGoogleLogin } from "@react-oauth/google";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Loader2 } from "lucide-react";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

export default function LandingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { loginWithGoogle, isLoading, isAuthenticated, checkAuth } = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // If already logged in, redirect to dashboard immediately
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

  // Parallax / 3D Tilt Effect
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const paper = paperRef.current;
    const chips = chipsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!stage || !paper) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fineOnly = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!fineOnly || reduceMotion) return;

    let mx = 0, my = 0, smx = 0, smy = 0, hovering = false;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hovering = true;
    };

    const handleMouseLeave = () => {
      hovering = false;
    };

    stage.addEventListener('mousemove', handleMouseMove);
    stage.addEventListener('mouseleave', handleMouseLeave);

    const loop = (t: number) => {
      let tx = mx, ty = my;
      if (!hovering) {
        const s = t * 0.0006;
        tx = Math.sin(s) * 0.5;
        ty = Math.cos(s * 0.8) * 0.4;
      }
      smx += (tx - smx) * 0.07;
      smy += (ty - smy) * 0.07;

      const maxTilt = 14;
      paper.style.transform = `rotateX(${(-smy * maxTilt).toFixed(2)}deg) rotateY(${(smx * maxTilt).toFixed(2)}deg)`;

      chips.forEach((c) => {
        const depth = parseFloat(c.dataset.depth || "0");
        c.style.transform = `translate(${(smx * depth).toFixed(1)}px, ${(smy * depth * 0.6).toFixed(1)}px)`;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      stage.removeEventListener('mousemove', handleMouseMove);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Keyboard accessibility for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const roles = ["Software Engineer", "Product Manager", "Data Analyst", "UX Designer", "Marketing Lead", "DevOps Engineer", "QA Analyst"];

  return (
    <div className={`${styles.themeRoot} ${styles.pageContainer}`}>
      
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={`${styles.logoName} ${spaceGrotesk.className}`}>SmartHire</div>
        </div>
        <nav className={styles.links}>
          <Link href="#" className={jetbrainsMono.className}>Product</Link>
          <Link href="#" className={jetbrainsMono.className}>How it works</Link>
          <Link href="#" className={jetbrainsMono.className}>Pricing</Link>
        </nav>
        <button className={`${styles.ticketBtn} ${spaceGrotesk.className}`} onClick={() => setIsModalOpen(true)}>
          Sign in
        </button>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>

        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.dot}></span> AI Resume Analyzer &amp; ATS Scoring</div>
          <h1 className={`${styles.title} ${spaceGrotesk.className}`}>
            Stop getting<br/>ghosted by the <span className={styles.mark}>ATS</span>.
          </h1>
          <p className={styles.sub}>
            Upload your resume once. SmartHire scores it against real ATS logic, matches it to open roles, and tracks every application in one pipeline — no more guessing why the callback never came.
          </p>

          <button className={`${styles.stampBtn} ${spaceGrotesk.className}`} onClick={() => handleGoogleLogin()} disabled={isLoading}>
            <span className={styles.gIcon}>
              <svg width="12" height="12" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"/>
                <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"/>
              </svg>
            </span>
            {isLoading ? "Signing in..." : "Continue with Google"}
            <span className={styles.arrow}>→</span>
          </button>

          <div className={`${styles.trustRow} ${jetbrainsMono.className}`}>
            <span>Secure OAuth</span> <span>·</span> <span>No credit card</span> <span>·</span> <span>2-minute setup</span>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}><b className={spaceGrotesk.className}><span>10k+</span></b><small className={jetbrainsMono.className}>Resumes scanned</small></div>
            <div className={styles.statCard}><b className={spaceGrotesk.className}>3.2×</b><small className={jetbrainsMono.className}>More interviews</small></div>
            <div className={styles.statCard}><b className={spaceGrotesk.className}>87%</b><small className={jetbrainsMono.className}>Avg. ATS match</small></div>
          </div>
        </div>

        <div className={styles.paperStage} id="paperStage" ref={stageRef}>
          <div className={styles.paper} id="paper" ref={paperRef}>
            <div className={`${styles.line} ${styles.lineName}`}></div>
            <div className={`${styles.line} ${styles.w1}`}></div>
            <div className={`${styles.line} ${styles.w2}`}></div>
            <div className={`${styles.line} ${styles.w3}`}></div>
            <div className={`${styles.chipsMini} ${jetbrainsMono.className}`}>
              <span>React</span><span>Node.js</span><span>SQL</span><span>AWS</span>
            </div>
            <div className={`${styles.line} ${styles.w4}`}></div>
            <div className={`${styles.line} ${styles.w5}`}></div>
            <div className={`${styles.line} ${styles.w2}`}></div>
            <div className={`${styles.parsedStamp} ${jetbrainsMono.className}`}>Parsed ✓</div>
            <div className={styles.atsBadge}><b className={spaceGrotesk.className}>92</b><small className={jetbrainsMono.className}>ATS score</small></div>
            <div className={styles.scanLine}></div>
          </div>

          <div className={`${styles.chipWrap} ${styles.chip1}`} data-depth="26" ref={el => { chipsRef.current[0] = el; }}>
            <div className={`${styles.chip} ${styles.chipBlue} ${jetbrainsMono.className}`}>Applied <b className={spaceGrotesk.className}>12</b></div>
          </div>
          <div className={`${styles.chipWrap} ${styles.chip2}`} data-depth="-20" ref={el => { chipsRef.current[1] = el; }}>
            <div className={`${styles.chip} ${styles.chipYellow} ${jetbrainsMono.className}`}>Interview <b className={spaceGrotesk.className}>3</b></div>
          </div>
          <div className={`${styles.chipWrap} ${styles.chip3}`} data-depth="32" ref={el => { chipsRef.current[2] = el; }}>
            <div className={`${styles.chip} ${styles.chipLime} ${jetbrainsMono.className}`}>Offer <b className={spaceGrotesk.className}>1</b></div>
          </div>
        </div>
      </section>

      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {Array(2).fill(roles).flat().map((r, i) => (
            <span key={i} className={spaceGrotesk.className}>{r} <em>✦</em></span>
          ))}
        </div>
      </div>

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
              <svg width="16" height="16" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"/>
                <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"/>
              </svg>
            )}
            Continue with Google
          </button>
          <div className={styles.modalFoot}>Don&apos;t have an account? <button onClick={() => handleGoogleLogin()} disabled={isLoading}><b>Sign up</b></button></div>
        </div>
      </div>

    </div>
  );
}
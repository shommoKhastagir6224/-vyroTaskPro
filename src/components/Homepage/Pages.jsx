"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { useTheme } from "@/components/ThemeProvider";

/* ─────────────────────────────────────────────────────────────
   KEYFRAME + DARK/LIGHT MODE STYLES
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  @keyframes floatY {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes floatX {
    0%,100% { transform: translateX(0px); }
    50%      { transform: translateX(10px); }
  }
  @keyframes pulseGreen {
    0%,100% { box-shadow: 0 8px 24px rgba(34,197,94,0.35); }
    50%      { box-shadow: 0 8px 36px rgba(34,197,94,0.65); }
  }
  @keyframes spinAtom {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes bulbPop {
    0%,100% { opacity:1; transform: translateX(-50%) scale(1); }
    50%      { opacity:.7; transform: translateX(-50%) scale(1.18); }
  }
  @keyframes slideInLeft {
    from { opacity:0; transform:translateX(-60px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity:0; transform:translateX(60px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes starSpin {
    from { transform:rotate(0deg) scale(1); }
    50%  { transform:rotate(180deg) scale(1.3); }
    to   { transform:rotate(360deg) scale(1); }
  }
  @keyframes dotPulse {
    0%,100% { opacity:.4; }
    50%      { opacity:1; }
  }
  @keyframes cardBounce {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes ripple {
    0%   { box-shadow: 0 0 0 0 rgba(6,182,212,0.5); }
    100% { box-shadow: 0 0 0 14px rgba(6,182,212,0); }
  }
  @keyframes circleFloat {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-10px); }
  }

  .hero-left  { animation: slideInLeft  0.8s ease both; }
  .hero-right { animation: slideInRight 0.8s ease 0.2s both; }

  .stat-card {
    animation: fadeUp 0.6s ease both;
    transition: transform .25s, box-shadow .25s;
    /* FIX: equal height for all cards */
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  .stat-card:hover {
    transform: translateY(-6px) !important;
  }

  .btn-start { transition: transform .2s, box-shadow .2s; }
  .btn-start:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 22px rgba(234,88,12,.55) !important;
  }
  .btn-watch { transition: transform .2s; }
  .btn-watch:hover { transform: translateY(-2px); }

  .play-btn { animation: ripple 1.6s infinite; }

  /* ── LIGHT MODE ── */
  :root {
    --bg-page:      #ffffff;
    --bg-section:   #f8fafc;
    --text-head:    #0f172a;
    --text-body:    #64748b;
    --text-dark:    #1e293b;
    --card-bg:      #ffffff;
    --card-border:  rgba(0,0,0,0.06);
    --card-shadow:  0 12px 36px rgba(0,0,0,0.10);
    --circle-bg:    linear-gradient(145deg,#1e293b,#0f172a);
    --circle-shadow:0 30px 80px rgba(15,23,42,.30);
    --dot-color:    #fca5a5;
    --badge-bg:     #ffffff;
    --badge-shadow: 0 5px 16px rgba(0,0,0,.14);
  }

  /* ── DARK MODE ── */
  .dark {
    --bg-page:      #0a0f1e;
    --bg-section:   #0f172a;
    --text-head:    #f1f5f9;
    --text-body:    #94a3b8;
    --text-dark:    #e2e8f0;
    --card-bg:      #1e293b;
    --card-border:  rgba(255,255,255,0.07);
    --card-shadow:  0 12px 36px rgba(0,0,0,0.40);
    --circle-bg:    linear-gradient(145deg,#1e3a5f,#0f172a);
    --circle-shadow:0 30px 80px rgba(6,182,212,.12);
    --dot-color:    #06b6d4;
    --badge-bg:     #1e293b;
    --badge-shadow: 0 5px 16px rgba(0,0,0,.50);
  }

  /* ════════════════════════════════
     LAYOUT — desktop first
  ════════════════════════════════ */
  .hero-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    flex-direction: row;
  }
  .hero-left-col  { flex: 0 0 47%; }
  .hero-right-col {
    flex: 0 0 50%;
    display: flex;
    justify-content: center;
    align-items: flex-end;          /* FIX: anchor to bottom so circle + boy align */
    position: relative;
    padding-top: 30px;
  }

  /* ── circle container — sizing via CSS var so breakpoints only touch one place ── */
  .circle-wrap {
    --cw: 380px;
    width:  var(--cw);
    height: var(--cw);
    border-radius: 40%;
    position: relative;
    overflow: visible;              /* badges can poke out */
    flex-shrink: 0;
    animation: circleFloat 6s ease-in-out infinite;
    transition: background .3s, box-shadow .3s;
  }

  /* ── boy image — always fills circle width, height auto so it never clips weird ── */
  .boy-wrap {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;                     /* FIX: relative to circle, not fixed px */
    aspect-ratio: 7 / 10;          /* FIX: keeps proportions without fixed height */
    z-index: 5;
    overflow: hidden;
  }

  /* ── stats grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
    align-items: stretch;           /* FIX: equal height rows */
  }

  /* ── icon box inside stat card — fixed square, never squishes ── */
  .stat-icon-box {
    flex-shrink: 0;
    width:  56px;
    height: 56px;
    min-width:  56px;               /* FIX: prevent shrink on narrow cards */
    min-height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ════════════════════════════════
     md: 768–1024 px
  ════════════════════════════════ */
  @media (max-width: 1024px) {
    .hero-left-col  { flex: 0 0 48%; }
    .hero-right-col { flex: 0 0 48%; }
    .circle-wrap    { --cw: 320px; }
    .stats-grid     { grid-template-columns: repeat(4,1fr); gap: 14px; }

    /* FIX: tighten floating cards on medium screens */
    .daily-card     { right: -80px !important; top: 80px !important; }
    .congrats-card  { left: -50px !important; }
  }

  /* ════════════════════════════════
     sm: < 768 px — stack layout
  ════════════════════════════════ */
  @media (max-width: 767px) {
    .hero-row {
      flex-direction: column !important;
      padding: 60px 20px 40px !important;
      gap: 48px;
    }
    .hero-left-col  {
      flex: unset;
      width: 100%;
      text-align: center;
    }
    .hero-right-col {
      flex: unset;
      width: 100%;
      padding: 100px 0 !important;
      justify-content: center;
    }
    .check-row { justify-content: center !important; }
    .cta-row   { justify-content: center !important; }

    /* FIX: 2-col stats on mobile with equal card height */
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px;
      padding: 0 16px 60px !important;
    }
    /* FIX: smaller stat icon on mobile so text has room */
    .stat-icon-box {
      width:  44px !important;
      height: 44px !important;
      min-width:  44px !important;
      min-height: 44px !important;
    }

    /* FIX: circle scales down gracefully */
    .circle-wrap { --cw: 280px; }

    /* FIX: floating cards tucked in, no overflow off-screen */
    .daily-card    { display: none !important; }
    .bulb-icon     { display: none !important; }
    .congrats-card { left: -40px !important; bottom: 20px !important; min-width: 180px !important; }

    .atom-icon  { left: -28px !important; }
    .dots-grid  { display: none; }
  }

  /* ════════════════════════════════
     xs: < 400 px
  ════════════════════════════════ */
  @media (max-width: 399px) {
    .circle-wrap { --cw: 240px; }
    .daily-card  { display: none !important; }          /* too cramped — hide */
    .stats-grid  { gap: 10px; }
    .stat-card   { gap: 12px !important; padding: 16px 14px !important; }
    .congrats-card { left: -30px !important; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   FLOATING CARDS
───────────────────────────────────────────────────────────── */
function DailyStudentsCard({ dark }) {
  return (
    <div className="daily-card" style={{
      position: "absolute", top: "100px", right: "-140px",
      background: "#16a34a",
      borderRadius: 14, padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 24px rgba(34,197,94,.4)",
      zIndex: 20, minWidth: 190,
      animation: "pulseGreen 2.4s ease-in-out infinite, cardBounce 3s ease-in-out infinite",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {["#ea580c","#0284c7","#db2777","#16a34a"].map((c, i) => (
          <div key={i} style={{
            width: 26, height: 26, borderRadius: "50%", background: c,
            border: "2.5px solid #fff", marginLeft: i === 0 ? 0 : -7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, color: "#fff", fontWeight: 700, flexShrink: 0,
          }}>{["A","B","C","D"][i]}</div>
        ))}
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: "#14532d",
          border: "2.5px solid #fff", marginLeft: -7,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, color: "#fff", fontWeight: 700, flexShrink: 0,
        }}>1k+</div>
      </div>
      <p style={{ color: "#fff", fontSize: 11, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
        Our daily new<br/>students
      </p>
    </div>
  );
}

function CongratulationsCard({ dark }) {
  return (
    <div className="congrats-card" style={{
      position: "absolute", bottom: "40px", left: "-70px",
      background: dark ? "#1e293b" : "#fff",
      borderRadius: 18, padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: dark ? "0 12px 36px rgba(0,0,0,.5)" : "0 12px 36px rgba(0,0,0,.13)",
      border: dark ? "1px solid rgba(255,255,255,0.07)" : "none",
      zIndex: 20, minWidth: 210,
      animation: "cardBounce 3.5s ease-in-out 0.5s infinite",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: 40, height: 40, minWidth: 40,   /* FIX: prevent icon squish */
        borderRadius: "50%", background: "#f59e0b",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <rect x=".5" y=".5" width="19" height="15" rx="2.5" stroke="#fff" strokeWidth="1.4"/>
          <path d="M1 1.5L10 9l9-7.5" stroke="#fff" strokeWidth="1.4"/>
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>  {/* FIX: allow text to wrap, not overflow */}
        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: dark ? "#f1f5f9" : "#1e293b", whiteSpace: "nowrap" }}>
          Congratulations
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", marginTop: 2, whiteSpace: "nowrap" }}>
          Your admission completed
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DECORATIVE ICONS
───────────────────────────────────────────────────────────── */
function AtomIcon() {
  return (
    <div className="atom-icon" style={{
      position: "absolute", left: "-82px", top: "32%",
      width: 52, height: 52, background: "#0891b2",
      borderRadius: 14,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 22px rgba(8,145,178,.45)",
      zIndex: 20,
      animation: "spinAtom 8s linear infinite",
    }}>
      <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="3.5" fill="#fff"/>
        <ellipse cx="15" cy="15" rx="12" ry="5.5" stroke="#fff" strokeWidth="1.6"/>
        <ellipse cx="15" cy="15" rx="12" ry="5.5" stroke="#fff" strokeWidth="1.6" transform="rotate(60 15 15)"/>
        <ellipse cx="15" cy="15" rx="12" ry="5.5" stroke="#fff" strokeWidth="1.6" transform="rotate(120 15 15)"/>
      </svg>
    </div>
  );
}

function BulbIcon() {
  return (
    <div className="bulb-icon" style={{
      position: "absolute", top: "-22px", left: "-20%",
      transform: "translateX(-50%)",
      zIndex: 20,
      animation: "bulbPop 2s ease-in-out infinite",
    }}>
      <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
        <path d="M20 3C11.163 3 4 10.163 4 19c0 5.3 2.6 10 6.6 12.9V37a2.4 2.4 0 002.4 2.4h14A2.4 2.4 0 0029 37v-5.1C33.4 29 36 24.3 36 19 36 10.163 28.837 3 20 3z"
          fill="#f59e0b" opacity=".95"/>
        <path d="M14 41h12M15 44.5h10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M20 9v4M9 19H5M35 19h-4M12 11L9.5 8.5M28 11l2.5-2.5"
          stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M20 13a6 6 0 016 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATS DATA
───────────────────────────────────────────────────────────── */
const stats = [
  {
    icon: (
      <svg width="32" height="26" viewBox="0 0 32 26" fill="none">
        <rect x="1" y="4" width="30" height="18" rx="2.5" stroke="#f59e0b" strokeWidth="2"/>
        <rect x="6" y="1" width="20" height="4" rx="1.5" fill="#f59e0b"/>
        <circle cx="16" cy="13" r="3.5" stroke="#f59e0b" strokeWidth="1.8"/>
        <path d="M1 21h30" stroke="#f59e0b" strokeWidth="1.8"/>
      </svg>
    ),
    value: "10K", label: "Online Courses",
    lightBg: "#fffbeb", darkBg: "#1c1a0f",
    accent: "#f59e0b", delay: "0s",
  },
  {
    icon: (
      <svg width="28" height="30" viewBox="0 0 28 30" fill="none">
        <circle cx="14" cy="9" r="6" stroke="#0891b2" strokeWidth="2"/>
        <path d="M2 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    value: "200+", label: "Expert Tutors",
    lightBg: "#ecfeff", darkBg: "#0c1a1e",
    accent: "#0891b2", delay: "0.1s",
  },
  {
    icon: (
      <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
        <path d="M17 2L31 10l-14 8L3 10l14-8z" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M3 10v9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 13v6a9 9 0 0018 0v-6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    value: "60K+", label: "Online Students",
    lightBg: "#f0fdf4", darkBg: "#0c1a10",
    accent: "#16a34a", delay: "0.2s",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13.5" stroke="#ea580c" strokeWidth="2"/>
        <path d="M10 16l4.5 4.5L22 11" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    value: "6K+", label: "Certified Courses",
    lightBg: "#fff7ed", darkBg: "#1c1000",
    accent: "#ea580c", delay: "0.3s",
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const HomePages = () => {
  const { dark, mounted } = useTheme();

  return (
    <div className="w-full md:mt-10">
      <style>{STYLES}</style>

      <section className="w-full overflow-hidden transition-colors duration-300" style={{
        background: dark ? "#0a0f1e" : "#ffffff",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>

        {/* ══════════ HERO ROW ══════════ */}
        <div className="hero-row relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-12 md:flex-row md:px-12 md:py-24">

          {/* dot grid */}
          <div className="dots-grid" style={{
            position: "absolute", left: 0, top: "25%",
            width: 100, height: 150,
            backgroundImage: `radial-gradient(circle,${dark ? "#06b6d4" : "#fca5a5"} 1.8px,transparent 1.8px)`,
            backgroundSize: "12px 12px", opacity: .45,
            animation: "dotPulse 3s ease-in-out infinite",
          }}/>

          {/* ── LEFT ── */}
          <div className="hero-left hero-left-col w-full md:w-auto text-center md:text-left">

            <div className="hidden md:inline-block" style={{
              color: "#16a34a", fontSize: 26, marginBottom: 10,
              animation: "starSpin 6s linear infinite",
            }}>✳</div>

            <h1 className="pt-5 md:pt-0 text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.15] mb-5 text-center md:text-left transition-colors duration-300"
              style={{
                color: dark ? "#f1f5f9" : "#0f172a",
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}>
              Limitless learning at<span className="hidden md:inline"><br/></span>your{" "}
              <span style={{ color: "#f59e0b", position: "relative", display: "inline-block" }}>
                fingertips
                <svg style={{ position: "absolute", bottom: -7, left: 0, width: "100%" }}
                  height="9" viewBox="0 0 180 9" fill="none" preserveAspectRatio="none">
                  <path d="M2 7Q22 2 45 7Q68 12 90 7Q112 2 135 7Q158 12 178 7"
                    stroke="#f59e0b" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="mx-auto md:mx-0 mb-6 text-center md:text-left transition-colors duration-300"
              style={{
                fontSize: 15.5, lineHeight: 1.8,
                color: dark ? "#94a3b8" : "#64748b",
                maxWidth: 420,
              }}>
              Online learning and teaching marketplace with 5K+ courses &amp; 10M
              students. Taught by experts to help you acquire new skills.
            </p>

            {/* checks */}
            <div className="check-row flex flex-wrap gap-4 md:gap-6 mb-8 justify-center md:justify-start">
              {["Learn with experts","Get certificate","Get membership"].map(t => (
                <span key={t} className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300"
                  style={{
                    color: dark ? "#e2e8f0" : "#0f172a",
                  }}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="8.5" cy="8.5" r="8.5" fill="#f59e0b"/>
                    <path d="M5.5 9l2.2 2.2L11.5 6.5" stroke="#fff" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="cta-row flex flex-wrap items-center gap-5 justify-center md:justify-start">
              <Button className="btn-start bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-[15px] px-8 h-12 rounded-xl shadow-[0_5px_16px_rgba(234,88,12,0.42)] hover:translate-y-[-3px] hover:shadow-[0_8px_22px_rgba(234,88,12,0.55)] transition-all duration-200">
                Get Started
              </Button>

              <Button
                variant="light"
                className="btn-watch bg-transparent text-slate-900 dark:text-slate-100 font-bold text-[15px] p-0 hover:bg-transparent min-w-0 h-12 hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="play-btn w-11 h-11 rounded-full bg-[#0891b2] flex items-center justify-center shadow-[0_5px_14px_rgba(8,145,178,0.45)] mr-3 flex-shrink-0">
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                    <path d="M2 1.5l10 6-10 6V1.5z" fill="#fff"/>
                  </svg>
                </div>
                Watch video
              </Button>

              <span style={{
                color: "#f59e0b", fontSize: 26,
                display: "inline-block",
                animation: "starSpin 4s linear infinite",
              }}>✦</span>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-right hero-right-col">

            {/* Angular badge */}
            <div style={{
              position: "absolute", top: 0, right: 10,
              width: 50, height: 50,
              background: dark ? "#1e293b" : "#fff",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: dark ? "0 5px 16px rgba(0,0,0,.5)" : "0 5px 16px rgba(0,0,0,.14)",
              zIndex: 20,
              animation: "floatY 3.5s ease-in-out infinite",
              transition: "background .3s",
            }}>
              <svg width="24" height="26" viewBox="0 0 22 24" fill="none">
                <path d="M11 0L0 4l1.68 14.48L11 24l9.32-5.52L22 4z" fill="#DD0031"/>
                <path d="M11 0v24l9.32-5.52L22 4z" fill="#C3002F"/>
                <path d="M11 2.8L3.6 19.4h2.76l1.54-3.84h6.2l1.54 3.84h2.76L11 2.8zm2.28 10.96H8.72L11 7.88l2.28 5.88z" fill="#fff"/>
              </svg>
            </div>

            {/* Figma badge */}
            <div style={{
              position: "absolute", bottom: 50, right: -12,
              width: 50, height: 50,
              background: dark ? "#1e293b" : "#fff",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: dark ? "0 5px 16px rgba(0,0,0,.5)" : "0 5px 16px rgba(0,0,0,.14)",
              zIndex: 20,
              animation: "floatX 4s ease-in-out infinite",
              transition: "background .3s",
            }}>
              <svg width="22" height="32" viewBox="0 0 22 32" fill="none">
                <path d="M5.5 32A5.5 5.5 0 0111 26.5V21H5.5a5.5 5.5 0 000 11z" fill="#0ACF83"/>
                <path d="M0 15.5A5.5 5.5 0 015.5 10H11v11H5.5A5.5 5.5 0 010 15.5z" fill="#A259FF"/>
                <path d="M0 5.5A5.5 5.5 0 015.5 0H11v11H5.5A5.5 5.5 0 010 5.5z" fill="#F24E1E"/>
                <path d="M11 0h5.5a5.5 5.5 0 010 11H11V0z" fill="#FF7262"/>
                <path d="M22 15.5a5.5 5.5 0 01-5.5 5.5A5.5 5.5 0 0111 15.5 5.5 5.5 0 0116.5 10 5.5 5.5 0 0122 15.5z" fill="#1ABCFE"/>
              </svg>
            </div>

            {/* ── CIRCLE + BOY ── */}
            <div className="circle-wrap" style={{
              background: dark
                ? "linear-gradient(145deg,#0f2744,#060d1a)"
                : "linear-gradient(145deg,#1e293b,#0f172a)",
              boxShadow: dark
                ? "0 30px 80px rgba(6,182,212,.15)"
                : "0 30px 80px rgba(15,23,42,.30)",
            }}>
              <BulbIcon/>
              <AtomIcon/>
              <DailyStudentsCard dark={dark}/>
              <CongratulationsCard dark={dark}/>

              {/* FIX: boy uses className boy-wrap with aspect-ratio, no fixed height */}
              <div className="boy-wrap">
                {mounted && (
                  <Image
                    src="/07.png"
                    alt="Student"
                    fill
                    style={{ objectFit: "contain", objectPosition: "bottom" }}
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ STATS ══════════ */}
        <div className="stats-grid max-w-[1400px] mx-auto px-6 pb-20 md:px-12 md:pb-24">
          {stats.map(({ icon, value, label, lightBg, darkBg, accent, delay }) => (
            <div key={label} className="stat-card" style={{
              background: dark ? darkBg : lightBg,
              border: `1.8px solid ${accent}${dark ? "40" : "30"}`,
              borderRadius: 18,
              padding: "22px 24px",           /* FIX: consistent padding */
              gap: 16,
              animationDelay: delay,
              transition: "background .3s, border .3s",
            }}>
              {/* FIX: icon box uses className for controlled sizing */}
              <div className="stat-icon-box" style={{
                background: `${accent}${dark ? "22" : "18"}`,
              }}>
                {icon}
              </div>
              <div style={{ minWidth: 0 }}>   {/* FIX: prevent text overflow */}
                <p style={{
                  margin: 0,
                  fontSize: "clamp(18px, 2vw, 26px)",  /* FIX: fluid font so it fits small cards */
                  fontWeight: 900,
                  color: dark ? "#f1f5f9" : "#0f172a",
                  lineHeight: 1.15,
                  transition: "color .3s",
                }}>{value}</p>
                <p style={{
                  margin: 0, fontSize: 12, color: accent,
                  fontWeight: 700, marginTop: 3,
                  whiteSpace: "normal",         /* FIX: label wraps correctly on mobile */
                }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};

export default HomePages;
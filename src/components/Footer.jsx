"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#020817] border-t lg:p-16 border-white/[0.08]  md:px-8 sm:p-0 pt-12 pb-6 font-sans">
      <div className="md:mx-16 mx-6">
        {/* Brand */}
        <div className="pb-8 mb-8 border-b text-center border-white/[0.07]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="h-5 w-5"
                >
                  <path d="M13 2L4 14h6l-1 8 11-14h-6l1-6z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-100">
                Vyro
              </span>
            </Link>
          </div>

          <p className="text-[13px] leading-relaxed text-white/40 mb-4 max-w-md mx-auto">
            Build discipline, develop meaningful habits, and stay consistent every day.
            <br />
            Vyro helps students, athletes, professionals, and dreamers organize their
            routines, track progress, and become the best version of themselves.
          </p>

          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/25 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px] font-medium text-teal-300">
              Building Better Habits Every Day
            </span>
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-4 gap-8 pb-8 mb-6 border-b border-white/[0.07] max-sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/55 mb-4">
              Platform
            </p>
            <nav className="flex flex-col gap-2">
              {[
                "Dashboard",
                "Daily Tasks",
                "Habit Tracker",
                "Routine Planner",
                "Progress Analytics",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[13px] text-white/38 hover:text-white/75 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/55 mb-4">
              Resources
            </p>
            <nav className="flex flex-col gap-2">
              {[
                "Productivity Guide",
                "Success Stories",
                "Blog",
                "Community",
                "Support",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[13px] text-white/38 hover:text-white/75 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/55 mb-4">
              Legal
            </p>
            <nav className="flex flex-col gap-2">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[13px] text-white/38 hover:text-white/75 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="max-sm:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/55 mb-4">
              Stay Inspired
            </p>
            <p className="text-[12px] text-white/35 mb-3">
              Receive weekly productivity tips, habit-building strategies, and motivational
              insights to help you stay focused and consistent.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-teal-500"
              />
              <button className="w-full rounded-lg bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                Join Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-white/30">
            © 2026 Vyro. Empowering people to build better habits, stay disciplined,
            and achieve meaningful goals.
          </span>
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span>Discipline</span>
            <span>•</span>
            <span>Consistency</span>
            <span>•</span>
            <span>Progress</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
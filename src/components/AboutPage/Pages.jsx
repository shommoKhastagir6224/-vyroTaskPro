"use client";

import React from "react";
import { Activity, Shield, RefreshCw, CheckCircle, Calendar, Sparkles, ListTodo, BarChart3, Lock, User } from "lucide-react";

const handleStripeCheckout = async () => {
  if (!user) {
    onOpenAuth();
    return;
  }

  setStripeLoading(true);
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } else {
      console.error("Stripe session initialization error");
    }
  } catch (e) {
    console.error("Failed to route Stripe redirect", e);
  } finally {
    setStripeLoading(false);
  }
};

const Pages = () => {
     const [stripeLoading, setStripeLoading] = React.useState(false);

  return (
    <div>
      {/* 1. Features Showcase Section */}
      <div id="features-showcase" className="bg-[#F8FAFC] dark:bg-[#1F2736] border-y border-[#E2E8F0] dark:border-[#2E3A4E] py-20 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[#0D9488] text-xs font-mono uppercase tracking-widest font-bold">
              GoalPilot Ecosystem
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Analyze What GoalPilot Can Do For You
            </h2>
            <p className="text-[#475569] dark:text-[#94A3B8] text-xs sm:text-sm">
              We engineered a complete high-fidelity workspace covering habits tracking, daily routines scheduling, task checklists, and yearly progress analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Habits Checklist */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-3xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-[#0D9488] mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                Habit Tracking Checklist
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4">
                Structured monthly habit spreadsheets featuring date locks. Automatically centers and auto-scrolls the active day column on launch, so you can check boxes without vertical scroll distraction.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold rounded-md border border-emerald-500/20">Date Lock</span>
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-[10px] font-semibold rounded-md border border-cyan-500/20">Auto-Scroll</span>
              </div>
            </div>

            {/* Feature 2: Routine Scheduler */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-3xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                6x6 Routine Scheduler
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4">
                Configure time slot boundaries across a Saturday-Friday weekly calendar. Run integrated stopwatch focus intervals with alarms to audit study blocks and prevent fatigue.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-semibold rounded-md border border-blue-500/20">Stopwatch Audit</span>
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-semibold rounded-md border border-rose-500/20">Sound Alarm</span>
              </div>
            </div>

            {/* Feature 3: Todo list */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-3xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-650 dark:text-violet-400 mb-5">
                <ListTodo className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                MongoDB To-Do Checklist
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4">
                Perform full CRUD operations on tasks. Backed by MongoDB API routes. Categorize list items (Work, Personal, Wellness) with priority colors, statuses, and custom estimated durations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-violet-500/10 text-violet-500 text-[10px] font-semibold rounded-md border border-violet-500/20">MongoDB Database</span>
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-semibold rounded-md border border-orange-500/20">Categories</span>
              </div>
            </div>

            {/* Feature 4: Annual Dashboard */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-3xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-550 mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                Annual Progress Analytics
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4">
                Unified Yearly Progress Dashboard combining data vectors. Includes combined progress line charts, monthly overview bar charts, top-10 check-in rankings, breakdown charts, and average progress gauges.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded-md border border-amber-500/20">Annual Charts</span>
                <span className="px-2 py-0.5 bg-teal-500/10 text-teal-500 text-[10px] font-semibold rounded-md border border-teal-500/20">Analytics Gauges</span>
              </div>
            </div>

            {/* Feature 5: User Profile Customizer */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-3xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-5">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                Profile Customizer
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4">
                Update account details, change role profiles (Student, Athlete, Gym, Other) and customize profile details. Integrates seamlessly with local states and embeds the Annual Dashboard directly.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-pink-500/10 text-pink-500 text-[10px] font-semibold rounded-md border border-pink-500/20">Google Avatar</span>
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[10px] font-semibold rounded-md border border-purple-500/20">Role Metadata</span>
              </div>
            </div>

            {/* Feature 6: Admin Security Console */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-3xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                Restricted Security Console
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4">
                Protects administrative actions. Verification filters restrict admin panel access to authorized accounts (`shommo.nexus@gmail.com`), showing connection diagnostics and system configurations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-semibold rounded-md border border-rose-500/20">Google Auth Check</span>
                <span className="px-2 py-0.5 bg-slate-500/10 text-slate-400 text-[10px] font-semibold rounded-md border border-slate-500/20">Diagnostic Gateway</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Core Value/Human Transformation Sections (Designed For / Replaces Course Cards) */}
      <div id="how-goalpilot-restructures" className="bg-[#F8FAFC] dark:bg-[#1F2736] border-b border-[#E2E8F0] dark:border-[#2E3A4E] py-20 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[#0D9488] text-xs font-mono uppercase tracking-widest font-bold">
              ALGORITHMIC VECTORS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              How GoalPilot Restructures Daily Human Performance
            </h2>
            <p className="text-[#475569] dark:text-[#94A3B8] text-xs sm:text-sm">
              Checklists fail because they ignore cognitive load and time
              alignment. We replace passive layouts with strict systems
              engineering tracking parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-2xl flex flex-col justify-between transition-colors duration-200">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-[#0D9488] font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                  Student Performance Accelerations
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  Avoid cognitive fatigue. GoalPilot AI chunks target study
                  materials into clear chapters with nested tasks, dynamically
                  evaluating module completion percentages and adjusting the
                  active load.
                </p>
              </div>
              <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#2E3A4E] mt-6 flex justify-between items-center text-[10px] font-mono text-[#475569] dark:text-[#94A3B8]">
                <span>SC Index Thresholds</span>
                <span className="text-[#0D9488] font-bold">Dynamic SC</span>
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-2xl flex flex-col justify-between transition-colors duration-200">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                  Habit & Telemetry Modifications
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  Locks in routine tracking with visual checkmark spreadsheets.
                  Restricting editing configurations strictly to the current
                  active calendar day forces daily focus and prevents historical
                  data tampering.
                </p>
              </div>
              <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#2E3A4E] mt-6 flex justify-between items-center text-[10px] font-mono text-[#475569] dark:text-[#94A3B8]">
                <span>24H Date Lock System</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  Safe Local Matrix
                </span>
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-white dark:bg-[#141923] border border-[#E2E8F0] dark:border-[#2E3A4E] p-6 rounded-2xl flex flex-col justify-between transition-colors duration-200">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-650 dark:text-violet-400 font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                  Gym, Routine & Productivity Refactoring
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  Bridges plans with actions. The 6x6 schedule tracks slot start
                  boundaries, triggering a floating stopwatch popup to audit
                  elapsed time blocks and archiving results automatically.
                </p>
              </div>
              <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#2E3A4E] mt-6 flex justify-between items-center text-[10px] font-mono text-[#475569] dark:text-[#94A3B8]">
                <span>Stopwatch Audit Loop</span>
                <span className="text-violet-650 dark:text-violet-400 font-bold">
                  Archive Log telemetry
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pricing Section (Free Tier vs. Premium Telemetry Flight License) */}
      <div id="pricing-flight-license" className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-[#141923] transition-colors duration-200">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#0D9488] text-xs font-mono uppercase tracking-widest font-bold">
            ACQUISITIONS PORTAL
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Select Your Learning Flight License
          </h2>
          <p className="text-[#475569] dark:text-[#94A3B8] text-xs sm:text-sm">
            Deploy with basic telemetry or license the complete high-fidelity
            cognitive system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          {/* Free Tier */}
          <div className="bg-[#F8FAFC] dark:bg-[#1F2736] border border-[#E2E8F0] dark:border-[#2E3A4E] rounded-3xl p-8 flex flex-col justify-between transition-colors duration-200">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-[#475569] dark:text-[#94A3B8] uppercase block font-bold mb-1">
                  Free Sandbox License
                </span>
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
                  $149{" "}
                  <span className="text-xs text-[#475569] dark:text-[#94A3B8] font-normal">
                    / Permanent
                  </span>
                </h3>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Unlock core dashboard functions. Build basic roadmaps, configure
                routines, and map habit logs locally.
              </p>
              <ul className="space-y-2 text-xs text-[#475569] dark:text-[#94A3B8] font-mono">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>Basic Roadmap Outlines</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>Habits Tracker Spreadsheet</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>6x6 Daily Routine Planner</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>Browser LocalStorage backing</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => (user ? setActiveView("workspace") : onOpenAuth())}
              className="w-full mt-8 py-2.5 bg-white dark:bg-[#141923] hover:bg-slate-50 dark:hover:bg-[#1F2736] border border-[#E2E8F0] dark:border-[#2E3A4E] text-[#0F172A] dark:text-[#F8FAFC] font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              Initialize Local Sandbox
            </button>
          </div>
          <div className="bg-[#F8FAFC] dark:bg-[#1F2736] border-2 border-[#0D9488] rounded-3xl p-8 flex flex-col justify-between transition-colors duration-200 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0D9488] text-white px-3.5 py-1 text-[9px] font-mono uppercase tracking-widest font-bold rounded-full">
              Recommended Telemetry License
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-[#0D9488] uppercase block font-bold mb-1">
                  Premium Flight License
                </span>
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
                  $199{" "}
                  <span className="text-xs text-[#475569] dark:text-[#94A3B8] font-normal">
                    / One-time purchase
                  </span>
                </h3>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Connect Google Gemini live context roadmaps, customize SC
                algorithm coefficients, and access priority mock quiz builds.
              </p>
              <ul className="space-y-2 text-xs text-[#475569] dark:text-[#94A3B8] font-mono">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>Gemini 2.5 Live Custom Roadmap</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>Adjustable SC Coefficient Formulas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>High-Fidelity AI Mock Exams</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>Exportable PDF Telemetry Dossier</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleStripeCheckout}
              disabled={stripeLoading}
              className="w-full mt-8 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              {stripeLoading
                ? "Routing Billing Portal..."
                : "Order Flight License"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;

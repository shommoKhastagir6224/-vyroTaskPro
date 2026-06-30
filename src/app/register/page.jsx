"use client";

import React, { useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role

  // Dynamic state fields
  // Student specific
  const [schoolName, setSchoolName] = useState("");
  const [previousCollege, setPreviousCollege] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");

  // Gym specific
  const [gymName, setGymName] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState("3");

  // Player specific
  const [sportName, setSportName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [playerRole, setPlayerRole] = useState("");

  // Other specific
  const [customRole, setCustomRole] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      let extraData = {};
      if (role === "student") {
        extraData = { schoolName, previousCollege, admissionYear };
      } else if (role === "gym") {
        extraData = { gymName, fitnessGoal, workoutsPerWeek };
      } else if (role === "player") {
        extraData = { sportName, teamName, playerRole };
      } else if (role === "other") {
        extraData = { customRole, additionalDetails };
      }

      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        // Optional custom fields can be passed if configured or saved separately.
        // We pass name/email/password to create user credentials.
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to sign up. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
    }
  };

  return (
    <div className="relative h-[1300px] w-full flex items-center justify-center overflow-hidden bg-slate-50/50 dark:bg-[#0a0f1e] font-sans selection:bg-blue-500/30 pt-16">
      
      {/* Decorative blurry backgrounds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[2%] w-[45%] h-[45%] rounded-full bg-blue-400/10 dark:bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[5%] left-[15%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 dark:bg-indigo-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: SIGN UP FORM */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-[460px] flex flex-col">
            
            {/* Logo */}
            <div className="flex justify-start mb-6">
              <Link href="/" className="flex items-center gap-3 select-none">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5">
                    <path d="M13 2L4 14h6l-1 8 11-14h-6l1-6z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
                  Vyro
                </span>
              </Link>
            </div>

            {/* Header Text */}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              Create an Account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[14px] mt-1.5 mb-8">
              Join now to streamline your experience from day one.
            </p>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                 <div className="p-3 text-xs font-medium text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg">
                   {error}
                 </div>
               )}

              {/* Name Field */}
              <div className="space-y-1 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-550 dark:text-slate-400 pl-1">
                  Full Name :
                </label>
                <Input
                  type="text"
                  placeholder="Roger Gerrard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="bordered"
                  radius="lg"
                  className={{
                    inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:!border-blue-500 transition-all",
                    input: "text-slate-850 dark:text-slate-100 font-sans"
                  }}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-550 dark:text-slate-400 pl-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="yourname@vyro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="bordered"
                  radius="lg"
                  className={{
                    inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:!border-blue-500 transition-all",
                    input: "text-slate-850 dark:text-slate-100 font-sans"
                  }}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-550 dark:text-slate-400 pl-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    variant="bordered"
                    radius="lg"
                    className={{
                      inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:!border-blue-500 transition-all",
                      input: "text-slate-850"
                    }}
                  />
                </div>
                <div className="space-y-1 flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-550 dark:text-slate-400 pl-1">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    variant="bordered"
                    radius="lg"
                    className={{
                      inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:!border-blue-500 transition-all",
                      input: "text-slate-850"
                    }}
                  />
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                 ROLE SELECTOR PILLS
                 ───────────────────────────────────────────────────────────── */}
              <div className="space-y-2 pt-2">
                <span className="text-[13px] font-semibold text-slate-550 dark:text-slate-400 pl-1">
                  Current Profile / Job
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "student", label: "Student" },
                    { id: "gym", label: "Gym/Fitness" },
                    { id: "player", label: "Athlete" },
                    { id: "other", label: "Other" }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        role === r.id
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                 DYNAMIC FIELDS SEGMENT
                 ───────────────────────────────────────────────────────────── */}
              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl transition-all duration-300">
                {role === "student" && (
                  <div className="space-y-3 animate-[fade-in-up_0.2s_ease-out]">
                    <h3 className="text-xs font-bold py-2 font-mono tracking-wider uppercase text-blue-650 dark:text-blue-400 mb-1">
                      Student Academic Data
                    </h3>
                    <div className="space-y-2 flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Current School Name</label>
                      <Input
                        placeholder="e.g. St. Joseph High School"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        required
                        variant="flat"
                        className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2 flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Previous College</label>
                        <Input
                          placeholder="e.g. Notre Dame College"
                          value={previousCollege}
                          onChange={(e) => setPreviousCollege(e.target.value)}
                          required
                          variant="flat"
                          className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                        />
                      </div>
                      <div className="space-y-2 flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Admission Year</label>
                        <Input
                          placeholder="e.g. 2026"
                          value={admissionYear}
                          onChange={(e) => setAdmissionYear(e.target.value)}
                          required
                          variant="flat"
                          className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {role === "gym" && (
                  <div className="space-y-3 animate-[fade-in-up_0.2s_ease-out]">
                    <h3 className="text-xs py-2 font-bold font-mono tracking-wider uppercase text-blue-655 dark:text-blue-400 mb-1">
                      Gym & Fitness Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Gym Name</label>
                        <Input
                          placeholder="e.g. Gold's Gym"
                          value={gymName}
                          onChange={(e) => setGymName(e.target.value)}
                          required
                          variant="flat"
                          className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                        />
                      </div>
                      <div className="space-y-2 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Fitness Goal</label>
                        <Input
                          placeholder="e.g. Weight Loss / Muscle Gain"
                          value={fitnessGoal}
                          onChange={(e) => setFitnessGoal(e.target.value)}
                          required
                          variant="flat"
                          className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex justify-start my-2 items-center gap-2">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Weekly Target Workouts (Days)</label>
                      <Input
                        type="number"
                        placeholder="3"
                        min="1"
                        max="7"
                        value={workoutsPerWeek}
                        onChange={(e) => setWorkoutsPerWeek(e.target.value)}
                        required
                        variant="flat"
                        className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                      />
                    </div>
                  </div>
                )}

                {role === "player" && (
                  <div className="space-y-3  my-2 animate-[fade-in-up_0.2s_ease-out]">
                    <h3 className="text-xs mb-2 font-bold font-mono tracking-wider uppercase text-blue-650 dark:text-blue-400 mb-1">
                      Athlete & Sport Info
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Sport</label>
                        <Input
                          placeholder="e.g. Football / Cricket"
                          value={sportName}
                          onChange={(e) => setSportName(e.target.value)}
                          required
                          variant="flat"
                          className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                        />
                      </div>
                      <div className="space-y-2 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Club or Team</label>
                        <Input
                          placeholder="e.g. Abahani Club"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          required
                          variant="flat"
                          className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Position / Specialty</label>
                      <Input
                        placeholder="e.g. Midfielder / Bowler"
                        value={playerRole}
                        onChange={(e) => setPlayerRole(e.target.value)}
                        required
                        variant="flat"
                        className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                      />
                    </div>
                  </div>
                )}

                {role === "other" && (
                  <div className="space-y-3 animate-[fade-in-up_0.2s_ease-out]">
                    <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-blue-650 dark:text-blue-400 mb-1">
                      Custom Profile Details
                    </h3>
                    <div className="space-y-2 flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Your Current Occupation / Position</label>
                      <Input
                        placeholder="e.g. Content Creator / Developer"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        required
                        variant="flat"
                        className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                      />
                    </div>
                    <div className="space-y-2 flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Focus / Goal Description</label>
                      <Input
                        placeholder="e.g. I want to build a writing routine..."
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                        required
                        variant="flat"
                        className={{ inputWrapper: "bg-white dark:bg-slate-950 h-10 border border-slate-200 dark:border-slate-800" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                radius="lg"
                isLoading={isLoading}
                className="w-full h-11 text-white font-semibold text-sm shadow-md bg-blue-600 hover:bg-blue-700 transition-colors border-none cursor-pointer"
              >
                Register
              </Button>

            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-[#0a0f1e]">
                Or Register With
              </span>
            </div>

            {/* Social register buttons matching style */}
            <div className="flex flex-col justify-center items-center gap-4 mb-6">
              <button className="btn flex justify-center items-center gap-2 h-10 w-60 rounded-xl bg-white text-black border-black">
                <svg aria-label="Microsoft logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 96H247V247H96" fill="#f24f23"></path><path d="M265 96V247H416V96" fill="#7eba03"></path><path d="M96 265H247V416H96" fill="#3ca4ef"></path><path d="M265 265H416V416H265" fill="#f9ba00"></path></svg>
                Login with Microsoft
              </button>

              {/* Google Button */}
              <button onClick={handleGoogleSignIn} className="btn flex justify-center items-center gap-2 h-10 w-60 rounded-xl bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
              </button>
            </div>

            {/* Back to Login */}
            <p className="text-[13px] text-center text-slate-500 dark:text-slate-400">
              Already Have An Account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                Sign In.
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW DASHBOARD MOCKUP SHOWCASE */}
        <div className="hidden lg:flex flex-1 relative items-center justify-center bg-cyan-600 dark:bg-sky-800 p-12 overflow-hidden select-none">
          {/* Subtle backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-blue-600 to-indigo-800 opacity-90" />
          
          <div className="relative z-10 w-full max-w-[560px] text-white flex flex-col">
            
            {/* Headlines */}
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Effortlessly manage your habits, routines, and operations.
            </h2>
            <p className="text-blue-100 text-sm font-light mb-8 max-w-md">
              Log in to access your CRM dashboard and manage your team.
            </p>

            {/* CSS Rendered Mockup Dashboard (Matching the mockup screenshot) */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl text-slate-800 dark:text-slate-200 scale-100 xl:scale-105 transition-transform duration-300">
              
              {/* Dashboard Top Widgets */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Completion card */}
                <div className="bg-blue-600 text-white rounded-xl p-3 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center text-[10px] opacity-75 font-mono">
                    <span>Routine Success</span>
                    <span>•••</span>
                  </div>
                  <div className="text-lg font-black mt-1">$189,374</div>
                  <span className="text-[8px] opacity-75 mt-1 font-mono">↑ 7.7% from last month</span>
                </div>
                {/* Timer card */}
                <div className="bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>Active Timer</span>
                    <span>•••</span>
                  </div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1">00:01:30</div>
                  <span className="text-[8px] text-green-500 mt-1 font-mono">● Running focus mode</span>
                </div>
                {/* Active days overview */}
                <div className="bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>Monthly Checkins</span>
                    <span>Weekly</span>
                  </div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1">$25,684</div>
                  <span className="text-[8px] text-green-500 mt-1 font-mono">↑ 6% from last month</span>
                </div>
              </div>

              {/* Performance charts section */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Sparkline chart card */}
                <div className="col-span-2 bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] font-bold text-slate-400 block mb-2 font-mono">Performance Trends</span>
                  <div className="h-20 w-full flex items-end justify-between px-1 relative">
                    {/* SVG Sparkline */}
                    <svg className="absolute inset-0 w-full h-full p-1" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path
                        d="M0 35 Q15 25 30 28 T60 10 T90 18 T100 5"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="w-full h-full flex items-end justify-between text-[8px] font-mono text-slate-400 z-10">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Categories progress gauge */}
                <div className="bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between items-center text-center">
                  <span className="text-[8px] font-bold text-slate-400 block w-full text-left font-mono">Categories</span>
                  <div className="relative w-14 h-14 mt-1 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="12" className="stroke-slate-100 dark:stroke-slate-900" strokeWidth="3" fill="transparent" />
                      <circle cx="16" cy="16" r="12" className="stroke-blue-600" strokeWidth="3" strokeDasharray={2*Math.PI*12} strokeDashoffset={2*Math.PI*12*(1 - 0.72)} fill="transparent" />
                    </svg>
                    <span className="absolute text-[10px] font-black text-slate-800 dark:text-slate-100">72%</span>
                  </div>
                  <span className="text-[7px] text-slate-400 font-mono mt-1">6,248 Units</span>
                </div>
              </div>

              {/* Product transaction table preview */}
              <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-[9px]">
                <div className="p-2 border-b border-slate-100 dark:border-slate-900 font-bold bg-slate-55/20 text-slate-400 font-mono uppercase tracking-wider">
                  Product Transaction List
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="flex justify-between font-mono text-[8px] border-b border-slate-100 dark:border-slate-900 pb-1">
                    <span>#SLR993721</span>
                    <span>Apple iPad Gen 10</span>
                    <span className="font-bold text-slate-850 dark:text-slate-100">$449</span>
                  </div>
                  <div className="flex justify-between font-mono text-[8px] border-b border-slate-100 dark:border-slate-900 pb-1">
                    <span>#SLR980129</span>
                    <span>Apple iPhone 15</span>
                    <span className="font-bold text-slate-850 dark:text-slate-100">$999</span>
                  </div>
                  <div className="flex justify-between font-mono text-[8px]">
                    <span>#SLR990118</span>
                    <span>Apple MacBook Air</span>
                    <span className="font-bold text-slate-850 dark:text-slate-100">$1,199</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

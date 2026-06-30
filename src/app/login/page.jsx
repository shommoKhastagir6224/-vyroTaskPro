"use client";

import React, { useState } from "react";
import { Button, Checkbox, Input } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
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
    <div className="relative h-[750px] md:h-[700px]  w-full flex items-center justify-center overflow-hidden bg-slate-50/50 dark:bg-[#0a0f1e] font-sans selection:bg-violet-500/30 pt-16">

      {/* ─────────────────────────────────────────────────────────────
         BACKGROUND DECORATIVE BLOB GRADIENTS & SHAPES (LEFT SIDE)
         ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden  pointer-events-none">
        {/* Soft Blurry Glows */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-400/10 dark:bg-violet-600/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-fuchsia-300/10 dark:bg-fuchsia-600/5 blur-[100px]" />

        {/* Floating Geometric Elements matching the mockup */}
        {/* Top left floating square */}
        <svg
          className="absolute top-[15%] left-[8%] text-violet-300/30 dark:text-violet-500/10 animate-bounce"
          style={{ animationDuration: "6s" }}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="5" y="5" width="30" height="30" rx="6" transform="rotate(15 20 20)" />
        </svg>

        {/* Middle left floating circle */}
        <svg
          className="absolute top-[50%] left-[5%] text-fuchsia-300/20 dark:text-fuchsia-500/10"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="25" cy="25" r="18" strokeDasharray="4 4" />
        </svg>

        {/* Bottom left floating mini circle outline */}
        <div className="absolute bottom-[12%] left-[10%] w-4 h-4 rounded-full border border-violet-400/30 dark:border-violet-500/10" />

        {/* Bottom center floating square outline */}
        <svg
          className="absolute bottom-[8%] left-[40%] text-slate-300/40 dark:text-slate-700/20"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="4" width="22" height="22" rx="4" />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         MAIN CONTAINER (SPLIT LAYOUT)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full min-h-screen  flex flex-col lg:flex-row">

        {/* LEFT COLUMN: SIGN IN FORM */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-[420px] flex flex-col">

            {/* Top Logo - Styled Purple Outline Circle */}
            <div className="flex justify-center mb-4">
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
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100 transition-colors duration-300">
                  Vyro
                </span>
              </Link>
            </div>

            {/* Heading */}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-center text-[#7c3aed] dark:text-[#a78bfa] mb-8 font-sans">
              Log in / Sign Up On Vyro
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {error && (
                <div className="p-3 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1 flex flex-col gap-2">
                <label className="text-[13px] font-medium text-slate-500 dark:text-slate-400 pl-1">
                  Email Address:
                </label>
                <Input
                  type="email"
                  placeholder="username@vyro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={{
                    inputWrapper: [
                      "h-11",
                      "border-2",
                      "border-violet-500/70",
                      "dark:border-violet-500/50",
                      "bg-white",
                      "dark:bg-slate-950",
                      "hover:border-violet-600",
                      "focus-within:!border-violet-600",
                      "transition-all duration-200",
                      "rounded-lg",
                      "shadow-sm",
                      "px-3"
                    ],
                    input: "text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm font-sans"
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1 flex flex-col gap-2">
                <label className="text-[13px] font-medium text-slate-500 dark:text-slate-400 pl-1">
                  Password:
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={{
                    inputWrapper: [
                      "h-11",
                      "border",
                      "border-slate-200",
                      "dark:border-slate-800",
                      "bg-white",
                      "dark:bg-slate-950",
                      "hover:border-slate-300",
                      "dark:hover:border-slate-700",
                      "focus-within:!border-violet-500",
                      "transition-all duration-200",
                      "rounded-lg",
                      "shadow-sm",
                      "px-3"
                    ],
                    input: "text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-sm"
                  }}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  color="secondary"
                  className={{
                    label: "text-slate-500 dark:text-slate-400 select-none text-xs font-medium"
                  }}
                >
                  Remember me
                </Checkbox>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Log In Button - Gradient matches screenshot */}
              <Button
                type="submit"
                radius="full"
                isLoading={isLoading}
                className="w-full h-11 text-white font-semibold text-sm shadow-[0_4px_14px_rgba(124,58,237,0.3)] bg-gradient-to-r from-[#7c3aed] to-[#ee7752] hover:opacity-95 transition-opacity border-none cursor-pointer"
              >
                Log in
              </Button>
            </form>

            {/* Connecting Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-[#0a0f1e] transition-colors">
                or connect with
              </span>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col items-center justify-center gap-4 mb-8">
              {/* Google Button */}
              <button onClick={handleGoogleSignIn} className="btn flex justify-center items-center gap-2 h-10 w-60 rounded-xl bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
              </button>
            </div>

            {/* Bottom Signup Link */}
            <p className="text-[13px] text-center text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/getstarted"
                className="font-bold text-[#1e3a8a] dark:text-violet-400 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT COLUMN: CYLINDRICAL DECORATIVE GRADIENT BANNER (DESKTOP ONLY) */}
        <div className="hidden lg:flex flex-1 relative items-center justify-start overflow-hidden bg-white dark:bg-[#0a0f1e] transition-colors duration-300">

          {/* Subtle background shapes in the right container */}
          <div className="absolute top-[8%] right-[10%] text-violet-300/20 dark:text-violet-500/5 animate-[pulse_4s_infinite]">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
              <polygon points="30,5 55,50 5,50" />
            </svg>
          </div>
          <div className="absolute bottom-[10%] right-[15%] text-fuchsia-300/25 dark:text-fuchsia-500/5">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="5" y="5" width="30" height="30" rx="5" />
            </svg>
          </div>

          {/* Large Overlapping Circle Container - mimicking the mockup */}
          <div
            className="absolute xl:left-[1%] w-[150%] aspect-square rounded-full flex flex-col justify-center pl-[25%] pr-[15%] text-white shadow-[-10px_20px_50px_rgba(0,0,0,0.15)] bg-gradient-to-tr from-[#6366f1] via-[#d946ef] to-[#ff7e40] select-none"
            style={{
              transform: "translateY(0%)",
            }}
          >
            {/* Title */}
            <h2 className="text-6xl xl:text-7xl font-extrabold tracking-tight mb-6">
              Vyro
            </h2>

            {/* Contextual Description */}
            <p className="text-sm xl:text-base leading-relaxed text-white/90 max-w-md font-light mb-8">
              Vyro helps you organize your task management, build healthy habits, and master your daily routine. Take control of your day, track your progress, and join a community of high-achievers.
            </p>

            {/* Action Group */}
            <div className="flex items-center gap-5">
              {/* Capsule button: Learn More */}
              <Link
                href="/about"
                className="px-6 py-2.5 rounded-full bg-white text-[#ee7752] font-semibold text-sm hover:bg-slate-50 hover:shadow-md transition-all duration-200"
              >
                Learn More
              </Link>

              {/* Play video outline button */}
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-white/70 flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors cursor-pointer group"
                title="Watch Demo Video"
              >
                <svg
                  className="w-4 h-4 text-white fill-white translate-x-[1px] group-hover:scale-105 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

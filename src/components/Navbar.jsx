"use client";

import React, { useState } from "react";
import { Button, Avatar } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

/* ─────────────────────────────────────────────────────────────
   DARK MODE TOGGLE BUTTON
   ───────────────────────────────────────────────────────────── */
function DarkModeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Switch to Light" : "Switch to Dark"}
      className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border shadow-[0_4px_14px_rgba(0,0,0,0.15)] bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
    >
      {dark ? (
        /* sun */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" stroke="#fbbf24" strokeWidth="2" />
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        /* moon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { dark, toggleDark, mounted } = useTheme();
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession()
  const user = session?.user;

  const handleSignout = async () => {
    await authClient.signOut();
    // router.replace("/");
  }

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full border-b border-default-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0f1e]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
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

          {/* Desktop Menu */}
          <div className="hidden items-center gap-10 md:flex">
            {!user ? (
              <>
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-600 dark:text-slate-350 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Home
                </Link>
                <Link
                  href="/#features-showcase"
                  className="text-sm font-medium text-gray-600 dark:text-slate-350 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Features
                </Link>
                <Link
                  href="/#how-goalpilot-restructures"
                  className="text-sm font-medium text-gray-600 dark:text-slate-350 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Designed For
                </Link>
                <Link
                  href="/#pricing-flight-license"
                  className="text-sm font-medium text-gray-600 dark:text-slate-350 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Pricing
                </Link>
              </>
            ) : (
              <div className="relative group py-2">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-slate-350 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400 focus:outline-none cursor-pointer"
                >
                  Home <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                </Link>
                <div className="absolute left-0 mt-1 w-40 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col p-2 space-y-1">
                  <Link
                    href="/#features-showcase"
                    className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="/#how-goalpilot-restructures"
                    className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Designed For
                  </Link>
                  <Link
                    href="/#pricing-flight-license"
                    className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Pricing
                  </Link>
                </div>
              </div>
            )}
            {user ? <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
              >
                Dashboard
              </Link>
              <Link
                href="/habits"
                className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
              >
                Habits
              </Link>
              <Link
                href="/routine"
                className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
              >
                Routine
              </Link>
              <Link
                href="/todolist"
                className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
              >
                Todolist
              </Link>
              {user.email === "shommo.nexus@gmail.com" && (
                <Link
                  href="/admin"
                  className="text-sm font-bold text-rose-500 dark:text-rose-455 transition-all duration-300 hover:text-rose-700 dark:hover:text-rose-350"
                >
                  Admin Panel
                </Link>
              )}
            </> : ""}
          </div>

          {/* Right section for Desktop */}
          <div className="hidden items-center gap-4 md:flex">
            {mounted && <DarkModeToggle dark={dark} onToggle={toggleDark} />}
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border border-violet-500 cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Avatar
                      name={user.name || "User"}
                      size="sm"
                      className="w-8 h-8 text-xs bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300 font-bold cursor-pointer"
                    />
                  )}
                  <span className="text-sm font-semibold text-gray-700 dark:text-slate-350 max-w-[120px] truncate cursor-pointer">
                    {user.name}
                  </span>
                </Link>
                <Button
                  onClick={handleSignout}
                  variant="flat"
                  size="sm"
                  color="danger"
                  className="font-medium cursor-pointer rounded-lg h-8 min-w-0 px-3"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="no-underline">
                  <Button
                    variant="light"
                    className="font-medium text-gray-600 dark:text-slate-300 transition-colors duration-300 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="no-underline">
                  <Button
                    color="secondary"
                    radius="lg"
                    className="px-6 font-semibold shadow-md bg-violet-600 hover:bg-violet-700 text-white border-none cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right section */}
          <div className="flex items-center gap-3 md:hidden">
            {mounted && <DarkModeToggle dark={dark} onToggle={toggleDark} />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 dark:text-slate-100 transition-colors duration-300 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="border-t border-default-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1e] md:hidden transition-colors duration-300">
            <div className="space-y-5 px-6 py-6">
              {!user ? (
                <>
                  <Link href="/" className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                    Home
                  </Link>
                  <Link href="/#features-showcase" className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                    Features
                  </Link>
                  <Link href="/#how-goalpilot-restructures" className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                    Designed For
                  </Link>
                  <Link href="/#pricing-flight-license" className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                    Pricing
                  </Link>
                </>
              ) : (
                <div className="space-y-2 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono pl-1">
                    Home Navigation
                  </span>
                  <div className="pl-3 border-l border-slate-200 dark:border-slate-800 space-y-3">
                    <Link href="/" className="block text-gray-700 dark:text-slate-300 text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400">
                      Home Base
                    </Link>
                    <Link href="/#features-showcase" className="block text-gray-700 dark:text-slate-300 text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400">
                      Features
                    </Link>
                    <Link href="/#how-goalpilot-restructures" className="block text-gray-700 dark:text-slate-300 text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400">
                      Designed For
                    </Link>
                    <Link href="/#pricing-flight-license" className="block text-gray-700 dark:text-slate-300 text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400">
                      Pricing
                    </Link>
                  </div>
                </div>
              )}
              {user ? <>
                <Link href="/dashboard" className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                  Dashboard
                </Link>
                <Link href="/habits" className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                  Habits
                </Link>
                <Link href="/routine" className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                  Routine
                </Link>
                <Link
                  href="/todolist"
                  className="block text-gray-700 dark:text-slate-300 font-medium hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Todolist
                </Link>
                {user.email === "shommo.nexus@gmail.com" && (
                  <Link
                    href="/admin"
                    className="block text-rose-500 dark:text-rose-455 font-bold hover:text-rose-705 dark:hover:text-rose-350"
                  >
                    Admin Panel
                  </Link>
                )}
              </> : ''}
              <div className="flex justify-center items-center gap-3 pt-2">
                {user ? (
                  <div className="flex items-center justify-between w-full border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2">
                    <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-9 h-9 rounded-full object-cover border border-violet-500 cursor-pointer"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Avatar
                          name={user.name || "User"}
                          size="sm"
                          className="w-9 h-9 text-xs bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300 font-bold cursor-pointer"
                        />
                      )}
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-none mb-1 cursor-pointer">
                          {user.name}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 leading-none cursor-pointer">
                          {user.email}
                        </span>
                      </div>
                    </Link>
                    <Button
                      onClick={handleSignout}
                      size="sm"
                      variant="flat"
                      color="danger"
                      className="font-medium cursor-pointer"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="flex-1 flex no-underline">
                      <Button
                        variant="flat"
                        className="w-full text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" className="flex-1 flex no-underline">
                      <Button
                        color="secondary"
                        className="w-full bg-violet-600 text-white hover:bg-violet-700 cursor-pointer"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

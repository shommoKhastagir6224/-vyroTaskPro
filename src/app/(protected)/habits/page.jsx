"use client";

import React, { useState, useEffect, useRef } from "react";
import { RiResetRightFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Button, Checkbox, Input } from "@heroui/react";
import { useTheme } from "@/components/ThemeProvider";

// Helper presets for color customisation
const COLOR_PRESETS = {
  indigo: { name: "Indigo", bg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-600", lightBg: "bg-indigo-50 dark:bg-indigo-950/20" },
  emerald: { name: "Emerald", bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-600", lightBg: "bg-emerald-50 dark:bg-emerald-950/20" },
  amber: { name: "Amber", bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500", lightBg: "bg-amber-50 dark:bg-amber-950/20" },
  rose: { name: "Rose", bg: "bg-rose-600", text: "text-rose-600", border: "border-rose-600", lightBg: "bg-rose-50 dark:bg-rose-950/20" },
  cyan: { name: "Cyan", bg: "bg-cyan-500", text: "text-cyan-500", border: "border-cyan-500", lightBg: "bg-cyan-50 dark:bg-cyan-950/20" },
  violet: { name: "Violet", bg: "bg-violet-600", text: "text-violet-600", border: "border-violet-600", lightBg: "bg-violet-50 dark:bg-violet-950/20" },
};

const DEFAULT_HABITS = [
  { id: "1", name: "Gym", goal: 30, color: "rose", createdAt: new Date().toISOString() },
  { id: "2", name: "Early Wakeup", goal: 30, color: "amber", createdAt: new Date().toISOString() },
  { id: "3", name: "Read 1 Chapter", goal: 30, color: "indigo", createdAt: new Date().toISOString() },
  { id: "4", name: "Meditation", goal: 30, color: "emerald", createdAt: new Date().toISOString() },
  { id: "5", name: "Water Intake", goal: 30, color: "cyan", createdAt: new Date().toISOString() },
];

const MOCK_ARCHIVES = [
  {
    id: "mock_archive_1",
    dateRange: "Sun 28 Jun - Thu 9 Jul",
    overall: "8%",
    dailyAvg: "6%",
    checkins: "9/60",
    streak: "0",
    habits: [
      { name: "Wake up early", status: "Failed (0%)" },
      { name: "Read 1 Chapter", status: "Failed (0%)" },
      { name: "Yoga", status: "Failed (0%)" },
      { name: "Meditate", status: "Failed (0%)" },
      { name: "Write journal", status: "Failed (0%)" },
    ],
  },
];

export default function HabitsTracker() {
  const { dark } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Calendar config (defined first to avoid TDZ reference errors)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-indexed

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const yearDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const checklistContainerRef = useRef(null);

  const router = useRouter();

  const {
    data: session,
    isPending
  } = authClient.useSession();

  // Core States — ALL hooks must be declared before any early return
  const [habitsByMonth, setHabitsByMonth] = useState({});
  const [history, setHistory] = useState({}); // format: { "habitId_YYYY-MM-DD": true }
  const [archives, setArchives] = useState([]); // List of completed/archived habit logs

  // Inline habit editing states
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState("");

  // Form input states for adding habit
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState(30);
  const [newHabitColor, setNewHabitColor] = useState("indigo");

  // Today tracker
  const today = new Date();
  const defaultTodayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [todayStr, setTodayStr] = useState(defaultTodayStr);
  const [clientDateLabel, setClientDateLabel] = useState(today.toLocaleDateString());

  // Auth redirect effect
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  // Outside click handler
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target)) {
        setIsYearOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target)) {
        setIsMonthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Run on mount
  useEffect(() => {
    setMounted(true);

    const savedHabitsByMonth = localStorage.getItem("vyro_habits_by_month");
    const savedHistory = localStorage.getItem("vyro_history");
    const savedArchives = localStorage.getItem("vyro_archives");

    if (savedHabitsByMonth) {
      setHabitsByMonth(JSON.parse(savedHabitsByMonth));
    } else {
      const currentKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
      setHabitsByMonth({
        [currentKey]: DEFAULT_HABITS
      });
    }

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else setHistory({});

    if (savedArchives) setArchives(JSON.parse(savedArchives));
    else setArchives(MOCK_ARCHIVES);
  }, []);

  // Carry forward routines month-to-month
  useEffect(() => {
    if (!mounted || Object.keys(habitsByMonth).length === 0) return;
    const currentKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
    if (!habitsByMonth[currentKey]) {
      // Find the most recent previous month that has habits
      const keys = Object.keys(habitsByMonth).sort();
      const previousKey = keys.reverse().find(k => k < currentKey);
      const defaultList = previousKey ? habitsByMonth[previousKey] : DEFAULT_HABITS;

      setHabitsByMonth(prev => ({
        ...prev,
        [currentKey]: defaultList.map(h => ({
          ...h,
          createdAt: new Date().toISOString()
        }))
      }));
    }
  }, [selectedYear, selectedMonth, habitsByMonth, mounted]);

  // Sync to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("vyro_habits_by_month", JSON.stringify(habitsByMonth));
  }, [habitsByMonth, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("vyro_history", JSON.stringify(history));
  }, [history, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("vyro_archives", JSON.stringify(archives));
  }, [archives, mounted]);

  // Auto-scroll to today's active day column on mount or month switch
  useEffect(() => {
    if (!mounted || !checklistContainerRef.current) return;
    
    const timer = setTimeout(() => {
      const activeCol = checklistContainerRef.current.querySelector("#active-day-col");
      if (activeCol) {
        activeCol.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [mounted, todayStr, selectedMonth, selectedYear, habitsByMonth]);

  // ---- derived values (not hooks, safe after all hooks) ----
  const activeMonthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
  const habits = habitsByMonth[activeMonthKey] || [];

  const setHabits = (newHabitsOrFn) => {
    setHabitsByMonth((prev) => {
      const prevHabits = prev[activeMonthKey] || [];
      const updatedHabits = typeof newHabitsOrFn === "function" ? newHabitsOrFn(prevHabits) : newHabitsOrFn;
      return {
        ...prev,
        [activeMonthKey]: updatedHabits
      };
    });
  };

  // ---- early returns AFTER all hooks ----
  if (isPending || !mounted) return <div>Loading...</div>;
  if (!session) return null;

  // Month info generator
  const getDaysInMonthList = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    while (date.getMonth() === month) {
      days.push({
        dateNumber: date.getDate(),
        dayOfWeek: weekdays[date.getDay()],
        dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysList = getDaysInMonthList(selectedYear, selectedMonth);

  const getWeekColorClass = (dayIndex) => {
    if (dayIndex < 7) return { border: "border-blue-600", bg: "bg-blue-600" };
    if (dayIndex < 14) return { border: "border-orange-500", bg: "bg-orange-500" };
    if (dayIndex < 21) return { border: "border-emerald-600", bg: "bg-emerald-600" };
    if (dayIndex < 28) return { border: "border-yellow-500", bg: "bg-yellow-500" };
    return { border: "border-cyan-500", bg: "bg-cyan-500" };
  };

  const getDaysPassed = () => {
    const todayDate = new Date();
    if (selectedYear < todayDate.getFullYear() || (selectedYear === todayDate.getFullYear() && selectedMonth < todayDate.getMonth())) {
      return daysList.length;
    }
    if (selectedYear > todayDate.getFullYear() || (selectedYear === todayDate.getFullYear() && selectedMonth > todayDate.getMonth())) {
      return 1;
    }
    return todayDate.getDate();
  };

  // Group days into weeks (standard calendar views)
  const weekGroups = [
    { name: "WEEK 01", days: daysList.slice(0, 7), color: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/20" },
    { name: "WEEK 02", days: daysList.slice(7, 14), color: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-900/20" },
    { name: "WEEK 03", days: daysList.slice(14, 21), color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/20" },
    { name: "WEEK 04", days: daysList.slice(21, 28), color: "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-900/20" },
    { name: "WEEK 05", days: daysList.slice(28), color: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-100 dark:border-cyan-900/20" },
  ];

  // Helper selectors
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Checkbox toggle logic
  const handleToggleCheck = (habitId, dateStr) => {
    // STRICT RULE: Can only edit today's column
    if (dateStr !== todayStr) return;

    setHistory((prev) => {
      const key = `${habitId}_${dateStr}`;
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  };

  // Add a custom habit
  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      goal: Number(newHabitGoal) || 30,
      color: newHabitColor,
      createdAt: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, newHabit]);
    setNewHabitName("");
    setNewHabitGoal(30);
  };

  // Delete/Archive a Habit
  const handleDeleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    // Clean up history key prefix matching this habitId
    setHistory((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${habitId}_`)) {
          delete next[key];
        }
      });
      return next;
    });
  };
  // Force Manual Goal Complete/Archive
  const handleArchiveHabit = (habit) => {
    const habitCheckins = Object.keys(history).filter(
      (key) => key.startsWith(`${habit.id}_`) && history[key]
    ).length;
    const pct = Math.round((habitCheckins / habit.goal) * 100);

    const newArchiveEntry = {
      id: Date.now().toString(),
      dateRange: `${monthNames[selectedMonth].substring(0, 3)} ${selectedYear}`,
      overall: `${pct}%`,
      dailyAvg: `${pct}%`,
      checkins: `${habitCheckins}/${habit.goal}`,
      streak: String(calculateHabitStreak(habit.id)),
      habits: [
        { name: habit.name, status: pct >= 80 ? `Success (${pct}%)` : `Failed (${pct}%)` }
      ]
    };

    setArchives((prev) => [newArchiveEntry, ...prev]);
    handleDeleteHabit(habit.id);
  };

  const handleArchiveCurrentMonth = () => {
    if (habits.length === 0) return;

    // Compile current stats
    const totalChecks = daysList.reduce((acc, d) => acc + getDayCompletedCount(d.dateStr), 0);
    const totalGoals = habits.length * daysList.length;
    const overallPercent = totalGoals > 0 ? Math.round((totalChecks / totalGoals) * 100) : 0;
    const dailyAvgPct = totalGoals > 0 ? Math.round((totalChecks / totalGoals) * 100) : 0;

    const archiveHabitsList = habits.map((h) => {
      const completed = Object.keys(history).filter(
        (key) => key.startsWith(`${h.id}_`) && history[key]
      ).length;
      const pct = h.goal > 0 ? Math.round((completed / h.goal) * 100) : 0;
      return {
        name: h.name,
        status: pct >= 80 ? `Success (${pct}%)` : `Failed (${pct}%)`
      };
    });

    const newArchive = {
      id: Date.now().toString(),
      dateRange: `${daysList[0].dayOfWeek} ${daysList[0].dateNumber} ${monthNames[selectedMonth].substring(0, 3)} - ${daysList[daysList.length - 1].dayOfWeek} ${daysList[daysList.length - 1].dateNumber} ${monthNames[selectedMonth].substring(0, 3)}`,
      overall: `${overallPercent}%`,
      dailyAvg: `${dailyAvgPct}%`,
      checkins: `${totalChecks}/${totalGoals}`,
      streak: String(getMaxActiveStreak()),
      habits: archiveHabitsList
    };

    setArchives((prev) => [newArchive, ...prev]);
  };

  const handleRestoreArchive = (entry) => {
    if (!entry.habits) return;
    const presetColors = Object.keys(COLOR_PRESETS);

    // Add all habits from this archive back to the active list for the selected month/year
    const restoredHabits = entry.habits.map((h) => {
      const randomColor = presetColors[Math.floor(Math.random() * presetColors.length)];
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        name: h.name,
        goal: 30, // Default to 30 days goal
        color: randomColor,
        createdAt: new Date().toISOString()
      };
    });

    setHabits((prev) => {
      const existingNames = prev.map(item => item.name.toLowerCase());
      const newUnique = restoredHabits.filter(item => !existingNames.includes(item.name.toLowerCase()));
      return [...prev, ...newUnique];
    });
  };

  // Streak calculator helper
  const calculateHabitStreak = (habitId) => {
    let currentStreak = 0;
    let tempDate = new Date();

    while (true) {
      const dateStr = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}-${String(tempDate.getDate()).padStart(2, "0")}`;
      const checked = history[`${habitId}_${dateStr}`];
      if (checked) {
        currentStreak++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        // If it's today and not checked yet, continue check to yesterday
        if (dateStr === todayStr) {
          tempDate.setDate(tempDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return currentStreak;
  };

  // Daily statistics calculation
  const getDailyCompletionRate = (dateStr) => {
    if (habits.length === 0) return 0;
    let completedCount = 0;
    habits.forEach((h) => {
      if (history[`${h.id}_${dateStr}`]) completedCount++;
    });
    return (completedCount / habits.length) * 100;
  };

  const getDayCompletedCount = (dateStr) => {
    let completedCount = 0;
    habits.forEach((h) => {
      if (history[`${h.id}_${dateStr}`]) completedCount++;
    });
    return completedCount;
  };

  // Overall statistics
  const totalChecksThisMonth = daysList.reduce((acc, d) => acc + getDayCompletedCount(d.dateStr), 0);
  const totalGoalsThisMonth = habits.length * daysList.length;
  const overallProgressPercent = totalGoalsThisMonth > 0 ? Math.round((totalChecksThisMonth / totalGoalsThisMonth) * 100) : 0;
  const dailyAverageCount = habits.length > 0 ? (totalChecksThisMonth / daysList.length).toFixed(1) : 0;
  const dailyAveragePercent = totalGoalsThisMonth > 0 ? Math.round((totalChecksThisMonth / totalGoalsThisMonth) * 100) : 0;

  // Streak calculations for all active habits
  const getMaxActiveStreak = () => {
    if (habits.length === 0) return 0;
    const streaks = habits.map((h) => calculateHabitStreak(h.id));
    return Math.max(...streaks);
  };

  // SVG Chart path calculation
  const getLineChartPath = () => {
    if (daysList.length === 0) return "";
    const width = 800;
    const height = 120;
    const paddingX = 20;
    const paddingY = 15;
    const innerWidth = width - paddingX * 2;
    const innerHeight = height - paddingY * 2;

    const points = daysList.map((d, index) => {
      const x = paddingX + (index / (daysList.length - 1)) * innerWidth;
      const rate = getDailyCompletionRate(d.dateStr) / 100; // 0 to 1
      const y = height - paddingY - rate * innerHeight;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Curved lines using cubic bezier
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  // Area under line path
  const getAreaChartPath = () => {
    const linePath = getLineChartPath();
    if (!linePath) return "";
    const width = 800;
    const height = 120;
    const paddingX = 20;
    const innerWidth = width - paddingX * 2;

    const startX = paddingX;
    const endX = paddingX + innerWidth;
    const bottomY = height - 15;

    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  return (
    <div className="w-full mt-20 bg-white dark:bg-[#0a0f1e] text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">

        {/* ── HEADER SECTION ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-violet-600 dark:text-violet-400 text-xs font-mono tracking-widest font-bold block uppercase mb-1">
              Habit Telemetry Matrix
            </span>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Habit Tracker
              </h1>
              <div className="px-3 py-1 bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 rounded-full text-xs font-bold font-mono">
                {monthNames[selectedMonth]} {selectedYear}
              </div>
            </div>
            <p className="text-slate-750 dark:text-slate-400 text-sm mt-1 max-w-xl font-medium">
              Lock in your habits with strict calendar check-ins. You can only check off tasks matching the active day ({clientDateLabel || "Today"}).
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Month Settings Selector */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm select-none">
              {/* Year Dropdown */}
              <div className="flex flex-col relative" ref={yearDropdownRef}>
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase leading-none mb-1.5">Year</span>
                <button
                  onClick={() => {
                    setIsYearOpen(!isYearOpen);
                    setIsMonthOpen(false);
                  }}
                  className="bg-transparent text-sm font-black text-slate-700 dark:text-slate-205 focus:outline-none flex items-center gap-1.5 hover:text-violet-600 transition-colors pr-2"
                >
                  {selectedYear}
                  <svg className={`w-3.5 h-3.5 text-gray-500 dark:text-slate-400 transition-transform ${isYearOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isYearOpen && (
                  <div className="absolute top-full left-0 mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100/50 dark:border-slate-800 z-50 py-1.5 min-w-[100px] animate-fade-in duration-200">
                    {[2025, 2026, 2027].map(y => (
                      <button
                        key={y}
                        onClick={() => {
                          setSelectedYear(y);
                          setIsYearOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-all ${
                          selectedYear === y
                            ? "bg-violet-50 dark:bg-violet-950/30 text-violet-650 dark:text-violet-405"
                            : "text-slate-705 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850/50"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-slate-205 dark:bg-slate-850" />

              {/* Month Dropdown */}
              <div className="flex flex-col relative" ref={monthDropdownRef}>
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase leading-none mb-1.5">Month</span>
                <button
                  onClick={() => {
                    setIsMonthOpen(!isMonthOpen);
                    setIsYearOpen(false);
                  }}
                  className="bg-transparent text-sm font-black text-slate-705 dark:text-slate-200 focus:outline-none flex items-center gap-1.5 hover:text-violet-600 transition-colors pr-2"
                >
                  {monthNames[selectedMonth]}
                  <svg className={`w-3.5 h-3.5 text-gray-500 dark:text-slate-400 transition-transform ${isMonthOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMonthOpen && (
                  <div className="absolute top-full left-0 mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100/50 dark:border-slate-800 z-50 py-1.5 min-w-[130px] max-h-60 overflow-y-auto scrollbar-none animate-fade-in duration-200">
                    {monthNames.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedMonth(idx);
                          setIsMonthOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-all ${
                          selectedMonth === idx
                            ? "bg-violet-50 dark:bg-violet-950/30 text-violet-650 dark:text-violet-455"
                            : "text-slate-705 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850/50"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Archive Month Button */}
            <Button
              onClick={handleArchiveCurrentMonth}
              color="success"
              variant="flat"
              className="bg-emerald-100 dark:bg-emerald-950/40 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-300 font-bold h-12 px-4 rounded-xl shadow-sm text-xs"
              disabled={habits.length === 0}
            >
              Archive Period
            </Button>
          </div>
        </div>

        {/* ── METRICS & CHARTS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* Overview Donut Progress */}
          <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
            <h3 className="text-sm font-bold font-mono tracking-wider text-slate-700 dark:text-slate-450 uppercase w-full text-left">
              Monthly Overview
            </h3>

            <div className="relative flex items-center justify-center my-4 w-32 h-32">
              <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-violet-600 transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - overallProgressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {overallProgressPercent}%
                </span>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase mt-1">
                  Complete
                </span>
              </div>
            </div>

            <div className="flex justify-between w-full text-xs font-mono mt-2">
              <div className="flex flex-col items-start">
                <span className="text-slate-400">Target</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{totalGoalsThisMonth} checks</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-slate-400">Left</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{totalGoalsThisMonth - totalChecksThisMonth} left</span>
              </div>
            </div>
          </div>

          {/* Daily Trends Line Chart */}
          <div className="lg:col-span-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold font-mono tracking-wider text-slate-750 dark:text-slate-400 uppercase mb-4">
                Daily Completion Trends
              </h3>
            </div>
            <div className="relative h-[130px] w-full mt-2">
              {habits.length > 0 ? (
                <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                    <line
                      key={ratio}
                      x1="0"
                      y1={15 + ratio * 90}
                      x2="800"
                      y2={15 + ratio * 90}
                      stroke={dark ? "#1f2937" : "#e2e8f0"}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Area fill */}
                  <path d={getAreaChartPath()} fill="url(#chartGrad)" className="transition-all duration-300 ease-in-out" />

                  {/* Main Line path */}
                  <path
                    d={getLineChartPath()}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-in-out"
                  />

                  {/* Interactive points */}
                  {daysList.map((d, index) => {
                    const rate = getDailyCompletionRate(d.dateStr) / 100;
                    const x = 20 + (index / (daysList.length - 1)) * 760;
                    const y = 120 - 15 - rate * 90;
                    const activePoint = d.dateStr === todayStr;
                    return (
                      <circle
                        key={d.dateStr}
                        cx={x}
                        cy={y}
                        r={activePoint ? "5" : "3"}
                        fill={activePoint ? "#a78bfa" : "#8b5cf6"}
                        stroke={activePoint ? "#ffffff" : "none"}
                        strokeWidth="1.5"
                        className="transition-all duration-300 ease-in-out"
                      />
                    );
                  })}
                </svg>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-xs font-mono">
                  No active habits to plot
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <span>Day 1</span>
              <span>Day {daysList.length}</span>
            </div>
          </div>

          {/* Leaderboard - Top Habits */}
          <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold font-mono tracking-wider text-slate-750 dark:text-slate-400 uppercase">
              Top Daily Habits
            </h3>

            <div className="space-y-3 my-4 overflow-y-auto max-h-[140px] pr-1 scrollbar-none">
              {habits.length > 0 ? (
                habits
                  .map((h) => {
                    const daysPassed = getDaysPassed();
                    const completed = Object.keys(history).filter(
                      (key) => key.startsWith(`${h.id}_`) && history[key] &&
                        daysList.some(d => d.dateStr === key.split("_")[1])
                    ).length;
                    const percent = daysPassed > 0 ? Math.round((completed / daysPassed) * 100) : 0;
                    return { ...h, percent };
                  })
                  .sort((a, b) => b.percent - a.percent)
                  .map((h, i) => (
                    <div key={h.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-slate-400 w-4">{i + 1}</span>
                        <span className="font-bold truncate text-slate-700 dark:text-slate-200">{h.name}</span>
                      </div>
                      <span className={`font-bold shrink-0 ${COLOR_PRESETS[h.color]?.text || "text-slate-400"}`}>
                        {h.percent}%
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-slate-400 text-xs font-mono text-center py-6">
                  No active habits
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-[10px] font-mono text-slate-400">
              Active Streak: <span className="font-bold text-slate-700 dark:text-slate-200">{getMaxActiveStreak()} days</span>
            </div>
          </div>
        </div>

        {/* ── MIDDLE OVERVIEW MATRIX (GLOBAL PROGRESS & WEEKLY PROGRESS) ── */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <h3 className="text-sm font-bold font-mono tracking-wider text-slate-750 dark:text-slate-400 uppercase">
              Global Period Performance Overview
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[9px] font-mono text-slate-750 dark:text-slate-400">
                  <th className="p-3 pl-6 font-bold uppercase text-slate-750 dark:text-slate-400 text-left w-[180px] sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    Overview Metrics
                  </th>
                  {daysList.map((d) => (
                    <th key={d.dateStr} className="p-2 text-center min-w-[34px] border-r border-slate-100 dark:border-slate-800/40 text-slate-800 dark:text-slate-300 font-bold">
                      {d.dateNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 1. Global Progress vertical bars */}
                <tr className="border-b border-slate-100 dark:border-slate-800/60">
                  <td className="p-3 pl-6 sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-xs font-bold text-slate-750 dark:text-slate-400 uppercase tracking-tight">
                    Global Progress
                  </td>
                  {daysList.map((d) => {
                    const rate = getDailyCompletionRate(d.dateStr);
                    return (
                      <td key={d.dateStr} className="p-1 border-r border-slate-100 dark:border-slate-800/40 text-center">
                        <div className="h-10 w-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-full relative overflow-hidden flex items-end mx-auto">
                          <div className="bg-blue-500 w-full" style={{ height: `${rate}%` }} />
                        </div>
                      </td>
                    );
                  })}
                </tr>
                {/* 2. Completed count */}
                <tr className="border-b border-slate-100 dark:border-slate-800/60 text-xs font-mono">
                  <td className="p-3 pl-6 sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-bold text-slate-750 dark:text-slate-400 uppercase tracking-tight">
                    Completed
                  </td>
                  {daysList.map((d) => (
                    <td key={d.dateStr} className="p-2 text-center border-r border-slate-100 dark:border-slate-800/40 font-black text-slate-900 dark:text-slate-100 text-[13px]">
                      {getDayCompletedCount(d.dateStr)}
                    </td>
                  ))}
                </tr>
                {/* 3. Goal count */}
                <tr className="border-b border-slate-100 dark:border-slate-800/60 text-xs font-mono text-slate-500">
                  <td className="p-3 pl-6 sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-bold text-slate-750 dark:text-slate-400 uppercase tracking-tight">
                    Goal
                  </td>
                  {daysList.map((d) => (
                    <td key={d.dateStr} className="p-2 text-center border-r border-slate-100 dark:border-slate-800/40 font-bold">
                      {habits.length}
                    </td>
                  ))}
                </tr>
                {/* 4. Left count */}
                <tr className="border-b border-slate-100 dark:border-slate-800/60 text-xs font-mono text-rose-600">
                  <td className="p-3 pl-6 sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-bold text-slate-750 dark:text-slate-400 uppercase tracking-tight">
                    Left
                  </td>
                  {daysList.map((d) => (
                    <td key={d.dateStr} className="p-2 text-center border-r border-slate-100 dark:border-slate-800/40 font-bold">
                      {Math.max(0, habits.length - getDayCompletedCount(d.dateStr))}
                    </td>
                  ))}
                </tr>
                {/* 5. Weekly Progress summary percentages */}
                <tr className="text-xs font-mono bg-slate-50/10 dark:bg-slate-900/5">
                  <td className="p-3 pl-6 sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-bold text-slate-750 dark:text-slate-400 uppercase tracking-tight">
                    Weekly Progress
                  </td>
                  {weekGroups.map((group) => {
                    if (group.days.length === 0) return null;
                    const weekChecks = group.days.reduce((acc, d) => acc + getDayCompletedCount(d.dateStr), 0);
                    const weekGoals = habits.length * group.days.length;
                    const pct = weekGoals > 0 ? Math.round((weekChecks / weekGoals) * 100) : 0;
                    return (
                      <td
                        key={group.name}
                        colSpan={group.days.length}
                        className="p-3 text-center border-r border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300"
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-400">{weekChecks}/{weekGoals}</span>

                          {/* Miniature SVG Pie Chart - Scaled Up */}
                          <div className="relative w-20 h-20 flex items-center justify-center my-1">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                              {/* Background circle */}
                              <circle
                                cx="16"
                                cy="16"
                                r="12"
                                className="stroke-slate-200 dark:stroke-slate-800"
                                strokeWidth="3"
                                fill="transparent"
                              />
                              {/* Foreground pie progress */}
                              <circle
                                cx="16"
                                cy="16"
                                r="12"
                                className="stroke-violet-600 dark:stroke-violet-405 transition-all duration-500"
                                strokeWidth="3.5"
                                strokeDasharray={2 * Math.PI * 12}
                                strokeDashoffset={2 * Math.PI * 12 * (1 - pct / 100)}
                                strokeLinecap="round"
                                fill="transparent"
                              />
                            </svg>
                            <span className="absolute text-sm font-black text-slate-905 dark:text-slate-205 leading-none">
                              {pct}%
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── ROUTINE MATRIX CONTAINER (SPLIT LAYOUT) ── */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">

          {/* Left Box: Checklist Table */}
          <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
              <h3 className="text-sm font-bold font-mono tracking-wider text-slate-750 dark:text-slate-400 uppercase">
                Routine Checklist Matrix
              </h3>
              <div className="flex gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-750 dark:text-slate-400 font-bold">
                  <span className="w-3 h-3 bg-violet-600 rounded-sm" /> Today (Active)
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-500 font-semibold">
                  <span className="w-3 h-3 border border-slate-300 dark:border-slate-800 rounded-sm" /> Locked
                </span>
              </div>
            </div>

            <div ref={checklistContainerRef} className="overflow-x-auto flex-1 scrollbar-none">
              <table className="w-full border-collapse">
                <thead>
                  {/* Week Headers */}
                  <tr className="h-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10">
                    <th className="p-2 pl-4 text-left font-black text-xs uppercase text-slate-750 dark:text-slate-350 w-[180px] sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Daily Habits
                    </th>
                    <th className="p-2 text-center font-black text-xs uppercase text-slate-750 dark:text-slate-350 w-[70px]">
                      Goals
                    </th>
                    {weekGroups.map((group) => (
                      group.days.length > 0 && (
                        <th
                          key={group.name}
                          colSpan={group.days.length}
                          className={`p-1.5 text-center text-[9px] font-mono font-black border-r border-slate-200 dark:border-slate-800 ${group.color}`}
                        >
                          {group.name}
                        </th>
                      )
                    ))}
                  </tr>
                  {/* Date numbers header */}
                  <tr className="h-10 border-b border-slate-200 dark:border-slate-800 text-[9px] font-mono text-slate-700 dark:text-slate-450 font-bold">
                    <th className="p-2 font-black uppercase text-slate-750 dark:text-slate-400 text-left pl-4 sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Habit Name
                    </th>
                    <th className="p-2 text-center text-slate-700 dark:text-slate-400 font-bold">days</th>
                    {daysList.map((d) => {
                      const isActive = d.dateStr === todayStr;
                      return (
                        <th
                          key={d.dateStr}
                          id={isActive ? "active-day-col" : undefined}
                          className={`p-2 text-center min-w-[34px] border-r border-slate-100 dark:border-slate-800/40 ${isActive ? "bg-violet-100/50 dark:bg-violet-950/20 font-black text-violet-600 dark:text-violet-400" : ""
                            }`}
                        >
                          <div>{d.dayOfWeek.substring(0, 1)}</div>
                          <div className={`mt-0.5 font-bold ${isActive ? "text-[11px]" : ""}`}>{d.dateNumber}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => (
                    <tr
                      key={habit.id}
                      className="h-12 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                    >
                      {/* Name */}
                      <td className="p-2 pl-4 sticky left-0 bg-white dark:bg-[#111827] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center gap-2 group justify-between h-8 min-w-[160px]">
                          {editingHabitId === habit.id ? (
                            <div className="flex items-center gap-1.5 w-full">
                              <input
                                value={editingHabitName}
                                onChange={(e) => setEditingHabitName(e.target.value)}
                                className="text-xs px-1.5 py-1 border border-slate-350 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-md w-full focus:outline-none text-slate-900 dark:text-white font-semibold"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    if (editingHabitName.trim()) {
                                      setHabits((prev) =>
                                        prev.map((h) => (h.id === habit.id ? { ...h, name: editingHabitName.trim() } : h))
                                      );
                                    }
                                    setEditingHabitId(null);
                                  } else if (e.key === "Escape") {
                                    setEditingHabitId(null);
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  if (editingHabitName.trim()) {
                                    setHabits((prev) =>
                                      prev.map((h) => (h.id === habit.id ? { ...h, name: editingHabitName.trim() } : h))
                                    );
                                  }
                                  setEditingHabitId(null);
                                }}
                                className="text-emerald-600 hover:text-emerald-700 shrink-0 p-0.5"
                                title="Save"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setEditingHabitId(null)}
                                className="text-slate-500 hover:text-slate-600 shrink-0 p-0.5"
                                title="Cancel"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_PRESETS[habit.color]?.bg}`} />
                                <span className="font-black text-[13px] truncate max-w-[100px] text-slate-900 dark:text-slate-50">
                                  {habit.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingHabitId(habit.id);
                                    setEditingHabitName(habit.name);
                                  }}
                                  className="text-slate-500 hover:text-violet-600 transition-colors p-0.5"
                                  title="Rename"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteHabit(habit.id)}
                                  className="text-slate-500 hover:text-rose-600 transition-colors p-0.5"
                                  title="Delete"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Goal */}
                      <td className="p-2 text-center text-xs font-mono font-bold text-slate-500">
                        {habit.goal}
                      </td>
                      {/* Checkboxes */}
                      {daysList.map((d, dayIdx) => {
                        const isChecked = !!history[`${habit.id}_${d.dateStr}`];
                        const isActiveToday = d.dateStr === todayStr;
                        const weekColor = getWeekColorClass(dayIdx);
                        return (
                          <td
                            key={d.dateStr}
                            className={`p-1.5 text-center border-r border-slate-100 dark:border-slate-800/40 ${isActiveToday ? "bg-violet-100/20 dark:bg-violet-950/10" : ""
                              }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (isActiveToday) {
                                  handleToggleCheck(habit.id, d.dateStr);
                                }
                              }}
                              disabled={!isActiveToday}
                              className={`w-5 h-5 rounded flex items-center justify-center transition-all ${isChecked
                                  ? `${weekColor.bg} ${weekColor.border} text-white`
                                  : isActiveToday
                                    ? `bg-transparent ${weekColor.border} border-2 hover:scale-110 shadow-sm cursor-pointer`
                                    : `bg-transparent border border-slate-300 dark:border-slate-800 cursor-not-allowed`
                                }`}
                            >
                              {isChecked && (
                                <svg className="w-3.5 h-3.5 stroke-[4.5px] text-white animate-appearance-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {habits.length === 0 && (
                    <tr className="h-24">
                      <td colSpan={daysList.length + 2} className="p-8 text-center text-slate-400 text-xs font-mono">
                        No active habits initialized. Add custom habits above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Box: PROGRESS Sidebar Card */}
          <div className="w-full lg:w-[350px] shrink-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-violet-600 dark:text-violet-400">
                Progress Status
              </h3>
              <span className="text-[10px] font-mono font-bold bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">
                Telemetry
              </span>
            </div>

            <div className="flex-1 overflow-x-auto scrollbar-none">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="h-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 text-[9px] font-mono text-slate-500">
                    <th className="p-2 text-center">Comp</th>
                    <th className="p-2 text-center">Left</th>
                    <th className="p-2 text-center">%</th>
                    <th className="p-2 text-left w-[130px]">Progress Chart</th>
                    <th className="p-2 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => {
                    const completedCount = Object.keys(history).filter(
                      (key) => key.startsWith(`${habit.id}_`) && history[key]
                    ).length;
                    const leftCount = Math.max(0, habit.goal - completedCount);
                    const progressPct = habit.goal > 0 ? Math.round((completedCount / habit.goal) * 100) : 0;
                    const colorConfig = COLOR_PRESETS[habit.color] || COLOR_PRESETS.indigo;

                    return (
                      <tr
                        key={habit.id}
                        className="h-12 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                      >
                        <td className="p-2 text-center text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
                          {completedCount}
                        </td>
                        <td className="p-2 text-center text-xs font-mono font-bold text-slate-400">
                          {leftCount}
                        </td>
                        <td className={`p-2 text-center text-xs font-mono font-black ${colorConfig.text}`}>
                          {progressPct}%
                        </td>
                        <td className="p-2">
                          <div className="flex h-3 w-full rounded bg-rose-500 dark:bg-rose-950/40 overflow-hidden shrink-0">
                            <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              className="bg-emerald-100 dark:bg-emerald-950/40 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 text-[9px] rounded-md transition-colors"
                              onClick={() => handleArchiveHabit(habit)}
                              title="Archive Habit"
                            >
                              Done
                            </button>
                            <button
                              className="bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-200 text-rose-700 dark:text-rose-300 font-bold px-1.5 py-0.5 text-[9px] rounded-md transition-colors"
                              onClick={() => handleDeleteHabit(habit.id)}
                              title="Delete Habit"
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {habits.length === 0 && (
                    <tr className="h-24">
                      <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-mono">
                        No telemetry logs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── HABITS CONTROL & CREATION FORMS (REPOSITIONED) ── */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-8">
          <h3 className="text-sm font-bold font-mono tracking-wider text-slate-400 uppercase mb-4">
            Initialize Custom Habit
          </h3>
          <form onSubmit={handleAddHabit} className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[280px]">
              <Input
                label="Habit Name"
                placeholder="e.g. Write Journal"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                variant="bordered"
                radius="lg"
                className="w-full  text-slate-800 dark:text-white"
              />
            </div>

            <div className="w-full md:w-32">
              <Input
                type="number"
                label="Goal (Days)"
                placeholder="30"
                value={newHabitGoal}
                onChange={(e) => setNewHabitGoal(Math.max(1, Number(e.target.value)))}
                variant="bordered"
                radius="lg"
                className="w-full text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col gap-1 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 mb-1">Accent UI Color</span>
              <div className="flex gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
                {Object.keys(COLOR_PRESETS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setNewHabitColor(key)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${COLOR_PRESETS[key].bg} ${newHabitColor === key ? "border-slate-900 dark:border-white scale-110" : "border-transparent"
                      }`}
                    title={COLOR_PRESETS[key].name}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              color="secondary"
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold h-12 px-6 rounded-xl w-full md:w-auto shrink-0"
            >
              Add Habit
            </Button>
          </form>

          {/* Quick presets buttons */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Presets:</span>
            {["Gym", "Early Wakeup", "Read 1 Chapter", "Meditation", "Water Intake", "Write Journal"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setNewHabitName(preset);
                  const randomColor = Object.keys(COLOR_PRESETS)[Math.floor(Math.random() * Object.keys(COLOR_PRESETS).length)];
                  setNewHabitColor(randomColor);
                }}
                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* ── ARCHIVED/FINISHED GOALS SECTION ── */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <svg
              className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Previous Period Archives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archives.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 pb-14 shadow-md dark:shadow-xl relative overflow-hidden transition-all duration-300"
              >
                {/* Header card meta */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-400 uppercase tracking-wider">{entry.dateRange}</span>
                  </div>
                  <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-bold font-mono">
                    Archived
                  </span>
                </div>

                {/* Main Stats columns */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 text-slate-800 dark:text-slate-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight block">Overall</span>
                    <span className="text-xl font-black text-teal-600 dark:text-teal-400">{entry.overall || "100%"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight block">Daily Avg</span>
                    <span className="text-xl font-black text-teal-600 dark:text-teal-400">{entry.dailyAvg || "100%"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight block">Check-ins</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{entry.checkins}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight block">Streak</span>
                    <span className="text-xl font-black text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      {entry.streak}
                      <span className="text-xs text-slate-500">days</span>
                    </span>
                  </div>
                </div>

                {/* Habit title list details */}
                <div className="space-y-2 pr-1">
                  {entry.habits ? entry.habits.map((h, idx) => {
                    const isSuccess = h.status.includes("Success") || h.status.includes("Completed") || parseFloat(h.status.match(/\d+/)?.[0] || 0) >= 80;
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800/40 pb-1.5 last:border-0 last:pb-0 text-slate-800 dark:text-slate-200">
                        <span className="text-slate-800 dark:text-slate-300 font-bold truncate max-w-[155px]">{h.name}</span>
                        <span className={`font-mono text-[11px] font-black shrink-0 ${isSuccess ? "text-teal-600 dark:text-teal-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {h.status}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="flex justify-between items-center text-xs text-slate-800 dark:text-slate-350 font-bold">
                      <span>{entry.name}</span>
                      <span className="text-teal-600 dark:text-teal-400 font-black">{entry.status}</span>
                    </div>
                  )}
                </div>

                {/* Actions container */}
                <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm z-10">
                  {/* Restore Icon */}
                  <button
                    onClick={() => handleRestoreArchive(entry)}
                    className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors p-1 focus:outline-none"
                    title="Restore habits to active list"
                  >
                    <svg className="w-3.5 mt-1 h-3.5 text-2xl stroke-[2.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <RiResetRightFill />
                    </svg>
                  </button>
                  <div className="w-px h-4.5 bg-slate-300 dark:bg-slate-800" />
                  {/* Delete Icon */}
                  <button
                    onClick={() => setArchives((prev) => prev.filter((a) => a.id !== entry.id))}
                    className="text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-0.5 focus:outline-none"
                    title="Delete from archives"
                  >
                    <svg className="w-3.5 mt-0.5 h-3.5 text-2xl stroke-[2.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <AiFillDelete />
                    </svg>
                  </button>
                </div>

                {/* Clear entry button
                <button
                  onClick={() => setArchives((prev) => prev.filter((a) => a.id !== entry.id))}
                  className="absolute bottom-2 right-2 text-slate-500 hover:text-slate-300 transition-colors text-[10px] font-mono focus:outline-none"
                  title="Remove from history"
                >
                  [Dismiss]
                </button> */}
              </div>
            ))}

            {archives.length === 0 && (
              <div className="col-span-full bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs font-mono">
                No goals archived in previous periods yet. When you click &quot;Complete&quot; on a habit, it compiles logs here.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

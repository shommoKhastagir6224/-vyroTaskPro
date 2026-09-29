"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Checkbox, Input } from "@heroui/react";
import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const INITIAL_ROUTINE = {
  Saturday: [
    { id: "sat_1", slotTime: "07:00 AM", subject: "Mathematics", startHour: 7, startMin: 0, duration: 50, completed: false },
    { id: "sat_2", slotTime: "08:00 AM", subject: "Physics", startHour: 8, startMin: 0, duration: 50, completed: false },
    { id: "sat_3", slotTime: "09:00 AM", subject: "Chemistry", startHour: 9, startMin: 0, duration: 50, completed: false },
    { id: "sat_4", slotTime: "10:00 AM", subject: "English Literature", startHour: 10, startMin: 0, duration: 50, completed: false },
    { id: "sat_5", slotTime: "11:00 AM", subject: "Biology Lab", startHour: 11, startMin: 0, duration: 50, completed: false },
    { id: "sat_6", slotTime: "12:00 PM", subject: "World History", startHour: 12, startMin: 0, duration: 50, completed: false },
  ],
  Sunday: [
    { id: "sun_1", slotTime: "07:00 AM", subject: "Algebra Practice", startHour: 7, startMin: 0, duration: 50, completed: false },
    { id: "sun_2", slotTime: "08:00 AM", subject: "Physics Seminar", startHour: 8, startMin: 0, duration: 50, completed: false },
    { id: "sun_3", slotTime: "09:00 AM", subject: "Organic Chemistry", startHour: 9, startMin: 0, duration: 50, completed: false },
    { id: "sun_4", slotTime: "10:00 AM", subject: "Grammar & Writing", startHour: 10, startMin: 0, duration: 50, completed: false },
    { id: "sun_5", slotTime: "11:00 AM", subject: "Computer Programming", startHour: 11, startMin: 0, duration: 50, completed: false },
    { id: "sun_6", slotTime: "12:00 PM", subject: "Geography", startHour: 12, startMin: 0, duration: 50, completed: false },
  ],
  Monday: [
    { id: "mon_1", slotTime: "07:00 AM", subject: "Calculus", startHour: 7, startMin: 0, duration: 50, completed: false },
    { id: "mon_2", slotTime: "08:00 AM", subject: "Electromagnetism", startHour: 8, startMin: 0, duration: 50, completed: false },
    { id: "mon_3", slotTime: "09:00 AM", subject: "Biochemistry", startHour: 9, startMin: 0, duration: 50, completed: false },
    { id: "mon_4", slotTime: "10:00 AM", subject: "Creative Writing", startHour: 10, startMin: 0, duration: 50, completed: false },
    { id: "mon_5", slotTime: "11:00 AM", subject: "Algorithms Lab", startHour: 11, startMin: 0, duration: 50, completed: false },
    { id: "mon_6", slotTime: "12:00 PM", subject: "Civics & Politics", startHour: 12, startMin: 0, duration: 50, completed: false },
  ],
  Tuesday: [
    { id: "tue_1", slotTime: "07:00 AM", subject: "Statistics", startHour: 7, startMin: 0, duration: 50, completed: false },
    { id: "tue_2", slotTime: "08:00 AM", subject: "Thermodynamics", startHour: 8, startMin: 0, duration: 50, completed: false },
    { id: "tue_3", slotTime: "09:00 AM", subject: "Inorganic Chemistry", startHour: 9, startMin: 0, duration: 50, completed: false },
    { id: "tue_4", slotTime: "10:00 AM", subject: "Spanish Language", startHour: 10, startMin: 0, duration: 50, completed: false },
    { id: "tue_5", slotTime: "11:00 AM", subject: "Database Systems", startHour: 11, startMin: 0, duration: 50, completed: false },
    { id: "tue_6", slotTime: "12:00 PM", subject: "Economics", startHour: 12, startMin: 0, duration: 50, completed: false },
  ],
  Wednesday: [
    { id: "wed_1", slotTime: "07:00 AM", subject: "Geometry", startHour: 7, startMin: 0, duration: 50, completed: false },
    { id: "wed_2", slotTime: "08:00 AM", subject: "Mechanics Lab", startHour: 8, startMin: 0, duration: 50, completed: false },
    { id: "wed_3", slotTime: "09:00 AM", subject: "Genetics Theory", startHour: 9, startMin: 0, duration: 50, completed: false },
    { id: "wed_4", slotTime: "10:00 AM", subject: "French Language", startHour: 10, startMin: 0, duration: 50, completed: false },
    { id: "wed_5", slotTime: "11:00 AM", subject: "Web Development", startHour: 11, startMin: 0, duration: 50, completed: false },
    { id: "wed_6", slotTime: "12:00 PM", subject: "Social Sciences", startHour: 12, startMin: 0, duration: 50, completed: false },
  ],
  Thursday: [
    { id: "thu_1", slotTime: "07:00 AM", subject: "Discrete Maths", startHour: 7, startMin: 0, duration: 50, completed: false },
    { id: "thu_2", slotTime: "08:00 AM", subject: "Optics & Light", startHour: 8, startMin: 0, duration: 50, completed: false },
    { id: "thu_3", slotTime: "09:00 AM", subject: "Physical Chemistry", startHour: 9, startMin: 0, duration: 50, completed: false },
    { id: "thu_4", slotTime: "10:00 AM", subject: "English Seminar", startHour: 10, startMin: 0, duration: 50, completed: false },
    { id: "thu_5", slotTime: "11:00 AM", subject: "Software Engineering", startHour: 11, startMin: 0, duration: 50, completed: false },
    { id: "thu_6", slotTime: "12:00 PM", subject: "Art History", startHour: 12, startMin: 0, duration: 50, completed: false },
  ],
  Friday: [
    { id: "fri_1", slotTime: "07:00 AM", subject: "Calculus Review", startHour: 7, startMin: 0, duration: 50, completed: false },
    { id: "fri_2", slotTime: "08:00 AM", subject: "Physics Seminar", startHour: 8, startMin: 0, duration: 50, completed: false },
    { id: "fri_3", slotTime: "09:00 AM", subject: "Chemistry Seminar", startHour: 9, startMin: 0, duration: 50, completed: false },
    { id: "fri_4", slotTime: "10:00 AM", subject: "Presentation Prep", startHour: 10, startMin: 0, duration: 50, completed: false },
    { id: "fri_5", slotTime: "11:00 AM", subject: "Weekly Quiz Mock", startHour: 11, startMin: 0, duration: 50, completed: false },
    { id: "fri_6", slotTime: "12:00 PM", subject: "Free Lab Project", startHour: 12, startMin: 0, duration: 50, completed: false },
  ]
};

const DAYS_ORDER = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DAY_COLOR_THEMES = {
  Saturday: {
    stroke: "stroke-indigo-600 dark:stroke-indigo-400",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    border: "border-indigo-200 dark:border-indigo-900/60"
  },
  Sunday: {
    stroke: "stroke-violet-600 dark:stroke-violet-400",
    bg: "bg-violet-50/50 dark:bg-violet-950/20",
    border: "border-violet-200 dark:border-violet-900/60"
  },
  Monday: {
    stroke: "stroke-teal-600 dark:stroke-teal-400",
    bg: "bg-teal-50/50 dark:bg-teal-950/20",
    border: "border-teal-200 dark:border-teal-900/60"
  },
  Tuesday: {
    stroke: "stroke-emerald-600 dark:stroke-emerald-400",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-900/60"
  },
  Wednesday: {
    stroke: "stroke-orange-600 dark:stroke-orange-400",
    bg: "bg-orange-50/50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-900/60"
  },
  Thursday: {
    stroke: "stroke-rose-600 dark:stroke-rose-400",
    bg: "bg-rose-50/50 dark:bg-rose-950/20",
    border: "border-rose-200 dark:border-rose-900/60"
  },
  Friday: {
    stroke: "stroke-blue-600 dark:stroke-blue-400",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-900/60"
  }
};

const triggerAlarmSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (startTime, duration, frequency) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, startTime);
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const now = audioCtx.currentTime;
    playBeep(now, 0.15, 880);
    playBeep(now + 0.25, 0.15, 880);
    playBeep(now + 0.5, 0.4, 880);
  } catch (err) {
    console.error("Web Audio API not supported or user interaction required:", err);
  }
};

export default function RoutinePage() {
  const { dark } = useTheme();

  const [routine, setRoutine] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("student_routine");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error("Failed to load local student routine data", e); }
      }
    }
    return INITIAL_ROUTINE;
  });

   const router = useRouter();

    const {
        data: session,
        isPending
    } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/");
        }
    }, [session, isPending, router]);


  const [currentTime, setCurrentTime] = useState(null);
  const [todayDayName, setTodayDayName] = useState("");
  const [todayStrLabel, setTodayStrLabel] = useState("");
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [activeDayName, setActiveDayName] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isStopwatchPaused, setIsStopwatchPaused] = useState(false);
  const [isShortView, setIsShortView] = useState(false);
  const [isTransitionCountdownActive, setIsTransitionCountdownActive] = useState(false);
  const [transitionSeconds, setTransitionSeconds] = useState(5);
  const [nextPendingSession, setNextPendingSession] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem("student_routine", JSON.stringify(routine));
  }, [routine]);

  const [slotDurations, setSlotDurations] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("student_routine_durations");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error("Failed to load local student routine durations", e); }
      }
    }
    return [50, 50, 50, 50, 50, 50];
  });

  useEffect(() => {
    localStorage.setItem("student_routine_durations", JSON.stringify(slotDurations));
  }, [slotDurations]);

  const [weeklyHistory, setWeeklyHistory] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("student_routine_history");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error("Failed to load local student routine history", e); }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("student_routine_history", JSON.stringify(weeklyHistory));
  }, [weeklyHistory]);

  useEffect(() => {
    setCurrentTime(new Date());
    const updateTimeAndDay = () => {
      const d = new Date();
      setCurrentTime(d);
      const dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      setTodayDayName(dayList[d.getDay()]);
      setTodayStrLabel(d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTimeAndDay();
    const interval = setInterval(updateTimeAndDay, 1000);
    return () => clearInterval(interval);
  }, []);

  const parseTimeString = (timeStr) => {
    const regex = /(\d+):(\d+)\s*(AM|PM)?/i;
    const match = timeStr.match(regex);
    if (!match) return { hour: 0, min: 0 };
    let hour = parseInt(match[1]);
    const min = parseInt(match[2]);
    const ampm = match[3];
    if (ampm) {
      if (ampm.toUpperCase() === "PM" && hour < 12) hour += 12;
      if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;
    }
    return { hour, min };
  };

  const updateCell = (day, id, field, value) => {
    setRoutine(prev => {
      const updatedList = prev[day].map(item => {
        if (item.id === id) {
          const newItem = { ...item, [field]: value };
          if (field === "slotTime") {
            const { hour, min } = parseTimeString(value);
            newItem.startHour = hour;
            newItem.startMin = min;
          }
          return newItem;
        }
        return item;
      });
      return { ...prev, [day]: updatedList };
    });
  };

  const startFocusMode = (sessionItem, dayName, slotIndex) => {
    setActiveSession({ ...sessionItem, slotIndex });
    setActiveDayName(dayName);
    const durationMinutes = slotDurations[slotIndex] || 50;
    const durationSeconds = durationMinutes * 60;
    setSecondsRemaining(durationSeconds);
    setTotalSeconds(durationSeconds);
    setIsFocusModeActive(true);
    setIsStopwatchPaused(false);
    addToast(`Focus session started for ${sessionItem.subject} (${durationMinutes} mins)!`, "info");
  };

  useEffect(() => {
    if (!currentTime || isFocusModeActive || isTransitionCountdownActive) return;
    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    const currentSec = currentTime.getSeconds();
    const todaySlots = routine[todayDayName] || [];
    const matchedIndex = todaySlots.findIndex(r => r.startHour === currentHour && r.startMin === currentMin && !r.completed && r.subject.trim() !== "");
    if (matchedIndex !== -1 && currentSec === 0) {
      startFocusMode(todaySlots[matchedIndex], todayDayName, matchedIndex);
    }
  }, [currentTime, routine, todayDayName, isFocusModeActive, isTransitionCountdownActive, slotDurations]);

  useEffect(() => {
    if (!isFocusModeActive || isStopwatchPaused) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        const nextSecs = prev - (1 * speedMultiplier);
        if (prev > 300 && nextSecs <= 300) addToast(`5 minutes left in focus session!`, "warning");
        if (nextSecs <= 0) {
          clearInterval(timer);
          triggerAlarmSound();
          handleSessionComplete();
          return 0;
        }
        return nextSecs;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFocusModeActive, isStopwatchPaused, speedMultiplier]);

  function handleSessionComplete() {
    setIsFocusModeActive(false);
    setRoutine(prev => {
      const updatedList = prev[activeDayName].map(item => item.id === activeSession.id ? { ...item, completed: true } : item);
      return { ...prev, [activeDayName]: updatedList };
    });
    addToast(`Session completed: ${activeSession.subject}!`, "success");
    const currentList = routine[activeDayName] || [];
    const currentIndex = currentList.findIndex(r => r.id === activeSession.id);
    let nextSession = null;
    let nextSessionIndex = -1;
    if (currentIndex !== -1 && currentIndex + 1 < currentList.length) {
      const candidate = currentList[currentIndex + 1];
      if (candidate.subject.trim() !== "") {
        nextSession = candidate;
        nextSessionIndex = currentIndex + 1;
      }
    }
    if (nextSession) {
      setNextPendingSession({ ...nextSession, slotIndex: nextSessionIndex });
      setTransitionSeconds(5);
      setIsTransitionCountdownActive(true);
    } else {
      addToast(`All scheduled routine sessions for today are completed!`, "success");
    }
  }

  useEffect(() => {
    if (!isTransitionCountdownActive || !nextPendingSession) return;
    const timer = setInterval(() => {
      setTransitionSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTransitionCountdownActive(false);
          startFocusMode(nextPendingSession, activeDayName, nextPendingSession.slotIndex);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTransitionCountdownActive, nextPendingSession, activeDayName]);

  function addToast(message, type = "info") {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  }

  const handleTriggerTestSession = () => {
    if (!todayDayName) return;
    const testStartTime = new Date(Date.now() + 5000);
    const hours = testStartTime.getHours();
    const mins = testStartTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    const formattedMin = String(mins).padStart(2, "0");
    const testTimeString = `${formattedHour}:${formattedMin} ${ampm}`;
    setRoutine(prev => {
      const updatedList = [...prev[todayDayName]];
      updatedList[0] = { ...updatedList[0], subject: "Simulated Focus Task", slotTime: testTimeString, startHour: hours, startMin: mins, duration: 1, completed: false };
      return { ...prev, [todayDayName]: updatedList };
    });
    addToast("Simulation scheduled! Focus starts automatically in 5 seconds.", "info");
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const stats = React.useMemo(() => {
    let total = 0; let completed = 0;
    DAYS_ORDER.forEach(day => {
      (routine[day] || []).forEach(slot => {
        if (slot.subject.trim() !== "") { total++; if (slot.completed) completed++; }
      });
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [routine]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleResetAll = () => {
    if (confirm("Are you sure you want to reset the routine grid and clear all status checks?")) {
      setRoutine(INITIAL_ROUTINE);
      setIsFocusModeActive(false);
      setIsTransitionCountdownActive(false);
      localStorage.removeItem("student_routine");
      addToast("Student routine reset to default values.", "info");
    }
  };

  const handleArchiveWeek = () => {
    const startOfWeek = new Date();
    const dayIndex = startOfWeek.getDay();
    const diff = (dayIndex === 6 ? 0 : - (dayIndex + 1));
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const label = `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    const dailyDetails = DAYS_ORDER.map(day => {
      const slots = routine[day] || [];
      const totalSlots = slots.filter(s => s.subject.trim() !== "").length;
      const completedSlots = slots.filter(s => s.subject.trim() !== "" && s.completed).length;
      return { day, completed: completedSlots, total: totalSlots };
    });

    const totalScheduled = stats.total;
    const totalCompleted = stats.completed;
    const percent = stats.percent;

    if (totalScheduled === 0) {
      addToast("Cannot archive an empty routine. Please schedule subjects first!", "warning");
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      weekLabel: `Week of ${label}`,
      percent,
      totalScheduled,
      totalCompleted,
      dailyDetails,
      routineSnapshot: JSON.parse(JSON.stringify(routine))
    };

    setWeeklyHistory(prev => [newReport, ...prev]);
    addToast("Current week's routine progress archived successfully!", "success");
  };

  const handleDeleteHistory = (id) => {
    setWeeklyHistory(prev => prev.filter(item => item.id !== id));
    addToast("Weekly report card removed.", "info");
  };

  const handleRestoreHistory = (snapshot) => {
    if (confirm("Restore this weekly report's routine completion states to the active grid? This will replace your current checks.")) {
      setRoutine(snapshot);
      addToast("Routine completion states restored from archive.", "success");
    }
  };

  const getProgressStrokeOffset = () => {
    const ratio = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    return circumference * (1 - ratio);
  };

  const getDayCompletionRate = (dayName) => {
    const slots = routine[dayName] || [];
    const scheduled = slots.filter(s => s.subject.trim() !== "").length;
    if (scheduled === 0) return 0;
    const completed = slots.filter(s => s.subject.trim() !== "" && s.completed).length;
    return Math.min(100, Math.round((completed / scheduled) * 100));
  };

  const getLineChartPath = () => {
    const width = 600;
    const height = 160;
    const paddingX = 40;
    const paddingY = 20;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const points = DAYS_ORDER.map((day, idx) => {
      const rate = getDayCompletionRate(day);
      const x = paddingX + (idx / 6) * chartWidth;
      const y = paddingY + chartHeight - (rate / 100) * chartHeight;
      return { x, y };
    });

    return points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  };

  const getAreaChartPath = () => {
    const width = 600;
    const height = 160;
    const paddingX = 40;
    const paddingY = 20;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const points = DAYS_ORDER.map((day, idx) => {
      const rate = getDayCompletionRate(day);
      const x = paddingX + (idx / 6) * chartWidth;
      const y = paddingY + chartHeight - (rate / 100) * chartHeight;
      return { x, y };
    });

    if (points.length === 0) return "";
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const baseY = paddingY + chartHeight;

    const linePath = points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    return `${linePath} L ${endX} ${baseY} L ${startX} ${baseY} Z`;
  };

  return (
    <div className="w-full mt-15 bg-gray-50 dark:bg-[#0a0f1e] text-gray-900 dark:text-slate-100 min-h-screen relative font-sans transition-colors duration-300">

      {/* ── TOAST NOTIFICATIONS ── */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-auto">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-4 rounded-2xl shadow-lg border transition-all duration-300 animate-slide-in-right ${t.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300"
                : t.type === "warning"
                  ? "bg-amber-50 dark:bg-amber-950/90 border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-300"
                  : "bg-blue-50 dark:bg-slate-900/90 border-blue-200 dark:border-slate-700/50 text-blue-700 dark:text-sky-300"
              }`}
          >
            <div className="shrink-0">
              {t.type === "success" ? (
                <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : t.type === "warning" ? (
                <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-500 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="text-xs font-bold font-mono tracking-tight leading-relaxed">{t.message}</div>
          </div>
        ))}
      </div>

      {/* ── BLURRED PAGE CONTAINER ── */}
      <div className={`transition-all duration-500 ${isFocusModeActive && !isShortView ? "blur-xl pointer-events-none scale-[0.98]" : ""}`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">

          {/* ── HEADER ── */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">
            <div>
              <span className="text-violet-600 dark:text-violet-500 text-xs font-mono tracking-widest font-black block uppercase mb-1.5">
                Focus Matrix & Time Telemetry
              </span>
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                  Dynamic Student Routine
                </h1>
                <div className="px-3.5 py-1 bg-violet-100 dark:bg-violet-950/60 border border-violet-300 dark:border-violet-800/40 text-violet-700 dark:text-violet-400 rounded-full text-xs font-black font-mono">
                  {todayStrLabel} ({todayDayName || "Today"})
                </div>
              </div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 max-w-xl font-medium leading-relaxed">
                Organize your studies with locked daily routines. You can only check tasks matching active day ({todayDayName || "Today"}). Time match triggers auto focus.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Clock Widget */}
              <div className="flex items-center gap-3.5 bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm dark:shadow-2xl">
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-mono font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Active Time</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white font-mono leading-none mt-1">
                    {currentTime ? currentTime.toLocaleTimeString() : "--:--:--"}
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse shrink-0" />
              </div>

              <Button
                onClick={handleResetAll}
                color="danger"
                variant="flat"
                className="bg-red-50 dark:bg-rose-950/40 hover:bg-red-100 dark:hover:bg-rose-900/30 border border-red-200 dark:border-rose-900/40 text-red-600 dark:text-rose-400 font-black h-12 px-4 rounded-xl shadow-sm dark:shadow-lg text-xs"
              >
                Reset All
              </Button>
            </div>
          </div>
          {/* ── PER DAY PROGRESS REPORT ── */}
          <div className="mt-12 mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Per Day Progress Report
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
              Live snapshot of completed versus scheduled focus tasks for each day of the week.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {DAYS_ORDER.map(day => {
                const slots = routine[day] || [];
                const scheduled = slots.filter(s => s.subject.trim() !== "").length;
                const completed = slots.filter(s => s.subject.trim() !== "" && s.completed).length;
                const percent = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
                const isToday = day === todayDayName;
                const theme = DAY_COLOR_THEMES[day] || DAY_COLOR_THEMES.Saturday;

                return (
                  <div
                    key={day}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md ${isToday
                        ? `${theme.bg} ${theme.border} ring-2 ring-violet-500/20 scale-[1.02]`
                        : "bg-white dark:bg-slate-900/40 border-gray-300 dark:border-slate-800"
                      }`}
                  >
                    <div className="w-full flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-black uppercase tracking-wider ${isToday ? "text-violet-750 dark:text-violet-400" : "text-gray-800 dark:text-slate-400"}`}>
                        {day}
                      </span>
                      {isToday && (
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" title="Active day" />
                      )}
                    </div>

                    {/* Donut/Pie Chart - Large */}
                    <div className="relative w-28 h-28 flex items-center justify-center my-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14.5" className="stroke-gray-205 dark:stroke-slate-800" strokeWidth="2.5" fill="transparent" />
                        <circle
                          cx="18"
                          cy="18"
                          r="14.5"
                          className={`${theme.stroke} transition-all duration-500`}
                          strokeWidth="3.0"
                          strokeDasharray={2 * Math.PI * 14.5}
                          strokeDashoffset={2 * Math.PI * 14.5 * (1 - percent / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center leading-none">
                        <span className="text-base font-black text-gray-950 dark:text-white font-mono">{percent}%</span>
                      </div>
                    </div>

                    <div className="mt-1">
                      <div className="text-lg font-black text-slate-955 dark:text-white font-mono leading-none">
                        {completed} / {scheduled}
                      </div>
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest leading-none mt-1.5">
                        Completed
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── DAILY COMPLETION TRENDS LINE CHART ── */}
          <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-2xl mb-12">
            <h3 className="text-sm font-bold font-mono tracking-wider text-gray-400 dark:text-slate-450 uppercase mb-6">
              Daily Completion Trends (Saturday - Friday)
            </h3>

            <div className="relative w-full h-[180px] mt-2">
              <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradRoutine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <line
                    key={ratio}
                    x1="40"
                    y1={20 + ratio * 120}
                    x2="560"
                    y2={20 + ratio * 120}
                    className="stroke-gray-105 dark:stroke-slate-800/40"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area fill */}
                <path d={getAreaChartPath()} fill="url(#chartGradRoutine)" className="transition-all duration-500 ease-in-out" />

                {/* Line path */}
                <path
                  d={getLineChartPath()}
                  fill="none"
                  className="stroke-violet-500 dark:stroke-violet-600 transition-all duration-500 ease-in-out"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Interactive points */}
                {DAYS_ORDER.map((day, index) => {
                  const rate = getDayCompletionRate(day);
                  const x = 40 + (index / 6) * 520;
                  const y = 20 + 120 - (rate / 100) * 120;

                  return (
                    <g key={day} className="group/point">
                      <circle
                        cx={x}
                        cy={y}
                        r="5.5"
                        className="fill-violet-500 dark:fill-violet-600 stroke-white dark:stroke-slate-900"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="transparent"
                        className="cursor-pointer hover:fill-violet-500/10"
                      />

                      {/* Tooltip */}
                      <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200">
                        <rect
                          x={x - 28}
                          y={y - 32}
                          width="56"
                          height="22"
                          rx="6"
                          className="fill-slate-900 dark:fill-white text-[10px] shadow-lg"
                        />
                        <text
                          x={x}
                          y={y - 18}
                          textAnchor="middle"
                          className="fill-white dark:fill-slate-950 font-bold font-mono text-[9px]"
                        >
                          {rate}%
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Labels */}
            <div className="flex justify-between px-8 text-[10px] font-mono text-gray-400 dark:text-slate-500 mt-3">
              {DAYS_ORDER.map(day => (
                <span key={day} className={day === todayDayName ? "text-violet-600 dark:text-violet-400 font-black" : ""}>
                  {day.substring(0, 3)}
                </span>
              ))}
            </div>
          </div>

          {/* ── STATS + DEV TOOLS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

            {/* Completion Donut */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-2xl flex flex-col justify-between items-center text-center">
              <h3 className="text-sm font-bold font-mono tracking-wider text-gray-400 dark:text-slate-450 uppercase w-full text-left">
                Completion Trend
              </h3>
              <div className="relative flex items-center justify-center my-6 w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-gray-100 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="40"
                    className="stroke-violet-500 dark:stroke-violet-600 transition-all duration-500"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - stats.percent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">{stats.percent}%</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-450 dark:text-slate-500">Completed</span>
                </div>
              </div>
              <div className="flex justify-between w-full text-xs font-mono border-t border-gray-100 dark:border-slate-805/60 pt-4">
                <div className="flex flex-col items-start">
                  <span className="text-gray-400 dark:text-slate-500">Scheduled Subjects</span>
                  <span className="font-bold text-gray-800 dark:text-white mt-0.5">{stats.total} sessions</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-400 dark:text-slate-500">Done</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400 mt-0.5">{stats.completed} done</span>
                </div>
              </div>
            </div>

            {/* Dev Tools */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold font-mono tracking-wider text-gray-400 dark:text-slate-400 uppercase">
                    Simulation & Tester Mode
                  </h3>
                  <span className="text-[10px] bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-800/40 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-full font-bold font-mono">
                    Dev Tools
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  Testing routines manually takes hours. Use the simulation tool to inject a test session starting in exactly 5 seconds for today. Adjust the countdown multiplier below to speed up the time-tracking speed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                <div className="bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                    Stopwatch Speed multiplier: {speedMultiplier}x
                  </span>
                  <div className="flex gap-2">
                    {[1, 5, 60, 300].map(multiplier => (
                      <button
                        key={multiplier}
                        onClick={() => setSpeedMultiplier(multiplier)}
                        className={`flex-1 font-mono text-xs font-black py-1.5 px-2 rounded-lg border transition-all ${speedMultiplier === multiplier
                            ? "bg-violet-100 dark:bg-violet-600/20 border-violet-400 dark:border-violet-500 text-violet-700 dark:text-violet-300"
                            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-450 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-700"
                          }`}
                      >
                        {multiplier}x {multiplier === 60 ? "(1s=1m)" : multiplier === 300 ? "(1s=5m)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                    Trigger test session (Today)
                  </span>
                  <Button
                    onClick={handleTriggerTestSession}
                    color="secondary"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-xs py-2 h-10 shadow-sm dark:shadow-lg border-none"
                  >
                    Schedule Focus (Starts in 5s)
                  </Button>
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-400 dark:text-slate-500 leading-none">
                Auto-trigger condition: Day matches and clock matches start time.
              </div>
            </div>
          </div>

          {/* ── ROUTINE GRID ── */}
          <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-2xl overflow-hidden mb-8 flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/20 flex-wrap gap-4">
              <h3 className="text-sm font-bold font-mono tracking-wider text-gray-400 dark:text-slate-450 uppercase">
                Student Routine Matrix
              </h3>
              <div className="flex gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-bold">
                  <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-ping" /> Today Row (Done Active)
                </span>
                <span className="flex items-center gap-1.5 text-gray-400 dark:text-slate-550 font-semibold">
                  <span className="w-3 h-3 border border-gray-200 dark:border-slate-800 rounded flex items-center justify-center text-[8px] bg-gray-100 dark:bg-slate-900/80">🔒</span> Locked Rows
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-855 text-[10px] font-mono text-gray-700 dark:text-slate-300 font-black uppercase tracking-wider h-14 bg-gray-100/50 dark:bg-slate-955/10">
                    <th className="p-2.5 text-left pl-6 min-w-[125px] sticky left-0 bg-gray-100 dark:bg-[#0a0f1e] z-10 align-middle">Day / Time</th>
                    {[0, 1, 2, 3, 4, 5].map(idx => (
                      <th key={idx} className="p-2 text-center min-w-[170px] align-middle">
                        <div className="flex flex-col items-center justify-center gap-0.5 bg-gray-200/40 dark:bg-slate-900/40 p-1.5 rounded-xl border border-gray-300 dark:border-slate-800/80">
                          <span className="text-[9px] font-bold text-gray-805 dark:text-slate-300">Slot {idx + 1} Duration</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={slotDurations[idx]}
                              onChange={(e) => {
                                const newDurs = [...slotDurations];
                                newDurs[idx] = Math.max(1, parseInt(e.target.value) || 1);
                                setSlotDurations(newDurs);
                              }}
                              className="w-8 text-center text-xs font-mono font-bold bg-transparent border-0 focus:ring-0 text-gray-905 dark:text-slate-100 p-0"
                            />
                            <span className="text-[9px] text-gray-600 dark:text-slate-400 font-mono font-bold">Min</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS_ORDER.map(day => {
                    const isTodayRow = day === todayDayName;
                    const items = routine[day] || [];
                    return (
                      <tr
                        key={day}
                        className={`h-24 border-b border-gray-100 dark:border-slate-800/60 transition-colors duration-300 ${isTodayRow
                            ? "bg-violet-50/40 dark:bg-violet-950/5 border-l-4 border-l-violet-500 dark:border-l-violet-600 shadow-[inset_4px_0_0_rgba(139,92,246,0.3)]"
                            : "hover:bg-gray-50 dark:hover:bg-slate-950/10"
                          }`}
                      >
                        {/* Day Name */}
                        <td className={`p-2 pl-6 sticky left-0 z-10 font-black text-sm ${isTodayRow ? "bg-violet-50/40 dark:bg-[#0a0f1e] text-violet-600 dark:text-violet-400 font-black text-base" : "bg-white dark:bg-[#0a0f1e] text-gray-400 dark:text-slate-450"
                          }`}>
                          <div>{day}</div>
                          {isTodayRow && (
                            <span className="text-[8px] bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 border border-violet-300 dark:border-violet-800/40 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest mt-1 block w-max">
                              Active
                            </span>
                          )}
                        </td>

                        {/* Slots */}
                        {items.map((slot, idx) => {
                          const isTaskDone = slot.completed;
                          const hasSubject = slot.subject.trim() !== "";
                          return (
                            <td key={slot.id} className="p-2.5 border-r border-gray-100 dark:border-slate-800/40 text-center relative group">
                              <div className={`flex flex-col gap-1.5 p-2 rounded-2xl transition-all ${isTaskDone
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30"
                                  : isTodayRow && hasSubject
                                    ? "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 shadow-sm dark:shadow-md group-hover:border-violet-300 dark:group-hover:border-violet-500/40"
                                    : "bg-gray-50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-900"
                                }`}>
                                <input
                                  type="text"
                                  value={slot.subject}
                                  onChange={(e) => updateCell(day, slot.id, "subject", e.target.value)}
                                  className="w-full text-center text-xs font-black bg-transparent border-0 focus:ring-0 text-gray-750 dark:text-slate-200 placeholder-gray-300 dark:placeholder-slate-650 py-0.5"
                                  placeholder="Enter Subject"
                                />
                                <input
                                  type="text"
                                  value={slot.slotTime}
                                  onChange={(e) => updateCell(day, slot.id, "slotTime", e.target.value)}
                                  className="w-full text-center text-[10px] font-mono font-bold bg-transparent border-0 focus:ring-0 text-gray-400 dark:text-slate-500 py-0.5"
                                  placeholder="07:00 AM"
                                />
                                <div className="flex justify-center mt-1">
                                  {isTodayRow ? (
                                    <button
                                      type="button"
                                      disabled={!hasSubject}
                                      onClick={() => {
                                        updateCell(day, slot.id, "completed", !isTaskDone);
                                        addToast(
                                          isTaskDone ? `Marked ${slot.subject} as pending` : `Completed session ${slot.subject}!`,
                                          isTaskDone ? "info" : "success"
                                        );
                                      }}
                                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${!hasSubject
                                          ? "opacity-20 cursor-not-allowed border border-gray-200 dark:border-slate-700"
                                          : isTaskDone
                                            ? "bg-emerald-500 dark:bg-emerald-600 border border-emerald-400 dark:border-emerald-500 text-white hover:scale-105 cursor-pointer"
                                            : "bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-transparent hover:border-violet-400 dark:hover:border-violet-500 hover:scale-110 cursor-pointer"
                                        }`}
                                      title={isTaskDone ? "Mark Pending" : "Mark Done"}
                                    >
                                      <svg className="w-3 h-3 stroke-[4px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                  ) : (
                                    <div
                                      className="w-5 h-5 rounded flex items-center justify-center bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-900 text-gray-300 dark:text-slate-600 cursor-not-allowed"
                                      title="Marking Done is locked for non-current days"
                                    >
                                      <svg className="w-3 h-3 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {hasSubject && !isTaskDone && isTodayRow && (
                                  <button
                                    onClick={() => startFocusMode(slot, day, idx)}
                                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-violet-600 hover:bg-violet-500 text-white rounded-full p-1 text-[8px] font-mono tracking-tight font-black shadow-md transition-all scale-95"
                                    title="Manually trigger focus mode now"
                                  >
                                    FOCUS
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── WEEKLY REPORT ARCHIVES SECTION ── */}
          <div className="mt-12 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Weekly Progress Archives
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Save and track your weekly completion metrics as permanent report cards.
                </p>
              </div>
              <Button
                onClick={handleArchiveWeek}
                color="secondary"
                className="bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-xs py-2 px-4 shadow-sm dark:shadow-lg border-none shrink-0"
              >
                Archive Current Week
              </Button>
            </div>

            {/* Grid of Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeklyHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:shadow-md dark:hover:shadow-xl"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-snug">
                        {item.weekLabel}
                      </h4>
                      <span className="text-[9px] bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-800/40 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-full font-bold font-mono tracking-wider shrink-0 uppercase">
                        Report
                      </span>
                    </div>

                    {/* Progress Gauge */}
                    <div className="flex items-center gap-4 my-3 bg-gray-50 dark:bg-slate-950/20 p-3 rounded-2xl border border-gray-100 dark:border-slate-800/40">
                      {/* Donut - Large */}
                      <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14.5" className="stroke-gray-205 dark:stroke-slate-800" strokeWidth="2.5" fill="transparent" />
                          <circle
                            cx="18" cy="18" r="14.5"
                            className="stroke-violet-600 dark:stroke-violet-500"
                            strokeWidth="3"
                            strokeDasharray={2 * Math.PI * 14.5}
                            strokeDashoffset={2 * Math.PI * 14.5 * (1 - item.percent / 100)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <span className="absolute text-xs font-black text-gray-950 dark:text-white font-mono">{item.percent}%</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">Completion</span>
                        <span className="text-sm font-black text-gray-805 dark:text-white leading-none mt-1">
                          {item.totalCompleted} / {item.totalScheduled} Done
                        </span>
                      </div>
                    </div>

                    {/* Daily metrics log strip */}
                    <div className="flex flex-wrap gap-1.5 my-3">
                      {item.dailyDetails && item.dailyDetails.map(d => (
                        <span
                          key={d.day}
                          className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 font-mono text-[8px] px-1.5 py-0.5 rounded font-black"
                          title={`${d.day}: ${d.completed}/${d.total} Done`}
                        >
                          {d.day.substring(0, 3)}: {d.completed}/{d.total}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-slate-800/60 pt-3 mt-2">
                    <button
                      onClick={() => handleRestoreHistory(item.routineSnapshot)}
                      className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 font-mono text-[10px] font-black tracking-wider uppercase border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all flex items-center gap-1 focus:outline-none"
                      title="Restore completed check-offs to routine table"
                    >
                      <svg className="w-3 h-3 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18m0 0V3m0 4h5" />
                      </svg>
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="text-red-600 hover:text-red-500 dark:text-rose-500 dark:hover:text-rose-400 font-mono text-[10px] font-black tracking-wider uppercase border border-red-200 dark:border-rose-800/40 px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-rose-950/20 transition-all flex items-center gap-1 focus:outline-none"
                      title="Delete archived week card"
                    >
                      <svg className="w-3 h-3 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {weeklyHistory.length === 0 && (
                <div className="col-span-full bg-white dark:bg-slate-900/10 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-8 text-center text-gray-400 dark:text-slate-500 text-xs font-mono">
                  No weekly reports archived yet. Complete tasks in the routine grid above and click &quot;Archive Current Week&quot; to compile logs.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOCUS STOPWATCH OVERLAY ── */}
      {isFocusModeActive && activeSession && (
        <div className={`fixed transition-all duration-300 z-40 ${isShortView
            ? "bottom-6 right-6 w-80 shadow-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950/90 rounded-2xl overflow-hidden backdrop-blur-xl animate-fade-in-up"
            : "inset-0 flex items-center justify-center bg-white/85 dark:bg-slate-950/80 backdrop-blur-2xl"
          }`}>
          <div className={`bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800/80 text-center flex flex-col justify-between transition-all duration-300 ${isShortView ? "p-4 w-full h-full rounded-2xl" : "p-8 max-w-lg w-full mx-4 rounded-3xl shadow-xl dark:shadow-2xl"
            }`}>
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase ml-1">Focus Locked</span>
              </div>
              <button
                onClick={() => setIsShortView(!isShortView)}
                className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 p-1.5 rounded-lg text-[9px] font-mono tracking-tight font-black"
              >
                {isShortView ? "EXPAND VIEW" : "COMPACT VIEW"}
              </button>
            </div>

            <div className={`${isShortView ? "my-3" : "my-6"}`}>
              <span className={`bg-violet-105 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 font-mono tracking-widest font-black uppercase rounded-full inline-block px-3 py-1 ${isShortView ? "text-[8px]" : "text-[10px]"}`}>
                Current Session
              </span>
              <h2 className={`font-black text-gray-900 dark:text-white tracking-tight mt-2 ${isShortView ? "text-lg" : "text-3xl"}`}>
                {activeSession.subject}
              </h2>
              <p className="text-xs font-mono text-gray-400 dark:text-slate-400 mt-1">
                Time Remaining: {formatTime(secondsRemaining)} ({activeSession.slotTime})
              </p>
            </div>

            {!isShortView && (
              <div className="relative flex items-center justify-center my-6 mx-auto w-52 h-52">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" className="stroke-gray-100 dark:stroke-slate-800" strokeWidth="7" fill="transparent" />
                  <circle
                    cx="100" cy="100" r="90"
                    className="stroke-violet-500 dark:stroke-violet-600 transition-all duration-1000"
                    strokeWidth="7"
                    strokeDasharray={2 * Math.PI * 90}
                    strokeDashoffset={getProgressStrokeOffset()}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">{formatTime(secondsRemaining)}</span>
                  <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 dark:text-slate-500 mt-1 block">
                    {isStopwatchPaused ? "PAUSED" : "ACTIVE SESSION"}
                  </span>
                </div>
              </div>
            )}

            {isShortView && (
              <div className="bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800/60 p-3.5 my-3 rounded-xl flex items-center justify-between font-mono">
                <span className="text-gray-400 dark:text-slate-550 text-xs font-black">STOPWATCH</span>
                <span className="text-lg font-black text-violet-600 dark:text-violet-400">{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <div className="flex gap-3 justify-center items-center">
              <Button
                onClick={() => setIsStopwatchPaused(!isStopwatchPaused)}
                color={isStopwatchPaused ? "success" : "warning"}
                className={`flex-1 font-black rounded-xl text-xs border-none ${isStopwatchPaused ? "bg-emerald-500 hover:bg-emerald-400" : "bg-amber-500 hover:bg-amber-400"
                  } text-white`}
              >
                {isStopwatchPaused ? "Play" : "Pause"}
              </Button>
              <Button
                onClick={() => {
                  if (confirm("Reset the active focus stopwatch? This returns timer to start.")) {
                    setSecondsRemaining(totalSeconds);
                    setIsStopwatchPaused(false);
                  }
                }}
                color="secondary"
                variant="flat"
                className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-bold rounded-xl text-xs shrink-0"
              >
                Reset
              </Button>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-3 mt-4 text-[9px] font-mono text-gray-400 dark:text-slate-500 leading-normal uppercase tracking-wider">
              locked window — unlocks automatically when time is up
            </div>
          </div>
        </div>
      )}

      {/* ── TRANSITION COUNTDOWN OVERLAY ── */}
      {isTransitionCountdownActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl animate-fade-in">
          <div className="text-center p-8 max-w-md w-full">
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold font-mono uppercase tracking-widest">
              Session Finished
            </span>
            <h2 className="text-xl font-bold text-gray-400 dark:text-slate-500 mt-6 font-mono uppercase tracking-tight">
              Next focus session starting in
            </h2>
            <div className="my-10">
              <span className="text-[130px] font-black text-gray-900 dark:text-white leading-none font-mono tracking-tighter animate-ping block">
                {transitionSeconds}
              </span>
            </div>
            <p className="text-gray-500 dark:text-slate-400 text-sm font-mono mt-4">
              Upcoming: <span className="font-bold text-violet-600 dark:text-violet-400">{nextPendingSession?.subject}</span> ({nextPendingSession?.slotTime})
            </p>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
              <div
                className="bg-violet-500 dark:bg-violet-650 h-full transition-all duration-1000"
                style={{ width: `${(transitionSeconds / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
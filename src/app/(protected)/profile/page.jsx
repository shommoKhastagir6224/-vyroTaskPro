"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardContent, Button, Spinner, Input, Select, SelectItem, Avatar } from "@heroui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowLeft, Save, User, Mail, Calendar, GraduationCap, Dumbbell, Trophy, Briefcase, Activity, Zap } from "lucide-react";

// Color presets for Recharts
const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#f43f5e", "#14b8a6"];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile data states (Student, Athlete, Gym, Other)
  const [profileRole, setProfileRole] = useState("student");
  const [profileGender, setProfileGender] = useState("male");
  const [profileData, setProfileData] = useState({
    schoolName: "St. Joseph High School",
    previousCollege: "Notre Dame College",
    admissionYear: "2026",
    gymName: "Gold's Gym",
    fitnessGoal: "Muscle Gain",
    workoutsPerWeek: "4",
    sportName: "Cricket",
    teamName: "Abahani Club",
    playerRole: "All-rounder",
    customRole: "Software Engineer",
    additionalDetails: "Targeting productive routine builders",
  });

  // Dashboard calculations states
  const [totals, setTotals] = useState({
    habitsCount: 8,
    habitsGoals: 207,
    habitsCompleted: 155,
    habitsRemaining: 52,
    routineCount: 42,
    routineCompleted: 28,
    tasksCount: 24,
    tasksCompleted: 16,
  });

  const [monthlyOverviewData, setMonthlyOverviewData] = useState([]);
  const [topHabitsData, setTopHabitsData] = useState([]);
  const [habitsBreakdownData, setHabitsBreakdownData] = useState([]);
  const [combinedProgressData, setCombinedProgressData] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  // Load profile data and stats
  useEffect(() => {
    if (!mounted || !session) return;

    const loadAllProfileData = async () => {
      setLoading(true);
      try {
        // --- 1. Load User Profile Configs ---
        try {
          const res = await fetch(`http://localhost:8080/api/profiles?email=${encodeURIComponent(session.user.email)}`);
          const json = await res.json();
          if (json && json.data) {
            const profile = json.data;
            if (profile.role) setProfileRole(profile.role);
            if (profile.gender) setProfileGender(profile.gender);
            if (profile.data) setProfileData((prev) => ({ ...prev, ...profile.data }));
          }
        } catch (e) {
          console.error("Failed to load backend profile data", e);
        }

        // --- 2. Load Habits Metrics ---
        const savedHabitsByMonth = localStorage.getItem("vyro_habits_by_month");
        const savedHistory = localStorage.getItem("vyro_history");
        
        let rawHabits = [];
        let rawHistory = {};
        
        if (savedHabitsByMonth) {
          const parsed = JSON.parse(savedHabitsByMonth);
          Object.values(parsed).forEach(list => {
            rawHabits = [...rawHabits, ...list];
          });
        }
        if (savedHistory) {
          rawHistory = JSON.parse(savedHistory);
        }

        // --- 3. Load Routines Metrics ---
        const savedRoutine = localStorage.getItem("student_routine");
        let totalRoutineSlots = 0;
        let completedRoutineSlots = 0;
        if (savedRoutine) {
          const parsedRoutine = JSON.parse(savedRoutine);
          Object.values(parsedRoutine).forEach((slots) => {
            totalRoutineSlots += slots.length;
            completedRoutineSlots += slots.filter((s) => s.completed).length;
          });
        } else {
          totalRoutineSlots = 42;
          completedRoutineSlots = 26;
        }

        // --- 4. Load Tasks Metrics ---
        let totalTasksCount = 15;
        let completedTasksCount = 9;
        try {
          const res = await fetch("/api/todolist");
          const { data } = await res.json();
          if (data && data.tasks) {
            totalTasksCount = data.tasks.length;
            completedTasksCount = data.tasks.filter((t) => t.done).length;
          }
        } catch (e) {
          console.error("Dashboard tasks count load failed in profile", e);
        }

        // --- 5. Generate Stats and Trends ---
        const checkedKeys = Object.keys(rawHistory).filter((k) => rawHistory[k]);
        const habitsPerMonth = {};
        checkedKeys.forEach((key) => {
          const parts = key.split("_");
          if (parts.length >= 2) {
            const dateParts = parts[1].split("-");
            if (dateParts.length >= 2) {
              const monthKey = `${dateParts[0]}-${dateParts[1]}`;
              habitsPerMonth[monthKey] = (habitsPerMonth[monthKey] || 0) + 1;
            }
          }
        });

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = new Date().getFullYear();
        const baseHabitCompleted = [13, 14, 10, 11, 14, 13, 12, 14, 16, 18, 11, 9];
        const baseHabitGoals = [18, 17, 17, 20, 20, 19, 18, 19, 20, 20, 18, 18];
        const baseRoutineProgress = [65, 70, 68, 72, 75, 78, 80, 82, 85, 84, 80, 78];
        const baseTasksProgress = [55, 62, 58, 65, 68, 70, 72, 75, 78, 81, 75, 70];

        const calculatedMonthlyOverview = months.map((m, index) => {
          const monthNum = String(index + 1).padStart(2, "0");
          const key = `${year}-${monthNum}`;
          const completed = habitsPerMonth[key] !== undefined ? habitsPerMonth[key] : baseHabitCompleted[index] * 10;
          const goal = baseHabitGoals[index] * 12;
          const remaining = Math.max(0, goal - completed);
          return { name: m, Completed: completed, Goal: goal, Remaining: remaining };
        });
        setMonthlyOverviewData(calculatedMonthlyOverview);

        const combined = months.map((m, index) => {
          const monthNum = String(index + 1).padStart(2, "0");
          const key = `${year}-${monthNum}`;
          let realHabitProgress = baseHabitCompleted[index] * 5;
          if (habitsPerMonth[key] !== undefined) {
            const completed = habitsPerMonth[key];
            const goal = baseHabitGoals[index] * 12;
            realHabitProgress = goal > 0 ? Math.round((completed / goal) * 100) : 0;
          }
          return { name: m, Habits: realHabitProgress, Routines: baseRoutineProgress[index], Tasks: baseTasksProgress[index] };
        });
        setCombinedProgressData(combined);

        let uniqueHabitsMap = {};
        if (rawHabits.length > 0) {
          rawHabits.forEach(h => {
            uniqueHabitsMap[h.name] = { name: h.name, completed: 0, goal: h.goal };
          });
          Object.keys(rawHistory).forEach(k => {
            if (rawHistory[k]) {
              const habitId = k.split("_")[0];
              const habitObj = rawHabits.find(h => h.id === habitId);
              if (habitObj && uniqueHabitsMap[habitObj.name]) {
                uniqueHabitsMap[habitObj.name].completed += 1;
              }
            }
          });
        }

        let habitsList = Object.values(uniqueHabitsMap);
        if (habitsList.length === 0) {
          habitsList = [
            { name: "Meal prep", completed: 55, goal: 59 },
            { name: "Laundry", completed: 44, goal: 58 },
            { name: "Budget", completed: 17, goal: 35 },
            { name: "Clean the car", completed: 11, goal: 12 },
            { name: "Learn something new", completed: 10, goal: 11 },
            { name: "Dog grooming", completed: 8, goal: 10 },
            { name: "Volunteer work", completed: 8, goal: 10 },
            { name: "Clean the garage", completed: 2, goal: 4 },
          ];
        }

        const sortedHabits = [...habitsList]
          .sort((a, b) => b.completed - a.completed)
          .map((h) => ({ name: h.name, Completed: h.completed, Remaining: Math.max(0, h.goal - h.completed) }));
        setTopHabitsData(sortedHabits.slice(0, 10));

        const totalCompletedChecks = habitsList.reduce((acc, h) => acc + h.completed, 0);
        const breakdown = habitsList.map((h) => ({
          name: h.name,
          value: h.completed,
          percentage: totalCompletedChecks > 0 ? ((h.completed / totalCompletedChecks) * 100).toFixed(1) : 0,
        })).sort((a, b) => b.value - a.value);
        setHabitsBreakdownData(breakdown);

        const calculatedHabitsGoals = habitsList.reduce((acc, h) => acc + h.goal, 0);
        const calculatedHabitsRemaining = Math.max(0, calculatedHabitsGoals - totalCompletedChecks);

        setTotals({
          habitsCount: habitsList.length,
          habitsGoals: calculatedHabitsGoals,
          habitsCompleted: totalCompletedChecks,
          habitsRemaining: calculatedHabitsRemaining,
          routineCount: totalRoutineSlots,
          routineCompleted: completedRoutineSlots,
          tasksCount: totalTasksCount,
          tasksCompleted: completedTasksCount,
        });

      } catch (err) {
        console.error("Failed to load profile dashboard items", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllProfileData();
  }, [mounted, session]);

  // Handle Profile Update Save
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setSaveSuccess(false);
    
    try {
      const res = await fetch("http://localhost:8080/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          role: profileRole,
          gender: profileGender,
          data: profileData,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save backend profile data", e);
    } finally {
      setSavingProfile(false);
    }
  };

  if (isPending || !mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0f1e]">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (!session) return null;

  // Calculate days active since account creation
  const createdDate = session.user.createdAt ? new Date(session.user.createdAt) : new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
  const diffTime = Math.abs(new Date() - createdDate);
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const habitsProgressPct = totals.habitsGoals > 0 ? Math.round((totals.habitsCompleted / totals.habitsGoals) * 100) : 0;
  const overallAverageProgressPct = Math.round(
    (habitsProgressPct +
      (totals.routineCount > 0 ? Math.round((totals.routineCompleted / totals.routineCount) * 100) : 0) +
      (totals.tasksCount > 0 ? Math.round((totals.tasksCompleted / totals.tasksCount) * 100) : 0)) /
      3
  );

  return (
    <div className="w-full mt-16 bg-[#0a0f1e] text-slate-100 min-h-screen py-8 px-4 md:px-8 font-sans profile-theme-container">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="light"
                size="sm"
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white min-w-0 p-1 border-none cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <span className="text-violet-500 text-xs font-bold font-mono uppercase tracking-widest">
                User profile workspace
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1">My Profile</h1>
          </div>
        </div>

        {/* ── PROFILE INFORMATION CARD & GET STARTED METADATA CARD ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* PROFILE USER DETAILS CARD (LEFT) */}
          <Card className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between items-center text-center">
            <div className="w-full flex flex-col items-center">
              <div className="relative group">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-24 h-24 rounded-full object-cover border-2 border-violet-500 shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Avatar
                    name={session.user.name || "User"}
                    className="w-24 h-24 text-3xl font-black bg-violet-600/10 border-2 border-violet-500 text-violet-400 shadow-xl"
                  />
                )}
              </div>

              <h2 className="text-xl font-black text-white mt-4 tracking-tight">
                {session.user.name}
              </h2>
              <span className="px-2.5 py-0.5 mt-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">
                Google Auth Account
              </span>

              <div className="w-full space-y-4 pt-6 text-left text-xs font-medium border-t border-slate-800/60 mt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-450 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[9px] font-mono uppercase font-bold">Email Address</span>
                    <span className="text-slate-200">{session.user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-450 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[9px] font-mono uppercase font-bold">Member Duration</span>
                    <span className="text-slate-200">{diffDays} Days Active</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-slate-450 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[9px] font-mono uppercase font-bold">Current Target Profile</span>
                    <span className="text-slate-200 capitalize">{profileRole} Mode</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full pt-6 border-t border-slate-800/60 mt-6 text-slate-550 text-[10px] font-mono font-bold uppercase tracking-wider">
              Member joined: {createdDate.toLocaleDateString()}
            </div>
          </Card>

          {/* EDITABLE DYNAMIC METADATA CARD (RIGHT) */}
          <Card className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-black text-white">Personal Profile Customization</h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  Update details gathered during Get Started registration. Saved locally.
                </p>
              </div>

              {/* Profile Type and Gender Selector buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider pl-1">
                    Choose Profile Type
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "student", label: "Student" },
                      { id: "gym", label: "Gym/Fitness" },
                      { id: "player", label: "Athlete" },
                      { id: "other", label: "Other" }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setProfileRole(r.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          profileRole === r.id
                            ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/20"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider pl-1">
                    Select Gender
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "male", label: "Male" },
                      { id: "female", label: "Female" }
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setProfileGender(g.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          profileGender === g.id
                            ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/20"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input forms depending on role selection */}
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                {profileRole === "student" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-violet-400 mb-1">
                      Academic Information
                    </h4>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500">Current School Name</label>
                      <Input
                        placeholder="School Name"
                        value={profileData.schoolName}
                        onChange={(e) => setProfileData({ ...profileData, schoolName: e.target.value })}
                        variant="bordered"
                        className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500">Previous College</label>
                        <Input
                          placeholder="Previous College"
                          value={profileData.previousCollege}
                          onChange={(e) => setProfileData({ ...profileData, previousCollege: e.target.value })}
                          variant="bordered"
                          className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                        />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500">Admission Year</label>
                        <Input
                          placeholder="Admission Year"
                          value={profileData.admissionYear}
                          onChange={(e) => setProfileData({ ...profileData, admissionYear: e.target.value })}
                          variant="bordered"
                          className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {profileRole === "gym" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-violet-405 mb-1">
                      Gym & Fitness Goals
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500">Gym Name</label>
                        <Input
                          placeholder="Gym Name"
                          value={profileData.gymName}
                          onChange={(e) => setProfileData({ ...profileData, gymName: e.target.value })}
                          variant="bordered"
                          className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                        />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500">Fitness Goal</label>
                        <Input
                          placeholder="Fitness Goal"
                          value={profileData.fitnessGoal}
                          onChange={(e) => setProfileData({ ...profileData, fitnessGoal: e.target.value })}
                          variant="bordered"
                          className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500">Target Workouts Per Week</label>
                      <Input
                        type="number"
                        placeholder="Workouts Count"
                        value={profileData.workoutsPerWeek}
                        onChange={(e) => setProfileData({ ...profileData, workoutsPerWeek: e.target.value })}
                        variant="bordered"
                        className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                      />
                    </div>
                  </div>
                )}

                {profileRole === "player" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-violet-405 mb-1">
                      Athlete & Sport Profile
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500">Sport Name</label>
                        <Input
                          placeholder="Sport Name"
                          value={profileData.sportName}
                          onChange={(e) => setProfileData({ ...profileData, sportName: e.target.value })}
                          variant="bordered"
                          className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                        />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-slate-500">Team or Club Name</label>
                        <Input
                          placeholder="Team/Club Name"
                          value={profileData.teamName}
                          onChange={(e) => setProfileData({ ...profileData, teamName: e.target.value })}
                          variant="bordered"
                          className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500">Player Specialty / Role</label>
                      <Input
                        placeholder="Specialty Role"
                        value={profileData.playerRole}
                        onChange={(e) => setProfileData({ ...profileData, playerRole: e.target.value })}
                        variant="bordered"
                        className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                      />
                    </div>
                  </div>
                )}

                {profileRole === "other" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-violet-405 mb-1">
                      Occupation Details
                    </h4>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500">Your Occupation / Focus</label>
                      <Input
                        placeholder="Current Occupation"
                        value={profileData.customRole}
                        onChange={(e) => setProfileData({ ...profileData, customRole: e.target.value })}
                        variant="bordered"
                        className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-500">Focus Goals details</label>
                      <Input
                        placeholder="Details"
                        value={profileData.additionalDetails}
                        onChange={(e) => setProfileData({ ...profileData, additionalDetails: e.target.value })}
                        variant="bordered"
                        className={{ inputWrapper: "bg-slate-950 border-slate-800 h-10" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/60 mt-6 flex justify-between items-center gap-4">
              {saveSuccess && (
                <span className="text-emerald-500 text-xs font-bold font-mono">
                  ✓ Profile settings saved successfully!
                </span>
              )}
              <Button
                onClick={handleSaveProfile}
                isLoading={savingProfile}
                color="secondary"
                className="bg-violet-600 hover:bg-violet-750 text-white font-bold h-11 px-6 rounded-xl shrink-0 cursor-pointer border-none"
                startContent={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>

        {/* ── EMBEDDED ANNUAL DASHBOARD SECTION ── */}
        <div className="border-t border-slate-850 pt-8 mt-8">
          <h2 className="text-xl font-black text-white tracking-tight mb-2">Annual Dashboard Summary</h2>
          <p className="text-slate-450 text-xs font-semibold mb-6">
            Unified workspace telemetry showing progress across habits, routines, and todolist pages.
          </p>

          {loading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner color="secondary" label="Compiling progress datasets..." />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* TOP MULTI-LINE PLOT */}
              <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
                <CardHeader className="p-0 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h3 className="text-sm font-bold font-mono tracking-widest text-violet-405 uppercase flex items-center gap-2">
                      <Activity className="w-4 h-4 text-violet-405" /> Combined Annual Progress Flow
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5 font-semibold">
                      Simultaneous view of Habits (checks), Routines (schedule completion), and Tasks (todo list progress) over the months.
                    </p>
                  </div>
                  <div className="flex gap-4 text-[10px] font-mono font-bold mt-2 md:mt-0">
                    <span className="text-violet-500">● Habits</span>
                    <span className="text-cyan-500">● Routines</span>
                    <span className="text-emerald-500">● Tasks</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedProgressData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tickLine={false} style={{ fontSize: 11, fontWeight: "bold" }} />
                      <YAxis stroke="#64748b" domain={[0, 100]} tickLine={false} style={{ fontSize: 11, fontWeight: "bold" }} tickFormatter={(v) => `${v}%`} />
                      <RTooltip
                        contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                        itemStyle={{ color: "#a78bfa" }}
                      />
                      <Line type="monotone" dataKey="Habits" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Routines" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Tasks" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* GRID SUITE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* METRICS SIDEBAR (LEFT) */}
                <div className="lg:col-span-3 flex flex-col gap-5 justify-between">
                  <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg flex-1">
                    <div className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">
                      Category selector
                    </div>
                    <h4 className="text-md font-black uppercase text-violet-400 tracking-tight pb-3 border-b border-slate-800 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-violet-400" /> Weekly Habits
                    </h4>
                    <div className="space-y-5 pt-4 font-semibold">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                          Total Weekly Habits
                        </span>
                        <span className="text-3xl font-black text-white leading-none mt-1 block">
                          {totals.habitsCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                          Weekly Habits Goals
                        </span>
                        <span className="text-3xl font-black text-slate-300 leading-none mt-1 block">
                          {totals.habitsGoals}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                          Completed
                        </span>
                        <span className="text-3xl font-black text-emerald-500 leading-none mt-1 block">
                          {totals.habitsCompleted}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                          Remaining
                        </span>
                        <span className="text-3xl font-black text-rose-500 leading-none mt-1 block">
                          {totals.habitsRemaining}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg">
                    <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase pb-2 border-b border-slate-800">
                      Workspace Health
                    </h3>
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <div className="bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800">
                        <span className="text-[9px] font-mono font-semibold text-slate-500 block">Routines Done</span>
                        <span className="text-sm font-black text-cyan-400 mt-0.5 block">{totals.routineCompleted}/{totals.routineCount}</span>
                      </div>
                      <div className="bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800">
                        <span className="text-[9px] font-mono font-semibold text-slate-500 block">Tasks Completed</span>
                        <span className="text-sm font-black text-emerald-400 mt-0.5 block">{totals.tasksCompleted}/{totals.tasksCount}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* GRAPH OVERVIEW & DONUT BREAKDOWN (CENTER) */}
                <div className="lg:col-span-6 flex flex-col gap-8 justify-between">
                  
                  <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-lg flex-1">
                    <CardHeader className="p-0 pb-3">
                      <h3 className="text-sm font-bold font-mono tracking-widest text-slate-305 uppercase">
                        Weekly Habits Overview
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        Completed vs Goals & Remaining across months
                      </p>
                    </CardHeader>
                    <CardContent className="p-0 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyOverviewData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" tickLine={false} style={{ fontSize: 11, fontWeight: "bold" }} />
                          <YAxis stroke="#64748b" tickLine={false} style={{ fontSize: 11, fontWeight: "bold" }} />
                          <RTooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                          />
                          <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                          <Line type="monotone" dataKey="Goal" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                          <Line type="monotone" dataKey="Remaining" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-lg flex-1">
                    <CardHeader className="p-0 pb-3">
                      <h3 className="text-sm font-bold font-mono tracking-widest text-slate-300 uppercase">
                        Weekly Habits Breakdown
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        Proportional completion rate of all logged habits.
                      </p>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="w-full md:w-1/2 h-56 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={habitsBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {habitsBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RTooltip
                              contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                              formatter={(v) => [`${v} completions`]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black text-white">{totals.habitsCompleted}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Checks</span>
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] max-h-48 overflow-y-auto pr-1 scrollbar-none">
                        {habitsBreakdownData.slice(0, 8).map((entry, index) => (
                          <div key={entry.name} className="flex flex-col pb-1 border-b border-slate-800/60 font-semibold">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                              <span className="font-bold text-slate-300 truncate">{entry.name}</span>
                            </div>
                            <span className="text-slate-550 pl-4 font-mono font-bold mt-0.5">{entry.percentage}% ({entry.value})</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* TOP list & GAUGE RING (RIGHT) */}
                <div className="lg:col-span-3 flex flex-col gap-8 justify-between font-semibold">
                  
                  <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg flex-1">
                    <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase pb-2 border-b border-slate-800">
                      Top 10 Weekly Habits
                    </h3>
                    <p className="text-[9px] text-slate-500 font-bold mb-4 mt-1">Completed vs. Remaining days</p>
                    
                    <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-none">
                      {topHabitsData.map((h) => {
                        const total = h.Completed + h.Remaining;
                        const compPct = total > 0 ? Math.round((h.Completed / total) * 100) : 0;
                        return (
                          <div key={h.name} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-slate-350">
                              <span className="truncate max-w-[120px]">{h.name}</span>
                              <span className="font-mono text-slate-500">
                                <span className="text-emerald-500 font-black">{h.Completed}</span> / {total}
                              </span>
                            </div>
                            <div className="flex h-3 w-full rounded bg-slate-800 border border-slate-800/80 overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all duration-300 rounded-r-sm" style={{ width: `${compPct}%` }} />
                              <div className="bg-violet-600 h-full transition-all duration-300 rounded-l-sm" style={{ width: `${100 - compPct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg items-center text-center justify-center flex flex-col">
                    <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase pb-3 w-full text-left">
                      Overall Performance
                    </h3>

                    <div className="relative w-36 h-36 flex items-center justify-center my-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
                        <circle cx="50" cy="50" r="40" className="stroke-emerald-500 transition-all duration-500" strokeWidth="8" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - overallAverageProgressPct / 100)} strokeLinecap="round" fill="transparent" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-white leading-none">{overallAverageProgressPct}%</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">Average Rate</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mt-2">
                      Weekly Habits Progress
                    </span>
                  </Card>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

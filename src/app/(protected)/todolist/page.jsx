"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  ProgressBar,
  Tooltip,
} from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
} from "recharts";
import { Plus, Trash2, Pencil, Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";

/* ----------------------------- constants ----------------------------- */

const CATEGORIES = ["Personal", "Work", "Cleaning", "Gardening", "Pets", "Wellness", "Kids"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const STATUSES = ["Not Started", "In-Progress", "Complete", "Overdue"];
const DURATIONS = ["5 minutes", "15 minutes", "30 minutes", "1 hour", "2 hours", "4 hours", "6 hours"];

const CATEGORY_COLOR = {
  Personal: "#f9a8d4",
  Work: "#93c5fd",
  Cleaning: "#fdba74",
  Gardening: "#86efac",
  Pets: "#fca5a5",
  Wellness: "#fde68a",
  Kids: "#c4b5fd",
};

const CATEGORY_ROW_BG = {
  Personal: "bg-pink-50/60 dark:bg-pink-950/10",
  Work: "bg-blue-50/60 dark:bg-blue-950/10",
  Cleaning: "bg-orange-50/60 dark:bg-orange-950/10",
  Gardening: "bg-green-50/60 dark:bg-green-950/10",
  Pets: "bg-red-50/60 dark:bg-red-950/10",
  Wellness: "bg-yellow-50/60 dark:bg-yellow-950/10",
  Kids: "bg-violet-50/60 dark:bg-violet-950/10",
};

const STATUS_COLOR = {
  "Not Started": "#c4b5fd",
  "In-Progress": "#fdba74",
  Complete: "#86efac",
  Overdue: "#fca5a5",
};

const PRIORITY_COLOR = {
  Low: "#86efac",
  Medium: "#fde68a",
  High: "#fca5a5",
  Urgent: "#f472b6",
};

const WEEK_META = [
  { label: "Week 1", color: "bg-cyan-500" },
  { label: "Week 2", color: "bg-emerald-600" },
  { label: "Week 3", color: "bg-violet-700" },
  { label: "Week 4", color: "bg-amber-600" },
  { label: "Extra Days", color: "bg-rose-700" },
];

let idCounter = Date.now(); // use timestamp so IDs are always unique across sessions
const nextId = () => ++idCounter;

const todayStr = () => new Date().toISOString().slice(0, 10);

const todayPlus = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const makeDemoTasks = () => [
  { id: nextId(), task: "Post To Do List Video", category: "Work", priority: "High", status: "Not Started", duration: "1 hour", dueDate: todayPlus(2), done: false },
  { id: nextId(), task: "Clean clothes", category: "Cleaning", priority: "Medium", status: "Not Started", duration: "6 hours", dueDate: todayPlus(1), done: false },
  { id: nextId(), task: "Pick Tomatoes", category: "Gardening", priority: "Low", status: "Not Started", duration: "30 minutes", dueDate: todayPlus(3), done: false },
  { id: nextId(), task: "Walk Dogo", category: "Pets", priority: "High", status: "Not Started", duration: "30 minutes", dueDate: todayPlus(0), done: false },
];

const makeEmptyWeeks = () =>
  WEEK_META.map((m) => ({ id: nextId(), ...m, items: [] }));

/* ------------------------------ helpers ------------------------------- */

function daysLeftLabel(dueDate) {
  const diff = Math.ceil((new Date(dueDate) - new Date(new Date().toDateString())) / 86400000);
  if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, color: "danger" };
  if (diff === 0) return { text: "Today", color: "warning" };
  return { text: `${diff}d left`, color: "default" };
}

/* ============================== PAGE =================================== */

export default function Page() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [history, setHistory] = useState([]);
  const [dayCounter, setDayCounter] = useState(0);
  const [lastDate, setLastDate] = useState(todayStr());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currentWeekIndex = Math.min(Math.floor(dayCounter / 7), 3);

  // ------------------------------------------------------------------ //
  //  LOAD from API on mount (once session is ready)
  // ------------------------------------------------------------------ //
  const loaded = useRef(false);
  useEffect(() => {
    if (isPending || !session || loaded.current) return;
    loaded.current = true;

    fetch("/api/todolist")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          // Restore saved data
          setTasks(data.tasks ?? []);
          setWeeks(data.weeks ?? makeEmptyWeeks());
          setHistory(data.history ?? []);
          setDayCounter(data.dayCounter ?? 0);
          setLastDate(data.lastDate ?? todayStr());
        } else {
          // First time — seed demo tasks + Week 1
          const demoTasks = makeDemoTasks();
          const emptyWeeks = makeEmptyWeeks();
          const seededWeeks = emptyWeeks.map((w, i) =>
            i !== 0
              ? w
              : {
                ...w,
                items: demoTasks.map((t) => ({
                  id: nextId(),
                  label: t.task,
                  done: t.done,
                  taskId: t.id,
                })),
              }
          );
          setTasks(demoTasks);
          setWeeks(seededWeeks);
          setHistory([]);
          setDayCounter(0);
          setLastDate(todayStr());
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isPending, session]);

  // ------------------------------------------------------------------ //
  //  SAVE to API — debounced whenever data changes
  // ------------------------------------------------------------------ //
  const saveTimer = useRef(null);

  const saveToApi = useCallback(
    (tasksVal, weeksVal, historyVal, dayCounterVal, lastDateVal) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          await fetch("/api/todolist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tasks: tasksVal,
              weeks: weeksVal,
              history: historyVal,
              dayCounter: dayCounterVal,
              lastDate: lastDateVal,
            }),
          });
        } catch (e) {
          console.error("Save error", e);
        } finally {
          setSaving(false);
        }
      }, 800); // save 800ms after the last change
    },
    []
  );

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  // Trigger save whenever state changes (skip during initial load)
  useEffect(() => {
    if (loading || !session) return;
    saveToApi(tasks, weeks, history, dayCounter, lastDate);
  }, [tasks, weeks, history, dayCounter, lastDate, loading, session, saveToApi]);

  // ------------------------------------------------------------------ //
  //  Day-change detection → move incomplete tasks to Extra Days
  // ------------------------------------------------------------------ //
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const now = todayStr();
      if (now !== lastDate) {
        handleNewDay(now);
      }
    }, 60_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, lastDate, tasks, dayCounter]);

  function handleNewDay(newDate) {
    setLastDate(newDate);

    // Move incomplete tasks → Extra Days
    setWeeks((prevWeeks) => {
      const extraIdx = prevWeeks.length - 1;
      const incompleteItems = tasks
        .filter((t) => !t.done)
        .map((t) => ({ id: nextId(), label: t.task, done: false, taskId: t.id }));
      return prevWeeks.map((w, i) =>
        i === extraIdx ? { ...w, items: [...w.items, ...incompleteItems] } : w
      );
    });

    const newDayCounter = dayCounter + 1;
    if (newDayCounter >= 28) {
      // Month complete → push to history, reset
      setWeeks((finalWeeks) => {
        const weekGoal = finalWeeks.slice(0, 4).reduce((a, w) => a + w.items.length, 0);
        const weekDone = finalWeeks.slice(0, 4).reduce((a, w) => a + w.items.filter((i) => i.done).length, 0);
        const progress = weekGoal === 0 ? 0 : Math.round((weekDone / weekGoal) * 100);
        setHistory((prev) => [
          {
            id: nextId(),
            month: new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" }),
            progress,
            habitsGoal: weekGoal,
            habitsCompleted: weekDone,
            weeks: finalWeeks.slice(0, 4).map((w) => ({
              id: w.id,
              label: w.label,
              color: w.color,
              goal: w.items.length,
              completed: w.items.filter((i) => i.done).length,
              progress:
                w.items.length === 0
                  ? 0
                  : Math.round((w.items.filter((i) => i.done).length / w.items.length) * 100),
            })),
          },
          ...prev,
        ]);
        return makeEmptyWeeks();
      });
      setDayCounter(0);
    } else {
      setDayCounter(newDayCounter);
    }
  }

  /* ---------- derived chart data ---------- */
  const statusData = useMemo(
    () => STATUSES.map((s) => ({ status: s, count: tasks.filter((t) => t.status === s).length })),
    [tasks]
  );

  const categoryData = useMemo(
    () =>
      CATEGORIES.map((c) => ({ name: c, value: tasks.filter((t) => t.category === c).length })).filter(
        (c) => c.value > 0
      ),
    [tasks]
  );

  const totalTasks = tasks.length;

  /* ---------- task CRUD ---------- */
  const updateTask = (id, patch) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  // sync task name → Week 1 habit label
  const syncWeekLabel = (taskId, label) =>
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== 0 ? w : { ...w, items: w.items.map((it) => (it.taskId === taskId ? { ...it, label } : it)) }
      )
    );

  const toggleDone = (id) => {
    let newDone;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        newDone = !t.done;
        return { ...t, done: newDone, status: newDone ? "Complete" : "Not Started" };
      })
    );
    // sync done → Week 1 card
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== 0
          ? w
          : { ...w, items: w.items.map((it) => (it.taskId === id ? { ...it, done: !it.done } : it)) }
      )
    );
  };

  const addTask = () => {
    const id = nextId();
    const taskName = "New task";
    setTasks((prev) => [
      ...prev,
      {
        id,
        task: taskName,
        category: "Personal",
        priority: "Low",
        status: "Not Started",
        duration: "30 minutes",
        dueDate: todayPlus(1),
        done: false,
      },
    ]);
    // also add to Week 1
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== 0 ? w : { ...w, items: [...w.items, { id: nextId(), label: taskName, done: false, taskId: id }] }
      )
    );
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setWeeks((prev) =>
      prev.map((w, i) => (i !== 0 ? w : { ...w, items: w.items.filter((it) => it.taskId !== id) }))
    );
    if (editingId === id) setEditingId(null);
  };

  /* ---------- weekly habits CRUD ---------- */
  const toggleHabit = (weekId, itemId) =>
    setWeeks((prev) =>
      prev.map((w) =>
        w.id !== weekId
          ? w
          : { ...w, items: w.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }
      )
    );

  const removeHabit = (weekId, itemId) =>
    setWeeks((prev) =>
      prev.map((w) => (w.id !== weekId ? w : { ...w, items: w.items.filter((i) => i.id !== itemId) }))
    );

  const weekProgress = (w) =>
    w.items.length === 0 ? 0 : Math.round((w.items.filter((i) => i.done).length / w.items.length) * 100);

  const weeklyTotals = useMemo(() => {
    const goal = weeks.reduce((a, w) => a + w.items.length, 0);
    const completed = weeks.reduce((a, w) => a + w.items.filter((i) => i.done).length, 0);
    return {
      goal,
      completed,
      remaining: goal - completed,
      weeklyHabits: weeks[currentWeekIndex]?.items.length ?? 0,
    };
  }, [weeks, currentWeekIndex]);

  const removeHistoryEntry = (id) => setHistory((prev) => prev.filter((h) => h.id !== id));

  /* =============================== RENDER =============================== */

  if (isPending || loading) {
    return (
      <div className="min-h-screen mt-15 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-default-500 text-sm">Loading your tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15 bg-background text-foreground transition-colors">
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-10">

        {/* saving indicator */}
        {saving && (
          <div className="fixed bottom-4 right-4 z-50 bg-primary text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            Saving…
          </div>
        )}

        {/* ----------------------------- HERO / SUMMARY ----------------------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-pink-200/60 to-pink-100/30 dark:from-pink-900/30 dark:to-pink-950/10 lg:col-span-1">
            <CardContent className="flex flex-col justify-center gap-1 py-8">
              <p className="text-sm uppercase tracking-wide opacity-60">To Do List</p>
              <p className="text-3xl font-bold">
                {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Chip color="secondary" variant="flat" size="lg">
                  Total Tasks: {totalTasks}
                </Chip>
                <Chip color="success" variant="flat" size="lg">
                  Done: {tasks.filter((t) => t.done).length}
                </Chip>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader className="font-semibold">Status Bar Chart: </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} />
                  <RTooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLOR[entry.status]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 h-[400px]">
            <CardHeader className="font-semibold">Tasks Per Category</CardHeader>
            <CardContent className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={35} outerRadius={70} paddingAngle={2}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLOR[entry.name]} />
                    ))}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* ----------------------------- TASK TABLE ----------------------------- */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Task List</h2>
            <Button color="primary" startContent={<Plus size={16} />} onPress={addTask}>
              Add row
            </Button>
          </div>

          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-default-200 bg-default-100">
                    <th className="w-10 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-default-500">#</th>
                    <th className="w-12 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-default-500">Done</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-default-500 px-3 py-3 min-w-[200px]">Task</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-default-500 px-3 py-3">Category</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-default-500 px-3 py-3">Priority</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-default-500 px-3 py-3">Status</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-default-500 px-3 py-3">Duration</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-default-500 px-3 py-3">Due Date</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-default-500 px-3 py-3">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-default-400">
                        No tasks yet — add one!
                      </td>
                    </tr>
                  )}
                  {tasks.map((t, idx) => {
                    const left = daysLeftLabel(t.dueDate);
                    const isEditing = editingId === t.id;
                    return (
                      <tr
                        key={t.id}
                        className={`border-b border-default-100 hover:brightness-95 transition-colors ${CATEGORY_ROW_BG[t.category] || ""} ${t.done ? "opacity-60" : ""}`}
                      >
                        {/* row number */}
                        <td className="px-3 py-2 text-center text-xs text-default-400 font-medium">{idx + 1}</td>

                        {/* done checkbox button */}
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => toggleDone(t.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 mx-auto ${t.done
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-default-300 hover:border-primary bg-transparent"
                              }`}
                            aria-label="Mark done"
                          >
                            {t.done && (
                              <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1,5 4,8 11,1" />
                              </svg>
                            )}
                          </button>
                        </td>

                        {/* task name with inline edit + delete */}
                        <td className="px-3 py-2">
                          <div className="group relative flex items-center gap-2">
                            <input
                              value={t.task}
                              readOnly={!isEditing}
                              onChange={(e) => {
                                updateTask(t.id, { task: e.target.value });
                                syncWeekLabel(t.id, e.target.value);
                              }}
                              onBlur={() => setEditingId((cur) => (cur === t.id ? null : cur))}
                              onKeyDown={(e) => { if (e.key === "Enter") setEditingId(null); }}
                              autoFocus={isEditing}
                              className={`w-full bg-transparent text-sm outline-none border-b ${isEditing ? "border-primary" : "border-transparent"
                                } px-1 py-1.5 transition-colors ${t.done ? "line-through opacity-60 text-default-400" : ""}`}
                            />
                            <div className={`flex items-center gap-1 shrink-0 transition-opacity ${isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                              {isEditing ? (
                                <Tooltip content="Done editing">
                                  <Button isIconOnly size="sm" variant="light" color="success" onPress={() => setEditingId(null)}>
                                    <Check size={14} />
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Tooltip content="Edit task">
                                  <Button isIconOnly size="sm" variant="light" color="primary" onPress={() => setEditingId(t.id)}>
                                    <Pencil size={14} />
                                  </Button>
                                </Tooltip>
                              )}
                              <Tooltip content="Remove task" color="danger">
                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => removeTask(t.id)}>
                                  <Trash2 size={14} />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-2">
                          <select
                            value={t.category}
                            onChange={(e) => updateTask(t.id, { category: e.target.value })}
                            className="bg-transparent text-sm outline-none border border-default-200 rounded-lg px-2 py-1.5 min-w-[120px] cursor-pointer focus:border-primary transition-colors text-slate-800 dark:text-slate-200 font-semibold"
                          >
                            {CATEGORIES.map((c) => (
                              <option
                                key={c}
                                value={c}
                                className="bg-white dark:bg-[#111827]"
                                style={{
                                  color: CATEGORY_COLOR[c],
                                  backgroundColor: "#1e293b",
                                }}
                              >
                                {c}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3 py-2">
                          <select
                            value={t.priority}
                            onChange={(e) => updateTask(t.id, { priority: e.target.value })}
                            className="bg-transparent text-sm outline-none border border-default-200 rounded-lg px-2 py-1.5 min-w-[110px] cursor-pointer focus:border-primary transition-colors text-slate-800 dark:text-slate-200 font-semibold"
                          >
                            {PRIORITIES.map((p) => (
                              <option
                                key={p}
                                value={p}
                                className="bg-white dark:bg-[#111827]"
                                style={{
                                  color: PRIORITY_COLOR[p],
                                  backgroundColor: "#1e293b",
                                }}
                              >
                                {p}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3 py-2">
                          <select
                            value={t.status}
                            onChange={(e) => updateTask(t.id, { status: e.target.value })}
                            className="bg-transparent text-sm outline-none border border-default-200 rounded-lg px-2 py-1.5 min-w-[130px] cursor-pointer focus:border-primary transition-colors text-slate-800 dark:text-slate-200 font-semibold"
                          >
                            {STATUSES.map((s) => (
                              <option
                                key={s}
                                value={s}
                                className="bg-white dark:bg-[#111827]"
                                style={{
                                  color: STATUS_COLOR[s],
                                  backgroundColor: "#1e293b",
                                }}
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3 py-2">
                          <select
                            value={t.duration}
                            onChange={(e) => updateTask(t.id, { duration: e.target.value })}
                            className="bg-transparent text-sm outline-none border border-default-200 rounded-lg px-2 py-1.5 min-w-[110px] cursor-pointer focus:border-primary transition-colors text-slate-800 dark:text-slate-200 font-semibold"
                          >
                            {DURATIONS.map((d) => (
                              <option
                                key={d}
                                value={d}
                                className="bg-white dark:bg-[#111827]"
                                style={{
                                  color: "#cbd5e1",
                                  backgroundColor: "#1e293b",
                                }}
                              >
                                {d}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3 py-2">
                          <input
                            type="date"
                            value={t.dueDate}
                            onChange={(e) => updateTask(t.id, { dueDate: e.target.value })}
                            className="bg-transparent text-sm outline-none border-b border-default-200 focus:border-primary px-1 py-1.5 min-w-[140px] transition-colors"
                          />
                        </td>

                        <td className="px-3 py-2">
                          <Chip size="sm" color={left.color} variant="flat">
                            {left.text}
                          </Chip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* ----------------------------- WEEKLY HABITS ----------------------------- */}
        <section>
          <h2 className="text-xl font-bold mb-3">Weekly Habits</h2>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-5 border border-slate-200 dark:border-slate-800/80 grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-5 transition-colors duration-200">
            {/* left summary */}
            <Card className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
              <CardContent className="space-y-3 py-5">
                <SummaryRow label="Weekly Habits" value={weeklyTotals.weeklyHabits} />
                <SummaryRow label="Weekly Habits Goals" value={weeklyTotals.goal} />
                <SummaryRow label="Completed" value={weeklyTotals.completed} />
                <SummaryRow label="Remaining" value={weeklyTotals.remaining} />
              </CardContent>
            </Card>

            {/* week columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {weeks.map((w, wi) => (
                <div
                  key={w.id}
                  className={`rounded-xl bg-white dark:bg-slate-900 border flex flex-col overflow-hidden ${
                    wi === currentWeekIndex
                      ? "border-cyan-400/60 ring-1 ring-cyan-400/30"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className={`${w.color} px-3 py-2 font-semibold text-white text-sm`}>{w.label}</div>
                  <div className="flex-1 p-2 space-y-1">
                    {w.items.length === 0 && (
                      <p className="text-[11px] text-slate-500 px-1 py-2">No tasks yet</p>
                    )}
                    {w.items.map((item, idx) => (
                      <div key={item.id} className="group flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 w-4 shrink-0 text-right">{idx + 1}</span>
                        <span className={`text-xs flex-1 truncate ${item.done ? "line-through opacity-50 text-slate-400" : "text-slate-700 dark:text-slate-200"}`}>
                          {item.label}
                        </span>
                        <button
                          onClick={() => removeHabit(w.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pb-3">
                    <ProgressBar value={weekProgress(w)} size="sm" color="success" className="mb-1" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">{weekProgress(w)}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* right ring */}
            <Card className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-5">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Weekly Habits Progress</p>
                <RingProgress
                  value={
                    weeklyTotals.goal === 0
                      ? 0
                      : Math.round((weeklyTotals.completed / weeklyTotals.goal) * 100)
                  }
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ----------------------------- HISTORY ----------------------------- */}
        <section>
          <h2 className="text-xl font-bold mb-3">History</h2>
          {history.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-default-400 text-sm">
                No history yet — complete a full 4-week cycle to see your monthly report here.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {history.map((h) => (
                <Card key={h.id} className="border border-default-200">
                  <CardContent className="space-y-4 py-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm opacity-60">{h.month}</p>
                        <p className="text-2xl font-bold">{h.progress}% Month Improvement</p>
                        <p className="text-xs opacity-60">
                          {h.habitsCompleted} / {h.habitsGoal} habits completed
                        </p>
                      </div>
                      <Tooltip content="Remove this report" color="danger">
                        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => removeHistoryEntry(h.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                    <ProgressBar value={h.progress} size="sm" color="secondary" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                      {(h.weeks ?? []).map((w) => (
                        <div key={w.id} className="rounded-xl border border-default-200 overflow-hidden">
                          <div className={`${w.color} px-3 py-2 font-semibold text-white text-sm`}>{w.label}</div>
                          <div className="p-3 space-y-1">
                            <p className="text-sm font-bold">{w.progress}%</p>
                            <ProgressBar value={w.progress} size="sm" color="success" />
                            <p className="text-[11px] opacity-60">{w.completed} / {w.goal} completed</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ----------------------------- small components ----------------------------- */

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}

function RingProgress({ value = 0 }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="10" fill="none" />
      <circle
        cx="60"
        cy="60"
        r={r}
        stroke="#22c55e"
        strokeWidth="10"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="66" textAnchor="middle" fontSize="20" className="fill-slate-800 dark:fill-white font-bold">
        {value}%
      </text>
    </svg>
  );
}
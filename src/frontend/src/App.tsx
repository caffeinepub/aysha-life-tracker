import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Moon,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CheckedItems, Task } from "./backend.d";

const queryClient = new QueryClient();

const MA_BOOKS = [
  "English Language Teaching",
  "Indian Writing in English",
  "Chaucer → Elizabethan",
  "Milton → Pre-Romantics",
  "Shakespeare Studies",
  "Romantics & Victorians",
  "English Literature 1900–1945",
  "American Literature",
  "English Critical Tradition",
  "Research Skills",
];

const CERTIFICATES = [
  "TESOL Certificate",
  "Teaching English Online",
  "Educational Psychology",
  "Phonics Teaching",
];

const RIYALAH = [
  "Tahajjud",
  "Fajr Adhkar",
  "Qur'an",
  "Istighfar",
  "Swalath",
  "Kitab Reading",
];

const NET_PREP = [
  "Literary Terms",
  "Literary Theory",
  "NET PYQs",
  "Critical Theories",
  "Revision",
];

const STUDENTS = ["Naithan", "Theo", "Serah", "New Student 1", "New Student 2"];

const INCOME_GOAL = 15000;

// Circular SVG progress ring
function CircularRing({
  value,
  size = 160,
  strokeWidth = 12,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <svg
          width={size}
          height={size}
          className="absolute inset-0 opacity-30"
          style={{ filter: "blur(6px)" }}
          aria-hidden="true"
        >
          <title>Progress glow</title>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.75 0.16 80)"
            strokeWidth={strokeWidth * 0.8}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <svg width={size} height={size} className="relative" aria-hidden="true">
          <title>Circular progress ring</title>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.38 0.08 285 / 0.4)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#spiritualGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
          <defs>
            <linearGradient
              id="spiritualGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="oklch(0.75 0.16 80)" />
              <stop offset="100%" stopColor="oklch(0.62 0.22 285)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display text-3xl font-bold"
            style={{ color: "oklch(0.85 0.14 80)" }}
          >
            {Math.round(value)}%
          </span>
          <span className="text-xs" style={{ color: "oklch(0.65 0.08 285)" }}>
            {sublabel}
          </span>
        </div>
      </div>
      <span
        className="font-display text-lg font-semibold"
        style={{ color: "oklch(0.88 0.1 80)" }}
      >
        {label}
      </span>
    </div>
  );
}

// Pomodoro ring
function PomodoroRing({
  time,
  total = 1500,
  size = 200,
  strokeWidth = 14,
}: {
  time: number;
  total?: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = time / total;
  const offset = circumference * (1 - progress);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 opacity-20"
        style={{ filter: "blur(8px)" }}
        aria-hidden="true"
      >
        <title>Timer glow</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.55 0.18 225)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <svg width={size} height={size} className="relative" aria-hidden="true">
        <title>Pomodoro timer ring</title>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.88 0.025 225 / 0.4)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#dailyGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s linear" }}
        />
        <defs>
          <linearGradient
            id="dailyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="oklch(0.5 0.18 225)" />
            <stop offset="100%" stopColor="oklch(0.68 0.16 200)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-4xl font-bold"
          style={{ color: "oklch(0.25 0.06 225)" }}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <span
          className="text-sm font-medium mt-1"
          style={{ color: "oklch(0.5 0.1 225)" }}
        >
          Focus Session
        </span>
      </div>
    </div>
  );
}

function AppContent() {
  const { actor, isFetching } = useActor();

  const [checkedItems, setCheckedItems] = useState<CheckedItems>({
    mABooks: [],
    certificates: [],
    riyalah: [],
    nETPrep: [],
    students: [],
  });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [incomeEntries, setIncomeEntries] = useState<
    { label: string; amount: number }[]
  >([]);
  const [incomeEntryLabel, setIncomeEntryLabel] = useState("");
  const [incomeEntryAmount, setIncomeEntryAmount] = useState("");
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  // Timer state (not persisted)
  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  const isLoaded = useRef(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load data on mount
  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isUserDataPersisted()
      .then((persisted) => {
        if (persisted) {
          return actor.loadUserData();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setCheckedItems(data.checkedItems);
          const inc = Number(data.monthlyIncome);
          setMonthlyIncome(inc);
          setDailyTasks(data.dailyTasks);
        }
        isLoaded.current = true;
      })
      .catch(() => {
        isLoaded.current = true;
      });
  }, [actor, isFetching]);

  // Debounced auto-save
  const triggerSave = useCallback(
    (ci: CheckedItems, income: number, tasks: Task[]) => {
      if (!isLoaded.current || !actor) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        actor
          .saveUserData(ci, BigInt(Math.round(income)), tasks)
          .then(() =>
            toast.success("Progress saved", { duration: 1500, id: "autosave" }),
          )
          .catch(() => toast.error("Could not save", { id: "autosave-err" }));
      }, 1000);
    },
    [actor],
  );

  useEffect(() => {
    if (!isLoaded.current) return;
    triggerSave(checkedItems, monthlyIncome, dailyTasks);
  }, [checkedItems, monthlyIncome, dailyTasks, triggerSave]);

  // Timer
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setRunning(false);
          toast.success("🎉 Pomodoro complete! Take a break.", {
            duration: 4000,
          });
          return 1500;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const toggleCheck = useCallback((key: keyof CheckedItems, item: string) => {
    setCheckedItems((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(item)
          ? list.filter((i) => i !== item)
          : [...list, item],
      };
    });
  }, []);

  const addTask = () => {
    if (!taskInput.trim()) return;
    setDailyTasks((prev) => [
      ...prev,
      { description: taskInput.trim(), done: false },
    ]);
    setTaskInput("");
  };

  const toggleTask = (index: number) => {
    setDailyTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTask = (index: number) => {
    setDailyTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // Sync monthlyIncome from entries
  useEffect(() => {
    if (incomeEntries.length === 0) return;
    const total = incomeEntries.reduce((sum, e) => sum + e.amount, 0);
    setMonthlyIncome(total);
  }, [incomeEntries]);

  const handleAddIncomeEntry = () => {
    const amt = Number.parseFloat(incomeEntryAmount);
    if (!incomeEntryLabel.trim() || Number.isNaN(amt) || amt <= 0) return;
    setIncomeEntries((prev) => [
      ...prev,
      { label: incomeEntryLabel.trim(), amount: amt },
    ]);
    setIncomeEntryLabel("");
    setIncomeEntryAmount("");
  };

  const handleDeleteIncomeEntry = (idx: number) => {
    setIncomeEntries((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length === 0) {
        setMonthlyIncome(0);
      }
      return next;
    });
  };

  const pct = (done: number, total: number) =>
    total === 0 ? 0 : Math.round((done / total) * 100);

  const riyalahPct = pct(checkedItems.riyalah.length, RIYALAH.length);
  const incomeGoalPct = Math.min(
    100,
    Math.round((monthlyIncome / INCOME_GOAL) * 100),
  );

  // Spiritual tab checklist items
  const spiritualChecklistItems = RIYALAH.map((item, i) => {
    const emojis = ["🌙", "🌅", "📖", "🤲", "☪️", "📚"];
    return { label: item, emoji: emojis[i] };
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.1 285) 0%, oklch(0.3 0.12 260) 40%, oklch(0.42 0.1 220) 70%, oklch(0.52 0.1 50) 100%)",
          }}
        />
        {/* Star dots */}
        <div className="absolute inset-0 star-field" />
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative container mx-auto px-4 py-10 md:py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles
                className="w-6 h-6"
                style={{ color: "oklch(0.85 0.14 80)" }}
              />
              <span
                className="font-display text-sm font-semibold tracking-widest uppercase"
                style={{ color: "oklch(0.75 0.12 80)" }}
              >
                Personal Life Tracker
              </span>
              <Sparkles
                className="w-6 h-6"
                style={{ color: "oklch(0.85 0.14 80)" }}
              />
            </div>
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-3"
              style={{ color: "oklch(0.97 0.01 75)" }}
            >
              Aysha&apos;s Life Tracker
            </h1>
            <p
              className="text-base md:text-lg max-w-md mx-auto"
              style={{ color: "oklch(0.78 0.06 285)" }}
            >
              Nurture your soul · Grow your mind · Build your career
            </p>
          </motion.div>

          {/* Quick stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            {[
              {
                label: "Riyalah",
                value: `${checkedItems.riyalah.length}/${RIYALAH.length}`,
                color: "oklch(0.75 0.16 80)",
              },
              {
                label: "MA Books",
                value: `${checkedItems.mABooks.length}/${MA_BOOKS.length}`,
                color: "oklch(0.7 0.12 155)",
              },
              {
                label: "Students",
                value: `${checkedItems.students.length}/${STUDENTS.length}`,
                color: "oklch(0.8 0.14 55)",
              },
              {
                label: "Tasks Done",
                value: `${dailyTasks.filter((t) => t.done).length}/${dailyTasks.length}`,
                color: "oklch(0.72 0.14 225)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: "oklch(1 0 0 / 0.08)",
                  border: "1px solid oklch(1 0 0 / 0.15)",
                  color: stat.color,
                }}
              >
                <span style={{ color: "oklch(0.82 0.04 285)" }}>
                  {stat.label}:{" "}
                </span>
                {stat.value}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="spiritual" className="space-y-6">
          <TabsList
            className="grid grid-cols-4 gap-1 p-1 h-auto rounded-2xl"
            style={{
              background: "oklch(0.92 0.018 75 / 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid oklch(0.86 0.02 75 / 0.7)",
            }}
          >
            <TabsTrigger
              value="spiritual"
              data-ocid="nav.spiritual.tab"
              className="flex items-center gap-1.5 py-2.5 rounded-xl font-medium text-sm transition-all data-[state=active]:shadow-md"
              style={
                {
                  "--tab-active-bg":
                    "linear-gradient(135deg, oklch(0.3 0.14 285), oklch(0.25 0.1 295))",
                } as React.CSSProperties
              }
            >
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Spiritual</span>
            </TabsTrigger>
            <TabsTrigger
              value="academics"
              data-ocid="nav.academics.tab"
              className="flex items-center gap-1.5 py-2.5 rounded-xl font-medium text-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Academics</span>
            </TabsTrigger>
            <TabsTrigger
              value="career"
              data-ocid="nav.career.tab"
              className="flex items-center gap-1.5 py-2.5 rounded-xl font-medium text-sm transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Career</span>
            </TabsTrigger>
            <TabsTrigger
              value="daily"
              data-ocid="nav.daily.tab"
              className="flex items-center gap-1.5 py-2.5 rounded-xl font-medium text-sm transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Daily</span>
            </TabsTrigger>
          </TabsList>

          {/* ──────────────── SPIRITUAL TAB ──────────────── */}
          <TabsContent value="spiritual" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid gap-6 md:grid-cols-[1fr_280px]"
            >
              {/* Checklist card */}
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.18 0.1 285 / 0.96), oklch(0.15 0.08 295 / 0.96))",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 8px 32px oklch(0.12 0.1 285 / 0.5), 0 0 0 1px oklch(0.35 0.1 285 / 0.3), inset 0 1px 0 oklch(0.5 0.12 80 / 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="font-display text-xl font-bold"
                      style={{ color: "oklch(0.92 0.1 80)" }}
                    >
                      🌙 Daily Riyalah
                    </h2>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "oklch(0.6 0.08 285)" }}
                    >
                      Spiritual practices for today
                    </p>
                  </div>
                  <Badge
                    className="text-sm px-3 py-1 rounded-full font-semibold"
                    style={{
                      background: "oklch(0.42 0.22 285 / 0.3)",
                      color: "oklch(0.85 0.14 80)",
                      border: "1px solid oklch(0.5 0.15 80 / 0.3)",
                    }}
                  >
                    {checkedItems.riyalah.length} / {RIYALAH.length}
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {spiritualChecklistItems.map(({ label, emoji }, i) => {
                    const checked = checkedItems.riyalah.includes(label);
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.07,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                      >
                        <label
                          htmlFor={`riyalah-${i}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                          style={{
                            background: checked
                              ? "oklch(0.42 0.22 285 / 0.25)"
                              : "oklch(0.28 0.08 285 / 0.3)",
                            border: `1px solid ${checked ? "oklch(0.55 0.18 80 / 0.4)" : "oklch(0.38 0.08 285 / 0.3)"}`,
                          }}
                        >
                          <Checkbox
                            id={`riyalah-${i}`}
                            data-ocid={`spiritual.checkbox.${i + 1}`}
                            checked={checked}
                            onCheckedChange={() =>
                              toggleCheck("riyalah", label)
                            }
                            className="border-2"
                            style={{
                              borderColor: checked
                                ? "oklch(0.75 0.16 80)"
                                : "oklch(0.45 0.1 285)",
                            }}
                          />
                          <span className="text-lg">{emoji}</span>
                          <span
                            className="font-medium"
                            style={{
                              color: checked
                                ? "oklch(0.85 0.14 80)"
                                : "oklch(0.78 0.06 285)",
                              textDecoration: checked ? "line-through" : "none",
                              opacity: checked ? 0.75 : 1,
                            }}
                          >
                            {label}
                          </span>
                          {checked && (
                            <span
                              className="ml-auto text-sm"
                              style={{ color: "oklch(0.75 0.16 80)" }}
                            >
                              ✓
                            </span>
                          )}
                        </label>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Ring progress */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center justify-center gap-6"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.2 0.09 285 / 0.95), oklch(0.16 0.07 295 / 0.95))",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 8px 32px oklch(0.12 0.1 285 / 0.5), 0 0 0 1px oklch(0.35 0.1 285 / 0.3)",
                }}
              >
                <CircularRing
                  value={riyalahPct}
                  size={160}
                  strokeWidth={14}
                  label="Today's Progress"
                  sublabel={`${checkedItems.riyalah.length} of ${RIYALAH.length} done`}
                />

                <div className="w-full space-y-2">
                  <div
                    className="text-center text-sm font-medium py-2 px-4 rounded-xl"
                    style={{
                      background: "oklch(0.28 0.1 285 / 0.5)",
                      color: "oklch(0.7 0.1 285)",
                    }}
                  >
                    {riyalahPct === 100
                      ? "🌟 All practices complete! Masha'Allah!"
                      : riyalahPct >= 50
                        ? "💪 Keep going, you're halfway there!"
                        : "🌙 Begin your spiritual journey for today"}
                  </div>
                </div>

                <div
                  className="w-full p-3 rounded-xl text-center"
                  style={{
                    background: "oklch(0.25 0.08 285 / 0.4)",
                    border: "1px solid oklch(0.38 0.1 285 / 0.3)",
                  }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.58 0.08 285)" }}
                  >
                    Daily Reminder
                  </p>
                  <p
                    className="text-sm mt-1 italic"
                    style={{ color: "oklch(0.75 0.1 80)" }}
                  >
                    "Indeed, prayer has been decreed upon the believers a decree
                    of specified times."
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.52 0.07 285)" }}
                  >
                    — Quran 4:103
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ──────────────── ACADEMICS TAB ──────────────── */}
          <TabsContent value="academics" className="space-y-5 mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid gap-5 md:grid-cols-2"
            >
              {/* MA Books */}
              <Card className="card-journal rounded-2xl border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="font-display text-xl"
                      style={{ color: "oklch(0.32 0.12 155)" }}
                    >
                      📚 MA Books
                    </CardTitle>
                    <Badge
                      className="rounded-full text-xs px-2.5"
                      style={{
                        background: "oklch(0.42 0.14 155 / 0.12)",
                        color: "oklch(0.38 0.12 155)",
                        border: "1px solid oklch(0.55 0.12 155 / 0.25)",
                      }}
                    >
                      {checkedItems.mABooks.length}/{MA_BOOKS.length}
                    </Badge>
                  </div>
                  <div className="mt-2 academics-progress">
                    <Progress
                      value={pct(checkedItems.mABooks.length, MA_BOOKS.length)}
                      className="h-2.5 rounded-full"
                      style={{ background: "oklch(0.88 0.025 155 / 0.4)" }}
                    />
                    <p
                      className="text-xs mt-1.5"
                      style={{ color: "oklch(0.58 0.08 155)" }}
                    >
                      {pct(checkedItems.mABooks.length, MA_BOOKS.length)}%
                      complete
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {MA_BOOKS.map((book, i) => {
                    const checked = checkedItems.mABooks.includes(book);
                    return (
                      <motion.label
                        key={book}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.07,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        htmlFor={`mabook-${i}`}
                        className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors"
                        style={{
                          background: checked
                            ? "oklch(0.42 0.14 155 / 0.08)"
                            : "transparent",
                        }}
                      >
                        <Checkbox
                          id={`mabook-${i}`}
                          data-ocid={`academics.mabooks.checkbox.${i + 1}`}
                          checked={checked}
                          onCheckedChange={() => toggleCheck("mABooks", book)}
                          className="mt-0.5"
                          style={{ accentColor: "oklch(0.42 0.14 155)" }}
                        />
                        <span
                          className="text-sm leading-snug"
                          style={{
                            color: checked
                              ? "oklch(0.52 0.1 155)"
                              : "oklch(0.28 0.02 75)",
                            textDecoration: checked ? "line-through" : "none",
                            opacity: checked ? 0.65 : 1,
                          }}
                        >
                          {book}
                        </span>
                      </motion.label>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="space-y-5">
                {/* Certificates */}
                <Card className="card-journal rounded-2xl border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className="font-display text-xl"
                        style={{ color: "oklch(0.32 0.12 155)" }}
                      >
                        🎓 Certificates
                      </CardTitle>
                      <Badge
                        className="rounded-full text-xs px-2.5"
                        style={{
                          background: "oklch(0.42 0.14 155 / 0.12)",
                          color: "oklch(0.38 0.12 155)",
                          border: "1px solid oklch(0.55 0.12 155 / 0.25)",
                        }}
                      >
                        {checkedItems.certificates.length}/{CERTIFICATES.length}
                      </Badge>
                    </div>
                    <div className="mt-2 academics-progress">
                      <Progress
                        value={pct(
                          checkedItems.certificates.length,
                          CERTIFICATES.length,
                        )}
                        className="h-2.5 rounded-full"
                        style={{ background: "oklch(0.88 0.025 155 / 0.4)" }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {CERTIFICATES.map((cert, i) => {
                      const checked = checkedItems.certificates.includes(cert);
                      return (
                        <label
                          key={cert}
                          htmlFor={`cert-${i}`}
                          className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors"
                          style={{
                            background: checked
                              ? "oklch(0.42 0.14 155 / 0.08)"
                              : "transparent",
                          }}
                        >
                          <Checkbox
                            id={`cert-${i}`}
                            data-ocid={`academics.cert.checkbox.${i + 1}`}
                            checked={checked}
                            onCheckedChange={() =>
                              toggleCheck("certificates", cert)
                            }
                          />
                          <span
                            className="text-sm font-medium"
                            style={{
                              color: checked
                                ? "oklch(0.52 0.1 155)"
                                : "oklch(0.28 0.02 75)",
                              textDecoration: checked ? "line-through" : "none",
                              opacity: checked ? 0.65 : 1,
                            }}
                          >
                            {cert}
                          </span>
                        </label>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* NET Preparation */}
                <Card className="card-journal rounded-2xl border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className="font-display text-xl"
                        style={{ color: "oklch(0.32 0.12 155)" }}
                      >
                        🧠 NET Preparation
                      </CardTitle>
                      <Badge
                        className="rounded-full text-xs px-2.5"
                        style={{
                          background: "oklch(0.42 0.14 155 / 0.12)",
                          color: "oklch(0.38 0.12 155)",
                          border: "1px solid oklch(0.55 0.12 155 / 0.25)",
                        }}
                      >
                        {checkedItems.nETPrep.length}/{NET_PREP.length}
                      </Badge>
                    </div>
                    <div className="mt-2 academics-progress">
                      <Progress
                        value={pct(
                          checkedItems.nETPrep.length,
                          NET_PREP.length,
                        )}
                        className="h-2.5 rounded-full"
                        style={{ background: "oklch(0.88 0.025 155 / 0.4)" }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {NET_PREP.map((item, i) => {
                      const checked = checkedItems.nETPrep.includes(item);
                      return (
                        <label
                          key={item}
                          htmlFor={`net-${i}`}
                          className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors"
                          style={{
                            background: checked
                              ? "oklch(0.42 0.14 155 / 0.08)"
                              : "transparent",
                          }}
                        >
                          <Checkbox
                            id={`net-${i}`}
                            data-ocid={`academics.net.checkbox.${i + 1}`}
                            checked={checked}
                            onCheckedChange={() => toggleCheck("nETPrep", item)}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{
                              color: checked
                                ? "oklch(0.52 0.1 155)"
                                : "oklch(0.28 0.02 75)",
                              textDecoration: checked ? "line-through" : "none",
                              opacity: checked ? 0.65 : 1,
                            }}
                          >
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* ──────────────── CAREER TAB ──────────────── */}
          <TabsContent value="career" className="space-y-5 mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid gap-5 md:grid-cols-2"
            >
              {/* Students Goal */}
              <Card className="card-journal rounded-2xl border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="font-display text-xl"
                      style={{ color: "oklch(0.38 0.16 50)" }}
                    >
                      👩‍🏫 Students Goal
                    </CardTitle>
                    <Badge
                      className="rounded-full text-xs px-2.5"
                      style={{
                        background: "oklch(0.55 0.18 50 / 0.12)",
                        color: "oklch(0.45 0.16 50)",
                        border: "1px solid oklch(0.65 0.15 55 / 0.3)",
                      }}
                    >
                      {checkedItems.students.length}/{STUDENTS.length}
                    </Badge>
                  </div>
                  <div className="mt-2 career-progress">
                    <Progress
                      value={pct(checkedItems.students.length, STUDENTS.length)}
                      className="h-2.5 rounded-full"
                      style={{ background: "oklch(0.88 0.03 55 / 0.4)" }}
                    />
                    <p
                      className="text-xs mt-1.5"
                      style={{ color: "oklch(0.58 0.1 55)" }}
                    >
                      {checkedItems.students.length} students enrolled
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {STUDENTS.map((student, i) => {
                    const checked = checkedItems.students.includes(student);
                    const initials = student
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <motion.label
                        key={student}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.07,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        htmlFor={`student-${i}`}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: checked
                            ? "oklch(0.55 0.18 50 / 0.1)"
                            : "oklch(0.96 0.02 60)",
                          border: `1px solid ${checked ? "oklch(0.65 0.15 55 / 0.35)" : "oklch(0.88 0.025 60 / 0.6)"}`,
                        }}
                      >
                        <Checkbox
                          id={`student-${i}`}
                          data-ocid={`career.students.checkbox.${i + 1}`}
                          checked={checked}
                          onCheckedChange={() =>
                            toggleCheck("students", student)
                          }
                        />
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: checked
                              ? "oklch(0.65 0.18 50 / 0.25)"
                              : "oklch(0.82 0.06 55 / 0.5)",
                            color: "oklch(0.42 0.14 50)",
                          }}
                        >
                          {initials}
                        </div>
                        <span
                          className="font-medium text-sm"
                          style={{
                            color: checked
                              ? "oklch(0.55 0.14 50)"
                              : "oklch(0.28 0.02 75)",
                            textDecoration: checked ? "line-through" : "none",
                            opacity: checked ? 0.7 : 1,
                          }}
                        >
                          {student}
                        </span>
                        {checked && (
                          <span
                            className="ml-auto text-xs font-medium"
                            style={{ color: "oklch(0.62 0.16 50)" }}
                          >
                            Active ✓
                          </span>
                        )}
                      </motion.label>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Income Tracker */}
              <div className="space-y-4">
                <Card className="card-journal rounded-2xl border-0 overflow-hidden">
                  <CardHeader
                    className="pb-3"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.96 0.03 60), oklch(0.94 0.04 50))",
                    }}
                  >
                    <CardTitle
                      className="font-display text-xl"
                      style={{ color: "oklch(0.38 0.16 50)" }}
                    >
                      💰 Tuition Income Tracker
                    </CardTitle>
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.55 0.1 55)" }}
                    >
                      Monthly earnings from tutoring
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {/* Add income entry */}
                    <div className="space-y-2">
                      <Input
                        data-ocid="income.label_input"
                        type="text"
                        placeholder="Income source (e.g. Student Name)"
                        value={incomeEntryLabel}
                        onChange={(e) => setIncomeEntryLabel(e.target.value)}
                        className="rounded-xl border-0 text-base"
                        style={{
                          background: "oklch(0.95 0.02 60)",
                          color: "oklch(0.25 0.04 60)",
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xl font-bold px-3 py-2 rounded-lg"
                          style={{
                            background: "oklch(0.92 0.04 60)",
                            color: "oklch(0.42 0.14 50)",
                          }}
                        >
                          ₹
                        </span>
                        <Input
                          data-ocid="income.amount_input"
                          type="number"
                          placeholder="Amount"
                          value={incomeEntryAmount}
                          onChange={(e) => setIncomeEntryAmount(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddIncomeEntry()
                          }
                          className="flex-1 rounded-xl border-0 text-base font-medium"
                          style={{
                            background: "oklch(0.95 0.02 60)",
                            color: "oklch(0.25 0.04 60)",
                          }}
                        />
                        <Button
                          data-ocid="income.add_button"
                          onClick={handleAddIncomeEntry}
                          className="rounded-xl px-4 font-semibold"
                          style={{
                            background: "oklch(0.62 0.18 50)",
                            color: "white",
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Income entries list */}
                    {incomeEntries.length > 0 && (
                      <div className="space-y-2">
                        {incomeEntries.map((entry, idx) => (
                          <div
                            key={`${entry.label}-${entry.amount}-${idx}`}
                            data-ocid={`income.item.${idx + 1}`}
                            className="flex items-center justify-between px-3 py-2 rounded-xl"
                            style={{
                              background: "oklch(0.94 0.03 60 / 0.7)",
                              border: "1px solid oklch(0.85 0.06 55 / 0.3)",
                            }}
                          >
                            <span
                              className="text-sm font-medium"
                              style={{ color: "oklch(0.38 0.12 55)" }}
                            >
                              {entry.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-sm font-bold"
                                style={{ color: "oklch(0.42 0.16 50)" }}
                              >
                                ₹{entry.amount.toLocaleString("en-IN")}
                              </span>
                              <button
                                type="button"
                                data-ocid={`income.delete_button.${idx + 1}`}
                                onClick={() => handleDeleteIncomeEntry(idx)}
                                className="text-xs px-2 py-1 rounded-lg transition-colors hover:opacity-80"
                                style={{
                                  background: "oklch(0.88 0.06 25 / 0.4)",
                                  color: "oklch(0.45 0.15 25)",
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {incomeEntries.length === 0 && (
                      <p
                        className="text-xs text-center py-1"
                        style={{ color: "oklch(0.65 0.06 55)" }}
                      >
                        No entries yet — add your income sources above
                      </p>
                    )}

                    {/* Income display */}
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.94 0.04 55), oklch(0.92 0.05 50))",
                        border: "1px solid oklch(0.82 0.06 55 / 0.4)",
                      }}
                    >
                      <p
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: "oklch(0.58 0.1 55)" }}
                      >
                        Current Income
                      </p>
                      <p
                        className="font-display text-3xl font-bold mt-1"
                        style={{ color: "oklch(0.38 0.16 50)" }}
                      >
                        ₹{monthlyIncome.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Goal progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: "oklch(0.5 0.08 55)" }}>
                          Monthly Goal
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: "oklch(0.42 0.14 50)" }}
                        >
                          ₹{INCOME_GOAL.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="career-progress">
                        <Progress
                          value={incomeGoalPct}
                          className="h-3 rounded-full"
                          style={{ background: "oklch(0.88 0.03 55 / 0.4)" }}
                        />
                      </div>
                      <p
                        className="text-xs text-right"
                        style={{ color: "oklch(0.58 0.1 55)" }}
                      >
                        {incomeGoalPct}% of goal reached
                      </p>
                    </div>

                    {/* Income milestone message */}
                    <div
                      className="text-center py-2 px-3 rounded-lg text-sm"
                      style={{
                        background: "oklch(0.92 0.04 60 / 0.6)",
                        color: "oklch(0.45 0.12 55)",
                      }}
                    >
                      {incomeGoalPct >= 100
                        ? "🎉 Goal achieved! Congratulations!"
                        : incomeGoalPct >= 75
                          ? "📈 Almost there! Great progress!"
                          : incomeGoalPct >= 50
                            ? "💪 Halfway to your goal!"
                            : incomeGoalPct > 0
                              ? "🌱 Keep growing your teaching practice!"
                              : "✨ Enter your monthly earnings above"}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Active Students",
                      value: checkedItems.students.length,
                      icon: "👥",
                    },
                    {
                      label: "Certs Earned",
                      value: checkedItems.certificates.length,
                      icon: "🎓",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl p-4 text-center"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.96 0.03 60), oklch(0.94 0.04 50))",
                        border: "1px solid oklch(0.85 0.04 55 / 0.5)",
                      }}
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div
                        className="font-display text-2xl font-bold"
                        style={{ color: "oklch(0.38 0.16 50)" }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.58 0.1 55)" }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ──────────────── DAILY TAB ──────────────── */}
          <TabsContent value="daily" className="space-y-5 mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid gap-5 md:grid-cols-[1fr_260px]"
            >
              {/* Daily Task Planner */}
              <Card className="card-journal rounded-2xl border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="font-display text-xl"
                      style={{ color: "oklch(0.32 0.15 225)" }}
                    >
                      📅 Daily Planner
                    </CardTitle>
                    <Badge
                      className="rounded-full text-xs px-2.5"
                      style={{
                        background: "oklch(0.5 0.18 225 / 0.1)",
                        color: "oklch(0.42 0.15 225)",
                        border: "1px solid oklch(0.6 0.15 225 / 0.3)",
                      }}
                    >
                      {dailyTasks.filter((t) => t.done).length}/
                      {dailyTasks.length} done
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Add task input */}
                  <div className="flex gap-2">
                    <Input
                      data-ocid="daily.todo.input"
                      placeholder="Add a new task for today..."
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      className="flex-1 rounded-xl border-0"
                      style={{
                        background: "oklch(0.94 0.022 225 / 0.5)",
                        color: "oklch(0.25 0.05 225)",
                      }}
                    />
                    <Button
                      data-ocid="daily.todo.add_button"
                      onClick={addTask}
                      className="rounded-xl px-4 shrink-0"
                      style={{
                        background: "oklch(0.5 0.18 225)",
                        color: "white",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Task list */}
                  {dailyTasks.length === 0 ? (
                    <div
                      data-ocid="daily.todo.empty_state"
                      className="text-center py-10 rounded-xl"
                      style={{ background: "oklch(0.96 0.018 225 / 0.5)" }}
                    >
                      <p className="text-3xl mb-2">✨</p>
                      <p
                        className="font-medium"
                        style={{ color: "oklch(0.5 0.1 225)" }}
                      >
                        Your day is a blank canvas
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "oklch(0.65 0.08 225)" }}
                      >
                        Add tasks to plan your productive day
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {dailyTasks.map((task, i) => (
                          <motion.div
                            key={task.description || i}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16, height: 0 }}
                            transition={{ duration: 0.25 }}
                            data-ocid={`daily.todo.item.${i + 1}`}
                            className="flex items-center gap-3 p-3 rounded-xl group transition-all"
                            style={{
                              background: task.done
                                ? "oklch(0.5 0.18 225 / 0.08)"
                                : "oklch(0.96 0.018 225 / 0.5)",
                              border: `1px solid ${task.done ? "oklch(0.6 0.15 225 / 0.25)" : "oklch(0.88 0.022 225 / 0.5)"}`,
                            }}
                          >
                            <Checkbox
                              data-ocid={
                                i === 0 ? "daily.todo.checkbox.1" : undefined
                              }
                              checked={task.done}
                              onCheckedChange={() => toggleTask(i)}
                              id={`task-${i}`}
                            />
                            <label
                              htmlFor={`task-${i}`}
                              className="flex-1 text-sm cursor-pointer leading-snug"
                              style={{
                                color: task.done
                                  ? "oklch(0.6 0.1 225)"
                                  : "oklch(0.28 0.04 75)",
                                textDecoration: task.done
                                  ? "line-through"
                                  : "none",
                                opacity: task.done ? 0.7 : 1,
                              }}
                            >
                              {task.description}
                            </label>
                            <button
                              type="button"
                              data-ocid={
                                i === 0
                                  ? "daily.todo.delete_button.1"
                                  : undefined
                              }
                              onClick={() => deleteTask(i)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity"
                              style={{ color: "oklch(0.58 0.2 25)" }}
                              aria-label="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Daily progress bar */}
                  {dailyTasks.length > 0 && (
                    <div className="pt-1 daily-progress">
                      <Progress
                        value={pct(
                          dailyTasks.filter((t) => t.done).length,
                          dailyTasks.length,
                        )}
                        className="h-2 rounded-full"
                        style={{ background: "oklch(0.88 0.025 225 / 0.4)" }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pomodoro Timer */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center gap-5"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.97 0.022 225), oklch(0.95 0.028 215))",
                  border: "1px solid oklch(0.88 0.03 225 / 0.6)",
                  boxShadow:
                    "0 4px 24px oklch(0.5 0.18 225 / 0.1), 0 0 0 1px oklch(0.82 0.04 225 / 0.3)",
                }}
              >
                <div>
                  <h2
                    className="font-display text-xl font-bold text-center"
                    style={{ color: "oklch(0.32 0.15 225)" }}
                  >
                    ⏱ Pomodoro
                  </h2>
                  <p
                    className="text-xs text-center mt-0.5"
                    style={{ color: "oklch(0.55 0.1 225)" }}
                  >
                    25‑minute focus session
                  </p>
                </div>

                <PomodoroRing
                  time={time}
                  total={1500}
                  size={180}
                  strokeWidth={12}
                />

                <div className="flex gap-2 w-full">
                  <Button
                    data-ocid="timer.primary_button"
                    onClick={() => setRunning(true)}
                    disabled={running}
                    className="flex-1 rounded-xl font-medium"
                    style={{
                      background: running
                        ? "oklch(0.85 0.025 225)"
                        : "oklch(0.5 0.18 225)",
                      color: running ? "oklch(0.55 0.1 225)" : "white",
                    }}
                  >
                    Start
                  </Button>
                  <Button
                    data-ocid="timer.secondary_button"
                    onClick={() => setRunning(false)}
                    disabled={!running}
                    variant="outline"
                    className="flex-1 rounded-xl font-medium border-0"
                    style={{
                      background: !running
                        ? "oklch(0.91 0.02 225)"
                        : "oklch(0.88 0.03 225)",
                      color: !running
                        ? "oklch(0.65 0.08 225)"
                        : "oklch(0.42 0.15 225)",
                    }}
                  >
                    Pause
                  </Button>
                  <Button
                    data-ocid="timer.cancel_button"
                    onClick={() => {
                      setRunning(false);
                      setTime(1500);
                    }}
                    variant="outline"
                    className="rounded-xl border-0 px-3"
                    style={{
                      background: "oklch(0.91 0.02 225)",
                      color: "oklch(0.52 0.1 225)",
                    }}
                    aria-label="Reset timer"
                  >
                    ↺
                  </Button>
                </div>

                {/* Timer status */}
                <div
                  className="w-full py-2 px-3 rounded-xl text-center text-sm"
                  style={{
                    background: running
                      ? "oklch(0.5 0.18 225 / 0.1)"
                      : "oklch(0.91 0.02 225 / 0.8)",
                    color: running
                      ? "oklch(0.42 0.15 225)"
                      : "oklch(0.6 0.08 225)",
                    border: `1px solid ${running ? "oklch(0.65 0.15 225 / 0.3)" : "oklch(0.85 0.025 225 / 0.5)"}`,
                  }}
                >
                  {running
                    ? "🔥 Stay focused!"
                    : time === 1500
                      ? "Ready to focus?"
                      : "⏸ Paused"}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center">
        <p className="text-sm" style={{ color: "oklch(0.6 0.02 75)" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.52 0.12 285)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

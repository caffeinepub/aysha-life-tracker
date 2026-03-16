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
  Pencil,
  Plus,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CheckedItems, Task } from "./backend.d";

const queryClient = new QueryClient();

const INIT_MA_BOOKS = [
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

const INIT_CERTIFICATES = [
  "TESOL Certificate",
  "Teaching English Online",
  "Educational Psychology",
  "Phonics Teaching",
];

const INIT_RIYALAH = [
  "Tahajjud",
  "Fajr Adhkar",
  "Qur'an",
  "Istighfar",
  "Swalath",
  "Kitab Reading",
];

const INIT_NET_PREP = [
  "Literary Terms",
  "Literary Theory",
  "NET PYQs",
  "Critical Theories",
  "Revision",
];

const INIT_STUDENTS = [
  "Naithan",
  "Theo",
  "Serah",
  "New Student 1",
  "New Student 2",
];

const INCOME_GOAL = 15000;

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const REMINDER_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Small steps every day lead to big results over time.",
  "You don't have to be great to start, but you have to start to be great.",
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated day in and day out.",
];

const DEFAULT_EXAM_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().slice(0, 10);
})();

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

  const [maBooks, setMaBooks] = useState<string[]>(INIT_MA_BOOKS);
  const [certificates, setCertificates] = useState<string[]>(INIT_CERTIFICATES);
  const [riyalah, setRiyalah] = useState<string[]>(INIT_RIYALAH);
  const [netPrep, setNetPrep] = useState<string[]>(INIT_NET_PREP);
  const [students, setStudents] = useState<string[]>(INIT_STUDENTS);
  const [editingItem, setEditingItem] = useState<{
    section: string;
    index: number;
    value: string;
  } | null>(null);

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

  // Riyalah streak state (localStorage persisted)
  const [riyalahStreak, setRiyalahStreak] = useState<number>(() => {
    const saved = localStorage.getItem("riyalah_streak");
    return saved ? Number(saved) : 0;
  });
  const [lastStreakDate, setLastStreakDate] = useState<string>(() => {
    return localStorage.getItem("riyalah_streak_date") ?? "";
  });

  // Student session/notes state
  const [studentSessions, setStudentSessions] = useState<
    Record<string, number>
  >({});
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});

  // Daily goals state
  const [dailyGoals, setDailyGoals] = useState<
    { id: string; text: string; done: boolean }[]
  >(() => {
    try {
      const saved = localStorage.getItem("daily_goals");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [goalInput, setGoalInput] = useState("");

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("dark_mode") === "true";
  });

  // MA Exam Countdown
  const [examDate, setExamDate] = useState<string>(() => {
    return localStorage.getItem("exam_date") ?? DEFAULT_EXAM_DATE;
  });
  const [editingExamDate, setEditingExamDate] = useState(false);

  // Today's Reminder
  const [reminderIdx, setReminderIdx] = useState(0);
  const [customReminder, setCustomReminder] = useState<string>(() => {
    return localStorage.getItem("custom_reminder") ?? "";
  });
  const [editingReminder, setEditingReminder] = useState(false);

  // Today's Focus
  const [focusItems, setFocusItems] = useState<
    { label: string; detail: string; done: boolean }[]
  >(() => {
    try {
      const saved = localStorage.getItem("focus_items");
      return saved
        ? JSON.parse(saved)
        : [
            {
              label: "Study",
              detail: "Shakespeare Studies (30 min)",
              done: false,
            },
            { label: "Riyalah", detail: "3/6 done", done: false },
            { label: "Career", detail: "Finish TESOL lesson", done: false },
            { label: "Tuition", detail: "Theo writing practice", done: false },
          ];
    } catch {
      return [];
    }
  });
  const [focusInput, setFocusInput] = useState("");
  const [focusDetailInput, setFocusDetailInput] = useState("");

  // Study Hours This Week
  const [weeklyHours, setWeeklyHours] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("weekly_hours");
      return saved
        ? JSON.parse(saved)
        : { Mon: 2, Tue: 1, Wed: 2, Thu: 3, Fri: 0, Sat: 0, Sun: 0 };
    } catch {
      return { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    }
  });
  const [addMinutesInput, setAddMinutesInput] = useState("");

  // Riyalah Longest Streak
  const [riyalahLongest, setRiyalahLongest] = useState<number>(() => {
    return Number(localStorage.getItem("riyalah_longest") ?? 0);
  });

  // Today's 3 Wins
  const [wins, setWins] = useState<{ label: string; done: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem("today_wins");
      return saved
        ? JSON.parse(saved)
        : [
            { label: "Study MA", done: false },
            { label: "Complete Riyalah", done: false },
            { label: "Work on certificate", done: false },
          ];
    } catch {
      return [
        { label: "Study MA", done: false },
        { label: "Complete Riyalah", done: false },
        { label: "Work on certificate", done: false },
      ];
    }
  });
  const [editingWinIdx, setEditingWinIdx] = useState<number | null>(null);
  const [editingWinLabel, setEditingWinLabel] = useState("");

  // MA Book Progress (individual %)
  const [_maBookProgress, _setMaBookProgress] = useState<
    Record<string, number>
  >(() => {
    try {
      const saved = localStorage.getItem("ma_book_progress");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [_editingBookProgress, _setEditingBookProgress] = useState<
    number | null
  >(null);
  const [_bookProgressInput, _setBookProgressInput] = useState("");

  // Student Target
  const [_studentTarget, _setStudentTarget] = useState<number>(() => {
    return Number(localStorage.getItem("student_target") ?? 5);
  });
  const [_editingStudentTarget, _setEditingStudentTarget] = useState(false);
  const [_studentTargetInput, _setStudentTargetInput] = useState("");

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

  const renameItem = useCallback(
    (
      _section: string,
      index: number,
      newName: string,
      setter: React.Dispatch<React.SetStateAction<string[]>>,
      checkedKey: keyof CheckedItems,
      oldName: string,
    ) => {
      if (!newName.trim() || newName === oldName) return;
      setter((prev) => {
        const next = [...prev];
        next[index] = newName.trim();
        return next;
      });
      setCheckedItems((prev) => {
        const list = prev[checkedKey];
        if (list.includes(oldName)) {
          return {
            ...prev,
            [checkedKey]: list.map((x) => (x === oldName ? newName.trim() : x)),
          };
        }
        return prev;
      });
      setEditingItem(null);
    },
    [],
  );

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

  // Save daily goals to localStorage
  const saveDailyGoals = (
    goals: { id: string; text: string; done: boolean }[],
  ) => {
    localStorage.setItem("daily_goals", JSON.stringify(goals));
    setDailyGoals(goals);
  };

  const addDailyGoal = () => {
    if (!goalInput.trim()) return;
    const newGoals = [
      ...dailyGoals,
      { id: crypto.randomUUID(), text: goalInput.trim(), done: false },
    ];
    saveDailyGoals(newGoals);
    setGoalInput("");
  };

  const toggleDailyGoal = (id: string) => {
    saveDailyGoals(
      dailyGoals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)),
    );
  };

  const deleteDailyGoal = (id: string) => {
    saveDailyGoals(dailyGoals.filter((g) => g.id !== id));
  };

  const handleMarkStreakToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    const allChecked = riyalah.every((item) =>
      checkedItems.riyalah.includes(item),
    );
    if (lastStreakDate === today) {
      toast.info("Already marked for today!");
      return;
    }
    if (!allChecked) {
      const remaining = riyalah.filter(
        (item) => !checkedItems.riyalah.includes(item),
      ).length;
      toast.warning(
        `Complete all Riyalah items first (${remaining} remaining)`,
      );
      return;
    }
    const newStreak = riyalahStreak + 1;
    handleStreakUpdate(newStreak);
    setLastStreakDate(today);
    localStorage.setItem("riyalah_streak_date", today);
    toast.success(`🔥 ${newStreak} day streak! Keep it up!`);
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("dark_mode", String(next));
      return next;
    });
  };

  // Exam countdown
  const daysUntilExam = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    return Math.max(
      0,
      Math.round((exam.getTime() - today.getTime()) / 86400000),
    );
  })();

  // Today's day key
  const todayDayKey =
    DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const totalWeeklyHours = Object.values(weeklyHours).reduce(
    (a, b) => a + b,
    0,
  );

  const addStudyMinutes = () => {
    const mins = Number(addMinutesInput);
    if (!mins || mins <= 0) return;
    setWeeklyHours((prev) => {
      const next = {
        ...prev,
        [todayDayKey]: (prev[todayDayKey] || 0) + mins / 60,
      };
      localStorage.setItem("weekly_hours", JSON.stringify(next));
      return next;
    });
    setAddMinutesInput("");
    toast.success(`+${mins} minutes added to today's study hours`);
  };

  const saveFocusItems = (items: typeof focusItems) => {
    setFocusItems(items);
    localStorage.setItem("focus_items", JSON.stringify(items));
  };

  const saveWins = (newWins: typeof wins) => {
    setWins(newWins);
    localStorage.setItem("today_wins", JSON.stringify(newWins));
  };

  const handleStreakUpdate = (newStreak: number) => {
    setRiyalahStreak(newStreak);
    if (newStreak > riyalahLongest) {
      setRiyalahLongest(newStreak);
      localStorage.setItem("riyalah_longest", String(newStreak));
    }
    localStorage.setItem("riyalah_streak", String(newStreak));
  };

  const currentReminder = customReminder || REMINDER_QUOTES[reminderIdx];

  const booksCompletedCount = checkedItems.mABooks.length;
  const tasksCompletedCount = dailyTasks.filter((t) => t.done).length;

  const pct = (done: number, total: number) =>
    total === 0 ? 0 : Math.round((done / total) * 100);

  const riyalahPct = pct(checkedItems.riyalah.length, riyalah.length);
  const incomeGoalPct = Math.min(
    100,
    Math.round((monthlyIncome / INCOME_GOAL) * 100),
  );

  // Spiritual tab checklist items
  const spiritualChecklistItems = riyalah.map((item, i) => {
    const emojis = ["🌙", "🌅", "📖", "🤲", "☪️", "📚"];
    return { label: item, emoji: emojis[i] };
  });

  return (
    <div className={`min-h-screen${darkMode ? " dark" : ""}`}>
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

          {/* Dark mode toggle */}
          <div className="absolute top-4 right-4">
            <button
              type="button"
              data-ocid="header.dark_mode.toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-all"
              style={{
                background: "oklch(1 0 0 / 0.12)",
                border: "1px solid oklch(1 0 0 / 0.2)",
                color: "oklch(0.92 0.1 80)",
              }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

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
                value: `${checkedItems.riyalah.length}/${riyalah.length}`,
                color: "oklch(0.75 0.16 80)",
              },
              {
                label: "MA Books",
                value: `${checkedItems.mABooks.length}/${maBooks.length}`,
                color: "oklch(0.7 0.12 155)",
              },
              {
                label: "Students",
                value: `${checkedItems.students.length}/${students.length}`,
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
        {/* ──────────────── MA EXAM COUNTDOWN ──────────────── */}
        <div
          data-ocid="exam_countdown.card"
          className="rounded-2xl p-5 mb-6 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.14 285 / 0.95) 0%, oklch(0.32 0.12 230) 50%, oklch(0.42 0.1 200) 100%)",
            border: "1px solid oklch(0.5 0.12 285 / 0.3)",
            boxShadow: "0 8px 32px oklch(0.12 0.1 285 / 0.4)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">🎓</span>
            <span
              className="font-display text-lg font-bold"
              style={{ color: "oklch(0.88 0.1 80)" }}
            >
              MA Exam Countdown
            </span>
          </div>
          {!editingExamDate ? (
            <div className="flex flex-col items-center gap-1">
              <span
                className="font-display text-5xl font-bold"
                style={{ color: "oklch(0.95 0.12 75)" }}
              >
                {daysUntilExam}
              </span>
              <span
                className="text-base"
                style={{ color: "oklch(0.72 0.08 285)" }}
              >
                days until next exam
              </span>
              <span
                className="text-xs mt-1"
                style={{ color: "oklch(0.55 0.08 285)" }}
              >
                {new Date(examDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                type="button"
                data-ocid="exam_countdown.edit_button"
                onClick={() => setEditingExamDate(true)}
                className="mt-2 px-3 py-1 rounded-lg text-xs transition-all"
                style={{
                  background: "oklch(1 0 0 / 0.1)",
                  color: "oklch(0.75 0.1 80)",
                  border: "1px solid oklch(1 0 0 / 0.15)",
                }}
              >
                <Pencil className="w-3 h-3 inline mr-1" />
                Set exam date
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-2">
              <input
                type="date"
                data-ocid="exam_countdown.input"
                value={examDate}
                onChange={(e) => {
                  setExamDate(e.target.value);
                  localStorage.setItem("exam_date", e.target.value);
                }}
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{
                  background: "oklch(1 0 0 / 0.12)",
                  color: "oklch(0.9 0.06 285)",
                  border: "1px solid oklch(0.6 0.1 285 / 0.4)",
                }}
              />
              <button
                type="button"
                data-ocid="exam_countdown.save_button"
                onClick={() => setEditingExamDate(false)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{ background: "oklch(0.55 0.18 150)", color: "white" }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* ──────────────── STATS SUMMARY ──────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div
            data-ocid="stats.study_hours.card"
            className="rounded-2xl p-4 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.03 225), oklch(0.93 0.04 215))",
              border: "1px solid oklch(0.85 0.04 225 / 0.5)",
            }}
          >
            <div
              className="text-2xl font-bold font-display"
              style={{ color: "oklch(0.38 0.16 225)" }}
            >
              {totalWeeklyHours.toFixed(1)}h
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.55 0.1 225)" }}
            >
              Study Hours
            </div>
            <div className="text-xs" style={{ color: "oklch(0.65 0.08 225)" }}>
              This Week
            </div>
          </div>
          <div
            data-ocid="stats.books_completed.card"
            className="rounded-2xl p-4 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.025 155), oklch(0.93 0.03 145))",
              border: "1px solid oklch(0.85 0.03 155 / 0.5)",
            }}
          >
            <div
              className="text-2xl font-bold font-display"
              style={{ color: "oklch(0.38 0.14 155)" }}
            >
              {booksCompletedCount}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.5 0.1 155)" }}
            >
              Books
            </div>
            <div className="text-xs" style={{ color: "oklch(0.6 0.08 155)" }}>
              Completed
            </div>
          </div>
          <div
            data-ocid="stats.tasks_completed.card"
            className="rounded-2xl p-4 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.03 60), oklch(0.93 0.04 50))",
              border: "1px solid oklch(0.85 0.04 55 / 0.5)",
            }}
          >
            <div
              className="text-2xl font-bold font-display"
              style={{ color: "oklch(0.38 0.16 50)" }}
            >
              {tasksCompletedCount}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.52 0.12 55)" }}
            >
              Tasks
            </div>
            <div className="text-xs" style={{ color: "oklch(0.62 0.1 55)" }}>
              Completed
            </div>
          </div>
        </div>

        {/* ──────────────── TODAY'S REMINDER + FOCUS ──────────────── */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Reminder */}
          <div
            data-ocid="reminder.card"
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.98 0.02 80), oklch(0.95 0.04 70))",
              border: "1px solid oklch(0.88 0.05 75 / 0.6)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.38 0.12 60)" }}
              >
                ✨ Today&apos;s Reminder
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  data-ocid="reminder.cycle_button"
                  onClick={() => {
                    setReminderIdx(
                      (prev) => (prev + 1) % REMINDER_QUOTES.length,
                    );
                    setCustomReminder("");
                  }}
                  className="px-2 py-1 rounded-lg text-xs"
                  style={{
                    background: "oklch(0.88 0.04 70 / 0.6)",
                    color: "oklch(0.48 0.1 60)",
                  }}
                >
                  Next
                </button>
                <button
                  type="button"
                  data-ocid="reminder.edit_button"
                  onClick={() => setEditingReminder(!editingReminder)}
                  className="px-2 py-1 rounded-lg text-xs"
                  style={{
                    background: "oklch(0.88 0.04 70 / 0.6)",
                    color: "oklch(0.48 0.1 60)",
                  }}
                >
                  <Pencil className="w-3 h-3 inline" />
                </button>
              </div>
            </div>
            {editingReminder ? (
              <div className="space-y-2">
                <textarea
                  data-ocid="reminder.textarea"
                  value={customReminder || currentReminder}
                  onChange={(e) => setCustomReminder(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl p-2 text-sm resize-none"
                  style={{
                    background: "oklch(0.92 0.025 75 / 0.5)",
                    color: "oklch(0.32 0.08 60)",
                    border: "1px solid oklch(0.8 0.05 70 / 0.5)",
                  }}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="reminder.save_button"
                    onClick={() => {
                      localStorage.setItem("custom_reminder", customReminder);
                      setEditingReminder(false);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: "oklch(0.5 0.16 150)",
                      color: "white",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    data-ocid="reminder.cancel_button"
                    onClick={() => setEditingReminder(false)}
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{
                      background: "oklch(0.88 0.03 60)",
                      color: "oklch(0.45 0.08 60)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: "oklch(0.42 0.1 60)" }}
              >
                &ldquo;{currentReminder}&rdquo;
              </p>
            )}
          </div>

          {/* Today's Focus */}
          <div
            data-ocid="focus.card"
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0.025 285), oklch(0.94 0.03 275))",
              border: "1px solid oklch(0.85 0.04 285 / 0.5)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.35 0.12 285)" }}
              >
                🎯 Today&apos;s Focus
              </span>
            </div>
            <div className="space-y-1.5 mb-3">
              {focusItems.map((item, i) => (
                <div
                  key={`focus-${item.label}-${i}`}
                  data-ocid={`focus.item.${i + 1}`}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    data-ocid={`focus.checkbox.${i + 1}`}
                    checked={item.done}
                    onCheckedChange={() => {
                      const next = focusItems.map((f, idx) =>
                        idx === i ? { ...f, done: !f.done } : f,
                      );
                      saveFocusItems(next);
                    }}
                    id={`focus-${i}`}
                  />
                  <label
                    htmlFor={`focus-${i}`}
                    className="text-sm flex-1 cursor-pointer"
                    style={{
                      color: item.done
                        ? "oklch(0.6 0.06 285)"
                        : "oklch(0.32 0.08 285)",
                      textDecoration: item.done ? "line-through" : "none",
                    }}
                  >
                    <span className="font-semibold">{item.label}:</span>{" "}
                    {item.detail}
                  </label>
                  <button
                    type="button"
                    data-ocid={`focus.delete_button.${i + 1}`}
                    onClick={() =>
                      saveFocusItems(focusItems.filter((_, idx) => idx !== i))
                    }
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:opacity-100"
                    style={{ color: "oklch(0.55 0.18 25)" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Input
                data-ocid="focus.label.input"
                placeholder="Label"
                value={focusInput}
                onChange={(e) => setFocusInput(e.target.value)}
                className="flex-1 rounded-lg border-0 text-xs h-8"
                style={{
                  background: "oklch(0.9 0.025 285 / 0.5)",
                  color: "oklch(0.28 0.06 285)",
                }}
              />
              <Input
                data-ocid="focus.detail.input"
                placeholder="Detail"
                value={focusDetailInput}
                onChange={(e) => setFocusDetailInput(e.target.value)}
                className="flex-1 rounded-lg border-0 text-xs h-8"
                style={{
                  background: "oklch(0.9 0.025 285 / 0.5)",
                  color: "oklch(0.28 0.06 285)",
                }}
              />
              <Button
                data-ocid="focus.add_button"
                onClick={() => {
                  if (!focusInput.trim()) return;
                  saveFocusItems([
                    ...focusItems,
                    {
                      label: focusInput.trim(),
                      detail: focusDetailInput.trim(),
                      done: false,
                    },
                  ]);
                  setFocusInput("");
                  setFocusDetailInput("");
                }}
                className="h-8 px-2 rounded-lg"
                style={{ background: "oklch(0.48 0.16 285)", color: "white" }}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* ──────────────── STUDY HOURS + WINS ──────────────── */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Study Hours This Week */}
          <div
            data-ocid="study_hours.card"
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.03 225), oklch(0.93 0.04 215))",
              border: "1px solid oklch(0.85 0.04 225 / 0.5)",
            }}
          >
            <div
              className="font-display font-semibold text-base mb-3"
              style={{ color: "oklch(0.35 0.14 225)" }}
            >
              📊 Study Hours This Week
            </div>
            <div className="space-y-1.5 mb-3">
              {DAYS_OF_WEEK.map((day) => {
                const hours = weeklyHours[day] || 0;
                const maxH = Math.max(...Object.values(weeklyHours), 1);
                return (
                  <div key={day} className="flex items-center gap-2">
                    <span
                      className="text-xs w-7 shrink-0 font-medium"
                      style={{ color: "oklch(0.48 0.12 225)" }}
                    >
                      {day}
                    </span>
                    <div
                      className="flex-1 h-3 rounded-full overflow-hidden"
                      style={{ background: "oklch(0.88 0.025 225 / 0.4)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(hours / maxH) * 100}%`,
                          background:
                            day === todayDayKey
                              ? "linear-gradient(90deg, oklch(0.5 0.18 225), oklch(0.6 0.16 200))"
                              : "oklch(0.65 0.12 225 / 0.7)",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs w-8 text-right shrink-0"
                      style={{ color: "oklch(0.5 0.1 225)" }}
                    >
                      {hours >= 1
                        ? `${hours.toFixed(1)}h`
                        : `${Math.round(hours * 60)}m`}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                data-ocid="study_hours.add_input"
                type="number"
                placeholder="Add minutes"
                value={addMinutesInput}
                onChange={(e) => setAddMinutesInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addStudyMinutes()}
                className="flex-1 rounded-xl border-0 text-sm h-8"
                style={{
                  background: "oklch(0.9 0.025 225 / 0.5)",
                  color: "oklch(0.28 0.08 225)",
                }}
              />
              <Button
                data-ocid="study_hours.add_button"
                onClick={addStudyMinutes}
                className="h-8 px-3 rounded-xl text-xs"
                style={{ background: "oklch(0.5 0.18 225)", color: "white" }}
              >
                + Add
              </Button>
            </div>
          </div>

          {/* Today's 3 Wins */}
          <div
            data-ocid="wins.card"
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0.03 55), oklch(0.94 0.04 45))",
              border: "1px solid oklch(0.86 0.05 55 / 0.5)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy
                className="w-5 h-5"
                style={{ color: "oklch(0.58 0.2 55)" }}
              />
              <span
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.38 0.14 55)" }}
              >
                Today&apos;s 3 Wins
              </span>
            </div>
            <div className="space-y-2.5">
              {wins.map((win, i) => (
                <div
                  key={`win-${win.label}-${i}`}
                  data-ocid={`wins.item.${i + 1}`}
                  className="flex items-center gap-3"
                >
                  <Checkbox
                    data-ocid={`wins.checkbox.${i + 1}`}
                    checked={win.done}
                    onCheckedChange={() =>
                      saveWins(
                        wins.map((w, idx) =>
                          idx === i ? { ...w, done: !w.done } : w,
                        ),
                      )
                    }
                    id={`win-${i}`}
                  />
                  {editingWinIdx === i ? (
                    <div className="flex gap-1.5 flex-1">
                      <Input
                        value={editingWinLabel}
                        onChange={(e) => setEditingWinLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveWins(
                              wins.map((w, idx) =>
                                idx === i
                                  ? {
                                      ...w,
                                      label: editingWinLabel.trim() || w.label,
                                    }
                                  : w,
                              ),
                            );
                            setEditingWinIdx(null);
                          }
                          if (e.key === "Escape") setEditingWinIdx(null);
                        }}
                        autoFocus
                        className="flex-1 rounded-lg border-0 h-7 text-sm"
                        style={{
                          background: "oklch(0.9 0.03 55 / 0.5)",
                          color: "oklch(0.3 0.1 55)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          saveWins(
                            wins.map((w, idx) =>
                              idx === i
                                ? {
                                    ...w,
                                    label: editingWinLabel.trim() || w.label,
                                  }
                                : w,
                            ),
                          );
                          setEditingWinIdx(null);
                        }}
                        className="px-2 rounded-lg text-xs"
                        style={{
                          background: "oklch(0.5 0.16 150)",
                          color: "white",
                        }}
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`win-${i}`}
                      className="flex-1 text-sm cursor-pointer"
                      style={{
                        color: win.done
                          ? "oklch(0.62 0.1 55)"
                          : "oklch(0.35 0.1 55)",
                        textDecoration: win.done ? "line-through" : "none",
                      }}
                    >
                      {win.label}
                    </label>
                  )}
                  <button
                    type="button"
                    data-ocid={`wins.edit_button.${i + 1}`}
                    onClick={() => {
                      setEditingWinIdx(i);
                      setEditingWinLabel(win.label);
                    }}
                    className="p-1 rounded opacity-60 hover:opacity-100"
                    style={{ color: "oklch(0.55 0.12 55)" }}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ──────────────── RIYALAH STREAK CARD ──────────────── */}
        <div
          data-ocid="riyalah_streak.card"
          className="rounded-2xl p-5 mb-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.1 285 / 0.95), oklch(0.18 0.08 295 / 0.95))",
            border: "1px solid oklch(0.4 0.1 285 / 0.3)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div
                className="font-display text-lg font-bold mb-1"
                style={{ color: "oklch(0.88 0.1 80)" }}
              >
                🔥 Riyalah Streak
              </div>
              <div className="flex gap-6">
                <div>
                  <div
                    className="font-display text-3xl font-bold"
                    style={{ color: "oklch(0.88 0.18 70)" }}
                  >
                    {riyalahStreak}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.6 0.08 285)" }}
                  >
                    Current streak
                  </div>
                </div>
                <div>
                  <div
                    className="font-display text-3xl font-bold"
                    style={{ color: "oklch(0.78 0.14 80)" }}
                  >
                    {riyalahLongest}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.6 0.08 285)" }}
                  >
                    Longest streak
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                data-ocid="riyalah_streak.increment_button"
                onClick={handleMarkStreakToday}
                className="rounded-xl text-sm"
                style={{
                  background: "oklch(0.55 0.22 55 / 0.3)",
                  color: "oklch(0.88 0.18 70)",
                  border: "1px solid oklch(0.65 0.2 60 / 0.4)",
                }}
              >
                🔥 Mark Today
              </Button>
              <Button
                data-ocid="riyalah_streak.reset_button"
                onClick={() => {
                  setRiyalahStreak(0);
                  localStorage.setItem("riyalah_streak", "0");
                  toast.info("Streak reset.");
                }}
                variant="outline"
                className="rounded-xl text-sm"
                style={{
                  border: "1px solid oklch(0.4 0.1 285 / 0.4)",
                  color: "oklch(0.6 0.1 285)",
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

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
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className="text-sm px-3 py-1.5 rounded-full font-bold"
                      style={{
                        background:
                          riyalahStreak > 0
                            ? "oklch(0.55 0.22 55 / 0.3)"
                            : "oklch(0.42 0.22 285 / 0.3)",
                        color:
                          riyalahStreak > 0
                            ? "oklch(0.88 0.18 70)"
                            : "oklch(0.75 0.12 285)",
                        border: `1px solid ${riyalahStreak > 0 ? "oklch(0.65 0.2 60 / 0.4)" : "oklch(0.5 0.15 80 / 0.3)"}`,
                      }}
                    >
                      {riyalahStreak > 0
                        ? `🔥 ${riyalahStreak} day streak`
                        : "✨ Start your streak!"}
                    </Badge>
                    <Badge
                      className="text-sm px-3 py-1 rounded-full font-semibold"
                      style={{
                        background: "oklch(0.42 0.22 285 / 0.3)",
                        color: "oklch(0.85 0.14 80)",
                        border: "1px solid oklch(0.5 0.15 80 / 0.3)",
                      }}
                    >
                      {checkedItems.riyalah.length} / {riyalah.length}
                    </Badge>
                  </div>
                </div>
                <Button
                  data-ocid="riyalah.streak_button"
                  onClick={handleMarkStreakToday}
                  className="w-full rounded-xl font-semibold text-sm"
                  style={{
                    background: "oklch(0.42 0.22 285 / 0.4)",
                    color: "oklch(0.9 0.12 80)",
                    border: "1px solid oklch(0.55 0.15 80 / 0.35)",
                  }}
                >
                  🔥 Mark Today Complete
                </Button>

                <div className="space-y-2.5">
                  {spiritualChecklistItems.map(({ label, emoji }, i) => {
                    const checked = checkedItems.riyalah.includes(label);
                    const isEditing =
                      editingItem?.section === "riyalah" &&
                      editingItem.index === i;
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
                        className="group"
                      >
                        <label
                          htmlFor={isEditing ? undefined : `riyalah-${i}`}
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
                          {isEditing ? (
                            <Input
                              data-ocid={`spiritual.item.input.${i + 1}`}
                              autoFocus
                              value={editingItem.value}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  value: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  renameItem(
                                    "riyalah",
                                    i,
                                    editingItem.value,
                                    setRiyalah,
                                    "riyalah",
                                    label,
                                  );
                                if (e.key === "Escape") setEditingItem(null);
                              }}
                              onBlur={() =>
                                renameItem(
                                  "riyalah",
                                  i,
                                  editingItem.value,
                                  setRiyalah,
                                  "riyalah",
                                  label,
                                )
                              }
                              className="h-7 text-sm flex-1 bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-1"
                              style={{ color: "oklch(0.85 0.14 80)" }}
                              onClick={(e) => e.preventDefault()}
                            />
                          ) : (
                            <span
                              className="font-medium flex-1"
                              style={{
                                color: checked
                                  ? "oklch(0.85 0.14 80)"
                                  : "oklch(0.78 0.06 285)",
                                textDecoration: checked
                                  ? "line-through"
                                  : "none",
                                opacity: checked ? 0.75 : 1,
                              }}
                            >
                              {label}
                            </span>
                          )}
                          {!isEditing && (
                            <button
                              type="button"
                              data-ocid={`spiritual.item.edit_button.${i + 1}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setEditingItem({
                                  section: "riyalah",
                                  index: i,
                                  value: label,
                                });
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 rounded"
                              style={{ color: "oklch(0.58 0.08 285)" }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {!isEditing && checked && (
                            <span
                              className="text-sm"
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
                  sublabel={`${checkedItems.riyalah.length} of ${riyalah.length} done`}
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
                      {checkedItems.mABooks.length}/{maBooks.length}
                    </Badge>
                  </div>
                  <div className="mt-3 academics-progress space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.52 0.1 155)" }}
                      >
                        {checkedItems.mABooks.length} of {maBooks.length} books
                        read
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.38 0.14 155)" }}
                      >
                        {pct(checkedItems.mABooks.length, maBooks.length)}%
                      </span>
                    </div>
                    <Progress
                      value={pct(checkedItems.mABooks.length, maBooks.length)}
                      className="h-3 rounded-full"
                      style={{ background: "oklch(0.88 0.025 155 / 0.4)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.08 155)" }}
                    >
                      {pct(checkedItems.mABooks.length, maBooks.length) === 100
                        ? "🎉 All books complete!"
                        : pct(checkedItems.mABooks.length, maBooks.length) >= 50
                          ? "📖 Over halfway there!"
                          : "📚 Keep reading!"}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {maBooks.map((book, i) => {
                    const checked = checkedItems.mABooks.includes(book);
                    const isEditing =
                      editingItem?.section === "maBooks" &&
                      editingItem.index === i;
                    return (
                      <motion.div
                        key={`mabook-${book}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.07,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        className="group flex items-start gap-3 p-2.5 rounded-lg transition-colors"
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
                        {isEditing ? (
                          <Input
                            data-ocid={`mabooks.item.input.${i + 1}`}
                            autoFocus
                            value={editingItem.value}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                value: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                renameItem(
                                  "maBooks",
                                  i,
                                  editingItem.value,
                                  setMaBooks,
                                  "mABooks",
                                  book,
                                );
                              if (e.key === "Escape") setEditingItem(null);
                            }}
                            onBlur={() =>
                              renameItem(
                                "maBooks",
                                i,
                                editingItem.value,
                                setMaBooks,
                                "mABooks",
                                book,
                              )
                            }
                            className="h-7 text-sm flex-1 bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-1"
                            style={{ color: "oklch(0.28 0.02 75)" }}
                          />
                        ) : (
                          <label
                            htmlFor={`mabook-${i}`}
                            className="text-sm leading-snug flex-1 cursor-pointer"
                            style={{
                              color: checked
                                ? "oklch(0.52 0.1 155)"
                                : "oklch(0.28 0.02 75)",
                              textDecoration: checked ? "line-through" : "none",
                              opacity: checked ? 0.65 : 1,
                            }}
                          >
                            {book}
                          </label>
                        )}
                        {!isEditing && (
                          <button
                            type="button"
                            data-ocid={`mabooks.item.edit_button.${i + 1}`}
                            onClick={() =>
                              setEditingItem({
                                section: "maBooks",
                                index: i,
                                value: book,
                              })
                            }
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded flex-shrink-0"
                            style={{ color: "oklch(0.55 0.08 155)" }}
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                      </motion.div>
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
                        {checkedItems.certificates.length}/{certificates.length}
                      </Badge>
                    </div>
                    <div className="mt-2 academics-progress">
                      <Progress
                        value={pct(
                          checkedItems.certificates.length,
                          certificates.length,
                        )}
                        className="h-2.5 rounded-full"
                        style={{ background: "oklch(0.88 0.025 155 / 0.4)" }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {certificates.map((cert, i) => {
                      const checked = checkedItems.certificates.includes(cert);
                      const isEditing =
                        editingItem?.section === "certificates" &&
                        editingItem.index === i;
                      return (
                        <div
                          key={`cert-${cert}`}
                          className="group flex items-center gap-3 p-2.5 rounded-lg transition-colors"
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
                          {isEditing ? (
                            <Input
                              data-ocid={`certificates.item.input.${i + 1}`}
                              autoFocus
                              value={editingItem.value}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  value: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  renameItem(
                                    "certificates",
                                    i,
                                    editingItem.value,
                                    setCertificates,
                                    "certificates",
                                    cert,
                                  );
                                if (e.key === "Escape") setEditingItem(null);
                              }}
                              onBlur={() =>
                                renameItem(
                                  "certificates",
                                  i,
                                  editingItem.value,
                                  setCertificates,
                                  "certificates",
                                  cert,
                                )
                              }
                              className="h-7 text-sm flex-1 bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-1"
                              style={{ color: "oklch(0.28 0.02 75)" }}
                            />
                          ) : (
                            <label
                              htmlFor={`cert-${i}`}
                              className="text-sm font-medium flex-1 cursor-pointer"
                              style={{
                                color: checked
                                  ? "oklch(0.52 0.1 155)"
                                  : "oklch(0.28 0.02 75)",
                                textDecoration: checked
                                  ? "line-through"
                                  : "none",
                                opacity: checked ? 0.65 : 1,
                              }}
                            >
                              {cert}
                            </label>
                          )}
                          {!isEditing && (
                            <button
                              type="button"
                              data-ocid={`certificates.item.edit_button.${i + 1}`}
                              onClick={() =>
                                setEditingItem({
                                  section: "certificates",
                                  index: i,
                                  value: cert,
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded flex-shrink-0"
                              style={{ color: "oklch(0.55 0.08 155)" }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                        </div>
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
                        {checkedItems.nETPrep.length}/{netPrep.length}
                      </Badge>
                    </div>
                    <div className="mt-2 academics-progress">
                      <Progress
                        value={pct(checkedItems.nETPrep.length, netPrep.length)}
                        className="h-2.5 rounded-full"
                        style={{ background: "oklch(0.88 0.025 155 / 0.4)" }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {netPrep.map((item, i) => {
                      const checked = checkedItems.nETPrep.includes(item);
                      const isEditing =
                        editingItem?.section === "netPrep" &&
                        editingItem.index === i;
                      return (
                        <div
                          key={`net-${item}`}
                          className="group flex items-center gap-3 p-2.5 rounded-lg transition-colors"
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
                          {isEditing ? (
                            <Input
                              data-ocid={`netprep.item.input.${i + 1}`}
                              autoFocus
                              value={editingItem.value}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  value: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  renameItem(
                                    "netPrep",
                                    i,
                                    editingItem.value,
                                    setNetPrep,
                                    "nETPrep",
                                    item,
                                  );
                                if (e.key === "Escape") setEditingItem(null);
                              }}
                              onBlur={() =>
                                renameItem(
                                  "netPrep",
                                  i,
                                  editingItem.value,
                                  setNetPrep,
                                  "nETPrep",
                                  item,
                                )
                              }
                              className="h-7 text-sm flex-1 bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-1"
                              style={{ color: "oklch(0.28 0.02 75)" }}
                            />
                          ) : (
                            <label
                              htmlFor={`net-${i}`}
                              className="text-sm font-medium flex-1 cursor-pointer"
                              style={{
                                color: checked
                                  ? "oklch(0.52 0.1 155)"
                                  : "oklch(0.28 0.02 75)",
                                textDecoration: checked
                                  ? "line-through"
                                  : "none",
                                opacity: checked ? 0.65 : 1,
                              }}
                            >
                              {item}
                            </label>
                          )}
                          {!isEditing && (
                            <button
                              type="button"
                              data-ocid={`netprep.item.edit_button.${i + 1}`}
                              onClick={() =>
                                setEditingItem({
                                  section: "netPrep",
                                  index: i,
                                  value: item,
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded flex-shrink-0"
                              style={{ color: "oklch(0.55 0.08 155)" }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                        </div>
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
                      {checkedItems.students.length}/{students.length}
                    </Badge>
                  </div>
                  <div className="mt-2 career-progress">
                    <Progress
                      value={pct(checkedItems.students.length, students.length)}
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
                  {students.map((student, i) => {
                    const checked = checkedItems.students.includes(student);
                    const isEditing =
                      editingItem?.section === "students" &&
                      editingItem.index === i;
                    const initials = student
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <motion.div
                        key={`student-${student}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.07,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        className="group p-3 rounded-xl transition-all space-y-2"
                        style={{
                          background: checked
                            ? "oklch(0.55 0.18 50 / 0.1)"
                            : "oklch(0.96 0.02 60)",
                          border: `1px solid ${checked ? "oklch(0.65 0.15 55 / 0.35)" : "oklch(0.88 0.025 60 / 0.6)"}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
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
                          {isEditing ? (
                            <Input
                              data-ocid={`students.item.input.${i + 1}`}
                              autoFocus
                              value={editingItem.value}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  value: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  renameItem(
                                    "students",
                                    i,
                                    editingItem.value,
                                    setStudents,
                                    "students",
                                    student,
                                  );
                                if (e.key === "Escape") setEditingItem(null);
                              }}
                              onBlur={() =>
                                renameItem(
                                  "students",
                                  i,
                                  editingItem.value,
                                  setStudents,
                                  "students",
                                  student,
                                )
                              }
                              className="h-7 text-sm flex-1 bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-1"
                              style={{ color: "oklch(0.28 0.02 75)" }}
                            />
                          ) : (
                            <label
                              htmlFor={`student-${i}`}
                              className="font-medium text-sm flex-1 cursor-pointer"
                              style={{
                                color: checked
                                  ? "oklch(0.55 0.14 50)"
                                  : "oklch(0.28 0.02 75)",
                                textDecoration: checked
                                  ? "line-through"
                                  : "none",
                                opacity: checked ? 0.7 : 1,
                              }}
                            >
                              {student}
                            </label>
                          )}
                          {!isEditing && checked && (
                            <span
                              className="text-xs font-medium"
                              style={{ color: "oklch(0.62 0.16 50)" }}
                            >
                              Active ✓
                            </span>
                          )}
                          {!isEditing && (
                            <button
                              type="button"
                              data-ocid={`students.item.edit_button.${i + 1}`}
                              onClick={() =>
                                setEditingItem({
                                  section: "students",
                                  index: i,
                                  value: student,
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 rounded flex-shrink-0"
                              style={{ color: "oklch(0.55 0.1 50)" }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                        </div>
                        {/* Session counter and notes */}
                        <div className="flex items-center gap-2 pl-11">
                          <div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                            style={{ background: "oklch(0.88 0.04 55 / 0.5)" }}
                          >
                            <span
                              className="text-xs font-medium"
                              style={{ color: "oklch(0.45 0.14 55)" }}
                            >
                              Sessions: {studentSessions[student] ?? 0}
                            </span>
                            <button
                              type="button"
                              data-ocid={`students.session_button.${i + 1}`}
                              onClick={() =>
                                setStudentSessions((prev) => ({
                                  ...prev,
                                  [student]: (prev[student] ?? 0) + 1,
                                }))
                              }
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                              style={{
                                background: "oklch(0.62 0.16 50)",
                                color: "white",
                              }}
                            >
                              +
                            </button>
                          </div>
                          <Input
                            data-ocid={`students.notes.input.${i + 1}`}
                            placeholder="Subject or notes..."
                            value={studentNotes[student] ?? ""}
                            onChange={(e) =>
                              setStudentNotes((prev) => ({
                                ...prev,
                                [student]: e.target.value,
                              }))
                            }
                            className="h-7 text-xs flex-1 rounded-lg border-0"
                            style={{
                              background: "oklch(0.92 0.02 60 / 0.8)",
                              color: "oklch(0.32 0.08 55)",
                            }}
                          />
                        </div>
                      </motion.div>
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

              {/* Daily Goals */}
              <Card className="card-journal rounded-2xl border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="font-display text-xl"
                      style={{ color: "oklch(0.32 0.15 225)" }}
                    >
                      🎯 Daily Goals
                    </CardTitle>
                    <Badge
                      className="rounded-full text-xs px-2.5"
                      style={{
                        background: "oklch(0.5 0.18 225 / 0.1)",
                        color: "oklch(0.42 0.15 225)",
                        border: "1px solid oklch(0.6 0.15 225 / 0.3)",
                      }}
                    >
                      {dailyGoals.filter((g) => g.done).length}/
                      {dailyGoals.length} done
                    </Badge>
                  </div>
                  {dailyGoals.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <Progress
                        value={pct(
                          dailyGoals.filter((g) => g.done).length,
                          dailyGoals.length,
                        )}
                        className="h-2 rounded-full"
                        style={{ background: "oklch(0.88 0.025 225 / 0.4)" }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.52 0.1 225)" }}
                      >
                        {dailyGoals.filter((g) => g.done).length} of{" "}
                        {dailyGoals.length} goals completed
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      data-ocid="daily_goals.input"
                      placeholder="Add a goal for today..."
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addDailyGoal()}
                      className="flex-1 rounded-xl border-0"
                      style={{
                        background: "oklch(0.94 0.022 225 / 0.5)",
                        color: "oklch(0.25 0.05 225)",
                      }}
                    />
                    <Button
                      data-ocid="daily_goals.add_button"
                      onClick={addDailyGoal}
                      className="rounded-xl px-4 shrink-0"
                      style={{
                        background: "oklch(0.5 0.18 225)",
                        color: "white",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {dailyGoals.length === 0 ? (
                    <div
                      data-ocid="daily_goals.empty_state"
                      className="text-center py-8 rounded-xl"
                      style={{ background: "oklch(0.96 0.018 225 / 0.5)" }}
                    >
                      <p className="text-2xl mb-2">🎯</p>
                      <p
                        className="font-medium"
                        style={{ color: "oklch(0.5 0.1 225)" }}
                      >
                        No goals yet — add one above!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {dailyGoals.map((goal, i) => (
                          <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16, height: 0 }}
                            transition={{ duration: 0.25 }}
                            data-ocid={`daily_goals.item.${i + 1}`}
                            className="flex items-center gap-3 p-3 rounded-xl group transition-all"
                            style={{
                              background: goal.done
                                ? "oklch(0.5 0.18 225 / 0.08)"
                                : "oklch(0.96 0.018 225 / 0.5)",
                              border: `1px solid ${goal.done ? "oklch(0.6 0.15 225 / 0.25)" : "oklch(0.88 0.022 225 / 0.5)"}`,
                            }}
                          >
                            <Checkbox
                              data-ocid={`daily_goals.checkbox.${i + 1}`}
                              checked={goal.done}
                              onCheckedChange={() => toggleDailyGoal(goal.id)}
                              id={`goal-${goal.id}`}
                            />
                            <label
                              htmlFor={`goal-${goal.id}`}
                              className="flex-1 text-sm cursor-pointer leading-snug"
                              style={{
                                color: goal.done
                                  ? "oklch(0.6 0.1 225)"
                                  : "oklch(0.28 0.04 75)",
                                textDecoration: goal.done
                                  ? "line-through"
                                  : "none",
                                opacity: goal.done ? 0.7 : 1,
                              }}
                            >
                              {goal.text}
                            </label>
                            <button
                              type="button"
                              data-ocid={`daily_goals.delete_button.${i + 1}`}
                              onClick={() => deleteDailyGoal(goal.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity"
                              style={{ color: "oklch(0.58 0.2 25)" }}
                              aria-label="Delete goal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Daily Goals */}
              <Card className="card-journal rounded-2xl border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="font-display text-xl"
                      style={{ color: "oklch(0.32 0.15 225)" }}
                    >
                      🎯 Daily Goals
                    </CardTitle>
                    <Badge
                      className="rounded-full text-xs px-2.5"
                      style={{
                        background: "oklch(0.5 0.18 225 / 0.1)",
                        color: "oklch(0.42 0.15 225)",
                        border: "1px solid oklch(0.6 0.15 225 / 0.3)",
                      }}
                    >
                      {dailyGoals.filter((g) => g.done).length}/
                      {dailyGoals.length} done
                    </Badge>
                  </div>
                  {dailyGoals.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <Progress
                        value={pct(
                          dailyGoals.filter((g) => g.done).length,
                          dailyGoals.length,
                        )}
                        className="h-2 rounded-full"
                        style={{ background: "oklch(0.88 0.025 225 / 0.4)" }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.52 0.1 225)" }}
                      >
                        {dailyGoals.filter((g) => g.done).length} of{" "}
                        {dailyGoals.length} goals completed
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      data-ocid="daily_goals.input"
                      placeholder="Add a goal for today..."
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addDailyGoal()}
                      className="flex-1 rounded-xl border-0"
                      style={{
                        background: "oklch(0.94 0.022 225 / 0.5)",
                        color: "oklch(0.25 0.05 225)",
                      }}
                    />
                    <Button
                      data-ocid="daily_goals.add_button"
                      onClick={addDailyGoal}
                      className="rounded-xl px-4 shrink-0"
                      style={{
                        background: "oklch(0.5 0.18 225)",
                        color: "white",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {dailyGoals.length === 0 ? (
                    <div
                      data-ocid="daily_goals.empty_state"
                      className="text-center py-8 rounded-xl"
                      style={{ background: "oklch(0.96 0.018 225 / 0.5)" }}
                    >
                      <p className="text-2xl mb-2">🎯</p>
                      <p
                        className="font-medium"
                        style={{ color: "oklch(0.5 0.1 225)" }}
                      >
                        No goals yet — add one above!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {dailyGoals.map((goal, i) => (
                          <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16, height: 0 }}
                            transition={{ duration: 0.25 }}
                            data-ocid={`daily_goals.item.${i + 1}`}
                            className="flex items-center gap-3 p-3 rounded-xl group transition-all"
                            style={{
                              background: goal.done
                                ? "oklch(0.5 0.18 225 / 0.08)"
                                : "oklch(0.96 0.018 225 / 0.5)",
                              border: `1px solid ${goal.done ? "oklch(0.6 0.15 225 / 0.25)" : "oklch(0.88 0.022 225 / 0.5)"}`,
                            }}
                          >
                            <Checkbox
                              data-ocid={`daily_goals.checkbox.${i + 1}`}
                              checked={goal.done}
                              onCheckedChange={() => toggleDailyGoal(goal.id)}
                              id={`goal-${goal.id}`}
                            />
                            <label
                              htmlFor={`goal-${goal.id}`}
                              className="flex-1 text-sm cursor-pointer leading-snug"
                              style={{
                                color: goal.done
                                  ? "oklch(0.6 0.1 225)"
                                  : "oklch(0.28 0.04 75)",
                                textDecoration: goal.done
                                  ? "line-through"
                                  : "none",
                                opacity: goal.done ? 0.7 : 1,
                              }}
                            >
                              {goal.text}
                            </label>
                            <button
                              type="button"
                              data-ocid={`daily_goals.delete_button.${i + 1}`}
                              onClick={() => deleteDailyGoal(goal.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity"
                              style={{ color: "oklch(0.58 0.2 25)" }}
                              aria-label="Delete goal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
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

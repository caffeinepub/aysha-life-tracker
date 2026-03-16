import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// ─── QUOTE OF THE DAY ──────────────────────────────────────────────────────────
const DAILY_QUOTES = [
  "Small disciplines repeated daily lead to great achievements.",
  "The secret of getting ahead is getting started.",
  "Discipline is the bridge between goals and accomplishment.",
  "Knowledge is the light of the mind.",
  "Every expert was once a beginner.",
  "Your future is created by what you do today, not tomorrow.",
  "The more you read, the more you know.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Seek knowledge from the cradle to the grave.",
  "Hard work beats talent when talent doesn't work hard.",
  "A goal without a plan is just a wish.",
  "The journey of a thousand miles begins with a single step.",
];

export function QuoteOfDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const quote = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">✨</span>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "oklch(0.52 0.14 285)" }}
            >
              Quote of the Day
            </p>
            <p
              className="font-display text-base font-medium leading-relaxed italic"
              style={{ color: "oklch(0.28 0.06 285)" }}
            >
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── LIFE PROGRESS BAR ─────────────────────────────────────────────────────────
export function LifeProgressBar({
  salahCount,
  studyHoursToday,
  focusDone,
  focusTotal,
}: {
  salahCount: number;
  studyHoursToday: number;
  focusDone: number;
  focusTotal: number;
}) {
  const spiritualScore = Math.round((salahCount / 5) * 100);
  const studyScore = studyHoursToday > 0 ? 100 : 0;
  const careerScore =
    focusTotal > 0 ? Math.round((focusDone / focusTotal) * 100) : 0;
  const teachingScore = focusDone > 0 ? 100 : 0;
  const overall = Math.round(
    (spiritualScore + studyScore + careerScore + teachingScore) / 4,
  );
  const filledBlocks = Math.round(overall / 10);
  const bar = "█".repeat(filledBlocks) + "░".repeat(10 - filledBlocks);
  const subScores = [
    {
      label: "Spiritual",
      value: spiritualScore,
      color: "oklch(0.42 0.22 285)",
    },
    { label: "Study", value: studyScore, color: "oklch(0.42 0.14 155)" },
    { label: "Career", value: careerScore, color: "oklch(0.55 0.18 50)" },
    { label: "Teaching", value: teachingScore, color: "oklch(0.5 0.18 225)" },
  ];
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📊</span>
          <h3
            className="font-display text-base font-bold"
            style={{ color: "oklch(0.28 0.06 75)" }}
          >
            Today&apos;s Life Progress
          </h3>
          <span
            className="ml-auto font-display text-2xl font-bold"
            style={{ color: "oklch(0.42 0.18 285)" }}
          >
            {overall}%
          </span>
        </div>
        <div
          className="font-mono text-base tracking-tight mb-4 p-3 rounded-xl"
          style={{
            background: "oklch(0.95 0.02 285 / 0.4)",
            color: "oklch(0.38 0.18 285)",
          }}
        >
          {bar} {overall}%
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {subScores.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-2.5 text-center"
              style={{
                background: "oklch(0.96 0.015 75 / 0.5)",
                border: "1px solid oklch(0.88 0.02 75 / 0.5)",
              }}
            >
              <div
                className="text-lg font-bold font-display"
                style={{ color: s.color }}
              >
                {s.value}%
              </div>
              <div className="text-xs" style={{ color: "oklch(0.55 0.05 75)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── PRAYER TIME REMINDER ──────────────────────────────────────────────────────
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export function PrayerTimeReminder({
  onSalahCountChange,
}: {
  onSalahCountChange: (count: number) => void;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("salah_checked");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const toggle = (prayer: string) => {
    setChecked((prev) => {
      const next = { ...prev, [prayer]: !prev[prayer] };
      localStorage.setItem("salah_checked", JSON.stringify(next));
      const count = Object.values(next).filter(Boolean).length;
      onSalahCountChange(count);
      return next;
    });
  };
  const count = Object.values(checked).filter(Boolean).length;
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.32 0.14 285)" }}
        >
          🕌 Today&apos;s Salah
        </CardTitle>
        <p className="text-sm" style={{ color: "oklch(0.52 0.1 285)" }}>
          {count} / 5 prayers completed
        </p>
        <div className="mt-1 spiritual-progress">
          <Progress value={(count / 5) * 100} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {PRAYERS.map((prayer, i) => (
            <button
              key={prayer}
              type="button"
              data-ocid={`salah.checkbox.${i + 1}`}
              onClick={() => toggle(prayer)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium"
              style={{
                background: checked[prayer]
                  ? "oklch(0.42 0.22 285 / 0.12)"
                  : "oklch(0.95 0.015 285 / 0.5)",
                border: `1px solid ${
                  checked[prayer]
                    ? "oklch(0.55 0.2 285 / 0.4)"
                    : "oklch(0.85 0.02 285 / 0.5)"
                }`,
                color: checked[prayer]
                  ? "oklch(0.32 0.18 285)"
                  : "oklch(0.48 0.1 285)",
              }}
            >
              {checked[prayer] ? "✅" : "☐"} {prayer}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── LIFE BALANCE WHEEL ────────────────────────────────────────────────────────
const WHEEL_AREAS = ["Spiritual", "Study", "Career", "Health", "Teaching"];
const WHEEL_COLORS = [
  "oklch(0.42 0.22 285)",
  "oklch(0.42 0.14 155)",
  "oklch(0.55 0.18 50)",
  "oklch(0.55 0.18 25)",
  "oklch(0.5 0.18 225)",
];

export function LifeBalanceWheel() {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("life_wheel_scores");
      return saved
        ? JSON.parse(saved)
        : { Spiritual: 7, Study: 6, Career: 5, Health: 6, Teaching: 7 };
    } catch {
      return { Spiritual: 5, Study: 5, Career: 5, Health: 5, Teaching: 5 };
    }
  });
  const updateScore = (area: string, value: number) => {
    setScores((prev) => {
      const next = { ...prev, [area]: value };
      localStorage.setItem("life_wheel_scores", JSON.stringify(next));
      return next;
    });
  };
  const cx = 110;
  const cy = 110;
  const maxR = 85;
  const points = WHEEL_AREAS.map((area, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const r = (scores[area] / 10) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      lx: cx + (maxR + 20) * Math.cos(angle),
      ly: cy + (maxR + 20) * Math.sin(angle),
    };
  });
  const polygonPts = points.map((p) => `${p.x},${p.y}`).join(" ");
  const bgPts = WHEEL_AREAS.map((_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return `${cx + maxR * Math.cos(angle)},${cy + maxR * Math.sin(angle)}`;
  }).join(" ");
  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-2">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          ⚖️ Life Balance Wheel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-center">
          <svg width={220} height={220} viewBox="0 0 220 220">
            <title>Life Balance Wheel</title>
            <polygon
              points={bgPts}
              fill="oklch(0.92 0.015 75 / 0.5)"
              stroke="oklch(0.8 0.025 75)"
              strokeWidth="1"
            />
            {[0.25, 0.5, 0.75].map((f) => {
              const pts = WHEEL_AREAS.map((_, i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                return `${cx + f * maxR * Math.cos(angle)},${cy + f * maxR * Math.sin(angle)}`;
              }).join(" ");
              return (
                <polygon
                  key={f}
                  points={pts}
                  fill="none"
                  stroke="oklch(0.8 0.015 75)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              );
            })}
            {WHEEL_AREAS.map((area, i) => {
              const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
              return (
                <line
                  key={area}
                  x1={cx}
                  y1={cy}
                  x2={cx + maxR * Math.cos(angle)}
                  y2={cy + maxR * Math.sin(angle)}
                  stroke="oklch(0.8 0.015 75)"
                  strokeWidth="0.5"
                />
              );
            })}
            <polygon
              points={polygonPts}
              fill="oklch(0.42 0.22 285 / 0.15)"
              stroke="oklch(0.42 0.22 285)"
              strokeWidth="2"
            />
            {points.map((p, i) => (
              <circle
                key={WHEEL_AREAS[i]}
                cx={p.x}
                cy={p.y}
                r={4}
                fill={WHEEL_COLORS[i]}
              />
            ))}
            {points.map((p, i) => (
              <text
                key={`label-${WHEEL_AREAS[i]}`}
                x={p.lx}
                y={p.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="oklch(0.38 0.08 75)"
                fontWeight="600"
              >
                {WHEEL_AREAS[i]}
              </text>
            ))}
          </svg>
        </div>
        <div className="space-y-2">
          {WHEEL_AREAS.map((area, i) => (
            <div key={area} className="flex items-center gap-3">
              <span
                className="text-xs font-semibold w-16"
                style={{ color: WHEEL_COLORS[i] }}
              >
                {area}
              </span>
              <input
                type="range"
                data-ocid={`wheel.${area.toLowerCase()}.input`}
                min={1}
                max={10}
                value={scores[area]}
                onChange={(e) => updateScore(area, Number(e.target.value))}
                className="flex-1 h-2"
                style={{ accentColor: WHEEL_COLORS[i] }}
              />
              <span
                className="text-xs font-bold w-4 text-right"
                style={{ color: WHEEL_COLORS[i] }}
              >
                {scores[area]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── EXAM PREPARATION METER ────────────────────────────────────────────────────
export function ExamPrepMeter() {
  const [books, setBooks] = useState(() =>
    Number(localStorage.getItem("exam_books") ?? 2),
  );
  const [revision, setRevision] = useState(() =>
    Number(localStorage.getItem("exam_revision") ?? 0),
  );
  const [practice, setPractice] = useState(() =>
    Number(localStorage.getItem("exam_practice") ?? 1),
  );
  const update = (
    key: string,
    setter: (v: number) => void,
    value: number,
    max: number,
  ) => {
    const clamped = Math.max(0, Math.min(max, value));
    setter(clamped);
    localStorage.setItem(`exam_${key}`, String(clamped));
  };
  const readiness = Math.round(
    ((books / 10 + revision / 3 + practice / 10) / 3) * 100,
  );
  const rows = [
    {
      label: "Books Completed",
      value: books,
      max: 10,
      setter: (v: number) => update("books", setBooks, v, 10),
    },
    {
      label: "Revision",
      value: revision,
      max: 3,
      setter: (v: number) => update("revision", setRevision, v, 3),
    },
    {
      label: "Practice Answers",
      value: practice,
      max: 10,
      setter: (v: number) => update("practice", setPractice, v, 10),
    },
  ];
  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          📝 MA Exam Readiness
        </CardTitle>
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1">
            <span
              className="text-sm font-medium"
              style={{ color: "oklch(0.45 0.14 155)" }}
            >
              Overall Readiness
            </span>
            <span
              className="font-display text-xl font-bold"
              style={{ color: "oklch(0.42 0.14 155)" }}
            >
              {readiness}%
            </span>
          </div>
          <div className="academics-progress">
            <Progress value={readiness} className="h-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "oklch(0.96 0.018 155 / 0.5)" }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: "oklch(0.38 0.1 155)" }}
            >
              {row.label}: {row.value} / {row.max}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                data-ocid={`exam_prep.row.${i + 1}.secondary_button`}
                onClick={() => row.setter(row.value - 1)}
                className="w-7 h-7 rounded-lg font-bold text-sm flex items-center justify-center transition-colors"
                style={{
                  background: "oklch(0.88 0.025 155 / 0.8)",
                  color: "oklch(0.42 0.14 155)",
                }}
              >
                −
              </button>
              <button
                type="button"
                data-ocid={`exam_prep.row.${i + 1}.primary_button`}
                onClick={() => row.setter(row.value + 1)}
                className="w-7 h-7 rounded-lg font-bold text-sm flex items-center justify-center transition-colors"
                style={{ background: "oklch(0.42 0.14 155)", color: "white" }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── HABIT HEATMAP ─────────────────────────────────────────────────────────────
export function HabitHeatmap() {
  const [heatmap, setHeatmap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("habit_heatmap");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const toggle = (dateStr: string) => {
    setHeatmap((prev) => {
      const next = { ...prev, [dateStr]: !prev[dateStr] };
      localStorage.setItem("habit_heatmap", JSON.stringify(next));
      return next;
    });
  };
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d.toISOString().slice(0, 10);
  });
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = monthNames[new Date().getMonth()];
  const todayStr = new Date().toISOString().slice(0, 10);
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          📅 Habit Heatmap — {currentMonth}
        </CardTitle>
        <p className="text-xs" style={{ color: "oklch(0.55 0.05 75)" }}>
          Click a day to mark it as productive 🟩
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              className="w-8 h-5 flex items-center justify-center text-xs"
              style={{ color: "oklch(0.6 0.04 75)" }}
            >
              {d.charAt(0)}
            </div>
          ))}
        </div>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(7, 2rem)" }}
        >
          {days.map((date, i) => {
            const isToday = date === todayStr;
            const productive = heatmap[date];
            return (
              <button
                key={date}
                type="button"
                data-ocid={`heatmap.item.${i + 1}`}
                onClick={() => toggle(date)}
                title={date}
                className="w-8 h-8 rounded-md transition-all"
                style={{
                  background: productive
                    ? "oklch(0.52 0.18 145)"
                    : "oklch(0.9 0.015 75 / 0.7)",
                  border: isToday
                    ? "2px solid oklch(0.55 0.18 285)"
                    : "1px solid oklch(0.85 0.02 75 / 0.5)",
                  transform: productive ? "scale(1.05)" : "scale(1)",
                }}
              />
            );
          })}
        </div>
        <div
          className="flex items-center gap-4 mt-3 text-xs"
          style={{ color: "oklch(0.55 0.05 75)" }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded"
              style={{ background: "oklch(0.52 0.18 145)" }}
            />
            <span>Productive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded"
              style={{
                background: "oklch(0.9 0.015 75 / 0.7)",
                border: "1px solid oklch(0.85 0.02 75 / 0.5)",
              }}
            />
            <span>Empty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded"
              style={{
                background: "oklch(0.9 0.015 75 / 0.7)",
                border: "2px solid oklch(0.55 0.18 285)",
              }}
            />
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── SMART WEEKLY REVIEW ───────────────────────────────────────────────────────
export function SmartWeeklyReview({
  weeklyHoursTotal,
  riyalahPct,
  certsCompleted,
  incomeTotal,
}: {
  weeklyHoursTotal: number;
  riyalahPct: number;
  certsCompleted: number;
  incomeTotal: number;
}) {
  const monthName = new Date().toLocaleString("default", { month: "long" });
  const items = [
    {
      icon: "📚",
      label: "Study Hours",
      value: `${weeklyHoursTotal.toFixed(1)}h`,
      color: "oklch(0.42 0.14 155)",
    },
    {
      icon: "🕌",
      label: "Riyalah",
      value: `${riyalahPct}%`,
      color: "oklch(0.42 0.22 285)",
    },
    {
      icon: "🎓",
      label: "Cert Lessons",
      value: `${certsCompleted} done`,
      color: "oklch(0.55 0.18 50)",
    },
    {
      icon: "💰",
      label: "Income",
      value: `₹${incomeTotal.toLocaleString("en-IN")}`,
      color: "oklch(0.5 0.18 225)",
    },
  ];
  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          📊 Week Summary — {monthName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "oklch(0.96 0.015 75 / 0.5)" }}
          >
            <div className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span
                className="text-sm font-medium"
                style={{ color: "oklch(0.38 0.06 75)" }}
              >
                {item.label}
              </span>
            </div>
            <span
              className="font-display font-bold text-sm"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── WEEKLY REFLECTION ─────────────────────────────────────────────────────────
export function WeeklyReflection() {
  const [wentWell, setWentWell] = useState(
    () => localStorage.getItem("reflection_went_well") ?? "",
  );
  const [improve, setImprove] = useState(
    () => localStorage.getItem("reflection_improve") ?? "",
  );
  const [lesson, setLesson] = useState(
    () => localStorage.getItem("reflection_lesson") ?? "",
  );
  const fields = [
    {
      label: "What went well this week?",
      key: "reflection_went_well",
      value: wentWell,
      setter: setWentWell,
    },
    {
      label: "What should improve next week?",
      key: "reflection_improve",
      value: improve,
      setter: setImprove,
    },
    {
      label: "Key lesson learned",
      key: "reflection_lesson",
      value: lesson,
      setter: setLesson,
    },
  ];
  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          📝 Weekly Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, i) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="text-sm font-semibold block mb-1.5"
              style={{ color: "oklch(0.38 0.08 75)" }}
            >
              {field.label}
            </label>
            <Textarea
              id={field.key}
              data-ocid={`weekly_reflection.textarea.${i + 1}`}
              value={field.value}
              onChange={(e) => {
                field.setter(e.target.value);
                localStorage.setItem(field.key, e.target.value);
              }}
              placeholder="Write your reflection here..."
              rows={3}
              className="rounded-xl border-0 resize-none text-sm"
              style={{
                background: "oklch(0.96 0.015 75 / 0.5)",
                color: "oklch(0.28 0.04 75)",
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── ACHIEVEMENT BADGES ────────────────────────────────────────────────────────
export function AchievementBadges({
  riyalahStreak,
  booksCompleted,
  certsCompleted,
  studentsCount,
}: {
  riyalahStreak: number;
  booksCompleted: number;
  certsCompleted: number;
  studentsCount: number;
}) {
  const badges = [
    {
      icon: "🔥",
      name: "7-Day Riyalah Streak",
      unlocked: riyalahStreak >= 7,
      desc: `${riyalahStreak} day streak`,
    },
    {
      icon: "📚",
      name: "First MA Book",
      unlocked: booksCompleted >= 1,
      desc: `${booksCompleted} books done`,
    },
    {
      icon: "🎓",
      name: "First Certificate",
      unlocked: certsCompleted >= 1,
      desc: `${certsCompleted} certs done`,
    },
    {
      icon: "👩‍🏫",
      name: "5 Students Reached",
      unlocked: studentsCount >= 5,
      desc: `${studentsCount} students`,
    },
    {
      icon: "⏰",
      name: "Pomodoro Master",
      unlocked: true,
      desc: "Focus champion!",
    },
  ];
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          🏆 Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {badges.map((badge, i) => (
            <div
              key={badge.name}
              data-ocid={`badges.item.${i + 1}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all"
              style={{
                background: badge.unlocked
                  ? "oklch(0.94 0.025 75)"
                  : "oklch(0.94 0.008 75 / 0.5)",
                border: `1px solid ${
                  badge.unlocked
                    ? "oklch(0.82 0.06 75 / 0.7)"
                    : "oklch(0.88 0.01 75 / 0.4)"
                }`,
                opacity: badge.unlocked ? 1 : 0.4,
                filter: badge.unlocked ? "none" : "grayscale(1)",
              }}
            >
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <p
                  className="text-xs font-semibold leading-tight mb-0.5"
                  style={{
                    color: badge.unlocked
                      ? "oklch(0.32 0.08 75)"
                      : "oklch(0.55 0.03 75)",
                  }}
                >
                  {badge.name}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.58 0.05 75)" }}>
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── ENERGY / MOOD TRACKER ─────────────────────────────────────────────────────
export function EnergyMoodTracker() {
  const [mood, setMood] = useState<string>(
    () => localStorage.getItem("today_mood") ?? "",
  );
  const moods = [
    {
      key: "focused",
      label: "Focused",
      emoji: "🙂",
      color: "oklch(0.42 0.14 155)",
    },
    {
      key: "average",
      label: "Average",
      emoji: "😐",
      color: "oklch(0.55 0.12 75)",
    },
    {
      key: "tired",
      label: "Tired",
      emoji: "😴",
      color: "oklch(0.5 0.1 225)",
    },
  ];
  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          ⚡ Today&apos;s Energy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          {moods.map((m) => (
            <button
              key={m.key}
              type="button"
              data-ocid={`mood.${m.key}.button`}
              onClick={() => {
                setMood(m.key);
                localStorage.setItem("today_mood", m.key);
              }}
              className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
              style={{
                background:
                  mood === m.key
                    ? `color-mix(in oklch, ${m.color} 12%, transparent)`
                    : "oklch(0.96 0.015 75 / 0.5)",
                border: `2px solid ${
                  mood === m.key ? m.color : "oklch(0.88 0.02 75 / 0.5)"
                }`,
              }}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span
                className="text-xs font-semibold"
                style={{
                  color: mood === m.key ? m.color : "oklch(0.48 0.05 75)",
                }}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MONTHLY WINS ──────────────────────────────────────────────────────────────
export function MonthlyWins({
  booksCompleted,
  riyalahStreak,
  incomeTotal,
  certsCompleted,
}: {
  booksCompleted: number;
  riyalahStreak: number;
  incomeTotal: number;
  certsCompleted: number;
}) {
  const [manualWins, setManualWins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("manual_wins");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [winInput, setWinInput] = useState("");
  const addWin = () => {
    if (!winInput.trim()) return;
    const next = [...manualWins, winInput.trim()];
    setManualWins(next);
    localStorage.setItem("manual_wins", JSON.stringify(next));
    setWinInput("");
  };
  const removeWin = (i: number) => {
    const next = manualWins.filter((_, idx) => idx !== i);
    setManualWins(next);
    localStorage.setItem("manual_wins", JSON.stringify(next));
  };
  const monthName = new Date().toLocaleString("default", { month: "long" });
  const autoWins: string[] = [];
  if (booksCompleted >= 1)
    autoWins.push(
      `Completed ${booksCompleted} MA book${booksCompleted > 1 ? "s" : ""}`,
    );
  if (riyalahStreak >= 10) autoWins.push(`${riyalahStreak}-day Riyalah streak`);
  if (certsCompleted >= 1)
    autoWins.push(
      `Earned ${certsCompleted} certificate${certsCompleted > 1 ? "s" : ""}`,
    );
  if (incomeTotal > 0)
    autoWins.push(`Earned ₹${incomeTotal.toLocaleString("en-IN")}`);
  const allWins = [...autoWins, ...manualWins];
  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          🏅 {monthName} Wins
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          {allWins.map((win, i) => (
            <div
              key={`win-${i}-${win.slice(0, 10)}`}
              data-ocid={`monthly_wins.item.${i + 1}`}
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ background: "oklch(0.94 0.025 80 / 0.5)" }}
            >
              <span style={{ color: "oklch(0.42 0.18 145)" }}>✔</span>
              <span
                className="text-sm flex-1"
                style={{ color: "oklch(0.32 0.06 75)" }}
              >
                {win}
              </span>
              {i >= autoWins.length && (
                <button
                  type="button"
                  data-ocid={`monthly_wins.delete_button.${i + 1}`}
                  onClick={() => removeWin(i - autoWins.length)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: "oklch(0.55 0.18 25)" }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {allWins.length === 0 && (
            <p
              className="text-sm text-center py-3"
              style={{ color: "oklch(0.58 0.05 75)" }}
            >
              No wins yet — keep going! 💪
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            data-ocid="monthly_wins.input"
            placeholder="Add a win..."
            value={winInput}
            onChange={(e) => setWinInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWin()}
            className="flex-1 rounded-xl border-0 text-sm"
            style={{
              background: "oklch(0.96 0.015 75 / 0.5)",
              color: "oklch(0.28 0.04 75)",
            }}
          />
          <Button
            data-ocid="monthly_wins.add_button"
            onClick={addWin}
            className="rounded-xl"
            style={{ background: "oklch(0.55 0.18 80)", color: "white" }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MONTHLY REPORT ────────────────────────────────────────────────────────────
export function MonthlyReport({
  weeklyHoursTotal,
  booksCompleted,
  certsCompleted,
  incomeTotal,
  riyalahPct,
}: {
  weeklyHoursTotal: number;
  booksCompleted: number;
  certsCompleted: number;
  incomeTotal: number;
  riyalahPct: number;
}) {
  const monthName = new Date().toLocaleString("default", { month: "long" });
  const rows = [
    {
      label: "Study Hours",
      value: `${weeklyHoursTotal.toFixed(1)}h`,
      color: "oklch(0.42 0.14 155)",
    },
    {
      label: "Books Completed",
      value: String(booksCompleted),
      color: "oklch(0.38 0.14 155)",
    },
    {
      label: "Certificates Earned",
      value: String(certsCompleted),
      color: "oklch(0.55 0.18 50)",
    },
    {
      label: "Income",
      value: `₹${incomeTotal.toLocaleString("en-IN")}`,
      color: "oklch(0.5 0.18 225)",
    },
    {
      label: "Riyalah Completion",
      value: `${riyalahPct}%`,
      color: "oklch(0.42 0.22 285)",
    },
  ];
  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          📋 {monthName} Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
              style={{ borderColor: "oklch(0.9 0.018 75 / 0.5)" }}
            >
              <span
                className="text-sm"
                style={{ color: "oklch(0.42 0.05 75)" }}
              >
                {row.label}
              </span>
              <span
                className="font-display font-bold text-sm"
                style={{ color: row.color }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── PERSONAL READING TRACKER ──────────────────────────────────────────────────
export function PersonalReadingTracker() {
  const [books, setBooks] = useState<
    { id: string; name: string; done: boolean }[]
  >(() => {
    try {
      const saved = localStorage.getItem("personal_reading");
      return saved
        ? JSON.parse(saved)
        : [
            { id: "1", name: "Atomic Habits", done: false },
            { id: "2", name: "Deep Work", done: false },
            { id: "3", name: "Islamic spiritual book", done: false },
          ];
    } catch {
      return [
        { id: "1", name: "Atomic Habits", done: false },
        { id: "2", name: "Deep Work", done: false },
        { id: "3", name: "Islamic spiritual book", done: false },
      ];
    }
  });
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const save = (next: typeof books) => {
    setBooks(next);
    localStorage.setItem("personal_reading", JSON.stringify(next));
  };
  const addBook = () => {
    if (!input.trim()) return;
    save([
      ...books,
      { id: crypto.randomUUID(), name: input.trim(), done: false },
    ]);
    setInput("");
  };
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          📖 Personal Reading
        </CardTitle>
        <p className="text-xs" style={{ color: "oklch(0.55 0.05 75)" }}>
          Leisure &amp; non-fiction books
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          {books.map((book, i) => (
            <div
              key={book.id}
              data-ocid={`reading.item.${i + 1}`}
              className="flex items-center gap-3 p-2.5 rounded-xl group"
              style={{ background: "oklch(0.96 0.015 75 / 0.5)" }}
            >
              <Checkbox
                id={`book-${book.id}`}
                data-ocid={`reading.checkbox.${i + 1}`}
                checked={book.done}
                onCheckedChange={() =>
                  save(
                    books.map((b) =>
                      b.id === book.id ? { ...b, done: !b.done } : b,
                    ),
                  )
                }
              />
              {editingId === book.id ? (
                <Input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    save(
                      books.map((b) =>
                        b.id === book.id
                          ? { ...b, name: editValue.trim() || b.name }
                          : b,
                      ),
                    );
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      save(
                        books.map((b) =>
                          b.id === book.id
                            ? { ...b, name: editValue.trim() || b.name }
                            : b,
                        ),
                      );
                      setEditingId(null);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 h-7 text-sm border-0 bg-transparent rounded-none focus-visible:ring-0"
                />
              ) : (
                <label
                  htmlFor={`book-${book.id}`}
                  className="flex-1 text-sm cursor-pointer"
                  style={{
                    color: book.done
                      ? "oklch(0.58 0.06 75)"
                      : "oklch(0.32 0.05 75)",
                    textDecoration: book.done ? "line-through" : "none",
                  }}
                >
                  {book.name}
                </label>
              )}
              <button
                type="button"
                data-ocid={`reading.edit_button.${i + 1}`}
                onClick={() => {
                  setEditingId(book.id);
                  setEditValue(book.name);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                style={{ color: "oklch(0.55 0.08 75)" }}
              >
                <span className="text-xs">✏️</span>
              </button>
              <button
                type="button"
                data-ocid={`reading.delete_button.${i + 1}`}
                onClick={() => save(books.filter((b) => b.id !== book.id))}
                className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                style={{ color: "oklch(0.55 0.18 25)" }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {books.length === 0 && (
            <div
              data-ocid="reading.empty_state"
              className="text-center py-6"
              style={{ color: "oklch(0.55 0.05 75)" }}
            >
              No books yet. Add one below!
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            data-ocid="reading.input"
            placeholder="Add a book..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addBook()}
            className="flex-1 rounded-xl border-0 text-sm"
            style={{
              background: "oklch(0.96 0.015 75 / 0.5)",
              color: "oklch(0.28 0.04 75)",
            }}
          />
          <Button
            data-ocid="reading.add_button"
            onClick={addBook}
            className="rounded-xl"
            style={{ background: "oklch(0.45 0.14 155)", color: "white" }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── EMERGENCY RESET BUTTON ────────────────────────────────────────────────────
export function EmergencyResetButton() {
  const RESET_ITEMS = [
    { key: "pray", label: "Pray" },
    { key: "quran", label: "Read Qur'an" },
    { key: "study", label: "Study 20 minutes" },
    { key: "clean", label: "Clean workspace" },
  ];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const reset = () => setChecked({});
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6 overflow-hidden">
      <div
        className="h-1"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.55 0.22 25), oklch(0.65 0.2 35))",
        }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            className="font-display text-lg"
            style={{ color: "oklch(0.42 0.18 25)" }}
          >
            🔄 Reset Day
          </CardTitle>
          <Button
            data-ocid="reset_day.primary_button"
            onClick={reset}
            className="rounded-xl text-xs px-3 h-8"
            style={{
              background: "oklch(0.55 0.22 25 / 0.12)",
              color: "oklch(0.42 0.18 25)",
              border: "1px solid oklch(0.55 0.22 25 / 0.3)",
            }}
          >
            Reset All
          </Button>
        </div>
        <p className="text-sm" style={{ color: "oklch(0.52 0.1 35)" }}>
          Sometimes days go badly. Start fresh with these basics.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {RESET_ITEMS.map((item, i) => (
            <button
              key={item.key}
              type="button"
              data-ocid={`reset_day.checkbox.${i + 1}`}
              onClick={() => toggle(item.key)}
              className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                background: checked[item.key]
                  ? "oklch(0.55 0.22 25 / 0.1)"
                  : "oklch(0.97 0.01 35 / 0.8)",
                border: `1px solid ${
                  checked[item.key]
                    ? "oklch(0.55 0.22 25 / 0.3)"
                    : "oklch(0.88 0.02 35 / 0.5)"
                }`,
              }}
            >
              <span className="text-lg">{checked[item.key] ? "✅" : "☐"}</span>
              <span
                className="text-sm font-medium"
                style={{
                  color: checked[item.key]
                    ? "oklch(0.38 0.14 25)"
                    : "oklch(0.42 0.06 35)",
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── VISION SECTION ────────────────────────────────────────────────────────────
export function VisionSection() {
  const [goals, setGoals] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vision_goals");
      return saved
        ? JSON.parse(saved)
        : [
            "Become an excellent English teacher",
            "Clear NET exam",
            "Build a stable tutoring career",
            "Strengthen spiritual discipline",
          ];
    } catch {
      return [
        "Become an excellent English teacher",
        "Clear NET exam",
        "Build a stable tutoring career",
        "Strengthen spiritual discipline",
      ];
    }
  });
  const [input, setInput] = useState("");
  const save = (next: string[]) => {
    setGoals(next);
    localStorage.setItem("vision_goals", JSON.stringify(next));
  };
  return (
    <Card
      className="card-journal rounded-2xl border-0 mb-6"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.22 0.1 285 / 0.97), oklch(0.28 0.12 260 / 0.97))",
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.92 0.1 80)" }}
        >
          🌟 Why I&apos;m Doing This
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {goals.map((goal, i) => (
            <div
              key={`vision-${i}-${goal.slice(0, 10)}`}
              data-ocid={`vision.item.${i + 1}`}
              className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{ background: "oklch(1 0 0 / 0.07)" }}
            >
              <span style={{ color: "oklch(0.75 0.16 80)" }}>✔</span>
              <span
                className="flex-1 text-sm"
                style={{ color: "oklch(0.88 0.06 285)" }}
              >
                {goal}
              </span>
              <button
                type="button"
                data-ocid={`vision.delete_button.${i + 1}`}
                onClick={() => save(goals.filter((_, idx) => idx !== i))}
                className="opacity-50 hover:opacity-100 transition-opacity text-lg"
                style={{ color: "oklch(0.65 0.12 25)" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            data-ocid="vision.input"
            placeholder="Add a vision goal..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                save([...goals, input.trim()]);
                setInput("");
              }
            }}
            className="flex-1 rounded-xl border-0 text-sm"
            style={{
              background: "oklch(1 0 0 / 0.1)",
              color: "oklch(0.9 0.05 285)",
            }}
          />
          <Button
            data-ocid="vision.add_button"
            onClick={() => {
              if (input.trim()) {
                save([...goals, input.trim()]);
                setInput("");
              }
            }}
            className="rounded-xl"
            style={{
              background: "oklch(0.55 0.22 80 / 0.4)",
              color: "oklch(0.92 0.1 80)",
              border: "1px solid oklch(0.65 0.18 80 / 0.3)",
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── FUTURE AYSHA MESSAGE ──────────────────────────────────────────────────────
export function FutureAyshaMessage() {
  return (
    <Card
      className="card-journal rounded-2xl border-0 mb-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.97 0.03 80 / 0.9), oklch(0.98 0.015 60 / 0.9))",
        border: "1px solid oklch(0.88 0.06 75 / 0.5)",
      }}
    >
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-4xl">💌</span>
          <div>
            <p
              className="font-display text-base font-bold mb-2"
              style={{ color: "oklch(0.38 0.1 60)" }}
            >
              Message from Future Aysha
            </p>
            <p
              className="text-sm leading-relaxed italic max-w-sm"
              style={{ color: "oklch(0.45 0.08 60)" }}
            >
              &ldquo;Thank you for studying when it was hard. Those small daily
              habits changed everything.&rdquo;
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── LIFE TIMELINE ─────────────────────────────────────────────────────────────
export function LifeTimeline() {
  const [timeline, setTimeline] = useState<{ year: string; items: string[] }[]>(
    () => {
      try {
        const saved = localStorage.getItem("life_timeline");
        return saved
          ? JSON.parse(saved)
          : [
              {
                year: "2026",
                items: [
                  "MA Final Exams",
                  "TESOL Certificate",
                  "Reach 5 Tuition Students",
                ],
              },
              {
                year: "2027",
                items: ["Clear NET", "Become Lecturer / Senior Tutor"],
              },
            ];
      } catch {
        return [
          {
            year: "2026",
            items: [
              "MA Final Exams",
              "TESOL Certificate",
              "Reach 5 Tuition Students",
            ],
          },
          {
            year: "2027",
            items: ["Clear NET", "Become Lecturer / Senior Tutor"],
          },
        ];
      }
    },
  );
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const save = (next: typeof timeline) => {
    setTimeline(next);
    localStorage.setItem("life_timeline", JSON.stringify(next));
  };
  const addItem = (yearIdx: number) => {
    const year = timeline[yearIdx].year;
    if (!inputs[year]?.trim()) return;
    save(
      timeline.map((t, i) =>
        i === yearIdx ? { ...t, items: [...t.items, inputs[year].trim()] } : t,
      ),
    );
    setInputs((prev) => ({ ...prev, [year]: "" }));
  };
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          🗺️ Your Path
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {timeline.map((entry, yearIdx) => (
          <div key={entry.year} data-ocid={`timeline.item.${yearIdx + 1}`}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-14 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0"
                style={{
                  background: "oklch(0.42 0.18 285 / 0.12)",
                  color: "oklch(0.42 0.18 285)",
                  border: "2px solid oklch(0.55 0.18 285 / 0.3)",
                }}
              >
                {entry.year}
              </div>
              <div
                className="h-px flex-1"
                style={{ background: "oklch(0.85 0.025 75 / 0.7)" }}
              />
            </div>
            <div
              className="pl-5 space-y-1.5 border-l-2 ml-7"
              style={{ borderColor: "oklch(0.75 0.1 285 / 0.3)" }}
            >
              {entry.items.map((item, i) => (
                <div
                  key={`${entry.year}-${i}-${item.slice(0, 8)}`}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ background: "oklch(0.96 0.018 285 / 0.3)" }}
                >
                  <span style={{ color: "oklch(0.55 0.18 285)" }}>•</span>
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.38 0.08 75)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  data-ocid={`timeline.input.${yearIdx + 1}`}
                  placeholder={`Add milestone for ${entry.year}...`}
                  value={inputs[entry.year] ?? ""}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [entry.year]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addItem(yearIdx)}
                  className="flex-1 h-7 text-xs px-2 rounded-lg border-0"
                  style={{
                    background: "oklch(0.96 0.015 285 / 0.3)",
                    color: "oklch(0.32 0.08 75)",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  data-ocid={`timeline.add_button.${yearIdx + 1}`}
                  onClick={() => addItem(yearIdx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: "oklch(0.42 0.18 285)",
                    color: "white",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── ACHIEVEMENT TIMELINE ──────────────────────────────────────────────────────
export function AchievementTimeline() {
  const [achievements, setAchievements] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("achievement_timeline");
      return saved
        ? JSON.parse(saved)
        : [
            "Built my first productivity website ✔",
            "Completed first MA book ✔",
            "Reached 3 students ✔",
            "10-day Riyalah streak ✔",
          ];
    } catch {
      return [
        "Built my first productivity website ✔",
        "Completed first MA book ✔",
        "Reached 3 students ✔",
        "10-day Riyalah streak ✔",
      ];
    }
  });
  const [input, setInput] = useState("");
  const save = (next: string[]) => {
    setAchievements(next);
    localStorage.setItem("achievement_timeline", JSON.stringify(next));
  };
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          🏆 Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className="space-y-2 border-l-2 pl-4"
          style={{ borderColor: "oklch(0.75 0.16 80 / 0.4)" }}
        >
          {achievements.map((a, i) => (
            <div
              key={`ach-${i}-${a.slice(0, 10)}`}
              data-ocid={`achievement_timeline.item.${i + 1}`}
              className="flex items-start gap-2 group"
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{
                  background: "oklch(0.65 0.16 80)",
                  marginLeft: "-1.25rem",
                }}
              />
              <span
                className="text-sm flex-1"
                style={{ color: "oklch(0.38 0.06 75)" }}
              >
                {a}
              </span>
              <button
                type="button"
                data-ocid={`achievement_timeline.delete_button.${i + 1}`}
                onClick={() => save(achievements.filter((_, idx) => idx !== i))}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-lg"
                style={{ color: "oklch(0.55 0.18 25)" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            data-ocid="achievement_timeline.input"
            placeholder="Add an achievement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                save([...achievements, input.trim()]);
                setInput("");
              }
            }}
            className="flex-1 rounded-xl border-0 text-sm"
            style={{
              background: "oklch(0.96 0.015 75 / 0.5)",
              color: "oklch(0.28 0.04 75)",
            }}
          />
          <Button
            data-ocid="achievement_timeline.add_button"
            onClick={() => {
              if (input.trim()) {
                save([...achievements, input.trim()]);
                setInput("");
              }
            }}
            className="rounded-xl"
            style={{ background: "oklch(0.65 0.16 80)", color: "white" }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── WEEKLY PLANNING BOARD ─────────────────────────────────────────────────────
const BOARD_COLS = ["Study", "Career", "Teaching", "Spiritual"] as const;
type BoardCol = (typeof BOARD_COLS)[number];

const COL_COLORS: Record<BoardCol, string> = {
  Study: "oklch(0.42 0.14 155)",
  Career: "oklch(0.55 0.18 50)",
  Teaching: "oklch(0.5 0.18 225)",
  Spiritual: "oklch(0.42 0.22 285)",
};
const COL_EMOJIS: Record<BoardCol, string> = {
  Study: "📚",
  Career: "💼",
  Teaching: "👩‍🏫",
  Spiritual: "🕌",
};

export function WeeklyPlanningBoard() {
  const [board, setBoard] = useState<Record<BoardCol, string[]>>(() => {
    try {
      const saved = localStorage.getItem("weekly_planning_board");
      return saved
        ? JSON.parse(saved)
        : {
            Study: ["Chaucer lecture", "Shakespeare reading"],
            Career: ["Finish TESOL module 2"],
            Teaching: ["Prepare Theo writing exercises"],
            Spiritual: ["Maintain Riyalah streak"],
          };
    } catch {
      return { Study: [], Career: [], Teaching: [], Spiritual: [] };
    }
  });
  const [inputs, setInputs] = useState<Record<BoardCol, string>>({
    Study: "",
    Career: "",
    Teaching: "",
    Spiritual: "",
  });
  const save = (next: typeof board) => {
    setBoard(next);
    localStorage.setItem("weekly_planning_board", JSON.stringify(next));
  };
  const addItem = (col: BoardCol) => {
    if (!inputs[col].trim()) return;
    save({ ...board, [col]: [...board[col], inputs[col].trim()] });
    setInputs((prev) => ({ ...prev, [col]: "" }));
  };
  const removeItem = (col: BoardCol, i: number) => {
    save({ ...board, [col]: board[col].filter((_, idx) => idx !== i) });
  };
  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <CardTitle
          className="font-display text-lg"
          style={{ color: "oklch(0.28 0.06 75)" }}
        >
          📋 This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {BOARD_COLS.map((col) => (
            <div key={col}>
              <div className="flex items-center gap-1.5 mb-2">
                <span>{COL_EMOJIS[col]}</span>
                <h4
                  className="text-sm font-bold"
                  style={{ color: COL_COLORS[col] }}
                >
                  {col}
                </h4>
              </div>
              <div className="space-y-1.5">
                {board[col].map((task, i) => (
                  <div
                    key={`${col}-task-${i}-${task.slice(0, 8)}`}
                    data-ocid={`board.${col.toLowerCase()}.item.${i + 1}`}
                    className="flex items-start gap-1.5 p-2 rounded-lg group"
                    style={{ background: "oklch(0.96 0.015 75 / 0.5)" }}
                  >
                    <span
                      className="text-xs mt-0.5"
                      style={{ color: COL_COLORS[col] }}
                    >
                      •
                    </span>
                    <span
                      className="text-xs flex-1"
                      style={{ color: "oklch(0.38 0.06 75)" }}
                    >
                      {task}
                    </span>
                    <button
                      type="button"
                      data-ocid={`board.${col.toLowerCase()}.delete_button.${i + 1}`}
                      onClick={() => removeItem(col, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "oklch(0.55 0.18 25)" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1 mt-2">
                <input
                  type="text"
                  data-ocid={`board.${col.toLowerCase()}.input`}
                  placeholder="Add task..."
                  value={inputs[col]}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, [col]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addItem(col)}
                  className="flex-1 text-xs px-2 py-1.5 rounded-lg"
                  style={{
                    background: "oklch(0.96 0.015 75 / 0.5)",
                    color: "oklch(0.32 0.05 75)",
                    border: "1px solid oklch(0.88 0.02 75 / 0.5)",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  data-ocid={`board.${col.toLowerCase()}.add_button`}
                  onClick={() => addItem(col)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold"
                  style={{ background: COL_COLORS[col], color: "white" }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── COLLAPSIBLE SECTION ──────────────────────────────────────────────────────
export function CollapsibleSection({
  id,
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  id: string;
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`section_collapse_${id}`);
      return saved !== null ? saved === "true" : defaultOpen;
    } catch {
      return defaultOpen;
    }
  });

  const toggle = () => {
    const next = !open;
    setOpen(next);
    localStorage.setItem(`section_collapse_${id}`, String(next));
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        data-ocid={`section.${id}.toggle`}
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl mb-2 transition-all"
        style={{
          background: "oklch(0.94 0.015 75 / 0.7)",
          border: "1px solid oklch(0.88 0.015 75 / 0.5)",
          color: "oklch(0.32 0.06 75)",
        }}
      >
        <span className="font-semibold text-sm">
          {icon && <span className="mr-1.5">{icon}</span>}
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 opacity-60" />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-60" />
        )}
      </button>
      {open && children}
    </div>
  );
}

// ─── VIEW MODE BAR ────────────────────────────────────────────────────────────
const VIEW_MODES = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "focus", label: "Focus", icon: "⚡" },
  { key: "deepwork", label: "Deep Work", icon: "📚" },
  { key: "review", label: "Review", icon: "📊" },
] as const;

export type ViewMode = (typeof VIEW_MODES)[number]["key"];

export function ViewModeBar({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  return (
    <div
      data-ocid="viewmode.bar"
      className="flex gap-1 p-1 rounded-2xl mb-4"
      style={{
        background: "oklch(0.92 0.018 75 / 0.8)",
        border: "1px solid oklch(0.86 0.02 75 / 0.7)",
      }}
    >
      {VIEW_MODES.map((vm) => (
        <button
          key={vm.key}
          type="button"
          data-ocid={`viewmode.${vm.key}.button`}
          onClick={() => onChange(vm.key)}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all"
          style={
            mode === vm.key
              ? {
                  background:
                    "linear-gradient(135deg, oklch(0.3 0.14 285), oklch(0.25 0.1 295))",
                  color: "oklch(0.92 0.08 80)",
                  boxShadow: "0 2px 8px oklch(0.2 0.1 285 / 0.4)",
                }
              : { color: "oklch(0.45 0.06 75)" }
          }
        >
          <span>{vm.icon}</span>
          <span className="hidden sm:inline">{vm.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── QUICK ACTIONS ────────────────────────────────────────────────────────────
export function QuickActionsPanel({
  onAddTask,
  onAddStudyTime,
  onAddStudent,
  onMarkRiyalah,
}: {
  onAddTask: () => void;
  onAddStudyTime: () => void;
  onAddStudent: () => void;
  onMarkRiyalah: () => void;
}) {
  const actions = [
    {
      label: "+ Add Task",
      icon: "✅",
      onClick: onAddTask,
      ocid: "quickactions.add_task_button",
      color: "oklch(0.5 0.18 225)",
    },
    {
      label: "+ Study Time",
      icon: "📖",
      onClick: onAddStudyTime,
      ocid: "quickactions.add_study_button",
      color: "oklch(0.48 0.16 155)",
    },
    {
      label: "+ Add Student",
      icon: "👩‍🏫",
      onClick: onAddStudent,
      ocid: "quickactions.add_student_button",
      color: "oklch(0.5 0.18 55)",
    },
    {
      label: "Mark Riyalah",
      icon: "🕌",
      onClick: onMarkRiyalah,
      ocid: "quickactions.riyalah_button",
      color: "oklch(0.42 0.22 285)",
    },
  ];
  return (
    <div
      data-ocid="quickactions.panel"
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"
    >
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          data-ocid={a.ocid}
          onClick={a.onClick}
          className="flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: a.color,
            color: "white",
            boxShadow: `0 2px 8px ${a.color} / 0.3`,
          }}
        >
          <span className="text-base">{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ─── RESET DIALOGS ────────────────────────────────────────────────────────────
export function FullResetButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          data-ocid="header.full_reset.open_modal_button"
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: "oklch(0.45 0.2 25 / 0.3)",
            border: "1px solid oklch(0.5 0.2 25 / 0.4)",
            color: "oklch(0.88 0.12 25)",
          }}
        >
          ⚠️ Full Reset
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        data-ocid="full_reset.dialog"
        style={{ background: "oklch(0.97 0.01 75)" }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: "oklch(0.35 0.16 25)" }}>
            ⚠️ Full Reset
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: "oklch(0.45 0.05 75)" }}>
            This will clear <strong>all your progress</strong> — study hours,
            riyalah streak, goals, income, students, achievements, tasks, and
            all saved data.
            <br />
            <br />
            <span style={{ color: "oklch(0.5 0.2 25)", fontWeight: 600 }}>
              This cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="full_reset.cancel_button"
            style={{ borderRadius: "0.75rem" }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="full_reset.confirm_button"
            onClick={() => {
              localStorage.clear();
              toast.success("All data cleared. Starting fresh.", {
                duration: 3000,
              });
              setTimeout(() => window.location.reload(), 1000);
            }}
            style={{
              background: "oklch(0.45 0.2 25)",
              borderRadius: "0.75rem",
            }}
          >
            Yes, clear everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RestartWeekButton({
  onRestart,
}: {
  onRestart: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          data-ocid="header.restart_week.open_modal_button"
          className="rounded-xl text-sm"
          style={{
            background: "oklch(0.5 0.18 225 / 0.2)",
            color: "oklch(0.85 0.1 225)",
            border: "1px solid oklch(0.6 0.15 225 / 0.3)",
          }}
        >
          🔄 Restart Week
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        data-ocid="restart_week.dialog"
        style={{ background: "oklch(0.97 0.01 75)" }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: "oklch(0.32 0.14 225)" }}>
            🔄 Restart Week
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: "oklch(0.45 0.05 75)" }}>
            This will clear weekly study hours and weekly goals. Your long-term
            progress (books, streak, income) will be kept.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="restart_week.cancel_button"
            style={{ borderRadius: "0.75rem" }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="restart_week.confirm_button"
            onClick={onRestart}
            style={{
              background: "oklch(0.5 0.18 225)",
              borderRadius: "0.75rem",
            }}
          >
            New week. Start fresh.
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ResetWeeklyDataButton({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          data-ocid="study_hours.reset_weekly.open_modal_button"
          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: "oklch(0.88 0.06 25 / 0.4)",
            color: "oklch(0.45 0.15 25)",
            border: "1px solid oklch(0.75 0.1 25 / 0.3)",
          }}
        >
          Reset Weekly Data
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        data-ocid="reset_weekly.dialog"
        style={{ background: "oklch(0.97 0.01 75)" }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: "oklch(0.35 0.16 25)" }}>
            Reset Weekly Data
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: "oklch(0.45 0.05 75)" }}>
            Are you sure you want to reset this week? This will clear all study
            hours, today&apos;s tasks and goals, and the weekly summary.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="reset_weekly.cancel_button"
            style={{ borderRadius: "0.75rem" }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="reset_weekly.confirm_button"
            onClick={onReset}
            style={{
              background: "oklch(0.45 0.2 25)",
              borderRadius: "0.75rem",
            }}
          >
            Yes, reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── DYNAMIC STUDENTS ─────────────────────────────────────────────────────────
export interface StudentData {
  id: string;
  name: string;
  subject: string;
  notes: string;
  sessions: number;
  active: boolean;
  classFrequency: string;
  nextClass: string;
}

function StudentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<StudentData>;
  onSave: (data: Omit<StudentData, "id" | "sessions">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [classFrequency, setClassFrequency] = useState(
    initial?.classFrequency ?? "",
  );
  const [nextClass, setNextClass] = useState(initial?.nextClass ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <div className="space-y-3">
      <div>
        <label
          className="text-xs font-semibold block mb-1"
          htmlFor="sf-name"
          style={{ color: "oklch(0.38 0.08 75)" }}
        >
          Name *
        </label>
        <Input
          id="sf-name"
          data-ocid="student_form.name_input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
          className="rounded-xl border-0"
          style={{ background: "oklch(0.94 0.02 75 / 0.6)" }}
        />
      </div>
      <div>
        <label
          className="text-xs font-semibold block mb-1"
          htmlFor="sf-subject"
          style={{ color: "oklch(0.38 0.08 75)" }}
        >
          Subject
        </label>
        <Input
          id="sf-subject"
          data-ocid="student_form.subject_input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. English Writing"
          className="rounded-xl border-0"
          style={{ background: "oklch(0.94 0.02 75 / 0.6)" }}
        />
      </div>
      <div>
        <label
          className="text-xs font-semibold block mb-1"
          htmlFor="sf-freq"
          style={{ color: "oklch(0.38 0.08 75)" }}
        >
          Class Frequency
        </label>
        <Input
          id="sf-freq"
          data-ocid="student_form.frequency_input"
          value={classFrequency}
          onChange={(e) => setClassFrequency(e.target.value)}
          placeholder="e.g. 3 days/week"
          className="rounded-xl border-0"
          style={{ background: "oklch(0.94 0.02 75 / 0.6)" }}
        />
      </div>
      <div>
        <label
          className="text-xs font-semibold block mb-1"
          htmlFor="sf-next"
          style={{ color: "oklch(0.38 0.08 75)" }}
        >
          Next Class
        </label>
        <Input
          id="sf-next"
          data-ocid="student_form.next_class_input"
          value={nextClass}
          onChange={(e) => setNextClass(e.target.value)}
          placeholder="e.g. Monday 4pm"
          className="rounded-xl border-0"
          style={{ background: "oklch(0.94 0.02 75 / 0.6)" }}
        />
      </div>
      <div>
        <label
          className="text-xs font-semibold block mb-1"
          htmlFor="sf-notes"
          style={{ color: "oklch(0.38 0.08 75)" }}
        >
          Notes
        </label>
        <Input
          id="sf-notes"
          data-ocid="student_form.notes_input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this student"
          className="rounded-xl border-0"
          style={{ background: "oklch(0.94 0.02 75 / 0.6)" }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          data-ocid="student_form.active_checkbox"
          checked={active}
          onCheckedChange={(v) => setActive(!!v)}
          id="student-active"
        />
        <label
          htmlFor="student-active"
          className="text-sm"
          style={{ color: "oklch(0.38 0.06 75)" }}
        >
          Active student
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          data-ocid="student_form.save_button"
          onClick={() => {
            if (!name.trim()) return;
            onSave({
              name: name.trim(),
              subject,
              notes,
              classFrequency,
              nextClass,
              active,
            });
          }}
          className="flex-1 rounded-xl"
          style={{ background: "oklch(0.5 0.18 55)", color: "white" }}
        >
          Save
        </Button>
        <Button
          data-ocid="student_form.cancel_button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function DynamicStudentsSection({
  onChange,
}: {
  onChange?: (count: number) => void;
}) {
  const [students, setStudents] = useState<StudentData[]>(() => {
    try {
      const saved = localStorage.getItem("dynamic_students");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const save = (next: StudentData[]) => {
    setStudents(next);
    localStorage.setItem("dynamic_students", JSON.stringify(next));
    onChange?.(next.length);
  };

  const handleAdd = (data: Omit<StudentData, "id" | "sessions">) => {
    const next = [
      ...students,
      { ...data, id: Date.now().toString(), sessions: 0 },
    ];
    save(next);
    setShowAddDialog(false);
    toast.success(`${data.name} added!`);
  };

  const handleEdit = (
    id: string,
    data: Omit<StudentData, "id" | "sessions">,
  ) => {
    save(students.map((s) => (s.id === id ? { ...s, ...data } : s)));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    save(students.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  const incrementSessions = (id: string) => {
    save(
      students.map((s) =>
        s.id === id ? { ...s, sessions: s.sessions + 1 } : s,
      ),
    );
  };

  const toggleActive = (id: string) => {
    save(students.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const activeCount = students.filter((s) => s.active).length;

  return (
    <Card className="card-journal rounded-2xl border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            className="font-display text-xl"
            style={{ color: "oklch(0.38 0.16 50)" }}
          >
            👩‍🏫 Students
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              className="rounded-full text-xs px-2.5"
              style={{
                background: "oklch(0.55 0.18 50 / 0.12)",
                color: "oklch(0.45 0.16 50)",
                border: "1px solid oklch(0.65 0.15 55 / 0.3)",
              }}
            >
              {activeCount} active
            </Badge>
            <button
              type="button"
              data-ocid="students.add_button"
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: "oklch(0.5 0.18 55)",
                color: "white",
              }}
            >
              <Plus className="w-3 h-3" /> Add Student
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.length === 0 ? (
          <div
            data-ocid="students.empty_state"
            className="text-center py-8 rounded-xl"
            style={{ background: "oklch(0.96 0.02 60 / 0.5)" }}
          >
            <p className="text-3xl mb-2">👩‍🏫</p>
            <p
              className="font-medium text-sm"
              style={{ color: "oklch(0.5 0.1 55)" }}
            >
              No students yet
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.65 0.07 55)" }}
            >
              Click &quot;Add Student&quot; to get started
            </p>
          </div>
        ) : (
          students.map((student, i) => (
            <div
              key={student.id}
              data-ocid={`students.item.${i + 1}`}
              className="p-3 rounded-xl space-y-2"
              style={{
                background: student.active
                  ? "oklch(0.96 0.025 60)"
                  : "oklch(0.94 0.01 75 / 0.5)",
                border: `1px solid ${
                  student.active
                    ? "oklch(0.85 0.05 55 / 0.5)"
                    : "oklch(0.88 0.01 75 / 0.4)"
                }`,
                opacity: student.active ? 1 : 0.65,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: "oklch(0.82 0.08 55 / 0.5)",
                        color: "oklch(0.42 0.14 50)",
                      }}
                    >
                      {student.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "oklch(0.28 0.04 75)" }}
                      >
                        {student.name}
                      </p>
                      {student.subject && (
                        <p
                          className="text-xs"
                          style={{ color: "oklch(0.55 0.08 55)" }}
                        >
                          {student.subject}
                        </p>
                      )}
                    </div>
                  </div>
                  {student.classFrequency && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "oklch(0.58 0.07 75)" }}
                    >
                      📅 {student.classFrequency}
                    </p>
                  )}
                  {student.nextClass && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.48 0.12 155)" }}
                    >
                      ⏰ Next: {student.nextClass}
                    </p>
                  )}
                  {student.notes && (
                    <p
                      className="text-xs mt-1 italic"
                      style={{ color: "oklch(0.6 0.05 75)" }}
                    >
                      {student.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      data-ocid={`students.edit_button.${i + 1}`}
                      onClick={() => setEditingId(student.id)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{
                        background: "oklch(0.9 0.02 75 / 0.7)",
                        color: "oklch(0.45 0.08 75)",
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <AlertDialog
                      open={deleteId === student.id}
                      onOpenChange={(open) => !open && setDeleteId(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          data-ocid={`students.delete_button.${i + 1}`}
                          onClick={() => setDeleteId(student.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{
                            background: "oklch(0.9 0.04 25 / 0.4)",
                            color: "oklch(0.5 0.15 25)",
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        style={{ background: "oklch(0.97 0.01 75)" }}
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Remove {student.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove this student.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            data-ocid={`students.delete_confirm_button.${i + 1}`}
                            onClick={() => handleDelete(student.id)}
                            style={{ background: "oklch(0.45 0.2 25)" }}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <button
                    type="button"
                    data-ocid={`students.session_button.${i + 1}`}
                    onClick={() => incrementSessions(student.id)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: "oklch(0.5 0.18 155 / 0.2)",
                      color: "oklch(0.38 0.14 155)",
                    }}
                  >
                    +1 Session ({student.sessions})
                  </button>
                  <button
                    type="button"
                    data-ocid={`students.active_toggle.${i + 1}`}
                    onClick={() => toggleActive(student.id)}
                    className="px-2 py-0.5 rounded-lg text-xs"
                    style={{
                      background: student.active
                        ? "oklch(0.5 0.18 155 / 0.15)"
                        : "oklch(0.88 0.01 75 / 0.5)",
                      color: student.active
                        ? "oklch(0.38 0.14 155)"
                        : "oklch(0.55 0.04 75)",
                    }}
                  >
                    {student.active ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Add Student Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent
            data-ocid="students.add_dialog"
            style={{ background: "oklch(0.97 0.01 75)" }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: "oklch(0.32 0.14 55)" }}>
                Add New Student
              </DialogTitle>
            </DialogHeader>
            <StudentForm
              onSave={handleAdd}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog
          open={!!editingId}
          onOpenChange={(open) => !open && setEditingId(null)}
        >
          <DialogContent
            data-ocid="students.edit_dialog"
            style={{ background: "oklch(0.97 0.01 75)" }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: "oklch(0.32 0.14 55)" }}>
                Edit Student
              </DialogTitle>
            </DialogHeader>
            {editingId && (
              <StudentForm
                initial={students.find((s) => s.id === editingId)}
                onSave={(data) => handleEdit(editingId, data)}
                onCancel={() => setEditingId(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ─── IMPROVED HABIT HEATMAP ──────────────────────────────────────────────────
export function ImprovedHabitHeatmap() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dailyLog, setDailyLog] = useState<
    Record<
      string,
      {
        studyHours?: number;
        riyalahDone?: boolean;
        tasksCompleted?: number;
        productive?: boolean;
      }
    >
  >(() => {
    try {
      const saved = localStorage.getItem("daily_log_v2");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const todayStr = today.toISOString().slice(0, 10);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = (firstDayOfMonth + 6) % 7; // Mon=0

  const toggleDay = (dateStr: string) => {
    const next = {
      ...dailyLog,
      [dateStr]: {
        ...dailyLog[dateStr],
        productive: !dailyLog[dateStr]?.productive,
      },
    };
    setDailyLog(next);
    localStorage.setItem("daily_log_v2", JSON.stringify(next));
    setSelectedDay(selectedDay === dateStr ? null : dateStr);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const selectedData = selectedDay ? dailyLog[selectedDay] : null;

  return (
    <Card
      className="card-journal rounded-2xl border-0 mb-6"
      data-ocid="heatmap.card"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            className="font-display text-lg"
            style={{ color: "oklch(0.28 0.06 75)" }}
          >
            📅 Habit Heatmap
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="heatmap.prev_button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: "oklch(0.92 0.015 75)",
                color: "oklch(0.42 0.06 75)",
              }}
            >
              ‹
            </button>
            <span
              className="text-sm font-semibold min-w-[110px] text-center"
              style={{ color: "oklch(0.38 0.06 75)" }}
            >
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              data-ocid="heatmap.next_button"
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="p-1.5 rounded-lg transition-all disabled:opacity-40"
              style={{
                background: "oklch(0.92 0.015 75)",
                color: "oklch(0.42 0.06 75)",
              }}
            >
              ›
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div
              key={d}
              className="text-center text-xs py-1"
              style={{ color: "oklch(0.6 0.04 75)" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }, (_, offset) => {
            const paddingKey = `${year}-${month}-pad-${startOffset - offset}`;
            return (
              <div
                key={paddingKey}
                className="w-full aspect-square"
                aria-hidden="true"
              />
            );
          })}
          {Array.from({ length: daysInMonth }, (_, idx) => {
            const dateStr = new Date(year, month, idx + 1)
              .toISOString()
              .slice(0, 10);
            const isToday = dateStr === todayStr;
            const data = dailyLog[dateStr];
            const productive = data?.productive;
            const partial = !productive && (data?.studyHours ?? 0) > 0;
            const dayNum = idx + 1;
            return (
              <button
                key={dateStr}
                type="button"
                data-ocid={`heatmap.item.${dayNum}`}
                onClick={() => toggleDay(dateStr)}
                title={dateStr}
                className="w-full aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all"
                style={{
                  background: productive
                    ? "oklch(0.52 0.18 145)"
                    : partial
                      ? "oklch(0.72 0.12 145 / 0.5)"
                      : "oklch(0.9 0.015 75 / 0.7)",
                  border: isToday
                    ? "2px solid oklch(0.55 0.18 285)"
                    : selectedDay === dateStr
                      ? "2px solid oklch(0.55 0.18 55)"
                      : "1px solid oklch(0.85 0.02 75 / 0.4)",
                  color: productive ? "white" : "oklch(0.52 0.04 75)",
                  transform: productive ? "scale(1.05)" : "scale(1)",
                  fontWeight: isToday ? "bold" : "normal",
                }}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Legend */}
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
              style={{ background: "oklch(0.72 0.12 145 / 0.5)" }}
            />
            <span>Partial</span>
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

        {/* Selected day detail */}
        {selectedDay && (
          <div
            data-ocid="heatmap.day_detail.panel"
            className="mt-3 p-3 rounded-xl"
            style={{
              background: "oklch(0.95 0.02 75 / 0.6)",
              border: "1px solid oklch(0.88 0.015 75 / 0.5)",
            }}
          >
            <p
              className="text-xs font-semibold mb-1.5"
              style={{ color: "oklch(0.38 0.06 75)" }}
            >
              {new Date(`${selectedDay}T12:00:00`).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            {!selectedData ||
            (!selectedData.productive &&
              !selectedData.studyHours &&
              !selectedData.riyalahDone) ? (
              <p className="text-xs" style={{ color: "oklch(0.6 0.04 75)" }}>
                No activity logged. Click the date to mark as productive.
              </p>
            ) : (
              <div
                className="space-y-1 text-xs"
                style={{ color: "oklch(0.45 0.05 75)" }}
              >
                {selectedData.productive && <p>✅ Marked as productive day</p>}
                {selectedData.studyHours ? (
                  <p>📖 Study: {selectedData.studyHours}h</p>
                ) : null}
                {selectedData.riyalahDone && <p>🕌 Riyalah completed</p>}
                {(selectedData.tasksCompleted ?? 0) > 0 && (
                  <p>✅ {selectedData.tasksCompleted} tasks completed</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── EDITABLE ACHIEVEMENTS ──────────────────────────────────────────────────
export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  completed: boolean;
  auto: boolean;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "riyalah7",
    icon: "🔥",
    name: "7-Day Riyalah Streak",
    desc: "7 consecutive riyalah days",
    completed: false,
    auto: true,
  },
  {
    id: "mabook1",
    icon: "📚",
    name: "First MA Book",
    desc: "Complete 1 MA book",
    completed: false,
    auto: true,
  },
  {
    id: "cert1",
    icon: "🎓",
    name: "First Certificate",
    desc: "Earn 1 certificate",
    completed: false,
    auto: true,
  },
  {
    id: "students5",
    icon: "👩‍🏫",
    name: "5 Students Reached",
    desc: "Add 5 students",
    completed: false,
    auto: true,
  },
  {
    id: "pomodoro",
    icon: "⏰",
    name: "Pomodoro Master",
    desc: "Used the focus timer",
    completed: false,
    auto: false,
  },
];

export function EditableAchievements({
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
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem("achievements_v2");
      return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newIcon, setNewIcon] = useState("⭐");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const save = (next: Achievement[]) => {
    setAchievements(next);
    localStorage.setItem("achievements_v2", JSON.stringify(next));
  };

  // Auto-unlock logic
  const updateAutoAchievements = (list: Achievement[]) => {
    return list.map((a) => {
      if (!a.auto) return a;
      if (a.id === "riyalah7" && riyalahStreak >= 7)
        return { ...a, completed: true };
      if (a.id === "mabook1" && booksCompleted >= 1)
        return { ...a, completed: true };
      if (a.id === "cert1" && certsCompleted >= 1)
        return { ...a, completed: true };
      if (a.id === "students5" && studentsCount >= 5)
        return { ...a, completed: true };
      return a;
    });
  };

  const autoUpdated = updateAutoAchievements(achievements);

  const toggleComplete = (id: string) => {
    save(
      achievements.map((a) =>
        a.id === id && !a.auto ? { ...a, completed: !a.completed } : a,
      ),
    );
  };

  const handleDelete = (id: string) => {
    save(achievements.filter((a) => a.id !== id || a.auto));
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    save([
      ...achievements,
      {
        id: `custom_${Date.now()}`,
        icon: newIcon,
        name: newName.trim(),
        desc: newDesc.trim(),
        completed: false,
        auto: false,
      },
    ]);
    setNewName("");
    setNewDesc("");
    setNewIcon("⭐");
    setShowAdd(false);
  };

  const handleSaveEdit = (
    id: string,
    icon: string,
    name: string,
    desc: string,
  ) => {
    save(
      achievements.map((a) => (a.id === id ? { ...a, icon, name, desc } : a)),
    );
    setEditingId(null);
  };

  return (
    <Card className="card-journal rounded-2xl border-0 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            className="font-display text-lg"
            style={{ color: "oklch(0.28 0.06 75)" }}
          >
            🏆 Achievements
          </CardTitle>
          <button
            type="button"
            data-ocid="achievements.add_button"
            onClick={() => setShowAdd((p) => !p)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: "oklch(0.5 0.18 55)", color: "white" }}
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <p
          className="text-xs mt-1 italic"
          style={{ color: "oklch(0.55 0.05 75)" }}
        >
          Missed a day? Missed a week? Start again. That&apos;s the system.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {showAdd && (
          <div
            className="p-3 rounded-xl space-y-2 mb-3"
            style={{
              background: "oklch(0.95 0.02 75 / 0.7)",
              border: "1px solid oklch(0.88 0.02 75 / 0.5)",
            }}
          >
            <div className="flex gap-2">
              <Input
                data-ocid="achievements.icon_input"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                placeholder="Icon"
                className="w-16 rounded-xl border-0 text-center"
                style={{ background: "oklch(0.92 0.02 75 / 0.6)" }}
              />
              <Input
                data-ocid="achievements.name_input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Achievement name"
                className="flex-1 rounded-xl border-0"
                style={{ background: "oklch(0.92 0.02 75 / 0.6)" }}
              />
            </div>
            <Input
              data-ocid="achievements.desc_input"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              className="rounded-xl border-0"
              style={{ background: "oklch(0.92 0.02 75 / 0.6)" }}
            />
            <div className="flex gap-2">
              <Button
                data-ocid="achievements.save_button"
                onClick={handleAdd}
                className="flex-1 rounded-xl text-xs h-8"
                style={{ background: "oklch(0.5 0.18 55)", color: "white" }}
              >
                Add Achievement
              </Button>
              <Button
                onClick={() => setShowAdd(false)}
                variant="outline"
                className="rounded-xl text-xs h-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {autoUpdated.map((badge, i) => (
            <div
              key={badge.id}
              data-ocid={`achievements.item.${i + 1}`}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: badge.completed
                  ? "oklch(0.94 0.025 75)"
                  : "oklch(0.94 0.008 75 / 0.5)",
                border: `1px solid ${
                  badge.completed
                    ? "oklch(0.82 0.06 75 / 0.7)"
                    : "oklch(0.88 0.01 75 / 0.4)"
                }`,
                opacity: badge.completed ? 1 : 0.5,
              }}
            >
              <span
                className="text-2xl flex-shrink-0"
                style={{ filter: badge.completed ? "none" : "grayscale(1)" }}
              >
                {badge.icon}
              </span>
              <div className="flex-1 min-w-0">
                {editingId === badge.id ? (
                  <EditAchievementInline
                    badge={badge}
                    onSave={(icon, name, desc) =>
                      handleSaveEdit(badge.id, icon, name, desc)
                    }
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <p
                      className="text-xs font-semibold leading-tight"
                      style={{
                        color: badge.completed
                          ? "oklch(0.32 0.08 75)"
                          : "oklch(0.55 0.03 75)",
                      }}
                    >
                      {badge.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.58 0.05 75)" }}
                    >
                      {badge.desc}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!badge.auto && (
                  <Checkbox
                    data-ocid={`achievements.checkbox.${i + 1}`}
                    checked={badge.completed}
                    onCheckedChange={() => toggleComplete(badge.id)}
                  />
                )}
                <button
                  type="button"
                  data-ocid={`achievements.edit_button.${i + 1}`}
                  onClick={() =>
                    setEditingId(editingId === badge.id ? null : badge.id)
                  }
                  className="p-1 rounded opacity-60 hover:opacity-100"
                  style={{ color: "oklch(0.5 0.06 75)" }}
                >
                  <Pencil className="w-3 h-3" />
                </button>
                {!badge.auto && (
                  <button
                    type="button"
                    data-ocid={`achievements.delete_button.${i + 1}`}
                    onClick={() => handleDelete(badge.id)}
                    className="p-1 rounded opacity-60 hover:opacity-100"
                    style={{ color: "oklch(0.5 0.15 25)" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EditAchievementInline({
  badge,
  onSave,
  onCancel,
}: {
  badge: Achievement;
  onSave: (icon: string, name: string, desc: string) => void;
  onCancel: () => void;
}) {
  const [icon, setIcon] = useState(badge.icon);
  const [name, setName] = useState(badge.name);
  const [desc, setDesc] = useState(badge.desc);
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        <Input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-12 rounded-lg border-0 text-center text-xs h-6 p-1"
          style={{ background: "oklch(0.92 0.02 75 / 0.6)" }}
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border-0 text-xs h-6 p-1"
          style={{ background: "oklch(0.92 0.02 75 / 0.6)" }}
        />
      </div>
      <Input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
        className="rounded-lg border-0 text-xs h-6 p-1"
        style={{ background: "oklch(0.92 0.02 75 / 0.6)" }}
      />
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onSave(icon, name, desc)}
          className="px-2 py-0.5 rounded text-xs"
          style={{ background: "oklch(0.5 0.18 155)", color: "white" }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-0.5 rounded text-xs"
          style={{
            background: "oklch(0.88 0.01 75 / 0.5)",
            color: "oklch(0.42 0.04 75)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
